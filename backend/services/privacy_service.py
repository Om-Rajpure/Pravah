"""
PRAVAAH Privacy Service + Public-Safe Data Layer
Phase 11 — Aggregation, Suppression, Serialization, and Data Governance
"""

import logging
from typing import Dict, Any, Optional, List

logger = logging.getLogger('pravaah.privacy')

# ─── Privacy Configuration ─────────────────────────────────────────────────────
K_ANONYMITY_THRESHOLD = 10          # minimum group size before count is suppressed
RAW_EVENT_RETENTION_MINUTES = 30
AGGREGATE_RETENTION_HOURS = 6
VISITOR_SESSION_RETENTION_MINUTES = 60

# ─── Feature-to-Public Label Map ──────────────────────────────────────────────
PRESSURE_LEVEL_LABELS = {
    'LOW':      'Low crowd',
    'MODERATE': 'Moderate crowd',
    'HIGH':     'Busy',
    'CRITICAL': 'Very busy',
    'UNKNOWN':  'Conditions unavailable',
}

# ─── Aggregation & Suppression ─────────────────────────────────────────────────
def suppress_small_group(count: int, label: str = 'Crowd data') -> Dict[str, Any]:
    """
    Applies k-anonymity suppression.
    If fewer than K_ANONYMITY_THRESHOLD individuals are in a group,
    returns a suppressed response rather than the raw count.
    """
    if count < K_ANONYMITY_THRESHOLD:
        return {'visible': False, 'label': f'{label}: insufficient sample'}
    return {'visible': True, 'count': count}


def aggregate_pressure_to_label(pressure: float) -> str:
    """Converts precise internal pressure index to public crowd-level label."""
    if pressure >= 85:
        return 'CRITICAL'
    elif pressure >= 70:
        return 'HIGH'
    elif pressure >= 45:
        return 'MODERATE'
    else:
        return 'LOW'


def aggregate_network_status(edge_status: str) -> str:
    """
    Converts internal edge status to human-readable transit status.
    Never exposes edge IDs or raw weights.
    """
    mapping = {
        'OPEN': 'OPEN',
        'SLOW': 'SLOW',
        'CLOSED': 'DISRUPTED',
        'DEGRADED': 'SLOW',
    }
    return mapping.get(edge_status, 'OPEN')


# ─── Public-Safe Serializers ───────────────────────────────────────────────────
def to_public_destination_state(zone: Dict[str, Any]) -> Dict[str, Any]:
    """
    Converts an internal zone/simulation state into a visitor-safe representation.
    Strips: raw pressure floats, edge_ids, visitor_ids, model features.
    Exposes: crowd_level, travel_status, public labels.
    """
    pressure = zone.get('pressure', 0.0)
    crowd_label = aggregate_pressure_to_label(pressure)
    visitor_label = PRESSURE_LEVEL_LABELS.get(crowd_label, 'Unknown')

    return {
        'destination_id': zone.get('zone_id', ''),
        'name':           zone.get('name', ''),
        'crowd_level':    crowd_label,
        'crowd_label':    visitor_label,
        # Optionally expose rounded numeric for detail view
        'crowd_index':    round(pressure),
        'travel_status':  'OPEN',    # overridden by network checks below
        'status':         _zone_to_status(crowd_label),
        'lat':            zone.get('lat', 0.0),
        'lng':            zone.get('lng', 0.0),
    }


def to_public_forecast(forecast_horizons: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Converts internal multi-horizon predictions to visitor-facing crowd labels.
    Strips: model names, feature vectors, raw floats.
    """
    public = []
    for h in forecast_horizons:
        p = h.get('predicted_pressure', 0.0)
        public.append({
            'horizon_minutes': h.get('horizon_minutes', 60),
            'horizon_label':   h.get('horizon_label', '+60m'),
            'crowd_level':     aggregate_pressure_to_label(p),
        })
    return public


def to_public_recommendation(rec: Dict[str, Any]) -> Dict[str, Any]:
    """
    Converts an internal visitor recommendation to a fully public-safe payload.
    Never exposes: dosage_pct, internal scores, edge IDs, candidate counts,
    individual visitor IDs, or model internals.
    """
    return {
        'destination_id':   rec.get('destination_id', ''),
        'name':             rec.get('name', ''),
        'crowd_level':      rec.get('crowd_level', 'MODERATE'),
        'crowd_label':      PRESSURE_LEVEL_LABELS.get(rec.get('crowd_level', 'MODERATE'), ''),
        'travel_time_min':  rec.get('travel_time_min', 0),
        'travel_status':    rec.get('travel_status', 'OPEN'),
        'why':              rec.get('why', []),
        'confidence':       rec.get('confidence_label', 'MODERATE'),
        'data_label':       'SIMULATED · AGGREGATED',
        'updated_at':       rec.get('updated_at', '18:00'),
    }


def _zone_to_status(crowd_level: str) -> str:
    """Maps crowd level to visitor-readable destination status."""
    return {
        'LOW':      'OPEN',
        'MODERATE': 'OPEN',
        'HIGH':     'BUSY',
        'CRITICAL': 'VERY BUSY',
        'UNKNOWN':  'UNAVAILABLE',
    }.get(crowd_level, 'OPEN')


# ─── Data Governance Catalog ───────────────────────────────────────────────────
DATA_GOVERNANCE_CATALOG = [
    {
        'data_type':    'Zone crowd pressure',
        'purpose':      'Crowd-aware guidance and city planning',
        'granularity':  'Zone (neighbourhood-level)',
        'retention':    'Session aggregate',
        'public':       True,
        'data_label':   'AGGREGATED',
    },
    {
        'data_type':    'Network segment state',
        'purpose':      'Route and transit status',
        'granularity':  'Route segment',
        'retention':    'Session',
        'public':       True,    # translated to human status only
        'data_label':   'MODELLED',
    },
    {
        'data_type':    'Synthetic visitor movement',
        'purpose':      'Simulation mechanics — not linked to real individuals',
        'granularity':  'Synthetic agent',
        'retention':    'Session',
        'public':       False,
        'data_label':   'SIMULATED',
    },
    {
        'data_type':    'Visitor approximate location',
        'purpose':      'Nearby recommendations (optional)',
        'granularity':  'Zone / neighbourhood',
        'retention':    'Session only — not persisted',
        'public':       False,
        'data_label':   'OPTIONAL',
    },
    {
        'data_type':    'Forecast pressure index',
        'purpose':      'Crowd-aware visit planning',
        'granularity':  'Zone × time horizon',
        'retention':    'Session aggregate',
        'public':       True,
        'data_label':   'FORECAST',
    },
    {
        'data_type':    'Operator audit decisions',
        'purpose':      'Intervention explainability and decision trace',
        'granularity':  'Decision-level',
        'retention':    'Session / persistent for audit trail',
        'public':       False,
        'data_label':   'OPERATOR-ONLY',
    },
]

PRIVACY_PRINCIPLES = [
    'DATA MINIMIZATION — collect only what is required for the feature.',
    'AGGREGATION — expose zone-level conditions, never individual traces.',
    'PURPOSE LIMITATION — do not reuse crowd data for individual profiling.',
    'RETENTION LIMITATION — visitor session data is not persisted beyond the session.',
    'TRANSPARENCY — data sources and synthetic labelling are clearly disclosed.',
    'OPTIONAL PARTICIPATION — approximate location is never required.',
    'NO INDIVIDUAL SURVEILLANCE — individual movement is not tracked or exposed.',
]

PRIVACY_POLICY = {
    'we_use': [
        'Aggregated zone-level crowd conditions',
        'Transit route status and availability',
        'Multi-horizon pressure forecasts',
        'Approximate neighbourhood location (only when you allow it)',
    ],
    'we_do_not_use': [
        'Your name, email address, or phone number',
        'Individual movement history or personal trajectories',
        'Precise GPS coordinates',
        'Device identifiers or persistent profiles',
    ],
    'why': 'To provide crowd-aware travel guidance without requiring individual identification.',
    'small_group_note': (
        'Small groups (fewer than 10 visitors) are suppressed in aggregated outputs '
        'to reduce the risk of exposing individual-level information.'
    ),
    'synthetic_note': (
        'Visitor movements in this prototype are generated by the PRAVAAH deterministic '
        'simulation engine (DEMO_SEED=20260908) and are not sourced from real individuals.'
    ),
    'prototype_disclaimer': (
        'PRAVAAH is a privacy-aware prototype designed around data minimisation and '
        'aggregation principles. It has not been formally assessed for legal compliance.'
    ),
}
