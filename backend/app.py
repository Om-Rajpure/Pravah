import sys
# Prevent DuckDB from attempting to load Anaconda's binary-incompatible pandas 1.x with NumPy 2.x
sys.modules['pandas'] = None

import logging
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from data.db import init_db, get_db
from validation import validate_database_integrity
from utils.errors import make_error_response

from routes.health import health_bp
from routes.demo import demo_bp
from routes.overview import overview_bp
from routes.zones import zones_bp
from routes.hotels import hotels_bp
from routes.transport import transport_bp
from routes.welfare import welfare_bp
from routes.map import map_bp
from routes.simulation import simulation_bp
from routes.network import network_bp
from routes.predictions import predictions_bp
from routes.actions import actions_bp
from routes.scenarios import scenarios_bp
from routes.explainability import explainability_bp
from routes.visitor import visitor_bp
from routes.privacy import privacy_bp
from routes.weather import weather_bp
from routes.auth import auth_bp

logging.basicConfig(
    level=logging.INFO if Config.ENV == 'production' else logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger('pravaah')

def create_app():
    Config.validate_startup_config()
    
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Security Headers Middleware
    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        # Relaxed CSP for map tiles and styles
        response.headers['Content-Security-Policy'] = (
            "default-src 'self'; "
            "img-src 'self' data: https: blob:; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' data: https://fonts.gstatic.com; "
            "connect-src 'self' http: https: ws: wss:;"
        )
        return response

    # Global 404 Handler
    @app.errorhandler(404)
    def resource_not_found(e):
        return make_error_response("NOT_FOUND", "The requested endpoint or resource was not found", 404)

    # Global 500 Handler
    @app.errorhandler(500)
    def internal_server_error(e):
        logger.error(f"Internal server error: {e}", exc_info=True)
        return make_error_response("INTERNAL_SERVER_ERROR", "An unexpected server error occurred", 500)

    with app.app_context():
        try:
            logger.info("Initializing PRAVAAH DuckDB data architecture...")
            init_db()
            db_conn = get_db()
            validate_database_integrity(db_conn)
            logger.info("PRAVAAH Data Layer ready.")
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}", exc_info=True)
            raise e

    # Blueprint Registration
    app.register_blueprint(health_bp)
    app.register_blueprint(demo_bp)
    app.register_blueprint(overview_bp)
    app.register_blueprint(zones_bp)
    app.register_blueprint(hotels_bp)
    app.register_blueprint(transport_bp)
    app.register_blueprint(welfare_bp)
    app.register_blueprint(map_bp)
    app.register_blueprint(simulation_bp)
    app.register_blueprint(network_bp)
    app.register_blueprint(predictions_bp)
    app.register_blueprint(actions_bp)
    app.register_blueprint(scenarios_bp)
    app.register_blueprint(explainability_bp)
    app.register_blueprint(visitor_bp)
    app.register_blueprint(privacy_bp)
    app.register_blueprint(weather_bp)
    app.register_blueprint(auth_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
