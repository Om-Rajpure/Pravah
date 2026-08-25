"""
PRAVAAH Privacy & Data Governance API Routes
Phase 11 — Policy, Data Catalog, and Settings Endpoints
"""

from flask import Blueprint, jsonify
from services.privacy_service import (
    DATA_GOVERNANCE_CATALOG,
    PRIVACY_PRINCIPLES,
    PRIVACY_POLICY,
    RAW_EVENT_RETENTION_MINUTES,
    AGGREGATE_RETENTION_HOURS,
    VISITOR_SESSION_RETENTION_MINUTES,
)

privacy_bp = Blueprint('privacy', __name__)


@privacy_bp.route('/api/privacy/policy', methods=['GET'])
def get_privacy_policy():
    """Returns public-facing privacy policy (plain language, not legal advice)."""
    return jsonify(PRIVACY_POLICY)


@privacy_bp.route('/api/privacy/data-catalog', methods=['GET'])
def get_data_catalog():
    """Returns the data governance catalog for the operator Data Governance view."""
    return jsonify({
        'catalog':     DATA_GOVERNANCE_CATALOG,
        'principles':  PRIVACY_PRINCIPLES,
        'retention': {
            'raw_event_minutes':            RAW_EVENT_RETENTION_MINUTES,
            'aggregate_retention_hours':    AGGREGATE_RETENTION_HOURS,
            'visitor_session_minutes':      VISITOR_SESSION_RETENTION_MINUTES,
        },
    })


@privacy_bp.route('/api/privacy/settings', methods=['GET'])
def get_privacy_settings():
    """Returns the default privacy settings for visitor mode."""
    return jsonify({
        'location_sharing': False,
        'personalization':  False,
        'data_usage':       'AGGREGATED_ONLY',
        'history_stored':   False,
    })
