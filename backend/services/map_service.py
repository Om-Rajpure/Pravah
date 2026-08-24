"""
PRAVAAH Map Service
Provides unified geographic state and multi-layer map assets for frontend visualization.
"""

from data.db import query_all

def get_unified_map_state():
    """
    Returns complete multi-layer map state for PRAVAAH visualization.
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
            cs.people as current_people
        FROM zones z
        LEFT JOIN crowd_state cs ON z.id = cs.zone_id
    """)
    
    for z in zones:
        p = z["population_pressure"]
        if p >= 85:
            z["pressure_level"] = "CRITICAL"
            z["fill_color"] = "#A94338"
        elif p >= 70:
            z["pressure_level"] = "HIGH"
            z["fill_color"] = "#B85C3E"
        elif p >= 50:
            z["pressure_level"] = "MODERATE"
            z["fill_color"] = "#B8893D"
        else:
            z["pressure_level"] = "LOW"
            z["fill_color"] = "#52755F"
            
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
    
    for s in stations:
        pct = s["load_percentage"]
        s["status"] = "CRITICAL" if pct >= 85 else "HIGH" if pct >= 70 else "MODERATE" if pct >= 50 else "LOW"
        
    hotels = query_all("""
        SELECT 
            h.id, 
            h.zone_id, 
            h.name, 
            h.total_rooms, 
            h.available_rooms, 
            ROUND(((h.total_rooms - h.available_rooms) * 100.0) / h.total_rooms, 1) as occupancy_rate,
            h.price, 
            h.lat, 
            h.lng
        FROM hotels h
    """)
    
    roads = query_all("""
        SELECT 
            id, 
            source, 
            target, 
            capacity, 
            travel_time, 
            status, 
            closure_start, 
            closure_end
        FROM roads
    """)
    
    welfare = query_all("""
        SELECT 
            id, 
            name, 
            type, 
            latitude, 
            longitude, 
            capacity, 
            status
        FROM welfare
    """)
    
    locations = query_all("""
        SELECT 
            id, 
            name, 
            type, 
            latitude, 
            longitude, 
            zone_id, 
            capacity
        FROM locations
    """)
    
    return {
        "center": [18.9912, 72.8378], # Lalbaug epicenter
        "zoom": 12,
        "zones": zones,
        "stations": stations,
        "hotels": hotels,
        "roads": roads,
        "welfare": welfare,
        "locations": locations
    }
