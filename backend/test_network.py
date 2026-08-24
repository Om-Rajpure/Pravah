"""
PRAVAAH Network Engine & Dynamic Connectivity Test Suite
Phase 6 Validation
"""

import unittest
from app import create_app
from services.network_service import get_network
from services.simulator import get_simulator

class TestMumbaiNetwork(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.network = get_network()

    def setUp(self):
        self.network.reset()

    def test_01_network_topology_and_validation(self):
        """Test that nodes and edges load correctly and validate data integrity."""
        summary = self.network.get_summary()
        self.assertGreater(summary["total_nodes"], 20)
        self.assertGreater(summary["total_connections"], 15)
        self.assertEqual(summary["status"], "OPERATIONAL")
        self.assertEqual(summary["closed_connections"], 0)

        # Integrity checks
        for edge_id, edge in self.network.edges.items():
            self.assertIn(edge.source, self.network.nodes, f"Missing source {edge.source} in edge {edge_id}")
            self.assertIn(edge.target, self.network.nodes, f"Missing target {edge.target} in edge {edge_id}")
            self.assertGreater(edge.distance_km, 0.0, f"Non-positive distance in {edge_id}")
            self.assertGreater(edge.travel_time_min, 0.0, f"Non-positive travel time in {edge_id}")
            self.assertGreaterEqual(edge.effective_capacity, 0, f"Negative capacity in {edge_id}")

    def test_02_baseline_routing(self):
        """Test optimal Dijkstra shortest path routing across key corridors."""
        # 1. Thane -> Lalbaug
        route_thane = self.network.get_route("thane", "lalbaug")
        self.assertEqual(route_thane.status, "AVAILABLE")
        self.assertIn("zone-thane", route_thane.path_nodes)
        self.assertIn("loc-lalbaugcha-raja", route_thane.path_nodes)
        self.assertGreater(route_thane.total_travel_time_min, 20.0)
        self.assertGreater(len(route_thane.edge_ids), 0)

        # 2. Andheri -> Lalbaug
        route_andheri = self.network.get_route("andheri", "lalbaug")
        self.assertEqual(route_andheri.status, "AVAILABLE")
        self.assertIn("stn-dadar", route_andheri.path_nodes)

        # 3. Vashi -> Lalbaug
        route_vashi = self.network.get_route("vashi", "lalbaug")
        self.assertEqual(route_vashi.status, "AVAILABLE")

    def test_03_critical_network_closure_and_rerouting(self):
        """
        MANDATORY SECTION 62 TEST:
        1. Calculate normal Thane -> Lalbaug route.
        2. Close Central Line Curry Road connection.
        3. Recalculate route and verify path changes, closed edge is excluded, and travel time updates.
        4. Reopen connection and verify original route returns.
        """
        # Step 1: Baseline Route
        normal_route = self.network.get_route("thane", "lalbaug")
        self.assertEqual(normal_route.status, "AVAILABLE")
        self.assertIn("stn-curry-road", normal_route.path_nodes)
        closed_edge_id = "edge-stn-curry-road-loc-lalbaugcha-raja"
        self.assertIn(closed_edge_id, normal_route.edge_ids)
        normal_time = normal_route.total_travel_time_min

        # Step 2: Close connection
        close_res = self.network.close_edge(closed_edge_id)
        self.assertEqual(close_res["status"], "CLOSED")
        self.assertEqual(close_res["effective_capacity"], 0)

        # Step 3: Recalculate route
        disrupted_route = self.network.get_route("thane", "lalbaug")
        self.assertEqual(disrupted_route.status, "AVAILABLE")

        # Step 4: Verify closed edge is strictly excluded and route diverted (e.g. via Chinchpokli or Parel/Bharat Mata)
        self.assertNotIn(closed_edge_id, disrupted_route.edge_ids)
        self.assertNotEqual(normal_route.path_nodes, disrupted_route.path_nodes)
        self.assertGreaterEqual(disrupted_route.total_travel_time_min, normal_time)

        # Step 5: Reopen connection
        open_res = self.network.open_edge(closed_edge_id)
        self.assertEqual(open_res["status"], "OPEN")

        # Step 6: Verify original route restored
        restored_route = self.network.get_route("thane", "lalbaug")
        self.assertEqual(restored_route.path_nodes, normal_route.path_nodes)
        self.assertEqual(restored_route.total_travel_time_min, normal_time)

    def test_04_alternative_routes(self):
        """Test secondary alternative route calculation."""
        primary = self.network.get_route("thane", "lalbaug")
        alt = self.network.get_alternative_route("thane", "lalbaug")

        self.assertEqual(primary.status, "AVAILABLE")
        self.assertEqual(alt.status, "AVAILABLE")
        self.assertTrue(alt.is_alternative)
        self.assertNotEqual(primary.edge_ids, alt.edge_ids)

    def test_05_network_api_endpoints(self):
        """Test all network HTTP endpoints."""
        # 1. Summary
        res = self.client.get('/api/network')
        self.assertEqual(res.status_code, 200)
        self.assertIn("total_nodes", res.get_json())

        # 2. GeoJSON
        res_geojson = self.client.get('/api/network/geojson')
        self.assertEqual(res_geojson.status_code, 200)
        self.assertEqual(res_geojson.get_json()["type"], "FeatureCollection")

        # 3. Route Calculation
        res_route = self.client.get('/api/network/route?source=thane&target=lalbaug')
        self.assertEqual(res_route.status_code, 200)
        route_data = res_route.get_json()
        self.assertIn("primary_route", route_data)
        self.assertIn("alternative_route", route_data)
        self.assertEqual(route_data["primary_route"]["status"], "AVAILABLE")

        # 4. Close & Open Edge
        test_edge = "edge-stn-parel-stn-curry-road"
        res_close = self.client.post(f'/api/network/edge/{test_edge}/close')
        self.assertEqual(res_close.status_code, 200)
        self.assertEqual(res_close.get_json()["status"], "CLOSED")

        res_open = self.client.post(f'/api/network/edge/{test_edge}/open')
        self.assertEqual(res_open.status_code, 200)
        self.assertEqual(res_open.get_json()["status"], "OPEN")

        # 5. Reset
        res_reset = self.client.post('/api/network/reset')
        self.assertEqual(res_reset.status_code, 200)

    def test_06_simulator_network_integration(self):
        """Verify simulator dynamically uses network routes and advances without errors."""
        sim = get_simulator()
        sim.reset()
        state = sim.step()
        self.assertEqual(state["simulation_time"], "18:05")
        self.assertGreater(len(state["zones"]), 0)

if __name__ == '__main__':
    unittest.main()
