import logging
from flask import Flask
from flask_cors import CORS
from config import Config
from data.db import init_db, get_db
from validation import validate_database_integrity

from routes.health import health_bp
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

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger('pravaah')

def create_app():
    app = Flask(__name__)
    
    # Enable CORS
    CORS(app, origins=Config.CORS_ORIGINS)
    
    # Initialize DuckDB & deterministic seed
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
            
    # Register blueprints
    app.register_blueprint(health_bp)
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
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
