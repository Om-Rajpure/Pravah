"""
PRAVAAH Phase 12 — Demo Reliability Test
Runs 10 consecutive demo cycles, verifying determinism and correctness.
"""

import unittest
from app import create_app
from services.demo_service import get_demo_service

class TestDemoReliability(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def _full_cycle(self, cycle_num):
        """Runs one complete demo cycle and verifies key invariants."""
        # 1. Reset
        res = self.client.post('/api/demo/reset')
        self.assertEqual(res.status_code, 200, f'Cycle {cycle_num}: reset failed')
        state = res.get_json()
        self.assertEqual(state['current_event_index'], 0, f'Cycle {cycle_num}: index not 0 after reset')
        self.assertIsNone(state['active_scenario'], f'Cycle {cycle_num}: scenario not cleared')

        # 2. Health check
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        health = res.get_json()
        self.assertEqual(health['status'], 'ok')
        self.assertEqual(health['version'], '1.0.0')

        # 3. Advance through all events
        total = state['total_events']
        for i in range(total - 1):
            res = self.client.post('/api/demo/next-event')
            self.assertEqual(res.status_code, 200, f'Cycle {cycle_num}: next-event failed at step {i+1}')
            s = res.get_json()
            self.assertEqual(s['current_event_index'], i + 1)

        # 4. Final event check
        res = self.client.get('/api/demo/status')
        final = res.get_json()
        self.assertTrue(final['is_final_event'], f'Cycle {cycle_num}: not at final event')

        # 5. Verify scenario was applied at T+60
        # After reset + advance to final, scenario should be active
        self.assertIsNotNone(
            final.get('active_scenario'),
            f'Cycle {cycle_num}: no active scenario at final event'
        )

        return final

    def test_10_consecutive_demo_cycles(self):
        """Core reliability: 10 full demo cycles must produce consistent outputs."""
        results = []
        for i in range(10):
            state = self._full_cycle(i + 1)
            results.append(state)

        # All cycles must end at the same event index
        indices = [r['current_event_index'] for r in results]
        self.assertEqual(len(set(indices)), 1, 'Not all cycles ended at the same event index')

        # All cycles must end with the same active scenario
        scenarios = [r.get('active_scenario') for r in results]
        self.assertEqual(len(set(scenarios)), 1, 'Active scenario differs across cycles')

        print(f'\n[OK] 10 demo cycles complete -- all ended at event index {indices[0]}, scenario: {scenarios[0]}')

    def test_reset_restores_baseline(self):
        """Reset must return to event 0 with no active scenario."""
        # Advance first
        self.client.post('/api/demo/next-event')
        self.client.post('/api/demo/next-event')
        # Now reset
        res = self.client.post('/api/demo/reset')
        state = res.get_json()
        self.assertEqual(state['current_event_index'], 0)
        self.assertIsNone(state['active_scenario'])
        self.assertEqual(state['network_version'], 1)

    def test_health_endpoint_complete(self):
        """Health endpoint must return all required fields."""
        res = self.client.get('/api/health')
        h = res.get_json()
        required = ['status', 'version', 'simulation_time', 'simulation_status',
                    'demo_active', 'demo_event', 'network_version', 'data_label']
        for field in required:
            self.assertIn(field, h, f'Missing field: {field}')
        self.assertEqual(h['data_label'], 'SIMULATION · SYNTHETIC')


if __name__ == '__main__':
    unittest.main(verbosity=2)
