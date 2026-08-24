import { useState, useEffect } from 'react'
import { Map } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { KPICard } from '../../components/ui/KPICard'
import { Panel } from '../../components/ui/Panel'
import { AlertCard } from '../../components/ui/AlertCard'
import { RecommendationCard } from '../../components/ui/RecommendationCard'
import { LoadingState } from '../../components/shared/LoadingState'
import { ErrorState } from '../../components/shared/ErrorState'
import { getOverview } from '../../lib/api'

export default function Overview() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const overview = await getOverview()
      setData(overview)
    } catch (err) {
      console.error('Failed to fetch overview:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingState message="Loading dashboard..." />
  if (error) return <ErrorState title="Dashboard unavailable" message={error} onRetry={fetchData} />
  if (!data) return null

  const kpis = [
    { title: 'City Pressure', value: `${data.city_pressure} / 100`, trend: { value: '+8% from last hour', direction: 'up', isPositive: false }, status: data.city_pressure >= 85 ? 'CRITICAL' : data.city_pressure >= 70 ? 'HIGH' : data.city_pressure >= 50 ? 'MODERATE' : 'LOW' },
    { title: 'Predicted Peak', value: `${data.predicted_peak} / 100`, subtitle: 'in ~3 hours', status: data.predicted_peak >= 85 ? 'CRITICAL' : 'HIGH' },
    { title: 'Hotels Available', value: data.hotels_available?.toLocaleString() || '—', subtitle: 'across monitored zones' },
    { title: 'Transport Load', value: `${data.transport_load}%`, trend: { value: '+5%', direction: 'up', isPositive: false } },
    { title: 'Active Alerts', value: `${data.active_alerts}`, subtitle: `${data.alerts?.filter(a => a.severity === 'CRITICAL').length || 0} critical` },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col">
          <Card className="flex-1 flex flex-col items-center justify-center min-h-[420px] !border-dashed !border-2 !border-border !bg-surface-muted/30">
            <Map className="w-10 h-10 text-text-muted mb-3" strokeWidth={1.5} />
            <h3 className="text-base font-medium text-text-primary mb-1">Mumbai Map</h3>
            <p className="text-[12px] text-text-muted">Real map will be integrated in Phase 3</p>
          </Card>
        </div>
        
        <div className="lg:col-span-4 flex flex-col">
          <Panel title="What Needs Attention" className="flex-1">
            <div className="space-y-2">
              {(data.alerts || []).map((alert, idx) => (
                <AlertCard key={idx} {...alert} />
              ))}
            </div>
          </Panel>
        </div>
      </div>
      
      {data.recommendation && (
        <RecommendationCard 
          description={data.recommendation.description}
          expectedResult={data.recommendation.expected_result}
          actionLabel={data.recommendation.action_label}
          onAction={() => alert('Simulation will be available in Phase 12.')}
        />
      )}
      
      <div className="text-center pb-2">
        <p className="text-[10px] text-text-muted tracking-wide">Prototype data · Simulated + calibrated to real geography</p>
      </div>
    </div>
  )
}
