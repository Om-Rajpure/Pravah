"""
PRAVAAH Prediction API Routes
Phase 7 — Endpoints for multi-horizon pressure forecasting and explainability drivers
"""

from flask import Blueprint, jsonify, request
from services.prediction_service import get_predictor

predictions_bp = Blueprint('predictions', __name__)

@predictions_bp.route('/api/predictions', methods=['GET'])
def get_all_predictions():
    """
    Returns multi-horizon pressure forecasts (30m, 60m, 120m, 180m) across all Mumbai zones.
    Optional query param: ?zone=curry-road
    """
    try:
        predictor = get_predictor()
        zone_filter = request.args.get('zone')
        
        if zone_filter:
            data = predictor.get_zone_forecast(zone_filter)
            if data:
                return jsonify(data)
            return jsonify({"error": f"Zone {zone_filter} not found"}), 404
            
        full = predictor.predict_all_zones()
        return jsonify(full)
    except Exception as e:
        return jsonify({"error": "Failed to generate predictions", "message": str(e)}), 500

@predictions_bp.route('/api/predictions/overview', methods=['GET'])
def get_predictions_overview():
    """Returns overview of critical risk zones and highest forecast pressure."""
    try:
        predictor = get_predictor()
        overview = predictor.get_overview_predictions()
        return jsonify(overview)
    except Exception as e:
        return jsonify({"error": "Failed to get predictions overview", "message": str(e)}), 500

@predictions_bp.route('/api/predictions/zone/<zone_id>', methods=['GET'])
def get_zone_prediction(zone_id):
    """Returns detailed forecast trajectory, drivers, and historical series for a specific zone."""
    try:
        predictor = get_predictor()
        data = predictor.get_zone_forecast(zone_id)
        if data:
            return jsonify(data)
        return jsonify({"error": f"Zone {zone_id} not found"}), 404
    except Exception as e:
        return jsonify({"error": "Failed to get zone prediction", "message": str(e)}), 500
