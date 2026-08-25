import os

class Config:
    SERVICE_NAME = 'pravaah'
    VERSION = '1.0.0'
    DEMO_MODE = os.environ.get('PRAVAAH_DEMO_MODE', 'true').lower() == 'true'
    DEBUG = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    HOST = os.environ.get('FLASK_HOST', '0.0.0.0')
    PORT = int(os.environ.get('FLASK_PORT', 5000))
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',')
    
    # Central deterministic seed for synthetic city model
    DEMO_SEED = 20260908
    
    # Database storage path (DuckDB: defaults to ':memory:' for zero-lock concurrency, or file path)
    DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    DB_PATH = os.environ.get('PRAVAAH_DB_PATH', ':memory:')
    
    # Event metadata
    EVENT_INFO = {
        'name': 'Ganesh Chaturthi 2026',
        'day': 'Day 9',
        'period': 'Evening',
        'time': '18:00',
        'city': 'Mumbai'
    }

    # Phase 5 Crowd Simulation Engine Configuration
    SIMULATION_START_TIME = "18:00"
    SIMULATION_START_HOUR = 18
    SIMULATION_START_MINUTE = 0
    SIMULATION_STEP_MINUTES = 5
    DEFAULT_VISITOR_COUNT = 10000

    # Behavioral Group Probabilities
    BEHAVIOR_DISTRIBUTION = {
        'LOCAL': 0.40,
        'OUTSTATION': 0.20,
        'FAMILY': 0.18,
        'YOUNG': 0.12,
        'LOW_BUDGET': 0.05,
        'HIGH_BUDGET': 0.05
    }

    # Origin Zone Weights
    ORIGIN_WEIGHTS = {
        'andheri': 0.18,
        'dadar': 0.16,
        'south-mumbai': 0.14,
        'thane': 0.15,
        'vashi': 0.12,
        'navi-mumbai': 0.10,
        'byculla': 0.08,
        'parel': 0.07
    }

    # Event Destination Choices & Attractiveness Weights
    DESTINATION_WEIGHTS = {
        'loc-lalbaugcha-raja': 0.50, # Major epicenter
        'loc-ganesh-galli': 0.22,
        'loc-khetwadi-12': 0.15,
        'loc-girgaon-chowpatty': 0.13
    }
