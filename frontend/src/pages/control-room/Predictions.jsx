import { useState, useEffect } from 'react'
import { TrendingUp, AlertTriangle, ShieldCheck, Clock, Layers } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Panel } from '../../components/ui/Panel'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { LoadingState } from '../../components/shared/LoadingState'
import { ErrorState } from '../../components/shared/ErrorState'
import { ForecastControls } from '../../components/prediction/ForecastControls'
import { ForecastPanel } from '../../components/prediction/ForecastPanel'
import { getPredictions } from '../../services/predictionService'

export default function Predictions() {
  const [predictionData, setPredictionData] = useState(null)
  const [selectedHorizon, setSelectedHorizon] = useState(120) // Default ~2h peak
  const [selectedZoneId, setSelectedZoneId] = useState('curry-road')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPredictions()
      setPredictionData(data)
    } catch (err) {
      console.error('Failed to fetch predictions:', err)
      setError('Failed to load predictive telemetry')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingState message="Calculating network-aware pressure forecasts..." />
  if (error) return <ErrorState title="Predictions unavailable" message={error} onRetry={fetchData} />
  if (!predictionData) return null

  const zones = predictionData.zones || []
  const selectedZone = zones.find(z => z.zone_id === selectedZoneId) || zones[0]

  // Find max predicted pressure at active horizon
  const horizonIndex = selectedHorizon === 30 ? 0 : selectedHorizon === 60 ? 1 : selectedHorizon === 120 ? 2 : selectedHorizon === 180 ? 3 : 2
  const criticalCount = zones.filter(z => (z.predictions[horizonIndex]?.predicted_pressure || z.current_pressure) >= 76).length

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1600px] mx-auto">
      {/* Top Temporal Horizon Controls */}
      <ForecastControls
        selectedHorizon={selectedHorizon}
        onSelectHorizon={(h) => setSelectedHorizon(h)}
      />

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Peak Forecast Zone</span>
          <span className="text-xl sm:text-2xl font-bold text-critical">Curry Road</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">Projected: 94 / 100</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Critical Zones (+{selectedHorizon}m)</span>
          <span className="text-xl sm:text-2xl font-bold text-critical">{criticalCount}</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">≥76 Pressure threshold</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Model Architecture</span>
          <span className="text-xl sm:text-2xl font-bold text-text-primary">Physics + ML</span>
          <span className="text-[11px] text-low font-medium block mt-0.5">LightGBM Residuals (MAE: 1.02)</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Network Version</span>
          <span className="text-xl sm:text-2xl font-bold text-text-primary">v{predictionData.network_version || 1}</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">
            {predictionData.disruption_active ? 'Disruption Active' : 'Optimal Topology'}
          </span>
        </div>
      </div>

      {/* Main Grid: Multi-Zone Table + Selected Forecast Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Predictive Risk Overview (7 Cols Desktop, Full Width Mobile) */}
        <div className="lg:col-span-7">
          <Panel title={`Zonal Risk Projections (${selectedHorizon === 0 ? 'Observed' : `+${selectedHorizon} min`})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/60 text-text-secondary">
                    <th className="py-2.5 px-3 font-semibold">Corridor</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Observed</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Forecast</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Delta</th>
                    <th className="py-2.5 px-3 font-semibold">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {zones.map((z) => {
                    const isSelected = z.zone_id === selectedZoneId
                    const pred = z.predictions[horizonIndex] || z.predictions[2]
                    const delta = pred.delta
                    return (
                      <tr
                        key={z.zone_id}
                        onClick={() => setSelectedZoneId(z.zone_id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-terracotta-soft/30 font-semibold' : 'hover:bg-surface-muted/40'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-text-primary">
                          <div className="flex items-center gap-1.5">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-terracotta inline-block"></span>}
                            <span>{z.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-text-secondary">{z.current_pressure}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-text-primary">{pred.predicted_pressure}</td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          <span className={delta > 0 ? 'text-critical' : delta < 0 ? 'text-low' : 'text-text-muted'}>
                            {delta > 0 ? `+${delta}` : delta}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusBadge status={pred.predicted_level} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Selected Zone Forecast & Explainability (5 Cols Desktop, Below on Mobile) */}
        <div className="lg:col-span-5 flex flex-col">
          <ForecastPanel
            zoneForecast={selectedZone}
            selectedHorizon={selectedHorizon}
          />
        </div>
      </div>

      <div className="text-center pb-2">
        <p className="text-[10.5px] text-text-muted tracking-wide">
          Prototype data · Network-aware LightGBM residual model calibrated to Mumbai geometry
        </p>
      </div>
    </div>
  )
}
