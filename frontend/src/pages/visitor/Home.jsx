import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MapPin, 
  ArrowRight, 
  Users, 
  Zap, 
  ShieldOff, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Navigation, 
  Check, 
  AlertTriangle,
  Compass,
  Sparkles
} from 'lucide-react'
import { getDestinations, getCurrentConditions } from '../../services/visitorService'

const CROWD_COLORS = {
  LOW:      'text-teal-dark bg-teal-soft border-teal/30',
  MODERATE: 'text-warning bg-warning-bg border-warning/40',
  HIGH:     'text-orange-dark bg-orange-soft border-orange/40',
  CRITICAL: 'text-critical bg-critical-bg border-critical/40',
}

const CROWD_DOT = {
  LOW:      'bg-teal',
  MODERATE: 'bg-warning',
  HIGH:     'bg-orange',
  CRITICAL: 'bg-critical',
}

const PREFERENCES = [
  { id: 'LESS_CROWDED',      label: 'Less Crowded',      icon: Users,     desc: 'Prioritizes lower crowd levels' },
  { id: 'FASTEST',           label: 'Fastest Route',     icon: Zap,       desc: 'Prioritizes shortest travel time' },
  { id: 'AVOID_DISRUPTION',  label: 'Avoid Disruptions', icon: ShieldOff, desc: 'Bypasses closed or congested links' },
  { id: 'LOWER_TRAVEL_TIME', label: 'Shorter Travel',    icon: Clock,     desc: 'Closest available destinations' },
]

const CATEGORIES = ['All', 'Pandal', 'Landmark', 'Temple', 'Beach', 'Market']

export default function VisitorHome() {
  const navigate = useNavigate()
  const [destinations, setDestinations] = useState([])
  const [conditions, setConditions] = useState(null)
  const [selectedDest, setSelectedDest] = useState('')
  const [preference, setPreference] = useState('LESS_CROWDED')
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading]  = useState(true)
  const [query, setQuery] = useState('')
  const [locationStatus, setLocationStatus] = useState('IDLE') // 'IDLE' | 'LOCATING' | 'GRANTED' | 'DENIED'
  const [locationModalOpen, setLocationModalOpen] = useState(false)
  const [userLocationName, setUserLocationName] = useState(null)

  useEffect(() => {
    Promise.all([getDestinations().catch(() => []), getCurrentConditions().catch(() => null)])
      .then(([dests, conds]) => {
        setDestinations(Array.isArray(dests) ? dests : (dests?.destinations || []))
        setConditions(conds)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Filtered & Searched destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter(d => {
      // Category filter
      if (activeCategory !== 'All' && !d.category?.toLowerCase().includes(activeCategory.toLowerCase())) {
        return false
      }
      // Query filter (searches name, area, category, description, keywords)
      if (query.trim()) {
        const q = query.toLowerCase()
        const matchName = d.name?.toLowerCase().includes(q)
        const matchArea = d.area?.toLowerCase().includes(q)
        const matchCat = d.category?.toLowerCase().includes(q)
        const matchDesc = d.description?.toLowerCase().includes(q)
        const matchKeywords = (d.keywords || []).some(k => k.toLowerCase().includes(q))
        return matchName || matchArea || matchCat || matchDesc || matchKeywords
      }
      return true
    })
  }, [destinations, activeCategory, query])

  // Approximate location handler (simulated privacy-safe neighbourhood geolocation)
  const handleRequestLocation = () => {
    setLocationStatus('LOCATING')
    setLocationModalOpen(false)
    
    // Simulate safe neighborhood detection (Dadar / Central Interchange)
    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setLocationStatus('GRANTED')
            setUserLocationName('Dadar Central Corridor (Approximate)')
          },
          () => {
            // Graceful fallback on permission denial
            setLocationStatus('DENIED')
            setUserLocationName(null)
          },
          { timeout: 4000 }
        )
      } else {
        setLocationStatus('DENIED')
      }
    }, 600)
  }

  const handleSelectDestination = (destId) => {
    navigate(`/visitor/destination/${destId}?pref=${preference}`)
  }

  return (
    <div className="flex flex-col gap-5 pt-1 max-w-2xl mx-auto w-full pb-6">
      {/* Hero Header */}
      <div className="bg-surface border border-border rounded-card p-4 sm:p-6 shadow-subtle text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-soft text-navy text-[10.5px] font-bold tracking-wide uppercase mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-orange" />
          <span>Ganesh Chaturthi 2026 · Real-Time Movement Intelligence</span>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-primary tracking-tight leading-tight mb-2">
          Where would you like to visit?
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
          PRAVAAH checks live crowd pressure and forecasts to recommend optimal arrival times and less-crowded alternatives.
        </p>

        {/* Live City Conditions Banner */}
        {conditions && (
          <div className="mt-4 pt-3.5 border-t border-border flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal"></span>
              <span><strong>{conditions.quiet_count || 3}</strong> Low Crowd</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning"></span>
              <span><strong>{conditions.moderate_count || 4}</strong> Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange"></span>
              <span><strong>{conditions.busy_count || 3}</strong> Busy Zones</span>
            </div>
          </div>
        )}
      </div>

      {/* Prominent Destination Search Bar */}
      <div className="bg-surface border border-border rounded-card p-3 sm:p-4 shadow-subtle space-y-3">
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search pandal, landmark, station, or area (e.g., Gateway, Lalbaug, Dadar)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-card-sm border border-border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted hover:text-text-primary px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-navy text-white shadow-sm'
                  : 'bg-surface-muted text-text-secondary hover:bg-border/60 hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Location Assistance Row */}
        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
          {locationStatus === 'GRANTED' ? (
            <div className="flex items-center gap-1.5 text-teal-dark font-medium bg-teal-soft px-2.5 py-1 rounded">
              <Check className="w-3.5 h-3.5 text-teal" />
              <span>Location: <strong>{userLocationName}</strong></span>
            </div>
          ) : (
            <button
              onClick={() => setLocationModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-navy font-semibold hover:text-navy-dark transition-colors py-1"
            >
              <Compass className="w-3.5 h-3.5 text-orange" />
              <span>Use my approximate location</span>
            </button>
          )}

          <span className="text-[11px] text-text-muted">
            {filteredDestinations.length} destination{filteredDestinations.length === 1 ? '' : 's'} available
          </span>
        </div>
      </div>

      {/* Preference Filter Selector */}
      <div className="bg-surface border border-border rounded-card p-3.5 sm:p-4 shadow-subtle">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[10.5px] uppercase font-bold text-text-secondary tracking-wider">
            Travel Preference
          </p>
          <span className="text-[11px] text-text-muted hidden sm:inline">
            Adapts guidance to your priority
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PREFERENCES.map(p => {
            const Icon = p.icon
            const active = preference === p.id
            return (
              <button
                key={p.id}
                onClick={() => setPreference(p.id)}
                className={`flex flex-col items-start p-2.5 rounded-card-sm border text-left transition-all ${
                  active
                    ? 'bg-navy-soft border-navy text-navy font-bold shadow-sm'
                    : 'bg-background border-border text-text-secondary hover:border-navy/40 hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-orange' : 'text-text-muted'}`} />
                  <span className="text-xs">{p.label}</span>
                </div>
                <span className="text-[10px] text-text-muted leading-tight line-clamp-1">{p.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Destinations List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Live Monitored Destinations
          </h2>
          <span className="text-xs text-text-muted">
            Live telemetry &middot; DEMO_SEED
          </span>
        </div>

        {loading ? (
          <div className="bg-surface border border-border rounded-card p-10 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin"></div>
            <span>Checking live city crowd conditions…</span>
          </div>
        ) : filteredDestinations.length === 0 ? (
          /* Search Empty State */
          <div className="bg-surface border border-border rounded-card p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-surface-muted text-text-muted flex items-center justify-center mx-auto">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-text-primary">No destination found</h3>
            <p className="text-xs text-text-secondary max-w-xs mx-auto">
              No destination matched "{query}". Try searching for Lalbaug, Gateway, Marine Drive, Siddhivinayak, or Dadar.
            </p>
            <button
              onClick={() => { setQuery(''); setActiveCategory('All'); }}
              className="px-3.5 py-1.5 bg-surface-muted text-text-primary rounded-card-sm text-xs font-semibold hover:bg-border/60 transition-colors"
            >
              Clear Search Filters
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredDestinations.map(d => {
              return (
                <div
                  key={d.destination_id}
                  onClick={() => handleSelectDestination(d.destination_id)}
                  className="bg-surface border border-border rounded-card p-3.5 sm:p-4 hover:border-navy/50 hover:shadow-subtle transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  {/* Left Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${CROWD_DOT[d.crowd_level] || 'bg-text-muted'}`} />
                      <h3 className="text-sm sm:text-base font-bold text-text-primary group-hover:text-navy transition-colors">
                        {d.name}
                      </h3>
                      {d.category && (
                        <span className="text-[10px] bg-surface-muted text-text-secondary px-1.5 py-0.5 rounded font-medium">
                          {d.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
                      <span className="text-text-muted">{d.area}</span>
                      <span>&middot;</span>
                      <span>
                        <Clock className="w-3 h-3 inline mr-1 text-text-muted" />
                        {d.travel_time_min > 0 ? `~${d.travel_time_min} min from Dadar` : 'Central zone'}
                      </span>
                      {d.travel_status === 'SLOW' && (
                        <>
                          <span>&middot;</span>
                          <span className="text-orange-dark font-semibold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Slower Transit
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Status & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded border uppercase ${CROWD_COLORS[d.crowd_level] || ''}`}>
                          {d.crowd_label || d.crowd_level}
                        </span>
                        {/* Trend Indicator */}
                        <span 
                          className="flex items-center text-[10px] font-bold text-text-muted"
                          title={`Crowd trend: ${d.trend}`}
                        >
                          {d.trend === 'INCREASING' && <TrendingUp className="w-3.5 h-3.5 text-critical ml-0.5" />}
                          {d.trend === 'EASING' && <TrendingDown className="w-3.5 h-3.5 text-teal ml-0.5" />}
                          {d.trend === 'STABLE' && <Minus className="w-3.5 h-3.5 text-text-muted ml-0.5" />}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-muted mt-0.5">
                        Expected {d.expected_crowd} in +60m
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-surface-muted group-hover:bg-navy group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Location Permission Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface border border-border rounded-card max-w-sm w-full p-5 shadow-elevated space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-navy-soft text-navy flex items-center justify-center">
                <Compass className="w-5 h-5 text-orange" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">Use Approximate Location</h3>
                <p className="text-[11px] text-text-muted">Privacy-safe neighbourhood detection</p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              PRAVAAH uses your device's approximate neighbourhood to calculate accurate travel times and highlight nearby options.
            </p>

            <div className="bg-teal-soft/60 border border-teal/30 rounded-card-sm p-2.5 text-[11px] text-teal-dark">
              <strong>Zero Tracking Guarantee:</strong> No GPS logs or individual movement history are stored.
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setLocationModalOpen(false)}
                className="px-3 py-1.5 rounded-card-sm text-xs font-semibold text-text-secondary hover:bg-surface-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestLocation}
                className="px-4 py-1.5 rounded-card-sm text-xs font-semibold bg-navy text-white hover:bg-navy-dark transition-colors shadow-sm"
              >
                Allow Approximate Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust & Privacy Note */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[10px] text-text-muted leading-snug">
          Conditions derived from live simulation telemetry &middot; Calibrated to Mumbai geography &middot; No individual tracking
        </p>
      </div>
    </div>
  )
}
