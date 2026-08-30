import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  LifeBuoy, 
  Droplets, 
  HeartPulse, 
  ShieldAlert, 
  Sparkles, 
  Phone, 
  MapPin, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { getVisitorSupport } from '../../services/visitorService'

const CATEGORIES = [
  { id: 'ALL',              label: 'All Support',       icon: LifeBuoy },
  { id: 'WATER_STATION',    label: 'Drinking Water',    icon: Droplets },
  { id: 'FIRST_AID',        label: 'Medical & First Aid',icon: HeartPulse },
  { id: 'POLICE_HELP_DESK', label: 'Police Help Desks', icon: ShieldAlert },
  { id: 'SANITATION',       label: 'Sanitation Units',  icon: Sparkles },
]

const EMERGENCY_CONTACTS = [
  { label: 'Mumbai Disaster Management', number: '1916', desc: 'BMC 24x7 Control Room' },
  { label: 'Mumbai Police Helpline',     number: '100 / 112', desc: 'Emergency response' },
  { label: 'Emergency Medical Service',  number: '108', desc: 'Ambulance dispatch' },
  { label: 'Railway Police (GRP/RPF)',   number: '1512', desc: 'Suburban train safety' },
]

export default function VisitorSupport() {
  const [supportData, setSupportData] = useState(null)
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getVisitorSupport(activeCategory)
      .then(setSupportData)
      .catch(err => {
        console.error('Failed to load support amenities:', err)
        setError('Could not fetch civic support data.')
      })
      .finally(() => setLoading(false))
  }, [activeCategory])

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full pt-1 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-navy-soft text-navy flex items-center justify-center">
            <LifeBuoy className="w-4 h-4 text-orange" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-text-primary">Civic Support & Welfare</h1>
            <p className="text-[11px] text-text-muted">Water, medical aid, police desks, and emergency help</p>
          </div>
        </div>

        <Link
          to="/visitor"
          className="text-xs text-navy font-semibold hover:underline"
        >
          Destinations
        </Link>
      </div>

      {/* Emergency Helplines Quick Banner */}
      <div className="bg-navy text-white rounded-card p-4 sm:p-5 shadow-elevated space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              Emergency Hotlines (24x7)
            </h2>
          </div>
          <span className="text-[10px] text-white/50 font-mono">Toll-Free</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {EMERGENCY_CONTACTS.map((c, i) => (
            <div key={i} className="bg-white/10 rounded-card-sm p-2.5 space-y-0.5">
              <span className="text-[10px] text-white/70 block leading-tight truncate">{c.label}</span>
              <a 
                href={`tel:${c.number.split(' ')[0]}`}
                className="text-sm sm:text-base font-extrabold text-orange hover:underline block font-mono"
              >
                {c.number}
              </a>
              <span className="text-[9px] text-white/50 block leading-none">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-surface border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange' : 'text-text-muted'}`} />
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* Amenity Locations List */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs sm:text-sm font-bold text-text-primary uppercase tracking-wider">
            Available Service Outposts
          </h3>
          <span className="text-xs text-text-muted">
            {supportData?.amenities?.length || 0} active outposts
          </span>
        </div>

        {loading ? (
          <div className="bg-surface border border-border rounded-card p-10 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-navy" />
            <span>Loading nearby welfare and medical outposts…</span>
          </div>
        ) : error ? (
          <div className="bg-surface border border-border rounded-card p-6 text-center space-y-2">
            <AlertCircle className="w-5 h-5 text-warning mx-auto" />
            <p className="text-xs text-text-secondary">{error}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {Array.isArray(supportData?.amenities) && supportData.amenities.map((a) => (
              <div 
                key={a.id}
                className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle flex items-center justify-between gap-3 hover:border-navy/40 transition-colors"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-navy flex-shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-text-primary truncate">
                      {a.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                    <span className="text-text-muted">{a.type.replace(/_/g, ' ')}</span>
                    <span>&middot;</span>
                    <span>Capacity: ~{a.capacity} persons/hr</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    a.status === 'ACTIVE'
                      ? 'bg-teal-soft text-teal-dark border-teal/40'
                      : 'bg-orange-soft text-orange-dark border-orange/40'
                  }`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-text-muted">
          Civic welfare dataset managed in collaboration with Municipal Corporation of Greater Mumbai
        </p>
      </div>
    </div>
  )
}
