import React, { useState, useEffect } from 'react'
import { Sparkles, Layers, CheckCircle2, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react'
import { ActionRecommendationCard } from '../../components/actions/ActionRecommendationCard'
import { ScenarioSelector } from '../../components/scenarios/ScenarioSelector'
import { ScenarioScorecard } from '../../components/scenarios/ScenarioScorecard'
import { ScenarioCascadePanel } from '../../components/scenarios/ScenarioCascadePanel'
import { Panel } from '../../components/ui/Panel'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { LoadingState } from '../../components/shared/LoadingState'
import { getActionRecommendations } from '../../services/actionService'
import { getScenarios, simulateScenario, resetScenario } from '../../services/scenarioService'

export default function Actions() {
  const [data, setData] = useState(null)
  const [scenarios, setScenarios] = useState([])
  const [selectedScenarioId, setSelectedScenarioId] = useState('central-line-disruption')
  const [scenarioSimResult, setScenarioSimResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [simLoading, setSimLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [recRes, scenRes] = await Promise.all([
        getActionRecommendations(),
        getScenarios()
      ])
      setData(recRes)
      setScenarios(scenRes)
    } catch (err) {
      console.error('Failed to load actions & scenarios:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSimulateScenario = async () => {
    try {
      setSimLoading(true)
      const res = await simulateScenario(selectedScenarioId)
      setScenarioSimResult(res)
    } catch (err) {
      console.error('Scenario simulation failed:', err)
    } finally {
      setSimLoading(false)
    }
  }

  const handleResetScenario = async () => {
    try {
      setSimLoading(true)
      await resetScenario()
      setScenarioSimResult(null)
      await fetchData()
    } catch (err) {
      console.error('Scenario reset failed:', err)
    } finally {
      setSimLoading(false)
    }
  }

  if (loading) return <LoadingState message="Evaluating counterfactual intervention candidates..." />

  const rec = data?.recommended_action
  const impact = data?.impact
  const alternatives = data?.alternatives || []

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto">
      {/* What-If Scenario Injector Bar */}
      <ScenarioSelector
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={(id) => setSelectedScenarioId(id)}
        onSimulate={handleSimulateScenario}
        onReset={handleResetScenario}
        loading={simLoading}
        isDisrupted={Boolean(scenarioSimResult)}
      />

      {/* When a Scenario is Simulated: Render 3-Way Scorecard & Cause-and-Effect Cascade */}
      {scenarioSimResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          <div className="lg:col-span-7">
            <ScenarioScorecard simulationResult={scenarioSimResult} />
          </div>
          <div className="lg:col-span-5 flex flex-col">
            <ScenarioCascadePanel cascade={scenarioSimResult.cascade} />
          </div>
        </div>
      )}

      {/* Top Intervention Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Target Corridor</span>
          <span className="text-xl sm:text-2xl font-bold text-critical">{rec?.source_name || 'Curry Road'}</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">Forecast: {impact?.target_pressure_before || 94} / 100</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Optimal Dosage</span>
          <span className="text-xl sm:text-2xl font-bold text-terracotta">{rec?.dosage_pct || 18}%</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">Transfer ~{impact?.affected_people?.toLocaleString() || 2500}/h</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Simulated Net Impact</span>
          <span className="text-xl sm:text-2xl font-bold text-low">-{impact?.pressure_reduction || 18} pts</span>
          <span className="text-[11px] text-low font-medium block mt-0.5">Curry Road drops to safe band</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">City Critical Zones</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold text-text-muted line-through">{impact?.critical_zones_before || 3}</span>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xl sm:text-2xl font-bold text-low">{impact?.critical_zones_after || 1}</span>
          </div>
          <span className="text-[11px] text-text-secondary block mt-0.5">2 Bottlenecks eliminated</span>
        </div>
      </div>

      {/* Main Grid: Primary Recommendation Card + Ranked Alternatives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Primary Recommended Action (7 Cols Desktop, Full Width Mobile) */}
        <div className="lg:col-span-7">
          <ActionRecommendationCard />
        </div>

        {/* Ranked Alternative Candidates (5 Cols Desktop, Below on Mobile) */}
        <div className="lg:col-span-5 flex flex-col">
          <Panel title="Evaluated Counterfactual Alternatives">
            <div className="space-y-2.5">
              <div className="text-[11px] text-text-secondary pb-1">
                PRAVAAH simulated 25 destination and dosage candidates across available network routes:
              </div>

              {alternatives.map((alt, idx) => (
                <div key={alt.action_id || idx} className="bg-surface-muted/40 p-3 rounded-card-sm border border-border/70 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                      <span>Redirect {alt.dosage_pct}%</span>
                      <ArrowRight className="w-3 h-3 text-text-muted" />
                      <span>{alt.destination}</span>
                    </div>
                    <span className="text-[10.5px] font-mono font-bold text-text-secondary">
                      Score: {alt.score}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-text-muted">
                    <span>Target: <strong className="text-low font-semibold">{alt.target_after}/100</strong> (-{alt.reduction} pts)</span>
                    <span>Side Effect: <strong className="text-text-primary font-medium">+{alt.side_effect} pts</strong></span>
                  </div>
                </div>
              ))}

              <div className="p-2.5 bg-surface-muted/20 border border-border/50 rounded text-[10.5px] text-text-muted">
                Candidates with insufficient spare capacity or closed corridors were eliminated during safety validation.
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <div className="text-center pb-2">
        <p className="text-[10px] text-text-muted tracking-wide">
          Prototype simulation mode · Actions evaluated across multi-objective capacity and route constraints
        </p>
      </div>
    </div>
  )
}
