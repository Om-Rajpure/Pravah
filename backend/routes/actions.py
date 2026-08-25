"""
PRAVAAH Action & Intervention API Routes
Phase 13 — Endpoints with Strict Validation & Standardized Errors
"""

from flask import Blueprint, jsonify, request
from services.intervention_service import get_intervention_engine
from utils.errors import make_error_response
from utils.validators import validate_id_string

actions_bp = Blueprint('actions', __name__)

@actions_bp.route('/api/actions/recommendations', methods=['GET'])
def get_action_recommendations():
    """
    Returns the top recommended action, simulated before/after impact,
    explainability reasons, and ranked alternative candidates.
    """
    try:
        engine = get_intervention_engine()
        recs = engine.get_recommendations()
        return jsonify(recs)
    except Exception as e:
        return make_error_response("RECOMMENDATIONS_UNAVAILABLE", f"Failed to get recommendations: {str(e)}", 500)

@actions_bp.route('/api/actions/simulate', methods=['POST'])
def simulate_action():
    """
    Executes a counterfactual simulation for a candidate action.
    """
    try:
        data = request.get_json() or {}
        action_id = data.get('action_id', '')
        if action_id and not validate_id_string(action_id):
            return make_error_response("INVALID_ACTION_ID", "Action identifier format is invalid", 400)
            
        engine = get_intervention_engine()
        result = engine.simulate_action(action_id)
        return jsonify(result)
    except Exception as e:
        return make_error_response("SIMULATION_FAILED", f"Action simulation failed: {str(e)}", 500)

@actions_bp.route('/api/actions/<action_id>', methods=['GET'])
def get_action_details(action_id):
    """
    Returns metadata for a specific action ID.
    """
    try:
        if not validate_id_string(action_id):
            return make_error_response("INVALID_ACTION_ID", "Action identifier format is invalid", 400)
            
        engine = get_intervention_engine()
        recs = engine.get_recommendations()
        rec_act = recs.get("recommended_action", {})
        if rec_act.get("id") == action_id:
            return jsonify({
                "action": rec_act,
                "impact": recs.get("impact", {}),
                "why": recs.get("why_this_action", [])
            })
        return make_error_response("ACTION_NOT_FOUND", f"Action {action_id} not found", 404)
    except Exception as e:
        return make_error_response("FETCH_ACTION_FAILED", str(e), 500)

@actions_bp.route('/api/actions/<action_id>/approve', methods=['POST'])
def approve_action(action_id):
    """
    Sets action status to ACTIVE in the simulation prototype environment.
    """
    try:
        if not validate_id_string(action_id):
            return make_error_response("INVALID_ACTION_ID", "Action identifier format is invalid", 400)
            
        engine = get_intervention_engine()
        res = engine.approve_action(action_id)
        return jsonify(res)
    except Exception as e:
        return make_error_response("APPROVAL_FAILED", f"Failed to approve action: {str(e)}", 500)

@actions_bp.route('/api/actions/reset', methods=['POST'])
def reset_actions():
    """
    Restores baseline actions state.
    """
    try:
        engine = get_intervention_engine()
        engine.reset_actions()
        return jsonify({"message": "Actions reset to baseline", "status": "RESET_SUCCESS"})
    except Exception as e:
        return make_error_response("RESET_FAILED", f"Failed to reset actions: {str(e)}", 500)
