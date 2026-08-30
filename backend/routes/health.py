from flask import Blueprint, jsonify
from services.demo_service import get_demo_service
from services.simulator import get_simulator
from config import Config
from utils.errors import make_error_response

health_bp = Blueprint('health', __name__)

@health_bp.route('/api/health', methods=['GET'])
def health_check():
    """Enhanced health check with simulation, environment, and demo status."""
    try:
        sim = get_simulator()
        sim_state = sim.get_state() if sim else {}
        demo = get_demo_service()
        demo_status = demo.get_status() if demo else {}
        return jsonify({
            'status': 'ok',
            'service': Config.SERVICE_NAME,
            'version': Config.VERSION,
            'environment': Config.ENV,
            'simulation_time': sim_state.get('simulation_time', '18:00'),
            'simulation_status': sim_state.get('status', 'PAUSED'),
            'demo_active': demo_status.get('demo_active', True),
            'demo_event': demo_status.get('current_event', {}).get('label', 'Baseline / Initialization'),
            'network_version': demo_status.get('network_version', 1),
            'active_scenario': demo_status.get('active_scenario'),
            'data_label': 'SIMULATION · SYNTHETIC',
        })
    except Exception as e:
        return make_error_response("HEALTH_CHECK_FAILED", f"Service degraded: {str(e)}", 503)

