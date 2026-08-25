/**
 * ScenarioDemo — Interactive What-If scenario demonstration for the landing page.
 * Shows the Curry Road disruption scenario using deterministic demo data.
 */
import React, { useState } from 'react'
import { AlertTriangle, Play, RotateCcw, ArrowRight, TrendingUp, Zap } from 'lucide-react'

const SCENARIO_BASE = {
  name: 'Curry Road Station Closure',
  trigger: 'Curry Road rail access becomes unavailable due to overcrowding emergency protocol.',
}

const STAGES_IDLE = {
  title: 'What if Curry Road closes?',
  description: 'Select a scenario to model what happens when a key transit node becomes unavailable during peak crowd movement.',
  zones: [
    { name: 'Curry Road', pressure: 94, label: 'CRITICAL', color: '#B03A2E', note: 'Origin of disruption' },
    { name: 'Lalbaug Raja', pressure: 88, label: 'CRITICAL', color: '#B03A2E', note: 'Primary destination' },
    { name: 'Parel Junction', pressure: 72, label: 'HIGH', color: '#E69A2E', note: 'Feeder node' },
    { name: 'Dadar', pressure: 68, label: 'HIGH', color: '#E69A2E', note: 'Buffer zone' },
  ],
}

const STAGES_RUNNING = [
  {
    phase: 'disruption',
    label: 'Disruption Detected',
    color: '#B03A2E',
    zones: [
      { name: 'Curry Road', pressure: 100, label: 'CLOSED', color: '#B03A2E', note: 'Closure triggered' },
      { name: 'Lalbaug Raja', pressure: 92, label: 'CRITICAL', color: '#B03A2E', note: 'Demand unredirected' },
      { name: 'Parel Junction', pressure: 86, label: 'CRITICAL', color: '#B03A2E', note: 'Backpressure rising' },
      { name: 'Dadar', pressure: 79, label: 'HIGH', color: '#E69A2E', note: 'Overflow absorbing' },
    ],
    message: 'Curry Road closure triggers immediate demand displacement. 23,000 visitors redirecting spontaneously — pressure cascading to Parel and Lalbaug approach.',
  },
  {
    phase: 'propagation',
    label: 'Network Pressure Propagating',
    color: '#E69A2E',
    zones: [
      { name: 'Curry Road', pressure: 100, label: 'CLOSED', color: '#B03A2E', note: 'Closure active' },
      { name: 'Lalbaug Raja', pressure: 96, label: 'CRITICAL', color: '#B03A2E', note: 'Approaching threshold' },
      { name: 'Parel Junction', pressure: 91, label: 'CRITICAL', color: '#B03A2E', note: 'Secondary hotspot forming' },
      { name: 'Dadar', pressure: 84, label: 'CRITICAL', color: '#B03A2E', note: 'Now also critical' },
    ],
    message: 'Without intervention: Lalbaug, Parel and Dadar all reach critical within 12 minutes. A 1-node failure has created a 3-node cascade. PRAVAAH has identified the optimal intervention.',
  },
  {
    phase: 'intervention',
    label: 'PRAVAAH Intervention Applied',
    color: '#2468B8',
    zones: [
      { name: 'Curry Road', pressure: 100, label: 'CLOSED', color: '#B03A2E', note: 'Closure active' },
      { name: 'Lalbaug Raja', pressure: 79, label: 'HIGH', color: '#E69A2E', note: 'Pressure reducing' },
      { name: 'Parel Junction', pressure: 71, label: 'HIGH', color: '#E69A2E', note: 'Stabilising' },
      { name: 'Dadar', pressure: 65, label: 'MODERATE', color: '#B8893D', note: 'Buffer effective' },
    ],
    message: 'Intervention: Activate Byculla–Lalbaug pedestrian corridor. Redirect 31% of displaced Curry Road traffic via Parel alternate entry. Network pressure falls across all affected nodes within 8 minutes.',
    action: 'Activate Byculla–Lalbaug Corridor + Parel Alternate Entry',
  },
]

export function ScenarioDemo() {
  const [phase, setPhase] = useState('idle') // 'idle' | 0 | 1 | 2
  const [running, setRunning] = useState(false)

  const runScenario = async () => {
    setRunning(true)
    setPhase(0)
    await new Promise(r => setTimeout(r, 1800))
    setPhase(1)
    await new Promise(r => setTimeout(r, 1800))
    setPhase(2)
    setRunning(false)
  }

  const reset = () => { setPhase('idle'); setRunning(false) }

  const current = phase === 'idle' ? null : STAGES_RUNNING[phase]
  const zones = phase === 'idle' ? STAGES_IDLE.zones : current?.zones

  return (
    <div className="bg-white border border-[#DDD8CF] rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#DDD8CF] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-[#B03A2E]" />
            <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#B03A2E]">WHAT-IF SCENARIO</span>
          </div>
          <h3 className="text-base font-bold text-[#17212B]">{SCENARIO_BASE.name}</h3>
          <p className="text-xs text-[#7A8591] mt-0.5">{SCENARIO_BASE.trigger}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {phase !== 'idle' && (
            <button
              onClick={reset}
              disabled={running}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#4D5963] border border-[#DDD8CF] rounded-lg hover:bg-[#F5F3EE] transition-colors disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
          <button
            onClick={runScenario}
            disabled={running}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              phase === 'idle'
                ? 'bg-[#12315B] text-white hover:bg-[#0B2342]'
                : running
                ? 'bg-[#12315B]/60 text-white cursor-wait'
                : 'bg-[#2D9C8F] text-white hover:bg-[#237A6F]'
            }`}
          >
            {running ? (
              <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Running…</>
            ) : phase === 'idle' ? (
              <><Play className="w-3 h-3 fill-white" /> Run Scenario</>
            ) : (
              <><Play className="w-3 h-3 fill-white" /> Re-run</>
            )}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {phase !== 'idle' && (
        <div className="flex border-b border-[#DDD8CF]">
          {STAGES_RUNNING.map((s, i) => (
            <div
              key={i}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[9.5px] font-bold transition-all ${
                i <= phase
                  ? 'text-white'
                  : 'text-[#7A8591] bg-[#F5F3EE]'
              }`}
              style={i <= phase ? { backgroundColor: s.color } : {}}
            >
              <span>{i + 1}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Zone grid */}
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {zones?.map((z, i) => (
            <div key={i} className={`rounded-lg p-3 border transition-all duration-500 ${
              z.label === 'CLOSED' ? 'bg-[#F5E4E2] border-[#B03A2E]/40' :
              z.label === 'CRITICAL' ? 'bg-[#FEF2F2] border-[#B03A2E]/20' :
              z.label === 'HIGH' ? 'bg-[#FDF3E3] border-[#E69A2E]/20' :
              'bg-[#F5F3EE] border-[#DDD8CF]'
            }`}>
              <p className="text-[9.5px] font-semibold text-[#4D5963] truncate mb-1">{z.name}</p>
              <p className="text-xl font-black tabular-nums leading-none mb-1" style={{ color: z.color }}>
                {z.label === 'CLOSED' ? '✕' : z.pressure}
              </p>
              <p className="text-[8.5px] font-bold uppercase tracking-wide" style={{ color: z.color }}>{z.label}</p>
              <p className="text-[8px] text-[#7A8591] mt-1 leading-tight">{z.note}</p>
            </div>
          ))}
        </div>

        {/* Message */}
        {phase === 'idle' ? (
          <div className="bg-[#F5F3EE] rounded-lg p-4 text-center">
            <p className="text-sm text-[#4D5963]">{STAGES_IDLE.description}</p>
            <p className="text-xs text-[#7A8591] mt-1">Uses deterministic city model — Ganesh Chaturthi 2026 Day 9 · 18:00</p>
          </div>
        ) : (
          <div className={`rounded-lg p-4 border-l-4 transition-all duration-300 ${
            phase === 2 ? 'bg-[#E4F4F2] border-[#2D9C8F]' :
            phase === 1 ? 'bg-[#FDF3E3] border-[#E69A2E]' :
            'bg-[#F5E4E2] border-[#B03A2E]'
          }`}>
            {current?.action && (
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-[#2D9C8F]" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#2D9C8F]">PRAVAAH Action</span>
                <span className="text-xs font-semibold text-[#237A6F]">{current.action}</span>
              </div>
            )}
            <p className="text-sm text-[#17212B] leading-relaxed">{current?.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}