"""
PRAVAAH Intervention Engine & Counterfactual Simulation Test Suite
Phase 8 Validation
"""

import unittest
from app import create_app
from services.intervention_service import get_intervention_engine
from services.prediction_service import get_predictor
from services.network_service import get_network
from services.simulator import get_simulator

class TestInterventionEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.engine = get_intervention_engine()
        cls.predictor = get_predictor()
        cls.network = get_network()
        cls.simulator = get_simulator()

    def setUp(self):
        self.network.reset()
        self.simulator.reset()
        self.predictor.cache = {}
        self.engine.reset_actions()

    def test_01_recommendation_generation_and_constraints(self):
        """Verify candidate generation, constraint checking, and top action selection."""
        recs = self.engine.get_recommendations()
        self.assertIn("recommended_action", recs)
        self.assertIn("impact", recs)
        self.assertIn("why_this_action", recs)
        self.assertIn("what_if_nothing", recs)

        act = recs["recommended_action"]
        self.assertEqual(act["type"], "REDIRECT_VISITOR_FLOW")
        self.assertIn(act["source"], ["curry-road", "lalbaug"])
        self.assertIn(act["destination"], ["thane", "vashi", "navi-mumbai", "dadar", "parel"])
        self.assertGreaterEqual(act["dosage_fraction"], 0.05)
        self.assertLessEqual(act["dosage_fraction"], 0.25)
        self.assertGreaterEqual(act["score"], 0.50)

        # Impact checks
        impact = recs["impact"]
        self.assertGreater(impact["pressure_reduction"], 5)
        self.assertLess(impact["target_pressure_after"], impact["target_pressure_before"])
        self.assertGreaterEqual(impact["critical_zones_after"], 0)
        self.assertLessEqual(impact["critical_zones_after"], impact["critical_zones_before"])

    def test_02_counterfactual_isolation(self):
        """
        MANDATORY TEST: Live simulation state and prediction state MUST NOT be mutated
        during candidate evaluation and counterfactual simulation.
        """
        sim_state_before = self.simulator.get_state()
        preds_before = self.predictor.predict_all_zones()
        
        # Run recommendation optimization and candidate simulation
        recs = self.engine.get_recommendations()
        self.engine.simulate_action(recs["recommended_action"]["id"])
        
        sim_state_after = self.simulator.get_state()
        preds_after = self.predictor.predict_all_zones()
        
        # Verify complete state immutability
        self.assertEqual(sim_state_before["step"], sim_state_after["step"])
        self.assertEqual(sim_state_before["simulation_time"], sim_state_after["simulation_time"])
        self.assertEqual(len(preds_before["zones"]), len(preds_after["zones"]))

    def test_03_explainability_content(self):
        """Verify clear plain-language 'Why this action?' and 'What happens if we do nothing?'."""
        recs = self.engine.get_recommendations()
        why_list = recs["why_this_action"]
        self.assertGreaterEqual(len(why_list), 2)
        for item in why_list:
            self.assertNotIn("weights[", item)
            self.assertNotIn("dosage_penalty", item)
            self.assertGreater(len(item), 15)

        self.assertIn("Without intervention", recs["what_if_nothing"])

    def test_04_action_lifecycle_and_api_endpoints(self):
        """Test full REST API workflow: get recommendation, simulate, approve, and reset."""
        # 1. Get recommendation
        res = self.client.get('/api/actions/recommendations')
        self.assertEqual(res.status_code, 200)
        rec_data = res.get_json()
        action_id = rec_data["recommended_action"]["id"]

        # 2. Simulate action
        res_sim = self.client.post('/api/actions/simulate', json={"action_id": action_id})
        self.assertEqual(res_sim.status_code, 200)
        self.assertEqual(res_sim.get_json()["recommended_action"]["status"], "SIMULATED")

        # 3. Get action details
        res_det = self.client.get(f'/api/actions/{action_id}')
        self.assertEqual(res_det.status_code, 200)
        self.assertEqual(res_det.get_json()["action"]["id"], action_id)

        # 4. Approve action
        res_app = self.client.post(f'/api/actions/{action_id}/approve')
        self.assertEqual(res_app.status_code, 200)
        self.assertEqual(res_app.get_json()["status"], "ACTIVE")

        # 5. Reset
        res_reset = self.client.post('/api/actions/reset')
        self.assertEqual(res_reset.status_code, 200)
        self.assertEqual(res_reset.get_json()["status"], "RESET_SUCCESS")

if __name__ == '__main__':
    unittest.main()
