from flask import Blueprint, jsonify
from services.hotel_service import get_hotel_analytics

hotels_bp = Blueprint('hotels', __name__)

@hotels_bp.route('/api/hotels', methods=['GET'])
def list_hotels():
    hotel_data = get_hotel_analytics()
    return jsonify(hotel_data)
