from flask import Blueprint, jsonify
from config import Config

health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'service': Config.SERVICE_NAME,
        'version': Config.VERSION
    })
