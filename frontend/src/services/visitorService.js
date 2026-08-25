/**
 * PRAVAAH Visitor API Service
 * Phase 11 + Phase 20 — Public-Safe Visitor Guidance Client
 */

import api from '../lib/api'

export async function getDestinations() {
  const res = await api.get('/visitor/destinations')
  return res.data
}

export async function getDestinationDetail(destinationId) {
  const res = await api.get(`/visitor/destinations/${destinationId}`)
  return res.data
}

export async function getRecommendation(destinationId, preference = 'LESS_CROWDED') {
  const res = await api.post('/visitor/recommendations', {
    destination_id: destinationId,
    preference,
  })
  return res.data
}

export async function getVisitorRoute(origin = 'stn-dadar', destination = 'lalbaugcha-raja', alternative = false) {
  const res = await api.get('/visitor/route', {
    params: {
      from: origin,
      to: destination,
      alternative: alternative ? 'true' : 'false',
    }
  })
  return res.data
}

export async function getCurrentConditions() {
  const res = await api.get('/visitor/conditions')
  return res.data
}

export async function getVisitorStay() {
  const res = await api.get('/visitor/stay')
  return res.data
}

export async function getVisitorSupport(type = 'ALL') {
  const res = await api.get('/visitor/support', {
    params: type && type !== 'ALL' ? { type } : {}
  })
  return res.data
}

export async function getPrivacyPolicy() {
  const res = await api.get('/privacy/policy')
  return res.data
}

export async function getDataCatalog() {
  const res = await api.get('/privacy/data-catalog')
  return res.data
}
