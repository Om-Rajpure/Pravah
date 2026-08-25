"""
PRAVAAH Explainability & Decision Audit Models
Phase 10 — Decision Explanations, Trace Sequences, and Audit Log Events
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class TraceStage:
    """
    Standardized step in the Glass Box decision reasoning chain.
    """
    stage: str  # 'CURRENT_STATE', 'FORECAST', 'NETWORK_EFFECT', 'CANDIDATE_ACTIONS', 'DECISION', 'COUNTERFACTUAL', 'IMPACT'
    title: str
    message: str

@dataclass
class DecisionExplanation:
    """
    Comprehensive structured explanation for any major PRAVAAH decision.
    """
    decision_id: str
    type: str  # 'PREDICTION', 'INTERVENTION', 'SCENARIO', 'COUNTERFACTUAL', 'NETWORK_CHANGE'
    summary: str
    what: str
    why: List[str] = field(default_factory=list)
    network_effect: List[str] = field(default_factory=list)
    impact: Dict[str, Any] = field(default_factory=dict)
    confidence: Dict[str, Any] = field(default_factory=dict)
    assumptions: List[str] = field(default_factory=list)
    limitations: List[str] = field(default_factory=list)
    data_sources: List[str] = field(default_factory=list)
    timestamp: str = '18:00'
    versions: Dict[str, Any] = field(default_factory=dict)
    trace: List[TraceStage] = field(default_factory=list)
    technical_context: Dict[str, Any] = field(default_factory=dict)
    is_stale: bool = False
    staleness_reason: Optional[str] = None

@dataclass
class AuditEvent:
    """
    Immutable chronological record of a system decision or state transition.
    """
    event_id: str
    decision_id: str
    parent_decision_id: Optional[str]
    event_type: str  # 'PREDICTION_CREATED', 'ACTION_RECOMMENDED', 'ACTION_SIMULATED', 'ACTION_APPROVED', 'ACTION_RESET', 'SCENARIO_ACTIVATED', 'RECOMMENDATION_STALE'
    simulation_time: str
    timestamp: str
    summary: str
    reason: str
    versions: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)
