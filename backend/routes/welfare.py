from flask import Blueprint, jsonify
from services.welfare_service import get_welfare_amenities

welfare_bp = Blueprint('welfare', __name__)

@welfare_bp.route('/api/welfare', methods=['GET'])
def get_welfare():
    welfare_data = get_welfare_amenities()
    return jsonify(welfare_data)
