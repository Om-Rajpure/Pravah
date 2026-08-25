"""
PRAVAAH Visitor Recommendation Engine
Phase 11 — Preference-Aware, Privacy-Safe, Scenario-Responsive Destination Guidance
"""

import logging
from typing import Dict, Any, List, Optional

from services.prediction_service import get_predictor
from services.network_service import get_network
from services.scenario_service import get_scenario_engine
from services.privacy_service import (
    aggregate_pressure_to_label,
    aggregate_network_status,
    to_public_destination_state,
    to_public_forecast,
    to_public_recommendation,
    PRESSURE_LEVEL_LABELS,
    K_ANONYMITY_THRESHOLD,
)

logger = logging.getLogger('pravaah.visitor')

# ─── Destination Registry ─────────────────────────────────────────────────────
# Maps visitor-facing destination IDs to internal zone/node IDs
DESTINATION_REGISTRY = {
    'lalbaugcha-raja':     {'zone_id': 'lalbaug',         'name': 'Lalbaugcha Raja',    'travel_time_min': 0,  'lat': 18.9956, 'lng': 72.8342},
    'gateway-of-india':   {'zone_id': 'colaba',           'name': 'Gateway of India',   'travel_time_min': 35, 'lat': 18.9220, 'lng': 72.8347},
    'marine-drive':        {'zone_id': 'marine-drive',     'name': 'Marine Drive',       'travel_time_min': 28, 'lat': 18.9435, 'lng': 72.8231},
    'dadar-market':        {'zone_id': 'dadar',            'name': 'Dadar Market',       'travel_time_min': 12, 'lat': 19.0178, 'lng': 72.8478},
    'siddhivinayak':       {'zone_id': 'prabhadevi',       'name': 'Siddhivinayak',      'travel_time_min': 18, 'lat': 19.0169, 'lng': 72.8302},
    'girgaon-chowpatty':   {'zone_id': 'girgaon',          'name': 'Girgaon Chowpatty',  'travel_time_min': 22, 'lat': 18.9548, 'lng': 72.8148},
    'juhu-beach':          {'zone_id': 'bandra',           'name': 'Juhu Beach',         'travel_time_min': 40, 'lat': 19.0948, 'lng': 72.8258},
    'bhuleshwar':          {'zone_id': 'bhuleshwar',       'name': 'Bhuleshwar Market',  'travel_time_min': 25, 'lat': 18.9498, 'lng': 72.8315},
    'curry-road-pandal':   {'zone_id': 'curry-road',       'name': 'Curry Road Pandal',  'travel_time_min': 8,  'lat': 18.9967, 'lng': 72.8323},
    'parel-village':       {'zone_id': 'parel',            'name': 'Parel Village',      'travel_time_min': 5,  'lat': 19.0006, 'lng': 72.8413},
}

PREFERENCE_WEIGHTS = {
    'LESS_CROWDED':      {'pressure': 1.0, 'travel_time': 0.3,  'disruption': 0.6},
    'FASTEST':           {'pressure': 0.3, 'travel_time': 1.0,  'disruption': 0.6},
    'AVOID_DISRUPTION':  {'pressure': 0.5, 'travel_time': 0.4,  'disruption': 1.0},
    'LOWER_TRAVEL_TIME': {'pressure': 0.3, 'travel_time': 1.0,  'disruption': 0.5},
}

# Travel time penalty: reject alternative if it costs >30 min more than requested destination
MAX_TRAVEL_TIME_PENALTY_MIN = 30
# Crowd improvement threshold: don't recommend alternative unless it's at least 1 level better
MIN_CROWD_IMPROVEMENT = 10  # in pressure points

CROWD_LEVEL_ORDER = {'LOW': 0, 'MODERATE': 1, 'HIGH': 2, 'CRITICAL': 3, 'UNKNOWN': 2}


class VisitorRecommendationEngine:
    """
    Preference-aware visitor recommendation engine.
    Consumes aggregated zone state from prediction, network, and scenario services.
    Never exposes individual visitor data.
    """

    def get_all_destinations(self) -> List[Dict[str, Any]]:
        """Returns public-safe list of all destinations with current crowd state."""
        predictor = get_predictor()
        preds = predictor.predict_all_zones()
        zone_map = {z['zone_id']: z for z in preds.get('zones', [])}

        destinations = []
        for dest_id, info in DESTINATION_REGISTRY.items():
            zone = zone_map.get(info['zone_id'], {})
            pressure = zone.get('current_pressure', 50.0)
            crowd_level = aggregate_pressure_to_label(pressure)
            destinations.append({
                'destination_id': dest_id,
                'name':           info['name'],
                'crowd_level':    crowd_level,
                'crowd_label':    PRESSURE_LEVEL_LABELS.get(crowd_level, ''),
                'crowd_index':    round(pressure),
                'travel_time_min': info['travel_time_min'],
                'travel_status':  'OPEN',
                'lat':            info['lat'],
                'lng':            info['lng'],
                'data_label':     'SIMULATED · AGGREGATED',
            })
        return destinations

    def get_destination_detail(self, destination_id: str) -> Optional[Dict[str, Any]]:
        """
        Returns detailed public-safe profile for one destination.
        Includes crowd forecast and best-time suggestion.
        """
        info = DESTINATION_REGISTRY.get(destination_id)
        if not info:
            return None

        predictor = get_predictor()
        preds = predictor.predict_all_zones()
        zone_map = {z['zone_id']: z for z in preds.get('zones', [])}
        zone = zone_map.get(info['zone_id'], {})

        pressure = zone.get('current_pressure', 50.0)
        crowd_level = aggregate_pressure_to_label(pressure)
        predictions = zone.get('predictions', [])

        public_forecast = to_public_forecast(predictions)

        # Best time: find first horizon where level drops meaningfully
        best_time = self._find_best_time(pressure, predictions)

        # Check for active scenario disruption
        scenario_engine = get_scenario_engine()
        scenario_state = scenario_engine.get_current_scenario()
        disruption_notice = None
        if scenario_state.get('active_scenario_id'):
            disruption_notice = {
                'scenario_name': scenario_state.get('scenario_name', 'Active disruption'),
                'message':       'Travel conditions may be affected. Allow extra time.',
            }

        return {
            'destination_id':   destination_id,
            'name':             info['name'],
            'crowd_level':      crowd_level,
            'crowd_label':      PRESSURE_LEVEL_LABELS.get(crowd_level, ''),
            'crowd_index':      round(pressure),
            'status':           self._crowd_to_status(crowd_level),
            'travel_time_min':  info['travel_time_min'],
            'travel_status':    'OPEN',
            'forecast':         public_forecast,
            'best_time':        best_time,
            'disruption_notice': disruption_notice,
            'data_label':       'SIMULATED · AGGREGATED',
            'updated_at':       preds.get('forecast_time', '18:00'),
            'lat':              info['lat'],
            'lng':              info['lng'],
        }

    def get_recommendation(
        self,
        destination_id: str,
        preference: str = 'LESS_CROWDED',
    ) -> Dict[str, Any]:
        """
        Returns a visitor recommendation: either the selected destination is fine,
        or a better alternative is suggested.
        Never exposes dosage, internal scores, or operator decisions.
        """
        predictor = get_predictor()
        preds = predictor.predict_all_zones()
        zone_map = {z['zone_id']: z for z in preds.get('zones', [])}

        # Resolve selected destination
        selected_info = DESTINATION_REGISTRY.get(destination_id)
        if not selected_info:
            return {'error': f'Destination {destination_id} not found'}

        selected_zone = zone_map.get(selected_info['zone_id'], {})
        selected_pressure = selected_zone.get('current_pressure', 50.0)
        selected_crowd = aggregate_pressure_to_label(selected_pressure)

        # Check active scenario for disruption
        scenario_engine = get_scenario_engine()
        scenario_state = scenario_engine.get_current_scenario()
        active_scenario = scenario_state.get('active_scenario_id')

        # Build candidate list
        candidates = self._score_alternatives(
            destination_id, preference, zone_map, active_scenario
        )

        # Decision: only recommend alternative if it's meaningfully better
        best = candidates[0] if candidates else None
        recommendation_type = 'CURRENT'
        recommended = None

        if best and best['dest_id'] != destination_id:
            pressure_diff = selected_pressure - best['pressure']
            time_penalty  = best['travel_time_min'] - selected_info['travel_time_min']

            # Only suggest if crowd improvement is meaningful and travel time is acceptable
            if pressure_diff >= MIN_CROWD_IMPROVEMENT and time_penalty <= MAX_TRAVEL_TIME_PENALTY_MIN:
                recommendation_type = 'ALTERNATIVE'
                recommended = best

        if recommendation_type == 'CURRENT':
            # Offer "best time" as alternative if all options are busy
            detail = self.get_destination_detail(destination_id)
            all_busy = all(
                CROWD_LEVEL_ORDER.get(c['crowd_level'], 2) >= 2
                for c in self.get_all_destinations()
            )
            return {
                'recommendation_type': 'CURRENT',
                'destination_id':      destination_id,
                'name':                selected_info['name'],
                'crowd_level':         selected_crowd,
                'crowd_label':         PRESSURE_LEVEL_LABELS.get(selected_crowd, ''),
                'crowd_index':         round(selected_pressure),
                'travel_time_min':     selected_info['travel_time_min'],
                'travel_status':       'OPEN',
                'why':                 self._build_why_current(selected_crowd, active_scenario),
                'best_time':           detail.get('best_time') if detail else None,
                'all_areas_busy':      all_busy,
                'disruption_notice':   detail.get('disruption_notice') if detail else None,
                'data_label':          'SIMULATED · AGGREGATED',
                'updated_at':          preds.get('forecast_time', '18:00'),
            }
        else:
            return {
                'recommendation_type': 'ALTERNATIVE',
                'original_destination': {
                    'destination_id': destination_id,
                    'name':           selected_info['name'],
                    'crowd_level':    selected_crowd,
                    'crowd_label':    PRESSURE_LEVEL_LABELS.get(selected_crowd, ''),
                },
                'destination_id':  recommended['dest_id'],
                'name':            recommended['name'],
                'crowd_level':     recommended['crowd_level'],
                'crowd_label':     PRESSURE_LEVEL_LABELS.get(recommended['crowd_level'], ''),
                'crowd_index':     round(recommended['pressure']),
                'travel_time_min': recommended['travel_time_min'],
                'travel_status':   'OPEN' if not recommended.get('disrupted') else 'SLOW',
                'why':             self._build_why_alternative(
                    recommended, preference, selected_pressure, active_scenario
                ),
                'data_label':      'SIMULATED · AGGREGATED',
                'updated_at':      preds.get('forecast_time', '18:00'),
            }

    # ─── Internal Helpers ──────────────────────────────────────────────────────

    def _score_alternatives(
        self,
        origin_id: str,
        preference: str,
        zone_map: Dict[str, Any],
        active_scenario: Optional[str],
    ) -> List[Dict[str, Any]]:
        """Scores all destinations by preference; returns sorted list."""
        weights = PREFERENCE_WEIGHTS.get(preference, PREFERENCE_WEIGHTS['LESS_CROWDED'])
        scored = []

        for dest_id, info in DESTINATION_REGISTRY.items():
            zone = zone_map.get(info['zone_id'], {})
            pressure = zone.get('current_pressure', 50.0)
            crowd_level = aggregate_pressure_to_label(pressure)
            travel_time = info['travel_time_min']

            # Disruption penalty: scenario-affected areas get higher effective travel time
            disrupted = False
            disruption_penalty = 0
            if active_scenario and self._is_disrupted(dest_id, active_scenario):
                disruption_penalty = 25
                disrupted = True

            # Score: lower is better
            # Normalize: pressure/100, travel_time/60, disruption 0 or 1
            score = (
                weights['pressure']      * (pressure / 100.0) +
                weights['travel_time']   * ((travel_time + disruption_penalty) / 60.0) +
                weights['disruption']    * (1.0 if disrupted else 0.0)
            )

            scored.append({
                'dest_id':         dest_id,
                'name':            info['name'],
                'pressure':        pressure,
                'crowd_level':     crowd_level,
                'travel_time_min': travel_time,
                'disrupted':       disrupted,
                'score':           round(score, 4),
            })

        scored.sort(key=lambda x: x['score'])
        return scored

    def _is_disrupted(self, dest_id: str, scenario_id: str) -> bool:
        """Checks if a destination is likely affected by the active scenario."""
        affected = {
            'central-line-disruption': ['curry-road-pandal', 'lalbaugcha-raja', 'parel-village'],
            'heavy-rain':              ['gateway-of-india', 'girgaon-chowpatty', 'marine-drive'],
            'road-closure':            ['parel-village', 'curry-road-pandal'],
        }
        return dest_id in affected.get(scenario_id, [])

    def _find_best_time(self, current_pressure: float, predictions: List[Dict]) -> Optional[Dict]:
        """Returns the first forecast horizon with meaningfully lower pressure."""
        for pred in predictions:
            future_p = pred.get('predicted_pressure', current_pressure)
            if (current_pressure - future_p) >= MIN_CROWD_IMPROVEMENT:
                crowd = aggregate_pressure_to_label(future_p)
                return {
                    'horizon_label':  pred.get('horizon_label', ''),
                    'horizon_minutes': pred.get('horizon_minutes', 60),
                    'crowd_level':    crowd,
                    'message': f"Consider visiting {pred.get('horizon_label', 'later')} — expected crowd is lower.",
                }
        return None

    def _crowd_to_status(self, crowd_level: str) -> str:
        return {'LOW': 'OPEN', 'MODERATE': 'OPEN', 'HIGH': 'BUSY',
                'CRITICAL': 'VERY BUSY', 'UNKNOWN': 'UNAVAILABLE'}.get(crowd_level, 'OPEN')

    def _build_why_current(self, crowd_level: str, scenario: Optional[str]) -> List[str]:
        reasons = []
        if crowd_level in ('LOW', 'MODERATE'):
            reasons.append('This area has manageable crowd levels.')
        else:
            reasons.append('This area is currently busy, but remains the closest option.')
        if scenario:
            reasons.append('There is an active disruption in the city — allow extra travel time.')
        return reasons

    def _build_why_alternative(
        self,
        rec: Dict,
        preference: str,
        original_pressure: float,
        scenario: Optional[str]
    ) -> List[str]:
        reasons = []
        pressure_saving = original_pressure - rec['pressure']
        if preference == 'LESS_CROWDED' and pressure_saving >= MIN_CROWD_IMPROVEMENT:
            reasons.append(f"Lower expected crowd (approx. {round(pressure_saving)} pts less busy).")
        if preference == 'FASTEST':
            reasons.append('Shorter estimated travel time.')
        if preference == 'AVOID_DISRUPTION':
            reasons.append('Route is less likely to be affected by the current disruption.')
        reasons.append('Route to this destination is currently operational.')
        if scenario and not rec.get('disrupted'):
            reasons.append('Expected to be less affected by the active disruption.')
        return reasons


# ─── Singleton ────────────────────────────────────────────────────────────────
_global_visitor_engine: Optional[VisitorRecommendationEngine] = None

def get_visitor_engine() -> VisitorRecommendationEngine:
    global _global_visitor_engine
    if _global_visitor_engine is None:
        _global_visitor_engine = VisitorRecommendationEngine()
    return _global_visitor_engine
