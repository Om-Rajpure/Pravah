"""
PRAVAAH Scenario Injector & What-If Simulation Test Suite
Phase 9 Validation
"""

import unittest
from app import create_app
from services.scenario_service import get_scenario_engine
from services.network_service import get_network
from services.simulator import get_simulator

class TestScenarioEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.engine = get_scenario_engine()
        cls.network = get_network()
        cls.simulator = get_simulator()

    def setUp(self):
        self.engine.reset_scenario()
        self.network.reset()
        self.simulator.reset()

    def test_01_scenario_registry_and_cascades(self):
        """Verify the 3 primary demo scenarios exist with valid metadata and cascades."""
        scenarios = self.engine.get_available_scenarios()
        self.assertEqual(len(scenarios), 3)
        ids = [s["id"] for s in scenarios]
        self.assertIn("central-line-disruption", ids)
        self.assertIn("heavy-rain", ids)
        self.assertIn("road-closure", ids)

        # Check detail & cascade
        detail = self.engine.get_scenario_definition("central-line-disruption")
        self.assertIsNotNone(detail)
        self.assertEqual(len(detail["cascade"]), 5)
        stages = [c["stage"] for c in detail["cascade"]]
        self.assertEqual(stages, ['TRIGGER', 'NETWORK', 'FLOW', 'PRESSURE', 'RESPONSE'])

    def test_02_counterfactual_what_if_simulation(self):
        """
        MANDATORY TEST:
        Simulating a scenario must return a 3-way scorecard (Baseline vs Disruption vs + Action)
        WITHOUT mutating the live baseline demo state.
        """
        curr_before = self.engine.get_current_scenario()
        self.assertIsNone(curr_before["active_scenario_id"])

        sim_res = self.engine.simulate_scenario("central-line-disruption")
        self.assertIn("scorecard", sim_res)
        self.assertIn("cascade", sim_res)
        self.assertIn("summary", sim_res)

        # Verify 3-way scorecard dynamics
        scorecard = {row["zone_id"]: row for row in sim_res["scorecard"]}
        curry_row = scorecard["curry-road"]
        self.assertEqual(curry_row["baseline_pressure"], 72)
        self.assertEqual(curry_row["disruption_pressure"], 91)
        self.assertEqual(curry_row["action_pressure"], 74)
        self.assertGreater(curry_row["disruption_delta"], 0)
        self.assertLess(curry_row["action_delta"], 0)

        # Verify live state was NOT mutated
        curr_after = self.engine.get_current_scenario()
        self.assertIsNone(curr_after["active_scenario_id"])

    def test_03_heavy_rain_and_road_closure_simulations(self):
        """Verify Heavy Rain and Road Closure produce plausible what-if pressure shifts."""
        rain_res = self.engine.simulate_scenario("heavy-rain")
        scorecard_rain = {row["zone_id"]: row for row in rain_res["scorecard"]}
        self.assertGreater(scorecard_rain["dadar"]["disruption_pressure"], scorecard_rain["dadar"]["baseline_pressure"])

        road_res = self.engine.simulate_scenario("road-closure")
        scorecard_road = {row["zone_id"]: row for row in road_res["scorecard"]}
        self.assertGreater(scorecard_road["parel"]["disruption_pressure"], scorecard_road["parel"]["baseline_pressure"])

    def test_04_activation_and_reset_lifecycle(self):
        """Verify scenario activation alters network state and reset restores baseline cleanly."""
        # 1. Activate Central Line disruption
        act_res = self.engine.activate_scenario("central-line-disruption")
        self.assertEqual(act_res["status"], "ACTIVE")
        self.assertEqual(self.network.edges["edge-stn-parel-stn-curry-road"].status, "CLOSED")

        # 2. Reset scenario
        reset_res = self.engine.reset_scenario()
        self.assertEqual(reset_res["status"], "BASELINE_RESTORED")
        self.assertEqual(self.network.edges["edge-stn-parel-stn-curry-road"].status, "OPEN")

    def test_05_scenario_api_endpoints(self):
        """Test scenario REST API routes."""
        # 1. List scenarios
        res_list = self.client.get('/api/scenarios')
        self.assertEqual(res_list.status_code, 200)
        self.assertEqual(len(res_list.get_json()), 3)

        # 2. Simulate What-If
        res_sim = self.client.post('/api/scenarios/simulate', json={"scenario_id": "central-line-disruption"})
        self.assertEqual(res_sim.status_code, 200)
        self.assertIn("scorecard", res_sim.get_json())

        # 3. Activate
        res_act = self.client.post('/api/scenarios/activate', json={"scenario_id": "central-line-disruption"})
        self.assertEqual(res_act.status_code, 200)

        # 4. Current
        res_curr = self.client.get('/api/scenarios/current')
        self.assertEqual(res_curr.status_code, 200)
        self.assertEqual(res_curr.get_json()["active_scenario_id"], "central-line-disruption")

        # 5. Reset
        res_reset = self.client.post('/api/scenarios/reset')
        self.assertEqual(res_reset.status_code, 200)

if __name__ == '__main__':
    unittest.main()
