import hmac
import hashlib
import time
import json
import base64
import logging
from flask import Blueprint, request, jsonify
from config import Config
from utils.errors import make_error_response

logger = logging.getLogger('pravaah.auth')

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Default Seeded User Directory
USERS_DB = {
    "admin@pravaah.gov.in": {
        "id": "usr-admin-01",
        "email": "admin@pravaah.gov.in",
        "password_hash": hashlib.sha256("pravaah2026".encode()).hexdigest(),
        "name": "Ananya Sharma",
        "role": "OPERATOR",
        "title": "Incident Commander",
        "department": "BMC Disaster Management & Mobility Cell",
        "permissions": ["VIEW_ALL", "SIMULATE_ACTIONS", "APPLY_INTERVENTIONS", "TRIGGER_SCENARIOS"]
    },
    "staff@pravaah.gov.in": {
        "id": "usr-staff-01",
        "email": "staff@pravaah.gov.in",
        "password_hash": hashlib.sha256("field2026".encode()).hexdigest(),
        "name": "Rajesh Kulkarni",
        "role": "STAFF",
        "title": "Field Mobility Lead",
        "department": "Central Railway Corridor Operations",
        "permissions": ["VIEW_ALL", "VIEW_INCIDENTS", "REPORT_DISRUPTION"]
    },
    "visitor@pravaah.in": {
        "id": "usr-visitor-01",
        "email": "visitor@pravaah.in",
        "password_hash": hashlib.sha256("visitor2026".encode()).hexdigest(),
        "name": "Aarav Mehta",
        "role": "VISITOR",
        "title": "Festival Attendee",
        "department": "Citizen Access",
        "permissions": ["VIEW_PUBLIC", "PLAN_JOURNEY", "VIEW_HOTELS"]
    }
}

SECRET_KEY = getattr(Config, 'SECRET_KEY', 'pravaah-secure-hmac-seed-20260908')

def generate_token(user_data):
    payload = {
        "sub": user_data["id"],
        "email": user_data["email"],
        "role": user_data["role"],
        "name": user_data["name"],
        "iat": int(time.time()),
        "exp": int(time.time()) + (86400 * 7) # 7 days validity
    }
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    sig = hmac.new(SECRET_KEY.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
    return f"{payload_b64}.{sig}"

def verify_token(token_str):
    if not token_str or '.' not in token_str:
        return None
    try:
        payload_b64, sig = token_str.split('.', 1)
        expected_sig = hmac.new(SECRET_KEY.encode(), payload_b64.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        
        # Pad back base64
        padded = payload_b64 + '=' * (-len(payload_b64) % 4)
        payload = json.loads(base64.urlsafe_b64decode(padded).decode())
        
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception as e:
        logger.warning(f"Token verification error: {e}")
        return None


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        body = request.get_json(silent=True) or {}
        email = (body.get('email') or '').strip().lower()
        password = body.get('password') or ''
        is_guest = body.get('is_guest', False)

        # 1. Guest Quick Access
        if is_guest or email in ['guest', 'guest@pravaah.in']:
            guest_user = {
                "id": "usr-guest",
                "email": "guest@pravaah.in",
                "name": "Guest Visitor",
                "role": "VISITOR",
                "title": "Public Explorer",
                "department": "Public Access",
                "permissions": ["VIEW_PUBLIC", "PLAN_JOURNEY"]
            }
            token = generate_token(guest_user)
            return jsonify({
                "status": "SUCCESS",
                "token": token,
                "user": guest_user,
                "message": "Authenticated as Guest"
            }), 200

        # 2. Check credentials
        if not email or not password:
            return make_error_response("INVALID_REQUEST", "Email and password are required", 400)

        user = USERS_DB.get(email)
        hashed_input = hashlib.sha256(password.encode()).hexdigest()

        if not user or user["password_hash"] != hashed_input:
            return make_error_response("UNAUTHORIZED", "Invalid email or password. Please check your credentials.", 401)

        user_summary = {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "title": user["title"],
            "department": user["department"],
            "permissions": user["permissions"]
        }
        token = generate_token(user)

        logger.info(f"User {email} logged in successfully as {user['role']}")
        return jsonify({
            "status": "SUCCESS",
            "token": token,
            "user": user_summary,
            "message": "Login successful"
        }), 200

    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        return make_error_response("INTERNAL_ERROR", "Authentication service error", 500)


@auth_bp.route('/me', methods=['GET'])
def me():
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip() if 'Bearer ' in auth_header else auth_header.strip()

    if not token:
        return make_error_response("UNAUTHORIZED", "Missing authorization token", 401)

    payload = verify_token(token)
    if not payload:
        return make_error_response("UNAUTHORIZED", "Invalid or expired token", 401)

    # Return active user info
    email = payload.get("email", "")
    user = USERS_DB.get(email)
    if user:
        user_info = {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "title": user["title"],
            "department": user["department"],
            "permissions": user["permissions"]
        }
    else:
        user_info = {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("name", "User"),
            "role": payload.get("role", "VISITOR"),
            "title": "Authenticated User",
            "department": "PRAVAAH Network",
            "permissions": ["VIEW_PUBLIC"]
        }

    return jsonify({
        "status": "SUCCESS",
        "user": user_info
    }), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({
        "status": "SUCCESS",
        "message": "Logged out successfully"
    }), 200
