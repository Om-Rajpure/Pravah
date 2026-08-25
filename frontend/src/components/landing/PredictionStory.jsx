/**
 * PredictionStory — Scroll/tab-driven product narrative showing the PRAVAAH loop.
 * Uses deterministic data that mirrors the actual backend output.
 */
import React, { useState } from 'react'
import { TrendingUp, Zap, BarChart3, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'

const STAGES = [
  {
    id: 'current',
    label: '01 · Current',
    icon: AlertTriangle,
    title: 'Pressure is building',
    subtitle: 'OBSERVE',
    color: '#B03A2E',
    bgColor: '#F5E4E2',
    borderColor: '#B03A2E',
    facts: [
      { label: 'Curry Road Pressure', value: '94 / 100', status: 'CRITICAL' },
      { label: 'Lalbaug Raja Core', value: '88 / 100', status: 'CRITICAL' },
      { label: 'Parel Junction', value: '72 / 100', status: 'HIGH' },
      { label: 'Active Moving', value: '163K', status: null },
    ],
    narrative: 'Curry Road station is accumulating crowd beyond safe capacity. Pedestrian velocity at the footbridge has dropped to 0.4 m/s. Left unmanaged, this will cascade upstream within 10 minutes.',
  },
  {
    id: 'forecast',
    label: '02 · Forecast',
    icon: TrendingUp,
    title: 'What happens next',
    subtitle: 'PREDICT',
    color: '#E69A2E',
    bgColor: '#FDF3E3',
    borderColor: '#E69A2E',
    facts: [
      { label: 'Curry Road in 30 min', value: '→ 98 / 100', status: 'CRITICAL' },
      { label: 'Parel in 30 min', value: '→ 83 / 100', status: 'CRITICAL' },
      { label: 'Dadar in 30 min', value: '→ 74 / 100', status: 'HIGH' },
      { label: 'Confidence', value: '91%', status: null },
    ],
    narrative: 'Without intervention, PRAVAAH forecasts Curry Road reaches critical saturation in 8 minutes. Pressure propagates north to Parel and Dadar as crowd seeks alternate routes, creating a network-wide cascade.',
  },
  {
    id: 'action',
    label: '03 · Intervention',
    icon: Zap,
    title: 'Evaluate the response',
    subtitle: 'ORCHESTRATE',
    color: '#2468B8',
    bgColor: '#E6EEF8',
    borderColor: '#2468B8',
    facts: [
      { label: 'Action', value: 'Redirect 18% of inbound flow', status: null },
      { label: 'Via', value: 'Thane + Vashi corridors', status: null },
      { label: 'Type', value: 'Information + signage', status: null },
      { label: 'Simulated impact', value: '−18 pts pressure', status: null },
    ],
    narrative: 'PRAVAAH evaluates all feasible interventions and selects: redirect 18% of inbound suburban flow toward Thane and Vashi buffer corridors using information boards and mobile alerts. No hard closures required.',
  },
  {
    id: 'result',
    label: '04 · Impact',
    icon: CheckCircle2,
    title: 'Pressure redistributed',
    subtitle: 'BALANCE',
    color: '#2D9C8F',
    bgColor: '#E4F4F2',
    borderColor: '#2D9C8F',
    facts: [
      { label: 'Curry Road After', value: '76 / 100', status: 'HIGH' },
      { label: 'Critical Zones', value: '3 → 1', status: null },
      { label: 'Flow redistributed', value: '+29K via Thane', status: null },
      { label: 'Network pressure', value: '87 → 74', status: null },
    ],
    narrative: 'Post-intervention simulation confirms: Curry Road pressure drops from 94 to 76. Critical zone count falls from 3 to 1. The network reaches a stable state. PRAVAAH continues monitoring for secondary pressure points.',
  },
]

function statusBadge(s) {
  if (!s) return null
  const colors = {
    CRITICAL: 'bg-[#F5E4E2] text-[#B03A2E] border border-[#B03A2E]/30',
    HIGH: 'bg-[#FDF3E3] text-[#C87524] border border-[#E69A2E]/30',
    MODERATE: 'bg-[#FAF2E4] text-[#B8893D] border border-[#B8893D]/30',
  }
  return <span className={`text-[8.5px] font-bold uppercase px-1.5 py-0.5 rounded ${colors[s] || ''}`}>{s}</span>
}

export function PredictionStory() {
  const [active, setActive] = useState(0)
  const stage = STAGES[active]
  const Icon = stage.icon

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
      {/* Stage selector — left column */}
      <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-1 lg:pb-0">
        {STAGES.map((s, i) => {
          const SI = s.icon
          const isActive = i === active
          return (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 lg:flex-shrink flex items-center gap-3 text-left px-4 py-3 rounded-lg border transition-all ${
                isActive
                  ? 'border-current bg-white shadow-sm'
                  : 'border-transparent hover:border-[#DDD8CF] hover:bg-white/60'
              }`}
              style={isActive ? { borderColor: s.color, color: s.color } : { color: '#4D5963' }}
            >
              <SI className="w-4 h-4 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">{s.subtitle}</p>
                <p className="text-sm font-semibold leading-tight">{s.label.split('·')[1].trim()}</p>
              </div>
              {isActive && <ArrowRight className="w-3.5 h-3.5 ml-auto flex-shrink-0 opacity-60" />}
            </button>
          )
        })}
      </div>

      {/* Detail — right column */}
      <div className="lg:col-span-8">
        <div
          className="rounded-xl border-2 overflow-hidden transition-all duration-300"
          style={{ borderColor: stage.borderColor }}
        >
          {/* Header */}
          <div className="px-5 py-4 flex items-start gap-3" style={{ backgroundColor: stage.bgColor }}>
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: stage.color + '20', border: `1px solid ${stage.color}40` }}
            >
              <Icon className="w-4.5 h-4.5" style={{ color: stage.color }} />
            </div>
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-widest mb-0.5" style={{ color: stage.color }}>{stage.subtitle}</p>
              <h3 className="text-lg font-bold text-[#17212B]">{stage.title}</h3>
            </div>
          </div>

          {/* Facts grid */}
          <div className="p-5 bg-white">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {stage.facts.map((f, i) => (
                <div key={i} className="bg-[#F5F3EE] rounded-lg p-3">
                  <p className="text-[9px] text-[#7A8591] uppercase tracking-wide mb-1">{f.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#17212B]">{f.value}</span>
                    {statusBadge(f.status)}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#4D5963] leading-relaxed">{stage.narrative}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setActive(i => Math.max(0, i - 1))}
            disabled={active === 0}
            className="text-xs font-semibold text-[#4D5963] hover:text-[#17212B] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <div className="flex gap-1.5">
            {STAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? 'bg-[#12315B] w-4' : 'bg-[#DDD8CF]'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setActive(i => Math.min(STAGES.length - 1, i + 1))}
            disabled={active === STAGES.length - 1}
            className="text-xs font-semibold text-[#4D5963] hover:text-[#17212B] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}