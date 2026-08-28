import React from 'react'

export function MapLegend({ mode = 'CURRENT', horizon = 60, isAfter = false, hasDisruption = false }) {
  return (
    <div className="absolute bottom-3.5 left-3.5 z-10 bg-white/95 backdrop-blur-sm border border-border rounded-[10px] p-3 shadow-elevated text-[12px] max-w-[280px] animate-in fade-in duration-150">
      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-border/70">
        <span className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">
          {mode === 'CURRENT' && 'Crowd Flow & Saturation'}
          {mode === 'FORECAST' && `Forecast Saturation (+${horizon}m)`}
          {mode === 'NETWORK' && 'Transit & Local Trains'}
          {mode === 'DISRUPTIONS' && 'Disruption Overlay'}
          {mode === 'INTERVENTION' && 'Action Redirection Corridor'}
          {mode === 'WHAT_IF' && (isAfter ? 'Counterfactual Impact' : 'Baseline Pressure')}
        </span>
        <span className="text-[10px] font-mono text-text-muted">PRAVAAH</span>
      </div>

      {/* Quantity Classification Scale */}
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-1 text-[11px] mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] flex-shrink-0" />
          <span className="text-text-primary font-medium">Critical (≥85%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] flex-shrink-0" />
          <span className="text-text-primary font-medium">Heavy (60–85%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] flex-shrink-0" />
          <span className="text-text-primary font-medium">Moderate (40–60%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] flex-shrink-0" />
          <span className="text-text-primary font-medium">Light (20–40%)</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] flex-shrink-0" />
          <span className="text-text-primary font-medium">Sparse (0–20%)</span>
        </div>
      </div>

      {/* Mode-specific annotations */}
      {mode === 'NETWORK' && (
        <div className="space-y-1.5 text-[11px] pt-1.5 border-t border-border/60 text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span>Central Mainline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1.5 bg-[#0D9488] rounded-full" />
            <span>Western Corridor</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-primary font-semibold">
            <span className="px-1.5 py-0.5 rounded bg-navy text-white text-[9px] font-mono font-bold">12-CAR</span>
            <span>Simulated Local Trains</span>
          </div>
        </div>
      )}

      {mode === 'DISRUPTIONS' && (
        <div className="space-y-1 text-[11px] pt-1.5 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-critical font-semibold">
            <span className="w-3.5 h-1.5 bg-[#DC2626] border-dashed border-b border-white" />
            <span>⚠ Blocked Corridor (Parel–Curry Rd)</span>
          </div>
        </div>
      )}

      {mode === 'INTERVENTION' && (
        <div className="space-y-1 text-[11px] pt-1.5 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-teal font-bold">
            <span className="w-3.5 h-1.5 bg-[#0D9488] rounded" />
            <span>18% Redirection Flow (Thane Buffer)</span>
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="mt-2 pt-1.5 border-t border-border/60 text-[10px] text-text-muted flex justify-between">
        <span>Click zone or train to inspect</span>
        <span>OpenFreeMap</span>
      </div>
    </div>
  )
}
