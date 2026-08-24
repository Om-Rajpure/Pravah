import React from 'react'
import { Play, Pause, FastForward, RotateCcw, Clock, Users } from 'lucide-react'

export function SimulationBar({ 
  simTime = '18:00', 
  status = 'PAUSED', 
  activeVisitors = 0,
  onPlay, 
  onPause, 
  onStep, 
  onReset,
  loading = false
}) {
  const isRunning = status === 'RUNNING'

  return (
    <div className="bg-surface border border-border rounded-card p-3 sm:p-3.5 shadow-subtle flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
      {/* Left: Simulation Time & Context */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-card-sm bg-terracotta-soft/70 border border-terracotta/40 flex items-center justify-center text-terracotta-dark flex-shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Live Simulation Clock</span>
            <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
              isRunning ? 'bg-low/15 text-low border border-low/30' : 'bg-surface-muted text-text-muted border border-border'
            }`}>
              {status}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono text-text-primary tracking-tight">{simTime}</span>
            <span className="text-[11px] text-text-secondary">Ganesh Chaturthi Day 9</span>
          </div>
        </div>
      </div>

      {/* Center/Right: Active Moving Population & Actions */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
        {activeVisitors > 0 && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-surface-muted/60 rounded border border-border text-[11px] text-text-secondary mr-1">
            <Users className="w-3.5 h-3.5 text-slate" />
            <span>Active Moving: <strong className="text-text-primary font-semibold">{activeVisitors.toLocaleString()}</strong></span>
          </div>
        )}

        {/* Action Controls with >= 44px touch targets on mobile */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {/* Play / Pause */}
          {isRunning ? (
            <button
              onClick={onPause}
              disabled={loading}
              aria-label="Pause Simulation"
              className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-[34px] px-3.5 bg-surface border border-border text-text-primary hover:bg-surface-muted active:bg-surface-muted rounded-card-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            >
              <Pause className="w-3.5 h-3.5 text-terracotta fill-terracotta" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={loading}
              aria-label="Run Simulation"
              className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-[34px] px-3.5 bg-terracotta text-white hover:bg-terracotta-dark active:bg-terracotta-dark rounded-card-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-subtle focus:outline-none focus:ring-2 focus:ring-terracotta/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Run</span>
            </button>
          )}

          {/* Step +5m */}
          <button
            onClick={onStep}
            disabled={loading || isRunning}
            aria-label="Advance Simulation 5 Minutes"
            className="flex-1 sm:flex-initial min-h-[44px] sm:min-h-[34px] px-3 bg-surface border border-border text-text-primary hover:bg-surface-muted active:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed rounded-card-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30"
          >
            <FastForward className="w-3.5 h-3.5 text-slate" />
            <span>+5m Step</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={loading}
            aria-label="Reset Simulation to 18:00"
            title="Reset to 18:00 Initial State"
            className="flex-none min-h-[44px] min-w-[44px] sm:min-h-[34px] sm:min-w-[34px] px-2 bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-muted active:bg-surface-muted rounded-card-sm text-xs font-medium flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-terracotta/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
