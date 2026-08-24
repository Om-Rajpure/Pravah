"""
PRAVAAH Scenario API Routes
Phase 9 — Endpoints for What-If Simulation, Scenario Overlays, and 3-Way Scorecards
"""

from flask import Blueprint, jsonify, request
from services.scenario_service import get_scenario_engine

scenarios_bp = Blueprint('scenarios', __name__)

@scenarios_bp.route('/api/scenarios', methods=['GET'])
def get_all_scenarios():
    """Returns list of registered scenarios."""
    try:
        engine = get_scenario_engine()
        scenarios = engine.get_available_scenarios()
        return jsonify(scenarios)
    except Exception as e:
        return jsonify({"error": "Failed to get scenarios", "message": str(e)}), 500

@scenarios_bp.route('/api/scenarios/<scenario_id>', methods=['GET'])
def get_scenario_detail(scenario_id):
    """Returns definition and parameters for a specific scenario."""
    try:
        engine = get_scenario_engine()
        data = engine.get_scenario_definition(scenario_id)
        if data:
            return jsonify(data)
        return jsonify({"error": f"Scenario {scenario_id} not found"}), 404
    except Exception as e:
        return jsonify({"error": "Failed to fetch scenario", "message": str(e)}), 500

@scenarios_bp.route('/api/scenarios/simulate', methods=['POST'])
def simulate_what_if():
    """
    Runs an isolated What-If scenario simulation without mutating live state.
    Returns 3-way scorecard: BASELINE vs DISRUPTION vs + PRAVAAH ACTION.
    """
    try:
        data = request.get_json() or {}
        scenario_id = data.get('scenario_id', 'central-line-disruption')
        engine = get_scenario_engine()
        res = engine.simulate_scenario(scenario_id)
        if "error" in res:
            return jsonify(res), 404
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Scenario simulation failed", "message": str(e)}), 500

@scenarios_bp.route('/api/scenarios/activate', methods=['POST'])
def activate_scenario():
    """
    Applies scenario overlay to live demo state.
    """
    try:
        data = request.get_json() or {}
        scenario_id = data.get('scenario_id', 'central-line-disruption')
        engine = get_scenario_engine()
        res = engine.activate_scenario(scenario_id)
        if "error" in res:
            return jsonify(res), 404
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Scenario activation failed", "message": str(e)}), 500

@scenarios_bp.route('/api/scenarios/reset', methods=['POST'])
def reset_scenario():
    """
    Restores baseline city state.
    """
    try:
        engine = get_scenario_engine()
        res = engine.reset_scenario()
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Scenario reset failed", "message": str(e)}), 500

@scenarios_bp.route('/api/scenarios/current', methods=['GET'])
def get_current_scenario():
    """
    Returns currently active scenario.
    """
    try:
        engine = get_scenario_engine()
        res = engine.get_current_scenario()
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Failed to get current scenario", "message": str(e)}), 500
