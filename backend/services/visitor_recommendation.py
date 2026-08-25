"""
PRAVAAH Visitor Recommendation Engine
Phase 11 + Phase 20 — Preference-Aware, Privacy-Safe, Scenario-Responsive Destination Guidance
Consumes real underlying simulation, network, and prediction models.
Never exposes raw internal parameters, PII, or operator-only actions.
"""

import logging
from typing import Dict, Any, List, Optional

from services.prediction_service import get_predictor
from services.network_service import get_network
from services.scenario_service import get_scenario_engine
from services.hotel_service import get_hotel_analytics
from services.welfare_service import get_welfare_amenities
from services.privacy_service import (
    aggregate_pressure_to_label,
    aggregate_network_status,
    to_public_destination_state,
    to_public_forecast,
    to_public_recommendation,
    PRESSURE_LEVEL_LABELS,
    K_ANONYMITY_THRESHOLD,
    DATA_GOVERNANCE_CATALOG,
    PRIVACY_POLICY,
    PRIVACY_PRINCIPLES,
)

logger = logging.getLogger('pravaah.visitor')

# ─── Comprehensive Destination Registry ────────────────────────────────────────
DESTINATION_REGISTRY = {
    'lalbaugcha-raja': {
        'zone_id': 'lalbaug',
        'node_id': 'loc-lalbaugcha-raja',
        'name': 'Lalbaugcha Raja',
        'category': 'Pandal',
        'area': 'Lalbaug / Parel',
        'travel_time_min': 0,
        'lat': 18.9912,
        'lng': 72.8355,
        'description': 'Most iconic festival pandal in central Mumbai with major pilgrim queues.',
        'keywords': ['lalbaug', 'raja', 'ganpati', 'mandal', 'pandal', 'central', 'curry road', 'parel'],
    },
    'ganesh-galli': {
        'zone_id': 'lalbaug',
        'node_id': 'loc-ganesh-galli',
        'name': 'Ganesh Galli (Mumbaicha Raja)',
        'category': 'Pandal',
        'area': 'Lalbaug / Parel',
        'travel_time_min': 3,
        'lat': 18.9930,
        'lng': 72.8370,
        'description': 'Historic 22-foot idol celebrated for traditional themes near Lalbaug.',
        'keywords': ['ganesh galli', 'mumbaicha raja', 'lalbaug', 'pandal', 'mandal'],
    },
    'gateway-of-india': {
        'zone_id': 'south-mumbai',
        'node_id': 'stn-csmt',
        'name': 'Gateway of India',
        'category': 'Landmark',
        'area': 'Colaba / South Mumbai',
        'travel_time_min': 35,
        'lat': 18.9220,
        'lng': 72.8347,
        'description': 'Historic waterfront monument overlooking the Arabian Sea in South Mumbai.',
        'keywords': ['gateway', 'india', 'colaba', 'south mumbai', 'harbour', 'taj hotel', 'waterfront'],
    },
    'marine-drive': {
        'zone_id': 'south-mumbai',
        'node_id': 'stn-churchgate',
        'name': 'Marine Drive Promenade',
        'category': 'Promenade',
        'area': 'Marine Lines / Churchgate',
        'travel_time_min': 28,
        'lat': 18.9435,
        'lng': 72.8231,
        'description': 'Famous 3.6-kilometer seaside promenade known as the Queen’s Necklace.',
        'keywords': ['marine drive', 'seaface', 'queens necklace', 'churchgate', 'nariman point', 'promenade'],
    },
    'dadar-market': {
        'zone_id': 'dadar',
        'node_id': 'stn-dadar',
        'name': 'Dadar Flower & Festival Market',
        'category': 'Market',
        'area': 'Dadar Central',
        'travel_time_min': 12,
        'lat': 19.0178,
        'lng': 72.8478,
        'description': 'Bustling traditional market and central transit interchange hub.',
        'keywords': ['dadar', 'market', 'flowers', 'phool market', 'central', 'interchange', 'station'],
    },
    'siddhivinayak': {
        'zone_id': 'parel',
        'node_id': 'stn-parel',
        'name': 'Siddhivinayak Temple',
        'category': 'Temple',
        'area': 'Prabhadevi',
        'travel_time_min': 18,
        'lat': 19.0169,
        'lng': 72.8302,
        'description': 'Renowned temple dedicated to Lord Shri Ganesha with continuous darshan queues.',
        'keywords': ['siddhivinayak', 'prabhadevi', 'temple', 'mandir', 'ganesh', 'darshan'],
    },
    'girgaon-chowpatty': {
        'zone_id': 'girgaon',
        'node_id': 'loc-girgaon-chowpatty',
        'name': 'Girgaon Chowpatty',
        'category': 'Beach / Immersion',
        'area': 'Girgaon',
        'travel_time_min': 22,
        'lat': 18.9540,
        'lng': 72.8120,
        'description': 'Primary Arabian Sea immersion site with large evening crowd gatherings.',
        'keywords': ['girgaon', 'chowpatty', 'beach', 'immersion', 'visarjan', 'sea'],
    },
    'khetwadi-12': {
        'zone_id': 'girgaon',
        'node_id': 'loc-khetwadi-12',
        'name': 'Khetwadi 12th Lane Ganpati',
        'category': 'Pandal',
        'area': 'Girgaon / Grant Road',
        'travel_time_min': 24,
        'lat': 18.9600,
        'lng': 72.8210,
        'description': 'Famous for artistic high-altitude Ganesh idols in historic South Mumbai lanes.',
        'keywords': ['khetwadi', 'grant road', 'pandal', 'mandal', '12th lane'],
    },
    'juhu-beach': {
        'zone_id': 'andheri',
        'node_id': 'stn-andheri',
        'name': 'Juhu Beach',
        'category': 'Beach',
        'area': 'Western Suburbs',
        'travel_time_min': 40,
        'lat': 19.0948,
        'lng': 72.8258,
        'description': 'Spacious western suburban beach with food stalls and open sea views.',
        'keywords': ['juhu', 'beach', 'andheri', 'western', 'suburbs', 'seaside'],
    },
    'bhuleshwar': {
        'zone_id': 'south-mumbai',
        'node_id': 'stn-byculla',
        'name': 'Bhuleshwar Heritage Market',
        'category': 'Market',
        'area': 'Kalbadevi / South Mumbai',
        'travel_time_min': 25,
        'lat': 18.9498,
        'lng': 72.8315,
        'description': 'Historic market precinct with traditional craft shops and temples.',
        'keywords': ['bhuleshwar', 'market', 'kalbadevi', 'temples', 'shopping'],
    },
    'curry-road-pandal': {
        'zone_id': 'curry-road',
        'node_id': 'stn-curry-road',
        'name': 'Curry Road Transit Corridor',
        'category': 'Pandal Hub',
        'area': 'Curry Road',
        'travel_time_min': 8,
        'lat': 18.9942,
        'lng': 72.8336,
        'description': 'High-density railway station perimeter feeding major central pandals.',
        'keywords': ['curry road', 'station', 'central railway', 'lalbaug feeder', 'corridor'],
    },
    'parel-village': {
        'zone_id': 'parel',
        'node_id': 'stn-parel',
        'name': 'Parel Village & Hospital Zone',
        'category': 'Area',
        'area': 'Parel East',
        'travel_time_min': 5,
        'lat': 19.0022,
        'lng': 72.8398,
        'description': 'Pedestrian transit zone connecting Parel station with Ambedkar Road.',
        'keywords': ['parel', 'village', 'hospital', 'station', 'east'],
    },
}

PREFERENCE_WEIGHTS = {
    'LESS_CROWDED':      {'pressure': 1.0, 'travel_time': 0.3,  'disruption': 0.6},
    'FASTEST':           {'pressure': 0.3, 'travel_time': 1.0,  'disruption': 0.6},
    'AVOID_DISRUPTION':  {'pressure': 0.5, 'travel_time': 0.4,  'disruption': 1.0},
    'LOWER_TRAVEL_TIME': {'pressure': 0.3, 'travel_time': 1.0,  'disruption': 0.5},
}

MAX_TRAVEL_TIME_PENALTY_MIN = 35
MIN_CROWD_IMPROVEMENT = 8

CROWD_LEVEL_ORDER = {'LOW': 0, 'MODERATE': 1, 'HIGH': 2, 'CRITICAL': 3, 'UNKNOWN': 2}


class VisitorRecommendationEngine:
    """
    Unified, privacy-safe visitor intelligence engine.
    Consumes live state from prediction, network, scenario, hotel, and welfare services.
    """

    def get_all_destinations(self) -> List[Dict[str, Any]]:
        """Returns public-safe list of all destinations with live crowd state and trends."""
        predictor = get_predictor()
        preds = predictor.predict_all_zones()
        zone_map = {z['zone_id']: z for z in preds.get('zones', [])}

        scenario_engine = get_scenario_engine()
        scenario_state = scenario_engine.get_current_scenario()
        active_scenario = scenario_state.get('active_scenario_id')

        destinations = []
        for dest_id, info in DESTINATION_REGISTRY.items():
            zone = zone_map.get(info['zone_id'], {})
            pressure = zone.get('current_pressure', 50.0)
            crowd_level = aggregate_pressure_to_label(pressure)
            predictions = zone.get('predictions', [])

            # Compute trend from first horizon (+30m) vs current pressure
            trend = 'STABLE'
            trend_icon = '→'
            if predictions:
                next_p = predictions[0].get('predicted_pressure', pressure)
                delta = next_p - pressure
                if delta > 3.0:
                    trend = 'INCREASING'
                    trend_icon = '↑'
                elif delta < -3.0:
                    trend = 'EASING'
                    trend_icon = '↓'

            # Disruption check
            disrupted = self._is_disrupted(dest_id, active_scenario) if active_scenario else False
            travel_status = 'SLOW' if disrupted else 'OPEN'

            # Expected crowd in next 60m
            expected_level = crowd_level
            if len(predictions) >= 2:
                expected_level = aggregate_pressure_to_label(predictions[1].get('predicted_pressure', pressure))

            destinations.append({
                'destination_id': dest_id,
                'name':           info['name'],
                'category':       info['category'],
                'area':           info['area'],
                'description':    info['description'],
                'crowd_level':    crowd_level,
                'crowd_label':    PRESSURE_LEVEL_LABELS.get(crowd_level, ''),
                'crowd_index':    round(pressure),
                'trend':          trend,
                'trend_icon':     trend_icon,
                'expected_crowd': expected_level,
                'travel_time_min': info['travel_time_min'],
                'travel_status':  travel_status,
                'lat':            info['lat'],
                'lng':            info['lng'],
                'keywords':       info.get('keywords', []),
                'data_label':     'SIMULATED · AGGREGATED',
            })
        return destinations

    def get_destination_detail(self, destination_id: str) -> Optional[Dict[str, Any]]:
        """Returns detailed public-safe profile for one destination."""
        info = DESTINATION_REGISTRY.get(destination_id)
        if not info:
            return None

        predictor = get_predictor()
        preds = predictor.predict_all_zones()
        zone_map = {z['zone_id']: z for z in preds.get('zones', [])}
        zone = zone_map.get(info['zone_id'], {})

        pressure = zone.get('current_pressure', 50.0)
        crowd_level = aggregate_pressure_to_label(pressure)
        predictions = zone.get('predictions', [])

        # Build public forecast with trend per horizon
        public_forecast = []
        for h in predictions:
            p_val = h.get('predicted_pressure', pressure)
            h_level = aggregate_pressure_to_label(p_val)
            h_trend = 'STABLE'
            if p_val > pressure + 3:
                h_trend = 'INCREASING'
            elif p_val < pressure - 3:
                h_trend = 'EASING'
            public_forecast.append({
                'horizon_minutes': h.get('horizon_minutes', 60),
                'horizon_label':   h.get('horizon_label', '+60m'),
                'crowd_level':     h_level,
                'crowd_label':     PRESSURE_LEVEL_LABELS.get(h_level, ''),
                'trend':           h_trend,
            })

        # Overall trend
        trend = 'STABLE'
        trend_icon = '→'
        if predictions:
            delta = predictions[0].get('predicted_pressure', pressure) - pressure
            if delta > 3.0:
                trend = 'INCREASING'
                trend_icon = '↑'
            elif delta < -3.0:
                trend = 'EASING'
                trend_icon = '↓'

        # Best time recommendation
        best_time = self._find_best_time(pressure, predictions)

        # Disruption check
        scenario_engine = get_scenario_engine()
        scenario_state = scenario_engine.get_current_scenario()
        active_scenario = scenario_state.get('active_scenario_id')
        disruption_notice = None
        if active_scenario and self._is_disrupted(destination_id, active_scenario):
            disruption_notice = {
                'scenario_name': scenario_state.get('scenario_name', 'Active Disruption'),
                'message': 'Transit disruption in this corridor may increase travel time. Allow extra buffer.',
                'severity': 'MODERATE',
            }

        return {
            'destination_id':   destination_id,
            'name':             info['name'],
            'category':         info['category'],
            'area':             info['area'],
            'description':      info['description'],
            'crowd_level':      crowd_level,
            'crowd_label':      PRESSURE_LEVEL_LABELS.get(crowd_level, ''),
            'crowd_index':      round(pressure),
            'trend':            trend,
            'trend_icon':       trend_icon,
            'status':           self._crowd_to_status(crowd_level),
            'travel_time_min':  info['travel_time_min'],
            'travel_status':    'SLOW' if disruption_notice else 'OPEN',
            'forecast':         public_forecast,
            'best_time':        best_time,
            'disruption_notice': disruption_notice,
            'data_label':       'SIMULATED · AGGREGATED',
            'updated_at':       preds.get('forecast_time', '18:00'),
            'lat':              info['lat'],
            'lng':              info['lng'],
        }

    def get_recommendation(
        self,
        destination_id: str,
        preference: str = 'LESS_CROWDED',
    ) -> Dict[str, Any]:
        """Returns intelligent visitor recommendation: optimal destination or better alternative."""
        predictor = get_predictor()
        preds = predictor.predict_all_zones()
        zone_map = {z['zone_id']: z for z in preds.get('zones', [])}

        selected_info = DESTINATION_REGISTRY.get(destination_id)
        if not selected_info:
            return {'error': f'Destination {destination_id} not found'}

        selected_zone = zone_map.get(selected_info['zone_id'], {})
        selected_pressure = selected_zone.get('current_pressure', 50.0)
        selected_crowd = aggregate_pressure_to_label(selected_pressure)

        scenario_engine = get_scenario_engine()
        scenario_state = scenario_engine.get_current_scenario()
        active_scenario = scenario_state.get('active_scenario_id')

        candidates = self._score_alternatives(
            destination_id, preference, zone_map, active_scenario
        )

        best = candidates[0] if candidates else None
        recommendation_type = 'CURRENT'
        recommended = None

        if best and best['dest_id'] != destination_id:
            pressure_diff = selected_pressure - best['pressure']
            time_penalty  = best['travel_time_min'] - selected_info['travel_time_min']

            if pressure_diff >= MIN_CROWD_IMPROVEMENT and time_penalty <= MAX_TRAVEL_TIME_PENALTY_MIN:
                recommendation_type = 'ALTERNATIVE'
                recommended = best

        if recommendation_type == 'CURRENT':
            detail = self.get_destination_detail(destination_id)
            all_busy = all(
                CROWD_LEVEL_ORDER.get(c['crowd_level'], 2) >= 2
                for c in self.get_all_destinations()
            )
            return {
                'recommendation_type': 'CURRENT',
                'destination_id':      destination_id,
                'name':                selected_info['name'],
                'category':            selected_info['category'],
                'area':                selected_info['area'],
                'crowd_level':         selected_crowd,
                'crowd_label':         PRESSURE_LEVEL_LABELS.get(selected_crowd, ''),
                'crowd_index':         round(selected_pressure),
                'travel_time_min':     selected_info['travel_time_min'],
                'travel_status':       'OPEN' if not self._is_disrupted(destination_id, active_scenario) else 'SLOW',
                'why':                 self._build_why_current(selected_crowd, active_scenario),
                'best_time':           detail.get('best_time') if detail else None,
                'all_areas_busy':      all_busy,
                'disruption_notice':   detail.get('disruption_notice') if detail else None,
                'data_label':          'SIMULATED · AGGREGATED',
                'updated_at':          preds.get('forecast_time', '18:00'),
            }
        else:
            return {
                'recommendation_type': 'ALTERNATIVE',
                'original_destination': {
                    'destination_id': destination_id,
                    'name':           selected_info['name'],
                    'area':           selected_info['area'],
                    'crowd_level':    selected_crowd,
                    'crowd_label':    PRESSURE_LEVEL_LABELS.get(selected_crowd, ''),
                },
                'destination_id':  recommended['dest_id'],
                'name':            recommended['name'],
                'category':        recommended['category'],
                'area':            recommended['area'],
                'crowd_level':     recommended['crowd_level'],
                'crowd_label':     PRESSURE_LEVEL_LABELS.get(recommended['crowd_level'], ''),
                'crowd_index':     round(recommended['pressure']),
                'travel_time_min': recommended['travel_time_min'],
                'travel_status':   'OPEN' if not recommended.get('disrupted') else 'SLOW',
                'why':             self._build_why_alternative(
                    recommended, preference, selected_pressure, active_scenario
                ),
                'data_label':      'SIMULATED · AGGREGATED',
                'updated_at':      preds.get('forecast_time', '18:00'),
            }

    def get_visitor_route(
        self,
        origin_id: str = 'stn-dadar',
        destination_id: str = 'lalbaugcha-raja',
        prefer_alternative: bool = False
    ) -> Dict[str, Any]:
        """
        Calculates public-safe route from origin to destination using network graph.
        Returns GeoJSON geometry line, step-by-step guidance, travel time, and transit status.
        """
        network = get_network()

        # Resolve destination node
        dest_info = DESTINATION_REGISTRY.get(destination_id)
        if dest_info:
            target_node = dest_info.get('node_id', f"loc-{destination_id}")
            dest_name = dest_info['name']
        else:
            target_node = destination_id
            dest_name = destination_id

        # Resolve origin node
        orig_info = DESTINATION_REGISTRY.get(origin_id)
        if orig_info:
            source_node = orig_info.get('node_id', f"stn-{origin_id}")
            orig_name = orig_info['name']
        else:
            source_node = origin_id
            orig_node = network.nodes.get(network._resolve_node_id(origin_id))
            orig_name = orig_node.name if orig_node else origin_id

        # Calculate route using Dijkstra
        if prefer_alternative:
            route_res = network.get_alternative_route(source_node, target_node)
        else:
            route_res = network.get_route(source_node, target_node)

        # Check disruption status
        scenario_engine = get_scenario_engine()
        scenario_state = scenario_engine.get_current_scenario()
        active_scenario = scenario_state.get('active_scenario_id')

        is_disrupted = False
        disruption_message = None

        if route_res.status == 'AVAILABLE':
            # Check if any edge in path is closed or restricted
            for edge_id in route_res.edge_ids:
                edge = network.edges.get(edge_id)
                if edge and edge.status != 'OPEN':
                    is_disrupted = True
                    disruption_message = f"Congestion or restriction reported on {edge.type.upper()} corridor ({edge.source} → {edge.target})."
                    break

            # Collect LineString coordinates for map rendering
            geometry_coords = []
            steps = []
            for i, edge_id in enumerate(route_res.edge_ids):
                edge = network.edges.get(edge_id)
                if edge and edge.geometry:
                    if not geometry_coords:
                        geometry_coords.extend(edge.geometry)
                    else:
                        geometry_coords.extend(edge.geometry[1:])

                u_name = route_res.path_node_names[i] if i < len(route_res.path_node_names) else ""
                v_name = route_res.path_node_names[i+1] if (i+1) < len(route_res.path_node_names) else ""
                e_type = edge.type if edge else 'transit'
                e_time = edge.travel_time_min if edge else 5.0
                e_dist = edge.distance_km if edge else 1.0

                action_verb = 'Take' if e_type == 'rail' else 'Drive via' if e_type == 'road' else 'Walk along' if e_type == 'walk' else 'Transfer at'
                steps.append({
                    'step_number': i + 1,
                    'instruction': f"{action_verb} {u_name} → {v_name}",
                    'transit_type': e_type,
                    'travel_time_min': round(e_time, 1),
                    'distance_km': round(e_dist, 1),
                })

            travel_status = 'DISRUPTED' if is_disrupted else 'OPEN'

            return {
                'status': 'AVAILABLE',
                'origin': {
                    'id': origin_id,
                    'name': orig_name,
                },
                'destination': {
                    'id': destination_id,
                    'name': dest_name,
                },
                'total_travel_time_min': route_res.total_travel_time_min,
                'total_distance_km': route_res.total_distance_km,
                'travel_status': travel_status,
                'is_alternative': route_res.is_alternative,
                'disruption_notice': disruption_message,
                'steps': steps,
                'geometry': {
                    'type': 'LineString',
                    'coordinates': geometry_coords
                },
                'data_label': 'MODELLED · DYNAMIC NETWORK',
            }
        else:
            return {
                'status': 'UNAVAILABLE',
                'origin': {'id': origin_id, 'name': orig_name},
                'destination': {'id': destination_id, 'name': dest_name},
                'message': 'No direct connected transit path found for this route. Consider selecting a nearby central station.',
                'travel_status': 'UNAVAILABLE',
            }

    def get_visitor_stay_guidance(self) -> Dict[str, Any]:
        """Returns visitor-friendly accommodation availability and suburban buffer advice."""
        hotel_data = get_hotel_analytics()
        dist = hotel_data.get('distribution', {})

        core = dist.get('core_mumbai', {})
        buffer_sub = dist.get('buffer_suburbs', {})

        core_status = 'HIGH OCCUPANCY' if core.get('occupancy_rate', 0) > 80 else 'MODERATE'
        buffer_status = 'SPARE CAPACITY AVAILABLE' if buffer_sub.get('occupancy_rate', 0) < 70 else 'MODERATE'

        return {
            'summary': {
                'total_rooms': hotel_data.get('summary', {}).get('total_rooms', 15000),
                'available_rooms': hotel_data.get('summary', {}).get('available_rooms', 8500),
                'avg_price_inr': hotel_data.get('summary', {}).get('avg_price', 3800),
            },
            'zones': [
                {
                    'region': 'Central & South Core (Parel, Lalbaug, Girgaon, Colaba)',
                    'occupancy_rate': core.get('occupancy_rate', 88.5),
                    'available_rooms': core.get('available', 1200),
                    'status': core_status,
                    'advice': 'Peak festival demand. High occupancy and premium rates. Book well in advance.',
                },
                {
                    'region': 'Suburban Buffer Hubs (Thane, Navi Mumbai, Andheri, Vashi)',
                    'occupancy_rate': buffer_sub.get('occupancy_rate', 54.2),
                    'available_rooms': buffer_sub.get('available', 7300),
                    'status': buffer_status,
                    'advice': 'Ample room capacity with direct fast suburban rail connections into central pandal zones.',
                }
            ],
            'recommendation': 'Stay in suburban transit hubs (Thane or Andheri) for 40-50% lower accommodation pressure and reliable railway access.',
            'data_label': 'AGGREGATED · HOTEL OCCUPANCY',
        }

    def get_visitor_support_amenities(self, amenity_type: Optional[str] = None) -> Dict[str, Any]:
        """Returns public-safe civic welfare and emergency support points."""
        raw = get_welfare_amenities()
        amenities = raw.get('amenities', [])

        if amenity_type and amenity_type.upper() != 'ALL':
            amenities = [a for a in amenities if a.get('type', '').upper() == amenity_type.upper()]

        return {
            'summary': raw.get('summary', {}),
            'amenities': [
                {
                    'id': a['id'],
                    'name': a['name'],
                    'type': a['type'],
                    'lat': a['latitude'],
                    'lng': a['longitude'],
                    'capacity': a['capacity'],
                    'status': a['status'],
                }
                for a in amenities
            ],
            'data_label': 'MUNICIPAL CIVIC DATA',
        }

    def get_privacy_overview(self) -> Dict[str, Any]:
        """Returns visitor privacy policy, principles, and data governance catalog."""
        return {
            'policy': PRIVACY_POLICY,
            'principles': PRIVACY_PRINCIPLES,
            'catalog': DATA_GOVERNANCE_CATALOG,
        }

    # ─── Internal Scoring & Disruption Helpers ─────────────────────────────────

    def _score_alternatives(
        self,
        origin_id: str,
        preference: str,
        zone_map: Dict[str, Any],
        active_scenario: Optional[str],
    ) -> List[Dict[str, Any]]:
        weights = PREFERENCE_WEIGHTS.get(preference, PREFERENCE_WEIGHTS['LESS_CROWDED'])
        scored = []

        for dest_id, info in DESTINATION_REGISTRY.items():
            zone = zone_map.get(info['zone_id'], {})
            pressure = zone.get('current_pressure', 50.0)
            crowd_level = aggregate_pressure_to_label(pressure)
            travel_time = info['travel_time_min']

            disrupted = False
            disruption_penalty = 0
            if active_scenario and self._is_disrupted(dest_id, active_scenario):
                disruption_penalty = 25
                disrupted = True

            score = (
                weights['pressure']      * (pressure / 100.0) +
                weights['travel_time']   * ((travel_time + disruption_penalty) / 60.0) +
                weights['disruption']    * (1.0 if disrupted else 0.0)
            )

            scored.append({
                'dest_id':         dest_id,
                'name':            info['name'],
                'category':        info['category'],
                'area':            info['area'],
                'pressure':        pressure,
                'crowd_level':     crowd_level,
                'travel_time_min': travel_time,
                'disrupted':       disrupted,
                'score':           round(score, 4),
            })

        scored.sort(key=lambda x: x['score'])
        return scored

    def _is_disrupted(self, dest_id: str, scenario_id: str) -> bool:
        affected = {
            'central-line-disruption': ['curry-road-pandal', 'lalbaugcha-raja', 'parel-village', 'ganesh-galli'],
            'heavy-rain':              ['gateway-of-india', 'girgaon-chowpatty', 'marine-drive', 'juhu-beach'],
            'road-closure':            ['parel-village', 'curry-road-pandal', 'dadar-market'],
        }
        return dest_id in affected.get(scenario_id, [])

    def _find_best_time(self, current_pressure: float, predictions: List[Dict]) -> Optional[Dict]:
        for pred in predictions:
            future_p = pred.get('predicted_pressure', current_pressure)
            if (current_pressure - future_p) >= MIN_CROWD_IMPROVEMENT:
                crowd = aggregate_pressure_to_label(future_p)
                return {
                    'horizon_label':  pred.get('horizon_label', ''),
                    'horizon_minutes': pred.get('horizon_minutes', 60),
                    'crowd_level':    crowd,
                    'message': f"Consider visiting {pred.get('horizon_label', 'later')} — expected crowd is lower.",
                }
        return None

    def _crowd_to_status(self, crowd_level: str) -> str:
        return {
            'LOW': 'OPEN',
            'MODERATE': 'OPEN',
            'HIGH': 'BUSY',
            'CRITICAL': 'VERY BUSY',
            'UNKNOWN': 'UNAVAILABLE'
        }.get(crowd_level, 'OPEN')

    def _build_why_current(self, crowd_level: str, scenario: Optional[str]) -> List[str]:
        reasons = []
        if crowd_level in ('LOW', 'MODERATE'):
            reasons.append('This destination currently has manageable crowd levels and open movement.')
        else:
            reasons.append('This destination is currently busy, but remains the closest option for your route.')
        if scenario:
            reasons.append('There is an active weather or transit disruption in parts of the city — allow extra travel buffer.')
        return reasons

    def _build_why_alternative(
        self,
        rec: Dict,
        preference: str,
        original_pressure: float,
        scenario: Optional[str]
    ) -> List[str]:
        reasons = []
        pressure_saving = original_pressure - rec['pressure']
        if pressure_saving >= MIN_CROWD_IMPROVEMENT:
            reasons.append(f"Lower expected crowd (approx. {round(pressure_saving)} points less pressure).")
        if preference == 'FASTEST':
            reasons.append('Faster estimated transit connection.')
        if preference == 'AVOID_DISRUPTION':
            reasons.append('Corridor is unaffected by active rail or roadway disruptions.')
        reasons.append('All transit routes to this destination are operating normally.')
        if scenario and not rec.get('disrupted'):
            reasons.append('Operating outside the disruption-affected zone.')
        return reasons


# ─── Singleton ────────────────────────────────────────────────────────────────
_global_visitor_engine: Optional[VisitorRecommendationEngine] = None

def get_visitor_engine() -> VisitorRecommendationEngine:
    global _global_visitor_engine
    if _global_visitor_engine is None:
        _global_visitor_engine = VisitorRecommendationEngine()
    return _global_visitor_engine
