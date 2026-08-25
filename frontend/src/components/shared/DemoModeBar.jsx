import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, SkipForward, Clapperboard, Compass } from 'lucide-react'
import { getDemoStatus, resetDemo, nextDemoEvent } from '../../services/demoService'
import { startSimulation, pauseSimulation, stepSimulation } from '../../services/simulationService'
import JudgeTourModal from './JudgeTourModal'

const EVENT_COLORS = {
  'T00_normal':         'bg-low/10 border-low/30 text-low',
  'T15_rising':         'bg-warning/10 border-warning/30 text-warning-dark',
  'T30_warning':        'bg-warning/20 border-warning/50 text-warning-dark',
  'T50_recommendation': 'bg-terracotta/10 border-terracotta/30 text-terracotta-dark',
  'T60_disruption':     'bg-critical/10 border-critical/30 text-critical',
  'T80_recovery':       'bg-slate/10 border-slate/30 text-slate',
}

export function DemoModeBar({ onReset }) {
  const [demo, setDemo] = useState(null)
  const [simStatus, setSimStatus] = useState('PAUSED')
  const [loading, setLoading] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)

  const refresh = async () => {
    try {
      const d = await getDemoStatus()
      setDemo(d)
      setSimStatus(d.simulation_status || 'PAUSED')
    } catch (_) { /* silently swallow — demo bar is non-blocking */ }
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleReset = async () => {
    setLoading(true)
    try {
      await resetDemo()
      setSimStatus('PAUSED')
      await refresh()
      if (onReset) onReset()
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleNext = async () => {
    setLoading(true)
    try {
      await nextDemoEvent()
      await refresh()
      if (onReset) onReset()
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handlePlay = async () => {
    setLoading(true)
    try {
      await startSimulation()
      setSimStatus('RUNNING')
      await refresh()
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handlePause = async () => {
    setLoading(true)
    try {
      await pauseSimulation()
      setSimStatus('PAUSED')
      await refresh()
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const event = demo?.current_event
  const eventColor = EVENT_COLORS[event?.id] || 'bg-surface border-border text-text-secondary'
  const isFinal = demo?.is_final_event
  const idx = demo?.current_event_index ?? 0
  const total = demo?.total_events ?? 6

  return (
    <>
      <div className="bg-graphite text-white rounded-card border border-navy-light/20 px-3 sm:px-4 py-2.5 flex flex-wrap items-center gap-3 shadow-elevated">
        {/* Identity */}
        <div className="flex items-center gap-2 min-w-fit">
          <Clapperboard className="w-4 h-4 text-orange flex-shrink-0" />
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/50 block leading-none">Demo Mode</span>
            <span className="text-[12px] font-bold text-white leading-none">SIMULATION</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 hidden sm:block" />

        {/* Current Event */}
        {event && (
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded border text-[11px] font-bold ${eventColor}`}>
            <span className="text-[9px] font-bold opacity-70">EVENT {idx + 1}/{total}</span>
            <span>{event.label}</span>
          </div>
        )}

        {/* Disruption / Scenario badge */}
        {demo?.active_scenario && (
          <span className="text-[10px] font-bold bg-critical/10 border border-critical/30 text-critical px-2 py-0.5 rounded">
            ⚡ {demo.active_scenario.replace(/-/g, ' ').toUpperCase()}
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sim time */}
        {demo?.simulation_time && (
          <span className="text-[11px] font-mono text-white/55 hidden md:inline">{demo.simulation_time}</span>
        )}

        {/* Guided Judge Tour Button */}
        <button
          onClick={() => setTourOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-orange hover:bg-orange-dark text-white rounded text-xs font-bold transition-colors shadow-sm"
          title="Open interactive Judge Tour"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Judge Tour</span>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          {simStatus === 'RUNNING' ? (
            <button
              onClick={handlePause}
              disabled={loading}
              title="Pause simulation"
              className="w-7 h-7 rounded flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-40"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              disabled={loading}
              title="Play simulation"
              className="w-7 h-7 rounded flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-40"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={loading || isFinal}
            title="Skip to next event"
            className="w-7 h-7 rounded flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-40"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            title="Reset demo to baseline"
            className="w-7 h-7 rounded flex items-center justify-center bg-orange/20 hover:bg-orange/40 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5 text-orange-light" />
          </button>
        </div>

        {/* Event description */}
        {event?.description && (
          <p className="w-full text-[10px] text-white/45 pt-0.5 leading-snug hidden sm:block">
            {event.description}
          </p>
        )}
      </div>

      {/* Interactive Tour Modal */}
      <JudgeTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  )
}
