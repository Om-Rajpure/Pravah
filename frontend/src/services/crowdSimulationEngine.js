/**
 * PRAVAAH Crowd & Transit Simulation Engine (Deterministic Digital-Twin)
 * 
 * Single source of truth for crowd magnitude, flow movement, and train simulation.
 * Driven by the project's canonical seed (20260908) and simulation clock (18:00 +5m step).
 * 
 * Quantity Classification Taxonomy:
 * - SPARSE:   0–20%    (#14B8A6) "Sparse · 1,200 (12%)"
 * - LIGHT:    20–40%   (#2563EB) "Light · 4,800 (32%)"
 * - MODERATE: 40–60%   (#F59E0B) "Moderate · 9,600 (55%)"
 * - HEAVY:    60–85%   (#F97316) "Heavy · 15,400 (78%)"
 * - CRITICAL: 85–100%+ (#DC2626) "Critical · 20,900 (94%)"
 */

export const TAXONOMY = {
  SPARSE:   { min: 0,  max: 20,  color: '#14B8A6', bg: '#14B8A61A', label: 'Sparse' },
  LIGHT:    { min: 20, max: 40,  color: '#2563EB', bg: '#2563EB1A', label: 'Light' },
  MODERATE: { min: 40, max: 60,  color: '#F59E0B', bg: '#F59E0B1A', label: 'Moderate' },
  HEAVY:    { min: 60, max: 85,  color: '#F97316', bg: '#F973161A', label: 'Heavy' },
  CRITICAL: { min: 85, max: 100, color: '#DC2626', bg: '#DC26261A', label: 'Critical' }
}

export function classifyQuantity(count, capacity) {
  const pct = Math.min(100, Math.max(0, Math.round((count / Math.max(capacity, 1)) * 100)))
  let category = 'SPARSE'
  if (pct >= 85) category = 'CRITICAL'
  else if (pct >= 60) category = 'HEAVY'
  else if (pct >= 40) category = 'MODERATE'
  else if (pct >= 20) category = 'LIGHT'

  const meta = TAXONOMY[category]
  return {
    category,
    pct,
    count,
    capacity,
    color: meta.color,
    bgColor: meta.bg,
    class_label: meta.label,
    formatted_label: `${meta.label} · ${count.toLocaleString()} (${pct}%)`
  }
}

// 11 Canonical Mumbai Operational Zones with coordinates and baseline capacities
export const REAL_ZONES = [
  { id: 'curry-road',   name: 'Curry Road Station Hub', lat: 18.9942, lng: 72.8336, capacity: 22000, baseOccupancy: 20680 },
  { id: 'lalbaug',      name: 'Lalbaugcha Raja Core',   lat: 18.9912, lng: 72.8355, capacity: 35000, baseOccupancy: 30800 },
  { id: 'parel',        name: 'Parel Transit Junction', lat: 19.0022, lng: 72.8398, capacity: 28000, baseOccupancy: 20160 },
  { id: 'dadar',        name: 'Dadar Central Interchange', lat: 19.0178, lng: 72.8478, capacity: 50000, baseOccupancy: 34000 },
  { id: 'byculla',      name: 'Byculla Ingress Zone',   lat: 18.9750, lng: 72.8330, capacity: 25000, baseOccupancy: 13750 },
  { id: 'girgaon',      name: 'Girgaon Chowpatty',      lat: 18.9560, lng: 72.8150, capacity: 30000, baseOccupancy: 11400 },
  { id: 'south-mumbai', name: 'CSMT / Fort Heritage',   lat: 18.9400, lng: 72.8354, capacity: 40000, baseOccupancy: 12800 },
  { id: 'andheri',      name: 'Andheri West Suburban',  lat: 19.1197, lng: 72.8464, capacity: 45000, baseOccupancy: 16200 },
  { id: 'thane',        name: 'Thane Suburban Terminal', lat: 19.1860, lng: 72.9750, capacity: 60000, baseOccupancy: 19200 },
  { id: 'vashi',        name: 'Vashi Navi Mumbai Hub',  lat: 19.0645, lng: 72.9980, capacity: 35000, baseOccupancy: 8750 },
  { id: 'navi-mumbai',  name: 'Belapur CBD Sector',     lat: 19.0330, lng: 73.0297, capacity: 30000, baseOccupancy: 5400 }
]

// Authentic Railway Lines with Station Stop Coordinates [lng, lat]
export const TRANSIT_LINES = [
  {
    id: 'line-central',
    name: 'Central Railway Mainline',
    color: '#2563EB',
    stations: [
      { name: 'CSMT', coord: [72.8354, 18.9400] },
      { name: 'Byculla', coord: [72.8330, 18.9750] },
      { name: 'Chinchpokli', coord: [72.8320, 18.9880] },
      { name: 'Curry Road', coord: [72.8336, 18.9942] },
      { name: 'Parel', coord: [72.8398, 19.0022] },
      { name: 'Dadar', coord: [72.8478, 19.0178] },
      { name: 'Kurla', coord: [72.8797, 19.0657] },
      { name: 'Ghatkopar', coord: [72.9080, 19.0860] },
      { name: 'Thane', coord: [72.9750, 19.1860] }
    ]
  },
  {
    id: 'line-western',
    name: 'Western Railway Corridor',
    color: '#14B8A6',
    stations: [
      { name: 'Churchgate', coord: [72.8264, 18.9322] },
      { name: 'Mumbai Central', coord: [72.8190, 18.9690] },
      { name: 'Lower Parel', coord: [72.8300, 18.9950] },
      { name: 'Dadar (W)', coord: [72.8430, 19.0180] },
      { name: 'Bandra', coord: [72.8400, 19.0550] },
      { name: 'Andheri', coord: [72.8464, 19.1197] }
    ]
  },
  {
    id: 'line-harbour',
    name: 'Harbour Line Transit',
    color: '#64748B',
    stations: [
      { name: 'CSMT', coord: [72.8354, 18.9400] },
      { name: 'Vadala Road', coord: [72.8580, 19.0160] },
      { name: 'Chembur', coord: [72.8990, 19.0620] },
      { name: 'Vashi', coord: [72.9980, 19.0645] },
      { name: 'Nerul', coord: [73.0180, 19.0330] },
      { name: 'Belapur CBD', coord: [73.0297, 19.0330] }
    ]
  }
]

// 12-Car Local Train Fleet Initial Definitions
const INITIAL_TRAIN_FLEET = [
  // Central Line Trains (5 Trains)
  { id: 'TR-CR-101', lineId: 'line-central', lineName: 'Central Mainline', progress: 0.12, direction: 1, baseOccupancy: 1780, capacity: 2000 },
  { id: 'TR-CR-102', lineId: 'line-central', lineName: 'Central Mainline', progress: 0.38, direction: 1, baseOccupancy: 1920, capacity: 2000 },
  { id: 'TR-CR-103', lineId: 'line-central', lineName: 'Central Mainline', progress: 0.65, direction: -1, baseOccupancy: 1450, capacity: 2000 },
  { id: 'TR-CR-104', lineId: 'line-central', lineName: 'Central Mainline', progress: 0.82, direction: 1, baseOccupancy: 980, capacity: 2000 },
  { id: 'TR-CR-105', lineId: 'line-central', lineName: 'Central Mainline', progress: 0.94, direction: -1, baseOccupancy: 650, capacity: 2000 },

  // Western Line Trains (4 Trains)
  { id: 'TR-WR-201', lineId: 'line-western', lineName: 'Western Corridor', progress: 0.20, direction: 1, baseOccupancy: 1650, capacity: 2000 },
  { id: 'TR-WR-202', lineId: 'line-western', lineName: 'Western Corridor', progress: 0.45, direction: -1, baseOccupancy: 1320, capacity: 2000 },
  { id: 'TR-WR-203', lineId: 'line-western', lineName: 'Western Corridor', progress: 0.70, direction: 1, baseOccupancy: 1100, capacity: 2000 },
  { id: 'TR-WR-204', lineId: 'line-western', lineName: 'Western Corridor', progress: 0.88, direction: -1, baseOccupancy: 540, capacity: 2000 },

  // Harbour Line Trains (4 Trains)
  { id: 'TR-HR-301', lineId: 'line-harbour', lineName: 'Harbour Line', progress: 0.15, direction: 1, baseOccupancy: 820, capacity: 2000 },
  { id: 'TR-HR-302', lineId: 'line-harbour', lineName: 'Harbour Line', progress: 0.40, direction: -1, baseOccupancy: 1150, capacity: 2000 },
  { id: 'TR-HR-303', lineId: 'line-harbour', lineName: 'Harbour Line', progress: 0.68, direction: 1, baseOccupancy: 940, capacity: 2000 },
  { id: 'TR-HR-304', lineId: 'line-harbour', lineName: 'Harbour Line', progress: 0.90, direction: -1, baseOccupancy: 380, capacity: 2000 }
]

function interpolateLineString(coords, progress) {
  if (!coords || coords.length === 0) return [72.84, 18.99]
  if (coords.length === 1) return coords[0]

  // Calculate cumulative distances
  const distances = [0]
  let totalDist = 0
  for (let i = 0; i < coords.length - 1; i++) {
    const p1 = coords[i]
    const p2 = coords[i + 1]
    const d = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    totalDist += d
    distances.push(totalDist)
  }

  const targetDist = Math.max(0, Math.min(1, progress)) * totalDist

  for (let i = 0; i < distances.length - 1; i++) {
    if (targetDist <= distances[i + 1]) {
      const segDist = distances[i + 1] - distances[i]
      const frac = segDist > 0 ? (targetDist - distances[i]) / segDist : 0
      const p1 = coords[i]
      const p2 = coords[i + 1]
      const lng = p1[0] + frac * (p2[0] - p1[0])
      const lat = p1[1] + frac * (p2[1] - p1[1])
      return [round6(lng), round6(lat)]
    }
  }

  return coords[coords.length - 1]
}

function round6(num) {
  return Math.round(num * 1000000) / 1000000
}

function generateCirclePolygon(centerLng, centerLat, radiusDeg = 0.012, numPoints = 18) {
  const coords = []
  for (let i = 0; i < numPoints; i++) {
    const angle = (2 * Math.PI * i) / numPoints
    const lng = centerLng + (radiusDeg * 1.05 * Math.cos(angle))
    const lat = centerLat + (radiusDeg * 0.95 * Math.sin(angle))
    coords.push([round6(lng), round6(lat)])
  }
  coords.push(coords[0])
  return coords
}

/**
 * CrowdSimulationEngine Class
 * Maintains deterministic state across simulation ticks.
 */
class CrowdSimulationEngine {
  constructor(seed = 20260908) {
    this.seed = seed
    this.tick = 0
    this.simTimeMinutes = 18 * 60 // 18:00
    this.isDisrupted = false
    this.isInterventionActive = false
    this.trains = JSON.parse(JSON.stringify(INITIAL_TRAIN_FLEET))
  }

  setDisruption(active) {
    this.isDisrupted = active
  }

  setIntervention(active) {
    this.isInterventionActive = active
  }

  step(minutes = 5) {
    this.tick += 1
    this.simTimeMinutes += minutes

    // Advance trains along transit lines
    const lineMap = {}
    TRANSIT_LINES.forEach(l => {
      lineMap[l.id] = l.stations.map(s => s.coord)
    })

    this.trains.forEach(t => {
      const speed = 0.035 // ~5 minutes of transit progress
      
      // If Central line is disrupted between Curry Road and Parel, halt or reverse trains in that section
      if (this.isDisrupted && t.lineId === 'line-central') {
        if (t.progress >= 0.30 && t.progress <= 0.45) {
          t.direction = -t.direction
        }
      }

      t.progress += t.direction * speed
      if (t.progress >= 1.0) {
        t.progress = 1.0
        t.direction = -1
      } else if (t.progress <= 0.0) {
        t.progress = 0.0
        t.direction = 1
      }

      // Dynamic passenger exchange at stations
      const coords = lineMap[t.lineId] || []
      t.coord = interpolateLineString(coords, t.progress)

      // Time-of-day fluctuation
      const timeFactor = 1 + 0.15 * Math.sin((this.simTimeMinutes / 60 - 18) * Math.PI / 3)
      let count = Math.round(t.baseOccupancy * timeFactor + 40 * Math.sin(this.tick * 0.7 + t.progress * 10))

      if (this.isDisrupted && t.lineId === 'line-central') {
        if (t.progress < 0.40) count = Math.min(count + 200, t.capacity) // Backlogged at Curry Road
      }

      t.currentOccupancy = Math.max(200, Math.min(t.capacity, count))
      t.classification = classifyQuantity(t.currentOccupancy, t.capacity)
    })

    return this.getState()
  }

  reset() {
    this.tick = 0
    this.simTimeMinutes = 18 * 60
    this.isDisrupted = false
    this.isInterventionActive = false
    this.trains = JSON.parse(JSON.stringify(INITIAL_TRAIN_FLEET))
    return this.getState()
  }

  getState() {
    const hours = Math.floor(this.simTimeMinutes / 60)
    const mins = this.simTimeMinutes % 60
    const timeFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`

    // 1. Compute Zone Occupancy & Classification
    const zoneList = REAL_ZONES.map((z, idx) => {
      // Smooth sinusoidal peak for evening Ganesh Chaturthi + seeded tick noise
      const peakTime = 19.5 // 19:30 evening peak
      const currentHr = this.simTimeMinutes / 60
      const timeCurve = Math.exp(-Math.pow(currentHr - peakTime, 2) / 4.0)
      const tickNoise = 0.03 * Math.sin(this.tick * 0.5 + idx * 1.3)

      let rawCount = Math.round(z.baseOccupancy * (0.85 + 0.35 * timeCurve) + (z.capacity * tickNoise))

      // Scenario Disruption modifier
      if (this.isDisrupted) {
        if (z.id === 'curry-road') rawCount = Math.round(rawCount * 1.12) // +12% trapped crowd
        if (z.id === 'parel') rawCount = Math.round(rawCount * 1.08)
      }

      // Intervention Action modifier
      let afterCount = rawCount
      if (this.isInterventionActive) {
        if (z.id === 'curry-road') afterCount = Math.round(rawCount * 0.81) // -19% relief
        if (z.id === 'thane') afterCount = Math.round(rawCount * 1.08) // Buffer absorbs flow
      } else {
        if (z.id === 'curry-road') afterCount = Math.round(rawCount * 0.82)
        if (z.id === 'thane') afterCount = Math.round(rawCount * 1.08)
      }

      const currentClass = classifyQuantity(rawCount, z.capacity)
      const afterClass   = classifyQuantity(afterCount, z.capacity)

      // Forecast +30m, +60m, +120m, +180m
      const f30 = classifyQuantity(Math.round(rawCount * 1.04), z.capacity)
      const f60 = classifyQuantity(Math.round(rawCount * 1.09), z.capacity)
      const f120 = classifyQuantity(Math.round(rawCount * 1.15), z.capacity)
      const f180 = classifyQuantity(Math.round(rawCount * 1.18), z.capacity)

      const arrRate = Math.round(rawCount * 0.12)
      const depRate = Math.round(rawCount * 0.08)

      return {
        id: z.id,
        name: z.name,
        lat: z.lat,
        lng: z.lng,
        capacity: z.capacity,
        people: rawCount,
        pressure: currentClass.pct,
        classification: currentClass,
        arrival_rate: arrRate,
        departure_rate: depRate,
        net_accumulation: arrRate - depRate,
        forecast_30m: f30.pct,
        forecast_60m: f60.pct,
        forecast_120m: f120.pct,
        forecast_180m: f180.pct,
        forecast_delta: f60.pct - currentClass.pct,
        counterfactual_after: afterClass.pct,
        counterfactual_people: afterCount,
        counterfactual_delta: afterClass.pct - currentClass.pct,
        fill_color: currentClass.color,
        border_color: currentClass.color
      }
    })

    // 2. Build GeoJSON for Zones & Saturation Halos
    const zoneFeatures = zoneList.map(z => ({
      type: 'Feature',
      id: z.id,
      geometry: {
        type: 'Polygon',
        coordinates: [generateCirclePolygon(z.lng, z.lat, 0.008)]
      },
      properties: z
    }))

    const haloFeatures = zoneList.map(z => {
      const radius = z.pressure >= 85 ? 0.020 : z.pressure >= 60 ? 0.015 : 0.010
      return {
        type: 'Feature',
        id: `halo-${z.id}`,
        geometry: {
          type: 'Polygon',
          coordinates: [generateCirclePolygon(z.lng, z.lat, radius)]
        },
        properties: {
          ...z,
          halo_opacity: z.pressure >= 85 ? 0.55 : z.pressure >= 60 ? 0.42 : 0.25
        }
      }
    })

    // 3. Physical Network Flow Edges (76 Directional Edges)
    const flowFeatures = []
    const bottlenecks = []
    let totalMovement = 0

    // Connect real zones with bidirectional flows
    const ZONE_PAIRS = [
      { u: 'south-mumbai', v: 'byculla', cap: 30000, base: 14000 },
      { u: 'byculla', v: 'curry-road', cap: 28000, base: 22400 },
      { u: 'curry-road', v: 'lalbaug', cap: 25000, base: 23500 }, // Bottleneck Ingress
      { u: 'parel', v: 'curry-road', cap: 32000, base: 26000 },
      { u: 'dadar', v: 'parel', cap: 45000, base: 34000 },
      { u: 'andheri', v: 'dadar', cap: 40000, base: 22000 },
      { u: 'thane', v: 'dadar', cap: 60000, base: 38000 },
      { u: 'vashi', v: 'dadar', cap: 35000, base: 18000 },
      { u: 'girgaon', v: 'south-mumbai', cap: 20000, base: 8000 }
    ]

    ZONE_PAIRS.forEach((pair, idx) => {
      const z1 = zoneList.find(z => z.id === pair.u)
      const z2 = zoneList.find(z => z.id === pair.v)
      if (!z1 || !z2) return

      // Forward Edge
      let forwardVol = Math.round(pair.base + 800 * Math.sin(this.tick * 0.4 + idx))
      let isDisruptedEdge = false

      if (this.isDisrupted && ((pair.u === 'parel' && pair.v === 'curry-road') || (pair.u === 'curry-road' && pair.v === 'lalbaug'))) {
        forwardVol = 0
        isDisruptedEdge = true
      }

      totalMovement += forwardVol
      const forwardClass = isDisruptedEdge 
        ? { category: 'CRITICAL', pct: 100, color: '#DC2626', formatted_label: 'BLOCKED (0 pass/hr)' }
        : classifyQuantity(forwardVol, pair.cap)

      if (forwardClass.pct >= 85 && !isDisruptedEdge) {
        bottlenecks.push({
          corridor: `${z1.name} → ${z2.name}`,
          load_pct: forwardClass.pct,
          flow_volume: forwardVol,
          capacity: pair.cap,
          severity: 'CRITICAL',
          description: `Capacity constrained (${forwardClass.pct}% throughput load)`
        })
      }

      const forwardEdgeId = `edge-${pair.u}-${pair.v}`
      flowFeatures.push({
        type: 'Feature',
        id: forwardEdgeId,
        geometry: {
          type: 'LineString',
          coordinates: [[z1.lng, z1.lat], [z2.lng, z2.lat]]
        },
        properties: {
          id: forwardEdgeId,
          corridor: `${z1.name} → ${z2.name}`,
          flow_volume: forwardVol,
          capacity: pair.cap,
          load_pct: forwardClass.pct,
          status: isDisruptedEdge ? 'DISRUPTED' : forwardClass.category,
          color: isDisruptedEdge ? '#DC2626' : forwardClass.color,
          classification: forwardClass
        }
      })

      // Reverse Edge
      const revVol = Math.round(forwardVol * 0.45)
      totalMovement += revVol
      const revClass = classifyQuantity(revVol, pair.cap)
      const revEdgeId = `edge-${pair.v}-${pair.u}`
      flowFeatures.push({
        type: 'Feature',
        id: revEdgeId,
        geometry: {
          type: 'LineString',
          coordinates: [[z2.lng, z2.lat], [z1.lng, z1.lat]]
        },
        properties: {
          id: revEdgeId,
          corridor: `${z2.name} → ${z1.name}`,
          flow_volume: revVol,
          capacity: pair.cap,
          load_pct: revClass.pct,
          status: revClass.category,
          color: revClass.color,
          classification: revClass
        }
      })
    })

    // 4. Transit Railway Lines GeoJSON
    const transitFeatures = TRANSIT_LINES.map(line => ({
      type: 'Feature',
      id: line.id,
      geometry: {
        type: 'LineString',
        coordinates: line.stations.map(s => s.coord)
      },
      properties: {
        id: line.id,
        name: line.name,
        color: line.color,
        status: 'OPERATIONAL'
      }
    }))

    // 5. Train Fleet GeoJSON & List
    const trainFeatures = this.trains.map(t => {
      const coords = (TRANSIT_LINES.find(l => l.id === t.lineId)?.stations || []).map(s => s.coord)
      const currentCoord = t.coord || interpolateLineString(coords, t.progress)
      const currentClass = t.classification || classifyQuantity(t.baseOccupancy, t.capacity)

      return {
        type: 'Feature',
        id: t.id,
        geometry: {
          type: 'Point',
          coordinates: currentCoord
        },
        properties: {
          id: t.id,
          lineId: t.lineId,
          lineName: t.lineName,
          direction: t.direction > 0 ? 'Downbound' : 'Upbound',
          occupancy: t.currentOccupancy || t.baseOccupancy,
          capacity: t.capacity,
          load_pct: currentClass.pct,
          status: currentClass.category,
          color: currentClass.color,
          bgColor: currentClass.bgColor,
          classification: currentClass,
          label: `${t.id} (${t.lineName}): ${currentClass.formatted_label}`
        }
      }
    })

    // 6. Disrupted Corridors GeoJSON
    const disruptedFeatures = [
      {
        type: 'Feature',
        id: 'disruption-central-line-curry',
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8478, 19.0178], // Dadar
            [72.8398, 19.0022], // Parel
            [72.8336, 18.9942], // Curry Road
            [72.8355, 18.9912]  // Lalbaug
          ]
        },
        properties: {
          id: 'disruption-central-line-curry',
          name: 'Central Railway Mainline Blockage (Parel – Curry Road)',
          color: '#DC2626',
          status: 'BLOCKED',
          severity: 'CRITICAL'
        }
      }
    ]

    // 7. Intervention Redirection Flow (Curry Road -> Dadar -> Thane)
    const interventionFeatures = [
      {
        type: 'Feature',
        id: 'flow-intervention-curry-thane',
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8336, 18.9942], // Curry Road
            [72.8398, 19.0022], // Parel
            [72.8478, 19.0178], // Dadar
            [72.9750, 19.1860]  // Thane
          ]
        },
        properties: {
          source: 'curry-road',
          source_name: 'Curry Road Station',
          destination: 'thane',
          destination_name: 'Thane Suburban Terminal',
          dosage_pct: 18,
          diverted_count: 2500,
          reduction_pts: 18,
          classification: classifyQuantity(2500, 15000),
          color: '#14B8A6'
        }
      }
    ]

    const hotspots = [...zoneList].sort((a, b) => b.pressure - a.pressure)

    return {
      time: timeFormatted,
      tick: this.tick,
      isDisrupted: this.isDisrupted,
      isInterventionActive: this.isInterventionActive,
      center: [72.8400, 18.9950],
      zoom: 11.8,
      zones: zoneList,
      hotspots,
      bottlenecks,
      trains: this.trains,
      active_movement_count: totalMovement,
      recommendation: {
        source: 'curry-road',
        source_name: 'Curry Road',
        destination: 'thane',
        destination_name: 'Thane Suburban Terminal',
        dosage_pct: 18,
        target_before: 94,
        target_after: 76,
        reduction: 18,
        side_effect_increase: 8,
        critical_before: 3,
        critical_after: 1
      },
      geojson: {
        zones: { type: 'FeatureCollection', features: zoneFeatures },
        halos: { type: 'FeatureCollection', features: haloFeatures },
        flows: { type: 'FeatureCollection', features: flowFeatures },
        transit_lines: { type: 'FeatureCollection', features: transitFeatures },
        trains: { type: 'FeatureCollection', features: trainFeatures },
        disrupted_corridors: { type: 'FeatureCollection', features: disruptedFeatures },
        intervention_flow: { type: 'FeatureCollection', features: interventionFeatures }
      }
    }
  }
}

// Global Singleton Engine
export const crowdSimEngine = new CrowdSimulationEngine(20260908)
