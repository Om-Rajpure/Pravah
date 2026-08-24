"""
PRAVAAH Deterministic Synthetic Data Generator
Phase 2 — Mumbai Ganesh Chaturthi Evening Scenario
"""

import json
from config import Config

def generate_seed_data(seed_value=Config.DEMO_SEED):
    """
    Generates deterministic city data for PRAVAAH.
    Every run with the same seed returns identical, calibrated records.
    """
    
    # 1. Zones (11 key Mumbai operational zones)
    zones = [
        {
            "id": "south-mumbai",
            "name": "South Mumbai",
            "h3_index": "8860145b59fffff",
            "population_pressure": 86,
            "hotel_capacity": 4500,
            "transport_capacity": 280000,
            "lat": 18.9322,
            "lng": 72.8335
        },
        {
            "id": "lalbaug",
            "name": "Lalbaug",
            "h3_index": "8860145ad5fffff",
            "population_pressure": 92,
            "hotel_capacity": 800,
            "transport_capacity": 60000,
            "lat": 18.9912,
            "lng": 72.8378
        },
        {
            "id": "girgaon",
            "name": "Girgaon",
            "h3_index": "8860145a33fffff",
            "population_pressure": 84,
            "hotel_capacity": 1200,
            "transport_capacity": 90000,
            "lat": 18.9548,
            "lng": 72.8142
        },
        {
            "id": "curry-road",
            "name": "Curry Road",
            "h3_index": "8860145ad1fffff",
            "population_pressure": 94,
            "hotel_capacity": 600,
            "transport_capacity": 45000,
            "lat": 18.9944,
            "lng": 72.8329
        },
        {
            "id": "dadar",
            "name": "Dadar",
            "h3_index": "8860145a57fffff",
            "population_pressure": 82,
            "hotel_capacity": 1800,
            "transport_capacity": 210000,
            "lat": 19.0178,
            "lng": 72.8478
        },
        {
            "id": "parel",
            "name": "Parel",
            "h3_index": "8860145ad3fffff",
            "population_pressure": 76,
            "hotel_capacity": 3200,
            "transport_capacity": 85000,
            "lat": 18.9982,
            "lng": 72.8415
        },
        {
            "id": "byculla",
            "name": "Byculla",
            "h3_index": "8860145a19fffff",
            "population_pressure": 68,
            "hotel_capacity": 1100,
            "transport_capacity": 70000,
            "lat": 18.9750,
            "lng": 72.8320
        },
        {
            "id": "andheri",
            "name": "Andheri",
            "h3_index": "886014582bfffff",
            "population_pressure": 58,
            "hotel_capacity": 6500,
            "transport_capacity": 220000,
            "lat": 19.1197,
            "lng": 72.8468
        },
        {
            "id": "thane",
            "name": "Thane",
            "h3_index": "8860144595fffff",
            "population_pressure": 44,
            "hotel_capacity": 4800,
            "transport_capacity": 180000,
            "lat": 19.2183,
            "lng": 72.9781
        },
        {
            "id": "vashi",
            "name": "Vashi",
            "h3_index": "8860144463fffff",
            "population_pressure": 48,
            "hotel_capacity": 5400,
            "transport_capacity": 140000,
            "lat": 19.0771,
            "lng": 72.9986
        },
        {
            "id": "navi-mumbai",
            "name": "Navi Mumbai",
            "h3_index": "886014470bfffff",
            "population_pressure": 41,
            "hotel_capacity": 3600,
            "transport_capacity": 110000,
            "lat": 19.0330,
            "lng": 73.0297
        }
    ]

    # 2. Locations (mandals, immersion points, transit interchanges, road nodes)
    locations = [
        {
            "id": "loc-lalbaugcha-raja",
            "name": "Lalbaugcha Raja Mandal",
            "type": "mandal",
            "latitude": 18.9912,
            "longitude": 72.8378,
            "zone_id": "lalbaug",
            "capacity": 45000
        },
        {
            "id": "loc-ganesh-galli",
            "name": "Ganesh Galli (Mumbaicha Raja)",
            "type": "mandal",
            "latitude": 18.9925,
            "longitude": 72.8365,
            "zone_id": "lalbaug",
            "capacity": 25000
        },
        {
            "id": "loc-khetwadi-12",
            "name": "Khetwadi 12th Lane Ganpati",
            "type": "mandal",
            "latitude": 18.9560,
            "longitude": 72.8190,
            "zone_id": "girgaon",
            "capacity": 20000
        },
        {
            "id": "loc-tejukaya",
            "name": "Tejukaya Sarvajanik Mandal",
            "type": "mandal",
            "latitude": 18.9905,
            "longitude": 72.8385,
            "zone_id": "lalbaug",
            "capacity": 15000
        },
        {
            "id": "loc-girgaon-chowpatty",
            "name": "Girgaon Chowpatty Immersion Site",
            "type": "immersion_point",
            "latitude": 18.9545,
            "longitude": 72.8130,
            "zone_id": "girgaon",
            "capacity": 120000
        },
        {
            "id": "loc-dadar-chowpatty",
            "name": "Dadar Chowpatty / Shivaji Park",
            "type": "immersion_point",
            "latitude": 19.0260,
            "longitude": 72.8360,
            "zone_id": "dadar",
            "capacity": 85000
        },
        {
            "id": "loc-dadar-tt",
            "name": "Dadar TT Circle Hub",
            "type": "transport_interchange",
            "latitude": 19.0185,
            "longitude": 72.8490,
            "zone_id": "dadar",
            "capacity": 50000
        },
        {
            "id": "loc-curry-road-bridge",
            "name": "Curry Road Flyover Junction",
            "type": "road_node",
            "latitude": 18.9940,
            "longitude": 72.8325,
            "zone_id": "curry-road",
            "capacity": 20000
        },
        {
            "id": "loc-parel-tt",
            "name": "Parel TT Junction",
            "type": "road_node",
            "latitude": 18.9980,
            "longitude": 72.8420,
            "zone_id": "parel",
            "capacity": 25000
        },
        {
            "id": "loc-csmt-hub",
            "name": "CSMT Interchange Hub",
            "type": "transport_interchange",
            "latitude": 18.9400,
            "longitude": 72.8354,
            "zone_id": "south-mumbai",
            "capacity": 150000
        }
    ]

    # 3. Hotels / Clusters (realistic prototype accommodation data)
    hotels = [
        {
            "id": "htl-south-mumbai-cluster",
            "zone_id": "south-mumbai",
            "name": "South Mumbai Heritage & Business Cluster",
            "total_rooms": 4500,
            "available_rooms": 270,
            "price": 12500,
            "lat": 18.9310,
            "lng": 72.8320
        },
        {
            "id": "htl-girgaon-stay-cluster",
            "zone_id": "girgaon",
            "name": "Girgaon / Marine Lines Guesthouse Cluster",
            "total_rooms": 1200,
            "available_rooms": 144,
            "price": 6500,
            "lat": 18.9535,
            "lng": 72.8160
        },
        {
            "id": "htl-curry-road-lodges",
            "zone_id": "curry-road",
            "name": "Curry Road & Lower Parel Budget Stays",
            "total_rooms": 600,
            "available_rooms": 36,
            "price": 4200,
            "lat": 18.9935,
            "lng": 72.8315
        },
        {
            "id": "htl-parel-luxury-cluster",
            "zone_id": "parel",
            "name": "Parel & Lower Parel High-Rise Cluster",
            "total_rooms": 3200,
            "available_rooms": 288,
            "price": 9800,
            "lat": 18.9975,
            "lng": 72.8390
        },
        {
            "id": "htl-dadar-central-cluster",
            "zone_id": "dadar",
            "name": "Dadar Central Transit Accommodations",
            "total_rooms": 1800,
            "available_rooms": 216,
            "price": 5200,
            "lat": 19.0165,
            "lng": 72.8455
        },
        {
            "id": "htl-byculla-cluster",
            "zone_id": "byculla",
            "name": "Byculla Commercial Stays",
            "total_rooms": 1100,
            "available_rooms": 275,
            "price": 4800,
            "lat": 18.9740,
            "lng": 72.8305
        },
        {
            "id": "htl-andheri-airport-cluster",
            "zone_id": "andheri",
            "name": "Andheri & Airport Transit Hub Cluster",
            "total_rooms": 6500,
            "available_rooms": 2925,
            "price": 6200,
            "lat": 19.1180,
            "lng": 72.8450
        },
        {
            "id": "htl-vashi-cluster",
            "zone_id": "vashi",
            "name": "Vashi Sector 17 & Palm Beach Cluster",
            "total_rooms": 5400,
            "available_rooms": 2808,
            "price": 3800,
            "lat": 19.0750,
            "lng": 72.9960
        },
        {
            "id": "htl-thane-cluster",
            "zone_id": "thane",
            "name": "Thane West Ghodbunder & Station Cluster",
            "total_rooms": 4800,
            "available_rooms": 2736,
            "price": 3200,
            "lat": 19.2150,
            "lng": 72.9750
        },
        {
            "id": "htl-navi-mumbai-cluster",
            "zone_id": "navi-mumbai",
            "name": "Belapur & Kharghar Modern Stays",
            "total_rooms": 3600,
            "available_rooms": 2052,
            "price": 3000,
            "lat": 19.0310,
            "lng": 73.0270
        }
    ]

    # 4. Stations (Mumbai railway & transit network)
    stations = [
        {
            "id": "stn-curry-road",
            "name": "Curry Road",
            "line": "Central Line (Slow)",
            "capacity": 35000,
            "current_load": 32900,
            "lat": 18.9944,
            "lng": 72.8329
        },
        {
            "id": "stn-chinchpokli",
            "name": "Chinchpokli",
            "line": "Central Line (Slow)",
            "capacity": 25000,
            "current_load": 21750,
            "lat": 18.9880,
            "lng": 72.8322
        },
        {
            "id": "stn-parel",
            "name": "Parel",
            "line": "Central Line (Slow/Fast)",
            "capacity": 40000,
            "current_load": 31200,
            "lat": 18.9982,
            "lng": 72.8415
        },
        {
            "id": "stn-lower-parel",
            "name": "Lower Parel",
            "line": "Western Line (Slow/Fast)",
            "capacity": 45000,
            "current_load": 32850,
            "lat": 18.9950,
            "lng": 72.8290
        },
        {
            "id": "stn-dadar",
            "name": "Dadar Central & Western Interchange",
            "line": "Central & Western Mainline",
            "capacity": 120000,
            "current_load": 98400,
            "lat": 19.0178,
            "lng": 72.8478
        },
        {
            "id": "stn-byculla",
            "name": "Byculla",
            "line": "Central Line (Slow/Fast)",
            "capacity": 30000,
            "current_load": 20400,
            "lat": 18.9750,
            "lng": 72.8320
        },
        {
            "id": "stn-csmt",
            "name": "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
            "line": "Central & Harbour Terminal",
            "capacity": 150000,
            "current_load": 97500,
            "lat": 18.9400,
            "lng": 72.8354
        },
        {
            "id": "stn-churchgate",
            "name": "Churchgate",
            "line": "Western Terminal",
            "capacity": 130000,
            "current_load": 78000,
            "lat": 18.9320,
            "lng": 72.8260
        },
        {
            "id": "stn-andheri",
            "name": "Andheri Station & Metro Line 1",
            "line": "Western & Metro Interchange",
            "capacity": 110000,
            "current_load": 63800,
            "lat": 19.1197,
            "lng": 72.8468
        },
        {
            "id": "stn-vashi",
            "name": "Vashi",
            "line": "Harbour Line",
            "capacity": 50000,
            "current_load": 24000,
            "lat": 19.0771,
            "lng": 72.9986
        },
        {
            "id": "stn-thane",
            "name": "Thane",
            "line": "Central Mainline & Trans-Harbour",
            "capacity": 90000,
            "current_load": 39600,
            "lat": 19.2183,
            "lng": 72.9781
        }
    ]

    # 5. Roads (corridors and arterial arteries)
    roads = [
        {
            "id": "road-dr-ba-road",
            "source": "Lalbaug",
            "target": "Dadar",
            "capacity": 6500,
            "travel_time": 34,
            "status": "OPEN",
            "closure_start": None,
            "closure_end": None
        },
        {
            "id": "road-sane-guruji",
            "source": "Curry Road",
            "target": "Chinchpokli",
            "capacity": 2800,
            "travel_time": 28,
            "status": "RESTRICTED",
            "closure_start": "16:00",
            "closure_end": "23:59"
        },
        {
            "id": "road-eastern-freeway",
            "source": "South Mumbai (Orange Gate)",
            "target": "Anik Interchange (Chembur/Thane)",
            "capacity": 7200,
            "travel_time": 14,
            "status": "OPEN",
            "closure_start": None,
            "closure_end": None
        },
        {
            "id": "road-tilak-bridge",
            "source": "Dadar East",
            "target": "Dadar West",
            "capacity": 4200,
            "travel_time": 24,
            "status": "RESTRICTED",
            "closure_start": "17:30",
            "closure_end": "22:00"
        },
        {
            "id": "road-lalbaug-flyover",
            "source": "Byculla North",
            "target": "Parel Junction",
            "capacity": 5000,
            "travel_time": 16,
            "status": "OPEN",
            "closure_start": None,
            "closure_end": None
        },
        {
            "id": "road-nm-joshi",
            "source": "Lower Parel",
            "target": "Curry Road",
            "capacity": 3200,
            "travel_time": 22,
            "status": "OPEN",
            "closure_start": None,
            "closure_end": None
        },
        {
            "id": "road-marine-drive",
            "source": "Nariman Point",
            "target": "Girgaon Chowpatty",
            "capacity": 6000,
            "travel_time": 18,
            "status": "OPEN",
            "closure_start": None,
            "closure_end": None
        }
    ]

    # 6. Crowd State (Current deterministic evening snapshot)
    now_ts = "2026-09-08T18:00:00Z"
    crowd_states = [
        {
            "id": "cs-south-mumbai",
            "timestamp": now_ts,
            "zone_id": "south-mumbai",
            "people": 142000,
            "arrival_rate": 8400,
            "departure_rate": 6100,
            "pressure": 86
        },
        {
            "id": "cs-lalbaug",
            "timestamp": now_ts,
            "zone_id": "lalbaug",
            "people": 188000,
            "arrival_rate": 14200,
            "departure_rate": 9800,
            "pressure": 92
        },
        {
            "id": "cs-girgaon",
            "timestamp": now_ts,
            "zone_id": "girgaon",
            "people": 96000,
            "arrival_rate": 7800,
            "departure_rate": 5900,
            "pressure": 84
        },
        {
            "id": "cs-curry-road",
            "timestamp": now_ts,
            "zone_id": "curry-road",
            "people": 64000,
            "arrival_rate": 8900,
            "departure_rate": 5200,
            "pressure": 94
        },
        {
            "id": "cs-dadar",
            "timestamp": now_ts,
            "zone_id": "dadar",
            "people": 165000,
            "arrival_rate": 11500,
            "departure_rate": 9800,
            "pressure": 82
        },
        {
            "id": "cs-parel",
            "timestamp": now_ts,
            "zone_id": "parel",
            "people": 78000,
            "arrival_rate": 5600,
            "departure_rate": 4800,
            "pressure": 76
        },
        {
            "id": "cs-byculla",
            "timestamp": now_ts,
            "zone_id": "byculla",
            "people": 52000,
            "arrival_rate": 4100,
            "departure_rate": 3900,
            "pressure": 68
        },
        {
            "id": "cs-andheri",
            "timestamp": now_ts,
            "zone_id": "andheri",
            "people": 128000,
            "arrival_rate": 7200,
            "departure_rate": 7000,
            "pressure": 58
        },
        {
            "id": "cs-thane",
            "timestamp": now_ts,
            "zone_id": "thane",
            "people": 88000,
            "arrival_rate": 4500,
            "departure_rate": 4900,
            "pressure": 44
        },
        {
            "id": "cs-vashi",
            "timestamp": now_ts,
            "zone_id": "vashi",
            "people": 72000,
            "arrival_rate": 3800,
            "departure_rate": 4200,
            "pressure": 48
        },
        {
            "id": "cs-navi-mumbai",
            "timestamp": now_ts,
            "zone_id": "navi-mumbai",
            "people": 58000,
            "arrival_rate": 2900,
            "departure_rate": 3400,
            "pressure": 41
        }
    ]

    # 7. Predictions (Deterministic baseline forecast structure for Phase 2)
    predictions = [
        {
            "id": "pred-curry-road-2100",
            "zone_id": "curry-road",
            "forecast_time": "2026-09-08T21:00:00Z",
            "predicted_people": 74500,
            "predicted_pressure": 91,
            "confidence": 0.88,
            "reason_codes": json.dumps(["PEAK_DARSHAN_SLOT", "CENTRAL_LINE_SURGE", "BOTTLENECK_STATION_INGRESS"])
        },
        {
            "id": "pred-lalbaug-2100",
            "zone_id": "lalbaug",
            "forecast_time": "2026-09-08T21:00:00Z",
            "predicted_people": 215000,
            "predicted_pressure": 96,
            "confidence": 0.91,
            "reason_codes": json.dumps(["PEAK_DARSHAN_SLOT", "PROCESSION_GATHERING"])
        },
        {
            "id": "pred-dadar-2100",
            "zone_id": "dadar",
            "forecast_time": "2026-09-08T21:00:00Z",
            "predicted_people": 182000,
            "predicted_pressure": 85,
            "confidence": 0.86,
            "reason_codes": json.dumps(["TRANSFER_PASSENGERS_SPIKE"])
        },
        {
            "id": "pred-girgaon-2100",
            "zone_id": "girgaon",
            "forecast_time": "2026-09-08T21:00:00Z",
            "predicted_people": 125000,
            "predicted_pressure": 89,
            "confidence": 0.84,
            "reason_codes": json.dumps(["NIGHT_IMMERSION_PROCESSION"])
        },
        {
            "id": "pred-thane-2100",
            "zone_id": "thane",
            "forecast_time": "2026-09-08T21:00:00Z",
            "predicted_people": 91000,
            "predicted_pressure": 46,
            "confidence": 0.90,
            "reason_codes": json.dumps(["STABLE_SUBURBAN_CAPACITY"])
        },
        {
            "id": "pred-vashi-2100",
            "zone_id": "vashi",
            "forecast_time": "2026-09-08T21:00:00Z",
            "predicted_people": 74000,
            "predicted_pressure": 49,
            "confidence": 0.89,
            "reason_codes": json.dumps(["HARBOUR_LINE_SMOOTH_FLOW"])
        }
    ]

    # 8. Actions (Intervention structures)
    actions = [
        {
            "id": "act-curry-road-diversion",
            "type": "VISITOR_REDISTRIBUTION",
            "target": "Thane & Vashi Buffer Zones",
            "percentage": 18,
            "affected_people": 14200,
            "expected_result": "Curry Road 94% → 76%",
            "status": "recommended"
        },
        {
            "id": "act-dadar-shuttle",
            "type": "TRANSIT_AUGMENTATION",
            "target": "Dadar TT - Eastern Freeway Corridor",
            "percentage": 25,
            "affected_people": 8500,
            "expected_result": "Dr BA Road Congestion -14%",
            "status": "approved"
        },
        {
            "id": "act-vms-freeway",
            "type": "TRAFFIC_SIGNAGE",
            "target": "Eastern Freeway Northbound",
            "percentage": 30,
            "affected_people": 12000,
            "expected_result": "Directing suburban traffic to Vashi Hub",
            "status": "active"
        },
        {
            "id": "act-girgaon-crowd-gate",
            "type": "QUEUE_REGULATION",
            "target": "Girgaon Chowpatty North Gate",
            "percentage": 15,
            "affected_people": 6000,
            "expected_result": "Buffer density stabilization",
            "status": "simulated"
        }
    ]

    # 9. Scenarios
    scenarios = [
        {
            "id": "scen-heavy-rain",
            "name": "Heavy Monsoon Downpour",
            "description": "Sudden 40mm/hr rainfall across South & Central Mumbai causing rail speed restrictions.",
            "active": False,
            "effects": json.dumps({"transit_capacity_reduction": 0.25, "road_speed_reduction": 0.40})
        },
        {
            "id": "scen-central-line-disruption",
            "name": "Central Line Power Glitch",
            "description": "25-minute signal outage near Byculla causing bottleneck backup at Curry Road & Parel.",
            "active": False,
            "effects": json.dumps({"central_line_capacity": 0.40, "curry_road_pressure_spike": 0.15})
        },
        {
            "id": "scen-procession-delay",
            "name": "Major Procession Hold",
            "description": "Lalbaug VIP procession delayed by 90 minutes at Dr. BA Road junction.",
            "active": False,
            "effects": json.dumps({"queue_duration_extension": "90min", "girgaon_capacity_buffer": -0.20})
        },
        {
            "id": "scen-dr-ba-road-closure",
            "name": "Dr. BA Road Emergency Diversion",
            "description": "Full pedestrianization of Dr. BA Road between Lalbaug and Dadar TT.",
            "active": False,
            "effects": json.dumps({"dr_ba_road": "CLOSED", "diversion_corridor": "Eastern Freeway"})
        }
    ]

    # 10. Welfare Amenities (Civic support points)
    welfare = [
        {
            "id": "wlf-water-lalbaug",
            "name": "Lalbaug Market Free Drinking Water Kiosk",
            "type": "water",
            "latitude": 18.9918,
            "longitude": 72.8372,
            "capacity": 5000,
            "status": "ACTIVE"
        },
        {
            "id": "wlf-water-bharat-mata",
            "name": "Bharat Mata Cinema Water Refill Station",
            "type": "water",
            "latitude": 18.9955,
            "longitude": 72.8385,
            "capacity": 4000,
            "status": "ACTIVE"
        },
        {
            "id": "wlf-water-curry-road",
            "name": "Curry Road Station West Water Post",
            "type": "water",
            "latitude": 18.9946,
            "longitude": 72.8322,
            "capacity": 3500,
            "status": "CONGESTED"
        },
        {
            "id": "wlf-med-kem",
            "name": "KEM Hospital Emergency First-Aid Base",
            "type": "medical",
            "latitude": 18.9995,
            "longitude": 72.8430,
            "capacity": 150,
            "status": "ACTIVE"
        },
        {
            "id": "wlf-med-lalbaug-raja",
            "name": "Lalbaug Raja Parivar Medical Outpost",
            "type": "medical",
            "latitude": 18.9908,
            "longitude": 72.8382,
            "capacity": 60,
            "status": "ACTIVE"
        },
        {
            "id": "wlf-med-dadar-stjohn",
            "name": "Dadar TT St. John Ambulance Mobile Unit",
            "type": "medical",
            "latitude": 19.0182,
            "longitude": 72.8485,
            "capacity": 40,
            "status": "ACTIVE"
        },
        {
            "id": "wlf-toilet-dr-ba-road",
            "name": "Dr. BA Road North Mobile Sanitation Unit",
            "type": "toilet",
            "latitude": 18.9930,
            "longitude": 72.8360,
            "capacity": 80,
            "status": "ACTIVE"
        },
        {
            "id": "wlf-toilet-curry-east",
            "name": "Curry Road East Public Restroom Facility",
            "type": "toilet",
            "latitude": 18.9942,
            "longitude": 72.8335,
            "capacity": 50,
            "status": "CONGESTED"
        },
        {
            "id": "wlf-rest-curry-road",
            "name": "Curry Road Senior Citizen Shelter",
            "type": "rest",
            "latitude": 18.9938,
            "longitude": 72.8318,
            "capacity": 120,
            "status": "ACTIVE"
        },
        {
            "id": "wlf-rest-ganesh-galli",
            "name": "Ganesh Galli Pilgrim Rest Center",
            "type": "rest",
            "latitude": 18.9922,
            "longitude": 72.8358,
            "capacity": 200,
            "status": "ACTIVE"
        },
        {
            "id": "wlf-food-lalbaug-seva",
            "name": "Lalbaug Mandap Annadanam Seva Camp",
            "type": "food",
            "latitude": 18.9902,
            "longitude": 72.8375,
            "capacity": 15000,
            "status": "ACTIVE"
        },
        {
            "id": "wlf-food-dadar-langar",
            "name": "Dadar East Community Refreshment Center",
            "type": "food",
            "latitude": 19.0190,
            "longitude": 72.8465,
            "capacity": 8000,
            "status": "ACTIVE"
        }
    ]

    # 11. Alerts (Calibrated to current evening pressure)
    alerts = [
        {
            "id": "alt-curry-road-surge",
            "severity": "CRITICAL",
            "title": "Curry Road Station Platform Surge",
            "description": "Platform 1 & 2 crowd density reached 94% capacity. High risk of platform overflow during Slow Local arrivals.",
            "timeframe": "Next 45 min",
            "zone_id": "curry-road"
        },
        {
            "id": "alt-lalbaug-queue-spillover",
            "severity": "HIGH",
            "title": "Lalbaug Darshan Queue Encroaching Dr. BA Road",
            "description": "General darshan queue tail has extended 600m onto Dr. Babasaheb Ambedkar Road north carriageway.",
            "timeframe": "Immediate",
            "zone_id": "lalbaug"
        },
        {
            "id": "alt-lower-parel-bridge-delay",
            "severity": "HIGH",
            "title": "Lower Parel - Curry Road Bridge Slowdown",
            "description": "Pedestrian and emergency vehicle passage constrained. Average crossing delay +18 min.",
            "timeframe": "Ongoing",
            "zone_id": "curry-road"
        },
        {
            "id": "alt-dadar-tt-slowdown",
            "severity": "WARNING",
            "title": "Dadar TT Circle Traffic Slowdown",
            "description": "Vehicular speeds reduced to 8 km/h due to incoming suburban pilgrim buses.",
            "timeframe": "Next 2 hours",
            "zone_id": "dadar"
        }
    ]

    return {
        "zones": zones,
        "locations": locations,
        "hotels": hotels,
        "stations": stations,
        "roads": roads,
        "crowd_states": crowd_states,
        "predictions": predictions,
        "actions": actions,
        "scenarios": scenarios,
        "welfare": welfare,
        "alerts": alerts
    }
