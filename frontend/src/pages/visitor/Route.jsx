import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Train, 
  Footprints, 
  Car, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2,
  Share2,
  Compass
} from 'lucide-react'
import { getVisitorRoute, getDestinations } from '../../services/visitorService'
import { MumbaiMap } from '../../components/map/MumbaiMap'

const ORIGIN_OPTIONS = [
  { id: 'stn-dadar',      name: 'Dadar Central & Western Interchange' },
  { id: 'stn-thane',      name: 'Thane Mainline Terminal (Central Suburbs)' },
  { id: 'stn-andheri',    name: 'Andheri Western & Metro Hub' },
  { id: 'stn-vashi',      name: 'Vashi Harbour Terminal (Navi Mumbai)' },
  { id: 'stn-csmt',       name: 'CSMT Central Heritage Terminal' },
  { id: 'stn-churchgate', name: 'Churchgate Western Terminal' },
  { id: 'stn-parel',      name: 'Parel Station' },
  { id: 'stn-curry-road', name: 'Curry Road Station' },
]

export default function VisitorRoute() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialTo = searchParams.get('to') || 'lalbaugcha-raja'
  const initialFrom = searchParams.get('from') || 'stn-dadar'

  const [origin, setOrigin] = useState(initialFrom)
  const [destination, setDestination] = useState(initialTo)
  const [preferAlternative, setPreferAlternative] = useState(false)
  const [destinationsList, setDestinationsList] = useState([])
  const [routeData, setRouteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mapInstanceRef = useRef(null)

  // Fetch destination list for dropdown
  useEffect(() => {
    getDestinations()
      .then(dests => setDestinationsList(dests || []))
      .catch(console.error)
  }, [])

  // Fetch route calculation from network graph
  useEffect(() => {
    setLoading(true)
    setError(null)
    getVisitorRoute(origin, destination, preferAlternative)
      .then(res => {
        setRouteData(res)
        // Update URL query params
        setSearchParams({ from: origin, to: destination })
      })
      .catch(err => {
        console.error('Failed to compute route:', err)
        setError('Transit routing service is temporarily recalibrating. Please try another pair of stations.')
      })
      .finally(() => setLoading(false))
  }, [origin, destination, preferAlternative, setSearchParams])

  // Draw GeoJSON Route layer on map
  const handleMapReady = (map) => {
    mapInstanceRef.current = map
    updateMapRoute(map, routeData)
  }

  // Update route layer whenever route data changes
  useEffect(() => {
    if (mapInstanceRef.current && routeData) {
      updateMapRoute(mapInstanceRef.current, routeData)
    }
  }, [routeData])

  const updateMapRoute = (map, data) => {
    if (!map || !data || !data.geometry) return

    try {
      // Fit map bounds to route coordinates
      const coords = data.geometry.coordinates || []
      if (coords.length > 0) {
        let minLng = coords[0][0], maxLng = coords[0][0]
        let minLat = coords[0][1], maxLat = coords[0][1]

        coords.forEach(([lng, lat]) => {
          if (lng < minLng) minLng = lng
          if (lng > maxLng) maxLng = lng
          if (lat < minLat) minLat = lat
          if (lat > maxLat) maxLat = lat
        })

        map.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
          padding: { top: 40, bottom: 40, left: 40, right: 40 },
          maxZoom: 14,
          duration: 600,
        })
      }

      // Add or update LineString source
      const sourceId = 'visitor-route-source'
      const layerId = 'visitor-route-line'

      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(data.geometry)
      } else if (map.isStyleLoaded()) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: data.geometry
        })

        map.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': data.travel_status === 'DISRUPTED' ? '#B03A2E' : '#12315B',
            'line-width': 5,
            'line-opacity': 0.85
          }
        })
      }
    } catch (err) {
      console.warn('Map route layer render notice:', err)
    }
  }

  const getTransitIcon = (type) => {
    switch (type) {
      case 'rail': return <Train className="w-4 h-4 text-blue" />
      case 'walk': return <Footprints className="w-4 h-4 text-teal" />
      case 'road': return <Car className="w-4 h-4 text-orange" />
      default:     return <Navigation className="w-4 h-4 text-navy" />
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pt-1 pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-navy-soft text-navy flex items-center justify-center">
            <Navigation className="w-4 h-4 text-orange" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-text-primary">Transit Route & Guidance</h1>
            <p className="text-[11px] text-text-muted">Network-aware Dijkstra shortest path</p>
          </div>
        </div>

        <Link
          to="/visitor"
          className="text-xs text-navy font-semibold hover:underline"
        >
          Destinations
        </Link>
      </div>

      {/* Origin & Destination Route Selector Card */}
      <div className="bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Origin Selector */}
          <div className="space-y-1">
            <label className="text-[10.5px] uppercase font-bold text-text-secondary tracking-wider block">
              Starting From (Origin)
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2.5 rounded-card-sm border border-border bg-background text-xs sm:text-sm font-medium text-text-primary focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
            >
              {ORIGIN_OPTIONS.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          {/* Destination Selector */}
          <div className="space-y-1">
            <label className="text-[10.5px] uppercase font-bold text-text-secondary tracking-wider block">
              Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2.5 rounded-card-sm border border-border bg-background text-xs sm:text-sm font-medium text-text-primary focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
            >
              {destinationsList.map(d => (
                <option key={d.destination_id} value={d.destination_id}>{d.name} ({d.area})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Route Mode Toggle (Standard vs Congestion Bypass) */}
        <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreferAlternative(false)}
              className={`px-3 py-1.5 rounded-card-sm text-xs font-semibold transition-all ${
                !preferAlternative 
                  ? 'bg-navy text-white shadow-sm' 
                  : 'bg-surface-muted text-text-secondary hover:text-text-primary'
              }`}
            >
              Standard Direct Route
            </button>
            <button
              onClick={() => setPreferAlternative(true)}
              className={`px-3 py-1.5 rounded-card-sm text-xs font-semibold transition-all ${
                preferAlternative 
                  ? 'bg-teal text-white shadow-sm' 
                  : 'bg-surface-muted text-text-secondary hover:text-text-primary'
              }`}
            >
              Bypass Congested Bottlenecks
            </button>
          </div>

          <span className="text-[11px] text-text-muted">
            Live transit model
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-surface border border-border rounded-card p-10 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-navy" />
          <span>Computing network shortest transit path…</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-surface border border-border rounded-card p-6 text-center space-y-2">
          <AlertTriangle className="w-5 h-5 text-warning mx-auto" />
          <p className="text-xs text-text-secondary">{error}</p>
        </div>
      )}

      {/* Route Results */}
      {!loading && routeData && routeData.status === 'AVAILABLE' && (
        <>
          {/* Metrics Summary Strip */}
          <div className="bg-surface border border-border rounded-card p-4 shadow-subtle grid grid-cols-3 gap-3 text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Estimated Travel</span>
              <span className="text-lg sm:text-2xl font-extrabold text-navy leading-none">
                {routeData.total_travel_time_min} <span className="text-xs font-normal text-text-secondary">min</span>
              </span>
            </div>

            <div className="space-y-0.5 border-x border-border">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Total Distance</span>
              <span className="text-lg sm:text-2xl font-extrabold text-text-primary leading-none">
                {routeData.total_distance_km} <span className="text-xs font-normal text-text-secondary">km</span>
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Corridor Status</span>
              <span className={`text-xs sm:text-sm font-bold block pt-1 ${
                routeData.travel_status === 'OPEN' ? 'text-teal' : 'text-critical'
              }`}>
                {routeData.travel_status === 'OPEN' ? 'Normal Flow' : 'Disrupted Corridor'}
              </span>
            </div>
          </div>

          {/* Active Disruption Warning on Route */}
          {routeData.disruption_notice && (
            <div className="bg-critical-bg border border-critical/30 rounded-card p-3.5 flex gap-2.5 text-xs text-critical">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Transit Corridor Notice</strong>
                <p className="text-text-secondary leading-snug">{routeData.disruption_notice}</p>
              </div>
            </div>
          )}

          {/* Interactive Route Map */}
          <div className="bg-surface border border-border rounded-card p-3.5 shadow-subtle space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] uppercase font-bold text-text-secondary tracking-wider">
                Interactive Route Map
              </span>
              <span className="text-[10px] text-text-muted">
                {routeData.origin.name} → {routeData.destination.name}
              </span>
            </div>
            <div className="h-[260px] sm:h-[320px] rounded-card overflow-hidden border border-border">
              <MumbaiMap 
                interactive={true} 
                onMapReady={handleMapReady}
                style={{ minHeight: '260px' }}
              />
            </div>
          </div>

          {/* Step-by-Step Directions */}
          <div className="bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider">
              Step-by-Step Transit Guidance
            </h3>

            <div className="space-y-3 pt-1">
              {(Array.isArray(routeData.steps) ? routeData.steps : []).map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative pb-2 last:pb-0">
                  {/* Step icon */}
                  <div className="w-8 h-8 rounded-full bg-surface-muted border border-border flex items-center justify-center flex-shrink-0 z-10">
                    {getTransitIcon(step.transit_type)}
                  </div>

                  {/* Step details */}
                  <div className="flex-1 min-w-0 pt-0.5 space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs sm:text-sm font-semibold text-text-primary">
                        {step.instruction}
                      </p>
                      <span className="text-[11px] font-mono text-text-muted flex-shrink-0">
                        ~{step.travel_time_min}m ({step.distance_km}km)
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                      {step.transit_type} Corridor
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Unavailable Route State */}
      {!loading && routeData && routeData.status === 'UNAVAILABLE' && (
        <div className="bg-surface border border-border rounded-card p-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-warning-bg text-warning flex items-center justify-center mx-auto">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">No Direct Connected Route</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            {routeData.message || 'No direct connected path found. Try changing your starting station to Dadar or CSMT.'}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center pt-1">
        <p className="text-[10px] text-text-muted">
          Travel times calculated dynamically using topological network distances and platform transfer times
        </p>
      </div>
    </div>
  )
}
