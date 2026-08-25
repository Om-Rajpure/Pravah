"""
PRAVAAH Visitor API Routes
Phase 11 — Public-Safe Endpoints for Visitor-Facing Experience
"""

from flask import Blueprint, jsonify, request
from services.visitor_recommendation import get_visitor_engine
from services.privacy_service import to_public_recommendation

visitor_bp = Blueprint('visitor', __name__)


@visitor_bp.route('/api/visitor/destinations', methods=['GET'])
def get_destinations():
    """Returns all visitor-safe destination list with current crowd levels."""
    try:
        engine = get_visitor_engine()
        dests = engine.get_all_destinations()
        return jsonify(dests)
    except Exception as e:
        return jsonify({'error': 'Failed to load destinations', 'message': str(e)}), 500


@visitor_bp.route('/api/visitor/destinations/<destination_id>', methods=['GET'])
def get_destination_detail(destination_id):
    """Returns detailed public-safe destination profile with crowd forecast."""
    try:
        engine = get_visitor_engine()
        detail = engine.get_destination_detail(destination_id)
        if not detail:
            return jsonify({'error': f'Destination {destination_id} not found'}), 404
        return jsonify(detail)
    except Exception as e:
        return jsonify({'error': 'Failed to load destination', 'message': str(e)}), 500


@visitor_bp.route('/api/visitor/recommendations', methods=['POST'])
def get_visitor_recommendation():
    """
    Returns a visitor recommendation based on destination and preference.
    Never exposes operator intervention dosages, individual visitor data, or model internals.
    Body: { "destination_id": "...", "preference": "LESS_CROWDED" }
    """
    try:
        body = request.get_json() or {}
        destination_id = body.get('destination_id', 'lalbaugcha-raja')
        preference = body.get('preference', 'LESS_CROWDED')
        if preference not in ('LESS_CROWDED', 'FASTEST', 'AVOID_DISRUPTION', 'LOWER_TRAVEL_TIME'):
            preference = 'LESS_CROWDED'

        engine = get_visitor_engine()
        rec = engine.get_recommendation(destination_id, preference)
        return jsonify(rec)
    except Exception as e:
        return jsonify({'error': 'Recommendation failed', 'message': str(e)}), 500


@visitor_bp.route('/api/visitor/conditions', methods=['GET'])
def get_current_conditions():
    """Returns current public-safe city-wide conditions summary."""
    try:
        engine = get_visitor_engine()
        dests = engine.get_all_destinations()
        total = len(dests)
        busy = sum(1 for d in dests if d['crowd_level'] in ('HIGH', 'CRITICAL'))
        moderate = sum(1 for d in dests if d['crowd_level'] == 'MODERATE')
        quiet = total - busy - moderate
        return jsonify({
            'total_destinations': total,
            'busy_count': busy,
            'moderate_count': moderate,
            'quiet_count': quiet,
            'overall_status': 'BUSY' if busy > total // 2 else 'MODERATE',
            'data_label': 'SIMULATED · AGGREGATED',
        })
    except Exception as e:
        return jsonify({'error': 'Failed to load conditions', 'message': str(e)}), 500
