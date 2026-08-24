from flask import Blueprint, jsonify
from services.city_service import get_city_overview

overview_bp = Blueprint('overview', __name__)

@overview_bp.route('/api/overview', methods=['GET'])
def get_overview_endpoint():
    overview = get_city_overview()
    return jsonify(overview)
