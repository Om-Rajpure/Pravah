/**
 * PRAVAAH Scenario Engine API Client
 * Robust client with fallback What-If simulation support for local & deployed states
 */

import api from '../lib/api'

export const FALLBACK_SCENARIOS = [
  {
    id: 'central-line-disruption',
    name: 'Central Line Disruption',
    category: 'TRANSIT',
    severity: 'CRITICAL',
    description: 'Suburban rail signal failure halts Central Line mainline service between Parel and Curry Road.',
    affected_zones: ['curry-road', 'parel', 'dadar', 'lalbaug']
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Monsoon Rain',
    category: 'WEATHER',
    severity: 'HIGH',
    description: 'IMD red alert rainfall (>45mm/h) reduces road traffic speed by 40% and slows walking dispersal.',
    affected_zones: ['dadar', 'lalbaug', 'curry-road', 'byculla']
  },
  {
    id: 'road-closure',
    name: 'Dr. BA Road Corridor Closure',
    category: 'ROADWAY',
    severity: 'HIGH',
    description: 'Grand immersion procession crossing requires temporary closure of Dr. BA Road arterial at Bharat Mata.',
    affected_zones: ['lalbaug', 'parel', 'byculla']
  }
]

const SCENARIO_SIM_MAP = {
  'central-line-disruption': {
    scenario_id: 'central-line-disruption',
    scenario_name: 'Central Line Disruption',
    summary: {
      critical_zones_baseline: 1,
      critical_zones_disruption: 3,
      critical_zones_action: 1
    },
    scorecard: [
      { zone_id: 'curry-road', zone_name: 'Curry Road Station', baseline_pressure: 72, disruption_pressure: 91, action_pressure: 74, disruption_delta: 19, action_delta: -17, status_baseline: 'HIGH', status_disruption: 'CRITICAL', status_action: 'HIGH' },
      { zone_id: 'dadar', zone_name: 'Dadar Interchange', baseline_pressure: 68, disruption_pressure: 84, action_pressure: 72, disruption_delta: 16, action_delta: -12, status_baseline: 'MODERATE', status_disruption: 'CRITICAL', status_action: 'HIGH' },
      { zone_id: 'parel', zone_name: 'Parel Central', baseline_pressure: 64, disruption_pressure: 78, action_pressure: 70, disruption_delta: 14, action_delta: -8, status_baseline: 'MODERATE', status_disruption: 'HIGH', status_action: 'MODERATE' },
      { zone_id: 'lalbaug', zone_name: 'Lalbaugcha Raja', baseline_pressure: 75, disruption_pressure: 82, action_pressure: 76, disruption_delta: 7, action_delta: -6, status_baseline: 'HIGH', status_disruption: 'CRITICAL', status_action: 'HIGH' },
      { zone_id: 'byculla', zone_name: 'Byculla Corridor', baseline_pressure: 58, disruption_pressure: 64, action_pressure: 60, disruption_delta: 6, action_delta: -4, status_baseline: 'MODERATE', status_disruption: 'MODERATE', status_action: 'MODERATE' },
      { zone_id: 'thane', zone_name: 'Thane Relief Buffer', baseline_pressure: 54, disruption_pressure: 54, action_pressure: 62, disruption_delta: 0, action_delta: 8, status_baseline: 'LOW', status_disruption: 'LOW', status_action: 'MODERATE' }
    ],
    cascade: [
      { stage: 'TRIGGER', title: 'Signal Disruption', description: 'Central Line suburban rail track signal failure halts direct service near Parel.' },
      { stage: 'NETWORK', title: 'Corridor Unavailable', description: 'Direct Central Line pedestrian connection to Curry Road is closed.' },
      { stage: 'FLOW', title: 'Crowd Diverted', description: 'Incoming crowd diverts along Dadar TT and Dr. Ambedkar Road arterial.' },
      { stage: 'PRESSURE', title: 'Pressure Escalation', description: 'Curry Road pressure escalates from 72 to 91 (Critical); Dadar rises from 68 to 84.' },
      { stage: 'RESPONSE', title: 'PRAVAAH Recommended Action', description: 'PRAVAAH recommends redirecting 18% of incoming flow toward Thane buffer capacity.' }
    ]
  },
  'heavy-rain': {
    scenario_id: 'heavy-rain',
    scenario_name: 'Heavy Monsoon Rain',
    summary: {
      critical_zones_baseline: 1,
      critical_zones_disruption: 2,
      critical_zones_action: 1
    },
    scorecard: [
      { zone_id: 'curry-road', zone_name: 'Curry Road Station', baseline_pressure: 72, disruption_pressure: 82, action_pressure: 72, disruption_delta: 10, action_delta: -10, status_baseline: 'HIGH', status_disruption: 'CRITICAL', status_action: 'HIGH' },
      { zone_id: 'dadar', zone_name: 'Dadar Interchange', baseline_pressure: 68, disruption_pressure: 79, action_pressure: 70, disruption_delta: 11, action_delta: -9, status_baseline: 'MODERATE', status_disruption: 'CRITICAL', status_action: 'MODERATE' },
      { zone_id: 'parel', zone_name: 'Parel Central', baseline_pressure: 64, disruption_pressure: 74, action_pressure: 66, disruption_delta: 10, action_delta: -8, status_baseline: 'MODERATE', status_disruption: 'HIGH', status_action: 'MODERATE' },
      { zone_id: 'lalbaug', zone_name: 'Lalbaugcha Raja', baseline_pressure: 75, disruption_pressure: 80, action_pressure: 75, disruption_delta: 5, action_delta: -5, status_baseline: 'HIGH', status_disruption: 'CRITICAL', status_action: 'HIGH' },
      { zone_id: 'byculla', zone_name: 'Byculla Corridor', baseline_pressure: 58, disruption_pressure: 71, action_pressure: 62, disruption_delta: 13, action_delta: -9, status_baseline: 'MODERATE', status_disruption: 'HIGH', status_action: 'MODERATE' },
      { zone_id: 'thane', zone_name: 'Thane Relief Buffer', baseline_pressure: 54, disruption_pressure: 54, action_pressure: 58, disruption_delta: 0, action_delta: 4, status_baseline: 'LOW', status_disruption: 'LOW', status_action: 'LOW' }
    ],
    cascade: [
      { stage: 'TRIGGER', title: 'Monsoon Rain Surge', description: 'Intense rainfall (>45mm/h) causes waterlogging across South-Central corridors.' },
      { stage: 'NETWORK', title: 'Transit Delays', description: 'Arterial road travel times increase by 40%; walking dispersal slows.' },
      { stage: 'FLOW', title: 'Queue Backlog', description: 'Slower dispersal leads to platform queue accumulation across transit nodes.' },
      { stage: 'PRESSURE', title: 'Widespread Elevated Pressure', description: 'Dadar rises from 68 to 79; Byculla rises from 58 to 71.' },
      { stage: 'RESPONSE', title: 'PRAVAAH Recommended Action', description: 'PRAVAAH recommends holding incoming waves at suburban terminals and extending dwell intervals.' }
    ]
  },
  'road-closure': {
    scenario_id: 'road-closure',
    scenario_name: 'Dr. BA Road Corridor Closure',
    summary: {
      critical_zones_baseline: 1,
      critical_zones_disruption: 3,
      critical_zones_action: 1
    },
    scorecard: [
      { zone_id: 'curry-road', zone_name: 'Curry Road Station', baseline_pressure: 72, disruption_pressure: 79, action_pressure: 73, disruption_delta: 7, action_delta: -6, status_baseline: 'HIGH', status_disruption: 'CRITICAL', status_action: 'HIGH' },
      { zone_id: 'dadar', zone_name: 'Dadar Interchange', baseline_pressure: 68, disruption_pressure: 74, action_pressure: 69, disruption_delta: 6, action_delta: -5, status_baseline: 'MODERATE', status_disruption: 'HIGH', status_action: 'MODERATE' },
      { zone_id: 'parel', zone_name: 'Parel Central', baseline_pressure: 64, disruption_pressure: 81, action_pressure: 68, disruption_delta: 17, action_delta: -13, status_baseline: 'MODERATE', status_disruption: 'CRITICAL', status_action: 'MODERATE' },
      { zone_id: 'lalbaug', zone_name: 'Lalbaugcha Raja', baseline_pressure: 75, disruption_pressure: 88, action_pressure: 75, disruption_delta: 13, action_delta: -13, status_baseline: 'HIGH', status_disruption: 'CRITICAL', status_action: 'HIGH' },
      { zone_id: 'byculla', zone_name: 'Byculla Corridor', baseline_pressure: 58, disruption_pressure: 66, action_pressure: 60, disruption_delta: 8, action_delta: -6, status_baseline: 'MODERATE', status_disruption: 'MODERATE', status_action: 'MODERATE' },
      { zone_id: 'andheri', zone_name: 'Andheri West Buffer', baseline_pressure: 56, disruption_pressure: 56, action_pressure: 60, disruption_delta: 0, action_delta: 4, status_baseline: 'LOW', status_disruption: 'LOW', status_action: 'MODERATE' }
    ],
    cascade: [
      { stage: 'TRIGGER', title: 'Procession Crossing', description: 'Grand procession movement crossing Dr. BA Road junction.' },
      { stage: 'NETWORK', title: 'Arterial Closed', description: 'Main north-south vehicular arterial closed to all bus and shuttle transit.' },
      { stage: 'FLOW', title: 'Vehicular Detour', description: 'Traffic and shuttle feeder flow diverted via Sane Guruji Marg eastern detour.' },
      { stage: 'PRESSURE', title: 'Localized Congestion Spike', description: 'Parel road pressure rises from 64 to 81; Lalbaug perimeter approaches 88.' },
      { stage: 'RESPONSE', title: 'PRAVAAH Recommended Action', description: 'PRAVAAH recommends shifting feeder shuttles toward Western Line Lower Parel access.' }
    ]
  }
}

export async function getScenarios() {
  try {
    const res = await api.get('/scenarios')
    if (res.data) {
      return Array.isArray(res.data) ? res.data : (res.data.scenarios || FALLBACK_SCENARIOS)
    }
    return FALLBACK_SCENARIOS
  } catch (err) {
    console.warn('Using fallback scenarios list:', err)
    return FALLBACK_SCENARIOS
  }
}

export async function getScenarioDetail(scenarioId) {
  try {
    const res = await api.get(`/scenarios/${scenarioId}`)
    return res.data
  } catch (err) {
    console.warn('Using fallback scenario detail:', err)
    const found = FALLBACK_SCENARIOS.find(s => s.id === scenarioId) || FALLBACK_SCENARIOS[0]
    return found
  }
}

export async function simulateScenario(scenarioId) {
  try {
    const res = await api.post('/scenarios/simulate', { scenario_id: scenarioId })
    if (res.data && res.data.scorecard) {
      return res.data
    }
    return SCENARIO_SIM_MAP[scenarioId] || SCENARIO_SIM_MAP['central-line-disruption']
  } catch (err) {
    console.warn('Using fallback scenario simulation:', err)
    return SCENARIO_SIM_MAP[scenarioId] || SCENARIO_SIM_MAP['central-line-disruption']
  }
}

export async function activateScenario(scenarioId) {
  try {
    const res = await api.post('/scenarios/activate', { scenario_id: scenarioId })
    return res.data
  } catch (err) {
    console.warn('Activating scenario in client state:', err)
    return { status: 'ACTIVATED', scenario_id: scenarioId }
  }
}

export async function resetScenario() {
  try {
    const res = await api.post('/scenarios/reset')
    return res.data
  } catch (err) {
    console.warn('Resetting scenario in client state:', err)
    return { status: 'RESET_SUCCESS' }
  }
}

export async function getCurrentScenario() {
  try {
    const res = await api.get('/scenarios/current')
    return res.data
  } catch (err) {
    return { active_scenario_id: null }
  }
}
