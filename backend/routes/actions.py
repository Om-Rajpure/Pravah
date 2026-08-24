"""
PRAVAAH Action & Intervention API Routes
Phase 8 — Endpoints for Action Recommendations, Counterfactual Simulation, and Approvals
"""

from flask import Blueprint, jsonify, request
from services.intervention_service import get_intervention_engine

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
        return jsonify({"error": "Failed to get recommendations", "message": str(e)}), 500

@actions_bp.route('/api/actions/simulate', methods=['POST'])
def simulate_action():
    """
    Executes a counterfactual simulation for a candidate action.
    """
    try:
        data = request.get_json() or {}
        action_id = data.get('action_id', '')
        engine = get_intervention_engine()
        result = engine.simulate_action(action_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": "Action simulation failed", "message": str(e)}), 500

@actions_bp.route('/api/actions/<action_id>', methods=['GET'])
def get_action_details(action_id):
    """
    Returns metadata for a specific action ID.
    """
    try:
        engine = get_intervention_engine()
        recs = engine.get_recommendations()
        rec_act = recs.get("recommended_action", {})
        if rec_act.get("id") == action_id:
            return jsonify({
                "action": rec_act,
                "impact": recs.get("impact", {}),
                "why": recs.get("why_this_action", [])
            })
        return jsonify({"error": f"Action {action_id} not found"}), 404
    except Exception as e:
        return jsonify({"error": "Failed to fetch action details", "message": str(e)}), 500

@actions_bp.route('/api/actions/<action_id>/approve', methods=['POST'])
def approve_action(action_id):
    """
    Sets action status to ACTIVE in the simulation prototype environment.
    """
    try:
        engine = get_intervention_engine()
        res = engine.approve_action(action_id)
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Failed to approve action", "message": str(e)}), 500

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
        return jsonify({"error": "Failed to reset actions", "message": str(e)}), 500
