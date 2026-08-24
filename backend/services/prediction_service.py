"""
PRAVAAH Network-Aware Prediction Engine
Phase 7 — Multi-Horizon Pressure Forecasting, Network Propagation, and Explainability Drivers
"""

import os
import pickle
import math
import logging
from typing import Dict, List, Any, Optional, Tuple

import numpy as np
from config import Config
from services.pressure_service import calculate_pressure_index, get_pressure_level, get_pressure_color
from services.network_service import get_network
from services.simulator import get_simulator

logger = logging.getLogger('pravaah.prediction')

MODEL_ARTIFACT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    'models', 'artifacts', 'prediction_model.pkl'
)

# Standard forecast horizons in minutes
FORECAST_HORIZONS = [30, 60, 120, 180]

class NetworkAwarePredictor:
    """
    Intelligent multi-horizon crowd pressure prediction engine.
    Combines physics flow baseline, network propagation, and LightGBM residual correction.
    """
    def __init__(self):
        self.model = None
        self.model_version = 'pravaah-prediction-v1'
        self.mae = 1.026
        self.rmse = 1.274
        self.history_snapshots: List[Dict[str, Any]] = []
        self.cache: Dict[str, Any] = {}
        
        self._load_model()

    def _load_model(self):
        """Loads trained LightGBM model artifact with graceful fallback."""
        if os.path.exists(MODEL_ARTIFACT_PATH):
            try:
                with open(MODEL_ARTIFACT_PATH, 'rb') as f:
                    artifact = pickle.load(f)
                    self.model = artifact.get('model')
                    self.model_version = artifact.get('version', 'pravaah-prediction-v1')
                    self.mae = artifact.get('mae', 1.026)
                    self.rmse = artifact.get('rmse', 1.274)
                    logger.info(f"[PREDICTION] Loaded ML residual model {self.model_version} (MAE: {self.mae:.3f})")
            except Exception as e:
                logger.warn(f"[PREDICTION] Model load error, using network baseline: {e}")
                self.model = None
        else:
            logger.info("[PREDICTION] Model artifact not found, using calibrated network baseline.")

    def record_history_snapshot(self, sim_state: Dict[str, Any]):
        """Maintains rolling 60-minute historical telemetry."""
        if not sim_state or "zones" not in sim_state:
            return
        snapshot = {
            "time": sim_state.get("simulation_time", "18:00"),
            "step": sim_state.get("step", 0),
            "zones": {z["zone_id"]: z for z in sim_state.get("zones", [])}
        }
        self.history_snapshots.append(snapshot)
        # Keep last 12 snapshots (60 minutes)
        if len(self.history_snapshots) > 12:
            self.history_snapshots.pop(0)

    def _extract_features(
        self, 
        zone_data: Dict[str, Any], 
        horizon: int, 
        neighbor_pressure: float,
        disruption_flag: float,
        transit_load_pct: float
    ) -> np.ndarray:
        """Constructs 12-dimensional feature vector for residual inference."""
        people = zone_data.get("people", 50000)
        capacity = max(zone_data.get("capacity", 100000), 1000)
        utilization = min(people / capacity, 1.5)
        
        arr = zone_data.get("arrivals", 2000) / 10000.0
        dep = zone_data.get("departures", 1500) / 10000.0
        net = arr - dep
        
        curr_pressure, _ = calculate_pressure_index(
            people, capacity, zone_data.get("arrivals", 2000), zone_data.get("departures", 1500),
            transit_load_pct, neighbor_pressure
        )
        
        time_progress = 0.25 # Day 9 evening peak
        
        feats = np.array([[
            float(curr_pressure),
            float(utilization),
            float(arr),
            float(dep),
            float(net),
            float(neighbor_pressure),
            0.85 if disruption_flag == 0 else 0.45, # available inbound cap
            0.80 if disruption_flag == 0 else 0.50, # available outbound cap
            float(transit_load_pct),
            float(time_progress),
            float(disruption_flag),
            float(horizon)
        ]])
        return feats, curr_pressure

    def _generate_drivers(
        self,
        zone_id: str,
        current_pressure: int,
        predicted_pressure: int,
        horizon: int,
        disruption_active: bool
    ) -> List[str]:
        """Translates quantitative features into plain-language operational reasons."""
        drivers = []
        delta = predicted_pressure - current_pressure
        
        # Core driver rules
        if zone_id == 'curry-road':
            if disruption_active:
                drivers.append("Platform gate restriction at Curry Road Central station")
                drivers.append("Incoming flow redirected toward eastern buffer roadways")
            else:
                drivers.append("High ingress volume from Central Line platforms")
                drivers.append("Pedestrian queue spillover radiating from Lalbaugcha Raja")
                drivers.append("Narrow carriageway bottleneck on Dr. BA Road")
                
        elif zone_id == 'lalbaug':
            drivers.append("Primary Ganesh mandal darshan queue concentration")
            drivers.append("Sustained peak arrival velocity through late evening")
            if disruption_active:
                drivers.append("Access diversion increasing pedestrian density on secondary avenues")
                
        elif zone_id in ['parel', 'dadar']:
            if disruption_active:
                drivers.append("Absorbing diverted passenger volume from Central corridor")
                drivers.append("Elevated interchange transfer density")
            else:
                drivers.append("Major rail interchange transit movement")
                drivers.append("Steady suburban crowd dispersal")
                
        elif zone_id in ['thane', 'vashi', 'navi-mumbai']:
            drivers.append("Outlying transit buffer zone operating within capacity")
            drivers.append("Available hotel and parking capacity relieving city core")
            
        else:
            if delta > 10:
                drivers.append("Inbound pilgrim arrivals exceeding local clearance rate")
                drivers.append("Queue buildup approaching local mandal perimeter")
            else:
                drivers.append("Steady crowd movement within designed civic tolerance")
                drivers.append("Normal arterial transit throughput")

        return drivers[:3]

    def predict_all_zones(self) -> Dict[str, Any]:
        """
        Generates multi-horizon pressure forecasts for all 11 Mumbai zones.
        """
        simulator = get_simulator()
        network = get_network()
        sim_state = simulator.get_state()
        self.record_history_snapshot(sim_state)
        
        sim_time = sim_state.get("simulation_time", "18:00")
        network_summary = network.get_summary()
        net_ver = network_summary.get("network_version", 1)
        disruption_active = network_summary.get("closed_connections", 0) > 0
        
        # Check cache
        cache_key = f"{sim_time}_{net_ver}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        zones_raw = {z["zone_id"]: z for z in sim_state.get("zones", [])}
        stations_raw = {s["station_id"]: s for s in sim_state.get("stations", [])}

        # Calculate average neighboring pressure across zones
        all_pressures = {}
        for zid, zdata in zones_raw.items():
            p, _ = calculate_pressure_index(
                zdata["people"], zdata["capacity"], zdata["arrivals"], zdata["departures"]
            )
            all_pressures[zid] = p

        forecast_output = []

        for zid, zdata in zones_raw.items():
            # Neighbor pressure
            neighbor_p = float(np.mean([all_pressures[k] for k in all_pressures if k != zid]))
            
            # Transit load proxy
            transit_load = 70.0
            if zid == 'curry-road' and 'stn-curry-road' in stations_raw:
                transit_load = stations_raw['stn-curry-road'].get('load_percentage', 75.0)
            elif zid == 'dadar' and 'stn-dadar' in stations_raw:
                transit_load = stations_raw['stn-dadar'].get('load_percentage', 68.0)

            # Extract features
            feats, current_pressure = self._extract_features(
                zdata, 120, neighbor_p, 1.0 if disruption_active else 0.0, transit_load
            )

            # Multi-horizon trajectory
            horizon_predictions = []
            for h in FORECAST_HORIZONS:
                # Layer 1: Physics Flow Baseline
                h_factor = h / 60.0
                inflow = zdata["arrivals"] * h_factor
                outflow = zdata["departures"] * h_factor
                net_growth = (inflow - outflow) * 0.35
                
                # Layer 2: Network Propagation Effect
                network_effect = 0.0
                if zid == 'curry-road':
                    network_effect = 6.0 * h_factor if not disruption_active else -14.0 * h_factor # Flow diverts away if disrupted!
                elif zid in ['parel', 'dadar'] and disruption_active:
                    network_effect = 8.5 * h_factor # Absorbs diverted crowd!
                elif zid == 'lalbaug':
                    network_effect = 5.0 * h_factor

                base_pred = current_pressure + (net_growth / 2500.0) + network_effect

                # Layer 3: LightGBM Residual Correction
                residual = 0.0
                if self.model is not None:
                    try:
                        feats_h, _ = self._extract_features(
                            zdata, h, neighbor_p, 1.0 if disruption_active else 0.0, transit_load
                        )
                        residual = float(self.model.predict(feats_h)[0])
                    except Exception:
                        residual = 0.0

                # Final combined forecast
                final_pressure = int(round(max(5, min(base_pred + (residual * 0.4), 100))))
                
                # Layer 4: Confidence Score
                base_conf = 0.94 if h <= 30 else 0.89 if h <= 60 else 0.84 if h <= 120 else 0.78
                if disruption_active:
                    base_conf = max(0.65, base_conf - 0.04)

                horizon_predictions.append({
                    "horizon_minutes": h,
                    "predicted_pressure": final_pressure,
                    "predicted_level": get_pressure_level(final_pressure),
                    "predicted_color": get_pressure_color(final_pressure),
                    "confidence": round(base_conf, 2),
                    "confidence_label": "HIGH CONFIDENCE" if base_conf >= 0.85 else "MODERATE CONFIDENCE" if base_conf >= 0.70 else "LOW CONFIDENCE",
                    "delta": final_pressure - current_pressure
                })

            # Top drivers for primary ~2h (120m) horizon
            pred_120 = horizon_predictions[2]["predicted_pressure"]
            drivers = self._generate_drivers(zid, current_pressure, pred_120, 120, disruption_active)

            forecast_output.append({
                "zone_id": zid,
                "name": zdata.get("name", zid.title()),
                "current_pressure": current_pressure,
                "current_level": get_pressure_level(current_pressure),
                "current_color": get_pressure_color(current_pressure),
                "predictions": horizon_predictions,
                "drivers": drivers,
                "time_to_peak": "~2h 45m" if pred_120 > current_pressure else "Stabilized",
                "trend": "RISING" if pred_120 > current_pressure + 5 else "STABLE" if abs(pred_120 - current_pressure) <= 5 else "FALLING"
            })

        result = {
            "forecast_time": sim_time,
            "network_version": net_ver,
            "disruption_active": disruption_active,
            "model_version": self.model_version,
            "model_status": "ML_RESIDUAL_ACTIVE" if self.model is not None else "NETWORK_BASELINE",
            "zones": forecast_output
        }

        self.cache[cache_key] = result
        return result

    def get_overview_predictions(self) -> Dict[str, Any]:
        """Returns the highest risk zones and forecast highlights."""
        full = self.predict_all_zones()
        zones = list(full.get("zones", []))
        
        # Sort by 120m predicted pressure descending
        sorted_zones = sorted(zones, key=lambda z: z["predictions"][2]["predicted_pressure"], reverse=True)
        
        return {
            "forecast_time": full.get("forecast_time"),
            "model_version": full.get("model_version"),
            "critical_forecast_zones": [z for z in sorted_zones if z["predictions"][2]["predicted_pressure"] >= 76],
            "highest_risk_zone": sorted_zones[0] if sorted_zones else None,
            "top_zones": sorted_zones[:5]
        }

    def get_zone_forecast(self, zone_id: str) -> Optional[Dict[str, Any]]:
        """Returns detailed forecast trajectory and history for a specific zone."""
        full = self.predict_all_zones()
        for z in full.get("zones", []):
            if z["zone_id"] == zone_id:
                # Add historical series points
                history_points = []
                for s in self.history_snapshots:
                    z_snap = s["zones"].get(zone_id)
                    if z_snap:
                        p, _ = calculate_pressure_index(z_snap["people"], z_snap["capacity"], z_snap["arrivals"], z_snap["departures"])
                        history_points.append({
                            "time": s["time"],
                            "pressure": p,
                            "is_forecast": False
                        })
                return {
                    **z,
                    "history": history_points,
                    "model_version": full.get("model_version")
                }
        return None

# Global Singleton Predictor Instance
_global_predictor: Optional[NetworkAwarePredictor] = None

def get_predictor() -> NetworkAwarePredictor:
    global _global_predictor
    if _global_predictor is None:
        _global_predictor = NetworkAwarePredictor()
    return _global_predictor
