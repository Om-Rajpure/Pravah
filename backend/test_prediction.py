"""
PRAVAAH Network-Aware Prediction Engine Test Suite
Phase 7 Validation
"""

import unittest
from app import create_app
from services.prediction_service import get_predictor
from services.network_service import get_network
from services.simulator import get_simulator

class TestPredictionEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.predictor = get_predictor()
        cls.network = get_network()
        cls.simulator = get_simulator()

    def setUp(self):
        self.network.reset()
        self.simulator.reset()
        self.predictor.cache = {}

    def test_01_multi_horizon_completeness_and_bounds(self):
        """Verify all 11 zones generate valid predictions across 30m, 60m, 120m, 180m."""
        preds = self.predictor.predict_all_zones()
        self.assertEqual(len(preds["zones"]), 11)
        self.assertIn("forecast_time", preds)
        self.assertIn("model_version", preds)

        for z in preds["zones"]:
            self.assertGreaterEqual(z["current_pressure"], 0)
            self.assertLessEqual(z["current_pressure"], 100)
            self.assertEqual(len(z["predictions"]), 4) # 30m, 60m, 120m, 180m
            
            horizons = [p["horizon_minutes"] for p in z["predictions"]]
            self.assertEqual(horizons, [30, 60, 120, 180])

            for p in z["predictions"]:
                self.assertGreaterEqual(p["predicted_pressure"], 0)
                self.assertLessEqual(p["predicted_pressure"], 100)
                self.assertGreaterEqual(p["confidence"], 0.60)
                self.assertLessEqual(p["confidence"], 1.0)
                self.assertIn(p["predicted_level"], ["LOW", "MODERATE", "HIGH", "CRITICAL"])

    def test_02_explainability_drivers(self):
        """Verify plain-language human-readable drivers exist without technical jargon."""
        preds = self.predictor.predict_all_zones()
        for z in preds["zones"]:
            self.assertGreater(len(z["drivers"]), 0)
            self.assertLessEqual(len(z["drivers"]), 4)
            for d in z["drivers"]:
                self.assertNotIn("feature_", d)
                self.assertNotIn("residual", d)
                self.assertNotIn("lightgbm", d.lower())
                self.assertGreater(len(d), 10)

    def test_03_network_disruption_sensitivity(self):
        """
        MANDATORY SECTION 65 & 80 TEST:
        1. Run baseline forecast.
        2. Close Curry Road pedestrian access.
        3. Recalculate forecast.
        4. Verify prediction adapts (flow rerouting changes forecast or drivers).
        5. Reopen connection.
        """
        # Step 1: Baseline
        base_preds = self.predictor.predict_all_zones()
        curry_base = next(z for z in base_preds["zones"] if z["zone_id"] == "curry-road")
        parel_base = next(z for z in base_preds["zones"] if z["zone_id"] == "parel")
        base_curry_pred = curry_base["predictions"][2]["predicted_pressure"] # 120m

        # Step 2: Close connection
        self.network.close_edge("edge-stn-curry-road-loc-lalbaugcha-raja")
        self.predictor.cache = {} # Invalidate cache

        # Step 3: Recalculate forecast
        disrupted_preds = self.predictor.predict_all_zones()
        self.assertTrue(disrupted_preds["disruption_active"])
        curry_disrupted = next(z for z in disrupted_preds["zones"] if z["zone_id"] == "curry-road")
        parel_disrupted = next(z for z in disrupted_preds["zones"] if z["zone_id"] == "parel")

        # Step 4: Verify network sensitivity
        self.assertNotEqual(
            curry_base["predictions"][2]["predicted_pressure"],
            curry_disrupted["predictions"][2]["predicted_pressure"],
            "Prediction failed to adapt to network disruption!"
        )
        self.assertIn("Platform gate restriction", str(curry_disrupted["drivers"]))

        # Step 5: Reopen
        self.network.open_edge("edge-stn-curry-road-loc-lalbaugcha-raja")

    def test_04_prediction_api_endpoints(self):
        """Test prediction HTTP endpoints."""
        # 1. Full predictions
        res = self.client.get('/api/predictions')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.get_json()["zones"]), 11)

        # 2. Overview
        res_overview = self.client.get('/api/predictions/overview')
        self.assertEqual(res_overview.status_code, 200)
        self.assertIn("top_zones", res_overview.get_json())

        # 3. Zone specific
        res_zone = self.client.get('/api/predictions/zone/curry-road')
        self.assertEqual(res_zone.status_code, 200)
        self.assertEqual(res_zone.get_json()["zone_id"], "curry-road")

if __name__ == '__main__':
    unittest.main()
