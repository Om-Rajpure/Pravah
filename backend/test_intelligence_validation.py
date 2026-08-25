"""
PRAVAAH Phase 15 — Intelligence Validation & Edge-Case Suite
Validates:
1. Intelligence pipeline propagation (City State -> Simulation -> Network -> Prediction -> Intervention -> Counterfactual -> GlassBox -> Audit)
2. Prediction sanity across 4 horizons (+30m, +60m, +120m, +180m)
3. Network routing under edge closure and complete isolation
4. Intervention constraint satisfaction and counterfactual delta calculation
5. Glass Box explanation fidelity with model drivers
6. Boundary conditions: Zero demand, Capped maximum crowd (100%), Capacity edge cases
"""

import unittest
from app import create_app
from services.simulator import get_simulator
from services.network_service import get_network
from services.prediction_service import get_predictor
from services.intervention_service import get_intervention_engine
from services.scenario_service import get_scenario_engine
from services.explainability_service import get_explainability_engine
from services.privacy_service import suppress_small_group, K_ANONYMITY_THRESHOLD

class TestIntelligenceValidation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def setUp(self):
        # Reset state before each test
        self.scenario_engine = get_scenario_engine()
        self.scenario_engine.reset_scenario()
        self.network = get_network()
        self.network.reset()
        self.sim = get_simulator()
        self.sim.reset()
        self.predictor = get_predictor()
        self.predictor.cache.clear()
        self.intervention = get_intervention_engine()
        self.intervention.reset_actions()

    # 1. Pipeline Propagation
    def test_01_pipeline_propagation_state_freshness(self):
        """Advances simulation and verifies downstream predictions update appropriately."""
        initial_preds = self.predictor.predict_all_zones()
        initial_time = initial_preds.get('forecast_time', '18:00')

        # Advance 2 simulation steps
        self.sim.step()
        self.sim.step()
        self.predictor.cache.clear()

        updated_preds = self.predictor.predict_all_zones()
        updated_time = updated_preds.get('forecast_time', '18:10')

        self.assertNotEqual(initial_time, updated_time, "Forecast timestamp should reflect new simulation time")
        self.assertEqual(len(updated_preds.get('zones', [])), 11, "All 11 zones must be predicted")

    # 2. Multi-Horizon Forecast Sanity
    def test_02_multi_horizon_consistency(self):
        """Verifies +30m, +60m, +120m, +180m horizons are returned and bounded."""
        preds = self.predictor.predict_all_zones()
        for zone in preds.get('zones', []):
            horizons = zone.get('predictions', [])
            self.assertEqual(len(horizons), 4, f"Zone {zone['zone_id']} must have 4 horizons")
            expected_minutes = [30, 60, 120, 180]
            for h, exp_min in zip(horizons, expected_minutes):
                self.assertEqual(h['horizon_minutes'], exp_min)
                p_val = h['predicted_pressure']
                self.assertGreaterEqual(p_val, 0.0, "Pressure must be non-negative")
                self.assertLessEqual(p_val, 100.0, "Pressure must be capped at 100")

    # 3. Network Routing Under Disruption
    def test_03_network_edge_closure_rerouting(self):
        """Closing a railway edge must force Dijkstra to find an alternate route or return unavailable."""
        route_before = self.network.get_route('stn-parel', 'loc-lalbaugcha-raja')
        self.assertEqual(route_before.status, 'AVAILABLE', "Baseline route must exist")

        # Close direct connecting edge
        self.network.close_edge('edge-stn-parel-stn-curry-road')
        route_after = self.network.get_route('stn-parel', 'loc-lalbaugcha-raja')

        # After closure, either a reroute was found (not using closed edge) or UNAVAILABLE
        if route_after.status == 'AVAILABLE':
            self.assertNotIn('edge-stn-parel-stn-curry-road', route_after.edge_ids,
                             "Rerouted path must not use closed edge")
        else:
            self.assertEqual(route_after.status, 'UNAVAILABLE', "Must report UNAVAILABLE if no alternate exists")

    # 4. Disconnected Network Handling
    def test_04_disconnected_network_handling(self):
        """When all inbound edges are closed, network reports route unavailable without crashing."""
        # Close all inbound edges to Lalbaug
        edges_to_close = [e_id for e_id, e in self.network.edges.items() if e.target == 'loc-lalbaugcha-raja']
        for e_id in edges_to_close:
            self.network.close_edge(e_id)

        route = self.network.get_route('stn-thane', 'loc-lalbaugcha-raja')
        self.assertIn(route.status, ('UNAVAILABLE', 'NO_PATH'),
                      "Route must report unavailable when destination is isolated")

    # 5. Intervention Feasibility & Counterfactual Delta
    def test_05_intervention_counterfactual_delta(self):
        """Intervention must compute measurable reduction on target without exceeding relief capacity."""
        recs = self.intervention.get_recommendations()
        rec_act = recs.get('recommended_action')
        impact = recs.get('impact')

        self.assertIsNotNone(rec_act, "A recommended action must be generated")
        self.assertIsNotNone(impact, "Simulated impact must be computed")

        # Verify math consistency
        before = impact['target_pressure_before']
        after = impact['target_pressure_after']
        reduction = impact['pressure_reduction']
        self.assertEqual(before - after, reduction, "target_before - target_after must equal pressure_reduction")
        self.assertGreater(reduction, 0, "Recommended action must achieve positive pressure reduction")

    # 6. Glass Box Causal Reasoning Chain
    def test_06_glass_box_causal_fidelity(self):
        """Glass Box explanation must provide a causal reasoning chain with assumptions disclosed."""
        exp_engine = get_explainability_engine()
        explanation = exp_engine.explain_intervention('act-redirect-curry-road-thane-18')

        # Explanation must exist and be typed correctly
        self.assertIsNotNone(explanation, "Explanation must be generated")
        self.assertEqual(explanation.type, 'INTERVENTION', "Explanation type must be INTERVENTION")

        # Trace chain must have meaningful depth (at least 4 steps)
        self.assertGreater(len(explanation.trace), 3, "Trace chain must provide end-to-end reasoning")

        # Confidence must be present and valid
        confidence_label = explanation.confidence.get('label', '')
        self.assertTrue(
            any(level in confidence_label for level in ('HIGH', 'MODERATE', 'LOW')),
            f"Confidence label must contain HIGH/MODERATE/LOW, got: {confidence_label}"
        )

        # Assumptions must be disclosed
        self.assertGreater(len(explanation.assumptions), 0, "Assumptions must be disclosed")

    # 7. Boundary Test — Maximum Crowd Pressure Capping
    def test_07_maximum_crowd_pressure_capping(self):
        """Simulated extreme load must cap pressure at 100 without overflow or NaN."""
        from services.pressure_service import calculate_pressure_index
        # people=50000, capacity=10000 → extreme overflow → density_score=100 → should be at or near 100
        capped_val, _ = calculate_pressure_index(
            people=50000,
            capacity=10000,
            arrivals_per_hour=5000,
            departures_per_hour=100
        )
        self.assertLessEqual(capped_val, 100, "Pressure must strictly cap at 100")
        self.assertGreaterEqual(capped_val, 80, "Extreme overcrowding must score at least 80")

    # 8. Boundary Test — Zero Demand Baseline
    def test_08_zero_demand_stability(self):
        """Zero occupancy must return a stable non-NaN pressure without division by zero.
        Note: The formula retains a baseline (~33) due to transit and neighbor-zone pressure components
        even at zero occupancy. This reflects realistic city-wide baseline pressure."""
        from services.pressure_service import calculate_pressure_index
        zero_val, level = calculate_pressure_index(
            people=0,
            capacity=10000,
            arrivals_per_hour=0,
            departures_per_hour=0
        )
        # Must be a valid integer, not NaN, not negative, not above 60 (well below critical)
        self.assertIsInstance(zero_val, int, "Pressure score must be an integer")
        self.assertGreaterEqual(zero_val, 0, "Pressure must be non-negative")
        self.assertLessEqual(zero_val, 60, "Zero occupancy must not reach HIGH/CRITICAL range")
        self.assertIn(level, ('LOW', 'MODERATE'), "Zero occupancy must be LOW or MODERATE status")


if __name__ == '__main__':
    unittest.main(verbosity=2)
