/**
 * PRAVAAH Landing Page — Fully Mobile & Screen-Responsive Edition
 * Robust responsiveness for mobile (320px+), tablets, laptops, and 4K displays.
 * Dynamic background attachments, touch-friendly navigation, and adaptive layouts.
 */
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, LayoutDashboard, TrendingUp, Zap, Shield,
  FlaskConical, Users, Activity, CheckCircle2, Menu, X, Eye,
  Map, Brain, Lock, Sparkles, ChevronRight, MapPin
} from 'lucide-react'
import { PravaahBrandLogo } from '../components/shared/PravaahLogo'

/* ─── Brand Colors ───────────────────────────────────────── */
const C = {
  navy:      '#12315B',
  navyMid:   '#1A4070',
  navyDark:  '#0B2342',
  teal:      '#2A9D8F',
  tealLight: '#38BFB0',
  amber:     '#E69A2E',
  amberDark: '#C87524',
  red:       '#B03A2E',
  bg:        '#F0F4F8',
  text:      '#17212B',
  textSub:   '#4A6080',
  border:    '#D4E2F0',
}

/* ─── Mumbai Locations Dataset ───────────────────────────── */
const MUMBAI_LOCATIONS = [
  { name: 'Lalbaugcha Raja', area: 'Lalbaug, Central Mumbai', type: 'Ganesh Mandal', pressure: 94, status: 'CRITICAL', statusColor: C.red,     visitors: '2.8L+', desc: 'Main procession origin. Peak footfall. Footbridge at 96% capacity.', facts: ['Footbridge at 96% capacity', '4.8 persons/m² density', '+12,000 arrivals/hr'] },
  { name: 'Dadar Station',    area: 'Dadar, W+C Line Interchange', type: 'Transit Hub', pressure: 88, status: 'HIGH',     statusColor: '#B05E1A', visitors: '6.5L/day', desc: 'Busiest interchange — Central & Western line convergence point.', facts: ['Platforms 1–4 overloaded', 'Bus terminus at 89%', 'Taxi queue: 3.2km'] },
  { name: 'Curry Road Stn',  area: 'Lower Parel, Central Line',    type: 'Train Station', pressure: 91, status: 'CRITICAL', statusColor: C.red,  visitors: '1.2L/day', desc: 'PRAVAAH hotspot — narrow footbridge creates catastrophic bottleneck risk.', facts: ['Velocity: 0.4 m/s (critical)', 'Platform overflow risk', 'Intervention active'] },
  { name: 'Girgaon Chowpatty', area: 'Marine Lines, South Mumbai', type: 'Immersion Beach', pressure: 86, status: 'HIGH', statusColor: '#B05E1A', visitors: '4L+', desc: 'Primary immersion ground. Crowd density peaks post-midnight Day 10.', facts: ['Beach access: 73% capacity', 'Marine Drive closed', 'NDRF deployed'] },
  { name: 'Bandra Station',   area: 'Bandra, Western Suburbs',     type: 'Transit Hub', pressure: 72, status: 'ELEVATED', statusColor: C.amber,  visitors: '4.8L/day', desc: 'Western line suburban hub. Multiple connecting routes northward.', facts: ['Skywalk at 68%', 'Auto stand: overflow', '2 extra trains added'] },
  { name: 'Andheri Station',  area: 'Andheri, Western Line',       type: 'Transit Hub', pressure: 68, status: 'ELEVATED', statusColor: C.amber,  visitors: '5.2L/day', desc: 'North–South gateway. Metro Line 1 interchange sees surge traffic.', facts: ['Metro: 81% load', 'Parking: full', 'WR: normal'] },
  { name: 'Kurla Complex',    area: 'Kurla, Central Suburbs',      type: 'Multi-modal Hub', pressure: 79, status: 'HIGH', statusColor: '#B05E1A', visitors: '3.9L/day', desc: 'LTT terminus + local station. Key intercity train connections.', facts: ['LTT: 4 specials added', 'BEST bus rerouted', 'Hawker zone cleared'] },
  { name: 'Parel Junction',   area: 'Parel, Central Line',         type: 'Train Station', pressure: 76, status: 'HIGH', statusColor: '#B05E1A', visitors: '1.8L/day', desc: 'Industrial corridor that transforms into a pilgrimage route during Chaturthi.', facts: ['Hospital proximity alert', 'Ambulance corridor open', 'Police bandobast: high'] },
  { name: 'CST / CSMT',       area: 'Fort, South Mumbai',          type: 'Heritage Terminal', pressure: 58, status: 'MODERATE', statusColor: C.teal, visitors: '7L/day', desc: 'UNESCO heritage terminus. Handles long-distance + suburban convergence.', facts: ['Mainline: normal', '18 platforms active', 'Underground tunnel open'] },
  { name: 'Ghatkopar',        area: 'Ghatkopar, Eastern Suburbs',  type: 'Metro Interchange', pressure: 61, status: 'MODERATE', statusColor: C.teal, visitors: '2.1L/day', desc: 'Metro Line 1 eastern terminal. Absorbs overflow from Kurla + Vikhroli.', facts: ['Metro: normal', 'Auto: 40 min wait', 'Buffer zone active'] },
  { name: 'Thane Station',    area: 'Thane, Central Suburbs',      type: 'Relief Terminal', pressure: 44, status: 'LOW', statusColor: C.tealLight, visitors: '3.3L/day', desc: 'PRAVAAH-designated relief corridor. 18% flow diverted from Curry Road.', facts: ['Buffer capacity: 62%', 'Diversion active', '−18 pts relief achieved'] },
  { name: 'Vashi Terminal',   area: 'Navi Mumbai, Harbour Line',   type: 'Relief Terminal', pressure: 38, status: 'LOW', statusColor: C.tealLight, visitors: '1.6L/day', desc: 'Navi Mumbai buffer zone. Trains at 15-min frequency to absorb overflow.', facts: ['Capacity: 72% free', 'Extra trains: 6/hr', 'Hotel occupancy: 55%'] },
]

/* ─── Intersection Observer Hook ─────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

function FadeUp({ children, delay = 0, style = {}, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={className} style={{
      transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      ...style,
    }}>{children}</div>
  )
}

/* ─── Animated Pressure Bar ──────────────────────────────── */
function PressureBar({ value, color }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
      <div style={{
        height: '100%', borderRadius: '999px', background: color,
        width: inView ? `${value}%` : '0%',
        transition: 'width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
        boxShadow: `0 0 10px ${color}80`,
      }} />
    </div>
  )
}

/* ─── Photo Section Wrapper (Mobile-Optimized) ───────────── */
function PhotoSection({ img, overlay = 'rgba(11,35,66,0.78)', children, className = '', style = {}, id }) {
  return (
    <section id={id} className={`relative overflow-hidden w-full ${className}`} style={style}>
      {/* Background photo layer */}
      <div
        className="photo-bg absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      {/* Dynamic Overlay */}
      <div className="absolute inset-0 w-full h-full" style={{ background: overlay }} />
      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

/* ─── Location Card (Responsive Grid Item) ───────────────── */
function LocationCard({ loc, index }) {
  const [ref, inView] = useInView(0.05)
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
      transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${(index % 4) * 60}ms`,
    }}>
      <div className="bg-[#0B2342]/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 h-full flex flex-col justify-between gap-3 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
        style={{ borderTop: `3px solid ${loc.statusColor}` }}>

        {/* Header */}
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[9px] font-bold text-white/50 tracking-wider uppercase truncate mb-0.5">
              {loc.type}
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight truncate">
              {loc.name}
            </h3>
            <p className="text-[10px] text-white/50 truncate mt-0.5">{loc.area}</p>
          </div>
          <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full text-white tracking-wide shrink-0"
            style={{ background: loc.statusColor }}>
            {loc.status}
          </span>
        </div>

        {/* Pressure Gauge */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-baseline">
            <span className="text-[9.5px] font-semibold text-white/60 uppercase tracking-wider">
              Crowd Pressure
            </span>
            <span className="text-xl sm:text-2xl font-black tabular-nums" style={{ color: loc.statusColor }}>
              {loc.pressure}<span className="text-[11px] font-medium text-white/40">/100</span>
            </span>
          </div>
          <PressureBar value={loc.pressure} color={loc.statusColor} />
        </div>

        {/* Description */}
        <p className="text-xs text-white/80 leading-relaxed line-clamp-2">{loc.desc}</p>

        {/* Facts List */}
        <div className="space-y-1 pt-1 border-t border-white/10">
          {loc.facts.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-[10.5px] text-white/70">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: loc.statusColor }} />
              <span className="truncate">{f}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-tealLight font-bold text-[10.5px]">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{loc.visitors} monitored</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN LANDING PAGE COMPONENT
═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navScrolled = scrollY > 40

  return (
    <div className="font-sans bg-[#F0F4F8] text-[#17212B] min-h-screen overflow-x-hidden selection:bg-teal selection:text-white">

      {/* ═══ RESPONSIVE HEADER NAV ═════════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navScrolled ? 'bg-[#0B2342]/95 backdrop-blur-md border-b border-white/10 shadow-xl' : 'bg-gradient-to-b from-[#0B2342]/80 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 group">
            <PravaahBrandLogo variant="dark" size="sm" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-white/75">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#zones" className="hover:text-white transition-colors">Mumbai Zones</a>
            <Link to="/control-room/glass-box" className="hover:text-white transition-colors">Glass Box</Link>
            <Link to="/visitor" className="hover:text-white transition-colors">Visitor Guide</Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link to="/visitor" className="hidden sm:inline-flex text-xs lg:text-sm font-semibold text-white/80 hover:text-white px-3.5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all">
              Visitor Mode
            </Link>

            <Link to="/control-room/overview" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E69A2E] to-[#F0B848] text-[#0B2342] text-xs sm:text-sm font-extrabold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-[#E69A2E]/30 hover:scale-105 transition-all">
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Control Room</span>
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B2342]/98 backdrop-blur-xl border-b border-white/10 px-4 py-5 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Link
              to="/control-room/overview"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#E69A2E] to-[#F0B848] text-[#0B2342] font-extrabold text-sm shadow-md"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Enter Control Room</span>
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5"
            >
              How It Works
            </a>
            <a
              href="#zones"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5"
            >
              Mumbai Zones
            </a>
            <Link
              to="/control-room/glass-box"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5"
            >
              Glass Box Explainability
            </Link>
            <Link
              to="/visitor"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-white/5"
            >
              Visitor Companion Experience
            </Link>
          </div>
        )}
      </header>

      {/* ═══ HERO SECTION (Centered Alignment) ════════════ */}
      <PhotoSection
        img="/img-station.jpg"
        overlay="linear-gradient(160deg, rgba(11,35,66,0.94) 0%, rgba(18,49,91,0.84) 50%, rgba(42,157,143,0.32) 100%)"
        className="min-h-screen flex items-center justify-center pt-20 pb-12 sm:pt-24 sm:pb-16"
      >
        <div className="w-full py-4 sm:py-8 my-auto flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center justify-center">

            {/* Left Hero Pitch */}
            <div className="lg:col-span-6 flex flex-col justify-center items-start space-y-5 sm:space-y-6 self-center">
              
              {/* Live Indicator Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A9D8F]/20 border border-[#2A9D8F]/50 text-[#38BFB0] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#38BFB0] animate-ping shrink-0" />
                <span>Ganesh Chaturthi 2026 · Mumbai Live</span>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.08] tracking-tight">
                  Mumbai Moves.
                </h1>
                <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight bg-gradient-to-r from-[#38BFB0] via-[#E69A2E] to-[#F0B848] bg-clip-text text-transparent">
                  We Keep It Flowing.
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed max-w-xl">
                PRAVAAH is a predictive, closed-loop city resilience platform that forecasts crowd bottlenecks, simulates interventions, explains decisions, and guides citizens toward less crowded routes — without individual tracking.
              </p>

              {/* Tagline Repeat */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-extrabold text-white/70">
                <span>Predict.</span>
                <span>Simulate.</span>
                <span>Decide.</span>
                <span>Act.</span>
                <span className="text-[#E69A2E]">Repeat.</span>
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1 w-full sm:w-auto">
                <Link
                  to="/control-room/overview"
                  className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#E69A2E] to-[#F0B848] text-[#0B2342] font-black text-sm px-6 py-3.5 sm:py-4 rounded-xl shadow-xl shadow-[#E69A2E]/30 hover:scale-105 transition-all text-center"
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Enter Control Room</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
                <Link
                  to="/visitor"
                  className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm px-6 py-3.5 sm:py-4 rounded-xl backdrop-blur-sm transition-all text-center"
                >
                  <Users className="w-4 h-4 text-[#38BFB0] shrink-0" />
                  <span>Visitor Companion</span>
                </Link>
              </div>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15 w-full max-w-lg">
                {[
                  { val: '11+', label: 'Zones Monitored', color: '#38BFB0' },
                  { val: '163K', label: 'Live Devotees', color: '#E69A2E' },
                  { val: '25+', label: 'What-If Scenarios', color: '#CBD8E8' },
                ].map((s, i) => (
                  <div key={i} className="text-left">
                    <div className="text-lg sm:text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.val}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/60 font-semibold uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Dashboard Screenshot Container */}
            <div className="lg:col-span-6 flex flex-col justify-center items-center w-full max-w-xl lg:max-w-none mx-auto self-center">
              <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#0B1F38]/90">
                
                {/* Fake Chrome Bar */}
                <div className="bg-[#0B1F38] px-3 sm:px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B03A2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E69A2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" />
                    <span className="text-[10px] font-mono text-white/50 ml-2 hidden sm:inline">pravaah.city/control-room · LIVE</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#38BFB0]">
                    <span className="w-2 h-2 rounded-full bg-[#38BFB0] animate-ping" />
                    TELEMETRY ACTIVE
                  </span>
                </div>

                {/* Screenshot Image (Fluid & Responsive) */}
                <img
                  src="/pravaah-hero.png"
                  alt="PRAVAAH Control Room Interface"
                  className="w-full h-auto object-cover block"
                  loading="eager"
                />
              </div>

              {/* Context Pill Badge */}
              <div className="mt-3 w-full flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15 text-xs text-white">
                <span className="font-semibold">Deterministic Digital Twin</span>
                <span className="text-tealLight font-bold">11 Monitored Hubs Active</span>
              </div>
            </div>

          </div>
        </div>
      </PhotoSection>

      {/* ═══ AUDIENCE STRIP (Mobile Adaptive Grid) ═════════ */}
      <section className="bg-[#0B2342] border-t-2 border-[#2A9D8F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { icon: Shield, label: 'For Authorities', desc: 'Make faster, data-driven decisions with confidence.', color: '#E69A2E' },
              { icon: Activity, label: 'For Operators', desc: 'Optimize transit operations and improve network flow.', color: '#2A9D8F' },
              { icon: Users, label: 'For Citizens', desc: 'Travel smarter with real-time crowd-aware guidance.', color: '#8B7CF6' },
              { icon: Brain, label: 'For a Resilient Mumbai', desc: 'Safer. Smarter. Stronger. Together.', color: '#38BFB0' },
            ].map((a, i) => (
              <div key={i} className="p-4 sm:p-6 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${a.color}20` }}>
                  <a.icon className="w-5 h-5" style={{ color: a.color }} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-0.5">{a.label}</h4>
                  <p className="text-xs text-white/70 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS (Aerial City Background) ═════════ */}
      <PhotoSection
        id="how-it-works"
        img="/img-aerial.jpg"
        overlay="rgba(11,35,66,0.88)"
        className="py-16 sm:py-24"
      >
        <FadeUp className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A9D8F]/20 border border-[#2A9D8F]/40 text-[#38BFB0] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Core Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">How PRAVAAH Thinks</h2>
          <p className="text-sm sm:text-base text-white/80 mt-3 leading-relaxed">
            A continuous closed-loop feedback system — from early signal detection to counterfactual intervention.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {[
            { num: '01', icon: TrendingUp, title: 'PREDICT', color: '#2A9D8F', link: '/control-room/predictions', desc: 'Multi-horizon pressure forecasting (30m, 60m, 120m, 180m) using physics-calibrated crowd models across 11 transit nodes.', tag: 'Graph Density · Propagation' },
            { num: '02', icon: Zap, title: 'ORCHESTRATE', color: '#E69A2E', link: '/control-room/actions', desc: 'Ranked intervention engine — evaluates diversion corridors, models counterfactual impact, issues field-ready routing orders.', tag: 'Dijkstra Routing · Side-Effects' },
            { num: '03', icon: Activity, title: 'BALANCE', color: '#8B7CF6', link: '/control-room/overview', desc: 'Continuous telemetry compares forecast vs. observed, driving adaptive pressure equalization across all corridors in real time.', tag: 'Real-time Delta · Convergence' },
          ].map((c, i) => (
            <FadeUp key={i} delay={i * 100}>
              <Link
                to={c.link}
                className="group block bg-[#0B2342]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-full hover:border-white/30 hover:-translate-y-1 transition-all duration-300 shadow-xl"
                style={{ borderTop: `4px solid ${c.color}` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-3xl font-black tabular-nums" style={{ color: c.color }}>{c.num}</span>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${c.color}20` }}>
                    <c.icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{c.title}</h3>
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed mb-4">{c.desc}</p>
                <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: c.color }}>
                  <span>{c.tag}</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </PhotoSection>

      {/* ═══ MUMBAI ZONES (Ganesh Procession Background) ═══ */}
      <PhotoSection
        id="zones"
        img="/img-procession.jpg"
        overlay="rgba(6,15,35,0.9)"
        className="py-16 sm:py-24"
      >
        <FadeUp className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E69A2E]/20 border border-[#E69A2E]/40 text-[#E69A2E] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
            <Map className="w-3.5 h-3.5" />
            <span>Live Mumbai Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Every Zone. Every Moment.</h2>
          <p className="text-sm sm:text-base text-white/80 mt-3 leading-relaxed">
            Real-time crowd pressure across 12 key Mumbai locations — from Lalbaugcha Raja to Vashi Relief Terminal.
          </p>
        </FadeUp>

        {/* Dynamic Responsive Grid: 1 col on mobile, 2 on tablet, 3 on laptop, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {MUMBAI_LOCATIONS.map((loc, i) => (
            <LocationCard key={loc.name} loc={loc} index={i} />
          ))}
        </div>

        {/* Legend */}
        <FadeUp delay={200} className="flex justify-center gap-4 sm:gap-8 mt-8 sm:mt-12 flex-wrap text-xs font-semibold text-white/70">
          {[
            { color: '#B03A2E', label: 'CRITICAL (>85)' },
            { color: '#B05E1A', label: 'HIGH (70–85)' },
            { color: '#E69A2E', label: 'ELEVATED (60–70)' },
            { color: '#38BFB0', label: 'LOW / MODERATE (<60)' },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span>{l.label}</span>
            </div>
          ))}
        </FadeUp>
      </PhotoSection>

      {/* ═══ CONTROL ROOM SHOWCASE (Chowpatty Background) ══ */}
      <PhotoSection
        img="/img-chowpatty.jpg"
        overlay="rgba(8,20,45,0.88)"
        className="py-16 sm:py-24"
      >
        <FadeUp className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">The Command Interface</h2>
          <p className="text-sm sm:text-base text-white/80 mt-2 leading-relaxed">
            Real-time Mumbai map, zone pressure matrix, and AI intervention recommendations in one unified viewport.
          </p>
        </FadeUp>

        <FadeUp delay={100} className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#0B1F38]">
            <div className="bg-[#08172C] px-4 py-2.5 flex items-center justify-between border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B03A2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E69A2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F]" />
                <span className="text-white/50 font-mono text-[11px] ml-2 hidden sm:inline">pravaah.city/control-room/overview</span>
              </div>
              <span className="text-[#38BFB0] font-bold text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#38BFB0] animate-pulse" /> LIVE SIMULATION
              </span>
            </div>
            <img
              src="/pravaah-hero.png"
              alt="PRAVAAH Control Room Overview"
              className="w-full h-auto object-cover block"
              loading="lazy"
            />
          </div>
        </FadeUp>
      </PhotoSection>

      {/* ═══ GLASS BOX EXPLAINABILITY (Hotel Lobby Background) */}
      <PhotoSection
        img="/img-hotel.jpg"
        overlay="rgba(11,35,66,0.85)"
        className="py-16 sm:py-24"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <FadeUp className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A9D8F]/20 border border-[#2A9D8F]/40 text-[#38BFB0] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Explainable Civic AI</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Why did PRAVAAH<br />recommend this?
            </h2>
            
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Every recommendation comes with a fully inspectable <strong className="text-white">Glass Box</strong> audit trail — observed telemetry, physical constraints, historical baseline, and projected impact. No opaque black-box decisions.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {[
                { icon: Brain, label: 'Causal Reasoning' },
                { icon: Lock, label: 'Privacy by Design' },
                { icon: CheckCircle2, label: 'Auditable Log' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
                  <t.icon className="w-3.5 h-3.5 text-[#38BFB0]" />
                  <span>{t.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                to="/control-room/glass-box"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2A9D8F]/20 hover:bg-[#2A9D8F]/30 border border-[#2A9D8F]/50 text-[#38BFB0] font-bold text-xs sm:text-sm transition-all"
              >
                <span>Inspect Live Audit Trail</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={150} className="lg:col-span-6">
            <div className="bg-[#060F1E]/90 backdrop-blur-md rounded-2xl overflow-hidden border border-white/15 shadow-2xl font-mono text-xs">
              <div className="bg-[#0B1F38] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <span className="text-white/60 font-bold text-[10px] tracking-wider uppercase">Decision Trace · ACT-2026-0908-01</span>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#2A9D8F]/20 text-[#38BFB0] border border-[#2A9D8F]/40">VERIFIED</span>
              </div>
              <div className="p-4 sm:p-5 space-y-3.5">
                {[
                  { key: 'TRIGGER EVIDENCE', value: 'Curry Road footbridge ingress velocity: 0.4 m/s (critical < 0.6). Density: 4.8 pers/m².', color: '#B03A2E' },
                  { key: 'CONSTRAINTS CHECKED', value: 'Thane buffer: 62% available · Western Railway: OPERATIONAL · Side-effect: 0.18', color: '#E69A2E' },
                  { key: 'CANDIDATES EVALUATED', value: '25 routing combinations tested via Dijkstra network graph.', color: '#8B7CF6' },
                  { key: 'EXPECTED OUTCOME', value: '−18 pts pressure on Curry Road within 15 min. No secondary bottleneck created.', color: '#38BFB0' },
                ].map((row, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-[9px] font-extrabold uppercase tracking-wider" style={{ color: row.color }}>{row.key}</div>
                    <div className="text-white/85 bg-white/5 p-2.5 rounded-lg border border-white/5 leading-relaxed text-[11px]">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </PhotoSection>

      {/* ═══ TWO PERSPECTIVES (Marine Drive Background) ════ */}
      <PhotoSection
        img="/img-marine.jpg"
        overlay="rgba(11,35,66,0.85)"
        className="py-16 sm:py-24"
      >
        <FadeUp className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Command for Operators.<br />Safety for Visitors.
          </h2>
          <p className="text-sm sm:text-base text-white/80 mt-2 leading-relaxed">
            PRAVAAH synchronizes city command centers with citizen mobile navigation in real time.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: LayoutDashboard, color: '#2A9D8F', label: 'OPERATOR',
              title: 'PRAVAAH Control Room',
              desc: 'Complete situational awareness for transit directors, law enforcement, and municipal commissioners.',
              points: ['Real-time MapLibre crowd flow across 11 zones', 'Multi-horizon predictive saturation engine', 'Interactive What-If disruption sandbox', 'Glass Box rationale for every recommendation'],
              cta: 'Launch Control Room', link: '/control-room/overview', ctaBg: '#2A9D8F', textDark: false,
            },
            {
              icon: Users, color: '#E69A2E', label: 'CITIZEN',
              title: 'Visitor Companion',
              desc: 'City intelligence distilled into peaceful pilgrimage guidance — without individual tracking.',
              points: ['Destination crowd ratings & wait forecasts', 'Low-pressure alternative walking routes', 'Medical & welfare kiosk locations', 'Privacy by design · No tracking'],
              cta: 'Explore Visitor Guide', link: '/visitor', ctaBg: '#E69A2E', textDark: true,
            }
          ].map((c, i) => (
            <FadeUp key={i} delay={i * 120}>
              <div className="bg-[#0B2342]/85 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-2xl hover:border-white/30 transition-all"
                style={{ borderTop: `4px solid ${c.color}` }}>
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${c.color}20` }}>
                      <c.icon className="w-6 h-6" style={{ color: c.color }} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border"
                      style={{ color: c.color, background: `${c.color}15`, borderColor: `${c.color}40` }}>
                      {c.label}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed mb-5">{c.desc}</p>

                  <ul className="space-y-2.5 mb-6">
                    {c.points.map((p, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: c.color }} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={c.link}
                  className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] ${
                    c.textDark ? 'text-[#0B2342]' : 'text-white'
                  }`}
                  style={{ background: c.ctaBg }}
                >
                  <span>{c.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeUp>
          ))}
        </div>
      </PhotoSection>

      {/* ═══ PRIVACY & ETHICS STRIP ════════════════════════ */}
      <section className="bg-[#0B2342] py-6 px-4 border-t-2 border-[#2A9D8F]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center sm:text-left">
          {[
            { icon: Lock, label: 'No individual tracking.', sub: 'Privacy by design.', color: '#2A9D8F' },
            { icon: Eye, label: 'Transparent. Ethical.', sub: 'Accountable civic AI.', color: '#E69A2E' },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${p.color}20` }}>
                <p.icon className="w-5 h-5" style={{ color: p.color }} />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">{p.label}</div>
                <div className="text-xs font-bold" style={{ color: p.color }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA SECTION (Aerial Background) ═════════ */}
      <PhotoSection
        img="/img-aerial.jpg"
        overlay="linear-gradient(160deg, rgba(11,35,66,0.94) 0%, rgba(18,49,91,0.88) 60%, rgba(42,157,143,0.35) 100%)"
        className="py-20 sm:py-28 text-center"
      >
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <FadeUp className="flex flex-col items-center">
            <PravaahBrandLogo variant="dark" size="lg" className="mb-4" />
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to experience<br />
              <span className="bg-gradient-to-r from-[#38BFB0] to-[#F0B848] bg-clip-text text-transparent">PRAVAAH?</span>
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-4 leading-relaxed">
              Explore the live Ganesh Chaturthi 2026 Mumbai command center. Test real scenarios, inspect predictive models, and audit intervention decisions.
            </p>
          </FadeUp>

          <FadeUp delay={100} className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
            <Link
              to="/control-room/overview"
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#E69A2E] to-[#F0B848] text-[#0B2342] font-black text-sm px-8 py-4 rounded-xl shadow-xl shadow-[#E69A2E]/30 hover:scale-105 transition-all"
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Enter the Control Room</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
            <Link
              to="/visitor"
              className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm px-6 py-4 rounded-xl backdrop-blur-sm transition-all"
            >
              <Users className="w-4 h-4 text-[#38BFB0] shrink-0" />
              <span>Explore Visitor View</span>
            </Link>
          </FadeUp>
        </div>
      </PhotoSection>

      {/* ═══ FOOTER ════════════════════════════════════════ */}
      <footer className="bg-[#08172C] text-white/60 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10">
            
            <div className="lg:col-span-2 space-y-3">
              <PravaahBrandLogo variant="dark" size="sm" />
              <p className="text-xs text-white/70 leading-relaxed max-w-sm">
                Predictive Resilience & Adaptive Versatile Assistance for All in Harmony. Built for Ganesh Chaturthi 2026, Mumbai.
              </p>
              <div className="text-[10px] font-extrabold text-[#E69A2E] tracking-widest uppercase">
                PREDICT · SIMULATE · DECIDE · ACT · REPEAT
              </div>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Control Room</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/control-room/overview" className="hover:text-white transition-colors">Overview Dashboard</Link></li>
                <li><Link to="/control-room/live-city" className="hover:text-white transition-colors">Live City GIS</Link></li>
                <li><Link to="/control-room/predictions" className="hover:text-white transition-colors">Predictions</Link></li>
                <li><Link to="/control-room/actions" className="hover:text-white transition-colors">Interventions</Link></li>
                <li><Link to="/control-room/glass-box" className="hover:text-white transition-colors">Glass Box Trace</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Infrastructure</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/control-room/mobility" className="hover:text-white transition-colors">Mobility & Trains</Link></li>
                <li><Link to="/control-room/hospitality" className="hover:text-white transition-colors">Hospitality & Beds</Link></li>
                <li><Link to="/control-room/welfare" className="hover:text-white transition-colors">Civic Welfare</Link></li>
                <li><Link to="/control-room/scenarios" className="hover:text-white transition-colors">What-If Scenarios</Link></li>
                <li><Link to="/control-room/impact" className="hover:text-white transition-colors">Impact Analysis</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Visitor Guide</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/visitor/plan" className="hover:text-white transition-colors">Plan Your Visit</Link></li>
                <li><Link to="/visitor/route" className="hover:text-white transition-colors">Find Transit Route</Link></li>
                <li><Link to="/visitor/stay" className="hover:text-white transition-colors">Stay & Safety</Link></li>
                <li><Link to="/visitor/support" className="hover:text-white transition-colors">Emergency Aid</Link></li>
                <li><Link to="/visitor/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2026 PRAVAAH. Urban Intelligence Platform. All rights reserved.</p>
            <div className="flex items-center gap-2 text-[#38BFB0]">
              <span className="w-2 h-2 rounded-full bg-[#38BFB0] animate-pulse" />
              <span>Calibrated for Ganesh Chaturthi 2026 Mumbai</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Styles for Background Parallax & Animation ──── */}
      <style>{`
        .photo-bg {
          background-attachment: scroll;
        }
        @media (min-width: 1024px) {
          .photo-bg {
            background-attachment: fixed;
          }
        }
      `}</style>
    </div>
  )
}