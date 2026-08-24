"""
PRAVAAH Network Engine & Dynamic Connectivity Service
Phase 6 — Graph-Based Routing, Capacity Constraints, and Disruption Rerouting
"""

import math
import logging
from typing import Dict, List, Any, Optional, Tuple
import networkx as nx

from models.network import NetworkNode, NetworkEdge, RouteResult

logger = logging.getLogger('pravaah.network')

class MumbaiNetwork:
    """
    Connected graph model of Mumbai's Ganesh Chaturthi transit infrastructure.
    Powered by NetworkX for shortest-path, dynamic edge closures, and alternative routing.
    """
    def __init__(self):
        self.version: int = 1
        self.nodes: Dict[str, NetworkNode] = {}
        self.edges: Dict[str, NetworkEdge] = {}
        self.graph: nx.DiGraph = nx.DiGraph()
        
        self._initialize_network()

    def _initialize_network(self):
        """
        Builds the baseline graph nodes and edges across Mumbai.
        """
        self.version = 1
        self.nodes = {}
        self.edges = {}
        self.graph = nx.DiGraph()

        # 1. Physical and Operational Nodes
        node_definitions = [
            # Zone Centroid Anchors
            NetworkNode("zone-thane", "Thane Main Corridor", "zone_anchor", 19.1982, 72.9634, "thane", 180000),
            NetworkNode("zone-andheri", "Andheri Transit Hub", "zone_anchor", 19.1197, 72.8464, "andheri", 220000),
            NetworkNode("zone-vashi", "Vashi Sector 17 Anchor", "zone_anchor", 19.0771, 72.9986, "vashi", 140000),
            NetworkNode("zone-navi-mumbai", "Navi Mumbai Kharghar Anchor", "zone_anchor", 19.0330, 73.0297, "navi-mumbai", 120000),
            NetworkNode("zone-dadar", "Dadar Central Interchange", "zone_anchor", 19.0178, 72.8478, "dadar", 220000),
            NetworkNode("zone-parel", "Parel Corridor Anchor", "zone_anchor", 19.0022, 72.8398, "parel", 110000),
            NetworkNode("zone-curry-road", "Curry Road Station Perimeter", "zone_anchor", 18.9942, 72.8336, "curry-road", 80000),
            NetworkNode("zone-byculla", "Byculla South Corridor", "zone_anchor", 18.9750, 72.8330, "byculla", 90000),
            NetworkNode("zone-south-mumbai", "South Mumbai Heritage Anchor", "zone_anchor", 18.9400, 72.8350, "south-mumbai", 280000),
            NetworkNode("zone-girgaon", "Girgaon Chowpatty Anchor", "zone_anchor", 18.9540, 72.8120, "girgaon", 140000),
            NetworkNode("zone-lalbaug", "Lalbaug Central Epicenter", "zone_anchor", 18.9912, 72.8355, "lalbaug", 180000),

            # Mandals and Immersion Sites
            NetworkNode("loc-lalbaugcha-raja", "Lalbaugcha Raja Mandal", "mandal", 18.9912, 72.8355, "lalbaug", 45000),
            NetworkNode("loc-ganesh-galli", "Ganesh Galli (Mumbaicha Raja)", "mandal", 18.9930, 72.8370, "lalbaug", 25000),
            NetworkNode("loc-khetwadi-12", "Khetwadi 12th Lane Ganpati", "mandal", 18.9600, 72.8210, "girgaon", 20000),
            NetworkNode("loc-girgaon-chowpatty", "Girgaon Chowpatty Immersion Site", "mandal", 18.9540, 72.8120, "girgaon", 120000),

            # Railway Station Nodes
            NetworkNode("stn-thane", "Thane Mainline Terminal", "station", 19.1860, 72.9750, "thane", 90000),
            NetworkNode("stn-andheri", "Andheri Western & Metro", "station", 19.1197, 72.8464, "andheri", 110000),
            NetworkNode("stn-vashi", "Vashi Harbour Terminal", "station", 19.0645, 72.9980, "vashi", 50000),
            NetworkNode("stn-dadar", "Dadar Central & Western Interchange", "station", 19.0178, 72.8478, "dadar", 120000),
            NetworkNode("stn-parel", "Parel Central Station", "station", 19.0022, 72.8398, "parel", 40000),
            NetworkNode("stn-lower-parel", "Lower Parel Western Station", "station", 18.9950, 72.8300, "parel", 45000),
            NetworkNode("stn-curry-road", "Curry Road Central Station", "station", 18.9942, 72.8336, "curry-road", 35000),
            NetworkNode("stn-chinchpokli", "Chinchpokli Central Station", "station", 18.9880, 72.8320, "byculla", 25000),
            NetworkNode("stn-byculla", "Byculla Central Station", "station", 18.9750, 72.8330, "byculla", 30000),
            NetworkNode("stn-csmt", "CSMT Central Terminal", "station", 18.9400, 72.8350, "south-mumbai", 150000),
            NetworkNode("stn-churchgate", "Churchgate Western Terminal", "station", 18.9322, 72.8264, "south-mumbai", 130000),

            # Road Junctions
            NetworkNode("jnc-dadar-tt", "Dadar TT Circle Junction", "interchange", 19.0190, 72.8450, "dadar", 40000),
            NetworkNode("jnc-bharat-mata", "Bharat Mata Cinema Junction", "interchange", 18.9960, 72.8380, "parel", 35000),
            NetworkNode("jnc-lalbaug-flyover", "Lalbaug Flyover Sane Guruji Junction", "interchange", 18.9890, 72.8340, "lalbaug", 30000),
            NetworkNode("jnc-tilak-bridge", "Tilak Bridge Dadar Corridor", "interchange", 19.0160, 72.8420, "dadar", 28000),
        ]

        for n in node_definitions:
            self.nodes[n.id] = n
            self.graph.add_node(n.id, name=n.name, type=n.type, zone_id=n.zone_id, capacity=n.capacity, lat=n.lat, lng=n.lng)

        # 2. Connection Edges (Bidirectional by default)
        edge_data = [
            # Zone Anchor to Primary Station/Junction Links
            ("zone-thane", "stn-thane", "transfer", 0.5, 3.0, 50000, [[72.9634, 19.1982], [72.9750, 19.1860]]),
            ("zone-andheri", "stn-andheri", "transfer", 0.5, 3.0, 60000, [[72.8464, 19.1197], [72.8464, 19.1197]]),
            ("zone-vashi", "stn-vashi", "transfer", 0.5, 3.0, 40000, [[72.9986, 19.0771], [72.9980, 19.0645]]),
            ("zone-navi-mumbai", "stn-vashi", "road", 8.0, 15.0, 35000, [[73.0297, 19.0330], [72.9980, 19.0645]]),
            ("zone-dadar", "stn-dadar", "transfer", 0.2, 2.0, 80000, [[72.8478, 19.0178], [72.8478, 19.0178]]),
            ("zone-parel", "stn-parel", "transfer", 0.2, 2.0, 40000, [[72.8398, 19.0022], [72.8398, 19.0022]]),
            ("zone-curry-road", "stn-curry-road", "transfer", 0.1, 1.0, 35000, [[72.8336, 18.9942], [72.8336, 18.9942]]),
            ("zone-byculla", "stn-byculla", "transfer", 0.2, 2.0, 30000, [[72.8330, 18.9750], [72.8330, 18.9750]]),
            ("zone-south-mumbai", "stn-csmt", "transfer", 0.2, 2.0, 90000, [[72.8350, 18.9400], [72.8350, 18.9400]]),
            ("zone-girgaon", "loc-girgaon-chowpatty", "transfer", 0.3, 3.0, 70000, [[72.8120, 18.9540], [72.8120, 18.9540]]),
            ("zone-lalbaug", "loc-lalbaugcha-raja", "transfer", 0.1, 1.0, 50000, [[72.8355, 18.9912], [72.8355, 18.9912]]),

            # Central Railway Corridor
            ("stn-thane", "stn-dadar", "rail", 24.0, 22.0, 90000, [[72.9750, 19.1860], [72.8478, 19.0178]]),
            ("stn-dadar", "stn-parel", "rail", 1.8, 3.0, 60000, [[72.8478, 19.0178], [72.8398, 19.0022]]),
            ("stn-parel", "stn-curry-road", "rail", 1.2, 3.0, 50000, [[72.8398, 19.0022], [72.8336, 18.9942]]),
            ("stn-curry-road", "stn-chinchpokli", "rail", 1.0, 2.0, 45000, [[72.8336, 18.9942], [72.8320, 18.9880]]),
            ("stn-chinchpokli", "stn-byculla", "rail", 1.2, 3.0, 50000, [[72.8320, 18.9880], [72.8330, 18.9750]]),
            ("stn-byculla", "stn-csmt", "rail", 4.5, 7.0, 120000, [[72.8330, 18.9750], [72.8350, 18.9400]]),

            # Western Railway Corridor
            ("stn-andheri", "stn-dadar", "rail", 12.0, 16.0, 110000, [[72.8464, 19.1197], [72.8478, 19.0178]]),
            ("stn-dadar", "stn-lower-parel", "rail", 3.5, 5.0, 75000, [[72.8478, 19.0178], [72.8300, 18.9950]]),
            ("stn-lower-parel", "stn-churchgate", "rail", 8.0, 12.0, 130000, [[72.8300, 18.9950], [72.8264, 18.9322]]),
            ("stn-churchgate", "stn-csmt", "walk", 1.2, 12.0, 30000, [[72.8264, 18.9322], [72.8350, 18.9400]]),

            # Harbour Railway Corridor
            ("stn-vashi", "stn-csmt", "rail", 28.0, 38.0, 50000, [[72.9980, 19.0645], [72.8350, 18.9400]]),

            # Arterial Roads (Dr. Ambedkar Road / Sane Guruji Marg)
            ("stn-dadar", "jnc-dadar-tt", "road", 0.5, 3.0, 25000, [[72.8478, 19.0178], [72.8450, 19.0190]]),
            ("jnc-dadar-tt", "jnc-bharat-mata", "road", 2.2, 7.0, 18000, [[72.8450, 19.0190], [72.8380, 18.9960]]),
            ("jnc-bharat-mata", "jnc-lalbaug-flyover", "road", 1.4, 5.0, 15000, [[72.8380, 18.9960], [72.8340, 18.9890]]),
            ("jnc-lalbaug-flyover", "stn-byculla", "road", 1.8, 6.0, 14000, [[72.8340, 18.9890], [72.8330, 18.9750]]),
            ("stn-dadar", "jnc-tilak-bridge", "road", 0.4, 2.0, 20000, [[72.8478, 19.0178], [72.8420, 19.0160]]),
            ("jnc-tilak-bridge", "stn-lower-parel", "road", 2.5, 8.0, 15000, [[72.8420, 19.0160], [72.8300, 18.9950]]),

            # Pedestrian Mandals Access Paths
            ("stn-curry-road", "loc-lalbaugcha-raja", "walk", 0.6, 7.0, 25000, [[72.8336, 18.9942], [72.8355, 18.9912]]),
            ("stn-chinchpokli", "loc-lalbaugcha-raja", "walk", 0.8, 9.0, 20000, [[72.8320, 18.9880], [72.8355, 18.9912]]),
            ("stn-parel", "loc-lalbaugcha-raja", "walk", 1.4, 14.0, 18000, [[72.8398, 19.0022], [72.8355, 18.9912]]),
            ("jnc-bharat-mata", "loc-lalbaugcha-raja", "walk", 0.4, 4.0, 30000, [[72.8380, 18.9960], [72.8355, 18.9912]]),
            ("jnc-bharat-mata", "loc-ganesh-galli", "walk", 0.3, 3.0, 25000, [[72.8380, 18.9960], [72.8370, 18.9930]]),
            ("loc-lalbaugcha-raja", "loc-ganesh-galli", "walk", 0.3, 3.0, 20000, [[72.8355, 18.9912], [72.8370, 18.9930]]),
            ("stn-byculla", "loc-khetwadi-12", "road", 2.0, 12.0, 15000, [[72.8330, 18.9750], [72.8210, 18.9600]]),
            ("stn-churchgate", "loc-khetwadi-12", "road", 3.5, 14.0, 16000, [[72.8264, 18.9322], [72.8210, 18.9600]]),
            ("loc-khetwadi-12", "loc-girgaon-chowpatty", "walk", 1.2, 12.0, 25000, [[72.8210, 18.9600], [72.8120, 18.9540]]),
            ("stn-churchgate", "loc-girgaon-chowpatty", "road", 2.5, 6.0, 16000, [[72.8264, 18.9322], [72.8120, 18.9540]]),
        ]

        # Add bidirectional edges
        for u, v, etype, dist, ttime, cap, geom in edge_data:
            # Forward
            fwd_id = f"edge-{u}-{v}"
            fwd_edge = NetworkEdge(
                id=fwd_id,
                source=u,
                target=v,
                type=etype,
                distance_km=dist,
                travel_time_min=ttime,
                capacity_per_hour=cap,
                effective_capacity=cap,
                status='OPEN',
                geometry=geom
            )
            self.edges[fwd_id] = fwd_edge
            self.graph.add_edge(u, v, id=fwd_id, weight=ttime, distance=dist, capacity=cap, effective_capacity=cap, status='OPEN', type=etype)

            # Reverse
            rev_id = f"edge-{v}-{u}"
            rev_geom = list(reversed(geom))
            rev_edge = NetworkEdge(
                id=rev_id,
                source=v,
                target=u,
                type=etype,
                distance_km=dist,
                travel_time_min=ttime,
                capacity_per_hour=cap,
                effective_capacity=cap,
                status='OPEN',
                geometry=rev_geom
            )
            self.edges[rev_id] = rev_edge
            self.graph.add_edge(v, u, id=rev_id, weight=ttime, distance=dist, capacity=cap, effective_capacity=cap, status='OPEN', type=etype)

        logger.info(f"[NETWORK] Initialized Mumbai graph with {len(self.nodes)} nodes and {len(self.edges)} directed edges (Version {self.version})")

    def _get_active_subgraph(self, exclude_edge_ids: Optional[List[str]] = None) -> nx.DiGraph:
        """
        Returns a view/copy of the graph filtering out CLOSED or zero-capacity edges.
        """
        exclude_set = set(exclude_edge_ids or [])
        sub = nx.DiGraph()
        for n, d in self.graph.nodes(data=True):
            sub.add_node(n, **d)
            
        for u, v, d in self.graph.edges(data=True):
            edge_id = d.get('id')
            status = d.get('status', 'OPEN')
            effective_cap = d.get('effective_capacity', 1)
            
            # Filter closed edges
            if status == 'CLOSED' or effective_cap <= 0 or edge_id in exclude_set:
                continue
                
            sub.add_edge(u, v, **d)
        return sub

    def _resolve_node_id(self, identifier: str) -> str:
        """Resolves zone aliases (e.g. 'thane' -> 'zone-thane') or direct node IDs."""
        if identifier in self.nodes:
            return identifier
        zone_alias = f"zone-{identifier}"
        if zone_alias in self.nodes:
            return zone_alias
        loc_alias = f"loc-{identifier}"
        if loc_alias in self.nodes:
            return loc_alias
        stn_alias = f"stn-{identifier}"
        if stn_alias in self.nodes:
            return stn_alias
        return identifier

    def get_route(self, source_id: str, target_id: str) -> RouteResult:
        """
        Calculates optimal primary shortest path based on travel time through open network edges.
        """
        src = self._resolve_node_id(source_id)
        tgt = self._resolve_node_id(target_id)

        if src not in self.nodes or tgt not in self.nodes:
            return RouteResult(
                source=source_id,
                target=target_id,
                path_nodes=[],
                path_node_names=[],
                path_zones=[],
                edge_ids=[],
                total_distance_km=0.0,
                total_travel_time_min=0.0,
                status="UNAVAILABLE",
                reason=f"Invalid endpoints: {source_id} -> {target_id}"
            )

        active_g = self._get_active_subgraph()

        try:
            path = nx.shortest_path(active_g, source=src, target=tgt, weight='weight')
            
            # Compute path aggregates
            total_time = 0.0
            total_dist = 0.0
            edge_ids = []
            path_names = [self.nodes[n].name for n in path]
            path_zones = []
            
            for i in range(len(path) - 1):
                u, v = path[i], path[i+1]
                edge_data = active_g.get_edge_data(u, v)
                total_time += edge_data.get('weight', 0.0)
                total_dist += edge_data.get('distance', 0.0)
                edge_ids.append(edge_data.get('id'))
                
                z = self.nodes[u].zone_id
                if not path_zones or path_zones[-1] != z:
                    path_zones.append(z)
                    
            final_zone = self.nodes[path[-1]].zone_id
            if not path_zones or path_zones[-1] != final_zone:
                path_zones.append(final_zone)

            return RouteResult(
                source=source_id,
                target=target_id,
                path_nodes=path,
                path_node_names=path_names,
                path_zones=path_zones,
                edge_ids=edge_ids,
                total_distance_km=round(total_dist, 1),
                total_travel_time_min=round(total_time, 1),
                status="AVAILABLE"
            )
        except nx.NetworkXNoPath:
            return RouteResult(
                source=source_id,
                target=target_id,
                path_nodes=[],
                path_node_names=[],
                path_zones=[],
                edge_ids=[],
                total_distance_km=0.0,
                total_travel_time_min=0.0,
                status="UNAVAILABLE",
                reason="NO_CONNECTED_ROUTE"
            )

    def get_alternative_route(self, source_id: str, target_id: str) -> RouteResult:
        """
        Calculates a secondary alternative route avoiding the primary route's critical bottleneck edges.
        """
        primary = self.get_route(source_id, target_id)
        if primary.status != "AVAILABLE" or len(primary.edge_ids) <= 1:
            return primary

        # Temporarily exclude the most significant intermediate edge of the primary route
        # (e.g. the rail link into the crowd zone)
        exclude_edge = primary.edge_ids[len(primary.edge_ids) // 2]
        
        # Also exclude the reverse direction
        active_g = self._get_active_subgraph(exclude_edge_ids=[exclude_edge])
        src = self._resolve_node_id(source_id)
        tgt = self._resolve_node_id(target_id)

        try:
            path = nx.shortest_path(active_g, source=src, target=tgt, weight='weight')
            total_time = 0.0
            total_dist = 0.0
            edge_ids = []
            path_names = [self.nodes[n].name for n in path]
            path_zones = []
            
            for i in range(len(path) - 1):
                u, v = path[i], path[i+1]
                edge_data = active_g.get_edge_data(u, v)
                total_time += edge_data.get('weight', 0.0)
                total_dist += edge_data.get('distance', 0.0)
                edge_ids.append(edge_data.get('id'))
                z = self.nodes[u].zone_id
                if not path_zones or path_zones[-1] != z:
                    path_zones.append(z)
            final_zone = self.nodes[path[-1]].zone_id
            if not path_zones or path_zones[-1] != final_zone:
                path_zones.append(final_zone)

            return RouteResult(
                source=source_id,
                target=target_id,
                path_nodes=path,
                path_node_names=path_names,
                path_zones=path_zones,
                edge_ids=edge_ids,
                total_distance_km=round(total_dist, 1),
                total_travel_time_min=round(total_time, 1),
                status="AVAILABLE",
                is_alternative=True,
                reason="Secondary alternative path bypassing primary transit bottleneck"
            )
        except (nx.NetworkXNoPath, nx.NodeNotFound):
            return primary

    def is_reachable(self, source_id: str, target_id: str) -> bool:
        """Checks graph reachability over active open connections."""
        route = self.get_route(source_id, target_id)
        return route.status == "AVAILABLE"

    def close_edge(self, edge_id: str) -> Dict[str, Any]:
        """
        Disrupts/closes an edge (e.g. Central Line rail blockage or Road Closure).
        Sets effective_capacity = 0 and status = 'CLOSED'.
        """
        if edge_id in self.edges:
            edge = self.edges[edge_id]
            edge.status = 'CLOSED'
            edge.effective_capacity = 0
            
            # Update graph
            if self.graph.has_edge(edge.source, edge.target):
                self.graph[edge.source][edge.target]['status'] = 'CLOSED'
                self.graph[edge.source][edge.target]['effective_capacity'] = 0

            # Also close reverse edge if symmetric
            rev_id = f"edge-{edge.target}-{edge.source}"
            if rev_id in self.edges:
                rev_edge = self.edges[rev_id]
                rev_edge.status = 'CLOSED'
                rev_edge.effective_capacity = 0
                if self.graph.has_edge(edge.target, edge.source):
                    self.graph[edge.target][edge.source]['status'] = 'CLOSED'
                    self.graph[edge.target][edge.source]['effective_capacity'] = 0

            self.version += 1
            logger.info(f"[NETWORK] Closed connection {edge_id} (New Version {self.version})")
            return {"edge_id": edge_id, "status": "CLOSED", "effective_capacity": 0, "network_version": self.version}
        return {"error": f"Edge {edge_id} not found"}

    def open_edge(self, edge_id: str) -> Dict[str, Any]:
        """
        Reopens a previously closed or degraded edge to full capacity.
        """
        if edge_id in self.edges:
            edge = self.edges[edge_id]
            edge.status = 'OPEN'
            edge.effective_capacity = edge.capacity_per_hour
            
            if self.graph.has_edge(edge.source, edge.target):
                self.graph[edge.source][edge.target]['status'] = 'OPEN'
                self.graph[edge.source][edge.target]['effective_capacity'] = edge.capacity_per_hour

            rev_id = f"edge-{edge.target}-{edge.source}"
            if rev_id in self.edges:
                rev_edge = self.edges[rev_id]
                rev_edge.status = 'OPEN'
                rev_edge.effective_capacity = rev_edge.capacity_per_hour
                if self.graph.has_edge(edge.target, edge.source):
                    self.graph[edge.target][edge.source]['status'] = 'OPEN'
                    self.graph[edge.target][edge.source]['effective_capacity'] = rev_edge.capacity_per_hour

            self.version += 1
            logger.info(f"[NETWORK] Reopened connection {edge_id} (New Version {self.version})")
            return {"edge_id": edge_id, "status": "OPEN", "effective_capacity": edge.capacity_per_hour, "network_version": self.version}
        return {"error": f"Edge {edge_id} not found"}

    def set_edge_capacity(self, edge_id: str, new_capacity: int) -> Dict[str, Any]:
        """
        Restricts or degrades edge capacity (e.g. rain speed restrictions).
        """
        if edge_id in self.edges:
            edge = self.edges[edge_id]
            edge.effective_capacity = max(0, new_capacity)
            edge.status = 'CLOSED' if edge.effective_capacity == 0 else 'RESTRICTED'
            
            if self.graph.has_edge(edge.source, edge.target):
                self.graph[edge.source][edge.target]['effective_capacity'] = edge.effective_capacity
                self.graph[edge.source][edge.target]['status'] = edge.status

            self.version += 1
            return {"edge_id": edge_id, "status": edge.status, "effective_capacity": edge.effective_capacity, "network_version": self.version}
        return {"error": f"Edge {edge_id} not found"}

    def reset(self):
        """Restores baseline open topology and full capacities."""
        self._initialize_network()
        logger.info("[NETWORK] Network graph reset to default baseline.")

    def get_summary(self) -> Dict[str, Any]:
        """Returns network health and topology summary."""
        closed_count = sum(1 for e in self.edges.values() if e.status == 'CLOSED')
        restricted_count = sum(1 for e in self.edges.values() if e.status == 'RESTRICTED')
        
        return {
            "network_version": self.version,
            "total_nodes": len(self.nodes),
            "total_connections": len(self.edges) // 2, # Unique physical corridors
            "closed_connections": closed_count // 2,
            "restricted_connections": restricted_count // 2,
            "status": "DISRUPTED" if closed_count > 0 else "OPERATIONAL"
        }

    def get_network_geojson(self) -> Dict[str, Any]:
        """
        Generates GeoJSON FeatureCollections for MapLibre layer rendering.
        """
        edge_features = []
        # Unique undirected edges for rendering
        seen_pairs = set()
        for e in self.edges.values():
            pair = tuple(sorted([e.source, e.target]))
            if pair in seen_pairs or not e.geometry:
                continue
            seen_pairs.add(pair)
            
            edge_features.append({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": e.geometry
                },
                "properties": {
                    "id": e.id,
                    "source": e.source,
                    "target": e.target,
                    "type": e.type,
                    "distance_km": e.distance_km,
                    "travel_time_min": e.travel_time_min,
                    "capacity": e.capacity_per_hour,
                    "effective_capacity": e.effective_capacity,
                    "status": e.status,
                    "color": "#51423D" if e.status == 'CLOSED' else "#B85C3E" if e.status == 'RESTRICTED' else "#536873"
                }
            })

        node_features = []
        for n in self.nodes.values():
            node_features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [n.lng, n.lat]
                },
                "properties": {
                    "id": n.id,
                    "name": n.name,
                    "type": n.type,
                    "zone_id": n.zone_id,
                    "capacity": n.capacity,
                    "status": n.status
                }
            })

        return {
            "type": "FeatureCollection",
            "features": edge_features + node_features
        }

# Global Singleton Network Instance
_global_network: Optional[MumbaiNetwork] = None

def get_network() -> MumbaiNetwork:
    global _global_network
    if _global_network is None:
        _global_network = MumbaiNetwork()
    return _global_network
