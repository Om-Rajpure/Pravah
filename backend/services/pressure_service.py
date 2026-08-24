"""
PRAVAAH Pressure Calculation Service
Phase 7 — Multimodal Pressure Index, Thresholds, and Normalization
"""

from typing import Dict, Any, Tuple

# Standard PRAVAAH Pressure Scale (0–100)
PRESSURE_THRESHOLDS = {
    'CRITICAL': 76,   # 76–100: Severe congestion, gating required
    'HIGH': 56,       # 56–75: Elevated density, approaching saturation
    'MODERATE': 31,   # 31–55: Normal operational flow
    'LOW': 0          # 0–30: High buffer capacity available
}

PRESSURE_COLORS = {
    'CRITICAL': '#A94338',
    'HIGH': '#B85C3E',
    'MODERATE': '#B8893D',
    'LOW': '#52755F'
}

def calculate_pressure_index(
    people: int,
    capacity: int,
    arrivals_per_hour: int,
    departures_per_hour: int,
    transit_load_pct: float = 65.0,
    neighbor_avg_pressure: float = 50.0
) -> Tuple[int, str]:
    """
    Calculates the multimodal PRAVAAH Pressure Index (0–100).
    Combines:
    1. Density/Utilization (40%)
    2. Net Flow Ingress Velocity (25%)
    3. Transit Hub Saturation (20%)
    4. Neighboring Zone Spillover Pressure (15%)
    
    Returns: (pressure_score: int, level: str)
    """
    if capacity <= 0:
        return (50, 'MODERATE')

    # 1. Density component (0–100)
    density_ratio = min(people / capacity, 1.4)
    density_score = min(density_ratio * 75.0, 100.0)

    # 2. Flow velocity component (0–100)
    net_inflow = arrivals_per_hour - departures_per_hour
    flow_ratio = (net_inflow / (capacity * 0.25)) if capacity > 0 else 0.0
    flow_score = max(0.0, min(50.0 + (flow_ratio * 40.0), 100.0))

    # 3. Transit component (0–100)
    transit_score = max(0.0, min(transit_load_pct, 100.0))

    # 4. Neighbor component (0–100)
    neighbor_score = max(0.0, min(neighbor_avg_pressure, 100.0))

    # Weighted Multimodal Combination
    raw_pressure = (
        (0.40 * density_score) +
        (0.25 * flow_score) +
        (0.20 * transit_score) +
        (0.15 * neighbor_score)
    )

    pressure_score = int(round(max(5, min(raw_pressure, 100))))
    level = get_pressure_level(pressure_score)

    return (pressure_score, level)

def get_pressure_level(score: int) -> str:
    """Returns categorical status string for a numerical pressure score."""
    if score >= PRESSURE_THRESHOLDS['CRITICAL']:
        return 'CRITICAL'
    elif score >= PRESSURE_THRESHOLDS['HIGH']:
        return 'HIGH'
    elif score >= PRESSURE_THRESHOLDS['MODERATE']:
        return 'MODERATE'
    return 'LOW'

def get_pressure_color(score: int) -> str:
    """Returns design system hex color for a numerical pressure score."""
    level = get_pressure_level(score)
    return PRESSURE_COLORS[level]
