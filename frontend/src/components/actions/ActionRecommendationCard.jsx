import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Play
} from 'lucide-react'
import { 
  getActionRecommendations, 
  simulateAction, 
  approveAction, 
  resetActions 
} from '../../services/actionService'

export function ActionRecommendationCard({ onActionStateChange, className = '' }) {
  const [data, setData] = useState(null)
  const [simState, setSimState] = useState('RECOMMENDED') // 'RECOMMENDED', 'SIMULATED', 'ACTIVE'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchRec = async () => {
    try {
      setLoading(true)
      const res = await getActionRecommendations()
      setData(res)
      if (res.recommended_action?.status) {
        setSimState(res.recommended_action.status)
      }
    } catch (err) {
      console.error('Failed to fetch recommendation:', err)
      setError('Recommendation temporarily unavailable')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRec()
  }, [])

  const handleSimulate = async () => {
    if (!data?.recommended_action?.id) return
    try {
      setLoading(true)
      const res = await simulateAction(data.recommended_action.id)
      setData(res)
      setSimState('SIMULATED')
      if (onActionStateChange) onActionStateChange('SIMULATED', res)
    } catch (err) {
      console.error('Simulation failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!data?.recommended_action?.id) return
    try {
      setLoading(true)
      await approveAction(data.recommended_action.id)
      setSimState('ACTIVE')
      if (onActionStateChange) onActionStateChange('ACTIVE', data)
    } catch (err) {
      console.error('Approval failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    try {
      setLoading(true)
      await resetActions()
      setSimState('RECOMMENDED')
      await fetchRec()
      if (onActionStateChange) onActionStateChange('RECOMMENDED', null)
    } catch (err) {
      console.error('Reset failed:', err)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-card p-5 text-center text-text-secondary">
        <p className="text-xs">{error}</p>
        <span className="text-[11px] text-text-muted mt-1 block">PRAVAAH is using the latest observed city state.</span>
      </div>
    )
  }

  if (!data?.recommended_action) return null

  const action = data.recommended_action
  const impact = data.impact || {}
  const whyList = data.why_this_action || []

  return (
    <div className={`bg-surface border border-terracotta/40 rounded-card p-4 sm:p-5 shadow-subtle space-y-4 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-card-sm bg-terracotta/10 text-terracotta flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-terracotta-dark tracking-wider block">
              PRAVAAH Recommended Action
            </span>
            <h3 className="text-sm sm:text-base font-bold text-text-primary">
              Redirect {action.dosage_pct}% of Incoming Visitors
            </h3>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {simState === 'ACTIVE' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded bg-low/15 text-low border border-low/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Simulation Action Active
            </span>
          ) : simState === 'SIMULATED' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded bg-warning/15 text-warning-dark border border-warning/30">
              <Play className="w-3.5 h-3.5" /> Counterfactual Simulated
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded bg-terracotta-soft text-terracotta-dark border border-terracotta/30">
              <ShieldCheck className="w-3.5 h-3.5" /> High Confidence ({Math.round(action.confidence * 100)}%)
            </span>
          )}
        </div>
      </div>

      {/* Redirection Route Visual */}
      <div className="bg-surface-muted/60 p-3 rounded-card-sm border border-border/80 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary">{action.source_name}</span>
          <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
          <span className="font-semibold text-text-primary">{action.destination_name}</span>
        </div>
        <div className="text-[11px] text-text-secondary">
          Transfer: <strong className="text-text-primary font-bold">~{impact.affected_people?.toLocaleString() || 2500} visitors/h</strong>
        </div>
      </div>

      {/* Expected Impact Comparison Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Target Reduction */}
        <div className="bg-surface-muted/40 p-2.5 rounded-card-sm border border-border">
          <span className="text-[10px] uppercase font-bold text-text-muted block mb-0.5">{action.source_name}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-text-muted line-through">{impact.target_pressure_before}</span>
            <ArrowRight className="w-3 h-3 text-text-muted" />
            <span className="text-lg font-bold font-mono text-low">{impact.target_pressure_after}</span>
          </div>
          <span className="text-[10.5px] text-low font-bold flex items-center mt-0.5">
            <TrendingDown className="w-3 h-3 mr-0.5" /> -{impact.pressure_reduction} pts
          </span>
        </div>

        {/* Destination Side Effect */}
        <div className="bg-surface-muted/40 p-2.5 rounded-card-sm border border-border">
          <span className="text-[10px] uppercase font-bold text-text-muted block mb-0.5">{action.destination_name} (Buffer)</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-text-muted">{impact.destination_pressure_before}</span>
            <ArrowRight className="w-3 h-3 text-text-muted" />
            <span className="text-lg font-bold font-mono text-text-primary">{impact.destination_pressure_after}</span>
          </div>
          <span className="text-[10.5px] text-text-secondary font-medium flex items-center mt-0.5">
            <TrendingUp className="w-3 h-3 mr-0.5 text-text-muted" /> +{impact.side_effect_increase} pts (Safe)
          </span>
        </div>

        {/* City-Wide Critical Zones */}
        <div className="bg-surface-muted/40 p-2.5 rounded-card-sm border border-border">
          <span className="text-[10px] uppercase font-bold text-text-muted block mb-0.5">Critical Zones</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold font-mono text-critical line-through">{impact.critical_zones_before}</span>
            <ArrowRight className="w-3 h-3 text-text-muted" />
            <span className="text-lg font-bold font-mono text-low">{impact.critical_zones_after}</span>
          </div>
          <span className="text-[10.5px] text-low font-medium mt-0.5 block">-2 Severe bottlenecks</span>
        </div>

        {/* Optimization Score */}
        <div className="bg-surface-muted/40 p-2.5 rounded-card-sm border border-border">
          <span className="text-[10px] uppercase font-bold text-text-muted block mb-0.5">Action Score</span>
          <span className="text-lg font-bold font-mono text-text-primary">{action.score}</span>
          <span className="text-[10.5px] text-low font-bold mt-0.5 block">Optimal Dosage</span>
        </div>
      </div>

      {/* Why This Action */}
      <div className="space-y-1.5">
        <span className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider block">
          Why This Action?
        </span>
        <div className="space-y-1">
          {whyList.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11.5px] text-text-primary bg-surface-muted/30 p-2 rounded border border-border/40">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 flex-shrink-0"></span>
              <span className="leading-snug">{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What Happens If We Do Nothing Box */}
      <div className="p-3 bg-critical-bg/25 border border-critical/30 rounded-card-sm text-[11.5px] text-text-secondary leading-snug">
        <strong className="text-critical font-bold block mb-0.5">What Happens If We Do Nothing?</strong>
        {data.what_if_nothing || `Without intervention, ${action.source_name} will reach ${impact.target_pressure_before}/100 in ~2 hours with severe station platform saturation.`}
      </div>

      {/* Action Decision Controls (Touch Targets >= 44px on mobile) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-border">
        {simState === 'RECOMMENDED' && (
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="min-h-[44px] sm:min-h-[36px] px-4 bg-terracotta text-white hover:bg-terracotta-dark rounded-card-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Simulate Action</span>
          </button>
        )}

        {simState === 'SIMULATED' && (
          <>
            <button
              onClick={handleReset}
              disabled={loading}
              className="min-h-[44px] sm:min-h-[36px] px-3.5 bg-surface border border-border text-text-secondary hover:text-text-primary rounded-card-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="min-h-[44px] sm:min-h-[36px] px-4 bg-low text-white hover:bg-low/90 rounded-card-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve Action (Demo State)</span>
            </button>
          </>
        )}

        {simState === 'ACTIVE' && (
          <button
            onClick={handleReset}
            disabled={loading}
            className="min-h-[44px] sm:min-h-[36px] px-4 bg-surface border border-border text-text-secondary hover:text-text-primary rounded-card-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulation</span>
          </button>
        )}
      </div>
    </div>
  )
}
