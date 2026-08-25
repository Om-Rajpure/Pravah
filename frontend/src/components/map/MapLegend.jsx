import React from 'react'
import { TAXONOMY } from '../../services/crowdSimulationEngine'

export function MapLegend({ mode = 'CURRENT', horizon = 60, isAfter = false, hasDisruption = false }) {
  return (
    <div className="absolute bottom-3 left-3 z-10 bg-surface/95 backdrop-blur-md border border-border rounded-card p-2.5 sm:p-3 shadow-elevated text-[11px] max-w-[270px] animate-in fade-in duration-150">
      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-border/60">
        <span className="text-[10px] uppercase font-bold text-text-primary tracking-wider">
          {mode === 'CURRENT' && 'Crowd Quantity & Flow'}
          {mode === 'FORECAST' && `Forecast Saturation (+${horizon}m)`}
          {mode === 'NETWORK' && 'Transit & Local Trains'}
          {mode === 'DISRUPTIONS' && 'Disruption Overlay'}
          {mode === 'INTERVENTION' && 'Intervention Corridor'}
          {mode === 'WHAT_IF' && (isAfter ? 'Counterfactual Impact' : 'Baseline Pressure')}
        </span>
        <span className="text-[9.5px] font-mono text-text-muted">PRAVAAH</span>
      </div>

      {/* Quantity Classification Scale */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] flex-shrink-0"></span>
          <span className="text-text-primary font-medium">Critical (≥85%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] flex-shrink-0"></span>
          <span className="text-text-primary font-medium">Heavy (60–85%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] flex-shrink-0"></span>
          <span className="text-text-primary font-medium">Moderate (40–60%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] flex-shrink-0"></span>
          <span className="text-text-primary font-medium">Light (20–40%)</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] flex-shrink-0"></span>
          <span className="text-text-primary font-medium">Sparse (0–20%)</span>
        </div>
      </div>

      {/* Mode-specific annotations */}
      {mode === 'NETWORK' && (
        <div className="space-y-1 text-[10px] pt-1 border-t border-border/50 text-text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-[#2563EB] rounded-full"></span>
            <span>Central Mainline</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-[#14B8A6] rounded-full"></span>
            <span>Western Corridor</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-primary font-semibold">
            <span className="px-1 py-0.2 rounded bg-navy text-white text-[8px] font-mono font-bold">12-CAR</span>
            <span>Simulated Local Rakes</span>
          </div>
        </div>
      )}

      {mode === 'DISRUPTIONS' && (
        <div className="space-y-1 text-[10px] pt-1 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-critical font-semibold">
            <span className="w-3.5 h-1 bg-[#DC2626] border-dashed border-b border-white"></span>
            <span>⚠ Blocked (Parel–Curry Rd)</span>
          </div>
        </div>
      )}

      {mode === 'INTERVENTION' && (
        <div className="space-y-1 text-[10px] pt-1 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-teal font-bold">
            <span className="w-3.5 h-1 bg-[#14B8A6] rounded"></span>
            <span>18% Redirection Flow (Thane Buffer)</span>
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="mt-1.5 pt-1 border-t border-border/50 text-[9px] text-text-muted flex justify-between">
        <span>Click zone or train to inspect</span>
        <span>Carto Positron</span>
      </div>
    </div>
  )
}
