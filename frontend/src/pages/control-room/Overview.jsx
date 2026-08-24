import { useState, useEffect } from 'react'
import { Card } from '../../components/ui/Card'
import { KPICard } from '../../components/ui/KPICard'
import { Panel } from '../../components/ui/Panel'
import { AlertCard } from '../../components/ui/AlertCard'
import { RecommendationCard } from '../../components/ui/RecommendationCard'
import { LoadingState } from '../../components/shared/LoadingState'
import { ErrorState } from '../../components/shared/ErrorState'
import { MumbaiMap } from '../../components/map/MumbaiMap'
import { getOverview, getMapState } from '../../lib/api'

export default function Overview() {
  const [data, setData] = useState(null)
  const [mapData, setMapData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [simulationActive, setSimulationActive] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [overview, mapState] = await Promise.all([
        getOverview(),
        getMapState()
      ])
      setData(overview)
      setMapData(mapState)
    } catch (err) {
      console.error('Failed to fetch overview dashboard data:', err)
      setError('Failed to load dashboard telemetry')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSimulateAction = (actionDetails) => {
    setSimulationActive(true)
    alert(`Simulating intervention for: ${actionDetails?.name || 'Selected Corridor'}\n\nExpected Result: Dispersing 18% flow toward Thane/Vashi buffers.\nPressure reduces to 76% in ~45 minutes.`)
  }

  if (loading) return <LoadingState message="Loading city operations overview..." />
  if (error) return <ErrorState title="Dashboard unavailable" message={error} onRetry={fetchData} />
  if (!data) return null

  const kpis = [
    { 
      title: 'City Pressure', 
      value: `${data.city_pressure} / 100`, 
      trend: { value: '+8% vs prev hour', direction: 'up', isPositive: false }, 
      status: data.city_pressure >= 85 ? 'CRITICAL' : data.city_pressure >= 70 ? 'HIGH' : data.city_pressure >= 50 ? 'MODERATE' : 'LOW' 
    },
    { 
      title: 'Predicted Peak', 
      value: `${data.predicted_peak} / 100`, 
      subtitle: 'expected in ~3 hours', 
      status: data.predicted_peak >= 85 ? 'CRITICAL' : 'HIGH' 
    },
    { 
      title: 'Hotels Available', 
      value: data.hotels_available?.toLocaleString() || '—', 
      subtitle: 'across monitored zones' 
    },
    { 
      title: 'Transport Load', 
      value: `${data.transport_load}%`, 
      trend: { value: '+5% load', direction: 'up', isPositive: false } 
    },
    { 
      title: 'Active Alerts', 
      value: `${data.active_alerts}`, 
      subtitle: `${data.alerts?.filter(a => a.severity === 'CRITICAL').length || 1} critical alerts` 
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto">
      {/* KPI Cards Row: Horizontal scroll on mobile, 5-col grid on desktop */}
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="min-w-[190px] sm:min-w-0 flex-shrink-0 flex-1">
            <KPICard {...kpi} />
          </div>
        ))}
      </div>
      
      {/* Central Interactive Operations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Mumbai Map Visual Centerpiece (8 Cols Desktop, Full Width Mobile) */}
        <div className="lg:col-span-8 flex flex-col min-h-[380px] sm:min-h-[440px] lg:min-h-[500px]">
          <MumbaiMap 
            mapData={mapData}
            onSimulateAction={handleSimulateAction}
            className="flex-1 shadow-subtle"
          />
        </div>
        
        {/* Intelligence / Alerts Feed (4 Cols Desktop, Below Map on Mobile) */}
        <div className="lg:col-span-4 flex flex-col">
          <Panel title="What Needs Attention" className="flex-1 flex flex-col">
            <div className="space-y-2 flex-1">
              {(data.alerts || []).map((alert, idx) => (
                <AlertCard key={idx} {...alert} />
              ))}
            </div>
          </Panel>
        </div>
      </div>
      
      {/* Primary Recommendation Card */}
      {data.recommendation && (
        <RecommendationCard 
          description={data.recommendation.description}
          expectedResult={data.recommendation.expected_result}
          actionLabel={data.recommendation.action_label}
          onAction={() => handleSimulateAction(data.recommendation)}
        />
      )}
      
      {/* Data Source Label */}
      <div className="text-center pt-2 pb-1">
        <p className="text-[10.5px] text-text-muted tracking-wide">
          Prototype data · Simulated + calibrated to real geography
        </p>
      </div>
    </div>
  )
}
