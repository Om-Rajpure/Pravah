import unittest
import json
from app import create_app

class TestAuthAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_01_admin_login(self):
        res = self.client.post('/api/auth/login', json={
            "email": "admin@pravaah.gov.in",
            "password": "pravaah2026"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["status"], "SUCCESS")
        self.assertEqual(data["user"]["role"], "OPERATOR")
        self.assertTrue("token" in data)

    def test_02_visitor_login(self):
        res = self.client.post('/api/auth/login', json={
            "email": "visitor@pravaah.in",
            "password": "visitor2026"
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["user"]["role"], "VISITOR")

    def test_03_guest_login(self):
        res = self.client.post('/api/auth/login', json={
            "is_guest": True
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data["user"]["role"], "VISITOR")

    def test_04_invalid_credentials(self):
        res = self.client.post('/api/auth/login', json={
            "email": "admin@pravaah.gov.in",
            "password": "wrongpassword"
        })
        self.assertEqual(res.status_code, 401)

    def test_05_auth_me_session(self):
        # Login first
        login_res = self.client.post('/api/auth/login', json={
            "email": "admin@pravaah.gov.in",
            "password": "pravaah2026"
        })
        token = login_res.get_json()["token"]

        # Call /api/auth/me with Bearer token
        me_res = self.client.get('/api/auth/me', headers={
            "Authorization": f"Bearer {token}"
        })
        self.assertEqual(me_res.status_code, 200)
        me_data = me_res.get_json()
        self.assertEqual(me_data["user"]["email"], "admin@pravaah.gov.in")

if __name__ == '__main__':
    unittest.main()
