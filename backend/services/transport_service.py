"""
PRAVAAH Transport & Mobility Service
Provides station loads, railway corridors, and road network status.
"""

from data.db import query_all, query_one

def get_transport_network():
    """
    Returns railway stations, network load aggregations, and road network status.
    """
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
        ORDER BY load_percentage DESC
    """)
    
    for s in stations:
        pct = s["load_percentage"]
        if pct >= 85:
            s["status"] = "CRITICAL"
        elif pct >= 70:
            s["status"] = "HIGH"
        elif pct >= 50:
            s["status"] = "MODERATE"
        else:
            s["status"] = "LOW"
            
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
        ORDER BY travel_time DESC
    """)
    
    # Overall summary stats
    totals = query_one("""
        SELECT 
            SUM(capacity) as total_capacity,
            SUM(current_load) as total_load,
            ROUND((SUM(current_load) * 100.0) / SUM(capacity), 1) as avg_load_percentage
        FROM stations
    """)
    
    return {
        "summary": totals,
        "stations": stations,
        "roads": roads,
        "critical_bottlenecks": [s for s in stations if s["load_percentage"] >= 85]
    }
