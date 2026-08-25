import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, ArrowRight, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react'
import { getDestinationDetail, getRecommendation } from '../../services/visitorService'

const CROWD_COLORS = {
  LOW:      { text: 'text-low',      bg: 'bg-low/10',      border: 'border-low/30' },
  MODERATE: { text: 'text-warning-dark', bg: 'bg-warning/10', border: 'border-warning/30' },
  HIGH:     { text: 'text-critical', bg: 'bg-critical/10', border: 'border-critical/30' },
  CRITICAL: { text: 'text-critical', bg: 'bg-critical/20', border: 'border-critical/50' },
}

function CrowdBadge({ level, label, size = 'md' }) {
  const c = CROWD_COLORS[level] || CROWD_COLORS.MODERATE
  const sz = size === 'lg' ? 'text-sm px-3 py-1 font-bold' : 'text-[10.5px] px-2 py-0.5 font-bold'
  return (
    <span className={`rounded border ${sz} ${c.text} ${c.bg} ${c.border}`}>
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

  useEffect(() => {
    if (!destinationId) return
    setLoading(true)
    Promise.all([
      getDestinationDetail(destinationId),
      getRecommendation(destinationId, preference),
    ])
      .then(([d, r]) => { setDetail(d); setRec(r) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [destinationId, preference])

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-sm text-text-muted">
      <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading crowd conditions…
    </div>
  )

  if (!detail) return (
    <div className="text-center py-16 text-sm text-text-muted">Destination not found.</div>
  )

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto w-full pt-1">
      {/* Back */}
      <button
        onClick={() => navigate('/visitor')}
        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      {/* Destination Header */}
      <div className="bg-surface border border-border rounded-card p-4 sm:p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-1">
              {detail.status}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">{detail.name}</h1>
          </div>
          <CrowdBadge level={detail.crowd_level} label={detail.crowd_label} size="lg" />
        </div>

        {/* Travel Time */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-secondary">
            <Clock className="w-3.5 h-3.5 inline mr-1" />
            {detail.travel_time_min > 0 ? `~${detail.travel_time_min} min travel` : 'Festival destination'}
          </span>
          <span className={`text-xs font-semibold ${detail.travel_status === 'OPEN' ? 'text-low' : 'text-critical'}`}>
            {detail.travel_status}
          </span>
        </div>

        {/* Disruption Notice */}
        {detail.disruption_notice && (
          <div className="bg-warning/10 border border-warning/30 rounded-card-sm p-3 flex gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-warning-dark flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-warning-dark block">{detail.disruption_notice.scenario_name}</span>
              <span className="text-text-secondary">{detail.disruption_notice.message}</span>
            </div>
          </div>
        )}

        {/* Forecast Table */}
        {detail.forecast?.length > 0 && (
          <div>
            <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-2">Expected Crowd</p>
            <div className="grid grid-cols-4 gap-1.5">
              {[{ horizon_label: 'Now', crowd_level: detail.crowd_level }, ...detail.forecast.slice(0, 3)].map((h, i) => (
                <div key={i} className={`p-2 rounded border text-center ${CROWD_COLORS[h.crowd_level]?.bg || 'bg-surface-muted'} ${CROWD_COLORS[h.crowd_level]?.border || 'border-border'}`}>
                  <span className="text-[9px] text-text-muted block">{h.horizon_label || 'Now'}</span>
                  <span className={`text-[10.5px] font-bold ${CROWD_COLORS[h.crowd_level]?.text || 'text-text-primary'}`}>
                    {h.crowd_level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Time */}
        {detail.best_time && (
          <div className="bg-low/10 border border-low/30 rounded-card-sm p-3 text-xs">
            <span className="font-bold text-low block mb-0.5">
              Better time to visit: {detail.best_time.horizon_label}
            </span>
            <span className="text-text-secondary">{detail.best_time.message}</span>
          </div>
        )}
      </div>

      {/* Recommendation Card */}
      {rec && (
        <div className={`rounded-card border p-4 sm:p-5 space-y-3 ${
          rec.recommendation_type === 'ALTERNATIVE'
            ? 'bg-surface border-low/30'
            : 'bg-surface border-border'
        }`}>
          {rec.recommendation_type === 'ALTERNATIVE' ? (
            <>
              <div>
                <p className="text-[10px] uppercase font-bold text-low tracking-wider mb-1">
                  Better Option Nearby
                </p>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-text-primary">{rec.name}</h2>
                  <CrowdBadge level={rec.crowd_level} label={rec.crowd_label} />
                </div>
                {rec.travel_time_min > 0 && (
                  <p className="text-xs text-text-secondary mt-0.5">
                    ~{rec.travel_time_min} min away
                  </p>
                )}
              </div>

              {/* Why */}
              {rec.why?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1.5">Why this option?</p>
                  <ul className="space-y-1">
                    {rec.why.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-low flex-shrink-0 mt-0.5" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => navigate(`/visitor/destination/${rec.destination_id}?pref=${preference}`)}
                className="w-full min-h-[48px] bg-low text-white hover:opacity-90 rounded-card-sm font-semibold text-sm flex items-center justify-center gap-2 transition-opacity"
              >
                View {rec.name} <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1">
                PRAVAAH Guidance
              </p>
              {rec.why?.length > 0 && (
                <ul className="space-y-1">
                  {rec.why.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-low flex-shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              )}
              {rec.all_areas_busy && (
                <p className="text-xs text-text-muted">
                  Most nearby areas are currently busy. This remains the closest available option.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Data Label */}
      <p className="text-center text-[10px] text-text-muted pb-4">
        {detail.data_label} · Updated {detail.updated_at}
      </p>
    </div>
  )
}
