"""
PRAVAAH Zone Service
Provides multi-zone summaries and individual zone detail drilldowns.
"""

import json
from data.db import query_all, query_one

def get_all_zones():
    """
    Returns list of all monitored zones with population pressure and capacity data.
    """
    zones = query_all("""
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
        ORDER BY z.population_pressure DESC
    """)
    
    for z in zones:
        pressure = z["population_pressure"]
        if pressure >= 85:
            z["status"] = "CRITICAL"
        elif pressure >= 70:
            z["status"] = "HIGH"
        elif pressure >= 50:
            z["status"] = "MODERATE"
        else:
            z["status"] = "LOW"
            
    return zones

def get_zone_by_id(zone_id):
    """
    Retrieves detailed zone information, including locations, stations, hotels, and predictions.
    """
    zone = query_one("""
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
            cs.departure_rate,
            cs.timestamp
        FROM zones z
        LEFT JOIN crowd_state cs ON z.id = cs.zone_id
        WHERE z.id = ?
    """, [zone_id])
    
    if not zone:
        return None
        
    pressure = zone["population_pressure"]
    zone["status"] = "CRITICAL" if pressure >= 85 else "HIGH" if pressure >= 70 else "MODERATE" if pressure >= 50 else "LOW"
    
    # Associated Locations / Mandals
    zone["locations"] = query_all("SELECT id, name, type, latitude, longitude, capacity FROM locations WHERE zone_id = ?", [zone_id])
    
    # Associated Hotels
    zone["hotels"] = query_all("SELECT id, name, total_rooms, available_rooms, price, lat, lng FROM hotels WHERE zone_id = ?", [zone_id])
    
    # Associated Predictions
    predictions = query_all("SELECT id, forecast_time, predicted_people, predicted_pressure, confidence, reason_codes FROM predictions WHERE zone_id = ? ORDER BY forecast_time ASC", [zone_id])
    for pred in predictions:
        try:
            pred["reason_codes"] = json.loads(pred["reason_codes"])
        except Exception:
            pred["reason_codes"] = [pred["reason_codes"]]
    zone["predictions"] = predictions
    
    # Active Alerts for this zone
    zone["alerts"] = query_all("SELECT id, severity, title, description, timeframe FROM alerts WHERE zone_id = ?", [zone_id])
    
    return zone
