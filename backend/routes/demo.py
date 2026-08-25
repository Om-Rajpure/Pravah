"""
PRAVAAH Demo Mode API Routes
Phase 12 — Demo controls, event sequencing, and atomic reset
"""

from flask import Blueprint, jsonify
from services.demo_service import get_demo_service
from services.simulator import get_simulator
from config import Config

demo_bp = Blueprint('demo', __name__)


@demo_bp.route('/api/demo/status', methods=['GET'])
def demo_status():
    """Returns current demo state, event index, and city status."""
    demo = get_demo_service()
    return jsonify(demo.get_status())


@demo_bp.route('/api/demo/reset', methods=['POST'])
def demo_reset():
    """
    Atomic full reset — restores simulation, network, scenario, prediction,
    explainability, and demo event index to canonical baseline.
    """
    demo = get_demo_service()
    state = demo.reset()
    return jsonify({'message': 'Demo reset to baseline', **state})


@demo_bp.route('/api/demo/next-event', methods=['POST'])
def demo_next_event():
    """Advance the demo to the next canonical event in the sequence."""
    demo = get_demo_service()
    state = demo.next_event()
    return jsonify(state)


@demo_bp.route('/api/health', methods=['GET'])
def health_check():
    """Enhanced health check with simulation and demo status."""
    sim = get_simulator()
    sim_state = sim.get_state()
    demo = get_demo_service()
    demo_status = demo.get_status()
    return jsonify({
        'status': 'ok',
        'service': Config.SERVICE_NAME,
        'version': Config.VERSION,
        'simulation_time': sim_state.get('simulation_time', '18:00'),
        'simulation_status': sim_state.get('status', 'PAUSED'),
        'demo_active': demo_status.get('demo_active', True),
        'demo_event': demo_status.get('current_event', {}).get('label', 'Unknown'),
        'network_version': demo_status.get('network_version', 1),
        'active_scenario': demo_status.get('active_scenario'),
        'data_label': 'SIMULATION · SYNTHETIC',
    })
