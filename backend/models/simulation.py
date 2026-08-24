"""
PRAVAAH Crowd Simulator Data Models
Phase 5 — Synthetic Visitor Agent & Aggregation State Structures
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class SyntheticVisitor:
    """
    Internal synthetic visitor agent model.
    Note: Individual agent fields are strictly internal to the simulator engine
    and are never exposed through user-facing APIs to protect privacy.
    """
    visitor_id: str
    group_type: str  # 'LOCAL', 'OUTSTATION', 'FAMILY', 'YOUNG', 'LOW_BUDGET', 'HIGH_BUDGET'
    group_size: int
    home_zone: str
    destination_id: str
    target_zone: str
    hotel_zone: Optional[str] = None
    preferred_transport: str = 'central_rail'
    arrival_offset_min: int = 0  # Minutes from 18:00 when visitor starts
    status: str = 'planning'     # 'planning', 'travelling', 'hotel', 'queueing', 'darshan', 'leaving', 'completed'
    current_zone: str = ''
    route_path: List[str] = field(default_factory=list)
    route_step_index: int = 0
    time_in_state: int = 0       # Minutes elapsed in current status
    darshan_duration_min: int = 15
    requires_hotel: bool = False

@dataclass
class ZoneSimState:
    """Aggregated zone-level crowd telemetry."""
    zone_id: str
    name: str
    people: int
    arrivals: int
    departures: int
    net_flow: int
    capacity: int
    utilization: float
    status: str  # 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'

@dataclass
class StationSimState:
    """Aggregated transit station load telemetry."""
    station_id: str
    name: str
    line: str
    capacity: int
    current_load: int
    load_percentage: float
    status: str

@dataclass
class HotelSimState:
    """Aggregated hotel cluster capacity telemetry."""
    hotel_id: str
    zone_id: str
    name: str
    total_rooms: int
    occupied_rooms: int
    available_rooms: int
    occupancy_rate: float
    price: int

@dataclass
class DestinationSimState:
    """Aggregated event mandal / immersion site queue telemetry."""
    destination_id: str
    name: str
    zone_id: str
    capacity: int
    current_people: int
    queue_people: int
    arrival_rate: int
    departure_rate: int
