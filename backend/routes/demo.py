"""
PRAVAAH Demo Mode & Readiness API Routes
Phase 13 — Production Health, Readiness Probe, Demo Event Sequencing, and Reset
"""

from flask import Blueprint, jsonify
from services.demo_service import get_demo_service
from services.simulator import get_simulator
from data.db import get_db
from config import Config
from utils.errors import make_error_response

demo_bp = Blueprint('demo', __name__)



@demo_bp.route('/api/ready', methods=['GET'])
def readiness_check():
    """Readiness probe: validates DuckDB connection and simulator availability."""
    try:
        db = get_db()
        # Verify DuckDB query execution
        count = db.execute("SELECT COUNT(*) FROM zones").fetchone()[0]
        sim = get_simulator()
        if count > 0 and sim is not None:
            return jsonify({
                'ready': True,
                'zones_loaded': count,
                'simulator_ready': True,
                'environment': Config.ENV
            })
        return make_error_response("SERVICE_NOT_READY", "Database or simulator not initialized", 503)
    except Exception as e:
        return make_error_response("READINESS_FAILED", f"Readiness check failed: {str(e)}", 503)


@demo_bp.route('/api/demo/status', methods=['GET'])
def demo_status():
    """Returns current demo state, event index, and city status."""
    try:
        demo = get_demo_service()
        return jsonify(demo.get_status())
    except Exception as e:
        return make_error_response("DEMO_STATUS_ERROR", str(e), 500)


@demo_bp.route('/api/demo/reset', methods=['POST'])
def demo_reset():
    """
    Atomic full reset — restores simulation, network, scenario, prediction,
    explainability, and demo event index to canonical baseline.
    """
    try:
        demo = get_demo_service()
        state = demo.reset()
        return jsonify({'message': 'Demo reset to baseline', **state})
    except Exception as e:
        return make_error_response("DEMO_RESET_ERROR", str(e), 500)


@demo_bp.route('/api/demo/next-event', methods=['POST'])
def demo_next_event():
    """Advance the demo to the next canonical event in the sequence."""
    try:
        demo = get_demo_service()
        state = demo.next_event()
        return jsonify(state)
    except Exception as e:
        return make_error_response("DEMO_NEXT_EVENT_ERROR", str(e), 500)
