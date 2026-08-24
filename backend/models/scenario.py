"""
PRAVAAH Scenario Models
Phase 9 — Scenario Definitions, Overlays, What-If Results, and Cascade Stages
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class ScenarioCascadeStage:
    """
    Represents one stage in the plain-language cause-and-effect cascade.
    """
    stage: str  # 'TRIGGER', 'NETWORK', 'FLOW', 'PRESSURE', 'RESPONSE'
    title: str
    description: str

@dataclass
class ScenarioDefinition:
    """
    Defines an operational what-if scenario.
    """
    id: str
    name: str
    category: str  # 'TRANSIT', 'WEATHER', 'ROADWAY'
    severity: str  # 'LOW', 'MEDIUM', 'HIGH'
    duration_minutes: int
    description: str
    affected_nodes: List[str] = field(default_factory=list)
    affected_edges: List[str] = field(default_factory=list)
    affected_zones: List[str] = field(default_factory=list)
    parameters: Dict[str, Any] = field(default_factory=dict)
    status: str = 'INACTIVE'  # 'INACTIVE', 'SIMULATING', 'ACTIVE'
    created_at: str = '18:00'

@dataclass
class ScenarioResult:
    """
    Comprehensive result of a What-If scenario simulation including 3-way comparison.
    """
    scenario_id: str
    scenario_name: str
    status: str
    
    # 3-Way Comparative State Data
    baseline_pressure: Dict[str, int]
    disruption_pressure: Dict[str, int]
    action_pressure: Dict[str, int]
    
    # Summary Metrics
    critical_zones_baseline: int
    critical_zones_disruption: int
    critical_zones_action: int
    
    # Recommended Response
    recommended_action_title: str
    recommended_dosage_pct: int
    
    # Cause & Effect Cascade
    cascade: List[ScenarioCascadeStage] = field(default_factory=list)
    scorecard: List[Dict[str, Any]] = field(default_factory=list)
