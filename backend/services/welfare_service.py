"""
PRAVAAH Welfare Service
Manages civic support amenities: water stations, medical outposts, sanitation, rest, food.
"""

from data.db import query_all, query_one

def get_welfare_amenities():
    """
    Returns all welfare support points and aggregated statistics.
    """
    amenities = query_all("""
        SELECT 
            id, 
            name, 
            type, 
            latitude, 
            longitude, 
            capacity, 
            status
        FROM welfare
        ORDER BY type ASC, capacity DESC
    """)
    
    # Counts by type
    counts_by_type = {}
    for a in amenities:
        t = a["type"]
        counts_by_type[t] = counts_by_type.get(t, 0) + 1
        
    summary = {
        "total_amenities": len(amenities),
        "by_type": counts_by_type,
        "active_count": len([a for a in amenities if a["status"] == "ACTIVE"]),
        "congested_count": len([a for a in amenities if a["status"] == "CONGESTED"])
    }
    
    return {
        "summary": summary,
        "amenities": amenities
    }
