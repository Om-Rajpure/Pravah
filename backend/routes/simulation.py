"""
PRAVAAH Crowd Simulation API Routes
Phase 5 — Endpoints for dynamic crowd simulation state and controls.
"""

from flask import Blueprint, jsonify, request
from services.simulator import get_simulator

simulation_bp = Blueprint('simulation', __name__)

@simulation_bp.route('/api/simulation/state', methods=['GET'])
def get_simulation_state():
    """
    Returns the current aggregated geographic simulation state.
    Strict privacy-by-design: No individual visitor records are exposed.
    """
    try:
        simulator = get_simulator()
        state = simulator.get_state()
        return jsonify(state)
    except Exception as e:
        return jsonify({"error": "Simulation state unavailable", "message": str(e)}), 500

@simulation_bp.route('/api/simulation/time', methods=['GET'])
def get_simulation_time():
    """
    Returns current simulation clock and status.
    """
    try:
        simulator = get_simulator()
        return jsonify({
            "simulation_time": simulator.get_current_time_str(),
            "status": "RUNNING" if simulator.is_running else "PAUSED",
            "step": simulator.step_count,
            "step_minutes": simulator.step_minutes
        })
    except Exception as e:
        return jsonify({"error": "Failed to get simulation time", "message": str(e)}), 500

@simulation_bp.route('/api/simulation/start', methods=['POST'])
def start_simulation():
    """
    Sets simulation status to RUNNING.
    """
    try:
        simulator = get_simulator()
        res = simulator.start()
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Failed to start simulation", "message": str(e)}), 500

@simulation_bp.route('/api/simulation/pause', methods=['POST'])
def pause_simulation():
    """
    Sets simulation status to PAUSED.
    """
    try:
        simulator = get_simulator()
        res = simulator.pause()
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Failed to pause simulation", "message": str(e)}), 500

@simulation_bp.route('/api/simulation/step', methods=['POST'])
def step_simulation():
    """
    Advances simulation clock by 1 discrete step (5 minutes).
    """
    try:
        simulator = get_simulator()
        state = simulator.step()
        return jsonify(state)
    except Exception as e:
        return jsonify({"error": "Simulation step failed", "message": str(e)}), 500

@simulation_bp.route('/api/simulation/reset', methods=['POST'])
def reset_simulation():
    """
    Restores the initial 18:00 deterministic state.
    """
    try:
        simulator = get_simulator()
        simulator.reset()
        state = simulator.get_state()
        return jsonify({
            "message": "Simulation reset to 18:00 initial state",
            "state": state
        })
    except Exception as e:
        return jsonify({"error": "Simulation reset failed", "message": str(e)}), 500
