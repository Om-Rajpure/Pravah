from flask import Blueprint, jsonify
from services.transport_service import get_transport_network

transport_bp = Blueprint('transport', __name__)

@transport_bp.route('/api/transport', methods=['GET'])
def get_transport():
    transport_data = get_transport_network()
    return jsonify(transport_data)
