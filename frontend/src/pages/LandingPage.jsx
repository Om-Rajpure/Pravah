/**
 * PRAVAAH Landing Page — Premium Redesign
 * Dark, animated, cinematic city intelligence experience
 */
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, LayoutDashboard, Map, TrendingUp, Zap,
  Shield, FlaskConical, BarChart3, Hotel, TrainFront, HeartHandshake,
  Users, Activity, CheckCircle2, ChevronRight, Menu, X, Sparkles,
  Brain, Globe, Lock
} from 'lucide-react'

/* ─── Animated counter hook ─────────────────────────────────── */
function useCounter(target, duration = 1800, start = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (ts) => {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      setVal(Math.floor(p * p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return val
}

/* ─── Intersection observer hook ────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ─── Animated stat card ─────────────────────────────────────── */
function StatCard({ value, suffix = '', label, color = '#2D9C8F', prefix = '' }) {
  const [ref, inView] = useInView(0.3)
  const count = useCounter(parseInt(value), 1600, inView)
  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-4xl sm:text-5xl font-black tabular-nums" style={{ color }}>
        {prefix}{inView ? count : 0}{suffix}
      </span>
      <span className="text-[11px] uppercase tracking-widest font-semibold text-[#7A96B8]">{label}</span>
    </div>
  )
}

/* ─── Floating metric chip ───────────────────────────────────── */
function LiveChip({ label, value, color }) {
  return (
    <div className="flex items-center gap-2 bg-[#0B2342]/80 backdrop-blur border border-[#1A4070]/60 rounded-full px-3.5 py-2 text-xs font-bold shadow-lg">
      <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-white">{value}</span>
      <span className="text-[#7A96B8]">{label}</span>
    </div>
  )
}

/* ─── Feature card ───────────────────────────────────────────── */
function FeatureCard({ num, icon: Icon, title, desc, accent, link }) {
  return (
    <Link to={link} className="group relative bg-[#0B2342]/60 backdrop-blur border border-[#1A4070]/60 rounded-2xl p-6 flex flex-col gap-4 overflow-hidden hover:border-opacity-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      style={{ '--accent': accent }}>
      {/* Subtle gradient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}15 0%, transparent 70%)` }} />
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-black font-mono tracking-widest" style={{ color: accent }}>{num}</span>
        <div className="p-2.5 rounded-xl transition-colors duration-300" style={{ background: `${accent}18` }}>
          <Icon className="w-5 h-5 transition-colors duration-300" style={{ color: accent }} />
        </div>
      </div>
      <div>
        <h3 className="text-white font-bold text-base mb-1.5">{title}</h3>
        <p className="text-[#7A96B8] text-xs leading-relaxed">{desc}</p>
      </div>
      <div className="flex items-center gap-1 text-[11px] font-semibold transition-colors duration-200 mt-auto pt-2 border-t border-[#1A4070]/40"
        style={{ color: accent }}>
        <span>Launch Module</span>
        <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

/* ─── Before/After toggle ────────────────────────────────────── */
function BeforeAfter() {
  const [view, setView] = useState('after')
  const [ref, inView] = useInView(0.2)

  const states = {
    before: {
      tag: 'WITHOUT INTERVENTION', tagColor: '#B03A2E', tagBg: 'rgba(176,58,46,0.12)',
      pressure: 94, critical: 3, load: 84,
      zones: [
        { name: 'Curry Road Station', val: 94, color: '#B03A2E', status: 'CRITICAL' },
        { name: 'Lalbaugcha Raja Core', val: 88, color: '#B03A2E', status: 'CRITICAL' },
        { name: 'Parel Transit Junction', val: 86, color: '#E69A2E', status: 'HIGH' },
        { name: 'Dadar Interchange', val: 78, color: '#E69A2E', status: 'HIGH' },
      ]
    },
    after: {
      tag: 'PRAVAAH INTERVENTION APPLIED', tagColor: '#2D9C8F', tagBg: 'rgba(45,156,143,0.12)',
      pressure: 76, critical: 1, load: 66,
      zones: [
        { name: 'Curry Road Station', val: 76, color: '#E69A2E', status: 'MODERATE' },
        { name: 'Lalbaugcha Raja Core', val: 72, color: '#E69A2E', status: 'MODERATE' },
        { name: 'Parel Transit Junction', val: 58, color: '#2D9C8F', status: 'LOW' },
        { name: 'Dadar Interchange', val: 54, color: '#2D9C8F', status: 'LOW' },
      ]
    }
  }
  const d = states[view]

  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="bg-[#081D38] border border-[#1A4070] rounded-2xl overflow-hidden shadow-2xl">
        {/* Toggle header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1A4070]/60">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
              style={{ color: d.tagColor, background: d.tagBg, borderColor: `${d.tagColor}40` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: d.tagColor }} />
              {d.tag}
            </span>
            <p className="text-white font-bold text-lg mt-2">
              {view === 'before' ? 'Curry Road Saturation Event' : 'Flow Redistribution Applied'}
            </p>
          </div>
          <div className="flex gap-1 p-1 bg-[#0B2342] rounded-xl border border-[#1A4070]/40">
            <button onClick={() => setView('before')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${view === 'before' ? 'bg-[#B03A2E] text-white shadow' : 'text-[#7A96B8] hover:text-white'}`}>
              Before
            </button>
            <button onClick={() => setView('after')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${view === 'after' ? 'bg-[#2D9C8F] text-white shadow' : 'text-[#7A96B8] hover:text-white'}`}>
              After
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 divide-x divide-[#1A4070]/40 border-b border-[#1A4070]/40">
          {[
            { label: 'Target Pressure', val: d.pressure, unit: '/ 100', color: d.zones[0].color },
            { label: 'Critical Hotspots', val: d.critical, unit: 'zones', color: d.zones[0].color },
            { label: 'Transit Saturation', val: `${d.load}%`, unit: 'capacity', color: '#2468B8' }
          ].map((m, i) => (
            <div key={i} className="p-5 flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-[#7A96B8] font-bold">{m.label}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black tabular-nums" style={{ color: m.color }}>{m.val}</span>
                <span className="text-xs text-[#7A96B8]">{m.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Zone bars */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {d.zones.map((z, i) => (
            <div key={i} className="bg-[#0B2342]/80 rounded-xl p-3.5 border border-[#1A4070]/40">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-white">{z.name}</span>
                <span className="text-[10px] font-bold" style={{ color: z.color }}>{z.status}</span>
              </div>
              <div className="h-1.5 bg-[#1A4070]/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${z.val}%`, background: z.color }} />
              </div>
              <span className="text-[10px] text-[#7A96B8] font-mono mt-1 block">{z.val}/100</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Animated section wrapper ───────────────────────────────── */
function FadeIn({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView(0.1)
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#060F1E] text-white selection:bg-[#2D9C8F]/40 selection:text-white font-sans">

      {/* ── STICKY NAV ─────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B2342]/95 backdrop-blur-md border-b border-[#1A4070]/60 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/favicon.jpg" alt="PRAVAAH" className="h-8 w-8 rounded-lg object-cover shadow-md" />
            <div className="flex flex-col">
              <span className="text-white font-black text-lg tracking-tight leading-none">PRAVAAH</span>
              <span className="text-[8.5px] font-bold uppercase tracking-[0.22em] text-[#2D9C8F]">City Intelligence</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-[#7A96B8]">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#impact" className="hover:text-white transition-colors">Impact</a>
            <Link to="/control-room/glass-box" className="hover:text-white transition-colors">Glass Box</Link>
            <Link to="/visitor" className="hover:text-white transition-colors">Visitor Guide</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/visitor" className="text-[13px] font-semibold text-[#7A96B8] hover:text-white transition-colors px-3 py-2">
              Visitor Mode
            </Link>
            <Link to="/control-room/overview"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E69A2E] to-[#F0B848] hover:from-[#C87524] hover:to-[#E69A2E] text-[#060F1E] text-[13px] font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-[#E69A2E]/20 transition-all duration-200 hover:shadow-[#E69A2E]/40 hover:scale-105">
              <LayoutDashboard className="w-4 h-4" />
              Control Room
            </Link>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B2342]/98 backdrop-blur border-b border-[#1A4070] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {[
              { label: 'Control Room', to: '/control-room/overview', cta: true },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Before / After', href: '#impact' },
              { label: 'Visitor Guide', to: '/visitor' },
            ].map((item, i) => item.to ? (
              <Link key={i} to={item.to} onClick={() => setMobileMenuOpen(false)}
                className={`block py-2.5 px-3 rounded-xl text-sm font-bold transition-colors ${item.cta ? 'bg-[#E69A2E] text-[#060F1E]' : 'text-white hover:bg-white/10'}`}>
                {item.label}
              </Link>
            ) : (
              <a key={i} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-[#CBD8E8] hover:text-white hover:bg-white/5">
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Multi-layer background */}
        <div className="absolute inset-0">
          {/* Deep radial gradient */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, #0E2A4A 0%, #060F1E 70%)' }} />
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'linear-gradient(#2D9C8F 1px, transparent 1px), linear-gradient(90deg, #2D9C8F 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          {/* Glow orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-[0.08] blur-3xl animate-pulse" style={{ background: '#2D9C8F', animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-[0.06] blur-3xl animate-pulse" style={{ background: '#E69A2E', animationDuration: '6s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left pitch */}
            <div className="space-y-8">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-bold uppercase tracking-widest"
                style={{ background: 'rgba(45,156,143,0.1)', borderColor: 'rgba(45,156,143,0.35)', color: '#2D9C8F' }}>
                <span className="w-2 h-2 rounded-full bg-[#2D9C8F] animate-ping" />
                Live City Intelligence · Mumbai 2026
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]">
                  <span className="text-white">When millions</span>
                  <br />
                  <span style={{ background: 'linear-gradient(90deg, #2D9C8F, #38BFB0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    move as one.
                  </span>
                </h1>
                <p className="text-[#7A96B8] text-base sm:text-lg leading-relaxed max-w-lg">
                  PRAVAAH orchestrates city-scale crowd intelligence — predicting surges, simulating interventions, and balancing Mumbai's arteries before Ganesh Chaturthi reaches breaking point.
                </p>
              </div>

              {/* CTA row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/control-room/overview"
                  className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#E69A2E] to-[#F0B848] text-[#060F1E] font-black text-sm px-7 py-4 rounded-xl shadow-xl shadow-[#E69A2E]/25 transition-all duration-200 hover:scale-105 hover:shadow-[#E69A2E]/40">
                  <LayoutDashboard className="w-4 h-4" />
                  Enter Control Room
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/visitor"
                  className="inline-flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-bold text-sm px-6 py-4 rounded-xl transition-all duration-200">
                  <Users className="w-4 h-4 text-[#2D9C8F]" />
                  Visitor Experience
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 border-t border-white/[0.08]">
                {[
                  { dot: '#2D9C8F', label: '11 Monitored Hubs' },
                  { dot: '#E69A2E', label: 'Deterministic Twin' },
                  { dot: '#2468B8', label: 'Glass Box Audit' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-[#7A96B8]">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: dashboard preview card */}
            <div className="relative">
              {/* Glow behind card */}
              <div className="absolute -inset-8 rounded-3xl opacity-30 blur-2xl" style={{ background: 'radial-gradient(ellipse, #2D9C8F40, transparent 70%)' }} />

              <div className="relative bg-[#0B2342]/80 backdrop-blur border border-[#1A4070]/70 rounded-2xl overflow-hidden shadow-2xl">
                {/* Mock control room header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1A4070]/60 bg-[#081D38]/80">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B03A2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E69A2E]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2D9C8F]" />
                    </div>
                    <span className="text-[10px] font-mono text-[#7A96B8] ml-2">PRAVAAH · CONTROL ROOM · LIVE</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#2D9C8F]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D9C8F] animate-pulse" />
                    LIVE
                  </span>
                </div>

                {/* Mock metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#1A4070]/40 border-b border-[#1A4070]/40">
                  {[
                    { label: 'CITY PRESSURE', val: '78', unit: '/100', color: '#B03A2E' },
                    { label: 'ACTIVE VISITORS', val: '163K', unit: 'live', color: '#2468B8' },
                    { label: 'CRITICAL ZONES', val: '3', unit: 'zones', color: '#E69A2E' },
                    { label: 'ALERTS', val: '4', unit: 'active', color: '#B03A2E' },
                  ].map((m, i) => (
                    <div key={i} className="px-4 py-3">
                      <div className="text-[9px] font-bold text-[#7A96B8] uppercase tracking-wider mb-1">{m.label}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black font-mono" style={{ color: m.color }}>{m.val}</span>
                        <span className="text-[10px] text-[#7A96B8]">{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Zone pressure bars */}
                <div className="p-4 space-y-2.5">
                  <div className="text-[10px] font-bold text-[#7A96B8] uppercase tracking-wider mb-3">Zone Pressure Matrix</div>
                  {[
                    { name: 'Curry Road', val: 94, color: '#B03A2E' },
                    { name: 'Lalbaugcha Raja', val: 88, color: '#B03A2E' },
                    { name: 'Parel Junction', val: 76, color: '#E69A2E' },
                    { name: 'Dadar', val: 64, color: '#E69A2E' },
                    { name: 'Thane Suburban', val: 42, color: '#2D9C8F' },
                  ].map((z, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[11px] text-[#CBD8E8] w-32 truncate flex-shrink-0">{z.name}</span>
                      <div className="flex-1 h-1.5 bg-[#1A4070]/50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${z.val}%`, background: z.color,
                            boxShadow: `0 0 8px ${z.color}80` }} />
                      </div>
                      <span className="text-[11px] font-mono font-bold flex-shrink-0" style={{ color: z.color }}>{z.val}</span>
                    </div>
                  ))}
                </div>

                {/* Action recommendation banner */}
                <div className="mx-4 mb-4 bg-[#2D9C8F]/10 border border-[#2D9C8F]/30 rounded-xl p-3.5 flex items-start gap-3">
                  <Zap className="w-4 h-4 text-[#2D9C8F] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-bold text-[#2D9C8F] uppercase tracking-wider">PRAVAAH Recommendation</div>
                    <div className="text-[12px] font-semibold text-white mt-0.5">Redirect 18% → Thane Suburban Terminal</div>
                    <div className="text-[11px] text-[#7A96B8]">Forecast: −18 pts pressure within 15 mins</div>
                  </div>
                </div>
              </div>

              {/* Floating chips */}
              <div className="absolute -bottom-4 -left-4 hidden sm:block">
                <LiveChip label="zones monitored" value="11" color="#2D9C8F" />
              </div>
              <div className="absolute -top-4 -right-4 hidden sm:block">
                <LiveChip label="ms response" value="~200" color="#E69A2E" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#2D9C8F] rounded-full" />
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────── */}
      <section className="bg-[#081D38] border-y border-[#1A4070]/50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            <StatCard value={11} suffix="+" label="Monitored Zones" color="#2D9C8F" />
            <StatCard value={163} suffix="K" label="Live Visitors" color="#2468B8" />
            <StatCard value={25} suffix="+" label="Scenarios Tested" color="#E69A2E" />
            <StatCard value={98} suffix="%" label="Prediction Accuracy" color="#2D9C8F" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #2D9C8F 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: 'rgba(45,156,143,0.1)', color: '#2D9C8F', border: '1px solid rgba(45,156,143,0.3)' }}>
              <Sparkles className="w-3 h-3" /> Core Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              How PRAVAAH Thinks
            </h2>
            <p className="text-[#7A96B8] text-base mt-4 leading-relaxed">
              A continuous intelligence loop — from signal detection to field-ready action.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: '01', icon: TrendingUp, title: 'PREDICT', accent: '#2D9C8F', link: '/control-room/predictions',
                desc: 'Multi-horizon crowd pressure forecasting (30m, 60m, 120m, 180m) using physics-calibrated models across 11 transit nodes.' },
              { num: '02', icon: Zap, title: 'ORCHESTRATE', accent: '#2468B8', link: '/control-room/actions',
                desc: 'Ranked intervention engine — evaluates diversion corridors, simulates pedestrian routing, and models counterfactual impact before issuing field orders.' },
              { num: '03', icon: Activity, title: 'BALANCE', accent: '#E69A2E', link: '/control-room/overview',
                desc: 'Continuous network telemetry compares forecast vs. observed, driving adaptive pressure equalization across all corridors in real time.' },
            ].map((c, i) => (
              <FadeIn key={i} delay={i * 120}>
                <FeatureCard {...c} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ─────────────────────────────────────── */}
      <section id="impact" className="py-20 sm:py-28 bg-[#060F1E] relative">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#2D9C8F 1px, transparent 1px), linear-gradient(90deg, #2D9C8F 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: 'rgba(45,156,143,0.1)', color: '#2D9C8F', border: '1px solid rgba(45,156,143,0.3)' }}>
              <BarChart3 className="w-3 h-3" /> Counterfactual Proof
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Measurable impact. Before commitment.
            </h2>
            <p className="text-[#7A96B8] text-base mt-4 leading-relaxed">
              Compare unmanaged surge against PRAVAAH-guided intervention with deterministic telemetry.
            </p>
          </FadeIn>
          <BeforeAfter />
        </div>
      </section>

      {/* ── GLASS BOX ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#081D38] border-y border-[#1A4070]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                style={{ background: 'rgba(45,156,143,0.1)', color: '#2D9C8F', border: '1px solid rgba(45,156,143,0.3)' }}>
                <Shield className="w-3 h-3" /> Explainable Civic AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Why did PRAVAAH<br />recommend this?
              </h2>
              <p className="text-[#7A96B8] text-base leading-relaxed">
                Every recommendation comes with a fully inspectable <strong className="text-white">Glass Box</strong> audit trail — observed telemetry, physical constraints, historical baseline, and projected impact. No black box decisions.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: Brain, label: 'Causal Reasoning' },
                  { icon: Lock, label: 'Privacy Preserving' },
                  { icon: Globe, label: 'Civic Accountability' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-[12px] font-semibold text-[#CBD8E8]">
                    <t.icon className="w-3.5 h-3.5 text-[#2D9C8F]" />
                    {t.label}
                  </div>
                ))}
              </div>
              <Link to="/control-room/glass-box"
                className="inline-flex items-center gap-2 bg-[#2D9C8F]/10 hover:bg-[#2D9C8F]/20 border border-[#2D9C8F]/40 text-[#2D9C8F] font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:border-[#2D9C8F]/80">
                Inspect Live Audit Trail
                <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="bg-[#060F1E]/80 border border-[#1A4070]/60 rounded-2xl overflow-hidden shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#1A4070]/60 bg-[#081D38]">
                  <span className="text-[#7A96B8] font-bold text-[10px] uppercase tracking-wider">Decision Trace · ACT-2026-0908-01</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2D9C8F]/15 text-[#2D9C8F] border border-[#2D9C8F]/30">VERIFIED</span>
                </div>
                <div className="p-5 space-y-4">
                  {[
                    { key: 'TRIGGER EVIDENCE', value: 'Curry Road footbridge ingress velocity: 0.4 m/s (critical < 0.6). Density 4.8 pers/m².', color: '#B03A2E' },
                    { key: 'CONSTRAINTS CHECKED', value: 'Thane buffer: 62% available · Western Railway: OPERATIONAL · Vashi corridor: clear', color: '#E69A2E' },
                    { key: 'CANDIDATES EVALUATED', value: '25 routing combinations tested via Dijkstra + side-effect penalty function', color: '#2468B8' },
                    { key: 'EXPECTED OUTCOME', value: '−18 pts pressure on Curry Road in ≤15 min. No secondary bottleneck created.', color: '#2D9C8F' },
                  ].map((row, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-[9.5px] font-bold uppercase tracking-widest" style={{ color: row.color }}>{row.key}</div>
                      <div className="text-[#CBD8E8] bg-[#0B2342]/60 p-2.5 rounded-lg border border-[#1A4070]/40 leading-relaxed">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TWO VIEWS ──────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#060F1E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
              style={{ background: 'rgba(45,156,143,0.1)', color: '#2D9C8F', border: '1px solid rgba(45,156,143,0.3)' }}>
              Two Perspectives
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Command for operators. Safety for visitors.</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                icon: LayoutDashboard, accent: '#2468B8', label: 'Operator',
                title: 'PRAVAAH Control Room',
                desc: 'Complete situational awareness for transit directors, law enforcement, and municipal commissioners. Live simulation, hotspot heatmaps, counterfactual action modeling.',
                points: ['Real-time MapLibre crowd flow across 11 zones', 'Multi-horizon predictive saturation engine', 'Interactive What-If disruption sandbox'],
                cta: 'Launch Control Room', link: '/control-room/overview'
              },
              {
                icon: Users, accent: '#2D9C8F', label: 'Visitor',
                title: 'Visitor Companion',
                desc: 'City intelligence distilled into peaceful pilgrimage guidance. Safe routing, live queue estimates, accommodation status, and privacy-preserving crowd alerts.',
                points: ['Destination crowd ratings & wait-time forecasts', 'Low-pressure alternative walking routes', 'Real-time medical & welfare kiosk locations'],
                cta: 'Explore Visitor Guide', link: '/visitor'
              }
            ].map((c, i) => (
              <FadeIn key={i} delay={i * 150}>
                <div className="group h-full bg-[#0B2342]/60 border border-[#1A4070]/50 hover:border-opacity-100 rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 hover:shadow-2xl"
                  style={{ '--accent': c.accent }}>
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl" style={{ background: `${c.accent}18` }}>
                      <c.icon className="w-6 h-6" style={{ color: c.accent }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full" style={{ color: c.accent, background: `${c.accent}15`, border: `1px solid ${c.accent}30` }}>
                      {c.label}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">{c.title}</h3>
                    <p className="text-[#7A96B8] text-sm leading-relaxed">{c.desc}</p>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {c.points.map((p, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[13px] text-[#CBD8E8]">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: c.accent }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link to={c.link}
                    className="w-full flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-xl transition-all duration-200 hover:opacity-90"
                    style={{ background: `linear-gradient(135deg, ${c.accent}, ${c.accent}cc)`, color: '#fff', boxShadow: `0 4px 20px ${c.accent}30` }}>
                    {c.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODULE GRID ────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#081D38] border-t border-[#1A4070]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Complete Intelligence Matrix</h2>
            <p className="text-[#7A96B8] text-sm mt-3">All modules unified in one command interface.</p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { title: 'Live City', icon: Map, path: '/control-room/live-city', accent: '#2D9C8F', desc: 'Dynamic GIS mapping across 11 zones' },
              { title: 'Predictions', icon: TrendingUp, path: '/control-room/predictions', accent: '#2468B8', desc: 'Multi-horizon pressure forecasting' },
              { title: 'Actions', icon: Zap, path: '/control-room/actions', accent: '#E69A2E', desc: 'Ranked intervention engine' },
              { title: 'Hospitality', icon: Hotel, path: '/control-room/hospitality', accent: '#B03A2E', desc: 'Accommodation capacity buffers' },
              { title: 'Mobility', icon: TrainFront, path: '/control-room/mobility', accent: '#2D9C8F', desc: 'Suburban train load & frequency' },
              { title: 'Welfare', icon: HeartHandshake, path: '/control-room/welfare', accent: '#E69A2E', desc: 'Medical aid & civic welfare posts' },
              { title: 'Scenarios', icon: FlaskConical, path: '/control-room/scenarios', accent: '#2468B8', desc: 'What-If disruption sandbox' },
              { title: 'Impact', icon: BarChart3, path: '/control-room/impact', accent: '#2D9C8F', desc: 'Before/after counterfactual analysis' },
              { title: 'Glass Box', icon: Shield, path: '/control-room/glass-box', accent: '#B03A2E', desc: 'Auditable algorithmic rationale' },
            ].map((m, i) => {
              const Icon = m.icon
              return (
                <FadeIn key={i} delay={i * 50}>
                  <Link to={m.path}
                    className="group flex flex-col gap-3 p-4 sm:p-5 bg-[#0B2342]/60 hover:bg-[#0B2342] border border-[#1A4070]/40 hover:border-opacity-100 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                    style={{ '--a': m.accent }}>
                    <div className="p-2.5 rounded-xl w-fit transition-colors duration-200 group-hover:scale-110"
                      style={{ background: `${m.accent}15`, color: m.accent }}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{m.title}</div>
                      <div className="text-[#7A96B8] text-[11px] mt-0.5 leading-snug">{m.desc}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold mt-auto" style={{ color: m.accent }}>
                      Open <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-32 overflow-hidden bg-[#060F1E]">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #0E2A4A 0%, #060F1E 80%)' }} />
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(#2D9C8F 1px, transparent 1px), linear-gradient(90deg, #2D9C8F 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="flex justify-center">
            <img src="/favicon.jpg" alt="PRAVAAH" className="h-16 w-16 rounded-2xl shadow-2xl shadow-[#2D9C8F]/20" />
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to experience<br />
              <span style={{ background: 'linear-gradient(90deg, #2D9C8F, #38BFB0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                PRAVAAH?
              </span>
            </h2>
            <p className="text-[#7A96B8] text-base mt-5 leading-relaxed max-w-xl mx-auto">
              Explore the live Ganesh Chaturthi 2026 Mumbai command center. Test real scenarios, inspect predictive models, and audit every intervention decision.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/control-room/overview"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#E69A2E] to-[#F0B848] hover:from-[#C87524] hover:to-[#E69A2E] text-[#060F1E] font-black text-sm px-8 py-4 rounded-xl shadow-xl shadow-[#E69A2E]/25 transition-all duration-200 hover:scale-105">
              <LayoutDashboard className="w-4 h-4" />
              Enter the Control Room
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/visitor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white font-bold text-sm px-6 py-4 rounded-xl transition-all duration-200">
              <Users className="w-4 h-4 text-[#2D9C8F]" />
              Explore Visitor View
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-[#060F1E] border-t border-[#1A4070]/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10 pb-10 border-b border-[#1A4070]/30">
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/favicon.jpg" alt="PRAVAAH" className="h-8 w-8 rounded-lg object-cover" />
                <span className="text-white font-black text-lg tracking-tight">PRAVAAH</span>
              </div>
              <p className="text-[#7A96B8] text-[11px] leading-relaxed">City intelligence for crowd prediction, intervention orchestration, and urban network balancing.</p>
              <span className="text-[9px] font-bold text-[#E69A2E] uppercase tracking-widest">PREDICT · ORCHESTRATE · BALANCE</span>
            </div>
            {[
              { title: 'Control Room', links: [
                { label: 'Overview', to: '/control-room/overview' },
                { label: 'Live City GIS', to: '/control-room/live-city' },
                { label: 'Predictions', to: '/control-room/predictions' },
                { label: 'Actions', to: '/control-room/actions' },
                { label: 'Glass Box', to: '/control-room/glass-box' },
              ]},
              { title: 'Infrastructure', links: [
                { label: 'Mobility & Transit', to: '/control-room/mobility' },
                { label: 'Hospitality & Beds', to: '/control-room/hospitality' },
                { label: 'Civic Welfare', to: '/control-room/welfare' },
                { label: 'What-If Scenarios', to: '/control-room/scenarios' },
                { label: 'Visitor Guide', to: '/visitor' },
              ]},
              { title: 'Platform', links: [
                { label: 'Impact Analysis', to: '/control-room/impact' },
              ]},
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-bold text-[11px] uppercase tracking-wider mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l, j) => (
                    <li key={j}><Link to={l.to} className="text-[#7A96B8] hover:text-white text-[11px] transition-colors">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10.5px] text-[#4A6080]">
            <p>© 2026 PRAVAAH. Urban Intelligence Platform.</p>
            <div className="flex items-center gap-2 text-[#2D9C8F]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D9C8F] animate-pulse" />
              <span>Live Simulation · Ganesh Chaturthi 2026 · Mumbai</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}