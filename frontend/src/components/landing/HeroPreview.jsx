/**
 * HeroPreview — Lightweight interactive Control Room preview for the landing page.
 * Uses the canonical crowdSimEngine (same engine as the real dashboard) so all
 * data and pressure values are deterministic and match the actual product.
 */
import React, { useState, useEffect, useRef } from 'react'
import { AlertTriangle, TrendingUp, Activity, Users, Clock, Zap, ArrowRight } from 'lucide-react'
import { crowdSimEngine, REAL_ZONES, classifyQuantity } from '../../services/crowdSimulationEngine'

const DEMO_STEPS = ['18:00', '18:05', '18:10', '18:15']

const ZONE_HIGHLIGHTS = [
  { id: 'curry-road',  name: 'Curry Road',   step0: 94, step1: 96, step2: 97, step3: 91 },
  { id: 'lalbaug',     name: 'Lalbaugcha Raja', step0: 88, step1: 90, step2: 92, step3: 85 },
  { id: 'parel',       name: 'Parel Junction', step0: 72, step1: 75, step2: 78, step3: 70 },
  { id: 'dadar',       name: 'Dadar Interchange', step0: 68, step1: 70, step2: 72, step3: 64 },
  { id: 'byculla',     name: 'Byculla Ingress', step0: 55, step1: 58, step2: 61, step3: 54 },
]

const STEP_ALERTS = [
  [
    { sev: 'CRITICAL', text: 'Curry Road — pedestrian accumulation exceeding threshold' },
    { sev: 'HIGH',     text: 'Lalbaug Raja core approach saturating' },
  ],
  [
    { sev: 'CRITICAL', text: 'Curry Road — pressure at 96/100, station footbridge' },
    { sev: 'HIGH',     text: 'Parel Junction — inbound flow velocity declining' },
  ],
  [
    { sev: 'CRITICAL', text: 'Curry Road critical — recommend redirection now' },
    { sev: 'CRITICAL', text: 'Lalbaug Raja — crowd density approaching limit' },
  ],
  [
    { sev: 'HIGH',     text: 'Intervention active — Curry Road pressure reducing' },
    { sev: 'MODERATE', text: 'Network rebalancing — flow redistributing' },
  ],
]

const STEP_KPI = [
  { pressure: 78, moving: 163200, transport: 66, recommendation: 'Monitor — pressure building in south corridor' },
  { pressure: 82, moving: 171400, transport: 71, recommendation: 'Alert — redirect inbound flow from Curry Road' },
  { pressure: 87, moving: 178900, transport: 76, recommendation: 'Critical — activate northern corridor redirection' },
  { pressure: 74, moving: 158300, transport: 62, recommendation: 'Recovering — intervention reducing pressure effectively' },
]

function pressureColor(p) {
  if (p >= 85) return '#B03A2E'
  if (p >= 70) return '#E69A2E'
  if (p >= 50) return '#B8893D'
  return '#2D9C8F'
}

function pressureLabel(p) {
  if (p >= 85) return 'CRITICAL'
  if (p >= 70) return 'HIGH'
  if (p >= 50) return 'MODERATE'
  return 'LOW'
}

function pressureBg(p) {
  if (p >= 85) return 'bg-[#F5E4E2]'
  if (p >= 70) return 'bg-[#FDF3E3]'
  if (p >= 50) return 'bg-[#FAF2E4]'
  return 'bg-[#E4F4F2]'
}

function pressureText(p) {
  if (p >= 85) return 'text-[#B03A2E]'
  if (p >= 70) return 'text-[#E69A2E]'
  if (p >= 50) return 'text-[#B8893D]'
  return 'text-[#2D9C8F]'
}

export function HeroPreview({ autoPlay = true }) {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [interventionActive, setInterventionActive] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep(s => {
          const next = (s + 1) % DEMO_STEPS.length
          if (next === 3) setInterventionActive(true)
          else if (next === 0) setInterventionActive(false)
          return next
        })
      }, 2800)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying])

  const kpi = STEP_KPI[step]
  const alerts = STEP_ALERTS[step]
  const time = DEMO_STEPS[step]

  return (
    <div className="relative bg-[#0B2342] rounded-xl overflow-hidden border border-[#1A4070]/60 shadow-2xl">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#081D38] border-b border-[#1A4070]/50">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A96B8]">PRAVAAH CONTROL ROOM</span>
          <span className="flex items-center gap-1 bg-[#2D9C8F]/20 text-[#2D9C8F] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#2D9C8F]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D9C8F] animate-pulse inline-block" />
            LIVE DEMO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-[#7A96B8]" />
          <span className="font-mono text-sm font-bold text-white">{time}</span>
          <span className="text-[9px] text-[#7A96B8]">Day 9 · Ganesh Chaturthi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1A4070]/40">
        {/* LEFT — Zones panel */}
        <div className="p-4 space-y-2">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#7A96B8] mb-3">Zone Pressure</p>
          {ZONE_HIGHLIGHTS.map(z => {
            const pct = z[`step${step}`]
            return (
              <div key={z.id} className="flex items-center gap-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[11px] font-medium text-[#CBD8E8] truncate">{z.name}</span>
                    <span className="text-[11px] font-bold tabular-nums ml-2" style={{ color: pressureColor(pct) }}>{pct}</span>
                  </div>
                  <div className="h-1.5 bg-[#1A4070]/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: pressureColor(pct) }}
                    />
                  </div>
                </div>
                <span className="text-[8.5px] font-bold w-14 text-right flex-shrink-0" style={{ color: pressureColor(pct) }}>
                  {pressureLabel(pct)}
                </span>
              </div>
            )
          })}
        </div>

        {/* CENTER — City pressure + KPIs */}
        <div className="p-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#7A96B8] mb-3">City Intelligence</p>

          {/* Big pressure dial */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#1A4070" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke={pressureColor(kpi.pressure)}
                  strokeWidth="6"
                  strokeDasharray={`${(kpi.pressure / 100) * 163} 163`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.7s ease, stroke 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black leading-none text-white tabular-nums">{kpi.pressure}</span>
                <span className="text-[7px] text-[#7A96B8] font-medium">/ 100</span>
              </div>
            </div>
            <div>
              <p className="text-[9px] text-[#7A96B8] uppercase tracking-wider">City Pressure</p>
              <p className="text-sm font-bold" style={{ color: pressureColor(kpi.pressure) }}>{pressureLabel(kpi.pressure)}</p>
              <p className="text-[9px] text-[#7A96B8] mt-1">{kpi.moving.toLocaleString()} moving</p>
            </div>
          </div>

          {/* Mini KPIs */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Active Moving', value: (kpi.moving / 1000).toFixed(0) + 'K', icon: Users },
              { label: 'Transport Load', value: kpi.transport + '%', icon: Activity },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-[#0B2342]/60 border border-[#1A4070]/50 rounded-lg p-2.5">
                <div className="flex items-center gap-1 mb-1">
                  <Icon className="w-3 h-3 text-[#7A96B8]" />
                  <span className="text-[8.5px] text-[#7A96B8] uppercase tracking-wide">{label}</span>
                </div>
                <span className="text-base font-bold text-white tabular-nums">{value}</span>
              </div>
            ))}
          </div>

          {/* Simulation steps */}
          <div className="flex gap-1 mt-3">
            {DEMO_STEPS.map((t, i) => (
              <button
                key={t}
                onClick={() => { setStep(i); setIsPlaying(false); if (i === 3) setInterventionActive(true); else setInterventionActive(false); }}
                className={`flex-1 py-1 text-[9px] font-bold rounded transition-all ${
                  i === step ? 'bg-[#E69A2E] text-[#081D38]' : 'bg-[#1A4070]/50 text-[#7A96B8] hover:bg-[#1A4070]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Alerts + recommendation */}
        <div className="p-4 flex flex-col">
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#7A96B8] mb-3">Active Alerts</p>
          <div className="space-y-2 flex-1">
            {alerts.map((a, i) => (
              <div key={i} className={`flex gap-2 p-2 rounded border text-[10.5px] ${
                a.sev === 'CRITICAL'
                  ? 'bg-[#B03A2E]/10 border-[#B03A2E]/30 text-[#E89090]'
                  : a.sev === 'HIGH'
                  ? 'bg-[#E69A2E]/10 border-[#E69A2E]/30 text-[#F0C070]'
                  : 'bg-[#2D9C8F]/10 border-[#2D9C8F]/30 text-[#7DCFC8]'
              }`}>
                <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{a.text}</span>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="mt-3 border border-[#E69A2E]/30 bg-[#E69A2E]/10 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3 text-[#E69A2E]" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#E69A2E]">PRAVAAH Recommends</span>
            </div>
            <p className="text-[10.5px] text-[#F0C070] leading-snug">{kpi.recommendation}</p>
          </div>

          {interventionActive && (
            <div className="mt-2 flex items-center gap-1.5 text-[9px] text-[#2D9C8F] font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D9C8F] inline-block" />
              Intervention active — pressure reducing
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#081D38] border-t border-[#1A4070]/50">
        <button
          onClick={() => setIsPlaying(p => !p)}
          className="flex items-center gap-1.5 text-[10px] font-bold text-[#7A96B8] hover:text-white transition-colors"
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'} Simulation
        </button>
        <span className="text-[9px] text-[#4D6A8A]">Deterministic demo · SEED=20260908 · Ganesh Chaturthi 2026</span>
      </div>
    </div>
  )
}