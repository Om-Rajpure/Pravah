"""
PRAVAAH Scenario API Routes
Phase 13 — Validated Scenario Injection & What-If Simulation
"""

from flask import Blueprint, jsonify, request
from services.scenario_service import get_scenario_engine
from utils.errors import make_error_response
from utils.validators import validate_scenario_id

scenarios_bp = Blueprint('scenarios', __name__)

@scenarios_bp.route('/api/scenarios', methods=['GET'])
def get_all_scenarios():
    """Returns list of registered scenarios."""
    try:
        engine = get_scenario_engine()
        scenarios = engine.get_available_scenarios()
        return jsonify(scenarios)
    except Exception as e:
        return make_error_response("SCENARIOS_FETCH_FAILED", str(e), 500)

@scenarios_bp.route('/api/scenarios/<scenario_id>', methods=['GET'])
def get_scenario_detail(scenario_id):
    """Returns definition and parameters for a specific scenario."""
    try:
        is_valid, err = validate_scenario_id(scenario_id)
        if not is_valid:
            return make_error_response("INVALID_SCENARIO_ID", err, 400)
            
        engine = get_scenario_engine()
        data = engine.get_scenario_definition(scenario_id)
        if data:
            return jsonify(data)
        return make_error_response("SCENARIO_NOT_FOUND", f"Scenario {scenario_id} not found", 404)
    except Exception as e:
        return make_error_response("FETCH_SCENARIO_FAILED", str(e), 500)

@scenarios_bp.route('/api/scenarios/simulate', methods=['POST'])
def simulate_what_if():
    """
    Runs an isolated What-If scenario simulation without mutating live state.
    Returns 3-way scorecard: BASELINE vs DISRUPTION vs + PRAVAAH ACTION.
    """
    try:
        data = request.get_json() or {}
        scenario_id = data.get('scenario_id', 'central-line-disruption')
        is_valid, err = validate_scenario_id(scenario_id)
        if not is_valid:
            return make_error_response("INVALID_SCENARIO_ID", err, 400)
            
        engine = get_scenario_engine()
        res = engine.simulate_scenario(scenario_id)
        if "error" in res:
            return make_error_response("SCENARIO_SIMULATION_ERROR", res["error"], 404)
        return jsonify(res)
    except Exception as e:
        return make_error_response("SIMULATION_EXECUTION_FAILED", str(e), 500)

@scenarios_bp.route('/api/scenarios/activate', methods=['POST'])
def activate_scenario():
    """
    Applies scenario overlay to live demo state.
    """
    try:
        data = request.get_json() or {}
        scenario_id = data.get('scenario_id', 'central-line-disruption')
        is_valid, err = validate_scenario_id(scenario_id)
        if not is_valid:
            return make_error_response("INVALID_SCENARIO_ID", err, 400)
            
        engine = get_scenario_engine()
        res = engine.activate_scenario(scenario_id)
        if "error" in res:
            return make_error_response("SCENARIO_ACTIVATION_ERROR", res["error"], 404)
        return jsonify(res)
    except Exception as e:
        return make_error_response("ACTIVATION_EXECUTION_FAILED", str(e), 500)

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
        return make_error_response("SCENARIO_RESET_FAILED", str(e), 500)

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
        return make_error_response("GET_CURRENT_SCENARIO_FAILED", str(e), 500)
