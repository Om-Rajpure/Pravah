import os
import logging

logger = logging.getLogger('pravaah.config')

class Config:
    SERVICE_NAME = 'pravaah'
    VERSION = '1.0.0'
    
    # Environment: development | demo | production
    ENV = os.environ.get('PRAVAAH_ENV', os.environ.get('FLASK_ENV', 'development')).lower()
    
    # Flags
    DEMO_MODE = os.environ.get('PRAVAAH_DEMO_MODE', 'true').lower() == 'true'
    DEBUG = os.environ.get('FLASK_DEBUG', 'false' if ENV == 'production' else 'true').lower() == 'true'
    
    # Network / Server
    HOST = os.environ.get('FLASK_HOST', '0.0.0.0')
    # Render injects PORT; fall back to FLASK_PORT for local dev
    PORT = int(os.environ.get('PORT', os.environ.get('FLASK_PORT', 5000)))

    # CORS Origins — comma-separated list via CORS_ORIGINS env var
    # Default includes localhost dev origins + production Vercel frontend
    _raw_cors = os.environ.get(
        'CORS_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,'
        'https://pravah-git-main-omrajpure3-8253s-projects.vercel.app,'
        'https://pravah-lake.vercel.app'
    )
    CORS_ORIGINS = [origin.strip() for origin in _raw_cors.split(',') if origin.strip()]
    
    # Central deterministic seed for synthetic city model
    DEMO_SEED = int(os.environ.get('DEMO_SEED', 20260908))
    
    # Database storage path (DuckDB: defaults to ':memory:' for zero-lock concurrency, or file path)
    DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    DB_PATH = os.environ.get('PRAVAAH_DB_PATH', ':memory:')
    
    # Map configuration
    MAP_TILE_URL = os.environ.get('MAP_TILE_URL', 'https://tiles.openfreemap.org/styles/liberty')
    
    # Event metadata
    EVENT_INFO = {
        'name': 'Ganesh Chaturthi 2026',
        'day': 'Day 9',
        'period': 'Evening',
        'time': '18:00',
        'city': 'Mumbai'
    }

    # Weather Integration
    WEATHER_LAT = 19.0760
    WEATHER_LON = 72.8777
    WEATHER_TIMEZONE = 'Asia/Kolkata'
    WEATHER_CACHE_TTL = 600  # 10 minutes

    # Crowd Simulation Engine Configuration
    SIMULATION_START_TIME = "18:00"
    SIMULATION_START_HOUR = 18
    SIMULATION_START_MINUTE = 0
    SIMULATION_STEP_MINUTES = 5
    DEFAULT_VISITOR_COUNT = int(os.environ.get('SIMULATION_VISITOR_COUNT', 10000))

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
        'loc-lalbaugcha-raja': 0.50,
        'loc-ganesh-galli': 0.22,
        'loc-khetwadi-12': 0.15,
        'loc-girgaon-chowpatty': 0.13
    }

    @classmethod
    def validate_startup_config(cls):
        """Validates critical startup configurations."""
        if not cls.MAP_TILE_URL:
            logger.warning("[CONFIG] MAP_TILE_URL not configured. Map may use default client tile set.")
        if cls.ENV == 'production' and cls.DEBUG:
            logger.warning("[SECURITY] DEBUG mode is enabled in production environment!")
        logger.info(f"[CONFIG] Environment: {cls.ENV} (Demo Mode: {cls.DEMO_MODE}, Seed: {cls.DEMO_SEED})")
