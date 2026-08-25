import { useState, useEffect, useRef } from 'react'
import { Card } from '../../components/ui/Card'
import { KPICard } from '../../components/ui/KPICard'
import { Panel } from '../../components/ui/Panel'
import { AlertCard } from '../../components/ui/AlertCard'
import { RecommendationCard } from '../../components/ui/RecommendationCard'
import { LoadingState } from '../../components/shared/LoadingState'
import { ErrorState } from '../../components/shared/ErrorState'
import { MumbaiMap } from '../../components/map/MumbaiMap'
import { SimulationBar } from '../../components/simulation/SimulationBar'
import { getOverview, getMapState } from '../../lib/api'
import {
  getSimulationState,
  getSimulationTime,
  stepSimulation,
  startSimulation,
  pauseSimulation,
  resetSimulation
} from '../../services/simulationService'
import { getActionRecommendations } from '../../services/actionService'
import { crowdSimEngine } from '../../services/crowdSimulationEngine'

export default function Overview() {
  const [data, setData] = useState(null)
  const [mapData, setMapData] = useState(() => crowdSimEngine.getState())
  const [simState, setSimState] = useState(null)
  const [simStatus, setSimStatus] = useState('PAUSED')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [simLoading, setSimLoading] = useState(false)
  const [simResult, setSimResult] = useState(null)
  const timerRef = useRef(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [overview, mapState, simulation] = await Promise.all([
        getOverview().catch(() => null),
        getMapState().catch(() => null),
        getSimulationState().catch(() => null)
      ])
      if (overview) setData(overview)
      else {
        setData({
          city_pressure: 78,
          transport_load: 84,
          hotels_available: 3420,
          active_alerts: 2,
          alerts: [
            { id: '1', title: 'Curry Road Ingress Saturation', severity: 'CRITICAL', description: 'Pedestrian accumulation exceeding safety threshold at station footbridge.', zone: 'Curry Road' },
            { id: '2', title: 'Ambedkar Road Chokepoint', severity: 'HIGH', description: 'Flow velocity reduced to 0.4 m/s along Lalbaug approach.', zone: 'Lalbaug' }
          ],
          recommendation: {
            description: 'Redirect 18% of inbound suburban flow toward Thane and Vashi buffer corridors.',
            expected_result: 'Reduces Curry Road pressure from 94 to 76 (-18 pts)',
            action_label: 'Simulate Redirection Flow'
          }
        })
      }

      if (mapState?.geojson?.zones?.features?.length > 0) {
        setMapData(mapState)
      } else {
        setMapData(crowdSimEngine.getState())
      }

      if (simulation) {
        setSimState(simulation)
        setSimStatus(simulation.status || 'PAUSED')
      }
    } catch (err) {
      console.error('Failed to fetch overview dashboard data:', err)
      setMapData(crowdSimEngine.getState())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-step timer when simulation is running
  useEffect(() => {
    if (simStatus === 'RUNNING') {
      timerRef.current = setInterval(async () => {
        try {
          // Advance digital twin engine
          const nextState = crowdSimEngine.step(5)
          setMapData(nextState)

          // Advance backend simulation
          const updatedState = await stepSimulation().catch(() => null)
          if (updatedState) setSimState(updatedState)
        } catch (err) {
          console.warn('Auto simulation step notice:', err)
        }
      }, 3000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [simStatus])

  const handlePlay = async () => {
    setSimLoading(true)
    try {
      await startSimulation().catch(() => null)
      setSimStatus('RUNNING')
    } catch (err) {
      console.error('Failed to start simulation:', err)
    } finally {
      setSimLoading(false)
    }
  }

  const handlePause = async () => {
    setSimLoading(true)
    try {
      await pauseSimulation().catch(() => null)
      setSimStatus('PAUSED')
    } catch (err) {
      console.error('Failed to pause simulation:', err)
    } finally {
      setSimLoading(false)
    }
  }

  const handleStep = async () => {
    setSimLoading(true)
    try {
      // Step digital twin engine
      const nextMapState = crowdSimEngine.step(5)
      setMapData(nextMapState)

      // Step backend
      const updated = await stepSimulation().catch(() => null)
      if (updated) setSimState(updated)
    } catch (err) {
      console.error('Failed to advance simulation step:', err)
    } finally {
      setSimLoading(false)
    }
  }

  const handleReset = async () => {
    setSimLoading(true)
    try {
      const resetMap = crowdSimEngine.reset()
      setMapData(resetMap)

      const res = await resetSimulation().catch(() => null)
      if (res?.state) setSimState(res.state)
      setSimStatus('PAUSED')
      setSimResult(null)
    } catch (err) {
      console.error('Failed to reset simulation:', err)
    } finally {
      setSimLoading(false)
    }
  }

  const handleSimulateAction = async () => {
    setSimLoading(true)
    try {
      crowdSimEngine.setIntervention(true)
      setMapData(crowdSimEngine.getState())

      const rec = await getActionRecommendations().catch(() => null)
      const impact = rec?.impact || {
        target_pressure_before: 94,
        target_pressure_after: 76,
        pressure_reduction: 18,
        critical_zones_before: 3,
        critical_zones_after: 1
      }
      setSimResult({
        before: impact.target_pressure_before,
        after: impact.target_pressure_after,
        reduction: impact.pressure_reduction,
        criticalBefore: impact.critical_zones_before,
        criticalAfter: impact.critical_zones_after,
      })
    } catch (err) {
      console.error('Simulation action failed:', err)
    } finally {
      setSimLoading(false)
    }
  }

  if (loading && !mapData) return <LoadingState message="Loading city operations overview..." />
  if (error && !mapData) return <ErrorState title="Dashboard unavailable" message={error} onRetry={fetchData} />

  // Calculate dynamic values from simulation state
  const simTime = simState?.simulation_time || mapData?.time || '18:00'
  const activeVisitors = simState?.active_visitors || mapData?.active_movement_count || 12800

  const kpis = [
    { 
      title: 'City Pressure', 
      value: `${data?.city_pressure || 78} / 100`, 
      trend: { value: '+8% vs prev hour', direction: 'up', isPositive: false }, 
      status: (data?.city_pressure || 78) >= 85 ? 'CRITICAL' : (data?.city_pressure || 78) >= 70 ? 'HIGH' : (data?.city_pressure || 78) >= 50 ? 'MODERATE' : 'LOW' 
    },
    { 
      title: 'Simulation Time', 
      value: simTime, 
      subtitle: 'Ganesh Chaturthi Day 9',
      status: 'MODERATE'
    },
    { 
      title: 'Hotels Available', 
      value: data?.hotels_available?.toLocaleString() || '3,420', 
      subtitle: 'across monitored zones' 
    },
    { 
      title: 'Transport Load', 
      value: `${data?.transport_load || 84}%`, 
      trend: { value: '+5% load', direction: 'up', isPositive: false } 
    },
    { 
      title: 'Active Alerts', 
      value: `${data?.active_alerts || 2}`, 
      subtitle: `${data?.alerts?.filter(a => a.severity === 'CRITICAL').length || 1} critical alerts` 
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto">
      {/* Simulation Clock & Lifecycle Bar */}
      <SimulationBar
        simTime={simTime}
        status={simStatus}
        activeVisitors={activeVisitors}
        onPlay={handlePlay}
        onPause={handlePause}
        onStep={handleStep}
        onReset={handleReset}
        loading={simLoading}
      />

      {/* KPI Cards Row */}
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="min-w-[190px] sm:min-w-0 flex-shrink-0 flex-1">
            <KPICard {...kpi} />
          </div>
        ))}
      </div>
      
      {/* Central Interactive Operations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Mumbai Map Visual Centerpiece */}
        <div className="lg:col-span-8 flex flex-col min-h-[380px] sm:min-h-[440px] lg:min-h-[500px]">
          <MumbaiMap 
            mapData={mapData}
            onSimulateAction={handleSimulateAction}
            className="flex-1 shadow-subtle"
          />
        </div>
        
        {/* Intelligence / Alerts Feed */}
        <div className="lg:col-span-4 flex flex-col">
          <Panel title="What Needs Attention" className="flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              {(data?.alerts || []).map((alert, idx) => (
                <AlertCard key={idx} {...alert} />
              ))}
            </div>
          </Panel>
        </div>
      </div>
      
      {/* Primary Recommendation Card */}
      {data?.recommendation && (
        <RecommendationCard
          description={data.recommendation.description}
          expectedResult={data.recommendation.expected_result}
          actionLabel={simLoading ? 'Simulating…' : data.recommendation.action_label}
          onAction={handleSimulateAction}
        />
      )}

      {/* Simulated Impact Result */}
      {simResult && (
        <div className="bg-low/5 border border-low/30 rounded-card p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-low tracking-wider mb-1">
              SIMULATION · Counterfactual Impact
            </p>
            <p className="text-sm text-text-primary">
              Curry Road pressure: <strong className="text-critical">{simResult.before}%</strong>
              {' → '}
              <strong className="text-low">{simResult.after}%</strong>
              {' (−'}{simResult.reduction}{' pts) ·  Critical zones: '}
              <strong>{simResult.criticalBefore} → {simResult.criticalAfter}</strong>
            </p>
            <p className="text-[10.5px] text-text-muted mt-0.5">SIMULATION — not applied to live state.</p>
          </div>
          <button
            onClick={() => setSimResult(null)}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Data Source Label */}
      <div className="text-center pt-2 pb-1">
        <p className="text-[10.5px] text-text-muted tracking-wide">
          SIMULATION · Deterministic crowd & transit model calibrated to real Mumbai geography · DEMO_SEED=20260908
        </p>
      </div>
    </div>
  )
}
