import React, { useState, useEffect } from 'react'
import { ScenarioSelector } from '../../components/scenarios/ScenarioSelector'
import { ScenarioScorecard } from '../../components/scenarios/ScenarioScorecard'
import { ScenarioCascadePanel } from '../../components/scenarios/ScenarioCascadePanel'
import { LoadingState } from '../../components/shared/LoadingState'
import { getScenarios, simulateScenario, resetScenario } from '../../services/scenarioService'

export default function Scenarios() {
  const [scenarios, setScenarios] = useState([])
  const [selectedScenarioId, setSelectedScenarioId] = useState('central-line-disruption')
  const [scenarioSimResult, setScenarioSimResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [simLoading, setSimLoading] = useState(false)

  useEffect(() => {
    getScenarios()
      .then(setScenarios)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSimulate = async () => {
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

  const handleReset = async () => {
    try {
      setSimLoading(true)
      await resetScenario()
      setScenarioSimResult(null)
    } catch (err) {
      console.error('Scenario reset failed:', err)
    } finally {
      setSimLoading(false)
    }
  }

  if (loading) return <LoadingState message="Loading scenario configurations..." />

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto">
      <ScenarioSelector
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={setSelectedScenarioId}
        onSimulate={handleSimulate}
        onReset={handleReset}
        loading={simLoading}
        isDisrupted={Boolean(scenarioSimResult)}
      />

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

      {!scenarioSimResult && (
        <div className="bg-surface border border-border rounded-card p-6 text-center text-sm text-text-secondary">
          Select a scenario and click <strong>Simulate</strong> to see the 3-way impact scorecard
          (Baseline → Disruption → + Action).
        </div>
      )}

      <div className="text-center pb-2">
        <p className="text-[10px] text-text-muted tracking-wide">
          Scenarios run isolated counterfactual simulations · Live city state is not affected until Activate is pressed.
        </p>
      </div>
    </div>
  )
}
