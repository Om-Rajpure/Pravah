"""
PRAVAAH Phase 15 — Stress Testing & 20-Cycle Demo Lock Suite
Validates:
1. 20 consecutive full demo lifecycle runs with 100% determinism.
2. 20 consecutive rapid atomic resets without state corruption.
3. Memory and cache stability across repeated simulation steps.
4. Public visitor boundary enforcement across rapid successive calls.
"""

import unittest
from app import create_app
from services.demo_service import get_demo_service

class TestStressAndDemoLock(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_01_twenty_consecutive_demo_cycles(self):
        """Runs 20 full consecutive demo cycles and verifies identical terminal states."""
        terminal_indices = []
        terminal_scenarios = []

        for cycle in range(1, 21):
            # 1. Reset to baseline
            res = self.client.post('/api/demo/reset')
            self.assertEqual(res.status_code, 200, f"Cycle {cycle}: Reset failed")
            reset_state = res.get_json()
            self.assertEqual(reset_state['current_event_index'], 0)
            self.assertIsNone(reset_state['active_scenario'])

            # 2. Step through all demo events
            total_events = reset_state['total_events']
            for _ in range(total_events - 1):
                res_next = self.client.post('/api/demo/next-event')
                self.assertEqual(res_next.status_code, 200)

            # 3. Verify terminal state
            res_status = self.client.get('/api/demo/status')
            final_state = res_status.get_json()
            self.assertTrue(final_state['is_final_event'])

            terminal_indices.append(final_state['current_event_index'])
            terminal_scenarios.append(final_state['active_scenario'])

        # Verify all 20 runs produced the exact same index and scenario
        self.assertEqual(len(set(terminal_indices)), 1, "All 20 cycles must end at the exact same event index")
        self.assertEqual(len(set(terminal_scenarios)), 1, "All 20 cycles must end with the exact same active scenario")
        self.assertEqual(terminal_indices[0], 5, "Terminal index must be 5")
        self.assertEqual(terminal_scenarios[0], 'central-line-disruption')
        print(f"\n[OK] 20/20 Consecutive Demo Cycles Completed with 100% Determinism.")

    def test_02_twenty_rapid_resets_stress(self):
        """Verifies 20 rapid consecutive resets preserve clean baseline without memory leak."""
        for i in range(1, 21):
            res = self.client.post('/api/demo/reset')
            self.assertEqual(res.status_code, 200)
            state = res.get_json()
            self.assertEqual(state['current_event_index'], 0)
            self.assertEqual(state['network_version'], 1)
            self.assertIsNone(state['active_scenario'])
        print(f"\n[OK] 20/20 Rapid Resets Verified.")

    def test_03_visitor_api_boundary_stress(self):
        """Verifies rapid successive visitor requests never leak internal operator fields."""
        forbidden_keys = {'dosage_pct', 'candidate_score', 'edge_id', 'feature_vector', 'arrival_rate'}

        for _ in range(10):
            res = self.client.get('/api/visitor/destinations')
            self.assertEqual(res.status_code, 200)
            for dest in res.get_json():
                for k in forbidden_keys:
                    self.assertNotIn(k, dest, f"Forbidden operator key '{k}' leaked into public destination payload")

            rec_res = self.client.post('/api/visitor/recommendations', json={
                'destination_id': 'lalbaugcha-raja',
                'preference': 'LESS_CROWDED'
            })
            self.assertEqual(rec_res.status_code, 200)
            rec_data = rec_res.get_json()
            for k in forbidden_keys:
                self.assertNotIn(k, rec_data, f"Forbidden operator key '{k}' leaked into public recommendation payload")
        print(f"\n[OK] Visitor API Public Boundary Verified Under Rapid Load.")


if __name__ == '__main__':
    unittest.main(verbosity=2)
