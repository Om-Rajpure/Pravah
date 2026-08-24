import { useState, useEffect } from 'react'
import { TrainFront, Car, AlertTriangle, Clock, ArrowRight } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Panel } from '../../components/ui/Panel'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { LoadingState } from '../../components/shared/LoadingState'
import { ErrorState } from '../../components/shared/ErrorState'
import { NetworkDemoPanel } from '../../components/network/NetworkDemoPanel'
import { getTransport } from '../../lib/api'

export default function Mobility() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getTransport()
      setData(res)
    } catch (err) {
      console.error('Failed to fetch transport:', err)
      setError('Failed to load mobility data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingState message="Loading transit and road network..." />
  if (error) return <ErrorState title="Mobility data unavailable" message={error} onRetry={fetchData} />
  if (!data) return null

  const { summary, stations, roads, critical_bottlenecks } = data

  return (
    <div className="space-y-5">
      {/* Top Level Mobility Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Transit Design Capacity</span>
          <span className="text-[26px] font-bold text-text-primary">{(summary?.total_capacity / 1000).toFixed(0)}k</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">Passengers / hour total</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Current Hourly Load</span>
          <span className="text-[26px] font-bold text-text-primary">{(summary?.total_load / 1000).toFixed(0)}k</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">Active passengers in transit</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">System Aggregate Load</span>
          <span className="text-[26px] font-bold text-text-primary">{summary?.avg_load_percentage}%</span>
          <span className="text-[11px] text-critical font-medium block mt-0.5">+5% vs preceding hour</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Critical Rail Bottlenecks</span>
          <span className="text-[26px] font-bold text-critical">{critical_bottlenecks?.length || 0}</span>
          <span className="text-[11px] text-critical font-medium block mt-0.5">≥85% design capacity</span>
        </div>
      </div>

      {/* Interactive Network Connectivity & Disruption Simulation */}
      <NetworkDemoPanel />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Railway Nodes Table */}
        <div className="lg:col-span-7">
          <Panel title="Railway Network & Node Saturation">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-border bg-surface-muted/60 text-text-secondary">
                    <th className="py-2.5 px-3 font-semibold">Station</th>
                    <th className="py-2.5 px-3 font-semibold">Transit Line</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Capacity/h</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Load/h</th>
                    <th className="py-2.5 px-3 font-semibold">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {stations?.map((stn) => {
                    const isCritical = stn.load_percentage >= 85
                    const isHigh = stn.load_percentage >= 70 && stn.load_percentage < 85
                    return (
                      <tr key={stn.id} className="hover:bg-surface-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-text-primary">{stn.name}</td>
                        <td className="py-2.5 px-3 text-text-secondary">{stn.line}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-text-secondary">{stn.capacity.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium text-text-primary">{stn.current_load.toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-surface-muted h-1.5 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isCritical ? 'bg-critical' : isHigh ? 'bg-high' : 'bg-low'}`} 
                                style={{ width: `${Math.min(stn.load_percentage, 100)}%` }}
                              ></div>
                            </div>
                            <StatusBadge status={stn.status} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>

        {/* Road Network & Corridors */}
        <div className="lg:col-span-5 flex flex-col">
          <Panel title="Arterial Road Network & Closures" className="flex-1">
            <div className="space-y-2.5">
              {roads?.map((road) => {
                const isRestricted = road.status === 'RESTRICTED'
                const isClosed = road.status === 'CLOSED'
                return (
                  <div key={road.id} className="bg-surface-muted/40 border border-border/80 rounded-card-sm p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-primary">
                        <span>{road.source}</span>
                        <ArrowRight className="w-3 h-3 text-text-muted" />
                        <span>{road.target}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isClosed ? 'bg-critical/10 text-critical' : isRestricted ? 'bg-warning/10 text-warning' : 'bg-low/10 text-low'
                      }`}>
                        {road.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-muted mt-2">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-text-secondary" />
                        Est. Transit Time: <strong className="text-text-primary ml-1 font-semibold">{road.travel_time} min</strong>
                      </span>
                      <span>Capacity: {road.capacity.toLocaleString()} veh/h</span>
                    </div>

                    {road.closure_start && (
                      <div className="text-[10px] text-warning mt-1 font-medium">
                        Restriction Window: {road.closure_start} – {road.closure_end}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>
      </div>

      <div className="text-center pb-2">
        <p className="text-[10px] text-text-muted tracking-wide">Prototype data · Simulated + calibrated to real geography</p>
      </div>
    </div>
  )
}
