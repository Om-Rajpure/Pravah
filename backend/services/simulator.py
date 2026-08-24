"""
PRAVAAH Crowd Simulation Engine
Phase 5 — Deterministic Synthetic City Movement & Geographic Aggregation
"""

import math
import random
import logging
from typing import Dict, List, Any, Optional

from config import Config
from models.simulation import (
    SyntheticVisitor,
    ZoneSimState,
    StationSimState,
    HotelSimState,
    DestinationSimState
)
from data.db import query_all

logger = logging.getLogger('pravaah.simulator')

# Destination to Zone mapping
DESTINATION_ZONE_MAP = {
    'loc-lalbaugcha-raja': 'lalbaug',
    'loc-ganesh-galli': 'lalbaug',
    'loc-khetwadi-12': 'girgaon',
    'loc-girgaon-chowpatty': 'girgaon'
}

def get_route(source_zone: str, destination_zone: str) -> List[str]:
    """
    Returns a connected list of zones for travel using the Network graph service.
    Falls back gracefully if disconnected.
    """
    if source_zone == destination_zone:
        return [source_zone]
    try:
        from services.network_service import get_network
        res = get_network().get_route(source_zone, destination_zone)
        if res.status == "AVAILABLE" and res.path_zones:
            return res.path_zones
    except Exception as e:
        logger.warn(f"Network route lookup fallback: {e}")
        
    return [source_zone, 'dadar', 'parel', destination_zone]


class CrowdSimulator:
    """
    Dynamic crowd simulation engine for PRAVAAH.
    Deterministic, privacy-preserving, and flow-conserving.
    """
    def __init__(self, seed: int = Config.DEMO_SEED):
        self.seed = seed
        self.rng = random.Random(self.seed)
        
        # Clock State
        self.start_hour = Config.SIMULATION_START_HOUR
        self.start_minute = Config.SIMULATION_START_MINUTE
        self.step_minutes = Config.SIMULATION_STEP_MINUTES
        self.step_count = 0
        self.is_running = False
        
        # Internal synthetic visitors collection
        self.visitors: List[SyntheticVisitor] = []
        
        # Baseline static zone population (calibrated to Mumbai real baseline)
        self.baseline_zone_populations: Dict[str, int] = {
            'south-mumbai': 110000,
            'lalbaug': 95000,
            'girgaon': 70000,
            'curry-road': 42000,
            'dadar': 120000,
            'parel': 58000,
            'byculla': 40000,
            'andheri': 105000,
            'thane': 78000,
            'vashi': 62000,
            'navi-mumbai': 50000
        }
        
        # Baseline capacities
        self.zone_capacities: Dict[str, int] = {
            'south-mumbai': 280000,
            'lalbaug': 180000,
            'girgaon': 140000,
            'curry-road': 80000,
            'dadar': 220000,
            'parel': 110000,
            'byculla': 90000,
            'andheri': 220000,
            'thane': 180000,
            'vashi': 140000,
            'navi-mumbai': 120000
        }

        # Initialize synthetic population and state
        self.reset()

    def reset(self):
        """
        Restores initial 18:00 deterministic state.
        """
        self.step_count = 0
        self.is_running = False
        self.rng = random.Random(self.seed)
        self._generate_synthetic_population()
        logger.info("[SIMULATION] Reset to initial state at 18:00 (DEMO_SEED=%d)", self.seed)

    def _generate_synthetic_population(self):
        """
        Deterministically creates synthetic visitor agents.
        """
        self.visitors = []
        total_visitors = Config.DEFAULT_VISITOR_COUNT # 10,000 agents representing moving cohorts
        
        behavior_types = list(Config.BEHAVIOR_DISTRIBUTION.keys())
        behavior_weights = list(Config.BEHAVIOR_DISTRIBUTION.values())
        
        origin_zones = list(Config.ORIGIN_WEIGHTS.keys())
        origin_weights = list(Config.ORIGIN_WEIGHTS.values())
        
        dest_ids = list(Config.DESTINATION_WEIGHTS.keys())
        dest_weights = list(Config.DESTINATION_WEIGHTS.values())

        hotel_zones = ['south-mumbai', 'parel', 'dadar', 'byculla', 'thane', 'vashi', 'navi-mumbai']
        
        for i in range(total_visitors):
            v_id = f"syn-v-{i+1:05d}"
            group_type = self.rng.choices(behavior_types, weights=behavior_weights, k=1)[0]
            
            # Group size based on type
            if group_type == 'FAMILY':
                group_size = self.rng.randint(3, 5)
            elif group_type == 'YOUNG':
                group_size = self.rng.randint(2, 4)
            elif group_type == 'OUTSTATION':
                group_size = self.rng.randint(2, 3)
            else:
                group_size = self.rng.randint(1, 2)
                
            home_zone = self.rng.choices(origin_zones, weights=origin_weights, k=1)[0]
            dest_id = self.rng.choices(dest_ids, weights=dest_weights, k=1)[0]
            target_zone = DESTINATION_ZONE_MAP.get(dest_id, 'lalbaug')
            
            # Outstation hotel assignment
            requires_hotel = (group_type in ['OUTSTATION', 'LOW_BUDGET', 'HIGH_BUDGET']) and (home_zone in ['thane', 'vashi', 'navi-mumbai', 'andheri'])
            hotel_zone = None
            if requires_hotel:
                if group_type == 'HIGH_BUDGET':
                    hotel_zone = 'south-mumbai' if self.rng.random() < 0.7 else 'parel'
                elif group_type == 'LOW_BUDGET':
                    hotel_zone = self.rng.choice(['thane', 'vashi', 'navi-mumbai'])
                else:
                    hotel_zone = self.rng.choice(hotel_zones)

            # Preferred transport
            if home_zone in ['thane', 'dadar', 'byculla', 'parel', 'curry-road']:
                preferred_transport = 'central_rail' if self.rng.random() < 0.75 else 'road'
            elif home_zone in ['andheri']:
                preferred_transport = 'western_rail' if self.rng.random() < 0.70 else 'metro'
            elif home_zone in ['vashi', 'navi-mumbai']:
                preferred_transport = 'harbour_rail' if self.rng.random() < 0.75 else 'road'
            else:
                preferred_transport = 'road' if self.rng.random() < 0.60 else 'walk'

            # Arrival time offset in minutes from 18:00
            # Some visitors are already active at 18:00 (negative or zero offset)
            arrival_offset_min = self.rng.randint(-20, 90)
            
            # Route path
            route_path = get_route(home_zone, target_zone)
            
            # Initial state determination at 18:00 (tick 0)
            if arrival_offset_min <= -15:
                status = 'queueing'
                current_zone = target_zone
                route_step_index = len(route_path) - 1
            elif arrival_offset_min <= 0:
                status = 'travelling'
                route_step_index = min(1, len(route_path) - 1)
                current_zone = route_path[route_step_index]
            else:
                status = 'planning'
                route_step_index = 0
                current_zone = home_zone

            visitor = SyntheticVisitor(
                visitor_id=v_id,
                group_type=group_type,
                group_size=group_size,
                home_zone=home_zone,
                destination_id=dest_id,
                target_zone=target_zone,
                hotel_zone=hotel_zone,
                preferred_transport=preferred_transport,
                arrival_offset_min=arrival_offset_min,
                status=status,
                current_zone=current_zone,
                route_path=route_path,
                route_step_index=route_step_index,
                time_in_state=abs(arrival_offset_min) if arrival_offset_min < 0 else 0,
                darshan_duration_min=self.rng.randint(10, 25),
                requires_hotel=requires_hotel
            )
            self.visitors.append(visitor)

    def get_current_time_str(self) -> str:
        """Returns simulation time string (e.g. '18:25')."""
        total_mins = self.start_hour * 60 + self.start_minute + (self.step_count * self.step_minutes)
        hour = (total_mins // 60) % 24
        minute = total_mins % 60
        return f"{hour:02d}:{minute:02d}"

    def step(self) -> Dict[str, Any]:
        """
        Advances the simulation by 1 discrete step (5 minutes).
        Applies visitor lifecycle transitions and returns aggregated state.
        """
        current_sim_minute = self.step_count * self.step_minutes
        
        # Track arrivals and departures per zone for this 5-min step
        zone_step_arrivals = {z: 0 for z in self.zone_capacities}
        zone_step_departures = {z: 0 for z in self.zone_capacities}

        for v in self.visitors:
            v.time_in_state += self.step_minutes
            
            # State Machine Transitions:
            # 1. PLANNING -> TRAVELLING (or HOTEL)
            if v.status == 'planning':
                if current_sim_minute >= v.arrival_offset_min:
                    v.status = 'travelling'
                    v.time_in_state = 0
                    v.route_step_index = 0
                    v.current_zone = v.route_path[0]
                    zone_step_arrivals[v.current_zone] += v.group_size

            # 2. TRAVELLING -> Next Zone or QUEUEING / HOTEL
            elif v.status == 'travelling':
                # Transit time between adjacent zones ~ 5-10 minutes
                if v.time_in_state >= 5:
                    prev_zone = v.current_zone
                    if v.route_step_index < len(v.route_path) - 1:
                        # Move to next zone in route
                        v.route_step_index += 1
                        v.current_zone = v.route_path[v.route_step_index]
                        v.time_in_state = 0
                        zone_step_departures[prev_zone] += v.group_size
                        zone_step_arrivals[v.current_zone] += v.group_size
                    else:
                        # Reached destination zone
                        if v.requires_hotel and v.hotel_zone and v.current_zone != v.target_zone:
                            v.status = 'hotel'
                            v.time_in_state = 0
                        else:
                            v.status = 'queueing'
                            v.time_in_state = 0

            # 3. HOTEL -> TRAVELLING to Event
            elif v.status == 'hotel':
                # Stays in hotel for ~15 min before heading to mandal
                if v.time_in_state >= 15:
                    v.status = 'travelling'
                    v.time_in_state = 0
                    v.requires_hotel = False # Check-in complete
                    v.route_path = get_route(v.hotel_zone, v.target_zone)
                    v.route_step_index = 0
                    v.current_zone = v.route_path[0]

            # 4. QUEUEING -> DARSHAN
            elif v.status == 'queueing':
                # Queue service rate: ~15 to 30 mins wait depending on zone saturation
                queue_duration = 30 if v.target_zone == 'lalbaug' else 15
                if v.time_in_state >= queue_duration:
                    v.status = 'darshan'
                    v.time_in_state = 0

            # 5. DARSHAN -> LEAVING
            elif v.status == 'darshan':
                if v.time_in_state >= v.darshan_duration_min:
                    v.status = 'leaving'
                    v.time_in_state = 0
                    # Reverse route for departure
                    v.route_path = list(reversed(get_route(v.home_zone, v.target_zone)))
                    v.route_step_index = 0
                    v.current_zone = v.route_path[0]

            # 6. LEAVING -> COMPLETED
            elif v.status == 'leaving':
                if v.time_in_state >= 5:
                    prev_zone = v.current_zone
                    if v.route_step_index < len(v.route_path) - 1:
                        v.route_step_index += 1
                        v.current_zone = v.route_path[v.route_step_index]
                        v.time_in_state = 0
                        zone_step_departures[prev_zone] += v.group_size
                        zone_step_arrivals[v.current_zone] += v.group_size
                    else:
                        v.status = 'completed'
                        v.time_in_state = 0
                        zone_step_departures[v.current_zone] += v.group_size

        self.step_count += 1
        sim_time = self.get_current_time_str()
        logger.info(f"[SIMULATION] Step {self.step_count} ({sim_time}) completed.")
        
        return self.get_state(zone_step_arrivals, zone_step_departures)

    def get_state(self, step_arrivals: Optional[Dict[str, int]] = None, step_departures: Optional[Dict[str, int]] = None) -> Dict[str, Any]:
        """
        Aggregates individual visitor agents into privacy-preserving geographic states.
        No individual visitor data is returned.
        """
        sim_time = self.get_current_time_str()
        
        # 1. Zone Aggregation
        active_zone_counts: Dict[str, int] = {z: 0 for z in self.zone_capacities}
        destination_queue_counts: Dict[str, int] = {'loc-lalbaugcha-raja': 0, 'loc-ganesh-galli': 0, 'loc-khetwadi-12': 0, 'loc-girgaon-chowpatty': 0}
        destination_active_counts: Dict[str, int] = {'loc-lalbaugcha-raja': 0, 'loc-ganesh-galli': 0, 'loc-khetwadi-12': 0, 'loc-girgaon-chowpatty': 0}
        hotel_occupied_counts: Dict[str, int] = {z: 0 for z in ['south-mumbai', 'girgaon', 'curry-road', 'parel', 'dadar', 'byculla', 'andheri', 'vashi', 'thane', 'navi-mumbai']}

        for v in self.visitors:
            if v.status in ['travelling', 'hotel', 'queueing', 'darshan', 'leaving'] and v.current_zone in active_zone_counts:
                active_zone_counts[v.current_zone] += v.group_size
                
            if v.status == 'queueing' and v.destination_id in destination_queue_counts:
                destination_queue_counts[v.destination_id] += v.group_size
                
            if v.status == 'darshan' and v.destination_id in destination_active_counts:
                destination_active_counts[v.destination_id] += v.group_size
                
            if v.status == 'hotel' and v.hotel_zone and v.hotel_zone in hotel_occupied_counts:
                hotel_occupied_counts[v.hotel_zone] += 1 # 1 room per group

        # Build Zone State List
        zones_output = []
        for zone_id, cap in self.zone_capacities.items():
            base_pop = self.baseline_zone_populations.get(zone_id, 50000)
            dynamic_sim_people = active_zone_counts.get(zone_id, 0)
            
            # Flow conservation: total people in zone
            # Scale dynamic count realistically to represent mega-event density
            sim_scale_factor = 14 # 10,000 agents represent ~140,000 active moving pilgrims
            total_people = base_pop + (dynamic_sim_people * sim_scale_factor)
            
            # Arrivals / Departures rate per hour
            arr_step = step_arrivals.get(zone_id, dynamic_sim_people // 4) if step_arrivals else dynamic_sim_people // 4
            dep_step = step_departures.get(zone_id, dynamic_sim_people // 6) if step_departures else dynamic_sim_people // 6
            hourly_arrivals = arr_step * (60 // self.step_minutes) * sim_scale_factor
            hourly_departures = dep_step * (60 // self.step_minutes) * sim_scale_factor
            net_flow = hourly_arrivals - hourly_departures
            
            utilization = round(min(total_people / cap, 1.45), 3)
            
            if utilization >= 0.85:
                status = "CRITICAL"
            elif utilization >= 0.70:
                status = "HIGH"
            elif utilization >= 0.50:
                status = "MODERATE"
            else:
                status = "LOW"
                
            name = zone_id.replace('-', ' ').title()
            zones_output.append({
                "zone_id": zone_id,
                "name": name,
                "people": total_people,
                "arrivals": hourly_arrivals,
                "departures": hourly_departures,
                "net_flow": net_flow,
                "capacity": cap,
                "utilization": utilization,
                "status": status
            })

        # 2. Station Aggregation
        stations_data = [
            {"id": "stn-curry-road", "name": "Curry Road", "line": "Central Line", "zone_id": "curry-road", "capacity": 35000, "base_load": 24000},
            {"id": "stn-chinchpokli", "name": "Chinchpokli", "line": "Central Line", "zone_id": "byculla", "capacity": 25000, "base_load": 17000},
            {"id": "stn-dadar", "name": "Dadar Central & Western Interchange", "line": "Central/Western", "zone_id": "dadar", "capacity": 120000, "base_load": 82000},
            {"id": "stn-parel", "name": "Parel", "line": "Central Line", "zone_id": "parel", "capacity": 40000, "base_load": 26000},
            {"id": "stn-lower-parel", "name": "Lower Parel", "line": "Western Line", "zone_id": "parel", "capacity": 45000, "base_load": 28000},
            {"id": "stn-byculla", "name": "Byculla", "line": "Central Line", "zone_id": "byculla", "capacity": 30000, "base_load": 18000},
            {"id": "stn-csmt", "name": "CSMT", "line": "Central Terminal", "zone_id": "south-mumbai", "capacity": 150000, "base_load": 85000},
            {"id": "stn-churchgate", "name": "Churchgate", "line": "Western Terminal", "zone_id": "south-mumbai", "capacity": 130000, "base_load": 70000},
            {"id": "stn-andheri", "name": "Andheri", "line": "Western & Metro", "zone_id": "andheri", "capacity": 110000, "base_load": 56000},
            {"id": "stn-vashi", "name": "Vashi", "line": "Harbour Line", "zone_id": "vashi", "capacity": 50000, "base_load": 20000},
            {"id": "stn-thane", "name": "Thane", "line": "Central Mainline", "zone_id": "thane", "capacity": 90000, "base_load": 34000},
        ]
        stations_output = []
        for s in stations_data:
            dyn_transiting = active_zone_counts.get(s["zone_id"], 0) * 8
            current_load = s["base_load"] + dyn_transiting
            load_pct = round((current_load / s["capacity"]) * 100, 1)
            status = "CRITICAL" if load_pct >= 85 else "HIGH" if load_pct >= 70 else "MODERATE" if load_pct >= 50 else "LOW"
            stations_output.append({
                "station_id": s["id"],
                "name": s["name"],
                "line": s["line"],
                "capacity": s["capacity"],
                "current_load": current_load,
                "load_percentage": load_pct,
                "status": status
            })

        # 3. Hotels Aggregation
        hotels_data = [
            {"id": "htl-south-mumbai-cluster", "zone_id": "south-mumbai", "name": "South Mumbai Heritage & Business Cluster", "total_rooms": 4500, "base_occ": 4200, "price": 12500},
            {"id": "htl-girgaon-stay-cluster", "zone_id": "girgaon", "name": "Girgaon / Marine Lines Guesthouse Cluster", "total_rooms": 1200, "base_occ": 1050, "price": 6500},
            {"id": "htl-curry-road-lodges", "zone_id": "curry-road", "name": "Curry Road & Lower Parel Budget Stays", "total_rooms": 600, "base_occ": 560, "price": 4200},
            {"id": "htl-parel-luxury-cluster", "zone_id": "parel", "name": "Parel & Lower Parel High-Rise Cluster", "total_rooms": 3200, "base_occ": 2900, "price": 9800},
            {"id": "htl-dadar-central-cluster", "zone_id": "dadar", "name": "Dadar Central Transit Accommodations", "total_rooms": 1800, "base_occ": 1580, "price": 5200},
            {"id": "htl-byculla-cluster", "zone_id": "byculla", "name": "Byculla Commercial Stays", "total_rooms": 1100, "base_occ": 820, "price": 4800},
            {"id": "htl-andheri-airport-cluster", "zone_id": "andheri", "name": "Andheri & Airport Transit Hub Cluster", "total_rooms": 6500, "base_occ": 3550, "price": 6200},
            {"id": "htl-vashi-cluster", "zone_id": "vashi", "name": "Vashi Sector 17 & Palm Beach Cluster", "total_rooms": 5400, "base_occ": 2580, "price": 3800},
            {"id": "htl-thane-cluster", "zone_id": "thane", "name": "Thane West Ghodbunder & Station Cluster", "total_rooms": 4800, "base_occ": 2050, "price": 3200},
            {"id": "htl-navi-mumbai-cluster", "zone_id": "navi-mumbai", "name": "Belapur & Kharghar Modern Stays", "total_rooms": 3600, "base_occ": 1540, "price": 3000}
        ]
        hotels_output = []
        for h in hotels_data:
            dyn_occ = hotel_occupied_counts.get(h["zone_id"], 0) * 3
            occupied = min(h["base_occ"] + dyn_occ, h["total_rooms"])
            available = max(h["total_rooms"] - occupied, 0)
            occ_rate = round((occupied / h["total_rooms"]) * 100, 1)
            hotels_output.append({
                "hotel_id": h["id"],
                "zone_id": h["zone_id"],
                "name": h["name"],
                "total_rooms": h["total_rooms"],
                "occupied_rooms": occupied,
                "available_rooms": available,
                "occupancy_rate": occ_rate,
                "price": h["price"]
            })

        # 4. Event Destinations Aggregation
        destinations_data = [
            {"id": "loc-lalbaugcha-raja", "name": "Lalbaugcha Raja Mandal", "zone_id": "lalbaug", "capacity": 45000},
            {"id": "loc-ganesh-galli", "name": "Ganesh Galli (Mumbaicha Raja)", "zone_id": "lalbaug", "capacity": 25000},
            {"id": "loc-khetwadi-12", "name": "Khetwadi 12th Lane Ganpati", "zone_id": "girgaon", "capacity": 20000},
            {"id": "loc-girgaon-chowpatty", "name": "Girgaon Chowpatty Immersion Site", "zone_id": "girgaon", "capacity": 120000}
        ]
        destinations_output = []
        for d in destinations_data:
            q_count = destination_queue_counts.get(d["id"], 0) * sim_scale_factor
            active_count = destination_active_counts.get(d["id"], 0) * sim_scale_factor
            destinations_output.append({
                "destination_id": d["id"],
                "name": d["name"],
                "zone_id": d["zone_id"],
                "capacity": d["capacity"],
                "current_people": active_count,
                "queue_people": q_count,
                "arrival_rate": (q_count // 3) + 1200,
                "departure_rate": (active_count // 2) + 800
            })

        active_moving = sum(active_zone_counts.values()) * sim_scale_factor

        return {
            "simulation_time": sim_time,
            "status": "RUNNING" if self.is_running else "PAUSED",
            "step": self.step_count,
            "active_visitors": active_moving,
            "zones": zones_output,
            "stations": stations_output,
            "hotels": hotels_output,
            "destinations": destinations_output,
            "data_source": "Dynamic synthetic simulator · Calibrated to Mumbai geography"
        }

    def start(self):
        self.is_running = True
        logger.info("[SIMULATION] Started continuous ticker.")
        return {"status": "RUNNING", "simulation_time": self.get_current_time_str()}

    def pause(self):
        self.is_running = False
        logger.info("[SIMULATION] Paused ticker.")
        return {"status": "PAUSED", "simulation_time": self.get_current_time_str()}

# Global Singleton Simulator Instance
_global_simulator: Optional[CrowdSimulator] = None

def get_simulator() -> CrowdSimulator:
    global _global_simulator
    if _global_simulator is None:
        _global_simulator = CrowdSimulator(Config.DEMO_SEED)
    return _global_simulator
