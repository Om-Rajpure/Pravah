import React from 'react'
import { ArrowRight, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'

export function ScenarioScorecard({ simulationResult }) {
  if (!simulationResult || !simulationResult.scorecard) return null

  const { scorecard = [], summary = {}, scenario_name = 'Disruption' } = simulationResult

  return (
    <div className="bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
            Counterfactual Impact Scorecard
          </span>
          <h3 className="text-sm sm:text-base font-bold text-text-primary">
            3-Way Comparison: Normal vs {scenario_name} vs + PRAVAAH Response
          </h3>
        </div>
      </div>

      {/* 3-Way Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-surface-muted/40 p-2.5 sm:p-3 rounded-card-sm border border-border">
          <span className="text-[10px] uppercase font-bold text-text-muted block mb-0.5">1. Normal Baseline</span>
          <span className="text-xl font-bold font-mono text-text-primary">{summary.critical_zones_baseline || 1}</span>
          <span className="text-[10.5px] text-text-secondary block mt-0.5">Critical zone</span>
        </div>

        <div className="bg-critical-bg/20 p-2.5 sm:p-3 rounded-card-sm border border-critical/40">
          <span className="text-[10px] uppercase font-bold text-critical block mb-0.5">2. Disruption State</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-critical">{summary.critical_zones_disruption || 3}</span>
            <span className="text-[10.5px] font-bold text-critical flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2 Overloaded
            </span>
          </div>
          <span className="text-[10.5px] text-text-secondary block mt-0.5">Unmitigated flow</span>
        </div>

        <div className="bg-low/10 p-2.5 sm:p-3 rounded-card-sm border border-low/30">
          <span className="text-[10px] uppercase font-bold text-low block mb-0.5">3. + PRAVAAH Action</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-low">{summary.critical_zones_action || 1}</span>
            <span className="text-[10.5px] font-bold text-low flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -2 Mitigated
            </span>
          </div>
          <span className="text-[10.5px] text-text-secondary block mt-0.5">Restored to safe band</span>
        </div>
      </div>

      {/* 3-Way Comparative Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border bg-surface-muted/60 text-text-secondary">
              <th className="py-2.5 px-3 font-semibold">Corridor Zone</th>
              <th className="py-2.5 px-3 font-semibold text-right">1. Baseline</th>
              <th className="py-2.5 px-3 font-semibold text-right">2. Disrupted</th>
              <th className="py-2.5 px-3 font-semibold text-right">3. + PRAVAAH</th>
              <th className="py-2.5 px-3 font-semibold">Post-Action Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {scorecard.map((row) => (
              <tr key={row.zone_id} className="hover:bg-surface-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-text-primary">{row.zone_name}</td>
                <td className="py-2.5 px-3 text-right font-mono text-text-muted">{row.baseline_pressure}</td>
                <td className="py-2.5 px-3 text-right font-mono font-semibold text-critical">
                  {row.disruption_pressure}
                  <span className="text-[10px] ml-1 opacity-80">(+{row.disruption_delta})</span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-low">
                  {row.action_pressure}
                  <span className="text-[10px] ml-1 opacity-80">({row.action_delta})</span>
                </td>
                <td className="py-2.5 px-3">
                  <StatusBadge status={row.status_action} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
