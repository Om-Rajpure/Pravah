import React, { useState, useEffect } from 'react'
import { History, GitCommit, CheckCircle2, Clock, Filter } from 'lucide-react'
import { getAuditTrail } from '../../services/explainabilityService'

export function DecisionAuditTimeline({ className = '' }) {
  const [events, setEvents] = useState([])
  const [filterType, setFilterType] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const fetchAudit = async () => {
    try {
      setLoading(true)
      const data = await getAuditTrail(filterType)
      setEvents(data)
    } catch (err) {
      console.error('Failed to load audit trail:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAudit()
  }, [filterType])

  const getEventBadge = (type) => {
    switch (type) {
      case 'PREDICTION_CREATED':
        return 'bg-slate/10 text-slate border-slate/30'
      case 'ACTION_RECOMMENDED':
        return 'bg-terracotta/10 text-terracotta border-terracotta/30'
      case 'ACTION_SIMULATED':
        return 'bg-warning/10 text-warning-dark border-warning/30'
      case 'SCENARIO_ACTIVATED':
        return 'bg-critical/10 text-critical border-critical/30'
      default:
        return 'bg-low/10 text-low border-low/30'
    }
  }

  return (
    <div className={`bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle space-y-3.5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-terracotta" />
          <h3 className="text-sm font-bold text-text-primary">Decision Lineage & Audit Trail</h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {['ALL', 'ACTION_RECOMMENDED', 'PREDICTION_CREATED', 'ACTION_SIMULATED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition-colors ${
                filterType === f
                  ? 'bg-text-primary text-surface'
                  : 'bg-surface-muted text-text-muted hover:text-text-primary'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological Event Stream */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {events.map((ev) => (
          <div key={ev.event_id} className="bg-surface-muted/30 p-2.5 rounded-card-sm border border-border/70 text-xs space-y-1">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className={`text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded border ${getEventBadge(ev.event_type)}`}>
                {ev.event_type.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                <Clock className="w-3 h-3 inline" /> {ev.simulation_time} ({ev.timestamp})
              </span>
            </div>

            <p className="font-semibold text-text-primary leading-tight">{ev.summary}</p>
            <p className="text-[11px] text-text-secondary leading-snug">{ev.reason}</p>

            <div className="flex items-center gap-2 pt-0.5 text-[10px] font-mono text-text-muted">
              <span>ID: {ev.decision_id}</span>
              {ev.parent_decision_id && (
                <span>Lineage: &larr; {ev.parent_decision_id}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
