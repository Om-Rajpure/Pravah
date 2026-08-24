"""
PRAVAAH DuckDB Storage Layer & Database Manager
"""

import os
import duckdb
from config import Config
from data.schema import SCHEMA_STATEMENTS
from data.seed import generate_seed_data

_db_connection = None

def get_db():
    """
    Returns a connection to the DuckDB database.
    """
    global _db_connection
    if _db_connection is None:
        os.makedirs(os.path.dirname(Config.DB_PATH), exist_ok=True)
        # duckdb allows connecting to the file
        _db_connection = duckdb.connect(Config.DB_PATH)
    return _db_connection

def init_db(force_reseed=False):
    """
    Initializes database tables and seeds deterministic city data.
    """
    conn = get_db()
    
    # 1. Execute schema creation statements
    for stmt in SCHEMA_STATEMENTS:
        conn.execute(stmt)
        
    # 2. Check if data already exists or if reseed is requested
    zone_count = conn.execute("SELECT COUNT(*) FROM zones").fetchone()[0]
    if zone_count == 0 or force_reseed:
        seed_database(conn)

def seed_database(conn=None):
    """
    Seeds all tables with deterministic data from generate_seed_data.
    """
    if conn is None:
        conn = get_db()
        
    data = generate_seed_data(Config.DEMO_SEED)
    
    # Clear existing records
    conn.execute("DELETE FROM alerts")
    conn.execute("DELETE FROM welfare")
    conn.execute("DELETE FROM scenarios")
    conn.execute("DELETE FROM actions")
    conn.execute("DELETE FROM predictions")
    conn.execute("DELETE FROM crowd_state")
    conn.execute("DELETE FROM roads")
    conn.execute("DELETE FROM stations")
    conn.execute("DELETE FROM hotels")
    conn.execute("DELETE FROM locations")
    conn.execute("DELETE FROM zones")
    
    # Insert Zones
    for z in data["zones"]:
        conn.execute(
            "INSERT INTO zones (id, name, h3_index, population_pressure, hotel_capacity, transport_capacity, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [z["id"], z["name"], z["h3_index"], z["population_pressure"], z["hotel_capacity"], z["transport_capacity"], z["lat"], z["lng"]]
        )
        
    # Insert Locations
    for loc in data["locations"]:
        conn.execute(
            "INSERT INTO locations (id, name, type, latitude, longitude, zone_id, capacity) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [loc["id"], loc["name"], loc["type"], loc["latitude"], loc["longitude"], loc["zone_id"], loc["capacity"]]
        )
        
    # Insert Hotels
    for htl in data["hotels"]:
        conn.execute(
            "INSERT INTO hotels (id, zone_id, name, total_rooms, available_rooms, price, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [htl["id"], htl["zone_id"], htl["name"], htl["total_rooms"], htl["available_rooms"], htl["price"], htl["lat"], htl["lng"]]
        )
        
    # Insert Stations
    for stn in data["stations"]:
        conn.execute(
            "INSERT INTO stations (id, name, line, capacity, current_load, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [stn["id"], stn["name"], stn["line"], stn["capacity"], stn["current_load"], stn["lat"], stn["lng"]]
        )
        
    # Insert Roads
    for rd in data["roads"]:
        conn.execute(
            "INSERT INTO roads (id, source, target, capacity, travel_time, status, closure_start, closure_end) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [rd["id"], rd["source"], rd["target"], rd["capacity"], rd["travel_time"], rd["status"], rd["closure_start"], rd["closure_end"]]
        )
        
    # Insert Crowd State
    for cs in data["crowd_states"]:
        conn.execute(
            "INSERT INTO crowd_state (id, timestamp, zone_id, people, arrival_rate, departure_rate, pressure) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [cs["id"], cs["timestamp"], cs["zone_id"], cs["people"], cs["arrival_rate"], cs["departure_rate"], cs["pressure"]]
        )
        
    # Insert Predictions
    for pred in data["predictions"]:
        conn.execute(
            "INSERT INTO predictions (id, zone_id, forecast_time, predicted_people, predicted_pressure, confidence, reason_codes) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [pred["id"], pred["zone_id"], pred["forecast_time"], pred["predicted_people"], pred["predicted_pressure"], pred["confidence"], pred["reason_codes"]]
        )
        
    # Insert Actions
    for act in data["actions"]:
        conn.execute(
            "INSERT INTO actions (id, type, target, percentage, affected_people, expected_result, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [act["id"], act["type"], act["target"], act["percentage"], act["affected_people"], act["expected_result"], act["status"]]
        )
        
    # Insert Scenarios
    for scen in data["scenarios"]:
        conn.execute(
            "INSERT INTO scenarios (id, name, description, active, effects) VALUES (?, ?, ?, ?, ?)",
            [scen["id"], scen["name"], scen["description"], scen["active"], scen["effects"]]
        )
        
    # Insert Welfare
    for wlf in data["welfare"]:
        conn.execute(
            "INSERT INTO welfare (id, name, type, latitude, longitude, capacity, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [wlf["id"], wlf["name"], wlf["type"], wlf["latitude"], wlf["longitude"], wlf["capacity"], wlf["status"]]
        )
        
    # Insert Alerts
    for alt in data["alerts"]:
        conn.execute(
            "INSERT INTO alerts (id, severity, title, description, timeframe, zone_id) VALUES (?, ?, ?, ?, ?, ?)",
            [alt["id"], alt["severity"], alt["title"], alt["description"], alt["timeframe"], alt["zone_id"]]
        )

def query_all(query, params=None):
    """
    Executes a query and returns a list of dictionaries.
    """
    conn = get_db()
    cursor = conn.cursor()
    if params:
        cursor.execute(query, params)
    else:
        cursor.execute(query)
    
    cols = [desc[0] for desc in cursor.description]
    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(cols, row)))
    return results

def query_one(query, params=None):
    """
    Executes a query and returns a single dictionary or None.
    """
    res = query_all(query, params)
    return res[0] if res else None
