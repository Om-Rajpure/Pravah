from flask import Blueprint, jsonify
from services.weather_service import weather_service

weather_bp = Blueprint('weather', __name__)

@weather_bp.route('/api/weather', methods=['GET'])
def get_weather():
    data = weather_service.get_weather()
    
    if data:
        return jsonify(data), 200
    else:
        return jsonify({
            "error": {
                "code": "WEATHER_UNAVAILABLE",
                "message": "Weather service is currently unavailable and no cached data exists."
            }
        }), 503
