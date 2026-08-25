import React, { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Navigation, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import { getDestinationDetail, getRecommendation } from '../../services/visitorService'
import { MumbaiMap } from '../../components/map/MumbaiMap'

const CROWD_COLORS = {
  LOW:      { text: 'text-teal-dark',   bg: 'bg-teal-soft',   border: 'border-teal/30' },
  MODERATE: { text: 'text-warning',     bg: 'bg-warning-bg',  border: 'border-warning/40' },
  HIGH:     { text: 'text-orange-dark', bg: 'bg-orange-soft', border: 'border-orange/40' },
  CRITICAL: { text: 'text-critical',    bg: 'bg-critical-bg', border: 'border-critical/40' },
}

function CrowdBadge({ level, label, size = 'md' }) {
  const c = CROWD_COLORS[level] || CROWD_COLORS.MODERATE
  const sz = size === 'lg' 
    ? 'text-xs sm:text-sm px-3 py-1 font-bold' 
    : 'text-[10px] sm:text-[11px] px-2 py-0.5 font-bold'
  return (
    <span className={`rounded border uppercase ${sz} ${c.text} ${c.bg} ${c.border}`}>
      {label || level}
    </span>
  )
}

export default function VisitorDestination() {
  const { destinationId } = useParams()
  const [searchParams] = useSearchParams()
  const preference = searchParams.get('pref') || 'LESS_CROWDED'
  const navigate = useNavigate()

  const [detail, setDetail] = useState(null)
  const [rec, setRec] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mapRef = useRef(null)

  const loadData = () => {
    if (!destinationId) return
    setLoading(true)
    setError(null)
    Promise.all([
      getDestinationDetail(destinationId),
      getRecommendation(destinationId, preference),
    ])
      .then(([d, r]) => { 
        setDetail(d)
        setRec(r) 
      })
      .catch((err) => {
        console.error('Failed to fetch destination details:', err)
        setError('Could not load crowd conditions for this destination.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [destinationId, preference])

  // Fly map to destination coordinates when map is ready
  const handleMapReady = (map) => {
    mapRef.current = map
    if (detail && detail.lat && detail.lng) {
      map.flyTo({
        center: [detail.lng, detail.lat],
        zoom: 13.5,
        essential: true,
        duration: 800
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-xs text-text-muted gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-navy" />
        <span>Checking live crowd telemetry and predictions…</span>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="bg-surface border border-border rounded-card p-8 text-center space-y-3 max-w-md mx-auto my-10">
        <div className="w-10 h-10 rounded-full bg-critical-bg text-critical flex items-center justify-center mx-auto">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-text-primary">Destination Unavailable</h3>
        <p className="text-xs text-text-secondary">{error || 'Destination not found in registry.'}</p>
        <button
          onClick={() => navigate('/visitor')}
          className="px-4 py-2 bg-navy text-white rounded-card-sm text-xs font-semibold hover:bg-navy-dark transition-colors"
        >
          Explore All Destinations
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pt-1 pb-8">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/visitor')}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-navy transition-colors py-1 px-2 -ml-2 rounded"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Destinations</span>
        </button>

        <span className="text-[11px] text-text-muted">
          Updated: {detail.updated_at} &middot; Live
        </span>
      </div>

      {/* Main Destination Card */}
      <div className="bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle space-y-4">
        {/* Title & Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
                {detail.area}
              </span>
              {detail.category && (
                <span className="text-[10px] bg-surface-muted text-text-secondary px-1.5 py-0.2 rounded font-medium">
                  {detail.category}
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
              {detail.name}
            </h1>
            {detail.description && (
              <p className="text-xs text-text-secondary leading-snug pt-0.5 max-w-lg">
                {detail.description}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <CrowdBadge level={detail.crowd_level} label={detail.crowd_label} size="lg" />
            <span className="text-[10px] font-mono text-text-muted">
              Index: {detail.crowd_index}/100
            </span>
          </div>
        </div>

        {/* Travel Summary Bar */}
        <div className="bg-background rounded-card-sm p-3 flex flex-wrap items-center justify-between gap-3 text-xs border border-border/60">
          <div className="flex items-center gap-1.5 text-text-primary font-medium">
            <Clock className="w-3.5 h-3.5 text-navy flex-shrink-0" />
            <span>Estimated travel: <strong>{detail.travel_time_min > 0 ? `~${detail.travel_time_min} mins` : 'Central hub'}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-muted">Status:</span>
            <span className={`font-bold ${detail.travel_status === 'OPEN' ? 'text-teal' : 'text-orange-dark'}`}>
              {detail.travel_status === 'OPEN' ? 'Open & Accessible' : 'Restricted Corridor'}
            </span>
          </div>
        </div>

        {/* Active Disruption Notice */}
        {detail.disruption_notice && (
          <div className="bg-critical-bg/70 border border-critical/30 rounded-card-sm p-3.5 flex gap-2.5 text-xs animate-in fade-in duration-150">
            <AlertTriangle className="w-4 h-4 text-critical flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-critical block">
                {detail.disruption_notice.scenario_name}
              </span>
              <p className="text-text-secondary leading-snug">
                {detail.disruption_notice.message}
              </p>
            </div>
          </div>
        )}

        {/* Forecast Timeline */}
        {detail.forecast?.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] uppercase font-bold text-text-secondary tracking-wider">
                Crowd Forecast (Next 3 Hours)
              </p>
              <span className="text-[10px] text-text-muted">
                Multi-horizon residual prediction
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[{ horizon_label: 'Now', crowd_level: detail.crowd_level, trend: detail.trend }, ...detail.forecast.slice(0, 3)].map((h, i) => {
                const c = CROWD_COLORS[h.crowd_level] || CROWD_COLORS.MODERATE
                return (
                  <div 
                    key={i} 
                    className={`p-2.5 rounded-card-sm border text-center transition-all ${c.bg} ${c.border}`}
                  >
                    <span className="text-[10px] text-text-muted font-semibold block mb-0.5">
                      {h.horizon_label || 'Now'}
                    </span>
                    <span className={`text-xs font-bold block ${c.text}`}>
                      {h.crowd_level}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-bold text-text-muted mt-0.5">
                      {h.trend === 'INCREASING' && <TrendingUp className="w-3 h-3 text-critical" />}
                      {h.trend === 'EASING' && <TrendingDown className="w-3 h-3 text-teal" />}
                      {h.trend === 'STABLE' && <Minus className="w-3 h-3 text-text-muted" />}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Better Time Recommendation */}
        {detail.best_time && (
          <div className="bg-teal-soft/80 border border-teal/40 rounded-card-sm p-3.5 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-dark block mb-0.5">
                Optimal Visiting Window: {detail.best_time.horizon_label}
              </span>
              <p className="text-text-secondary leading-snug">
                {detail.best_time.message}
              </p>
            </div>
          </div>
        )}

        {/* Interactive Map Visualizer */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10.5px] uppercase font-bold text-text-secondary tracking-wider">
            Location Map
          </p>
          <div className="h-[240px] sm:h-[280px] rounded-card overflow-hidden border border-border shadow-subtle">
            <MumbaiMap 
              interactive={true} 
              onMapReady={handleMapReady}
              style={{ minHeight: '240px' }}
            />
          </div>
        </div>

        {/* Primary Route CTA */}
        <div className="pt-2">
          <Link
            to={`/visitor/route?to=${destinationId}`}
            className="w-full min-h-[48px] bg-navy text-white hover:bg-navy-dark rounded-card-sm font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Navigation className="w-4 h-4 text-orange" />
            <span>Get Transit Directions to {detail.name}</span>
          </Link>
        </div>
      </div>

      {/* Intelligence Recommendation Card (Less-Crowded Option) */}
      {rec && (
        <div className={`rounded-card border p-4 sm:p-5 shadow-subtle space-y-3.5 ${
          rec.recommendation_type === 'ALTERNATIVE'
            ? 'bg-surface border-teal/40 shadow-[0_2px_12px_rgba(45,156,143,0.12)]'
            : 'bg-surface border-border'
        }`}>
          {rec.recommendation_type === 'ALTERNATIVE' ? (
            <>
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                  <p className="text-[11px] uppercase font-extrabold text-teal-dark tracking-wider">
                    Recommended Less-Crowded Alternative
                  </p>
                </div>
                <span className="text-[10px] text-text-muted font-medium bg-teal-soft px-2 py-0.5 rounded">
                  Lower Pressure
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    {rec.name}
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {rec.area} &middot; ~{rec.travel_time_min} mins travel
                  </p>
                </div>
                <CrowdBadge level={rec.crowd_level} label={rec.crowd_label} />
              </div>

              {/* Reasons list */}
              {rec.why?.length > 0 && (
                <div className="bg-background rounded-card-sm p-3 border border-border/60 space-y-1.5">
                  <p className="text-[10.5px] uppercase font-bold text-text-secondary tracking-wider">
                    Why choose this option?
                  </p>
                  <ul className="space-y-1">
                    {rec.why.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal flex-shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => navigate(`/visitor/destination/${rec.destination_id}?pref=${preference}`)}
                  className="w-full min-h-[44px] bg-surface-muted text-text-primary hover:bg-border/60 rounded-card-sm font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-border"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <Link
                  to={`/visitor/route?to=${rec.destination_id}`}
                  className="w-full min-h-[44px] bg-teal text-white hover:bg-teal-dark rounded-card-sm font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Route to {rec.name}</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <ShieldCheck className="w-4 h-4 text-teal" />
                <p className="text-[11px] uppercase font-bold text-text-secondary tracking-wider">
                  PRAVAAH Travel Assessment
                </p>
              </div>

              {rec.why?.length > 0 && (
                <ul className="space-y-1.5">
                  {rec.why.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal flex-shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              )}

              {rec.all_areas_busy && (
                <p className="text-xs text-text-muted bg-surface-muted p-2.5 rounded-card-sm">
                  Most monitored festival zones are experiencing peak evening pressure. {detail.name} remains your most direct destination.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Public Data Governance Tag */}
      <div className="text-center pt-1">
        <p className="text-[10px] text-text-muted">
          SIMULATED &middot; Multi-horizon predictive intelligence &middot; No individual tracking
        </p>
      </div>
    </div>
  )
}
