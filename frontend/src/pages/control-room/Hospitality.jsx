import { useState, useEffect } from 'react'
import { Hotel, Bed, DollarSign, PieChart, ShieldAlert, ArrowRight } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Panel } from '../../components/ui/Panel'
import { LoadingState } from '../../components/shared/LoadingState'
import { ErrorState } from '../../components/shared/ErrorState'
import { getHotels } from '../../lib/api'

export default function Hospitality() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getHotels()
      setData(res)
    } catch (err) {
      console.error('Failed to fetch hotels:', err)
      setError('Failed to load hospitality data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingState message="Loading accommodation capacity..." />
  if (error) return <ErrorState title="Hospitality data unavailable" message={error} onRetry={fetchData} />
  if (!data) return null

  const { summary, clusters, distribution } = data

  return (
    <div className="space-y-5">
      {/* Top Level Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Total Monitored Rooms</span>
          <span className="text-[26px] font-bold text-text-primary">{summary?.total_rooms?.toLocaleString()}</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">Across 10 regional clusters</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Available Rooms</span>
          <span className="text-[26px] font-bold text-text-primary">{summary?.available_rooms?.toLocaleString()}</span>
          <span className="text-[11px] text-low font-medium block mt-0.5">Available for redistribution</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Avg Occupancy Rate</span>
          <span className="text-[26px] font-bold text-text-primary">{summary?.avg_occupancy_rate}%</span>
          <span className="text-[11px] text-critical font-medium block mt-0.5">Peak evening load</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Average Nightly ADR</span>
          <span className="text-[26px] font-bold text-text-primary">₹{Math.round(summary?.avg_price || 0).toLocaleString()}</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">Event surge adjusted</span>
        </div>
      </div>

      {/* Regional Redistribution Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[13px] font-bold text-text-primary">Core Mumbai Corridor (South, Parel, Dadar)</h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-critical/10 text-critical">SATURATED</span>
            </div>
            <p className="text-[12px] text-text-secondary mb-3">High congestion near immersion routes and primary mandals.</p>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-text-muted mb-1">
              <span>Occupancy: {distribution?.core_mumbai?.occupancy_rate}%</span>
              <span>Available: {distribution?.core_mumbai?.available?.toLocaleString()} rooms</span>
            </div>
            <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
              <div className="bg-critical h-full rounded-full" style={{ width: `${distribution?.core_mumbai?.occupancy_rate}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-[13px] font-bold text-text-primary">Buffer Suburbs (Thane, Vashi, Navi Mumbai)</h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-low/10 text-low">SPARE BUFFER</span>
            </div>
            <p className="text-[12px] text-text-secondary mb-3">Accessible accommodation along Eastern Freeway and Trans-Harbour corridors.</p>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-text-muted mb-1">
              <span>Occupancy: {distribution?.buffer_suburbs?.occupancy_rate}%</span>
              <span>Available: {distribution?.buffer_suburbs?.available?.toLocaleString()} rooms</span>
            </div>
            <div className="w-full bg-surface-muted h-2 rounded-full overflow-hidden">
              <div className="bg-low h-full rounded-full" style={{ width: `${distribution?.buffer_suburbs?.occupancy_rate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Clusters Breakdown Table */}
      <Panel title="Monitored Accommodation Clusters">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60 text-text-secondary">
                <th className="py-2.5 px-3 font-semibold">Cluster Name</th>
                <th className="py-2.5 px-3 font-semibold">Administrative Zone</th>
                <th className="py-2.5 px-3 font-semibold text-right">Total Rooms</th>
                <th className="py-2.5 px-3 font-semibold text-right">Available</th>
                <th className="py-2.5 px-3 font-semibold">Occupancy</th>
                <th className="py-2.5 px-3 font-semibold text-right">Avg Rate / Night</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {clusters?.map((hotel) => {
                const isHighOcc = hotel.occupancy_rate >= 85
                const isModerateOcc = hotel.occupancy_rate >= 60 && hotel.occupancy_rate < 85
                return (
                  <tr key={hotel.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-text-primary">{hotel.name}</td>
                    <td className="py-2.5 px-3 text-text-secondary capitalize">{hotel.zone_name}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-text-secondary">{hotel.total_rooms.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-text-primary">{hotel.available_rooms.toLocaleString()}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-surface-muted h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isHighOcc ? 'bg-critical' : isModerateOcc ? 'bg-warning' : 'bg-low'}`} 
                            style={{ width: `${hotel.occupancy_rate}%` }}
                          ></div>
                        </div>
                        <span className={`text-[11px] font-semibold ${isHighOcc ? 'text-critical' : isModerateOcc ? 'text-warning' : 'text-low'}`}>
                          {hotel.occupancy_rate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-text-primary">₹{hotel.price.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="text-center pb-2">
        <p className="text-[10px] text-text-muted tracking-wide">Prototype data · Simulated + calibrated to real geography</p>
      </div>
    </div>
  )
}
