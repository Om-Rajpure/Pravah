"""
PRAVAAH Phase 11 — Visitor & Privacy Test Suite
Tests: privacy leakage, recommendation correctness, disruption awareness, determinism
"""

import unittest
from app import create_app
from services.visitor_recommendation import get_visitor_engine
from services.privacy_service import suppress_small_group, to_public_recommendation, K_ANONYMITY_THRESHOLD
from services.scenario_service import get_scenario_engine

FORBIDDEN_KEYS = {
    'visitor_id', 'visitor_uuid', 'device_id', 'person_id', 'lat_exact', 'lng_exact',
    'exact_location', 'trajectory', 'dosage_pct', 'candidate_score', 'edge_id',
    'feature_vector', 'arrival_rate', 'departure_rate', 'network_capacity',
    'operator_action', 'intervention_score',
}

class TestPrivacyLayer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.engine = get_visitor_engine()

    def _assert_no_pii(self, obj, path='root'):
        """Recursively verify no forbidden keys appear in any response."""
        if isinstance(obj, dict):
            for key in obj:
                self.assertNotIn(key, FORBIDDEN_KEYS,
                    f"PRIVACY LEAK: forbidden key '{key}' found at {path}.{key}")
                self._assert_no_pii(obj[key], f'{path}.{key}')
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                self._assert_no_pii(item, f'{path}[{i}]')

    def test_01_small_group_suppression(self):
        """Groups below K threshold must be suppressed."""
        below = suppress_small_group(K_ANONYMITY_THRESHOLD - 1)
        self.assertFalse(below['visible'])
        self.assertNotIn('count', below)

        above = suppress_small_group(K_ANONYMITY_THRESHOLD + 5)
        self.assertTrue(above['visible'])
        self.assertIn('count', above)

    def test_02_public_destinations_no_pii(self):
        """GET /api/visitor/destinations must not expose any PII or operator internals."""
        res = self.client.get('/api/visitor/destinations')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self._assert_no_pii(data)

        # crowd_level must be a label, not a raw float
        for dest in data:
            self.assertIn(dest['crowd_level'], ('LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'UNKNOWN'))
            self.assertNotIn('pressure', dest)

    def test_03_destination_detail_no_pii(self):
        """GET /api/visitor/destinations/<id> must not expose internals."""
        res = self.client.get('/api/visitor/destinations/gateway-of-india')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self._assert_no_pii(data)
        self.assertIn('forecast', data)
        # Forecast should use crowd labels, not raw floats
        for h in data['forecast']:
            self.assertIn(h['crowd_level'], ('LOW', 'MODERATE', 'HIGH', 'CRITICAL'))
            self.assertNotIn('predicted_pressure', h)

    def test_04_recommendation_less_crowded(self):
        """
        LESS_CROWDED recommendation should prefer lower-pressure destination.
        Result must never contain dosage_pct or operator-only fields.
        """
        res = self.client.post('/api/visitor/recommendations', json={
            'destination_id': 'lalbaugcha-raja',
            'preference': 'LESS_CROWDED',
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self._assert_no_pii(data)
        self.assertNotIn('dosage_pct', data)
        self.assertIn('recommendation_type', data)

    def test_05_recommendation_avoid_disruption(self):
        """AVOID_DISRUPTION must not route visitor through disrupted corridors."""
        scenario = get_scenario_engine()
        scenario.activate_scenario('central-line-disruption')

        res = self.client.post('/api/visitor/recommendations', json={
            'destination_id': 'curry-road-pandal',
            'preference': 'AVOID_DISRUPTION',
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self._assert_no_pii(data)

        # If an alternative is recommended, it should not itself be disruption-affected
        if data.get('recommendation_type') == 'ALTERNATIVE':
            self.assertNotEqual(data['destination_id'], 'curry-road-pandal')

        scenario.reset_scenario()

    def test_06_privacy_policy_endpoint(self):
        """GET /api/privacy/policy must return policy with we_use and we_do_not_use."""
        res = self.client.get('/api/privacy/policy')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('we_use', data)
        self.assertIn('we_do_not_use', data)
        self.assertIn('prototype_disclaimer', data)

    def test_07_data_catalog_endpoint(self):
        """GET /api/privacy/data-catalog must return catalog and principles."""
        res = self.client.get('/api/privacy/data-catalog')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('catalog', data)
        self.assertGreater(len(data['catalog']), 0)
        self.assertIn('principles', data)
        self.assertIn('retention', data)

    def test_08_determinism(self):
        """Same inputs must produce the same recommendation (deterministic)."""
        r1 = self.engine.get_recommendation('gateway-of-india', 'LESS_CROWDED')
        r2 = self.engine.get_recommendation('gateway-of-india', 'LESS_CROWDED')
        self.assertEqual(r1['destination_id'], r2['destination_id'])
        self.assertEqual(r1['crowd_level'],    r2['crowd_level'])

    def test_09_visitor_route_endpoint(self):
        """GET /api/visitor/route must return valid connected path and no PII."""
        res = self.client.get('/api/visitor/route?from=stn-dadar&to=lalbaugcha-raja')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self._assert_no_pii(data)
        self.assertEqual(data['status'], 'AVAILABLE')
        self.assertIn('total_travel_time_min', data)
        self.assertIn('total_distance_km', data)
        self.assertIn('steps', data)
        self.assertGreater(len(data['steps']), 0)
        self.assertIn('geometry', data)
        self.assertEqual(data['geometry']['type'], 'LineString')

    def test_10_visitor_stay_endpoint(self):
        """GET /api/visitor/stay must return accommodation guidance without PII."""
        res = self.client.get('/api/visitor/stay')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self._assert_no_pii(data)
        self.assertIn('summary', data)
        self.assertIn('zones', data)
        self.assertIn('recommendation', data)

    def test_11_visitor_support_endpoint(self):
        """GET /api/visitor/support must return welfare amenities without PII."""
        res = self.client.get('/api/visitor/support')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self._assert_no_pii(data)
        self.assertIn('amenities', data)
        self.assertGreater(len(data['amenities']), 0)

    def test_12_destinations_trend_and_category(self):
        """Destinations list must include trend, category, and area."""
        res = self.client.get('/api/visitor/destinations')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        for d in data:
            self.assertIn('trend', d)
            self.assertIn(d['trend'], ('INCREASING', 'STABLE', 'EASING'))
            self.assertIn('category', d)
            self.assertIn('area', d)


if __name__ == '__main__':
    unittest.main()
