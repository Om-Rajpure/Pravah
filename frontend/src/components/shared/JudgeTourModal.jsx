import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  ExternalLink,
  MapPin, 
  TrendingUp, 
  Zap, 
  FlaskConical, 
  ShieldCheck, 
  Eye, 
  Smartphone,
  RotateCcw
} from 'lucide-react'
import { resetDemo, nextDemoEvent } from '../../services/demoService'

export const TOUR_STEPS = [
  {
    step: 1,
    title: "1. SEE — Real Mumbai Geographic Telemetry",
    role: "City Operator",
    route: "/control-room/overview",
    icon: Eye,
    tagline: "The city has capacity. The problem is distribution.",
    narrative: "Observe real-time crowd pressure across 11 monitored Mumbai zones. Notice Curry Road and Lalbaug approaching high pressure while Eastern buffer zones (Thane, Vashi) have ample spare capacity.",
    metric: "Current City Pressure: 72 / 100",
    actionPrompt: "View Live City Map",
  },
  {
    step: 2,
    title: "2. PREDICT — Network-Aware Pressure Forecasting",
    role: "Predictive Intelligence",
    route: "/control-room/predictions",
    icon: TrendingUp,
    tagline: "From 'What is happening?' to 'Where will bottlenecks form next?'",
    narrative: "Our LightGBM residual model (MAE: 1.026) combines physics-based flow baselines and platform saturation to forecast Curry Road surging from 72 to 94 (CRITICAL) within 2 hours.",
    metric: "Curry Road Forecast: 72 → 94 (in ~2h)",
    actionPrompt: "Inspect Multi-Horizon Forecasts",
  },
  {
    step: 3,
    title: "3. RECOMMEND — Counterfactual Action Generation",
    role: "Decision Support",
    route: "/control-room/actions",
    icon: Zap,
    tagline: "Don't just detect emergencies — test solutions before acting.",
    narrative: "PRAVAAH evaluates 25 candidate interventions across capacity and route constraints, identifying the optimal dosage: Redirect 18% of incoming Curry Road flow toward Thane.",
    metric: "Optimal Dosage: 18% flow redirection",
    actionPrompt: "Review Recommended Intervention",
  },
  {
    step: 4,
    title: "4. SIMULATE — Measured Impact Before Approval",
    role: "Simulated Proof",
    route: "/control-room/impact",
    icon: CheckCircle2,
    tagline: "Zero real-world risk. Measurable simulated counterfactual.",
    narrative: "The simulator counterfactually runs the 18% redirection: Curry Road drops from 94 to 76 (-18 pts), and critical bottlenecks across the city reduce from 3 to 1 without overloading Thane.",
    metric: "Net Impact: 94 → 76 pressure (-18 pts)",
    actionPrompt: "Inspect Counterfactual Scorecard",
  },
  {
    step: 5,
    title: "5. EXPLAIN — Glass Box Trust & Decision Audit",
    role: "Explainability Engine",
    route: "/control-room/glass-box",
    icon: Compass,
    tagline: "No black-box hallucination. Every decision is verifiable.",
    narrative: "The Glass Box engine breaks down the exact causal chain: Observed Telemetry → Ingress Velocity → Corridor Saturation → Capacity Bounds → Optimal Candidate, with an immutable audit lineage.",
    metric: "Confidence Score: 87% (High Confidence)",
    actionPrompt: "Audit Decision Reasoning",
  },
  {
    step: 6,
    title: "6. WHAT-IF — Injected Scenario Disruption",
    role: "Resilience Testing",
    route: "/control-room/scenarios",
    icon: FlaskConical,
    tagline: "What happens if a major rail corridor shuts down?",
    narrative: "Inject the 'Central Line Disruption'. The transit graph closes key edges, reroutes flows, triggers a 5-stage causal cascade, and marks the previous recommendation STALE before re-solving.",
    metric: "Scenario Cascade: 5 Stages Evaluated",
    actionPrompt: "Simulate Rail Disruption",
  },
  {
    step: 7,
    title: "7. GUIDE — Visitor Mobile Guidance",
    role: "Public Visitor",
    route: "/visitor",
    icon: Smartphone,
    tagline: "Turn civic intelligence into calm, privacy-safe travel guidance.",
    narrative: "Switch to the mobile-first Visitor View. A visitor heading to Gateway of India (HIGH) is offered Marine Drive (MODERATE) with clear, plain-language reasoning: 'Lower predicted crowd, operational route.'",
    metric: "Alternative Suggested: Marine Drive (MODERATE)",
    actionPrompt: "Explore Visitor Experience",
  },
  {
    step: 8,
    title: "8. GOVERN — Strict Privacy & Data Minimization",
    role: "Data Governance",
    route: "/visitor/privacy",
    icon: ShieldCheck,
    tagline: "PRAVAAH does not need to know who you are to guide you.",
    narrative: "Review the Privacy Center. No GPS tracking, no persistent profiles, no PII. Groups below K=10 are suppressed, location is opt-in and session-only, and data retention is strictly capped.",
    metric: "K-Anonymity: K=10 Minimum Group Size",
    actionPrompt: "Inspect Privacy Center",
  }
]

export default function JudgeTourModal({ isOpen, onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const navigate = useNavigate()

  if (!isOpen) return null

  const step = TOUR_STEPS[currentStepIndex]
  const Icon = step.icon
  const isFirst = currentStepIndex === 0
  const isLast = currentStepIndex === TOUR_STEPS.length - 1

  const handleNavigate = (route) => {
    navigate(route)
  }

  const handleNext = () => {
    if (!isLast) {
      const nextIdx = currentStepIndex + 1
      setCurrentStepIndex(nextIdx)
      navigate(TOUR_STEPS[nextIdx].route)
    }
  }

  const handlePrev = () => {
    if (!isFirst) {
      const prevIdx = currentStepIndex - 1
      setCurrentStepIndex(prevIdx)
      navigate(TOUR_STEPS[prevIdx].route)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border rounded-card shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-graphite text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-terracotta flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-light">Hackathon Judge Tour</span>
              <h2 className="text-sm font-bold text-white leading-tight">PRAVAAH 8-Step Presentation Flow</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Dots */}
        <div className="bg-surface-muted/60 px-4 py-2 border-b border-border flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-text-secondary">
            Step {step.step} of {TOUR_STEPS.length}: <strong className="text-text-primary">{step.role}</strong>
          </span>
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStepIndex(idx)
                  navigate(s.route)
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStepIndex 
                    ? 'bg-terracotta scale-125' 
                    : idx < currentStepIndex 
                    ? 'bg-low' 
                    : 'bg-border'
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-card-sm bg-terracotta-soft text-terracotta-dark flex-shrink-0 mt-0.5">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">{step.title}</h3>
              <p className="text-xs font-semibold text-terracotta-dark mt-0.5">{step.tagline}</p>
            </div>
          </div>

          <div className="bg-surface-muted/40 border border-border/80 rounded-card-sm p-3.5 text-xs text-text-secondary leading-relaxed">
            {step.narrative}
          </div>

          <div className="bg-terracotta-soft/30 border-l-4 border-terracotta rounded-r p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Key Demonstrated Metric</span>
              <span className="text-xs font-bold text-text-primary">{step.metric}</span>
            </div>
            <button
              onClick={() => handleNavigate(step.route)}
              className="text-xs font-semibold text-terracotta-dark hover:text-terracotta flex items-center gap-1 bg-white px-2.5 py-1.5 rounded border border-terracotta/30 shadow-sm"
            >
              <span>{step.actionPrompt}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="bg-surface-muted/80 px-5 py-3 border-t border-border flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={isFirst}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors px-3 py-1.5 rounded border border-border bg-surface"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5"
            >
              Close Tour
            </button>

            {isLast ? (
              <button
                onClick={onClose}
                className="bg-low text-white hover:opacity-90 transition-opacity text-xs font-bold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-subtle"
              >
                <span>Tour Complete</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-terracotta text-white hover:bg-terracotta-dark transition-colors text-xs font-bold px-4 py-1.5 rounded flex items-center gap-1.5 shadow-subtle"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
