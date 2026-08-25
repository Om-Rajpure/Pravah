"""
PRAVAAH Security & Input Validation Helpers
Phase 13 — Strict Input Sanitization, Dosage Bounds, and Entity Checks
"""

import re
from typing import Optional, Tuple

VALID_SCENARIOS = {'central-line-disruption', 'heavy-rain', 'road-closure'}
VALID_PREFERENCES = {'LESS_CROWDED', 'FASTEST', 'AVOID_DISRUPTION', 'LOWER_TRAVEL_TIME'}
VALID_DESTINATIONS = {
    'lalbaugcha-raja', 'gateway-of-india', 'marine-drive',
    'dadar-market', 'siddhivinayak', 'girgaon-chowpatty',
    'juhu-beach', 'bhuleshwar', 'curry-road-pandal', 'parel-village',
    'ganesh-galli', 'khetwadi-12'
}

ID_PATTERN = re.compile(r'^[a-zA-Z0-9_-]{1,64}$')

def validate_id_string(val: Optional[str]) -> bool:
    """Validates alphanumeric, dash, and underscore identifiers."""
    if not val or not isinstance(val, str):
        return False
    return bool(ID_PATTERN.match(val))

def validate_dosage(dosage: any) -> Tuple[bool, Optional[int], Optional[str]]:
    """
    Validates intervention dosage parameter:
    Must be integer or numeric float between 1 and 100.
    """
    if dosage is None:
        return False, None, "Dosage is required"
    try:
        val = float(dosage)
        if val < 0 or val > 100:
            return False, None, "Dosage must be between 0 and 100 percent"
        return True, int(val), None
    except (ValueError, TypeError):
        return False, None, "Dosage must be a valid numeric value"

def validate_scenario_id(scenario_id: Optional[str]) -> Tuple[bool, Optional[str]]:
    """Validates if scenario ID is registered."""
    if not scenario_id or scenario_id not in VALID_SCENARIOS:
        return False, f"Invalid scenario ID. Valid options: {', '.join(sorted(VALID_SCENARIOS))}"
    return True, None

def validate_visitor_preference(preference: Optional[str]) -> str:
    """Sanitizes visitor preference, falling back to safe default."""
    if not preference or preference not in VALID_PREFERENCES:
        return 'LESS_CROWDED'
    return preference

def validate_destination_id(dest_id: Optional[str]) -> Tuple[bool, Optional[str]]:
    """Validates destination ID."""
    if not dest_id or dest_id not in VALID_DESTINATIONS:
        return False, f"Destination not recognized. Valid options: {', '.join(sorted(VALID_DESTINATIONS))}"
    return True, None
