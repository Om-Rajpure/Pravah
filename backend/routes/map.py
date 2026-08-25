from flask import Blueprint, jsonify
from services.map_service import get_unified_map_state

map_bp = Blueprint('map', __name__)

@map_bp.route('/api/map/state', methods=['GET'])
@map_bp.route('/api/map/unified-state', methods=['GET'])
def get_map_state():
    map_state = get_unified_map_state()
    return jsonify(map_state)
