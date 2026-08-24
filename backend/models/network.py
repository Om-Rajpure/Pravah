"""
PRAVAAH Network Data Models
Phase 6 — Nodes, Edges, Capacities, and Route Result Data Structures
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class NetworkNode:
    """
    Represents a physical or operational location in the Mumbai graph.
    """
    id: str
    name: str
    type: str  # 'mandal', 'station', 'metro_station', 'hotel_cluster', 'interchange', 'road_junction', 'zone_anchor'
    lat: float
    lng: float
    zone_id: str
    capacity: int = 50000
    status: str = 'OPEN'  # 'OPEN', 'RESTRICTED', 'CLOSED'
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class NetworkEdge:
    """
    Represents a physical connection (railway, road, pedestrian, transfer) between two nodes.
    """
    id: str
    source: str
    target: str
    type: str  # 'rail', 'road', 'walk', 'metro', 'transfer'
    distance_km: float
    travel_time_min: float
    capacity_per_hour: int
    effective_capacity: int
    status: str = 'OPEN'  # 'OPEN', 'RESTRICTED', 'CLOSED', 'DEGRADED'
    closure_start: Optional[str] = None
    closure_end: Optional[str] = None
    geometry: List[List[float]] = field(default_factory=list)  # [[lng, lat], ...]
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class RouteResult:
    """
    Clean serializable route output.
    """
    source: str
    target: str
    path_nodes: List[str]
    path_node_names: List[str]
    path_zones: List[str]
    edge_ids: List[str]
    total_distance_km: float
    total_travel_time_min: float
    status: str  # 'AVAILABLE', 'RESTRICTED', 'UNAVAILABLE'
    is_alternative: bool = False
    reason: Optional[str] = None
