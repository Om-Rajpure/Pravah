/**
 * PRAVAAH Landing Page — Immersive Photo Edition
 * Real Mumbai photography as section backgrounds with brand overlays
 */
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, LayoutDashboard, TrendingUp, Zap, Shield,
  FlaskConical, BarChart3, Hotel, TrainFront, HeartHandshake,
  Users, Activity, CheckCircle2, Menu, X, Eye,
  Map, Brain, Lock, Sparkles, ChevronRight, Radio, MapPin
} from 'lucide-react'

/* ─── Brand colors ───────────────────────────────────────── */
const C = {
  navy:     '#12315B',
  navyMid:  '#1A4070',
  navyDark: '#0B2342',
  teal:     '#2A9D8F',
  tealLight:'#38BFB0',
  amber:    '#E69A2E',
  amberDark:'#C87524',
  red:      '#B03A2E',
  bg:       '#F0F4F8',
  text:     '#17212B',
  textSub:  '#4A6080',
  border:   '#D4E2F0',
}

/* ─── Mumbai locations data ──────────────────────────────── */
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

/* ─── Helper hooks ────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function FadeUp({ children, delay = 0, style = {}, className = '' }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className={className} style={{
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(36px)',
      ...style,
    }}>{children}</div>
  )
}

/* ─── Animated pressure bar ──────────────────────────────── */
function PressureBar({ value, color }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{ height: '5px', background: 'rgba(255,255,255,0.15)', borderRadius: '99px', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: '99px', background: color,
        width: inView ? `${value}%` : '0%',
        transition: 'width 1.1s cubic-bezier(.22,.68,0,1.2) 0.3s',
        boxShadow: `0 0 10px ${color}80`,
      }} />
    </div>
  )
}

/* ─── Photo section wrapper ──────────────────────────────── */
function PhotoSection({ img, overlay = 'rgba(11,35,66,0.72)', children, style = {}, id }) {
  return (
    <section id={id} style={{
      position: 'relative', overflow: 'hidden', ...style
    }}>
      {/* Background photo */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }} />
      {/* Color overlay */}
      <div style={{ position: 'absolute', inset: 0, background: overlay }} />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </section>
  )
}

/* ─── Location card ──────────────────────────────────────── */
function LocationCard({ loc, index }) {
  const [ref, inView] = useInView(0.08)
  const isEven = index % 2 === 0
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
      transition: `all 0.6s ease ${(index % 4) * 70}ms`,
    }}>
      <div style={{
        background: 'rgba(11,35,66,0.82)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderTop: `3px solid ${loc.statusColor}`,
        borderRadius: '14px',
        padding: '18px',
        height: '100%',
        display: 'flex', flexDirection: 'column', gap: '11px',
        boxShadow: `0 8px 28px rgba(0,0,0,0.3), 0 0 0 0 ${loc.statusColor}`,
        transition: 'box-shadow 0.25s ease',
      }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,0.4), 0 0 0 1px ${loc.statusColor}60`}
        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.3)'}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '2px' }}>
              {loc.type}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>{loc.name}</div>
            <div style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>{loc.area}</div>
          </div>
          <div style={{
            fontSize: '8.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '999px',
            color: 'white', background: loc.statusColor, letterSpacing: '0.1em', flexShrink: 0, whiteSpace: 'nowrap',
          }}>{loc.status}</div>
        </div>

        {/* Pressure */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'baseline' }}>
            <span style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Crowd Pressure
            </span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: loc.statusColor, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
              {loc.pressure}<span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>/100</span>
            </span>
          </div>
          <PressureBar value={loc.pressure} color={loc.statusColor} />
        </div>

        {/* Description */}
        <p style={{ fontSize: '10.5px', color: 'rgba(200,216,232,0.9)', lineHeight: 1.55, margin: 0, flex: 1 }}>{loc.desc}</p>

        {/* Facts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {loc.facts.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9.5px', color: 'rgba(160,186,210,0.9)' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: loc.statusColor, flexShrink: 0 }} />
              {f}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin style={{ width: '11px', height: '11px', color: C.tealLight, flexShrink: 0 }} />
          <span style={{ fontSize: '9.5px', fontWeight: 700, color: C.tealLight }}>{loc.visitors} visitors</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
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
    <div style={{ fontFamily: "'Inter', sans-serif", color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ═══ NAV ═══════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: navScrolled ? 'rgba(11,35,66,0.95)' : 'rgba(11,35,66,0.4)',
        backdropFilter: 'blur(16px)',
        borderBottom: navScrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        boxShadow: navScrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
        transition: 'all 0.35s ease',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/pravaah-logo.png" alt="PRAVAAH" style={{ height: '34px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </Link>

          <nav className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {[
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Mumbai Zones', href: '#zones' },
              { label: 'Glass Box', to: '/control-room/glass-box' },
              { label: 'Visitor Guide', to: '/visitor' },
            ].map((item, i) => item.to ? (
              <Link key={i} to={item.to} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>{item.label}</Link>
            ) : (
              <a key={i} href={item.href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>{item.label}</a>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/visitor" className="nav-desktop" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s' }}>
              Visitor Mode
            </Link>
            <Link to="/control-room/overview" style={{
              background: `linear-gradient(135deg, ${C.amber}, #F0B848)`,
              color: C.navyDark, textDecoration: 'none', fontWeight: 800, fontSize: '13px',
              padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '7px',
              boxShadow: `0 4px 14px ${C.amber}50`,
            }}>
              <LayoutDashboard style={{ width: '15px', height: '15px' }} />
              Control Room
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="nav-mobile"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'white', display: 'none' }}>
              {mobileMenuOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div style={{ background: 'rgba(11,35,66,0.98)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Control Room', to: '/control-room/overview', cta: true },
              { label: 'Mumbai Zones', href: '#zones' }, { label: 'Visitor Guide', to: '/visitor' },
            ].map((item, i) => item.to ? (
              <Link key={i} to={item.to} onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', background: item.cta ? C.amber : 'transparent', color: item.cta ? C.navyDark : 'white', textDecoration: 'none' }}>{item.label}</Link>
            ) : (
              <a key={i} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ padding: '12px 16px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{item.label}</a>
            ))}
          </div>
        )}
      </header>

      {/* ═══ HERO — Station Background ══════════════════════ */}
      <PhotoSection
        img="/img-station.jpg"
        overlay={`linear-gradient(160deg, rgba(11,35,66,0.88) 0%, rgba(18,49,91,0.75) 50%, rgba(42,157,143,0.2) 100%)`}
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '64px' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Live badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 18px', borderRadius: '999px', width: 'fit-content',
                background: 'rgba(42,157,143,0.15)', border: '1px solid rgba(42,157,143,0.45)',
                color: C.tealLight, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: C.tealLight, animation: 'livepulse 2s infinite' }} />
                Ganesh Chaturthi 2026 · Mumbai · Live Simulation
              </div>

              {/* Headline */}
              <div>
                <h1 style={{ fontSize: 'clamp(40px, 6vw, 70px)', fontWeight: 900, color: 'white', lineHeight: 1.0, margin: '0 0 8px' }}>
                  Mumbai Moves.
                </h1>
                <h1 style={{
                  fontSize: 'clamp(40px, 6vw, 70px)', fontWeight: 900, lineHeight: 1.0, margin: 0,
                  background: `linear-gradient(90deg, ${C.tealLight}, ${C.amber})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>We Keep It Flowing.</h1>
              </div>

              <p style={{ fontSize: '15px', color: 'rgba(180,205,225,0.9)', lineHeight: 1.75, margin: 0, maxWidth: '500px' }}>
                PRAVAAH is a predictive, closed-loop city resilience platform that forecasts crowd bottlenecks, simulates interventions, explains decisions, and guides citizens toward less crowded routes — without individual tracking.
              </p>

              {/* Tagline */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '14px', fontWeight: 700 }}>
                {['Predict.', 'Simulate.', 'Decide.', 'Act.'].map((w, i) => (
                  <span key={i} style={{ color: 'rgba(180,205,225,0.8)' }}>{w}</span>
                ))}
                <span style={{ color: C.amber }}>Repeat.</span>
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/control-room/overview" style={{
                  background: `linear-gradient(135deg, ${C.amber}, #F0B848)`,
                  color: C.navyDark, textDecoration: 'none', fontWeight: 800, fontSize: '14px',
                  padding: '16px 30px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '9px',
                  boxShadow: `0 8px 28px ${C.amber}50`,
                }}>
                  <LayoutDashboard style={{ width: '17px', height: '17px' }} />
                  Enter Control Room
                  <ArrowRight style={{ width: '17px', height: '17px' }} />
                </Link>
                <Link to="/visitor" style={{
                  color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '14px',
                  padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '9px',
                  border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                }}>
                  <Users style={{ width: '17px', height: '17px', color: C.tealLight }} />
                  Visitor Guide
                </Link>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                {[
                  { val: '11+', label: 'Zones Monitored', color: C.tealLight },
                  { val: '163K', label: 'Live Visitors', color: C.amber },
                  { val: '25+', label: 'Scenarios Tested', color: 'rgba(160,186,210,0.9)' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(160,186,210,0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dashboard screenshot */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-30px', borderRadius: '24px', background: `radial-gradient(ellipse, ${C.teal}35, transparent 70%)`, filter: 'blur(20px)' }} />
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div style={{ background: '#0B1F38', padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[C.red, C.amber, C.teal].map((c, i) => <span key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, display: 'block' }} />)}
                  </div>
                  <span style={{ fontSize: '10px', color: '#5A7A9A', fontFamily: 'monospace', flex: 1 }}>pravaah.city/control-room — LIVE</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 700, color: C.teal }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: C.teal, animation: 'livepulse 2s infinite' }} /> LIVE
                  </span>
                </div>
                <img src="/pravaah-hero.png" alt="PRAVAAH Control Room" style={{ width: '100%', display: 'block' }} />
              </div>
              {/* Floating badge */}
              <div style={{
                position: 'absolute', bottom: '-14px', left: '-14px', borderRadius: '12px', padding: '10px 16px',
                background: 'rgba(11,35,66,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.teal, animation: 'livepulse 2s infinite' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>11 Zones · Live Intelligence</span>
              </div>
            </div>
          </div>
        </div>
      </PhotoSection>

      {/* ═══ AUDIENCE STRIP ═════════════════════════════════ */}
      <section style={{ background: C.navy, borderTop: `3px solid ${C.teal}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div className="audience-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { icon: Shield, label: 'For Authorities', desc: 'Faster, data-driven decisions with confidence.', color: C.amber },
              { icon: Activity, label: 'For Operators', desc: 'Optimize operations and improve network flow.', color: C.teal },
              { icon: Users, label: 'For Citizens', desc: 'Travel smarter with crowd-aware guidance.', color: '#8B7CF6' },
              { icon: Brain, label: 'For a Resilient Mumbai', desc: 'Safer. Smarter. Stronger. Together.', color: C.tealLight },
            ].map((a, i) => (
              <div key={i} style={{ padding: '20px 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${a.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <a.icon style={{ width: '18px', height: '18px', color: a.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'white', marginBottom: '2px' }}>{a.label}</div>
                  <div style={{ fontSize: '10.5px', color: 'rgba(138,172,198,0.8)', lineHeight: 1.5 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — Aerial City Background ══════════ */}
      <PhotoSection
        id="how-it-works"
        img="/img-aerial.jpg"
        overlay="rgba(11,35,66,0.85)"
        style={{ padding: '100px 24px' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '999px', marginBottom: '16px', background: 'rgba(42,157,143,0.15)', border: '1px solid rgba(42,157,143,0.4)', color: C.tealLight, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              <Sparkles style={{ width: '11px', height: '11px' }} /> Core Architecture
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'white', margin: '0 0 14px', lineHeight: 1.15 }}>How PRAVAAH Thinks</h2>
            <p style={{ fontSize: '15px', color: 'rgba(180,205,225,0.85)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.75 }}>
              A continuous closed-loop — from signal detection to field-ready intervention.
            </p>
          </FadeUp>

          <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { num: '01', icon: TrendingUp, title: 'PREDICT', color: C.teal, link: '/control-room/predictions', desc: 'Multi-horizon pressure forecasting (30m, 60m, 120m, 180m) using physics-calibrated crowd models across 11 transit nodes.', tag: 'Graph Density · Network Propagation' },
              { num: '02', icon: Zap, title: 'ORCHESTRATE', color: C.amber, link: '/control-room/actions', desc: 'Ranked intervention engine — evaluates diversion corridors, models counterfactual impact, issues field-ready routing orders.', tag: 'Dijkstra Routing · Side-Effect Penalty' },
              { num: '03', icon: Activity, title: 'BALANCE', color: '#8B7CF6', link: '/control-room/overview', desc: 'Continuous telemetry compares forecast vs. observed, driving adaptive pressure equalization across all corridors in real time.', tag: 'Real-time Delta · Network Convergence' },
            ].map((c, i) => (
              <FadeUp key={i} delay={i * 120}>
                <Link to={c.link} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'rgba(11,35,66,0.75)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderTop: `4px solid ${c.color}`,
                    borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px',
                    transition: 'all 0.25s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(18,49,91,0.9)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(11,35,66,0.75)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '32px', fontWeight: 900, color: c.color }}>{c.num}</span>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <c.icon style={{ width: '20px', height: '20px', color: c.color }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>{c.title}</div>
                      <p style={{ fontSize: '12.5px', color: 'rgba(180,205,225,0.85)', lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: c.color }}>{c.tag}</span>
                      <ChevronRight style={{ width: '12px', height: '12px', color: c.color }} />
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </PhotoSection>

      {/* ═══ MUMBAI ZONES — Ganesh Procession Background ════ */}
      <PhotoSection
        id="zones"
        img="/img-procession.jpg"
        overlay="rgba(5,15,35,0.88)"
        style={{ padding: '100px 24px' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '999px', marginBottom: '16px', background: 'rgba(230,154,46,0.15)', border: '1px solid rgba(230,154,46,0.4)', color: C.amber, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              <Map style={{ width: '11px', height: '11px' }} /> Live Mumbai Intelligence
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'white', margin: '0 0 14px', lineHeight: 1.15 }}>Every Zone. Every Moment.</h2>
            <p style={{ fontSize: '15px', color: 'rgba(180,205,225,0.85)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.75 }}>
              Real-time crowd pressure across 12 key Mumbai locations — from Lalbaugcha Raja to Vashi Terminal.
            </p>
          </FadeUp>
          <div className="loc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            {MUMBAI_LOCATIONS.map((loc, i) => <LocationCard key={loc.name} loc={loc} index={i} />)}
          </div>
          {/* Legend */}
          <FadeUp delay={300} style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '36px', flexWrap: 'wrap' }}>
            {[{ color: C.red, label: 'CRITICAL' }, { color: '#B05E1A', label: 'HIGH' }, { color: C.amber, label: 'ELEVATED' }, { color: C.tealLight, label: 'LOW / MODERATE' }].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', fontWeight: 600, color: 'rgba(180,205,225,0.8)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />{l.label}
              </div>
            ))}
          </FadeUp>
        </div>
      </PhotoSection>

      {/* ═══ CONTROL ROOM SHOWCASE — Chowpatty Background ══ */}
      <PhotoSection
        img="/img-chowpatty.jpg"
        overlay="rgba(8,20,45,0.87)"
        style={{ padding: '100px 24px' }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'white', margin: '0 0 14px', lineHeight: 1.15 }}>The Command Interface</h2>
            <p style={{ fontSize: '15px', color: 'rgba(180,205,225,0.85)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75 }}>
              Real-time Mumbai map, zone pressure matrix, AI recommendations — all in one unified screen.
            </p>
          </FadeUp>
          <FadeUp delay={150}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ background: '#0B1F38', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[C.red, C.amber, C.teal].map((c, i) => <span key={i} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c, display: 'block' }} />)}
                </div>
                <span style={{ fontSize: '11px', color: '#5A7A9A', fontFamily: 'monospace', flex: 1 }}>pravaah.city / control-room / overview — Ganesh Chaturthi 2026 · Day 9 · Evening</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: 700, color: C.teal }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.teal, animation: 'livepulse 2s infinite' }} />LIVE
                </span>
              </div>
              <img src="/pravaah-hero.png" alt="PRAVAAH Control Room Dashboard" style={{ width: '100%', display: 'block' }} />
            </div>
          </FadeUp>
        </div>
      </PhotoSection>

      {/* ═══ HOSPITALITY — Hotel Background ════════════════ */}
      <PhotoSection
        img="/img-hotel.jpg"
        overlay="rgba(11,35,66,0.82)"
        style={{ padding: '100px 24px' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <FadeUp>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(42,157,143,0.15)', border: '1px solid rgba(42,157,143,0.4)', color: C.tealLight, fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', width: 'fit-content' }}>
                  <Shield style={{ width: '11px', height: '11px' }} /> Explainable Civic AI
                </div>
                <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.15 }}>Why did PRAVAAH<br />recommend this?</h2>
                <p style={{ fontSize: '14px', color: 'rgba(180,205,225,0.85)', lineHeight: 1.75, margin: 0 }}>
                  Every recommendation comes with a fully inspectable <strong style={{ color: 'white' }}>Glass Box</strong> audit trail — observed telemetry, physical constraints, historical baseline, and projected impact. No black box. No hidden logic.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {[{ icon: Brain, label: 'Causal Reasoning' }, { icon: Lock, label: 'Privacy by Design' }, { icon: CheckCircle2, label: 'Auditable Decisions' }].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '12px', fontWeight: 600, color: 'white' }}>
                      <t.icon style={{ width: '13px', height: '13px', color: C.tealLight }} />{t.label}
                    </div>
                  ))}
                </div>
                <Link to="/control-room/glass-box" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 22px', borderRadius: '10px', width: 'fit-content', background: 'rgba(42,157,143,0.15)', border: '1px solid rgba(42,157,143,0.5)', color: C.tealLight, fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
                  Inspect Live Audit Trail <ArrowRight style={{ width: '15px', height: '15px' }} />
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={150}>
              <div style={{ background: 'rgba(6,15,35,0.85)', backdropFilter: 'blur(16px)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', fontSize: '11px' }}>
                <div style={{ background: 'rgba(11,31,56,0.9)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: 'rgba(122,150,184,0.9)', fontWeight: 700, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Decision Trace · ACT-2026-0908-01</span>
                  <span style={{ fontSize: '9px', fontWeight: 800, padding: '3px 8px', borderRadius: '999px', background: `${C.teal}20`, color: C.tealLight, border: `1px solid ${C.teal}40` }}>VERIFIED</span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { key: 'TRIGGER EVIDENCE', value: 'Curry Road footbridge ingress velocity: 0.4 m/s (critical < 0.6). Density: 4.8 pers/m².', color: C.red },
                    { key: 'CONSTRAINTS CHECKED', value: 'Thane buffer: 62% available · Western Railway: OPERATIONAL · Side-effect penalty: 0.18', color: C.amber },
                    { key: 'CANDIDATES EVALUATED', value: '25 routing combinations via Dijkstra. Top score: act-redirect-curry-thane-18', color: '#8B7CF6' },
                    { key: 'EXPECTED OUTCOME', value: '−18 pts pressure on Curry Road within 15 min. No secondary bottleneck.', color: C.tealLight },
                  ].map((row, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '8.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: row.color, marginBottom: '5px' }}>{row.key}</div>
                      <div style={{ color: 'rgba(203,216,232,0.9)', background: 'rgba(255,255,255,0.04)', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.6, fontSize: '11px' }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </PhotoSection>

      {/* ═══ TWO VIEWS — Marine Drive Background ════════════ */}
      <PhotoSection
        img="/img-marine.jpg"
        overlay="rgba(11,35,66,0.83)"
        style={{ padding: '100px 24px' }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeUp style={{ textAlign: 'center', marginBottom: '52px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'white', margin: '0 0 14px', lineHeight: 1.15 }}>Command for Operators.<br />Safety for Visitors.</h2>
            <p style={{ fontSize: '15px', color: 'rgba(180,205,225,0.85)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.75 }}>
              PRAVAAH synchronizes city operations with citizen mobility.
            </p>
          </FadeUp>

          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              {
                icon: LayoutDashboard, color: C.teal, label: 'OPERATOR',
                title: 'PRAVAAH Control Room',
                desc: 'Complete situational awareness for transit directors, law enforcement, and municipal commissioners.',
                points: ['Real-time MapLibre crowd flow — 11 zones', 'Multi-horizon predictive saturation engine', 'Interactive What-If disruption sandbox', 'Glass Box rationale for every recommendation'],
                cta: 'Launch Control Room', link: '/control-room/overview', ctaBg: C.teal,
              },
              {
                icon: Users, color: C.amber, label: 'CITIZEN',
                title: 'Visitor Companion',
                desc: 'City intelligence distilled into peaceful pilgrimage guidance — without individual tracking.',
                points: ['Destination crowd ratings & wait forecasts', 'Low-pressure alternative walking routes', 'Medical & welfare kiosk locations', 'Privacy by design · No tracking'],
                cta: 'Explore Visitor Guide', link: '/visitor', ctaBg: C.amber,
              }
            ].map((c, i) => (
              <FadeUp key={i} delay={i * 150}>
                <div style={{
                  background: 'rgba(11,35,66,0.75)', backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.1)', borderTop: `4px solid ${c.color}`,
                  borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <c.icon style={{ width: '22px', height: '22px', color: c.color }} />
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.14em', padding: '4px 10px', borderRadius: '999px', background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}40` }}>{c.label}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: '0 0 10px' }}>{c.title}</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(180,205,225,0.85)', lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                    {c.points.map((p, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '12.5px', color: 'rgba(203,216,232,0.9)' }}>
                        <CheckCircle2 style={{ width: '15px', height: '15px', color: c.color, flexShrink: 0, marginTop: '1px' }} />{p}
                      </li>
                    ))}
                  </ul>
                  <Link to={c.link} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '12px', fontWeight: 800, fontSize: '13px', textDecoration: 'none', background: c.ctaBg, color: i === 0 ? 'white' : C.navyDark, boxShadow: `0 4px 20px ${c.color}30` }}>
                    {c.cta} <ArrowRight style={{ width: '15px', height: '15px' }} />
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </PhotoSection>

      {/* ═══ PRIVACY STRIP ══════════════════════════════════ */}
      <section style={{ background: C.navy, padding: '22px 24px', borderTop: `2px solid ${C.teal}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[
            { icon: Lock, label: 'No individual tracking.', sub: 'Privacy by design.', color: C.teal },
            { icon: Eye, label: 'Transparent. Ethical.', sub: 'Accountable.', color: C.amber },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      {/* ═══ FINAL CTA — Aerial Background ══════════════════ */}
      <PhotoSection
        img="/img-aerial.jpg"
        overlay={`linear-gradient(160deg, rgba(11,35,66,0.92) 0%, rgba(18,49,91,0.85) 60%, rgba(42,157,143,0.3) 100%)`}
        style={{ padding: '100px 24px', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', maxWidth: '700px', margin: '0 auto' }}>
          <FadeUp>
            <img src="/pravaah-logo.png" alt="PRAVAAH" style={{ height: '56px', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '8px' }} />
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, color: 'white', margin: '0 0 16px', lineHeight: 1.1 }}>
              Ready to experience<br />
              <span style={{ background: `linear-gradient(90deg, ${C.tealLight}, ${C.amber})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PRAVAAH?</span>
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(180,205,225,0.85)', maxWidth: '520px', margin: '0 auto 8px', lineHeight: 1.75 }}>
              Explore the live Ganesh Chaturthi 2026 Mumbai command center. Test scenarios, inspect predictive models, and audit intervention decisions.
            </p>
          </FadeUp>
          <FadeUp delay={150} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/control-room/overview" style={{ background: `linear-gradient(135deg, ${C.amber}, #F0B848)`, color: C.navyDark, textDecoration: 'none', fontWeight: 800, fontSize: '14px', padding: '17px 32px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '9px', boxShadow: `0 8px 28px ${C.amber}50` }}>
              <LayoutDashboard style={{ width: '17px', height: '17px' }} />Enter the Control Room<ArrowRight style={{ width: '17px', height: '17px' }} />
            </Link>
            <Link to="/visitor" style={{ color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '14px', padding: '17px 28px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
              <Users style={{ width: '17px', height: '17px', color: C.tealLight }} />Explore Visitor View
            </Link>
          </FadeUp>
        </div>
      </PhotoSection>

      {/* ═══ FOOTER ═════════════════════════════════════════ */}
      <footer style={{ background: C.navyDark, borderTop: '1px solid rgba(255,255,255,0.07)', padding: '48px 24px 28px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '36px', paddingBottom: '36px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <img src="/pravaah-logo.png" alt="PRAVAAH" style={{ height: '34px', objectFit: 'contain', filter: 'brightness(0) invert(1)', alignSelf: 'flex-start' }} />
              <p style={{ fontSize: '11.5px', color: '#7A96B8', lineHeight: 1.65, margin: 0, maxWidth: '280px' }}>Predictive Resilience & Adaptive Versatile Assistance for All in Harmony. Built for Ganesh Chaturthi 2026, Mumbai.</p>
              <span style={{ fontSize: '9px', fontWeight: 800, color: C.amber, letterSpacing: '0.2em', textTransform: 'uppercase' }}>PREDICT · SIMULATE · DECIDE · ACT · REPEAT</span>
            </div>
            {[
              { title: 'Control Room', links: [{ label: 'Overview', to: '/control-room/overview' }, { label: 'Live City GIS', to: '/control-room/live-city' }, { label: 'Predictions', to: '/control-room/predictions' }, { label: 'Actions', to: '/control-room/actions' }, { label: 'Glass Box', to: '/control-room/glass-box' }] },
              { title: 'Infrastructure', links: [{ label: 'Mobility & Transit', to: '/control-room/mobility' }, { label: 'Hospitality & Beds', to: '/control-room/hospitality' }, { label: 'Civic Welfare', to: '/control-room/welfare' }, { label: 'What-If Scenarios', to: '/control-room/scenarios' }, { label: 'Impact Analysis', to: '/control-room/impact' }] },
              { title: 'Visitor Guide', links: [{ label: 'Plan Your Visit', to: '/visitor/plan' }, { label: 'Find Routes', to: '/visitor/route' }, { label: 'Stay & Stay Safe', to: '/visitor/stay' }, { label: 'Emergency Support', to: '/visitor/support' }, { label: 'Privacy Policy', to: '/visitor/privacy' }] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '14px' }}>{col.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {col.links.map((l, j) => (
                    <Link key={j} to={l.to} style={{ color: '#7A96B8', textDecoration: 'none', fontSize: '11.5px', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#7A96B8'}>{l.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '10.5px', color: '#4A6080', margin: 0 }}>© 2026 PRAVAAH. Urban Intelligence Platform. All rights reserved.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: C.teal }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.teal, animation: 'livepulse 2s infinite' }} />
              Live Simulation · Ganesh Chaturthi 2026 · Mumbai
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Global animations & responsive ─────────────────── */}
      <style>{`
        @keyframes livepulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.5); }
        }
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          .hero-grid, .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr 1fr !important; }
          .loc-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .audience-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .three-col, .loc-grid, .audience-grid, .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}