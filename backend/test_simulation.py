"""
PRAVAAH Crowd Simulation & Determinism Test Suite
Phase 5 Validation
"""

import unittest
from app import create_app
from services.simulator import get_simulator

class TestCrowdSimulator(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.simulator = get_simulator()

    def setUp(self):
        self.simulator.reset()

    def test_01_initial_state_and_time(self):
        """Test initial 18:00 deterministic state."""
        state = self.simulator.get_state()
        self.assertEqual(state["simulation_time"], "18:00")
        self.assertEqual(state["status"], "PAUSED")
        self.assertEqual(state["step"], 0)
        self.assertGreater(len(state["zones"]), 0)
        self.assertGreater(len(state["stations"]), 0)
        self.assertGreater(len(state["hotels"]), 0)
        self.assertGreater(len(state["destinations"]), 0)

    def test_02_step_advancement(self):
        """Test discrete 5-minute step progression."""
        self.assertEqual(self.simulator.get_current_time_str(), "18:00")
        state1 = self.simulator.step()
        self.assertEqual(state1["simulation_time"], "18:05")
        self.assertEqual(state1["step"], 1)

        state2 = self.simulator.step()
        self.assertEqual(state2["simulation_time"], "18:10")
        self.assertEqual(state2["step"], 2)

    def test_03_flow_conservation_and_non_negativity(self):
        """Verify mass-balance invariants: no negative numbers, valid room counts."""
        for _ in range(6): # 30 mins
            state = self.simulator.step()
            
            # 1. Zone checks
            for z in state["zones"]:
                self.assertGreaterEqual(z["people"], 0, f"Negative people in zone {z['zone_id']}")
                self.assertGreater(z["capacity"], 0)
                self.assertGreaterEqual(z["utilization"], 0.0)
                self.assertIn(z["status"], ["LOW", "MODERATE", "HIGH", "CRITICAL"])

            # 2. Hotel checks
            for h in state["hotels"]:
                self.assertGreaterEqual(h["occupied_rooms"], 0)
                self.assertGreaterEqual(h["available_rooms"], 0)
                self.assertEqual(h["total_rooms"], h["occupied_rooms"] + h["available_rooms"])

            # 3. Station checks
            for s in state["stations"]:
                self.assertGreaterEqual(s["current_load"], 0)
                self.assertGreater(s["capacity"], 0)

    def test_04_thirty_minute_determinism_and_reset(self):
        """
        MANDATORY DEMO TEST:
        Run 18:00 -> 18:30 (6 steps), record state.
        Reset to 18:00.
        Run 18:00 -> 18:30 (6 steps) again.
        Assert identical results.
        """
        # Run 1
        for _ in range(6):
            self.simulator.step()
        state_run_1 = self.simulator.get_state()
        self.assertEqual(state_run_1["simulation_time"], "18:30")
        zones_run_1 = {z["zone_id"]: z["people"] for z in state_run_1["zones"]}
        stations_run_1 = {s["station_id"]: s["current_load"] for s in state_run_1["stations"]}
        hotels_run_1 = {h["hotel_id"]: h["occupied_rooms"] for h in state_run_1["hotels"]}

        # Reset
        self.simulator.reset()
        self.assertEqual(self.simulator.get_current_time_str(), "18:00")

        # Run 2
        for _ in range(6):
            self.simulator.step()
        state_run_2 = self.simulator.get_state()
        self.assertEqual(state_run_2["simulation_time"], "18:30")
        zones_run_2 = {z["zone_id"]: z["people"] for z in state_run_2["zones"]}
        stations_run_2 = {s["station_id"]: s["current_load"] for s in state_run_2["stations"]}
        hotels_run_2 = {h["hotel_id"]: h["occupied_rooms"] for h in state_run_2["hotels"]}

        # Verify exact equality
        self.assertEqual(zones_run_1, zones_run_2, "Zone population mismatch after reset!")
        self.assertEqual(stations_run_1, stations_run_2, "Station load mismatch after reset!")
        self.assertEqual(hotels_run_1, hotels_run_2, "Hotel occupancy mismatch after reset!")

    def test_05_privacy_by_design(self):
        """Verify that individual visitor IDs and personal paths are NEVER exposed."""
        response = self.client.get('/api/simulation/state')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        
        # Must contain aggregated sections
        self.assertIn("zones", data)
        self.assertIn("stations", data)
        self.assertIn("hotels", data)
        self.assertIn("destinations", data)
        
        # Must NOT contain individual visitor agent records
        self.assertNotIn("visitors", data)
        self.assertNotIn("visitor_id", str(data))
        self.assertNotIn("home_address", str(data))
        self.assertNotIn("personal_route", str(data))

    def test_06_simulation_api_endpoints(self):
        """Test all simulation HTTP endpoints."""
        # 1. Get Time
        res = self.client.get('/api/simulation/time')
        self.assertEqual(res.status_code, 200)
        self.assertIn("simulation_time", res.get_json())

        # 2. Step
        res = self.client.post('/api/simulation/step')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["step"], 1)

        # 3. Start & Pause
        res = self.client.post('/api/simulation/start')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["status"], "RUNNING")

        res = self.client.post('/api/simulation/pause')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["status"], "PAUSED")

        # 4. Reset
        res = self.client.post('/api/simulation/reset')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["state"]["simulation_time"], "18:00")

if __name__ == '__main__':
    unittest.main()
