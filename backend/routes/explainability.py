"""
PRAVAAH Explainability & Decision Audit API Routes
Phase 10 — Endpoints for Glass Box Reasoning, Decision Lineage, and Audit Trail
"""

from flask import Blueprint, jsonify, request
from services.explainability_service import get_explainability_engine

explainability_bp = Blueprint('explainability', __name__)

@explainability_bp.route('/api/explanations/prediction/<zone_id>', methods=['GET'])
def get_prediction_explanation(zone_id):
    """
    Returns structured Glass Box reasoning for a zone forecast.
    """
    try:
        engine = get_explainability_engine()
        exp = engine.explain_prediction(zone_id)
        
        detail_mode = request.args.get('detail', 'operational')
        res = {
            'decision_id': exp.decision_id,
            'type': exp.type,
            'summary': exp.summary,
            'what': exp.what,
            'why': exp.why,
            'network_effect': exp.network_effect,
            'impact': exp.impact,
            'confidence': exp.confidence,
            'assumptions': exp.assumptions,
            'limitations': exp.limitations,
            'data_sources': exp.data_sources,
            'timestamp': exp.timestamp,
            'versions': exp.versions,
            'trace': [{'stage': t.stage, 'title': t.title, 'message': t.message} for t in exp.trace]
        }
        
        if detail_mode == 'technical':
            res['technical_context'] = exp.technical_context
            
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Failed to generate prediction explanation", "message": str(e)}), 500

@explainability_bp.route('/api/explanations/intervention/<action_id>', methods=['GET'])
@explainability_bp.route('/api/explanations/intervention', methods=['GET'])
def get_intervention_explanation(action_id='act-redirect-curry-road-thane-18'):
    """
    Returns structured Glass Box reasoning for a recommended intervention.
    """
    try:
        engine = get_explainability_engine()
        exp = engine.explain_intervention(action_id)
        
        detail_mode = request.args.get('detail', 'operational')
        res = {
            'decision_id': exp.decision_id,
            'type': exp.type,
            'summary': exp.summary,
            'what': exp.what,
            'why': exp.why,
            'network_effect': exp.network_effect,
            'impact': exp.impact,
            'confidence': exp.confidence,
            'assumptions': exp.assumptions,
            'limitations': exp.limitations,
            'data_sources': exp.data_sources,
            'timestamp': exp.timestamp,
            'versions': exp.versions,
            'trace': [{'stage': t.stage, 'title': t.title, 'message': t.message} for t in exp.trace]
        }
        
        if detail_mode == 'technical':
            res['technical_context'] = exp.technical_context
            
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Failed to generate intervention explanation", "message": str(e)}), 500

@explainability_bp.route('/api/audit', methods=['GET'])
def get_audit_trail():
    """
    Returns chronological decision audit trail events.
    Optional query param: ?type=ACTION_RECOMMENDED
    """
    try:
        event_type = request.args.get('type')
        engine = get_explainability_engine()
        trail = engine.get_audit_trail(event_type)
        return jsonify(trail)
    except Exception as e:
        return jsonify({"error": "Failed to fetch audit trail", "message": str(e)}), 500
