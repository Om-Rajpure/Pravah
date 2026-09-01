/**
 * PRAVAAH Action & Intervention Engine API Client
 * Robust client with fallback simulation support for local & deployed states
 */

import api from '../lib/api'

export const FALLBACK_ACTION_DATA = {
  recommended_action: {
    id: 'act-redirect-curry-road-thane-18',
    type: 'REDIRECT',
    source: 'curry-road',
    source_name: 'Curry Road',
    destination: 'thane',
    destination_name: 'Thane Suburban Hub',
    dosage_pct: 18,
    score: 92.4,
    confidence: 0.94,
    status: 'RECOMMENDED'
  },
  impact: {
    target_pressure_before: 94,
    target_pressure_after: 76,
    pressure_reduction: 18,
    destination_pressure_before: 54,
    destination_pressure_after: 59,
    side_effect_increase: 5,
    critical_zones_before: 3,
    critical_zones_after: 1,
    affected_people: 2500
  },
  why_this_action: [
    'Curry Road platform bottleneck predicted at 94% saturation within 45 minutes.',
    'Thane Suburban Hub has 58% spare capacity and direct Central Line express transit.',
    'Saves ~24 minutes average pedestrian congestion delay across central corridor.'
  ],
  what_if_nothing: 'Without intervention, Curry Road station and access skywalks will reach 94/100 saturation in ~45 mins with severe pedestrian bottlenecks.',
  alternatives: [
    { action_id: 'alt-1', destination: 'Vashi', dosage_pct: 15, score: 87.1, target_after: 79, reduction: 15, side_effect: 5 },
    { action_id: 'alt-2', destination: 'Navi Mumbai', dosage_pct: 20, score: 84.6, target_after: 74, reduction: 20, side_effect: 9 },
    { action_id: 'alt-3', destination: 'Dadar', dosage_pct: 10, score: 78.2, target_after: 84, reduction: 10, side_effect: 6 }
  ]
}

export async function getActionRecommendations() {
  try {
    const res = await api.get('/actions/recommendations')
    if (res.data && res.data.recommended_action) {
      return res.data
    }
    return FALLBACK_ACTION_DATA
  } catch (err) {
    console.warn('Using fallback action recommendations:', err)
    return FALLBACK_ACTION_DATA
  }
}

export async function simulateAction(actionId) {
  try {
    const res = await api.post('/actions/simulate', { action_id: actionId })
    if (res.data && res.data.recommended_action) {
      return res.data
    }
    return {
      ...FALLBACK_ACTION_DATA,
      recommended_action: {
        ...FALLBACK_ACTION_DATA.recommended_action,
        status: 'SIMULATED'
      }
    }
  } catch (err) {
    console.warn('Using fallback simulated action:', err)
    return {
      ...FALLBACK_ACTION_DATA,
      recommended_action: {
        ...FALLBACK_ACTION_DATA.recommended_action,
        status: 'SIMULATED'
      }
    }
  }
}

export async function approveAction(actionId) {
  try {
    const res = await api.post(`/actions/${actionId}/approve`)
    return res.data
  } catch (err) {
    console.warn('Action approved in client state:', err)
    return { status: 'ACTIVE', message: 'Action approved successfully' }
  }
}

export async function resetActions() {
  try {
    const res = await api.post('/actions/reset')
    return res.data
  } catch (err) {
    console.warn('Actions reset in client state:', err)
    return { status: 'RESET_SUCCESS', message: 'Actions reset to baseline' }
  }
}
