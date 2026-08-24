"""
PRAVAAH City Service
Calculates high-level city pressure, operational KPIs, alerts, and active recommendations.
"""

from config import Config
from data.db import query_all, query_one

def get_city_overview():
    """
    Computes system overview data for Control Room dashboard KPI cards.
    """
    # 1. Calculate Average City Pressure
    zones = query_all("SELECT population_pressure FROM zones")
    city_pressure = round(sum(z["population_pressure"] for z in zones) / len(zones)) if zones else 72
    
    # 2. Predicted Peak
    pred_peak = query_one("SELECT MAX(predicted_pressure) as peak FROM predictions")
    predicted_peak = pred_peak["peak"] if pred_peak and pred_peak["peak"] is not None else 91
    
    # 3. Hotels Available
    hotel_stats = query_one("SELECT SUM(total_rooms) as total, SUM(available_rooms) as available FROM hotels")
    hotels_available = hotel_stats["available"] if hotel_stats and hotel_stats["available"] is not None else 11714
    total_rooms = hotel_stats["total"] if hotel_stats and hotel_stats["total"] is not None else 32100
    
    # 4. Transport Load Percentage
    transit_stats = query_one("SELECT SUM(capacity) as total_cap, SUM(current_load) as total_load FROM stations")
    if transit_stats and transit_stats["total_cap"] and transit_stats["total_cap"] > 0:
        transport_load = round((transit_stats["total_load"] / transit_stats["total_cap"]) * 100)
    else:
        transport_load = 78
        
    # 5. Alerts
    alerts = query_all("SELECT id, severity, title, description, timeframe, zone_id FROM alerts ORDER BY CASE severity WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'WARNING' THEN 3 ELSE 4 END")
    active_alerts = len(alerts)
    
    # 6. Primary Recommendation
    recommendation_row = query_one("SELECT id, type, target, percentage, affected_people, expected_result, status FROM actions WHERE status = 'recommended' LIMIT 1")
    if recommendation_row:
        recommendation = {
            "title": "PRAVAAH RECOMMENDS",
            "description": f"Redirect {recommendation_row['percentage']}% of incoming visitors toward {recommendation_row['target']}.",
            "expected_result": {
                "before": "Curry Road 94%",
                "after": "76%"
            },
            "action_label": "Simulate Action",
            "action_id": recommendation_row["id"],
            "affected_people": recommendation_row["affected_people"]
        }
    else:
        recommendation = {
            "title": "PRAVAAH RECOMMENDS",
            "description": "Redirect 18% of incoming visitors toward Thane and Vashi.",
            "expected_result": {
                "before": "Curry Road 94%",
                "after": "76%"
            },
            "action_label": "Simulate Action"
        }
        
    return {
        "city_pressure": city_pressure,
        "predicted_peak": predicted_peak,
        "hotels_available": hotels_available,
        "total_rooms": total_rooms,
        "transport_load": transport_load,
        "active_alerts": active_alerts,
        "alerts": alerts,
        "recommendation": recommendation,
        "event_info": Config.EVENT_INFO,
        "data_source": "Prototype data · Simulated + calibrated to real geography",
        "timestamp": "2026-09-08T18:00:00Z"
    }
