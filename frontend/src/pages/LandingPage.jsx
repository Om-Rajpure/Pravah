/**
 * PRAVAAH Landing Page — Official Brand Redesign
 * Colors: Navy #12315B | Teal #2A9D8F | Amber #E69A2E | Light #F0F4F8
 * Matches the brand poster: "Mumbai Moves. We Keep It Flowing."
 */
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, LayoutDashboard, TrendingUp, Zap, Shield,
  FlaskConical, BarChart3, Hotel, TrainFront, HeartHandshake,
  Users, Activity, CheckCircle2, Menu, X, Eye,
  Map, Brain, Lock, Sparkles, ChevronRight, Radio
} from 'lucide-react'

/* ──────────────────────────────────────────────────────
   BRAND COLORS (matched from provided brand image)
────────────────────────────────────────────────────── */
const C = {
  navy:    '#12315B',
  navyMid: '#1A4070',
  navyDark:'#0B2342',
  teal:    '#2A9D8F',
  tealLight:'#38BFB0',
  amber:   '#E69A2E',
  amberDark:'#C87524',
  red:     '#B03A2E',
  bg:      '#F0F4F8',
  bgCard:  '#FFFFFF',
  text:    '#17212B',
  textSub: '#4A6080',
  border:  '#D4E2F0',
}

/* ──────────────────────────────────────────────────────
   MUMBAI LOCATIONS — scrolling showcase
────────────────────────────────────────────────────── */
const MUMBAI_LOCATIONS = [
  {
    name: 'Lalbaugcha Raja',
    area: 'Lalbaug, Central Mumbai',
    type: 'Ganesh Mandal',
    pressure: 94,
    status: 'CRITICAL',
    statusColor: C.red,
    visitors: '2.8L+',
    desc: 'Main procession origin. Maximum footfall zone during immersion.',
    facts: ['Footbridge at 96% capacity', '4.8 persons/m² density', 'Arrival: +12,000/hr'],
  },
  {
    name: 'Dadar Station',
    area: 'Dadar, Western + Central',
    type: 'Transit Hub',
    pressure: 88,
    status: 'HIGH',
    statusColor: '#B05E1A',
    visitors: '6.5L/day',
    desc: 'Busiest interchange on Ganesh Chaturthi. Central + Western line convergence.',
    facts: ['Platform 1–4 overloaded', 'Bus terminus at 89%', 'Taxi queue: 3.2km'],
  },
  {
    name: 'Curry Road Station',
    area: 'Lower Parel, Central Line',
    type: 'Train Station',
    pressure: 91,
    status: 'CRITICAL',
    statusColor: C.red,
    visitors: '1.2L/day',
    desc: 'PRAVAAH hotspot — narrow footbridge creates catastrophic bottleneck risk.',
    facts: ['Velocity: 0.4 m/s (critical)', 'Platform overflow risk', 'Intervention active'],
  },
  {
    name: 'Girgaon Chowpatty',
    area: 'Marine Lines, South Mumbai',
    type: 'Immersion Beach',
    pressure: 86,
    status: 'HIGH',
    statusColor: '#B05E1A',
    visitors: '4L+',
    desc: 'Primary immersion ground. Crowd density peaks post-midnight on Day 10.',
    facts: ['Beach access: 73% capacity', 'Marine Drive closed', 'NDRF deployed'],
  },
  {
    name: 'Bandra Station',
    area: 'Bandra, Western Suburbs',
    type: 'Transit Hub',
    pressure: 72,
    status: 'ELEVATED',
    statusColor: C.amber,
    visitors: '4.8L/day',
    desc: 'Western line suburban hub. Multiple connecting routes to North Mumbai.',
    facts: ['Skywalk at 68%', 'Auto stand: overflow', '2 extra trains added'],
  },
  {
    name: 'Andheri Station',
    area: 'Andheri, Western Line',
    type: 'Transit Hub',
    pressure: 68,
    status: 'ELEVATED',
    statusColor: C.amber,
    visitors: '5.2L/day',
    desc: 'North–South transit gateway. Metro Line 1 interchange sees surge traffic.',
    facts: ['Metro: 81% load', 'Parking: full', 'Western railway: normal'],
  },
  {
    name: 'Kurla Complex',
    area: 'Kurla, Central Suburbs',
    type: 'Multi-modal Hub',
    pressure: 79,
    status: 'HIGH',
    statusColor: '#B05E1A',
    visitors: '3.9L/day',
    desc: 'LTT terminus + local station. Key intercity train connections.',
    facts: ['LTT: 4 specials added', 'BEST bus rerouted', 'Hawker zone cleared'],
  },
  {
    name: 'Parel Junction',
    area: 'Parel, Central Line',
    type: 'Train Station',
    pressure: 76,
    status: 'HIGH',
    statusColor: '#B05E1A',
    visitors: '1.8L/day',
    desc: 'Industrial corridor that transforms into a pilgrimage corridor during Chaturthi.',
    facts: ['Hospital proximity alert', 'Ambulance corridor open', 'Police bandobast: high'],
  },
  {
    name: 'CST / CSMT',
    area: 'Fort, South Mumbai',
    type: 'Heritage Terminal',
    pressure: 58,
    status: 'MODERATE',
    statusColor: C.teal,
    visitors: '7L/day',
    desc: 'UNESCO heritage terminus. Handles long-distance + suburban convergence.',
    facts: ['Mainline: normal', '18 platforms active', 'Underground tunnel open'],
  },
  {
    name: 'Ghatkopar',
    area: 'Ghatkopar, Eastern Suburbs',
    type: 'Metro Interchange',
    pressure: 61,
    status: 'MODERATE',
    statusColor: C.teal,
    visitors: '2.1L/day',
    desc: 'Metro Line 1 eastern terminal. Absorbs overflow from Kurla + Vikhroli.',
    facts: ['Metro: running normally', 'Auto: 40 min wait', 'Buffer zone active'],
  },
  {
    name: 'Thane Station',
    area: 'Thane, Central Suburbs',
    type: 'Relief Terminal',
    pressure: 44,
    status: 'LOW',
    statusColor: '#2A9D8F',
    visitors: '3.3L/day',
    desc: 'PRAVAAH-designated relief corridor. 18% flow diverted here from Curry Road.',
    facts: ['Buffer capacity: 62%', 'Diversion active', '−18 pts relief achieved'],
  },
  {
    name: 'Vashi Terminal',
    area: 'Navi Mumbai, Harbour Line',
    type: 'Relief Terminal',
    pressure: 38,
    status: 'LOW',
    statusColor: '#2A9D8F',
    visitors: '1.6L/day',
    desc: 'Navi Mumbai buffer zone. Harbour Line trains dispatched at 15-min frequency.',
    facts: ['Capacity: 72% free', 'Extra trains: 6/hr', 'Hotel occupancy: 55%'],
  },
]

/* ──────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function FadeUp({ children, delay = 0, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={className}
      style={{
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
      }}>
      {children}
    </div>
  )
}

function PressureBar({ value, color }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{ height: '6px', background: '#E8EEF5', borderRadius: '99px', overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        borderRadius: '99px',
        background: color,
        width: inView ? `${value}%` : '0%',
        transition: 'width 1s ease 0.3s',
        boxShadow: `0 0 8px ${color}60`,
      }} />
    </div>
  )
}

/* ──────────────────────────────────────────────────────
   LOCATION CARD
────────────────────────────────────────────────────── */
function LocationCard({ loc, index }) {
  const [ref, inView] = useInView(0.1)
  const isEven = index % 2 === 0

  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateX(0)' : `translateX(${isEven ? '-40px' : '40px'})`,
      transition: `opacity 0.7s ease ${(index % 4) * 80}ms, transform 0.7s ease ${(index % 4) * 80}ms`,
    }}>
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 12px rgba(18,49,91,0.06)',
        borderTop: `3px solid ${loc.statusColor}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: C.textSub, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>
              {loc.type} · {loc.area}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>{loc.name}</div>
          </div>
          <div style={{
            fontSize: '9px', fontWeight: 800, padding: '4px 8px', borderRadius: '999px',
            color: 'white', background: loc.statusColor, letterSpacing: '0.1em',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{loc.status}</div>
        </div>

        {/* Pressure */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'baseline' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: C.textSub, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Crowd Pressure
            </span>
            <span style={{ fontSize: '22px', fontWeight: 900, color: loc.statusColor, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {loc.pressure}<span style={{ fontSize: '12px', fontWeight: 600, color: C.textSub }}>/100</span>
            </span>
          </div>
          <PressureBar value={loc.pressure} color={loc.statusColor} />
        </div>

        {/* Description */}
        <p style={{ fontSize: '11px', color: C.textSub, lineHeight: 1.55, margin: 0, flex: 1 }}>{loc.desc}</p>

        {/* Facts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {loc.facts.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: C.text }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: loc.statusColor, flexShrink: 0 }} />
              {f}
            </div>
          ))}
        </div>

        {/* Visitors badge */}
        <div style={{
          marginTop: '4px', paddingTop: '10px',
          borderTop: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <Users style={{ width: '12px', height: '12px', color: C.teal }} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: C.teal }}>{loc.visitors} visitors tracked</span>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navScrolled = scrollY > 60

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.bg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── NAVIGATION ─────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: navScrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: navScrolled ? 'blur(12px)' : 'none',
        borderBottom: navScrolled ? `1px solid ${C.border}` : '1px solid transparent',
        boxShadow: navScrolled ? '0 2px 20px rgba(18,49,91,0.08)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/pravaah-logo.png" alt="PRAVAAH" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="hidden-mobile">
            {[
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Mumbai Zones', href: '#zones' },
              { label: 'Glass Box', to: '/control-room/glass-box' },
              { label: 'Visitor Guide', to: '/visitor' },
            ].map((item, i) =>
              item.to ? (
                <Link key={i} to={item.to} style={{ color: C.textSub, textDecoration: 'none', fontSize: '13px', fontWeight: 600, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = C.navy}
                  onMouseLeave={e => e.target.style.color = C.textSub}>
                  {item.label}
                </Link>
              ) : (
                <a key={i} href={item.href} style={{ color: C.textSub, textDecoration: 'none', fontSize: '13px', fontWeight: 600, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = C.navy}
                  onMouseLeave={e => e.target.style.color = C.textSub}>
                  {item.label}
                </a>
              )
            )}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/visitor" style={{
              color: C.textSub, textDecoration: 'none', fontSize: '13px', fontWeight: 600,
              padding: '8px 14px', borderRadius: '8px', border: `1px solid ${C.border}`,
              background: 'white', transition: 'all 0.2s',
            }} className="hidden-mobile">
              Visitor Guide
            </Link>
            <Link to="/control-room/overview" style={{
              background: `linear-gradient(135deg, ${C.amber}, #F0B848)`,
              color: C.navyDark,
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '13px',
              padding: '10px 20px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              boxShadow: `0 4px 14px ${C.amber}40`,
              transition: 'all 0.2s',
            }}>
              <LayoutDashboard style={{ width: '15px', height: '15px' }} />
              Control Room
            </Link>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: C.navy }}
              className="show-mobile">
              {mobileMenuOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div style={{ background: 'white', borderTop: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Control Room', to: '/control-room/overview', cta: true },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Mumbai Zones', href: '#zones' },
              { label: 'Visitor Guide', to: '/visitor' },
            ].map((item, i) =>
              item.to ? (
                <Link key={i} to={item.to} onClick={() => setMobileMenuOpen(false)} style={{
                  padding: '12px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '14px',
                  background: item.cta ? C.amber : 'transparent',
                  color: item.cta ? C.navyDark : C.navy,
                  textDecoration: 'none',
                }}>{item.label}</Link>
              ) : (
                <a key={i} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{
                  padding: '12px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
                  color: C.textSub, textDecoration: 'none',
                }}>{item.label}</a>
              )
            )}
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(160deg, ${C.navyDark} 0%, ${C.navy} 45%, #1E4D7B 100%)`,
        padding: '80px 24px 60px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: `linear-gradient(${C.teal} 1px, transparent 1px), linear-gradient(90deg, ${C.teal} 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
        {/* Teal glow orb */}
        <div style={{
          position: 'absolute', top: '20%', right: '15%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: `radial-gradient(circle, ${C.teal}25 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }} className="hero-grid">

            {/* Left: Pitch */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Live badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '999px',
                background: `${C.teal}20`, border: `1px solid ${C.teal}50`,
                color: C.tealLight, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', width: 'fit-content',
              }}>
                <Radio style={{ width: '12px', height: '12px' }} />
                Ganesh Chaturthi 2026 · Mumbai · Live Simulation
              </div>

              {/* Main headline — matching brand poster */}
              <div>
                <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 900, color: 'white', lineHeight: 1.05, margin: 0 }}>
                  Mumbai Moves.
                </h1>
                <h1 style={{ fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: 900, lineHeight: 1.05, margin: '4px 0 0',
                  background: `linear-gradient(90deg, ${C.tealLight}, ${C.amber})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  We Keep It Flowing.
                </h1>
              </div>

              <p style={{ fontSize: '15px', color: '#A0BACC', lineHeight: 1.7, margin: 0, maxWidth: '480px' }}>
                PRAVAAH is a predictive, closed-loop city resilience platform that forecasts crowd bottlenecks, simulates interventions, explains decisions, and guides citizens toward less crowded routes — without individual tracking.
              </p>

              {/* Tagline */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 700 }}>
                {['Predict.', 'Simulate.', 'Decide.', 'Act.'].map((w, i) => (
                  <span key={i} style={{ color: '#A0BACC' }}>{w}</span>
                ))}
                <span style={{ color: C.amber }}>Repeat.</span>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/control-room/overview" style={{
                  background: `linear-gradient(135deg, ${C.amber}, #F0B848)`,
                  color: C.navyDark, textDecoration: 'none', fontWeight: 800, fontSize: '14px',
                  padding: '14px 28px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: `0 8px 24px ${C.amber}40`,
                }}>
                  <LayoutDashboard style={{ width: '16px', height: '16px' }} />
                  Enter Control Room
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </Link>
                <Link to="/visitor" style={{
                  color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '14px',
                  padding: '14px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px',
                  border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.07)',
                }}>
                  <Users style={{ width: '16px', height: '16px', color: C.tealLight }} />
                  Visitor Guide
                </Link>
              </div>

              {/* Four pillars */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {[
                  { icon: TrendingUp, label: 'PREDICT', desc: 'Spot crowd bottlenecks hours in advance', color: C.teal },
                  { icon: FlaskConical, label: 'SIMULATE', desc: 'Test what-if interventions in real-time', color: C.amber },
                  { icon: Eye, label: 'EXPLAIN', desc: 'Causal, glass-box transparency', color: '#8B7CF6' },
                  { icon: Users, label: 'GUIDE', desc: 'Safer, less crowded routes for citizens', color: C.tealLight },
                ].map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <p.icon style={{ width: '14px', height: '14px', color: p.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: p.color, letterSpacing: '0.12em' }}>{p.label}</div>
                      <div style={{ fontSize: '10px', color: '#8AACC0', marginTop: '1px' }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Actual app screenshot */}
            <div style={{ position: 'relative' }}>
              {/* Glow behind screenshot */}
              <div style={{
                position: 'absolute', inset: '-20px',
                background: `radial-gradient(ellipse, ${C.teal}30 0%, transparent 70%)`,
                borderRadius: '20px', filter: 'blur(20px)',
              }} />
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.4)', border: `1px solid rgba(255,255,255,0.12)` }}>
                {/* Browser chrome */}
                <div style={{ background: '#0B1F38', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[C.red, C.amber, C.teal].map((c, i) => (
                      <span key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, display: 'block' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '10px', color: '#5A7A9A', fontFamily: 'monospace' }}>pravaah.city/control-room — LIVE</span>
                </div>
                <img src="/pravaah-hero.png" alt="PRAVAAH Control Room Dashboard" style={{ width: '100%', display: 'block' }} />
              </div>

              {/* Floating chips */}
              <div style={{ position: 'absolute', bottom: '-16px', left: '-16px',
                background: 'white', borderRadius: '12px', padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(18,49,91,0.15)', border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.teal, animation: 'pulse 2s infinite', flexShrink: 0 }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: C.navy }}>11 Zones · Live</span>
              </div>
              <div style={{ position: 'absolute', top: '50px', right: '-16px',
                background: 'white', borderRadius: '12px', padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(18,49,91,0.15)', border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap style={{ width: '14px', height: '14px', color: C.amber }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: C.navy }}>−18 pts pressure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUDIENCE STRIP ─────────────────────────────────── */}
      <section style={{ background: C.navy, borderTop: `2px solid ${C.teal}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }} className="audience-grid">
          {[
            { icon: Shield, label: 'For Authorities', desc: 'Make faster, data-driven decisions with confidence.', color: C.amber },
            { icon: Activity, label: 'For Operators', desc: 'Optimize operations and improve network flow.', color: C.teal },
            { icon: Users, label: 'For Citizens', desc: 'Travel smarter with real-time crowd-aware guidance.', color: '#8B7CF6' },
            { icon: Brain, label: 'For a Resilient Mumbai', desc: 'Safer. Smarter. Stronger. Together.', color: C.tealLight },
          ].map((a, i) => (
            <div key={i} style={{
              padding: '20px 20px',
              borderRight: i < 3 ? `1px solid rgba(255,255,255,0.1)` : 'none',
              display: 'flex', alignItems: 'flex-start', gap: '12px',
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${a.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <a.icon style={{ width: '18px', height: '18px', color: a.color }} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'white', marginBottom: '2px' }}>{a.label}</div>
                <div style={{ fontSize: '10.5px', color: '#8AACC0', lineHeight: 1.5 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp className="text-center-block">
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '999px', marginBottom: '16px',
                background: `${C.teal}15`, border: `1px solid ${C.teal}40`,
                color: C.teal, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>
                <Sparkles style={{ width: '11px', height: '11px' }} />
                Core Architecture
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: C.navy, margin: '0 0 12px', lineHeight: 1.2 }}>
                How PRAVAAH Thinks
              </h2>
              <p style={{ fontSize: '15px', color: C.textSub, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                A continuous closed-loop from signal detection to field-ready action.
              </p>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="three-col">
            {[
              { num: '01', icon: TrendingUp, title: 'PREDICT', color: C.teal, link: '/control-room/predictions',
                desc: 'Multi-horizon pressure forecasting (30m, 60m, 120m, 180m) using physics-calibrated crowd models across all 11 transit nodes.',
                tag: 'Graph Density · Network Propagation' },
              { num: '02', icon: Zap, title: 'ORCHESTRATE', color: C.amber, link: '/control-room/actions',
                desc: 'Ranked intervention engine — evaluates diversion corridors, models counterfactual impact, and issues field-ready routing orders.',
                tag: 'Dijkstra Routing · Side-Effect Penalty' },
              { num: '03', icon: Activity, title: 'BALANCE', color: '#8B7CF6', link: '/control-room/overview',
                desc: 'Continuous network telemetry compares forecast vs. observed, driving adaptive pressure equalization across all transit corridors.',
                tag: 'Real-time Delta · Network Convergence' },
            ].map((c, i) => (
              <FadeUp key={i} delay={i * 120}>
                <Link to={c.link} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white', border: `1px solid ${C.border}`, borderRadius: '16px',
                    padding: '28px', height: '100%', boxSizing: 'border-box',
                    boxShadow: '0 2px 12px rgba(18,49,91,0.05)',
                    borderTop: `4px solid ${c.color}`,
                    transition: 'all 0.2s', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: '16px',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${c.color}20` }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(18,49,91,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '32px', fontWeight: 900, color: c.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{c.num}</span>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <c.icon style={{ width: '20px', height: '20px', color: c.color }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: C.navy, marginBottom: '8px' }}>{c.title}</div>
                      <p style={{ fontSize: '13px', color: C.textSub, lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: c.color }}>{c.tag}</span>
                      <ChevronRight style={{ width: '12px', height: '12px', color: c.color }} />
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── MUMBAI LOCATIONS — Scroll Reveal ───────────────── */}
      <section id="zones" style={{ padding: '80px 24px', background: C.bg }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '999px', marginBottom: '16px',
                background: `${C.navy}12`, border: `1px solid ${C.navy}25`,
                color: C.navy, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>
                <Map style={{ width: '11px', height: '11px' }} />
                Live Mumbai Intelligence
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: C.navy, margin: '0 0 12px', lineHeight: 1.2 }}>
                Every Zone. Every Moment.
              </h2>
              <p style={{ fontSize: '15px', color: C.textSub, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                PRAVAAH monitors pressure across 12 key Mumbai locations — from Lalbaugcha Raja to Vashi Terminal — in real time.
              </p>
            </div>
          </FadeUp>

          {/* Scrolling location cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="loc-grid">
            {MUMBAI_LOCATIONS.map((loc, i) => (
              <LocationCard key={loc.name} loc={loc} index={i} />
            ))}
          </div>

          {/* Legend */}
          <FadeUp delay={300}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
              {[
                { color: C.red, label: 'CRITICAL (>85)' },
                { color: '#B05E1A', label: 'HIGH (70–85)' },
                { color: C.amber, label: 'ELEVATED (60–70)' },
                { color: C.teal, label: 'MODERATE / LOW (<60)' },
              ].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: C.textSub }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                  {l.label}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── DASHBOARD SCREENSHOT SHOWCASE ──────────────────── */}
      <section style={{ padding: '80px 24px', background: C.navy, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: 'white', margin: '0 0 12px', lineHeight: 1.2 }}>
                The Command Interface
              </h2>
              <p style={{ fontSize: '15px', color: '#8AACC0', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                Real-time Mumbai map, zone pressure matrix, AI recommendations — all in one unified screen.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={150}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ background: '#0B1F38', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[C.red, C.amber, C.teal].map((c, i) => (
                    <span key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: '#5A7A9A', fontFamily: 'monospace', flex: 1 }}>pravaah.city / control-room / overview — Ganesh Chaturthi 2026 · Day 9 · Evening</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 700, color: C.teal }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.teal, animation: 'pulse 2s infinite' }} />
                  LIVE
                </span>
              </div>
              <img src="/pravaah-hero.png" alt="PRAVAAH Control Room - Live City Overview" style={{ width: '100%', display: 'block' }} />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── GLASS BOX ──────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }} className="two-col">
            <FadeUp>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: '999px',
                  background: `${C.teal}15`, border: `1px solid ${C.teal}40`,
                  color: C.teal, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', width: 'fit-content',
                }}>
                  <Shield style={{ width: '11px', height: '11px' }} /> Explainable Civic AI
                </div>
                <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, color: C.navy, margin: 0, lineHeight: 1.15 }}>
                  Why did PRAVAAH<br />recommend this?
                </h2>
                <p style={{ fontSize: '14px', color: C.textSub, lineHeight: 1.75, margin: 0 }}>
                  Every recommendation comes with a fully inspectable <strong style={{ color: C.navy }}>Glass Box</strong> audit trail — observed telemetry, physical constraints, historical baseline, and projected impact. No black box. No hidden logic.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {[
                    { icon: Brain, label: 'Causal Reasoning' },
                    { icon: Lock, label: 'Privacy by Design' },
                    { icon: CheckCircle2, label: 'Auditable Decisions' },
                  ].map((t, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '7px',
                      padding: '8px 14px', borderRadius: '999px',
                      background: C.bg, border: `1px solid ${C.border}`,
                      fontSize: '12px', fontWeight: 600, color: C.navy,
                    }}>
                      <t.icon style={{ width: '13px', height: '13px', color: C.teal }} />
                      {t.label}
                    </div>
                  ))}
                </div>
                <Link to="/control-room/glass-box" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '12px 22px', borderRadius: '10px', width: 'fit-content',
                  background: `${C.teal}15`, border: `1px solid ${C.teal}50`,
                  color: C.teal, fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}>
                  Inspect Live Glass Box Audit
                  <ArrowRight style={{ width: '15px', height: '15px' }} />
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={150}>
              <div style={{ background: C.navyDark, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 16px 48px rgba(18,49,91,0.2)', fontFamily: 'monospace', fontSize: '11px' }}>
                <div style={{ background: '#0B1F38', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: '#7A96B8', fontWeight: 700, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Decision Trace · ACT-2026-0908-01</span>
                  <span style={{ fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '999px', background: `${C.teal}20`, color: C.tealLight, border: `1px solid ${C.teal}40` }}>VERIFIED</span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { key: 'TRIGGER EVIDENCE', value: 'Curry Road footbridge ingress velocity: 0.4 m/s (critical threshold < 0.6). Density: 4.8 pers/m².', color: C.red },
                    { key: 'CONSTRAINTS CHECKED', value: 'Thane buffer: 62% available · Western Railway: OPERATIONAL · Side-effect penalty: 0.18', color: C.amber },
                    { key: 'CANDIDATES EVALUATED', value: '25 routing combinations via Dijkstra + penalty function. Top score: act-redirect-curry-thane-18', color: '#8B7CF6' },
                    { key: 'EXPECTED OUTCOME', value: '−18 pts pressure on Curry Road within 15 min. No secondary bottleneck created.', color: C.tealLight },
                  ].map((row, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '8.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: row.color, marginBottom: '6px' }}>{row.key}</div>
                      <div style={{ color: '#CBD8E8', background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.6, fontSize: '11px' }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── TWO VIEWS ──────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: C.bg }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, color: C.navy, margin: '0 0 12px', lineHeight: 1.2 }}>
                Command for Operators.<br />Safety for Visitors.
              </h2>
              <p style={{ fontSize: '15px', color: C.textSub, maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
                PRAVAAH synchronizes city operations with citizen mobility.
              </p>
            </div>
          </FadeUp>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="two-col">
            {[
              {
                icon: LayoutDashboard, color: C.navy, label: 'OPERATOR',
                title: 'PRAVAAH Control Room',
                desc: 'Complete situational awareness for transit directors, law enforcement, and municipal commissioners. Live simulation, hotspot heatmaps, and counterfactual action modeling.',
                points: ['Real-time MapLibre crowd flow across 11 zones', 'Multi-horizon predictive saturation engine', 'Interactive What-If disruption sandbox', 'Glass Box rationale for every recommendation'],
                cta: 'Launch Control Room', link: '/control-room/overview',
                ctaStyle: { background: C.navy, color: 'white' },
              },
              {
                icon: Users, color: C.teal, label: 'CITIZEN',
                title: 'Visitor Companion',
                desc: 'City intelligence distilled into peaceful pilgrimage guidance. Safe routing, live queue estimates, accommodation status, and privacy-preserving crowd alerts.',
                points: ['Destination crowd ratings & wait-time forecasts', 'Low-pressure alternative walking routes', 'Real-time medical & welfare kiosk locations', 'No individual tracking · Privacy by design'],
                cta: 'Explore Visitor Guide', link: '/visitor',
                ctaStyle: { background: C.teal, color: 'white' },
              }
            ].map((c, i) => (
              <FadeUp key={i} delay={i * 150}>
                <div style={{
                  background: 'white', border: `1px solid ${C.border}`, borderRadius: '20px',
                  padding: '32px', boxShadow: '0 4px 20px rgba(18,49,91,0.06)',
                  display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', boxSizing: 'border-box',
                  borderTop: `4px solid ${c.color}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <c.icon style={{ width: '22px', height: '22px', color: c.color }} />
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.15em', padding: '4px 10px', borderRadius: '999px', background: `${c.color}15`, color: c.color, border: `1px solid ${c.color}30` }}>{c.label}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: C.navy, margin: '0 0 10px' }}>{c.title}</h3>
                    <p style={{ fontSize: '13px', color: C.textSub, lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, listStyle: 'none', padding: 0, margin: 0 }}>
                    {c.points.map((p, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '12.5px', color: C.text }}>
                        <CheckCircle2 style={{ width: '15px', height: '15px', color: c.color, flexShrink: 0, marginTop: '1px' }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link to={c.link} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '14px', borderRadius: '12px', fontWeight: 800, fontSize: '13px',
                    textDecoration: 'none', transition: 'opacity 0.2s',
                    ...c.ctaStyle,
                  }}>
                    {c.cta}
                    <ArrowRight style={{ width: '15px', height: '15px' }} />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY STRIP ──────────────────────────────────── */}
      <section style={{ background: C.navy, padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { icon: Lock, label: 'No individual tracking.', sub: 'Privacy by design.', color: C.teal },
            { icon: Eye, label: 'Transparent. Ethical.', sub: 'Accountable.', color: C.amber },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p.icon style={{ width: '20px', height: '20px', color: p.color }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>{p.label}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: p.color }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section style={{
        background: `linear-gradient(160deg, ${C.navyDark} 0%, ${C.navy} 60%, #1E4D7B 100%)`,
        padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: `linear-gradient(${C.teal} 1px, transparent 1px), linear-gradient(90deg, ${C.teal} 1px, transparent 1px)`,
          backgroundSize: '60px 60px' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <img src="/pravaah-logo.png" alt="PRAVAAH" style={{ height: '56px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.1, maxWidth: '640px' }}>
            Ready to experience PRAVAAH?
          </h2>
          <p style={{ fontSize: '15px', color: '#8AACC0', maxWidth: '520px', margin: 0, lineHeight: 1.7 }}>
            Explore the live Ganesh Chaturthi 2026 Mumbai command center. Test real scenarios, inspect predictive models, and audit every intervention decision.
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/control-room/overview" style={{
              background: `linear-gradient(135deg, ${C.amber}, #F0B848)`,
              color: C.navyDark, textDecoration: 'none', fontWeight: 800, fontSize: '14px',
              padding: '16px 32px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '9px',
              boxShadow: `0 8px 28px ${C.amber}40`,
            }}>
              <LayoutDashboard style={{ width: '17px', height: '17px' }} />
              Enter the Control Room
              <ArrowRight style={{ width: '17px', height: '17px' }} />
            </Link>
            <Link to="/visitor" style={{
              color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '14px',
              padding: '16px 28px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '9px',
              border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.07)',
            }}>
              <Users style={{ width: '17px', height: '17px', color: C.tealLight }} />
              Explore Visitor View
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ background: C.navyDark, borderTop: `1px solid rgba(255,255,255,0.07)`, padding: '48px 24px 28px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="footer-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <img src="/pravaah-logo.png" alt="PRAVAAH" style={{ height: '36px', objectFit: 'contain', filter: 'brightness(0) invert(1)', alignSelf: 'flex-start' }} />
              <p style={{ fontSize: '11.5px', color: '#7A96B8', lineHeight: 1.65, margin: 0, maxWidth: '280px' }}>
                Predictive Resilience & Adaptive Versatile Assistance for All in Harmony. Built for Ganesh Chaturthi 2026, Mumbai.
              </p>
              <span style={{ fontSize: '9px', fontWeight: 800, color: C.amber, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                PREDICT · SIMULATE · DECIDE · ACT · REPEAT
              </span>
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
                { label: 'Impact Analysis', to: '/control-room/impact' },
              ]},
              { title: 'Visitor Guide', links: [
                { label: 'Plan Your Visit', to: '/visitor/plan' },
                { label: 'Find Routes', to: '/visitor/route' },
                { label: 'Stay & Stay Safe', to: '/visitor/stay' },
                { label: 'Emergency Support', to: '/visitor/support' },
                { label: 'Privacy Policy', to: '/visitor/privacy' },
              ]},
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '14px' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {col.links.map((l, j) => (
                    <Link key={j} to={l.to} style={{ color: '#7A96B8', textDecoration: 'none', fontSize: '12px', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'white'}
                      onMouseLeave={e => e.target.style.color = '#7A96B8'}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '10.5px', color: '#4A6080', margin: 0 }}>© 2026 PRAVAAH. Urban Intelligence Platform. All rights reserved.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: C.teal }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.teal, animation: 'pulse 2s infinite' }} />
              Live Simulation · Ganesh Chaturthi 2026 · Mumbai
            </div>
          </div>
        </div>
      </footer>

      {/* Inline responsive styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .hero-grid { grid-template-columns: 1fr 1fr; }
        .three-col { grid-template-columns: repeat(3, 1fr); }
        .two-col { grid-template-columns: 1fr 1fr; }
        .loc-grid { grid-template-columns: repeat(4, 1fr); }
        .audience-grid { grid-template-columns: repeat(4, 1fr); }
        .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
        .hidden-mobile { display: flex !important; }
        .show-mobile { display: none !important; }

        @media (max-width: 1024px) {
          .loc-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 768px) {
          .hero-grid, .two-col, .three-col { grid-template-columns: 1fr !important; }
          .audience-grid { grid-template-columns: 1fr 1fr !important; }
          .loc-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (max-width: 480px) {
          .loc-grid { grid-template-columns: 1fr !important; }
          .audience-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}