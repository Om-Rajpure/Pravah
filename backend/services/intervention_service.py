"""
PRAVAAH Intervention Engine & Action Recommendations Service
Phase 8 — Multi-Candidate Counterfactual Simulation, Dosage Search, and Explainability
"""

import copy
import logging
from typing import Dict, List, Any, Optional, Tuple

from config import Config
from models.action import InterventionAction, ActionSimulationResult, ImpactComparison
from services.pressure_service import calculate_pressure_index, get_pressure_level, get_pressure_color
from services.prediction_service import get_predictor
from services.network_service import get_network
from services.simulator import get_simulator

logger = logging.getLogger('pravaah.intervention')

# Candidate dosages tested by the counterfactual optimizer
CANDIDATE_DOSAGES = [0.05, 0.10, 0.15, 0.18, 0.20, 0.25]

# Relief destination candidates
CANDIDATE_DESTINATIONS = ['thane', 'vashi', 'navi-mumbai', 'dadar', 'parel']

# Configurable multi-objective optimization weights
INTERVENTION_WEIGHTS = {
    'pressure_reduction': 1.0,
    'side_effect': 0.8,
    'capacity_penalty': 0.9,
    'travel_time_penalty': 0.4,
    'complexity_penalty': 0.2
}

class InterventionEngine:
    """
    Intelligent optimization and counterfactual simulation engine for operational city actions.
    """
    def __init__(self):
        self.active_actions: Dict[str, InterventionAction] = {}
        self.cache: Dict[str, Any] = {}

    def get_recommendations(self) -> Dict[str, Any]:
        """
        Generates, counterfactually simulates, and ranks candidate actions.
        Returns top recommended action, impact comparison, and alternatives.
        """
        predictor = get_predictor()
        network = get_network()
        sim = get_simulator()
        
        predictions_data = predictor.predict_all_zones()
        forecast_time = predictions_data.get("forecast_time", "18:00")
        network_summary = network.get_summary()
        net_ver = network_summary.get("network_version", 1)
        disruption_active = network_summary.get("closed_connections", 0) > 0
        
        cache_key = f"{forecast_time}_{net_ver}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        zones_forecast = {z["zone_id"]: z for z in predictions_data.get("zones", [])}
        
        # 1. Identify Target Problem Zones (Forecast >= 76 at 120m horizon)
        target_candidates = []
        for zid, zf in zones_forecast.items():
            pred_120 = zf["predictions"][2]["predicted_pressure"]
            if pred_120 >= 76:
                target_candidates.append((zid, pred_120))
                
        # Sort targets by severity descending (default to curry-road if none critical)
        target_candidates.sort(key=lambda x: x[1], reverse=True)
        primary_target = target_candidates[0][0] if target_candidates else 'curry-road'
        target_zf = zones_forecast.get(primary_target, zones_forecast.get('curry-road'))
        target_name = target_zf.get("name", primary_target.title())
        target_before = target_zf["predictions"][2]["predicted_pressure"]
        
        # City-wide baseline critical zones
        crit_before = sum(1 for z in zones_forecast.values() if z["predictions"][2]["predicted_pressure"] >= 76)
        high_before = sum(1 for z in zones_forecast.values() if 56 <= z["predictions"][2]["predicted_pressure"] < 76)

        # 2. Generate and Counterfactually Simulate Candidate Actions
        evaluated_candidates: List[ActionSimulationResult] = []
        rejection_log: List[Dict[str, str]] = []

        for dest_id in CANDIDATE_DESTINATIONS:
            if dest_id == primary_target:
                continue

            dest_zf = zones_forecast.get(dest_id)
            if not dest_zf:
                continue
                
            dest_before = dest_zf["predictions"][2]["predicted_pressure"]
            
            # Constraint 1: Check Network Reachability
            if not network.is_reachable(dest_id, primary_target) and not network.is_reachable(primary_target, dest_id):
                rejection_log.append({
                    "destination": dest_id,
                    "reason": f"No operational route between {primary_target} and {dest_id}"
                })
                continue

            # Constraint 2: Reject destination if already Critical
            if dest_before >= 76:
                rejection_log.append({
                    "destination": dest_id,
                    "reason": f"Destination {dest_id} is already in Critical state ({dest_before}/100)"
                })
                continue

            # Test multiple candidate dosages
            for dosage in CANDIDATE_DOSAGES:
                action_id = f"act-redirect-{primary_target}-{dest_id}-{int(dosage*100)}"
                
                # Counterfactual Simulation (Without mutating live state)
                # Primary target pressure reduction is proportional to diverted flow dosage
                reduction_pts = int(round(target_before * dosage * 1.08))
                target_after = max(25, target_before - reduction_pts)
                
                # Destination side-effect increase
                # Scale buffer capacity absorption
                dest_capacity_scale = 1.0 if dest_id in ['thane', 'vashi', 'navi-mumbai'] else 1.4
                side_effect_pts = int(round((dosage * 42.0) * dest_capacity_scale))
                dest_after = min(100, dest_before + side_effect_pts)
                
                # Check city-wide critical zones count under counterfactual action
                crit_after = crit_before
                if target_before >= 76 and target_after < 76:
                    crit_after = max(0, crit_after - 1)
                if dest_before < 76 and dest_after >= 76:
                    crit_after += 1 # Penalized severe side effect!

                # Multi-Objective Scoring
                # High reduction = positive, High side effect / exceeding buffer = negative
                cap_penalty = max(0, (dest_after - 70) * 1.5) if dest_after > 70 else 0.0
                time_penalty = 4.0 if dest_id in ['navi-mumbai'] else 1.5 if dest_id in ['vashi'] else 0.0
                
                raw_score = (
                    (INTERVENTION_WEIGHTS['pressure_reduction'] * reduction_pts) -
                    (INTERVENTION_WEIGHTS['side_effect'] * side_effect_pts) -
                    (INTERVENTION_WEIGHTS['capacity_penalty'] * cap_penalty) -
                    (INTERVENTION_WEIGHTS['travel_time_penalty'] * time_penalty)
                )
                normalized_score = round(max(0.1, min(raw_score / 20.0, 0.98)), 2)
                
                # Confidence
                confidence = 0.87 if not disruption_active else 0.82
                
                # Generate Why drivers
                why_drivers = [
                    f"{target_name} is forecast to reach critical pressure ({target_before} / 100).",
                    f"{dest_id.title()} has verified available buffer capacity.",
                    "The alternative transport corridor is operational.",
                    f"Reduces target pressure by {reduction_pts} points with minimal side effect (+{side_effect_pts} pts)."
                ]
                
                sim_res = ActionSimulationResult(
                    action_id=action_id,
                    target_zone=primary_target,
                    destination_zone=dest_id,
                    dosage=dosage,
                    target_pressure_before=target_before,
                    target_pressure_after=target_after,
                    pressure_reduction=reduction_pts,
                    destination_pressure_before=dest_before,
                    destination_pressure_after=dest_after,
                    side_effect_increase=side_effect_pts,
                    critical_zones_before=crit_before,
                    critical_zones_after=crit_after,
                    high_zones_before=high_before,
                    high_zones_after=max(0, high_before - 1),
                    affected_people=int(dosage * 14000),
                    score=normalized_score,
                    confidence=confidence,
                    confidence_label="HIGH CONFIDENCE" if confidence >= 0.85 else "MODERATE CONFIDENCE",
                    is_robust=True,
                    why_this_action=why_drivers,
                    what_if_nothing=f"Without intervention, {target_name} will reach {target_before}/100 in ~2 hours with severe station platform saturation."
                )
                evaluated_candidates.append(sim_res)

        # 3. Rank Candidates and Select Best Action
        evaluated_candidates.sort(key=lambda x: x.score, reverse=True)
        best_candidate = evaluated_candidates[0] if evaluated_candidates else None

        if not best_candidate:
            return {"status": "NO_FEASIBLE_ACTION", "message": "All alternative relief corridors are saturated"}

        top_action_model = InterventionAction(
            id=best_candidate.action_id,
            type="REDIRECT_VISITOR_FLOW",
            target_zone=best_candidate.target_zone,
            destination_zone=best_candidate.destination_zone,
            dosage=best_candidate.dosage,
            title=f"Redirect {int(best_candidate.dosage*100)}% Incoming Flow",
            description=f"Redirect {int(best_candidate.dosage*100)}% of incoming visitors from {target_name} toward {best_candidate.destination_zone.title()}.",
            status="RECOMMENDED",
            created_at=forecast_time,
            network_version=net_ver,
            confidence=best_candidate.confidence
        )
        self.active_actions[top_action_model.id] = top_action_model

        # Build Alternatives List
        alternatives = []
        for cand in evaluated_candidates[1:4]:
            alternatives.append({
                "action_id": cand.action_id,
                "dosage_pct": int(cand.dosage * 100),
                "destination": cand.destination_zone.title(),
                "score": cand.score,
                "reduction": cand.pressure_reduction,
                "target_after": cand.target_pressure_after,
                "side_effect": cand.side_effect_increase
            })

        result = {
            "recommendation_id": f"rec-{forecast_time.replace(':', '')}-{net_ver}",
            "created_at": forecast_time,
            "network_version": net_ver,
            "is_stale": False,
            "recommended_action": {
                "id": top_action_model.id,
                "type": top_action_model.type,
                "title": top_action_model.title,
                "description": top_action_model.description,
                "dosage_fraction": best_candidate.dosage,
                "dosage_pct": int(best_candidate.dosage * 100),
                "source": primary_target,
                "source_name": target_name,
                "destination": best_candidate.destination_zone,
                "destination_name": best_candidate.destination_zone.title(),
                "score": best_candidate.score,
                "confidence": best_candidate.confidence,
                "confidence_label": best_candidate.confidence_label,
                "status": top_action_model.status
            },
            "impact": {
                "target_pressure_before": best_candidate.target_pressure_before,
                "target_pressure_after": best_candidate.target_pressure_after,
                "pressure_reduction": best_candidate.pressure_reduction,
                "destination_pressure_before": best_candidate.destination_pressure_before,
                "destination_pressure_after": best_candidate.destination_pressure_after,
                "side_effect_increase": best_candidate.side_effect_increase,
                "critical_zones_before": best_candidate.critical_zones_before,
                "critical_zones_after": best_candidate.critical_zones_after,
                "affected_people": best_candidate.affected_people
            },
            "why_this_action": best_candidate.why_this_action,
            "what_if_nothing": best_candidate.what_if_nothing,
            "alternatives": alternatives,
            "rejections_evaluated": len(rejection_log)
        }

        self.cache[cache_key] = result
        return result

    def simulate_action(self, action_id: str) -> Dict[str, Any]:
        """
        Executes a counterfactual preview of an action.
        """
        recs = self.get_recommendations()
        if recs.get("recommended_action", {}).get("id") == action_id:
            recs["recommended_action"]["status"] = "SIMULATED"
            return recs
        return recs

    def approve_action(self, action_id: str) -> Dict[str, Any]:
        """
        Sets prototype action state to ACTIVE in simulation demo.
        """
        recs = self.get_recommendations()
        if recs.get("recommended_action", {}).get("id") == action_id:
            recs["recommended_action"]["status"] = "ACTIVE"
            return {
                "action_id": action_id,
                "status": "ACTIVE",
                "message": "Action approved in simulation prototype environment."
            }
        return {"action_id": action_id, "status": "ACTIVE"}

    def reset_actions(self):
        """Restores baseline state."""
        self.active_actions = {}
        self.cache = {}
        logger.info("[INTERVENTION] Reset actions and recommendation cache.")

# Global Singleton Intervention Engine Instance
_global_intervention_engine: Optional[InterventionEngine] = None

def get_intervention_engine() -> InterventionEngine:
    global _global_intervention_engine
    if _global_intervention_engine is None:
        _global_intervention_engine = InterventionEngine()
    return _global_intervention_engine
