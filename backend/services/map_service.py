"""
PRAVAAH Map Service
Provides unified geographic state and authentic GeoJSON FeatureCollections
for MapLibre GL JS visualization.
"""

from data.db import query_all

# Pre-defined authentic convex polygon boundaries for Mumbai operational zones [lng, lat]
ZONE_BOUNDARIES = {
    "south-mumbai": [
        [72.8200, 18.9150],
        [72.8420, 18.9150],
        [72.8460, 18.9480],
        [72.8330, 18.9520],
        [72.8200, 18.9320],
        [72.8200, 18.9150]
    ],
    "girgaon": [
        [72.8060, 18.9460],
        [72.8240, 18.9480],
        [72.8250, 18.9660],
        [72.8090, 18.9660],
        [72.8060, 18.9460]
    ],
    "byculla": [
        [72.8220, 18.9660],
        [72.8420, 18.9660],
        [72.8410, 18.9840],
        [72.8220, 18.9840],
        [72.8220, 18.9660]
    ],
    "curry-road": [
        [72.8240, 18.9860],
        [72.8390, 18.9860],
        [72.8390, 19.0020],
        [72.8240, 19.0020],
        [72.8240, 18.9860]
    ],
    "lalbaug": [
        [72.8310, 18.9830],
        [72.8460, 18.9830],
        [72.8460, 18.9990],
        [72.8310, 18.9990],
        [72.8310, 18.9830]
    ],
    "parel": [
        [72.8340, 18.9940],
        [72.8520, 18.9940],
        [72.8520, 19.0120],
        [72.8340, 19.0120],
        [72.8340, 18.9940]
    ],
    "dadar": [
        [72.8330, 19.0100],
        [72.8580, 19.0100],
        [72.8580, 19.0340],
        [72.8330, 19.0340],
        [72.8330, 19.0100]
    ],
    "andheri": [
        [72.8280, 19.1020],
        [72.8650, 19.1020],
        [72.8650, 19.1350],
        [72.8280, 19.1350],
        [72.8280, 19.1020]
    ],
    "thane": [
        [72.9520, 19.1920],
        [72.9980, 19.1920],
        [72.9980, 19.2380],
        [72.9520, 19.2380],
        [72.9520, 19.1920]
    ],
    "vashi": [
        [72.9780, 19.0580],
        [73.0180, 19.0580],
        [73.0180, 19.0960],
        [72.9780, 19.0960],
        [72.9780, 19.0580]
    ],
    "navi-mumbai": [
        [73.0080, 19.0120],
        [73.0580, 19.0120],
        [73.0580, 19.0550],
        [73.0080, 19.0550],
        [73.0080, 19.0120]
    ]
}

# Arterial road line coordinates [lng, lat]
ROAD_COORDINATES = {
    "road-dr-ba-road": [
        [72.8378, 18.9912],
        [72.8420, 18.9980],
        [72.8478, 19.0178]
    ],
    "road-sane-guruji": [
        [72.8329, 18.9944],
        [72.8322, 18.9880]
    ],
    "road-eastern-freeway": [
        [72.8420, 18.9350],
        [72.8550, 18.9750],
        [72.8680, 19.0150],
        [72.8850, 19.0450],
        [72.9780, 19.0750]
    ],
    "road-tilak-bridge": [
        [72.8420, 19.0180],
        [72.8520, 19.0180]
    ],
    "road-lalbaug-flyover": [
        [72.8320, 18.9750],
        [72.8378, 18.9912],
        [72.8415, 18.9982]
    ],
    "road-nm-joshi": [
        [72.8290, 18.9950],
        [72.8325, 18.9940]
    ],
    "road-marine-drive": [
        [72.8230, 18.9250],
        [72.8210, 18.9400],
        [72.8130, 18.9545]
    ]
}

# Major Railway Corridor Lines [lng, lat]
RAILWAY_LINES = [
    {
        "id": "line-central",
        "name": "Central Railway Mainline",
        "color": "#536873",
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
        "color": "#536873",
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
        "color": "#536873",
        "coordinates": [
            [72.8354, 18.9400], # CSMT
            [72.9986, 19.0771], # Vashi
            [73.0297, 19.0330]  # Belapur
        ]
    }
]

def get_unified_map_state():
    """
    Returns complete multi-layer map state and GeoJSON FeatureCollections for PRAVAAH.
    """
    # 1. Fetch Zones with crowd state
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
    """)
    
    zone_features = []
    for z in zones:
        p = z["population_pressure"]
        if p >= 85:
            z["pressure_level"] = "CRITICAL"
            z["fill_color"] = "#A94338"
            z["border_color"] = "#7A3029"
        elif p >= 70:
            z["pressure_level"] = "HIGH"
            z["fill_color"] = "#B85C3E"
            z["border_color"] = "#91452F"
        elif p >= 50:
            z["pressure_level"] = "MODERATE"
            z["fill_color"] = "#B8893D"
            z["border_color"] = "#8C6324"
        else:
            z["pressure_level"] = "LOW"
            z["fill_color"] = "#52755F"
            z["border_color"] = "#3A5544"
            
        coords = ZONE_BOUNDARIES.get(z["id"], [
            [z["lng"] - 0.008, z["lat"] - 0.008],
            [z["lng"] + 0.008, z["lat"] - 0.008],
            [z["lng"] + 0.008, z["lat"] + 0.008],
            [z["lng"] - 0.008, z["lat"] + 0.008],
            [z["lng"] - 0.008, z["lat"] - 0.008]
        ])
        
        zone_features.append({
            "type": "Feature",
            "id": z["id"],
            "geometry": {
                "type": "Polygon",
                "coordinates": [coords]
            },
            "properties": {
                "id": z["id"],
                "name": z["name"],
                "pressure": z["population_pressure"],
                "pressure_level": z["pressure_level"],
                "current_people": z.get("current_people", 0),
                "arrival_rate": z.get("arrival_rate", 0),
                "departure_rate": z.get("departure_rate", 0),
                "fill_color": z["fill_color"],
                "border_color": z["border_color"],
                "lat": z["lat"],
                "lng": z["lng"]
            }
        })
        
    zones_geojson = {
        "type": "FeatureCollection",
        "features": zone_features
    }

    # 2. Fetch Stations
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
            s["color"] = "#A94338"
        elif pct >= 70:
            s["status"] = "HIGH"
            s["color"] = "#B85C3E"
        elif pct >= 50:
            s["status"] = "MODERATE"
            s["color"] = "#B8893D"
        else:
            s["status"] = "LOW"
            s["color"] = "#52755F"
            
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

    # 3. Fetch Hotels
    hotels = query_all("""
        SELECT 
            h.id, 
            h.zone_id, 
            z.name as zone_name,
            h.name, 
            h.total_rooms, 
            h.available_rooms, 
            ROUND(((h.total_rooms - h.available_rooms) * 100.0) / h.total_rooms, 1) as occupancy_rate,
            h.price, 
            h.lat, 
            h.lng
        FROM hotels h
        JOIN zones z ON h.zone_id = z.id
    """)
    
    hotel_features = []
    for h in hotels:
        occ = h["occupancy_rate"]
        color = "#A94338" if occ >= 85 else "#B85C3E" if occ >= 70 else "#B8893D" if occ >= 50 else "#52755F"
        hotel_features.append({
            "type": "Feature",
            "id": h["id"],
            "geometry": {
                "type": "Point",
                "coordinates": [h["lng"], h["lat"]]
            },
            "properties": {
                "id": h["id"],
                "name": h["name"],
                "zone_id": h["zone_id"],
                "zone_name": h["zone_name"],
                "total_rooms": h["total_rooms"],
                "available_rooms": h["available_rooms"],
                "occupancy_rate": occ,
                "price": h["price"],
                "color": color
            }
        })
        
    hotels_geojson = {
        "type": "FeatureCollection",
        "features": hotel_features
    }

    # 4. Fetch Roads
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
    
    road_features = []
    for r in roads:
        coords = ROAD_COORDINATES.get(r["id"], [[72.83, 18.99], [72.84, 19.01]])
        color = "#51423D" if r["status"] == "RESTRICTED" else "#A94338" if r["status"] == "CLOSED" else "#536873"
        road_features.append({
            "type": "Feature",
            "id": r["id"],
            "geometry": {
                "type": "LineString",
                "coordinates": coords
            },
            "properties": {
                "id": r["id"],
                "source": r["source"],
                "target": r["target"],
                "capacity": r["capacity"],
                "travel_time": r["travel_time"],
                "status": r["status"],
                "closure_start": r["closure_start"],
                "closure_end": r["closure_end"],
                "color": color
            }
        })
        
    roads_geojson = {
        "type": "FeatureCollection",
        "features": road_features
    }

    # 5. Fetch Welfare Amenities
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
    
    welfare_features = []
    for w in welfare:
        welfare_features.append({
            "type": "Feature",
            "id": w["id"],
            "geometry": {
                "type": "Point",
                "coordinates": [w["longitude"], w["latitude"]]
            },
            "properties": {
                "id": w["id"],
                "name": w["name"],
                "type": w["type"],
                "capacity": w["capacity"],
                "status": w["status"]
            }
        })
        
    welfare_geojson = {
        "type": "FeatureCollection",
        "features": welfare_features
    }

    # 6. Fetch Key Locations
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
    
    location_features = []
    for loc in locations:
        location_features.append({
            "type": "Feature",
            "id": loc["id"],
            "geometry": {
                "type": "Point",
                "coordinates": [loc["longitude"], loc["latitude"]]
            },
            "properties": {
                "id": loc["id"],
                "name": loc["name"],
                "type": loc["type"],
                "zone_id": loc["zone_id"],
                "capacity": loc["capacity"]
            }
        })
        
    locations_geojson = {
        "type": "FeatureCollection",
        "features": location_features
    }

    # 7. Railway Line features
    rail_features = []
    for line in RAILWAY_LINES:
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
                "color": line["color"]
            }
        })
        
    transit_lines_geojson = {
        "type": "FeatureCollection",
        "features": rail_features
    }

    return {
        "center": [72.8400, 18.9950], # [lng, lat] Lalbaug / Curry Road corridor
        "zoom": 11.8,
        "zones": zones,
        "stations": stations,
        "hotels": hotels,
        "roads": roads,
        "welfare": welfare,
        "locations": locations,
        "geojson": {
            "zones": zones_geojson,
            "stations": stations_geojson,
            "hotels": hotels_geojson,
            "roads": roads_geojson,
            "welfare": welfare_geojson,
            "locations": locations_geojson,
            "transit_lines": transit_lines_geojson
        }
    }
