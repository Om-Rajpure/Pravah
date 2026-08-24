"""
PRAVAAH Network API Routes
Phase 6 — Graph inspection, dynamic routing, and disruption simulation endpoints
"""

from flask import Blueprint, jsonify, request
from services.network_service import get_network

network_bp = Blueprint('network', __name__)

@network_bp.route('/api/network', methods=['GET'])
def get_network_summary():
    """Returns network operational summary and topology status."""
    try:
        network = get_network()
        summary = network.get_summary()
        return jsonify(summary)
    except Exception as e:
        return jsonify({"error": "Failed to get network summary", "message": str(e)}), 500

@network_bp.route('/api/network/geojson', methods=['GET'])
def get_network_geojson():
    """Returns GeoJSON FeatureCollection of physical corridors and nodes for MapLibre."""
    try:
        network = get_network()
        geojson_data = network.get_network_geojson()
        return jsonify(geojson_data)
    except Exception as e:
        return jsonify({"error": "Failed to generate network GeoJSON", "message": str(e)}), 500

@network_bp.route('/api/network/route', methods=['GET'])
def calculate_route():
    """
    Calculates primary and alternative paths between source and target nodes/zones.
    Query params: ?source=thane&target=lalbaug
    """
    source = request.args.get('source', 'thane')
    target = request.args.get('target', 'lalbaug')

    try:
        network = get_network()
        primary_route = network.get_route(source, target)
        alternative_route = network.get_alternative_route(source, target)

        return jsonify({
            "source": source,
            "target": target,
            "network_version": network.version,
            "primary_route": {
                "status": primary_route.status,
                "path_nodes": primary_route.path_nodes,
                "path_node_names": primary_route.path_node_names,
                "path_zones": primary_route.path_zones,
                "edge_ids": primary_route.edge_ids,
                "total_distance_km": primary_route.total_distance_km,
                "total_travel_time_min": primary_route.total_travel_time_min,
                "reason": primary_route.reason
            },
            "alternative_route": {
                "status": alternative_route.status,
                "path_nodes": alternative_route.path_nodes,
                "path_node_names": alternative_route.path_node_names,
                "path_zones": alternative_route.path_zones,
                "edge_ids": alternative_route.edge_ids,
                "total_distance_km": alternative_route.total_distance_km,
                "total_travel_time_min": alternative_route.total_travel_time_min,
                "is_alternative": alternative_route.is_alternative,
                "reason": alternative_route.reason
            }
        })
    except Exception as e:
        return jsonify({"error": "Route calculation failed", "message": str(e)}), 500

@network_bp.route('/api/network/node/<node_id>', methods=['GET'])
def get_node(node_id):
    """Returns specific node details."""
    try:
        network = get_network()
        resolved_id = network._resolve_node_id(node_id)
        if resolved_id in network.nodes:
            n = network.nodes[resolved_id]
            return jsonify({
                "id": n.id,
                "name": n.name,
                "type": n.type,
                "zone_id": n.zone_id,
                "capacity": n.capacity,
                "status": n.status,
                "coordinates": [n.lng, n.lat]
            })
        return jsonify({"error": f"Node {node_id} not found"}), 404
    except Exception as e:
        return jsonify({"error": "Node inspection failed", "message": str(e)}), 500

@network_bp.route('/api/network/edge/<edge_id>', methods=['GET'])
def get_edge(edge_id):
    """Returns specific edge connection details."""
    try:
        network = get_network()
        if edge_id in network.edges:
            e = network.edges[edge_id]
            return jsonify({
                "id": e.id,
                "source": e.source,
                "target": e.target,
                "type": e.type,
                "distance_km": e.distance_km,
                "travel_time_min": e.travel_time_min,
                "capacity_per_hour": e.capacity_per_hour,
                "effective_capacity": e.effective_capacity,
                "status": e.status
            })
        return jsonify({"error": f"Edge {edge_id} not found"}), 404
    except Exception as e:
        return jsonify({"error": "Edge inspection failed", "message": str(e)}), 500

@network_bp.route('/api/network/edge/<edge_id>/close', methods=['POST'])
def close_connection(edge_id):
    """Simulates disruption or closure of a physical connection."""
    try:
        network = get_network()
        res = network.close_edge(edge_id)
        if "error" in res:
            return jsonify(res), 404
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Failed to close edge", "message": str(e)}), 500

@network_bp.route('/api/network/edge/<edge_id>/open', methods=['POST'])
def open_connection(edge_id):
    """Restores an edge to normal operational capacity."""
    try:
        network = get_network()
        res = network.open_edge(edge_id)
        if "error" in res:
            return jsonify(res), 404
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Failed to reopen edge", "message": str(e)}), 500

@network_bp.route('/api/network/edge/<edge_id>/capacity', methods=['POST'])
def update_edge_capacity(edge_id):
    """Updates dynamic capacity for weather degradation or gating."""
    try:
        data = request.get_json() or {}
        new_cap = data.get('capacity', 0)
        network = get_network()
        res = network.set_edge_capacity(edge_id, int(new_cap))
        if "error" in res:
            return jsonify(res), 404
        return jsonify(res)
    except Exception as e:
        return jsonify({"error": "Failed to update edge capacity", "message": str(e)}), 500

@network_bp.route('/api/network/reset', methods=['POST'])
def reset_network():
    """Resets network graph to baseline operational state."""
    try:
        network = get_network()
        network.reset()
        return jsonify({
            "message": "Network restored to baseline operational state",
            "summary": network.get_summary()
        })
    except Exception as e:
        return jsonify({"error": "Failed to reset network", "message": str(e)}), 500
