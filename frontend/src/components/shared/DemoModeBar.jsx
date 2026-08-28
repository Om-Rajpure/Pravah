import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, SkipForward, Clapperboard, Compass } from 'lucide-react'
import { getDemoStatus, resetDemo, nextDemoEvent } from '../../services/demoService'
import { startSimulation, pauseSimulation, stepSimulation } from '../../services/simulationService'
import JudgeTourModal from './JudgeTourModal'

const EVENT_COLORS = {
  'T00_normal':         'bg-teal-soft border-teal/40 text-teal-dark',
  'T15_rising':         'bg-warning-soft border-warning/40 text-warning-dark',
  'T30_warning':        'bg-warning-soft border-warning/50 text-warning-dark',
  'T50_recommendation': 'bg-orange-soft border-orange/40 text-orange-dark',
  'T60_disruption':     'bg-critical-bg border-critical/40 text-critical',
  'T80_recovery':       'bg-blue-soft border-blue/40 text-blue',
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
    } catch (_) { /* silently swallow */ }
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
      <div className="bg-navy text-white rounded-[14px] border border-white/10 px-4 py-3 flex flex-wrap items-center gap-3.5 shadow-elevated">
        {/* Identity */}
        <div className="flex items-center gap-2.5 min-w-fit">
          <Clapperboard className="w-4 h-4 text-orange flex-shrink-0" />
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-white/60 block leading-none">Demo Mode</span>
            <span className="text-[13px] font-bold text-white leading-none mt-0.5 block">SIMULATION</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-white/15 hidden sm:block" />

        {/* Current Event */}
        {event && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-[6px] border text-[12px] sm:text-[13px] font-semibold ${eventColor}`}>
            <span className="text-[10px] font-bold opacity-75">EVENT {idx + 1}/{total}</span>
            <span>{event.label}</span>
          </div>
        )}

        {/* Disruption / Scenario badge */}
        {demo?.active_scenario && (
          <span className="text-[11px] font-bold bg-critical/20 border border-critical/40 text-critical-soft px-2.5 py-1 rounded-[6px]">
            ⚡ {demo.active_scenario.replace(/-/g, ' ').toUpperCase()}
          </span>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sim time */}
        {demo?.simulation_time && (
          <span className="text-[13px] font-mono text-white/70 hidden md:inline">{demo.simulation_time}</span>
        )}

        {/* Guided Judge Tour Button */}
        <button
          onClick={() => setTourOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange hover:bg-orange-dark text-white rounded-[8px] text-[13px] font-bold transition-colors shadow-sm active:scale-[0.98]"
          title="Open interactive Judge Tour"
        >
          <Compass className="w-4 h-4" />
          <span>Judge Tour</span>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {simStatus === 'RUNNING' ? (
            <button
              onClick={handlePause}
              disabled={loading}
              title="Pause simulation"
              className="w-8 h-8 rounded-[6px] flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-40"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              disabled={loading}
              title="Play simulation"
              className="w-8 h-8 rounded-[6px] flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-40"
            >
              <Play className="w-4 h-4 fill-white" />
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={loading || isFinal}
            title="Skip to next event"
            className="w-8 h-8 rounded-[6px] flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-40"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            disabled={loading}
            title="Reset demo to baseline"
            className="w-8 h-8 rounded-[6px] flex items-center justify-center bg-orange/20 hover:bg-orange/40 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4 text-orange" />
          </button>
        </div>

        {/* Event description */}
        {event?.description && (
          <p className="w-full text-[12px] text-white/60 pt-1 leading-snug hidden sm:block">
            {event.description}
          </p>
        )}
      </div>

      {/* Interactive Tour Modal */}
      <JudgeTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />
    </>
  )
}
