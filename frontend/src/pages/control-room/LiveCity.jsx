import { useState, useEffect } from 'react'
import { Map, Activity, Users, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Panel } from '../../components/ui/Panel'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { LoadingState } from '../../components/shared/LoadingState'
import { ErrorState } from '../../components/shared/ErrorState'
import { getZones, getMapState } from '../../lib/api'

export default function LiveCity() {
  const [zones, setZones] = useState([])
  const [mapState, setMapState] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [zonesData, mapData] = await Promise.all([getZones(), getMapState()])
      setZones(zonesData)
      setMapState(mapData)
      if (zonesData.length > 0) {
        setSelectedZone(zonesData[0])
      }
    } catch (err) {
      console.error('Failed to fetch live city data:', err)
      setError('Failed to load live city data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingState message="Loading live city telemetry..." />
  if (error) return <ErrorState title="Telemetry unavailable" message={error} onRetry={fetchData} />

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-surface border border-border rounded-card p-4">
        <div>
          <h2 className="text-base font-bold text-text-primary">Mumbai Operational Zones Telemetry</h2>
          <p className="text-[12px] text-text-secondary">Real-time calibrated crowd pressure across 11 monitored administrative corridors</p>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-text-muted">
          <span className="flex items-center gap-1.5 font-medium text-text-primary">
            <Layers className="w-4 h-4 text-terracotta" />
            {mapState?.locations?.length || 0} Key Landmarks
          </span>
          <span>&middot;</span>
          <span>{mapState?.stations?.length || 0} Transit Nodes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Zones Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {zones.map((zone) => {
              const isSelected = selectedZone?.id === zone.id
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`bg-surface border rounded-card p-3.5 cursor-pointer transition-all duration-150 shadow-subtle ${
                    isSelected 
                      ? 'border-terracotta ring-1 ring-terracotta bg-terracotta-soft/20' 
                      : 'border-border hover:border-border-strong hover:bg-surface-muted/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-[13px] font-bold text-text-primary leading-tight">{zone.name}</h4>
                      <span className="text-[10px] font-mono text-text-muted">H3: {zone.h3_index?.substring(0, 7)}...</span>
                    </div>
                    <StatusBadge status={zone.status} />
                  </div>

                  <div className="flex items-baseline justify-between mt-3">
                    <div>
                      <span className="text-[10px] uppercase text-text-muted font-medium block">Pressure</span>
                      <span className="text-[20px] font-bold text-text-primary">{zone.population_pressure}<span className="text-[12px] font-normal text-text-muted">/100</span></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-text-muted font-medium block">Est. Density</span>
                      <span className="text-[13px] font-semibold text-text-secondary">{zone.current_people?.toLocaleString() || '—'}</span>
                    </div>
                  </div>

                  {/* Flow rates */}
                  <div className="flex items-center justify-between text-[11px] pt-2 mt-2 border-t border-border/60 text-text-muted">
                    <span className="flex items-center text-critical">
                      <ArrowUpRight className="w-3 h-3 mr-0.5" /> +{zone.arrival_rate?.toLocaleString()}/h
                    </span>
                    <span className="flex items-center text-low">
                      <ArrowDownRight className="w-3 h-3 mr-0.5" /> -{zone.departure_rate?.toLocaleString()}/h
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected Zone Drilldown Panel */}
        <div className="lg:col-span-4 flex flex-col">
          {selectedZone ? (
            <Panel title={`Zone Detail: ${selectedZone.name}`} className="flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-surface-muted/50 p-3 rounded-card-sm border border-border/80">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold block">Crowd Index</span>
                    <span className="text-[24px] font-bold text-text-primary">{selectedZone.population_pressure} <span className="text-sm font-normal text-text-muted">/ 100</span></span>
                  </div>
                  <StatusBadge status={selectedZone.status} />
                </div>

                <div className="space-y-2.5 text-[12px]">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-secondary">Current Population:</span>
                    <span className="font-semibold text-text-primary">{selectedZone.current_people?.toLocaleString()} people</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-secondary">Arrival Velocity:</span>
                    <span className="font-semibold text-critical">+{selectedZone.arrival_rate?.toLocaleString()} / hr</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-secondary">Dispersal Velocity:</span>
                    <span className="font-semibold text-low">-{selectedZone.departure_rate?.toLocaleString()} / hr</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-secondary">Transport Capacity:</span>
                    <span className="font-semibold text-text-primary">{selectedZone.transport_capacity?.toLocaleString()} pass/hr</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-text-secondary">Hotel Room Base:</span>
                    <span className="font-semibold text-text-primary">{selectedZone.hotel_capacity?.toLocaleString()} rooms</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-text-secondary">Coordinates:</span>
                    <span className="font-mono text-text-muted text-[11px]">{selectedZone.lat.toFixed(4)}° N, {selectedZone.lng.toFixed(4)}° E</span>
                  </div>
                </div>

                <div className="bg-surface-muted/40 p-3 rounded-card-sm border border-border/60">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Activity className="w-3.5 h-3.5 text-terracotta" />
                    <span className="text-[11px] font-semibold text-text-primary">Operational Status</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {selectedZone.population_pressure >= 85 
                      ? 'High corridor saturation. Active flow modulation & transport gating recommended.'
                      : selectedZone.population_pressure >= 70
                        ? 'Elevated pilgrim density. Monitoring bottleneck junctions.'
                        : 'Operating within designed civic tolerance. Buffer capacity available.'}
                  </p>
                </div>
              </div>
            </Panel>
          ) : (
            <Card className="flex-1 flex items-center justify-center p-6 text-center text-text-muted">
              Select a zone from the grid to inspect real-time metrics
            </Card>
          )}
        </div>
      </div>

      <div className="text-center pb-2">
        <p className="text-[10px] text-text-muted tracking-wide">Prototype data · Simulated + calibrated to real geography</p>
      </div>
    </div>
  )
}
