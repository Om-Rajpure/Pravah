"""
PRAVAAH Security, Reliability & Validation Test Suite
Phase 13 — Production Security Headers, Input Validation, Readiness, and Error Standard Format
"""

import unittest
from app import create_app
from config import Config

class TestSecurityAndReliability(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_01_security_headers_present(self):
        """Responses must include basic security headers."""
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.headers.get('X-Content-Type-Options'), 'nosniff')
        self.assertEqual(res.headers.get('X-Frame-Options'), 'SAMEORIGIN')
        self.assertEqual(res.headers.get('Referrer-Policy'), 'strict-origin-when-cross-origin')
        self.assertIn('Content-Security-Policy', res.headers)

    def test_02_readiness_probe(self):
        """GET /api/ready must return 200 when database and simulator are ready."""
        res = self.client.get('/api/ready')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('ready'))
        self.assertGreater(data.get('zones_loaded', 0), 0)
        self.assertTrue(data.get('simulator_ready'))

    def test_03_standardized_404_error(self):
        """Unknown route must return standardized 404 JSON error."""
        res = self.client.get('/api/non-existent-endpoint-xyz')
        self.assertEqual(res.status_code, 404)
        data = res.get_json()
        self.assertIn('error', data)
        self.assertEqual(data['error']['code'], 'NOT_FOUND')

    def test_04_invalid_scenario_id_validation(self):
        """Invalid scenario ID must be rejected with 400."""
        res = self.client.post('/api/scenarios/simulate', json={'scenario_id': 'malicious-scenario; DROP TABLE;'})
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn('error', data)
        self.assertEqual(data['error']['code'], 'INVALID_SCENARIO_ID')

    def test_05_invalid_destination_id_validation(self):
        """Invalid visitor destination must return 404 or 400 with standardized error."""
        res = self.client.get('/api/visitor/destinations/invalid-non-existent-zone')
        self.assertEqual(res.status_code, 404)
        data = res.get_json()
        self.assertIn('error', data)
        self.assertEqual(data['error']['code'], 'INVALID_DESTINATION')

    def test_06_visitor_recommendation_sanitization(self):
        """Invalid preference in recommendation request must fallback safely to default."""
        res = self.client.post('/api/visitor/recommendations', json={
            'destination_id': 'lalbaugcha-raja',
            'preference': 'INVALID_INJECTION_PARAM'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('recommendation_type', data)

    def test_07_invalid_action_id_validation(self):
        """Malformed action ID must be rejected."""
        res = self.client.get('/api/actions/malicious!@#$action-id')
        self.assertEqual(res.status_code, 400)
        data = res.get_json()
        self.assertIn('error', data)
        self.assertEqual(data['error']['code'], 'INVALID_ACTION_ID')


if __name__ == '__main__':
    unittest.main(verbosity=2)
