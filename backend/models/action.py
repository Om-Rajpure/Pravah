"""
PRAVAAH Intervention & Action Models
Phase 8 — Action Definitions, Counterfactual Results, and Impact Metrics
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class InterventionAction:
    """
    Represents a candidate or recommended city operations intervention.
    """
    id: str
    type: str  # 'REDIRECT_VISITOR_FLOW', 'SHIFT_ARRIVAL_TIME', 'REDISTRIBUTE_HOTEL_DEMAND'
    target_zone: str
    destination_zone: str
    dosage: float  # Fraction of flow affected, e.g. 0.18 for 18%
    unit: str = 'PERCENT_FLOW'
    title: str = ''
    description: str = ''
    status: str = 'RECOMMENDED'  # 'RECOMMENDED', 'SIMULATING', 'SIMULATED', 'ACTIVE', 'DISMISSED'
    created_at: str = '18:00'
    network_version: int = 1
    confidence: float = 0.87
    reason_codes: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ActionSimulationResult:
    """
    Measurable counterfactual impact evaluation of an action.
    """
    action_id: str
    target_zone: str
    destination_zone: str
    dosage: float
    
    # Target Zone Impact
    target_pressure_before: int
    target_pressure_after: int
    pressure_reduction: int
    
    # Destination Zone Side Effect
    destination_pressure_before: int
    destination_pressure_after: int
    side_effect_increase: int
    
    # City-wide Impact
    critical_zones_before: int
    critical_zones_after: int
    high_zones_before: int
    high_zones_after: int
    affected_people: int
    
    # Optimization Score & Confidence
    score: float
    confidence: float
    confidence_label: str  # 'HIGH CONFIDENCE', 'MODERATE CONFIDENCE'
    is_robust: bool = True
    
    # Explainability Drivers
    why_this_action: List[str] = field(default_factory=list)
    what_if_nothing: str = ''
    rejection_reasons: List[str] = field(default_factory=list)

@dataclass
class ImpactComparison:
    """
    Side-by-side Before vs After comparison structure for the UI.
    """
    target_name: str
    destination_name: str
    target_before: int
    target_after: int
    destination_before: int
    destination_after: int
    critical_before: int
    critical_after: int
    affected_visitors: int
