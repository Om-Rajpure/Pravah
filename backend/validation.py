"""
PRAVAAH Data Integrity & Validation Suite
Phase 2 Synthetic City Data Validation
"""

import logging

logger = logging.getLogger(__name__)

# Valid Mumbai Metropolitan Region bounding box
MUMBAI_BOUNDS = {
    "min_lat": 18.8000,
    "max_lat": 19.4000,
    "min_lng": 72.7000,
    "max_lng": 73.2000
}

def validate_coordinates(lat, lng, entity_name, entity_id):
    if not (MUMBAI_BOUNDS["min_lat"] <= lat <= MUMBAI_BOUNDS["max_lat"]):
        raise ValueError(f"Invalid latitude {lat} for {entity_name} ({entity_id}). Must be between {MUMBAI_BOUNDS['min_lat']} and {MUMBAI_BOUNDS['max_lat']}.")
    if not (MUMBAI_BOUNDS["min_lng"] <= lng <= MUMBAI_BOUNDS["max_lng"]):
        raise ValueError(f"Invalid longitude {lng} for {entity_name} ({entity_id}). Must be between {MUMBAI_BOUNDS['min_lng']} and {MUMBAI_BOUNDS['max_lng']}.")

def validate_database_integrity(db_conn):
    """
    Validates all tables and relationships in the DuckDB database.
    Raises ValueError if any constraint or invariant is violated.
    """
    logger.info("Starting PRAVAAH synthetic data integrity validation...")
    
    # 1. Validate Zones
    zones = db_conn.execute("SELECT id, name, population_pressure, hotel_capacity, transport_capacity, lat, lng FROM zones").fetchall()
    if not zones:
        raise ValueError("Validation failed: No zones found in database.")
    
    zone_ids = set()
    for z in zones:
        z_id, z_name, z_pressure, z_hcap, z_tcap, z_lat, z_lng = z
        zone_ids.add(z_id)
        if not (0 <= z_pressure <= 100):
            raise ValueError(f"Invalid population_pressure {z_pressure} for zone {z_id}. Must be 0-100.")
        if z_hcap < 0 or z_tcap < 0:
            raise ValueError(f"Capacities cannot be negative for zone {z_id}.")
        validate_coordinates(z_lat, z_lng, "zone", z_id)
        
    # 2. Validate Locations & Foreign Keys
    locations = db_conn.execute("SELECT id, name, type, latitude, longitude, zone_id, capacity FROM locations").fetchall()
    for loc in locations:
        loc_id, loc_name, loc_type, loc_lat, loc_lng, loc_zone, loc_cap = loc
        if loc_zone not in zone_ids:
            raise ValueError(f"Location {loc_id} references non-existent zone {loc_zone}.")
        if loc_cap < 0:
            raise ValueError(f"Location {loc_id} capacity cannot be negative.")
        validate_coordinates(loc_lat, loc_lng, "location", loc_id)
        
    # 3. Validate Hotels & Capacities
    hotels = db_conn.execute("SELECT id, zone_id, name, total_rooms, available_rooms, price, lat, lng FROM hotels").fetchall()
    for htl in hotels:
        h_id, h_zone, h_name, h_total, h_avail, h_price, h_lat, h_lng = htl
        if h_zone not in zone_ids:
            raise ValueError(f"Hotel {h_id} references non-existent zone {h_zone}.")
        if h_avail < 0 or h_total <= 0:
            raise ValueError(f"Invalid room counts for hotel {h_id}: total={h_total}, available={h_avail}.")
        if h_avail > h_total:
            raise ValueError(f"Available rooms ({h_avail}) exceed total rooms ({h_total}) for hotel {h_id}.")
        if h_price <= 0:
            raise ValueError(f"Invalid hotel price {h_price} for hotel {h_id}.")
        validate_coordinates(h_lat, h_lng, "hotel", h_id)
        
    # 4. Validate Stations & Loads
    stations = db_conn.execute("SELECT id, name, capacity, current_load, lat, lng FROM stations").fetchall()
    for stn in stations:
        s_id, s_name, s_cap, s_load, s_lat, s_lng = stn
        if s_cap <= 0 or s_load < 0:
            raise ValueError(f"Invalid station capacity or load for station {s_id}.")
        # Allow realistic peak up to 1.5x design capacity during extreme surges, but must be within reasonable limit
        if s_load > s_cap * 1.5:
            raise ValueError(f"Station load {s_load} exceeds 150% maximum limit for station {s_id} (capacity: {s_cap}).")
        validate_coordinates(s_lat, s_lng, "station", s_id)
        
    # 5. Validate Roads
    roads = db_conn.execute("SELECT id, source, target, capacity, travel_time, status FROM roads").fetchall()
    for rd in roads:
        r_id, r_src, r_tgt, r_cap, r_time, r_status = rd
        if r_cap <= 0 or r_time <= 0:
            raise ValueError(f"Invalid road parameters for road {r_id}.")
        if r_status not in ["OPEN", "RESTRICTED", "CLOSED"]:
            raise ValueError(f"Invalid status '{r_status}' for road {r_id}.")
            
    # 6. Validate Welfare Amenities
    welfare = db_conn.execute("SELECT id, name, type, latitude, longitude, capacity, status FROM welfare").fetchall()
    for w in welfare:
        w_id, w_name, w_type, w_lat, w_lng, w_cap, w_status = w
        if w_type not in ["water", "medical", "toilet", "rest", "food"]:
            raise ValueError(f"Invalid welfare type '{w_type}' for {w_id}.")
        if w_cap < 0:
            raise ValueError(f"Welfare capacity cannot be negative for {w_id}.")
        validate_coordinates(w_lat, w_lng, "welfare", w_id)
        
    # 7. Validate Crowd State
    crowd_states = db_conn.execute("SELECT id, zone_id, people, arrival_rate, departure_rate, pressure FROM crowd_state").fetchall()
    for cs in crowd_states:
        cs_id, cs_zone, cs_people, cs_arr, cs_dep, cs_pressure = cs
        if cs_zone not in zone_ids:
            raise ValueError(f"Crowd state {cs_id} references non-existent zone {cs_zone}.")
        if cs_people < 0 or cs_arr < 0 or cs_dep < 0:
            raise ValueError(f"Crowd numbers cannot be negative for {cs_id}.")
        if not (0 <= cs_pressure <= 100):
            raise ValueError(f"Pressure must be between 0 and 100 for {cs_id}.")

    logger.info("PRAVAAH synthetic city data validation PASSED with 0 violations.")
    return True
