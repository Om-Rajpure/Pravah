"""
PRAVAAH Hotel & Hospitality Service
Provides hotel cluster analytics, room vacancies, pricing metrics, and zone aggregations.
"""

from data.db import query_all, query_one

def get_hotel_analytics():
    """
    Returns hotel clusters and overall accommodation summary.
    """
    hotels = query_all("""
        SELECT 
            h.id, 
            h.zone_id, 
            z.name as zone_name,
            h.name, 
            h.total_rooms, 
            h.available_rooms, 
            (h.total_rooms - h.available_rooms) as occupied_rooms,
            ROUND(((h.total_rooms - h.available_rooms) * 100.0) / h.total_rooms, 1) as occupancy_rate,
            h.price, 
            h.lat, 
            h.lng
        FROM hotels h
        JOIN zones z ON h.zone_id = z.id
        ORDER BY occupancy_rate DESC
    """)
    
    summary = query_one("""
        SELECT 
            SUM(total_rooms) as total_rooms,
            SUM(available_rooms) as available_rooms,
            SUM(total_rooms - available_rooms) as occupied_rooms,
            ROUND((SUM(total_rooms - available_rooms) * 100.0) / SUM(total_rooms), 1) as avg_occupancy_rate,
            ROUND(AVG(price)) as avg_price
        FROM hotels
    """)
    
    # Regional Breakdown: Core (High Occ) vs Buffer (Available)
    core_zones = ["south-mumbai", "girgaon", "curry-road", "parel", "dadar", "byculla"]
    core_avail = sum(h["available_rooms"] for h in hotels if h["zone_id"] in core_zones)
    core_total = sum(h["total_rooms"] for h in hotels if h["zone_id"] in core_zones)
    
    buffer_avail = sum(h["available_rooms"] for h in hotels if h["zone_id"] not in core_zones)
    buffer_total = sum(h["total_rooms"] for h in hotels if h["zone_id"] not in core_zones)
    
    return {
        "summary": summary,
        "clusters": hotels,
        "distribution": {
            "core_mumbai": {
                "total": core_total,
                "available": core_avail,
                "occupancy_rate": round(((core_total - core_avail) * 100.0) / core_total, 1) if core_total else 0
            },
            "buffer_suburbs": {
                "total": buffer_total,
                "available": buffer_avail,
                "occupancy_rate": round(((buffer_total - buffer_avail) * 100.0) / buffer_total, 1) if buffer_total else 0
            }
        }
    }
