"""
PRAVAAH Visitor API Routes
Phase 11 + Phase 20 — Public-Safe Endpoints with Input Validation, Network Routing, and Privacy Safeguards
"""

from flask import Blueprint, jsonify, request
from services.visitor_recommendation import get_visitor_engine
from utils.errors import make_error_response
from utils.validators import validate_destination_id, validate_visitor_preference

visitor_bp = Blueprint('visitor', __name__)


@visitor_bp.route('/api/visitor/destinations', methods=['GET'])
def get_destinations():
    """Returns all visitor-safe destination list with current crowd levels, categories, and trends."""
    try:
        engine = get_visitor_engine()
        dests = engine.get_all_destinations()
        return jsonify(dests)
    except Exception as e:
        return make_error_response("DESTINATIONS_LOAD_FAILED", f"Failed to load destinations: {str(e)}", 500)


@visitor_bp.route('/api/visitor/destinations/<destination_id>', methods=['GET'])
def get_destination_detail(destination_id):
    """Returns detailed public-safe destination profile with crowd forecast and disruption notices."""
    try:
        is_valid, err = validate_destination_id(destination_id)
        if not is_valid:
            return make_error_response("INVALID_DESTINATION", err, 404)

        engine = get_visitor_engine()
        detail = engine.get_destination_detail(destination_id)
        if not detail:
            return make_error_response("DESTINATION_NOT_FOUND", f"Destination {destination_id} not found", 404)
        return jsonify(detail)
    except Exception as e:
        return make_error_response("DESTINATION_FETCH_FAILED", str(e), 500)


@visitor_bp.route('/api/visitor/recommendations', methods=['POST'])
def get_visitor_recommendation():
    """
    Returns a visitor recommendation based on destination and preference.
    Body: { "destination_id": "...", "preference": "LESS_CROWDED" }
    """
    try:
        body = request.get_json() or {}
        destination_id = body.get('destination_id', 'lalbaugcha-raja')
        is_valid, err = validate_destination_id(destination_id)
        if not is_valid:
            return make_error_response("INVALID_DESTINATION", err, 400)

        raw_pref = body.get('preference', 'LESS_CROWDED')
        preference = validate_visitor_preference(raw_pref)

        engine = get_visitor_engine()
        rec = engine.get_recommendation(destination_id, preference)
        return jsonify(rec)
    except Exception as e:
        return make_error_response("RECOMMENDATION_FAILED", "Could not generate visitor guidance", 500)


@visitor_bp.route('/api/visitor/route', methods=['GET'])
def get_visitor_route():
    """
    Calculates dynamic route from origin to destination using Mumbai transit network.
    Params: ?from=stn-dadar&to=lalbaugcha-raja&alternative=false
    """
    try:
        origin = request.args.get('from', request.args.get('origin', 'stn-dadar'))
        destination = request.args.get('to', request.args.get('destination', 'lalbaugcha-raja'))
        prefer_alt = request.args.get('alternative', 'false').lower() in ('true', '1', 'yes')

        engine = get_visitor_engine()
        route_data = engine.get_visitor_route(
            origin_id=origin,
            destination_id=destination,
            prefer_alternative=prefer_alt
        )
        return jsonify(route_data)
    except Exception as e:
        return make_error_response("ROUTE_CALCULATION_FAILED", f"Could not calculate transit route: {str(e)}", 500)


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
        return make_error_response("CONDITIONS_LOAD_FAILED", str(e), 500)


@visitor_bp.route('/api/visitor/stay', methods=['GET'])
def get_visitor_stay():
    """Returns public-safe accommodation availability and suburban buffer advice."""
    try:
        engine = get_visitor_engine()
        stay_data = engine.get_visitor_stay_guidance()
        return jsonify(stay_data)
    except Exception as e:
        return make_error_response("STAY_LOAD_FAILED", f"Could not fetch accommodation guidance: {str(e)}", 500)


@visitor_bp.route('/api/visitor/support', methods=['GET'])
def get_visitor_support():
    """Returns civic welfare amenities: drinking water, first aid, police help desks, sanitation."""
    try:
        amenity_type = request.args.get('type')
        engine = get_visitor_engine()
        support_data = engine.get_visitor_support_amenities(amenity_type=amenity_type)
        return jsonify(support_data)
    except Exception as e:
        return make_error_response("SUPPORT_LOAD_FAILED", f"Could not fetch support amenities: {str(e)}", 500)


@visitor_bp.route('/api/visitor/privacy', methods=['GET'])
def get_visitor_privacy():
    """Returns visitor privacy policy, principles, and data governance catalog."""
    try:
        engine = get_visitor_engine()
        privacy_data = engine.get_privacy_overview()
        return jsonify(privacy_data)
    except Exception as e:
        return make_error_response("PRIVACY_LOAD_FAILED", str(e), 500)
