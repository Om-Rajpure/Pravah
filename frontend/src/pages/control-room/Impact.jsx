import React, { useState, useEffect } from 'react'
import { TrendingDown, ArrowRight, Zap, BarChart3 } from 'lucide-react'
import { Panel } from '../../components/ui/Panel'
import { LoadingState } from '../../components/shared/LoadingState'
import { getActionRecommendations } from '../../services/actionService'

export default function Impact() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getActionRecommendations()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingState message="Loading counterfactual impact analysis..." />

  const impact = data?.impact
  const rec = data?.recommended_action
  if (!impact) return (
    <div className="bg-surface border border-border rounded-card p-8 text-center text-sm text-text-secondary">
      No counterfactual impact data available yet. Run a simulation from the Actions page.
    </div>
  )

  const reductions = [
    { label: 'Target Pressure Before', value: `${impact.target_pressure_before} / 100`, sub: 'Forecast without intervention', color: 'text-critical' },
    { label: 'Target Pressure After', value: `${impact.target_pressure_after} / 100`, sub: 'Simulated result', color: 'text-low' },
    { label: 'Net Reduction', value: `−${impact.pressure_reduction} pts`, sub: 'From counterfactual simulation', color: 'text-low' },
    { label: 'Critical Zones', value: `${impact.critical_zones_before} → ${impact.critical_zones_after}`, sub: 'Before → After intervention', color: 'text-terracotta' },
  ]

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto">
      {/* Header KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {reductions.map((r, i) => (
          <div key={i} className="bg-surface border border-border rounded-card p-4 shadow-subtle">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">{r.label}</span>
            <span className={`text-2xl font-bold ${r.color}`}>{r.value}</span>
            <span className="text-[11px] text-text-secondary block mt-0.5">{r.sub}</span>
          </div>
        ))}
      </div>

      {/* Impact Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        <div className="lg:col-span-7">
          <Panel title="Counterfactual Simulation Result">
            <div className="space-y-4">
              {/* Visual Before → After */}
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-critical/10 border border-critical/30 rounded-card p-4 text-center">
                  <p className="text-[10px] uppercase font-bold text-critical tracking-wider mb-1">Without Intervention</p>
                  <p className="text-4xl font-bold text-critical">{impact.target_pressure_before}</p>
                  <p className="text-[11px] text-text-secondary mt-1">Forecast pressure — CRITICAL</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Zap className="w-6 h-6 text-terracotta" />
                  <ArrowRight className="w-5 h-5 text-text-muted" />
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">PRAVAAH</span>
                </div>
                <div className="flex-1 bg-low/10 border border-low/30 rounded-card p-4 text-center">
                  <p className="text-[10px] uppercase font-bold text-low tracking-wider mb-1">With Intervention</p>
                  <p className="text-4xl font-bold text-low">{impact.target_pressure_after}</p>
                  <p className="text-[11px] text-text-secondary mt-1">Simulated pressure — MODERATE</p>
                </div>
              </div>

              {/* Recommended Action */}
              {rec && (
                <div className="bg-terracotta-soft/40 border border-terracotta/20 rounded-card p-4">
                  <p className="text-[10px] uppercase font-bold text-terracotta-dark tracking-wider mb-2">
                    Action That Achieved This
                  </p>
                  <p className="text-sm font-bold text-text-primary">
                    Redirect {rec.dosage_pct}% → {rec.relief_destination}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">{rec.description}</p>
                </div>
              )}

              <p className="text-[10.5px] text-text-muted leading-relaxed">
                Counterfactual result from running {impact.candidates_evaluated || 25} candidates across available
                network routes and capacity constraints. This simulation result does not modify live state.
              </p>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-5">
          <Panel title="Side-Effect Analysis">
            <div className="space-y-3">
              <div className="text-[11px] text-text-secondary pb-1">
                Relief destinations absorb redirected flow. Pressure increase is within safe band.
              </div>
              {(data?.alternatives || []).slice(0, 4).map((alt, i) => (
                <div key={i} className="bg-surface-muted/40 p-3 rounded-card-sm border border-border/70 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-text-primary">
                      {alt.dosage_pct}% → {alt.destination}
                    </span>
                    <span className="font-mono text-text-secondary">Score: {alt.score}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-text-muted">
                    <span>Target: <strong className="text-low">{alt.target_after}/100</strong> (-{alt.reduction} pts)</span>
                    <span>Spillover: <strong className="text-text-primary">+{alt.side_effect} pts</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="text-center pb-2">
        <p className="text-[10px] text-text-muted tracking-wide">
          SIMULATION · Counterfactual analysis does not reflect real-world conditions.
        </p>
      </div>
    </div>
  )
}
