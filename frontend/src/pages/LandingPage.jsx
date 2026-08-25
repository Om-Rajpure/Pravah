/**
 * PRAVAAH Landing Page
 * Dashboard-first entry experience introducing the product through the actual Control Room.
 */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu, X, ArrowRight, LayoutDashboard, Map, TrendingUp, Zap,
  Shield, FlaskConical, BarChart3, Hotel, TrainFront, HeartHandshake,
  Users, Activity, AlertTriangle, Eye
} from 'lucide-react'
import { HeroPreview } from '../components/landing/HeroPreview'
import { PredictionStory } from '../components/landing/PredictionStory'
import { ScenarioDemo } from '../components/landing/ScenarioDemo'

function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2D9C8F]/10 border border-[#2D9C8F]/20 text-[#2D9C8F] text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2D9C8F]"></span>
      <span>{children}</span>
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17212B] tracking-tight leading-tight">
      {children}
    </h2>
  )
}

function Divider() {
  return <div className="border-t border-[#DDD8CF]/80" />
}

function IntelligenceStrip() {
  const metrics = [
    { label: 'CITY PRESSURE', value: '78', max: '/ 100', status: 'CRITICAL', color: '#B03A2E', bg: 'bg-[#B03A2E]/10' },
    { label: 'ACTIVE MOVING', value: '163K', max: 'visitors', status: 'LIVE', color: '#2468B8', bg: 'bg-[#2468B8]/10' },
    { label: 'TRANSPORT LOAD', value: '66%', max: 'suburban', status: 'SATURATED', color: '#E69A2E', bg: 'bg-[#E69A2E]/10' },
    { label: 'ACTIVE ALERTS', value: '4', max: 'zones', status: 'ATTENTION', color: '#B03A2E', bg: 'bg-[#B03A2E]/10' },
    { label: 'SIMULATION', value: '18:00', max: 'Day 9', status: 'DEMO CLOCK', color: '#2D9C8F', bg: 'bg-[#2D9C8F]/10' }
  ]

  return (
    <section className="bg-[#081D38] border-y border-[#1A4070]/60 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[#1A4070]/40 py-1">
          {metrics.map((m, idx) => (
            <div key={idx} className="px-4 py-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] font-bold tracking-widest text-[#7A96B8] uppercase">{m.label}</span>
                <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${m.bg}`} style={{ color: m.color }}>
                  {m.status}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono tracking-tight text-white">{m.value}</span>
                <span className="text-[11px] text-[#7A96B8] font-medium">{m.max}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BeforeAfter() {
  const [view, setView] = useState('after')

  const beforeData = {
    pressure: 94,
    criticalZones: 3,
    transportLoad: 84,
    tag: 'UNMANAGED CONVERGENCE',
    tagColor: 'text-[#B03A2E] bg-[#F5E4E2] border-[#B03A2E]/30',
    title: 'Curry Road Ingress Saturation',
    summary: 'Mass pedestrian accumulation exceeding safety threshold along station footbridge. Flow velocity reduced to 0.4 m/s.',
    zones: [
      { name: 'Curry Road Station', status: 'CRITICAL', value: 94, color: '#B03A2E' },
      { name: 'Lalbaugcha Raja Core', status: 'CRITICAL', value: 88, color: '#B03A2E' },
      { name: 'Parel Transit Junction', status: 'CRITICAL', value: 86, color: '#B03A2E' },
      { name: 'Dadar Interchange', status: 'HIGH', value: 78, color: '#E69A2E' }
    ]
  }

  const afterData = {
    pressure: 76,
    criticalZones: 1,
    transportLoad: 66,
    tag: 'COUNTERFACTUAL IMPACT APPLIED',
    tagColor: 'text-[#2D9C8F] bg-[#E4F4F2] border-[#2D9C8F]/30',
    title: 'Flow Redistribution & Buffer Optimization',
    summary: 'Suburban inflow dynamically diverted via Thane/Vashi corridors. Pressure relieved before station collapse.',
    zones: [
      { name: 'Curry Road Station', status: 'HIGH', value: 76, color: '#E69A2E' },
      { name: 'Lalbaugcha Raja Core', status: 'HIGH', value: 72, color: '#E69A2E' },
      { name: 'Parel Transit Junction', status: 'MODERATE', value: 58, color: '#B8893D' },
      { name: 'Dadar Interchange', status: 'MODERATE', value: 54, color: '#2D9C8F' }
    ]
  }

  const active = view === 'before' ? beforeData : afterData

  return (
    <div className="bg-surface border border-border rounded-xl shadow-subtle p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${active.tagColor} uppercase tracking-wider mb-1.5`}>
            {active.tag}
          </span>
          <h3 className="text-xl font-bold text-text-primary">{active.title}</h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-xl">{active.summary}</p>
        </div>

        <div className="flex items-center p-1 bg-surface-muted rounded-lg border border-border flex-shrink-0 self-start sm:self-center">
          <button
            onClick={() => setView('before')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              view === 'before'
                ? 'bg-critical text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Before Action
          </button>
          <button
            onClick={() => setView('after')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
              view === 'after'
                ? 'bg-teal text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            After Intervention
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-lg bg-surface-muted/50 border border-border/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Target Pressure</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono" style={{ color: active.zones[0].color }}>
              {active.pressure}
            </span>
            <span className="text-xs text-text-muted">/ 100 max</span>
          </div>
          <span className="text-[11px] font-medium text-text-secondary mt-1">
            {view === 'before' ? 'Critical danger point' : '-18 pts safety delta'}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-surface-muted/50 border border-border/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Critical Hotspots</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono" style={{ color: active.zones[0].color }}>
              {active.criticalZones}
            </span>
            <span className="text-xs text-text-muted">zones above 85%</span>
          </div>
          <span className="text-[11px] font-medium text-text-secondary mt-1">
            {view === 'before' ? 'Cascading risk' : 'Contained to single zone'}
          </span>
        </div>

        <div className="p-4 rounded-lg bg-surface-muted/50 border border-border/60 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Transit Saturation</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black font-mono text-navy">
              {active.transportLoad}%
            </span>
            <span className="text-xs text-text-muted">capacity</span>
          </div>
          <span className="text-[11px] font-medium text-text-secondary mt-1">
            {view === 'before' ? 'Ingress bottleneck' : 'Even corridor distribution'}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <p className="text-[10.5px] font-bold uppercase tracking-widest text-text-muted mb-2">
          Monitored Sub-Zone Impact Matrix
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {active.zones.map((z, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-surface border border-border/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-text-primary block">{z.name}</span>
                <span className="text-[10px] font-bold" style={{ color: z.color }}>
                  {z.status} ({z.value}%)
                </span>
              </div>
              <div className="w-24 h-2 rounded-full bg-surface-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${z.value}%`, backgroundColor: z.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col selection:bg-navy selection:text-white">
      {/* ── TOP RESTRAINED NAVIGATION ─────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0B2342] border-b border-[#1A4070]/60 shadow-[0_2px_12px_rgba(11,35,66,0.3)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/pravaah-logo.png"
              alt="PRAVAAH City Intelligence"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-white font-black text-lg sm:text-xl tracking-tight leading-none">PRAVAAH</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A96B8]">City Intelligence</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-[#CBD8E8]">
            <Link to="/control-room/overview" className="hover:text-white transition-colors">Control Room</Link>
            <a href="#how-pravaah-thinks" className="hover:text-white transition-colors">How It Works</a>
            <a href="#scenario-engine" className="hover:text-white transition-colors">Scenarios</a>
            <Link to="/visitor" className="hover:text-white transition-colors">Visitor Experience</Link>
            <a href="#glass-box-explainability" className="hover:text-white transition-colors">Glass Box</a>
          </nav>

          {/* Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/control-room/overview"
              className="inline-flex items-center gap-2 bg-[#E69A2E] hover:bg-[#C87524] active:bg-[#C87524] text-[#0B2342] text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ENTER CONTROL ROOM</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#081D38] border-b border-[#1A4070] px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <Link
              to="/control-room/overview"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-white hover:text-[#E69A2E]"
            >
              Control Room
            </Link>
            <a
              href="#how-pravaah-thinks"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#CBD8E8] hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#scenario-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#CBD8E8] hover:text-white"
            >
              Scenarios
            </a>
            <Link
              to="/visitor"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#CBD8E8] hover:text-white"
            >
              Visitor Experience
            </Link>
            <a
              href="#glass-box-explainability"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#CBD8E8] hover:text-white"
            >
              Glass Box
            </a>
            <div className="pt-2 border-t border-[#1A4070]/60">
              <Link
                to="/control-room/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#E69A2E] text-[#0B2342] text-xs font-bold py-3 rounded-lg"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>ENTER CONTROL ROOM</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO SECTION: DASHBOARD FIRST ────────────────────── */}
      <section className="bg-[#0B2342] text-white pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-[#1A4070]/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Hero Pitch */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#2D9C8F]/15 border border-[#2D9C8F]/30 text-[#2D9C8F] text-[10.5px] font-bold uppercase tracking-widest w-fit">
                <span className="w-2 h-2 rounded-full bg-[#2D9C8F] animate-ping"></span>
                <span>CITY INTELLIGENCE PLATFORM</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] text-white">
                City intelligence for complex moments.
              </h1>

              <p className="text-base sm:text-lg text-[#CBD8E8] font-normal leading-relaxed">
                Predict pressure. Understand crowd movement. Act before disruption spreads across the urban network.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/control-room/overview"
                  className="inline-flex items-center justify-center gap-2 bg-[#E69A2E] hover:bg-[#C87524] active:bg-[#C87524] text-[#0B2342] font-bold text-sm px-6 py-3.5 rounded-lg shadow-elevated transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>ENTER CONTROL ROOM</span>
                </Link>

                <Link
                  to="/control-room/scenarios"
                  className="inline-flex items-center justify-center gap-2 bg-[#12315B] hover:bg-[#1A4070] text-white font-semibold text-sm px-5 py-3.5 rounded-lg border border-[#1A4070] transition-all"
                >
                  <FlaskConical className="w-4 h-4 text-[#2D9C8F]" />
                  <span>RUN WHAT-IF SCENARIO</span>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-3 text-[11px] text-[#7A96B8] border-t border-[#1A4070]/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D9C8F]"></span>
                  <span>11 Monitored Hubs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E69A2E]"></span>
                  <span>Deterministic Twin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2468B8]"></span>
                  <span>Glass Box Rationale</span>
                </div>
              </div>
            </div>

            {/* Right: Actual Hero Interactive Dashboard Preview */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="bg-[#081D38]/90 rounded-2xl p-2.5 sm:p-3 border border-[#1A4070] shadow-2xl relative">
                <HeroPreview />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE INTELLIGENCE STRIP ──────────────────────────── */}
      <IntelligenceStrip />

      {/* ── HOW PRAVAAH THINKS ──────────────────────────────── */}
      <section id="how-pravaah-thinks" className="py-16 sm:py-24 bg-surface border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <SectionLabel>Core Architecture</SectionLabel>
            <SectionHeading>How PRAVAAH Thinks</SectionHeading>
            <p className="text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
              Urban intelligence operates through a continuous feedback loop: identifying bottlenecks early, modeling dynamic interventions, and balancing the city transit infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* 01 PREDICT */}
            <div className="bg-background border border-border rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-subtle hover:border-teal/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-teal">01</span>
                  <div className="p-2 rounded-lg bg-teal/10 text-teal">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">PREDICT</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Understand what is happening and forecast what is likely to happen next across multi-horizon timeframes (30m, 60m, 120m, 180m).
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-semibold text-teal flex items-center gap-1">
                <span>Graph Density & Propagation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 02 ORCHESTRATE */}
            <div className="bg-background border border-border rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-subtle hover:border-blue/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-blue">02</span>
                  <div className="p-2 rounded-lg bg-blue/10 text-blue">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">ORCHESTRATE</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Evaluate ranked interventions, simulate pedestrian diversion corridors, and test actions with counterfactual accuracy before issuing field orders.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-semibold text-blue flex items-center gap-1">
                <span>Action Impact Modeling</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* 03 BALANCE */}
            <div className="bg-background border border-border rounded-xl p-6 sm:p-7 flex flex-col justify-between shadow-subtle hover:border-orange/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-orange">03</span>
                  <div className="p-2 rounded-lg bg-orange/10 text-orange">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">BALANCE</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Measure real-time delta between forecast and observed impact, reducing pressure across railways, roads, and high-density pilgrimage nodes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-[11px] font-semibold text-orange flex items-center gap-1">
                <span>Network Stability Convergence</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE PREDICTION SECTION ───────────────────── */}
      <section className="py-16 sm:py-24 bg-background border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <SectionLabel>Predictive Walkthrough</SectionLabel>
            <SectionHeading>Anticipate Bottlenecks Before They Cascade</SectionHeading>
            <p className="text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
              See how PRAVAAH detects subtle velocity drops at key rail junctions and prevents severe station saturation through deterministic modeling.
            </p>
          </div>

          <PredictionStory />
        </div>
      </section>

      {/* ── WHAT-IF & SCENARIOS ──────────────────────────────── */}
      <section id="scenario-engine" className="py-16 sm:py-24 bg-surface border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <SectionLabel>Disruption Simulation</SectionLabel>
            <SectionHeading>Interactive Scenario & Stress Testing</SectionHeading>
            <p className="text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
              What happens when Curry Road station bridge reaches capacity or a central railway signal fails? Simulate city response in real-time.
            </p>
          </div>

          <ScenarioDemo />
        </div>
      </section>

      {/* ── BEFORE / AFTER COUNTERFACTUAL IMPACT ─────────────── */}
      <section className="py-16 sm:py-24 bg-background border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <SectionLabel>Counterfactual Proof</SectionLabel>
            <SectionHeading>Measurable Impact Before Field Commitment</SectionHeading>
            <p className="text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
              Compare unmanaged crowd surge against PRAVAAH-recommended routing interventions with exact deterministic telemetry.
            </p>
          </div>

          <BeforeAfter />
        </div>
      </section>

      {/* ── GLASS BOX EXPLAINABILITY ─────────────────────────── */}
      <section id="glass-box-explainability" className="py-16 sm:py-24 bg-[#0B2342] text-white border-b border-[#1A4070]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2D9C8F]/20 text-[#2D9C8F] text-[10px] font-bold uppercase tracking-widest border border-[#2D9C8F]/30">
                <Shield className="w-3.5 h-3.5" />
                <span>EXPLAINABLE CIVIC AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Why did PRAVAAH recommend this?
              </h2>
              <p className="text-sm sm:text-base text-[#CBD8E8] leading-relaxed">
                Every algorithmic recommendation is backed by a fully inspectable <strong className="text-white">Glass Box</strong> audit log: observed telemetry, physical constraints, historical baseline, and projected impact.
              </p>
              <div className="pt-2">
                <Link
                  to="/control-room/glass-box"
                  className="inline-flex items-center gap-2 bg-[#12315B] hover:bg-[#1A4070] text-white text-xs font-bold px-5 py-3 rounded-lg border border-[#1A4070] transition-colors"
                >
                  <span>INSPECT LIVE GLASS BOX AUDIT</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E69A2E]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-[#081D38] border border-[#1A4070] rounded-xl p-5 sm:p-6 shadow-xl space-y-4 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-[#1A4070]/80 pb-3">
                  <span className="text-[#7A96B8] uppercase font-bold text-[10px]">DECISION TRACE #ACT-2026-0908-01</span>
                  <span className="text-[#2D9C8F] font-bold text-[10px] bg-[#2D9C8F]/10 px-2 py-0.5 rounded">VERIFIED</span>
                </div>
                <div>
                  <span className="text-[#7A96B8] block text-[10px] uppercase font-bold mb-1">TRIGGER EVIDENCE</span>
                  <p className="text-[#CBD8E8] bg-[#0B2342] p-2.5 rounded border border-[#1A4070]/60">
                    Curry Road Station footbridge ingress velocity declined to 0.4 m/s (critical threshold &lt; 0.6 m/s). Density: 4.8 pers/m².
                  </p>
                </div>
                <div>
                  <span className="text-[#7A96B8] block text-[10px] uppercase font-bold mb-1">CONSTRAINTS CHECKED</span>
                  <ul className="text-[#CBD8E8] space-y-1 pl-3 list-disc">
                    <li>Thane buffer corridor capacity: 62% available</li>
                    <li>Western railway operational status: NORMAL</li>
                  </ul>
                </div>
                <div>
                  <span className="text-[#7A96B8] block text-[10px] uppercase font-bold mb-1">EXPECTED OUTCOME</span>
                  <p className="text-[#2D9C8F] font-bold">
                    -18 pts pressure on Curry Road within 15 mins. No secondary bottleneck created.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DUAL PERSPECTIVE: VISITOR & OPERATOR ─────────────── */}
      <section className="py-16 sm:py-24 bg-surface border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <SectionLabel>Two Unified Perspectives</SectionLabel>
            <SectionHeading>Command for Operators. Safety for Visitors.</SectionHeading>
            <p className="text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
              PRAVAAH synchronizes city command with citizen mobility, delivering frictionless routing to devotees while maintaining operational oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Operator Card */}
            <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="p-3 rounded-xl bg-navy/10 text-navy w-fit mb-5">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">PRAVAAH Control Room</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  Complete operational oversight for municipal commissioners, transit directors, and law enforcement. Live simulation, hotspot predictions, and counterfactual action modeling.
                </p>
                <ul className="space-y-2.5 text-xs text-text-secondary font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-navy" />
                    <span>Real-time Mumbai MapLibre crowd flow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-navy" />
                    <span>Multi-horizon predictive saturation models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-navy" />
                    <span>Interactive What-If disruption testing</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  to="/control-room/overview"
                  className="w-full flex items-center justify-center gap-2 bg-navy hover:bg-navy-dark text-white font-bold text-xs py-3 rounded-lg transition-colors"
                >
                  <span>LAUNCH CONTROL ROOM</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visitor Card */}
            <div className="bg-background border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-subtle">
              <div>
                <div className="p-3 rounded-xl bg-teal/10 text-teal w-fit mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Visitor Companion Experience</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                  Real-time crowd intelligence translated into peaceful pilgrimage guidance. Safe pedestrian routing, live queue forecasts, accommodation status, and privacy-preserving alerts.
                </p>
                <ul className="space-y-2.5 text-xs text-text-secondary font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    <span>Destination crowd ratings & wait-time estimates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    <span>Low-stress alternative walking routes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                    <span>Real-time emergency & medical welfare kiosks</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  to="/visitor"
                  className="w-full flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark text-white font-bold text-xs py-3 rounded-lg transition-colors"
                >
                  <span>EXPLORE VISITOR EXPERIENCE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPLETE PLATFORM MODULES ───────────────────────── */}
      <section className="py-16 sm:py-24 bg-background border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <SectionLabel>Integrated Modules</SectionLabel>
            <SectionHeading>Complete City Intelligence Matrix</SectionHeading>
            <p className="text-text-secondary text-sm sm:text-base mt-3 leading-relaxed">
              Unified urban telemetry covering crowd dynamics, mobility systems, hospitality capacity, and civic welfare.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { title: 'LIVE CITY', desc: 'Dynamic MapLibre GIS mapping across 11 key zones with train track telemetry.', icon: Map, path: '/control-room/live-city' },
              { title: 'PREDICTIONS', desc: 'Multi-horizon pressure forecasting and network propagation tracking.', icon: TrendingUp, path: '/control-room/predictions' },
              { title: 'ACTIONS', desc: 'Ranked intervention engine with counterfactual impact estimates.', icon: Zap, path: '/control-room/actions' },
              { title: 'HOSPITALITY', desc: 'Hotel inventory, bed availability, and surge accommodation buffers.', icon: Hotel, path: '/control-room/hospitality' },
              { title: 'MOBILITY', desc: 'Suburban train load, frequency adjustments, and transit throughput.', icon: TrainFront, path: '/control-room/mobility' },
              { title: 'WELFARE', desc: 'Emergency medical aid posts, water supply stations, and security.', icon: HeartHandshake, path: '/control-room/welfare' },
              { title: 'SCENARIOS', desc: 'Interactive What-If disruption and disaster response simulation sandbox.', icon: FlaskConical, path: '/control-room/scenarios' },
              { title: 'IMPACT', desc: 'Network recovery telemetry, before/after analysis, and safety indices.', icon: BarChart3, path: '/control-room/impact' },
              { title: 'GLASS BOX', desc: 'Auditable algorithmic rationale, evidence checks, and constraint logs.', icon: Shield, path: '/control-room/glass-box' }
            ].map((m, idx) => {
              const Icon = m.icon
              return (
                <Link
                  key={idx}
                  to={m.path}
                  className="p-5 rounded-xl bg-surface border border-border hover:border-navy/40 transition-all group flex flex-col justify-between shadow-subtle hover:shadow-elevated"
                >
                  <div>
                    <div className="p-2.5 rounded-lg bg-navy/5 text-navy group-hover:bg-navy group-hover:text-white transition-colors w-fit mb-3.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-navy transition-colors mb-1">
                      {m.title}
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-semibold text-text-muted group-hover:text-navy flex items-center gap-1">
                    <span>Launch Module</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL PRODUCT CTA ────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0B2342] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <img
            src="/pravaah-logo.png"
            alt="PRAVAAH"
            className="h-12 w-auto mx-auto object-contain"
          />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Ready to experience PRAVAAH?
          </h2>
          <p className="text-base text-[#CBD8E8] max-w-2xl mx-auto leading-relaxed">
            Explore the live Ganesh Chaturthi 2026 Mumbai command center simulation. Test real scenarios, inspect predictive models, and audit intervention decisions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/control-room/overview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E69A2E] hover:bg-[#C87524] text-[#0B2342] font-bold text-sm px-8 py-4 rounded-lg shadow-elevated transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ENTER THE CONTROL ROOM</span>
            </Link>
            <Link
              to="/visitor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#12315B] hover:bg-[#1A4070] text-white font-semibold text-sm px-6 py-4 rounded-lg border border-[#1A4070] transition-all"
            >
              <Users className="w-4 h-4 text-[#2D9C8F]" />
              <span>EXPLORE VISITOR VIEW</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── RESTRAINED FOOTER ─────────────────────────────────── */}
      <footer className="bg-[#081D38] text-[#7A96B8] border-t border-[#1A4070]/60 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#1A4070]/40">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <img src="/pravaah-logo.png" alt="PRAVAAH" className="h-6 w-auto object-contain" />
                <span className="text-white font-bold text-base tracking-tight">PRAVAAH</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#CBD8E8]/70">
                City intelligence platform for predicting pressure, orchestrating movement, and balancing urban networks.
              </p>
              <span className="inline-block text-[9.5px] font-bold text-[#E69A2E] uppercase tracking-wider">
                PREDICT · ORCHESTRATE · BALANCE
              </span>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Control Room</h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link to="/control-room/overview" className="hover:text-white transition-colors">Overview Dashboard</Link></li>
                <li><Link to="/control-room/live-city" className="hover:text-white transition-colors">Live City GIS</Link></li>
                <li><Link to="/control-room/predictions" className="hover:text-white transition-colors">Multi-Horizon Predictions</Link></li>
                <li><Link to="/control-room/actions" className="hover:text-white transition-colors">Intervention Center</Link></li>
                <li><Link to="/control-room/glass-box" className="hover:text-white transition-colors">Glass Box Rationale</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Infrastructure & Public</h4>
              <ul className="space-y-2 text-[11px]">
                <li><Link to="/control-room/mobility" className="hover:text-white transition-colors">Mobility & Transit</Link></li>
                <li><Link to="/control-room/hospitality" className="hover:text-white transition-colors">Hospitality & Beds</Link></li>
                <li><Link to="/control-room/welfare" className="hover:text-white transition-colors">Civic Welfare Aid</Link></li>
                <li><Link to="/control-room/scenarios" className="hover:text-white transition-colors">What-If Simulation</Link></li>
                <li><Link to="/visitor" className="hover:text-white transition-colors">Visitor Experience Guide</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">System Integrity</h4>
              <p className="text-[11px] text-[#7A96B8] leading-relaxed mb-3">
                Calibrated against deterministic synthetic model for Ganesh Chaturthi 2026 Mumbai festival operations. (DEMO_SEED=20260908)
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#2D9C8F]">
                <span className="w-2 h-2 rounded-full bg-[#2D9C8F]"></span>
                <span>Production Build Ready</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10.5px]">
            <p>© 2026 PRAVAAH. Urban Intelligence Platform. All rights reserved.</p>
            <p className="text-[#7A96B8]">Designed for City Operations & Transit Command Centers</p>
          </div>
        </div>
      </footer>
    </div>
  )
}