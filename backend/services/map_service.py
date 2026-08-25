"""
PRAVAAH Map Service
Provides unified geographic state, live simulation telemetry, multi-horizon predictions,
dynamic network topology, disruption scenarios, and counterfactual intervention layers
for MapLibre GL JS visualization.
"""

import logging
from typing import Dict, Any, List
from data.db import query_all
from services.network_service import get_network
from services.prediction_service import get_predictor
from services.scenario_service import get_scenario_engine
from services.intervention_service import get_intervention_engine

logger = logging.getLogger('pravaah.map')

# Authentic polygon boundaries for Mumbai operational zones [lng, lat]
ZONE_BOUNDARIES = {
    "south-mumbai": [
        [72.8200, 18.9150], [72.8420, 18.9150], [72.8460, 18.9480],
        [72.8330, 18.9520], [72.8200, 18.9320], [72.8200, 18.9150]
    ],
    "girgaon": [
        [72.8060, 18.9460], [72.8240, 18.9480], [72.8250, 18.9660],
        [72.8090, 18.9660], [72.8060, 18.9460]
    ],
    "byculla": [
        [72.8220, 18.9660], [72.8420, 18.9660], [72.8410, 18.9840],
        [72.8220, 18.9840], [72.8220, 18.9660]
    ],
    "curry-road": [
        [72.8240, 18.9860], [72.8390, 18.9860], [72.8390, 19.0020],
        [72.8240, 19.0020], [72.8240, 18.9860]
    ],
    "lalbaug": [
        [72.8310, 18.9830], [72.8460, 18.9830], [72.8460, 18.9990],
        [72.8310, 18.9990], [72.8310, 18.9830]
    ],
    "parel": [
        [72.8340, 18.9940], [72.8520, 18.9940], [72.8520, 19.0120],
        [72.8340, 19.0120], [72.8340, 18.9940]
    ],
    "dadar": [
        [72.8330, 19.0100], [72.8580, 19.0100], [72.8580, 19.0340],
        [72.8330, 19.0340], [72.8330, 19.0100]
    ],
    "andheri": [
        [72.8280, 19.1020], [72.8650, 19.1020], [72.8650, 19.1350],
        [72.8280, 19.1350], [72.8280, 19.1020]
    ],
    "thane": [
        [72.9520, 19.1920], [72.9980, 19.1920], [72.9980, 19.2380],
        [72.9520, 19.2380], [72.9520, 19.1920]
    ],
    "vashi": [
        [72.9780, 19.0580], [73.0180, 19.0580], [73.0180, 19.0960],
        [72.9780, 19.0960], [72.9780, 19.0580]
    ],
    "navi-mumbai": [
        [73.0080, 19.0120], [73.0580, 19.0120], [73.0580, 19.0550],
        [73.0080, 19.0550], [73.0080, 19.0120]
    ]
}

# Major Railway Corridor Lines [lng, lat]
RAILWAY_LINES = [
    {
        "id": "line-central",
        "name": "Central Railway Mainline",
        "color": "#2468B8",
        "coordinates": [
            [72.8354, 18.9400], # CSMT
            [72.8320, 18.9750], # Byculla
            [72.8322, 18.9880], # Chinchpokli
            [72.8329, 18.9944], # Curry Road
            [72.8415, 18.9982], # Parel
            [72.8478, 19.0178], # Dadar
            [72.9781, 19.2183]  # Thane
        ]
    },
    {
        "id": "line-western",
        "name": "Western Railway Corridor",
        "color": "#2D9C8F",
        "coordinates": [
            [72.8260, 18.9320], # Churchgate
            [72.8290, 18.9950], # Lower Parel
            [72.8478, 19.0178], # Dadar
            [72.8468, 19.1197]  # Andheri
        ]
    },
    {
        "id": "line-harbour",
        "name": "Harbour Line Transit",
        "color": "#4D5963",
        "coordinates": [
            [72.8354, 18.9400], # CSMT
            [72.9986, 19.0771], # Vashi
            [73.0297, 19.0330]  # Belapur
        ]
    }
]

def get_unified_map_state() -> Dict[str, Any]:
    """
    Builds the unified live intelligence map state combining simulation telemetry,
    multi-horizon predictions, NetworkX graph edges, active scenario disruptions,
    and counterfactual intervention impacts.
    """
    # 1. Fetch live predictions across all zones
    predictor = get_predictor()
    preds_data = predictor.predict_all_zones()
    zone_preds_map = {z['zone_id']: z for z in preds_data.get('zones', [])}

    # 2. Fetch live network state & GeoJSON
    network = get_network()
    network_geojson = network.get_network_geojson()

    # 3. Fetch active scenario state
    scenario_engine = get_scenario_engine()
    scenario_state = scenario_engine.get_current_scenario()
    active_scenario_id = scenario_state.get('active_scenario_id')

    # 4. Fetch intervention recommendations & counterfactual simulation
    intervention_engine = get_intervention_engine()
    recs_data = intervention_engine.get_recommendations()
    rec_action = recs_data.get('recommended_action', {})
    impact_data = recs_data.get('impact', {})

    # 5. Fetch Zones from DB
    raw_zones = query_all("""
        SELECT 
            z.id, 
            z.name, 
            z.h3_index, 
            z.population_pressure, 
            z.hotel_capacity, 
            z.transport_capacity, 
            z.lat, 
            z.lng,
            cs.people as current_people,
            cs.arrival_rate,
            cs.departure_rate
        FROM zones z
        LEFT JOIN crowd_state cs ON z.id = cs.zone_id
    """)

    zone_features = []
    zone_list = []

    for z in raw_zones:
        zid = z["id"]
        # Use live prediction pressure if available, else DB pressure
        pred_entry = zone_preds_map.get(zid, {})
        current_p = round(pred_entry.get('current_pressure', z["population_pressure"]))
        
        # Forecast horizons
        horizons = pred_entry.get('predictions', [])
        p_30m  = round(horizons[0].get('predicted_pressure', current_p)) if len(horizons) > 0 else current_p
        p_60m  = round(horizons[1].get('predicted_pressure', current_p)) if len(horizons) > 1 else current_p
        p_120m = round(horizons[2].get('predicted_pressure', current_p)) if len(horizons) > 2 else current_p
        p_180m = round(horizons[3].get('predicted_pressure', current_p)) if len(horizons) > 3 else current_p

        # Trend calculation
        trend = 'STABLE'
        if p_60m > current_p + 3:
            trend = 'RISING'
        elif p_60m < current_p - 3:
            trend = 'EASING'

        # Colors based on current pressure
        fill_color, border_color, level = _get_pressure_visuals(current_p)

        # Counterfactual simulation after-pressure
        after_p = current_p
        if zid == 'curry-road':
            after_p = impact_data.get('target_pressure_after', max(0, current_p - 18))
        elif zid == 'thane':
            after_p = impact_data.get('destination_pressure_after', current_p + 8)

        coords = ZONE_BOUNDARIES.get(zid, [
            [z["lng"] - 0.008, z["lat"] - 0.008],
            [z["lng"] + 0.008, z["lat"] - 0.008],
            [z["lng"] + 0.008, z["lat"] + 0.008],
            [z["lng"] - 0.008, z["lat"] + 0.008],
            [z["lng"] - 0.008, z["lat"] - 0.008]
        ])

        zone_obj = {
            "id": zid,
            "name": z["name"],
            "pressure": current_p,
            "pressure_level": level,
            "current_people": z.get("current_people", 0),
            "arrival_rate": z.get("arrival_rate", 0),
            "departure_rate": z.get("departure_rate", 0),
            "forecast_30m": p_30m,
            "forecast_60m": p_60m,
            "forecast_120m": p_120m,
            "forecast_180m": p_180m,
            "forecast_delta": p_60m - current_p,
            "counterfactual_after": after_p,
            "counterfactual_delta": after_p - current_p,
            "trend": trend,
            "fill_color": fill_color,
            "border_color": border_color,
            "lat": z["lat"],
            "lng": z["lng"]
        }
        zone_list.append(zone_obj)

        zone_features.append({
            "type": "Feature",
            "id": zid,
            "geometry": {
                "type": "Polygon",
                "coordinates": [coords]
            },
            "properties": zone_obj
        })

    zones_geojson = {
        "type": "FeatureCollection",
        "features": zone_features
    }

    # 6. Fetch Stations
    stations = query_all("""
        SELECT 
            id, 
            name, 
            line, 
            capacity, 
            current_load, 
            ROUND((current_load * 100.0) / capacity, 1) as load_percentage,
            lat, 
            lng
        FROM stations
    """)

    station_features = []
    for s in stations:
        pct = s["load_percentage"]
        if pct >= 85:
            s["status"] = "CRITICAL"
            s["color"] = "#B03A2E"
        elif pct >= 70:
            s["status"] = "HIGH"
            s["color"] = "#E69A2E"
        elif pct >= 50:
            s["status"] = "MODERATE"
            s["color"] = "#B8893D"
        else:
            s["status"] = "LOW"
            s["color"] = "#2D9C8F"

        station_features.append({
            "type": "Feature",
            "id": s["id"],
            "geometry": {
                "type": "Point",
                "coordinates": [s["lng"], s["lat"]]
            },
            "properties": {
                "id": s["id"],
                "name": s["name"],
                "line": s["line"],
                "capacity": s["capacity"],
                "current_load": s["current_load"],
                "load_percentage": pct,
                "status": s["status"],
                "color": s["color"]
            }
        })

    stations_geojson = {
        "type": "FeatureCollection",
        "features": station_features
    }

    # 7. Intervention Flow Geometry Line (Curry Road -> Dadar -> Thane Corridor)
    intervention_flow_geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "id": "flow-curry-road-thane",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [72.8336, 18.9942], # Curry Road
                        [72.8398, 19.0022], # Parel
                        [72.8478, 19.0178], # Dadar
                        [72.9781, 19.2183]  # Thane
                    ]
                },
                "properties": {
                    "source": "curry-road",
                    "source_name": "Curry Road",
                    "destination": "thane",
                    "destination_name": "Thane Suburban Hub",
                    "dosage_pct": rec_action.get('dosage_pct', 18),
                    "people_redirected": impact_data.get('affected_people', 2500),
                    "reduction_pts": impact_data.get('pressure_reduction', 18),
                    "color": "#E69A2E"
                }
            }
        ]
    }

    # 8. Railway Lines GeoJSON
    rail_features = []
    for line in RAILWAY_LINES:
        # Check if Central line is disrupted by active scenario
        is_line_disrupted = (line["id"] == "line-central" and active_scenario_id == "central-line-disruption")
        line_color = "#B03A2E" if is_line_disrupted else line["color"]
        rail_features.append({
            "type": "Feature",
            "id": line["id"],
            "geometry": {
                "type": "LineString",
                "coordinates": line["coordinates"]
            },
            "properties": {
                "id": line["id"],
                "name": line["name"],
                "color": line_color,
                "status": "DISRUPTED" if is_line_disrupted else "OPERATIONAL"
            }
        })

    transit_lines_geojson = {
        "type": "FeatureCollection",
        "features": rail_features
    }

    return {
        "center": [72.8400, 18.9950],
        "zoom": 11.8,
        "zones": zone_list,
        "stations": stations,
        "active_scenario": {
            "id": active_scenario_id,
            "name": scenario_state.get('scenario_name', 'None'),
            "is_active": bool(active_scenario_id),
            "affected_corridors": ["Central Railway Mainline (Curry Road – Parel)"] if active_scenario_id == "central-line-disruption" else []
        },
        "recommendation": {
            "source": rec_action.get('source', 'curry-road'),
            "source_name": rec_action.get('source_name', 'Curry Road'),
            "destination": rec_action.get('destination', 'thane'),
            "destination_name": rec_action.get('destination_name', 'Thane'),
            "dosage_pct": rec_action.get('dosage_pct', 18),
            "target_before": impact_data.get('target_pressure_before', 94),
            "target_after": impact_data.get('target_pressure_after', 76),
            "reduction": impact_data.get('pressure_reduction', 18),
            "side_effect_increase": impact_data.get('side_effect_increase', 8),
            "critical_before": impact_data.get('critical_zones_before', 3),
            "critical_after": impact_data.get('critical_zones_after', 1)
        },
        "geojson": {
            "zones": zones_geojson,
            "stations": stations_geojson,
            "network_graph": network_geojson,
            "transit_lines": transit_lines_geojson,
            "intervention_flow": intervention_flow_geojson
        }
    }


def _get_pressure_visuals(pressure: float):
    """Returns brand-aligned hex colors and level label for pressure score."""
    if pressure >= 85:
        return "#B03A2E", "#7A2017", "CRITICAL"
    elif pressure >= 70:
        return "#E69A2E", "#B87518", "HIGH"
    elif pressure >= 50:
        return "#B8893D", "#8A6424", "MODERATE"
    else:
        return "#2D9C8F", "#1D6E64", "LOW"
