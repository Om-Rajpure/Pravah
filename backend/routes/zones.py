from flask import Blueprint, jsonify
from services.zone_service import get_all_zones, get_zone_by_id

zones_bp = Blueprint('zones', __name__)

@zones_bp.route('/api/zones', methods=['GET'])
def list_zones():
    zones = get_all_zones()
    return jsonify(zones)

@zones_bp.route('/api/zones/<zone_id>', methods=['GET'])
def get_zone(zone_id):
    zone = get_zone_by_id(zone_id)
    if not zone:
        return jsonify({"error": f"Zone '{zone_id}' not found"}), 404
    return jsonify(zone)
