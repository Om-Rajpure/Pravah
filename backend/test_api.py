"""
PRAVAAH API Endpoint & Data Validation Test Suite
"""

import unittest
from app import create_app

class TestPravaahAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_01_health(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['status'], 'ok')
        self.assertEqual(data['service'], 'pravaah')

    def test_02_overview(self):
        response = self.client.get('/api/overview')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('city_pressure', data)
        self.assertIn('predicted_peak', data)
        self.assertIn('hotels_available', data)
        self.assertIn('transport_load', data)
        self.assertIn('active_alerts', data)
        self.assertIn('alerts', data)
        self.assertIn('recommendation', data)
        self.assertGreater(data['hotels_available'], 0)
        self.assertEqual(len(data['alerts']), data['active_alerts'])

    def test_03_zones(self):
        response = self.client.get('/api/zones')
        self.assertEqual(response.status_code, 200)
        zones = response.get_json()
        self.assertGreaterEqual(len(zones), 11)
        zone_ids = [z['id'] for z in zones]
        self.assertIn('lalbaug', zone_ids)
        self.assertIn('curry-road', zone_ids)
        self.assertIn('thane', zone_ids)
        self.assertIn('vashi', zone_ids)

    def test_04_zone_detail(self):
        response = self.client.get('/api/zones/curry-road')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['id'], 'curry-road')
        self.assertEqual(data['name'], 'Curry Road')
        self.assertIn('predictions', data)
        self.assertIn('hotels', data)

        # 404 test
        response_404 = self.client.get('/api/zones/nonexistent-zone-id')
        self.assertEqual(response_404.status_code, 404)

    def test_05_hotels(self):
        response = self.client.get('/api/hotels')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('summary', data)
        self.assertIn('clusters', data)
        self.assertIn('distribution', data)
        self.assertGreater(data['summary']['total_rooms'], 0)
        self.assertGreater(data['summary']['available_rooms'], 0)

    def test_06_transport(self):
        response = self.client.get('/api/transport')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('summary', data)
        self.assertIn('stations', data)
        self.assertIn('roads', data)
        self.assertGreaterEqual(len(data['stations']), 10)
        self.assertGreaterEqual(len(data['roads']), 5)

    def test_07_welfare(self):
        response = self.client.get('/api/welfare')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('summary', data)
        self.assertIn('amenities', data)
        self.assertIn('water', data['summary']['by_type'])
        self.assertIn('medical', data['summary']['by_type'])

    def test_08_map_state(self):
        response = self.client.get('/api/map/state')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('center', data)
        self.assertIn('zones', data)
        self.assertIn('geojson', data)
        self.assertIn('hotspots', data)
        self.assertIn('bottlenecks', data)
        self.assertIn('recommendation', data)

    def test_09_weather(self):
        response = self.client.get('/api/weather')
        self.assertIn(response.status_code, [200, 503])
        if response.status_code == 200:
            data = response.get_json()
            self.assertIn('location', data)
            self.assertIn('current', data)
            self.assertIn('hourly', data)
            self.assertIn('source', data)
            self.assertEqual(data['source'], 'Open-Meteo')

if __name__ == '__main__':
    unittest.main()
