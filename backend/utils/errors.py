"""
PRAVAAH API Error & Response Helpers
Phase 13 — Standardized JSON Error Format & Response Decorators
"""

from flask import jsonify

def make_error_response(code: str, message: str, status_code: int = 400):
    """
    Returns standardized API error response.
    Format:
    {
      "error": {
        "code": "ERROR_CODE",
        "message": "Human readable description."
      }
    }
    """
    return jsonify({
        "error": {
            "code": code,
            "message": message
        }
    }), status_code
