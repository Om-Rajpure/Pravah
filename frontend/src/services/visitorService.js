/**
 * PRAVAAH Visitor API Service
 * Public-Safe Visitor Guidance Client with complete fallback data
 */

import api from '../lib/api'

export const FALLBACK_DESTINATIONS = [
  {
    destination_id: 'lalbaugcha-raja',
    name: 'Lalbaugcha Raja',
    area: 'Lalbaug / Parel',
    category: 'Pandal',
    crowd_level: 'HIGH',
    crowd_label: 'Busy',
    crowd_index: 82,
    travel_time_min: 15,
    travel_status: 'SLOW',
    trend: 'INCREASING',
    expected_crowd: 'High',
    description: 'Most iconic festival pandal in central Mumbai with major pilgrim queues.',
    keywords: ['lalbaug', 'raja', 'ganpati', 'mandal', 'pandal', 'central', 'curry road', 'parel']
  },
  {
    destination_id: 'ganesh-galli',
    name: 'Ganesh Galli (Mumbaicha Raja)',
    area: 'Lalbaug / Parel',
    category: 'Pandal',
    crowd_level: 'HIGH',
    crowd_label: 'Busy',
    crowd_index: 78,
    travel_time_min: 18,
    travel_status: 'SLOW',
    trend: 'INCREASING',
    expected_crowd: 'High',
    description: 'Historic 22-foot idol celebrated for traditional themes near Lalbaug.',
    keywords: ['ganesh galli', 'mumbaicha raja', 'lalbaug', 'pandal', 'mandal']
  },
  {
    destination_id: 'girgaon-chowpatty',
    name: 'Girgaon Chowpatty',
    area: 'Marine Drive / Charni Road',
    category: 'Beach',
    crowd_level: 'MODERATE',
    crowd_label: 'Moderate',
    crowd_index: 56,
    travel_time_min: 25,
    travel_status: 'OPEN',
    trend: 'STABLE',
    expected_crowd: 'Moderate',
    description: 'Prime immersion beach along Marine Drive promenade.',
    keywords: ['girgaon', 'chowpatty', 'beach', 'immersion', 'visarjan', 'marine drive']
  },
  {
    destination_id: 'siddhivinayak',
    name: 'Siddhivinayak Temple',
    area: 'Prabhadevi / Dadar West',
    category: 'Temple',
    crowd_level: 'MODERATE',
    crowd_label: 'Moderate',
    crowd_index: 64,
    travel_time_min: 12,
    travel_status: 'OPEN',
    trend: 'STABLE',
    expected_crowd: 'Moderate',
    description: 'Sanctum with barcode queue management and broad pedestrian plaza.',
    keywords: ['siddhivinayak', 'temple', 'prabhadevi', 'dadar', 'sanctum']
  },
  {
    destination_id: 'andhericha-raja',
    name: 'Andhericha Raja',
    area: 'Azad Nagar / Andheri West',
    category: 'Pandal',
    crowd_level: 'LOW',
    crowd_label: 'Low Crowd',
    crowd_index: 44,
    travel_time_min: 32,
    travel_status: 'OPEN',
    trend: 'EASING',
    expected_crowd: 'Low',
    description: 'Western suburban mandal directly connected via Mumbai Metro Line 1.',
    keywords: ['andheri', 'andhericha raja', 'azad nagar', 'metro', 'suburb']
  },
  {
    destination_id: 'gateway-of-india',
    name: 'Gateway of India',
    area: 'Colaba / South Mumbai',
    category: 'Landmark',
    crowd_level: 'LOW',
    crowd_label: 'Low Crowd',
    crowd_index: 38,
    travel_time_min: 35,
    travel_status: 'OPEN',
    trend: 'STABLE',
    expected_crowd: 'Low',
    description: 'Historic waterfront monument overlooking the Arabian Sea in South Mumbai.',
    keywords: ['gateway', 'india', 'colaba', 'south mumbai', 'harbour', 'waterfront']
  }
]

export async function getDestinations() {
  try {
    const res = await api.get('/visitor/destinations')
    if (res.data) {
      if (Array.isArray(res.data) && res.data.length > 0) return res.data
      if (Array.isArray(res.data.destinations) && res.data.destinations.length > 0) return res.data.destinations
    }
    return FALLBACK_DESTINATIONS
  } catch (err) {
    console.warn('Using fallback destinations:', err)
    return FALLBACK_DESTINATIONS
  }
}

export async function getDestinationDetail(destinationId) {
  try {
    const res = await api.get(`/visitor/destinations/${destinationId}`)
    if (res.data && res.data.destination_id) return res.data
    const found = FALLBACK_DESTINATIONS.find(d => d.destination_id === destinationId) || FALLBACK_DESTINATIONS[0]
    return {
      ...found,
      lat: 18.9912,
      lng: 72.8355,
      updated_at: 'Just now',
      forecast: [
        { horizon_label: '+1h', crowd_level: 'HIGH', trend: 'INCREASING' },
        { horizon_label: '+2h', crowd_level: 'HIGH', trend: 'STABLE' },
        { horizon_label: '+3h', crowd_level: 'MODERATE', trend: 'EASING' }
      ],
      best_time: {
        horizon_label: '7:40 PM – 8:30 PM',
        message: 'Arriving after peak railway transit congestion reduces queue delay by ~35 mins.'
      }
    }
  } catch (err) {
    console.warn('Using fallback destination detail:', err)
    const found = FALLBACK_DESTINATIONS.find(d => d.destination_id === destinationId) || FALLBACK_DESTINATIONS[0]
    return {
      ...found,
      lat: 18.9912,
      lng: 72.8355,
      updated_at: 'Just now',
      forecast: [
        { horizon_label: '+1h', crowd_level: 'HIGH', trend: 'INCREASING' },
        { horizon_label: '+2h', crowd_level: 'HIGH', trend: 'STABLE' },
        { horizon_label: '+3h', crowd_level: 'MODERATE', trend: 'EASING' }
      ],
      best_time: {
        horizon_label: '7:40 PM – 8:30 PM',
        message: 'Arriving after peak railway transit congestion reduces queue delay by ~35 mins.'
      }
    }
  }
}

export async function getRecommendation(destinationId, preference = 'LESS_CROWDED') {
  try {
    const res = await api.post('/visitor/recommendations', {
      destination_id: destinationId,
      preference,
    })
    if (res.data) return res.data
    return {
      recommendation_type: 'ALTERNATIVE',
      destination_id: 'andhericha-raja',
      name: 'Andhericha Raja',
      area: 'Azad Nagar / Andheri West',
      crowd_level: 'LOW',
      crowd_label: 'Low Crowd',
      travel_time_min: 32,
      why: [
        'Metro Line 1 provides direct air-conditioned transit with zero road congestion.',
        'Crowd pressure is 44/100 (Safe) vs 82/100 at Central pandals.',
        'Average queue wait time is ~15 mins compared to ~90 mins.'
      ]
    }
  } catch (err) {
    console.warn('Using fallback recommendation:', err)
    return {
      recommendation_type: 'ALTERNATIVE',
      destination_id: 'andhericha-raja',
      name: 'Andhericha Raja',
      area: 'Azad Nagar / Andheri West',
      crowd_level: 'LOW',
      crowd_label: 'Low Crowd',
      travel_time_min: 32,
      why: [
        'Metro Line 1 provides direct air-conditioned transit with zero road congestion.',
        'Crowd pressure is 44/100 (Safe) vs 82/100 at Central pandals.',
        'Average queue wait time is ~15 mins compared to ~90 mins.'
      ]
    }
  }
}

export async function getVisitorRoute(origin = 'stn-dadar', destination = 'lalbaugcha-raja', alternative = false) {
  try {
    const res = await api.get('/visitor/route', {
      params: {
        from: origin,
        to: destination,
        alternative: alternative ? 'true' : 'false',
      }
    })
    if (res.data) return res.data
    return {
      origin_name: 'Dadar Station Interchange',
      destination_name: 'Lalbaugcha Raja',
      total_time_min: 18,
      status: 'OPTIMAL',
      steps: [
        { mode: 'WALK', instruction: 'Walk south along Senapati Bapat Marg skywalk', duration_min: 4 },
        { mode: 'TRAIN', instruction: 'Take Central Railway slow train from Dadar to Curry Road', duration_min: 6 },
        { mode: 'WALK', instruction: 'Follow yellow festival pedestrian corridor to Lalbaug pandal gate', duration_min: 8 }
      ]
    }
  } catch (err) {
    console.warn('Using fallback visitor route:', err)
    return {
      origin_name: 'Dadar Station Interchange',
      destination_name: 'Lalbaugcha Raja',
      total_time_min: 18,
      status: 'OPTIMAL',
      steps: [
        { mode: 'WALK', instruction: 'Walk south along Senapati Bapat Marg skywalk', duration_min: 4 },
        { mode: 'TRAIN', instruction: 'Take Central Railway slow train from Dadar to Curry Road', duration_min: 6 },
        { mode: 'WALK', instruction: 'Follow yellow festival pedestrian corridor to Lalbaug pandal gate', duration_min: 8 }
      ]
    }
  }
}

export async function getCurrentConditions() {
  try {
    const res = await api.get('/visitor/conditions')
    if (res.data) return res.data
    return {
      total_destinations: 6,
      busy_count: 2,
      moderate_count: 2,
      quiet_count: 2,
      overall_status: 'MODERATE',
      data_label: 'SIMULATED · AGGREGATED'
    }
  } catch (err) {
    return {
      total_destinations: 6,
      busy_count: 2,
      moderate_count: 2,
      quiet_count: 2,
      overall_status: 'MODERATE',
      data_label: 'SIMULATED · AGGREGATED'
    }
  }
}

export async function getVisitorStay() {
  try {
    const res = await api.get('/visitor/stay')
    return res.data
  } catch (err) {
    return {
      status: 'AVAILABLE',
      buffer_zones: [
        { name: 'Thane Suburban Terminal', occupancy: '42%', advice: 'Ideal relief buffer with express connectivity.' },
        { name: 'Navi Mumbai / Vashi', occupancy: '38%', advice: 'Ample budget hotel capacity and direct Harbour line.' }
      ]
    }
  }
}

export async function getVisitorSupport(type = 'ALL') {
  try {
    const res = await api.get('/visitor/support', {
      params: type && type !== 'ALL' ? { type } : {}
    })
    return res.data
  } catch (err) {
    return {
      amenities: [
        { name: 'Emergency Medical Post #1', type: 'FIRST_AID', location: 'Curry Road Station Bridge' },
        { name: 'Municipal Drinking Water Post', type: 'WATER', location: 'Lalbaug Flyover North' },
        { name: 'Mumbai Police Help Desk', type: 'POLICE', location: 'Dr. Ambedkar Road Junction' }
      ]
    }
  }
}

export async function getPrivacyPolicy() {
  try {
    const res = await api.get('/privacy/policy')
    return res.data
  } catch (err) {
    return { version: '1.0', title: 'PRAVAAH Public Privacy Guarantee' }
  }
}

export async function getDataCatalog() {
  try {
    const res = await api.get('/privacy/data-catalog')
    return res.data
  } catch (err) {
    return { items: [] }
  }
}
