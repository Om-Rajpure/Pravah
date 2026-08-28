"""
PRAVAAH API — Vercel Python Serverless Entry Point

This module wraps the existing Flask application as a Vercel serverless function.
Vercel routes all /api/* requests to this handler via vercel.json configuration.
"""
import sys
import os

# Add backend directory to Python path so all existing imports work
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Set production environment defaults
os.environ.setdefault('PRAVAAH_ENV', 'production')
os.environ.setdefault('PRAVAAH_DEMO_MODE', 'true')
os.environ.setdefault('PRAVAAH_DB_PATH', ':memory:')

from app import create_app

# Create the Flask app instance (Vercel reuses this across warm invocations)
app = create_app()
