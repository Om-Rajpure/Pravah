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
    <div className="bg-surface border border-border rounded-[14px] p-4 shadow-subtle flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3.5">
      {/* Left: Simulation Time & Context */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-blue-soft border border-blue/20 flex items-center justify-center text-blue flex-shrink-0">
          <Clock className="w-5 h-5 text-navy" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-text-secondary">Simulation Clock</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              isRunning 
                ? 'bg-teal-soft text-teal-dark border-teal/30' 
                : 'bg-surface-muted text-text-muted border-border'
            }`}>
              {status}
            </span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-0.5">
            <span className="text-[26px] sm:text-[28px] font-bold font-mono text-text-primary tracking-tight leading-none">
              {simTime}
            </span>
            <span className="text-[13px] text-text-muted font-medium">
              Ganesh Chaturthi Day 9 · Evening
            </span>
          </div>
        </div>
      </div>

      {/* Right: Active Movement Count & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
        {activeVisitors > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-surface-muted rounded-[8px] border border-border/80 text-[13px] text-text-secondary mr-1">
            <Users className="w-4 h-4 text-teal flex-shrink-0" />
            <span>Active Movement: <strong className="text-text-primary font-semibold">{activeVisitors.toLocaleString()}</strong></span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Play / Pause */}
          {isRunning ? (
            <button
              onClick={onPause}
              disabled={loading}
              aria-label="Pause Simulation"
              className="flex-1 sm:flex-initial min-h-[38px] px-4 bg-surface border border-border text-text-primary hover:bg-surface-muted active:scale-[0.98] rounded-[8px] text-[13px] sm:text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-subtle"
            >
              <Pause className="w-4 h-4 text-orange fill-orange" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={loading}
              aria-label="Run Simulation"
              className="flex-1 sm:flex-initial min-h-[38px] px-4 bg-navy text-white hover:bg-navy-dark active:scale-[0.98] rounded-[8px] text-[13px] sm:text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Run Clock</span>
            </button>
          )}

          {/* Step +5m */}
          <button
            onClick={onStep}
            disabled={loading || isRunning}
            aria-label="Advance Simulation 5 Minutes"
            className="flex-1 sm:flex-initial min-h-[38px] px-3.5 bg-surface border border-border text-text-primary hover:bg-surface-muted active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-[8px] text-[13px] sm:text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-subtle"
          >
            <FastForward className="w-4 h-4 text-text-secondary" />
            <span>+5 min</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            disabled={loading}
            aria-label="Reset to 18:00 Initial State"
            title="Reset to 18:00 Initial State"
            className="min-h-[38px] min-w-[38px] px-2.5 bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-muted active:scale-[0.98] rounded-[8px] text-[13px] font-medium flex items-center justify-center transition-all shadow-subtle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
