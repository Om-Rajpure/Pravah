import { useState, useEffect } from 'react'
import { HeartHandshake, Droplets, Stethoscope, Sparkles, Coffee, ShieldCheck, AlertCircle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Panel } from '../../components/ui/Panel'
import { LoadingState } from '../../components/shared/LoadingState'
import { ErrorState } from '../../components/shared/ErrorState'
import { getWelfare } from '../../lib/api'

const FALLBACK_WELFARE = {
  summary: {
    total_amenities: 124,
    congested_count: 14,
    by_type: {
      water: 45,
      medical: 28,
      toilet: 32,
      rest: 10,
      food: 9
    }
  },
  amenities: [
    { id: 'w-1', name: 'Lalbaug Main Medical Tent', type: 'medical', capacity: 50, status: 'CONGESTED' },
    { id: 'w-2', name: 'Curry Road Station Water Dispenser', type: 'water', capacity: 500, status: 'CONGESTED' },
    { id: 'w-3', name: 'Hindmata Mobile Toilets', type: 'toilet', capacity: 120, status: 'NORMAL' },
    { id: 'w-4', name: 'Dadar TT Rest Area', type: 'rest', capacity: 200, status: 'NORMAL' },
    { id: 'w-5', name: 'Parel First Aid Post', type: 'medical', capacity: 20, status: 'CONGESTED' }
  ]
}

export default function Welfare() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getWelfare().catch(() => null)
      setData(res || FALLBACK_WELFARE)
    } catch (err) {
      console.error('Failed to fetch welfare data:', err)
      setData(FALLBACK_WELFARE)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <LoadingState message="Loading civic welfare telemetry..." />
  if (!data) return null

  const { summary, amenities } = data

  const typeIcons = {
    water: Droplets,
    medical: Stethoscope,
    toilet: ShieldCheck,
    rest: Coffee,
    food: HeartHandshake
  }

  return (
    <div className="space-y-5">
      {/* Welfare Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Total Civic Amenities</span>
          <span className="text-[26px] font-bold text-text-primary">{summary?.total_amenities}</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">Calibrated emergency posts</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Active Medical & First Aid</span>
          <span className="text-[26px] font-bold text-low">{summary?.by_type?.medical || 0} Outposts</span>
          <span className="text-[11px] text-low font-medium block mt-0.5">Operating normally</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Free Water Distribution</span>
          <span className="text-[26px] font-bold text-text-primary">{summary?.by_type?.water || 0} Stations</span>
          <span className="text-[11px] text-text-secondary block mt-0.5">High pilgrim throughput</span>
        </div>

        <div className="bg-surface border border-border rounded-card p-4 shadow-subtle">
          <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider block mb-1">Congested Facilities</span>
          <span className="text-[26px] font-bold text-warning">{summary?.congested_count || 0}</span>
          <span className="text-[11px] text-warning font-medium block mt-0.5">Near Curry Road & Chinchpokli</span>
        </div>
      </div>

      {/* Amenities Directory */}
      <Panel title="Civic Support Points & Emergency Amenities">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/60 text-text-secondary">
                <th className="py-2.5 px-3 font-semibold">Amenity Name</th>
                <th className="py-2.5 px-3 font-semibold">Category</th>
                <th className="py-2.5 px-3 font-semibold text-right">Throughput Capacity</th>
                <th className="py-2.5 px-3 font-semibold">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {amenities?.map((amenity) => {
                const IconComponent = typeIcons[amenity.type] || HeartHandshake
                const isCongested = amenity.status === 'CONGESTED'
                return (
                  <tr key={amenity.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-text-primary">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-surface-muted text-text-secondary">
                          <IconComponent className="w-3.5 h-3.5" />
                        </span>
                        {amenity.name}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-text-secondary uppercase text-[11px] font-semibold tracking-wide">
                      {amenity.type}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-text-primary">
                      {amenity.capacity.toLocaleString()} {amenity.type === 'medical' ? 'beds/triage' : 'units/hr'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isCongested ? 'bg-warning/10 text-warning' : 'bg-low/10 text-low'
                      }`}>
                        {amenity.status}
                      </span>
                    </td>
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
