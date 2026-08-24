from routes.health import health_bp
from routes.overview import overview_bp
from routes.zones import zones_bp
from routes.hotels import hotels_bp
from routes.transport import transport_bp
from routes.welfare import welfare_bp
from routes.map import map_bp

__all__ = [
    'health_bp',
    'overview_bp',
    'zones_bp',
    'hotels_bp',
    'transport_bp',
    'welfare_bp',
    'map_bp'
]
