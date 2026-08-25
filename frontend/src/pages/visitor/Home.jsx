import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ArrowRight, Users, Zap, ShieldOff, Clock } from 'lucide-react'
import { getDestinations } from '../../services/visitorService'

const CROWD_COLORS = {
  LOW:      'text-low bg-low/10 border-low/30',
  MODERATE: 'text-warning-dark bg-warning/10 border-warning/30',
  HIGH:     'text-critical bg-critical/10 border-critical/30',
  CRITICAL: 'text-critical bg-critical/20 border-critical/50',
}

const CROWD_DOT = {
  LOW:      'bg-low',
  MODERATE: 'bg-warning',
  HIGH:     'bg-critical',
  CRITICAL: 'bg-critical',
}

const PREFERENCES = [
  { id: 'LESS_CROWDED',     label: 'Less Crowded',      icon: Users },
  { id: 'FASTEST',          label: 'Fastest Route',     icon: Zap },
  { id: 'AVOID_DISRUPTION', label: 'Avoid Disruptions', icon: ShieldOff },
  { id: 'LOWER_TRAVEL_TIME',label: 'Shorter Travel',    icon: Clock },
]

const POPULAR_IDS = [
  'lalbaugcha-raja', 'gateway-of-india', 'marine-drive',
  'siddhivinayak', 'girgaon-chowpatty', 'dadar-market',
]

export default function VisitorHome() {
  const navigate = useNavigate()
  const [destinations, setDestinations] = useState([])
  const [selectedDest, setSelectedDest] = useState('')
  const [preference, setPreference] = useState('LESS_CROWDED')
  const [loading, setLoading]  = useState(true)
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const popular = destinations.filter(d => POPULAR_IDS.includes(d.destination_id))
  const filtered = query.length > 1
    ? destinations.filter(d => d.name.toLowerCase().includes(query.toLowerCase()))
    : []

  const handleFind = () => {
    if (!selectedDest) return
    navigate(`/visitor/destination/${selectedDest}?pref=${preference}`)
  }

  return (
    <div className="flex flex-col gap-5 pt-2 max-w-lg mx-auto w-full">
      {/* Hero */}
      <div className="text-center pt-2 pb-1">
        <p className="text-[10.5px] uppercase tracking-widest text-text-muted font-semibold mb-1">
          Ganesh Chaturthi 2026 · Mumbai
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
          Where would you like to visit?
        </h1>
        <p className="text-xs text-text-secondary mt-1.5">
          PRAVAAH suggests better times and alternatives based on current crowd conditions.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search a destination…"
          value={query}
          onChange={e => { setQuery(e.target.value); setSearching(true) }}
          onBlur={() => setTimeout(() => setSearching(false), 200)}
          className="w-full pl-9 pr-4 py-3 rounded-card border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-terracotta transition-colors"
        />
        {/* Search dropdown */}
        {searching && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-card shadow-subtle z-10 overflow-hidden">
            {filtered.map(d => (
              <button
                key={d.destination_id}
                onMouseDown={() => {
                  setSelectedDest(d.destination_id)
                  setQuery(d.name)
                  setSearching(false)
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-muted flex items-center justify-between"
              >
                <span className="font-medium text-text-primary">{d.name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${CROWD_COLORS[d.crowd_level] || ''}`}>
                  {d.crowd_level}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preference Picker */}
      <div>
        <p className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider mb-2">
          What matters most?
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PREFERENCES.map(p => {
            const Icon = p.icon
            const active = preference === p.id
            return (
              <button
                key={p.id}
                onClick={() => setPreference(p.id)}
                className={`min-h-[52px] flex items-center gap-2 px-3 py-2.5 rounded-card border text-xs font-semibold transition-all ${
                  active
                    ? 'bg-terracotta text-white border-terracotta shadow-subtle'
                    : 'bg-surface border-border text-text-secondary hover:border-terracotta/50 hover:text-text-primary'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Find Button */}
      <button
        onClick={handleFind}
        disabled={!selectedDest}
        className="w-full min-h-[52px] bg-terracotta text-white hover:bg-terracotta-dark rounded-card font-bold text-sm flex items-center justify-center gap-2 shadow-subtle transition-colors disabled:opacity-50"
      >
        <span>Find the Best Option</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Popular Destinations */}
      <div>
        <p className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider mb-2.5">
          Popular Destinations — Live Conditions
        </p>
        {loading ? (
          <div className="text-center text-xs text-text-muted py-6">Loading crowd conditions…</div>
        ) : (
          <div className="space-y-2">
            {popular.map(d => (
              <button
                key={d.destination_id}
                onClick={() => navigate(`/visitor/destination/${d.destination_id}?pref=${preference}`)}
                className="w-full bg-surface border border-border rounded-card p-3.5 flex items-center justify-between hover:border-terracotta/40 transition-colors min-h-[52px]"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${CROWD_DOT[d.crowd_level] || 'bg-text-muted'}`} />
                  <span className="text-sm font-semibold text-text-primary">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded border ${CROWD_COLORS[d.crowd_level] || ''}`}>
                    {d.crowd_label || d.crowd_level}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Data Disclosure */}
      <p className="text-center text-[10px] text-text-muted pb-4">
        Conditions based on simulated aggregated crowd data · No personal data required
      </p>
    </div>
  )
}
