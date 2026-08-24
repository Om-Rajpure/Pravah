"""
PRAVAAH Data Schemas (DuckDB DDL)
Phase 2 Synthetic City Data Architecture
"""

SCHEMA_STATEMENTS = [
    # 1. Zones
    """
    CREATE TABLE IF NOT EXISTS zones (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        h3_index VARCHAR,
        population_pressure INTEGER NOT NULL,
        hotel_capacity INTEGER NOT NULL,
        transport_capacity INTEGER NOT NULL,
        lat DOUBLE NOT NULL,
        lng DOUBLE NOT NULL
    );
    """,

    # 2. Locations
    """
    CREATE TABLE IF NOT EXISTS locations (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        latitude DOUBLE NOT NULL,
        longitude DOUBLE NOT NULL,
        zone_id VARCHAR NOT NULL,
        capacity INTEGER NOT NULL
    );
    """,

    # 3. Hotels
    """
    CREATE TABLE IF NOT EXISTS hotels (
        id VARCHAR PRIMARY KEY,
        zone_id VARCHAR NOT NULL,
        name VARCHAR NOT NULL,
        total_rooms INTEGER NOT NULL,
        available_rooms INTEGER NOT NULL,
        price INTEGER NOT NULL,
        lat DOUBLE NOT NULL,
        lng DOUBLE NOT NULL
    );
    """,

    # 4. Stations
    """
    CREATE TABLE IF NOT EXISTS stations (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        line VARCHAR NOT NULL,
        capacity INTEGER NOT NULL,
        current_load INTEGER NOT NULL,
        lat DOUBLE NOT NULL,
        lng DOUBLE NOT NULL
    );
    """,

    # 5. Roads
    """
    CREATE TABLE IF NOT EXISTS roads (
        id VARCHAR PRIMARY KEY,
        source VARCHAR NOT NULL,
        target VARCHAR NOT NULL,
        capacity INTEGER NOT NULL,
        travel_time INTEGER NOT NULL,
        status VARCHAR NOT NULL,
        closure_start VARCHAR,
        closure_end VARCHAR
    );
    """,

    # 6. Crowd State
    """
    CREATE TABLE IF NOT EXISTS crowd_state (
        id VARCHAR PRIMARY KEY,
        timestamp VARCHAR NOT NULL,
        zone_id VARCHAR NOT NULL,
        people INTEGER NOT NULL,
        arrival_rate INTEGER NOT NULL,
        departure_rate INTEGER NOT NULL,
        pressure INTEGER NOT NULL
    );
    """,

    # 7. Predictions
    """
    CREATE TABLE IF NOT EXISTS predictions (
        id VARCHAR PRIMARY KEY,
        zone_id VARCHAR NOT NULL,
        forecast_time VARCHAR NOT NULL,
        predicted_people INTEGER NOT NULL,
        predicted_pressure INTEGER NOT NULL,
        confidence DOUBLE NOT NULL,
        reason_codes VARCHAR NOT NULL
    );
    """,

    # 8. Actions
    """
    CREATE TABLE IF NOT EXISTS actions (
        id VARCHAR PRIMARY KEY,
        type VARCHAR NOT NULL,
        target VARCHAR NOT NULL,
        percentage INTEGER NOT NULL,
        affected_people INTEGER NOT NULL,
        expected_result VARCHAR NOT NULL,
        status VARCHAR NOT NULL
    );
    """,

    # 9. Scenarios
    """
    CREATE TABLE IF NOT EXISTS scenarios (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        description VARCHAR NOT NULL,
        active BOOLEAN NOT NULL DEFAULT false,
        effects VARCHAR NOT NULL
    );
    """,

    # 10. Welfare
    """
    CREATE TABLE IF NOT EXISTS welfare (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        type VARCHAR NOT NULL,
        latitude DOUBLE NOT NULL,
        longitude DOUBLE NOT NULL,
        capacity INTEGER NOT NULL,
        status VARCHAR NOT NULL
    );
    """,

    # 11. Alerts
    """
    CREATE TABLE IF NOT EXISTS alerts (
        id VARCHAR PRIMARY KEY,
        severity VARCHAR NOT NULL,
        title VARCHAR NOT NULL,
        description VARCHAR NOT NULL,
        timeframe VARCHAR,
        zone_id VARCHAR
    );
    """
]
