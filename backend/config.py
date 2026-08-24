import os

class Config:
    SERVICE_NAME = 'pravaah'
    VERSION = '0.2.0'
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
