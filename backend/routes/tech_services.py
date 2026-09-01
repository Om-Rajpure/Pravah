from flask import Blueprint, jsonify, request
import random

tech_services_bp = Blueprint('tech_services', __name__, url_prefix='/api/tech-services')

SERVICES_DATA = [
    {
        "id": "cctv",
        "title": "4K CCTV Camera Systems",
        "description": "High-definition Dome, Bullet & PTZ 360° cameras with night vision and remote phone monitoring.",
        "starting_price": 9999
    },
    {
        "id": "laptop",
        "title": "Laptop & Computer Repair",
        "description": "Motherboard chip-level micro-soldering, display replacement, battery swap & liquid damage recovery.",
        "starting_price": 700
    },
    {
        "id": "network",
        "title": "Enterprise Mesh Wi-Fi & LAN",
        "description": "High-speed structured LAN cabling, router configuration, server racks, and firewall setup.",
        "starting_price": 2500
    },
    {
        "id": "access",
        "title": "Biometrics & Smart Locks",
        "description": "Fingerprint & FaceID attendance devices, RFID gate barriers, and Video Door Phones (VDP).",
        "starting_price": 4500
    }
]

TRACKING_DB = {
    'REP-8492': {
        'id': 'REP-8492',
        'customer': 'Rahul Sharma',
        'device': 'Dell XPS 15 Laptop',
        'service': 'Chip-Level Motherboard Repair',
        'status': 'In Progress (Testing Stage)',
        'step': 3,
        'estimated_ready': 'Today by 6:00 PM'
    },
    'CCTV-3021': {
        'id': 'CCTV-3021',
        'customer': 'Apex Logistics',
        'device': '8x 4K IP CCTV Camera Network',
        'service': 'Commercial CCTV Installation',
        'status': 'Technician En Route',
        'step': 2,
        'estimated_ready': 'Tomorrow at 11:00 AM'
    }
}

@tech_services_bp.route('/services', methods=['GET'])
def get_services():
    return jsonify({"status": "success", "services": SERVICES_DATA})

@tech_services_bp.route('/estimate', methods=['POST'])
def calculate_estimate():
    data = request.json or {}
    service_type = data.get('service_type', 'cctv')
    
    if service_type == 'cctv':
        camera_count = int(data.get('camera_count', 4))
        resolution = data.get('resolution', '1080p')
        res_mult = 2400 if resolution == '4K' else 1800 if resolution == '2K' else 1300
        subtotal = (camera_count * res_mult) + 3500 + (camera_count * 350)
        discount = int(subtotal * 0.10)
        return jsonify({
            "service_type": "cctv",
            "camera_count": camera_count,
            "resolution": resolution,
            "subtotal": subtotal,
            "discount": discount,
            "total": subtotal - discount
        })
    else:
        issue = data.get('issue', 'display')
        prices = {'display': 3400, 'motherboard': 2200, 'ssd': 2800, 'battery': 1900, 'cleaning': 700}
        base = prices.get(issue, 1500)
        discount = 200
        return jsonify({
            "service_type": "laptop",
            "issue": issue,
            "subtotal": base,
            "discount": discount,
            "total": base - discount
        })

@tech_services_bp.route('/track/<track_id>', methods=['GET'])
def track_order(track_id):
    clean_id = track_id.strip().upper()
    if clean_id in TRACKING_DB:
        return jsonify({"found": True, "order": TRACKING_DB[clean_id]})
    else:
        return jsonify({
            "found": True,
            "order": {
                "id": clean_id,
                "customer": "Valued Customer",
                "device": f"Service Ticket #{clean_id}",
                "service": "Hardware Inspection & Diagnostic",
                "status": "Order Registered - Processing",
                "step": 1,
                "estimated_ready": "Within 24 Hours"
            }
        })

@tech_services_bp.route('/book', methods=['POST'])
def book_service():
    data = request.json or {}
    service_name = data.get('service', 'General Service')
    prefix = 'CCTV-' if 'CCTV' in service_name.upper() else 'REP-'
    generated_id = f"{prefix}{random.randint(1000, 9000)}"
    
    return jsonify({
        "status": "success",
        "message": "Service booking confirmed",
        "tracking_id": generated_id,
        "details": data
    })
