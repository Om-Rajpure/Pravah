import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Bed, LifeBuoy, Clock, Navigation, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { getDestinations } from '../../services/visitorService'

export default function Plan() {
  const navigate = useNavigate()
  const [destinations, setDestinations] = useState([])
  const [selectedDestId, setSelectedDestId] = useState('lalbaugcha-raja')

  useEffect(() => {
    getDestinations()
      .then(dests => setDestinations(dests || []))
      .catch(console.error)
  }, [])

  const selected = destinations.find(d => d.destination_id === selectedDestId) || {
    name: 'Lalbaugcha Raja',
    area: 'Lalbaug / Parel',
    travel_time_min: 15,
    crowd_level: 'HIGH',
    crowd_label: 'Busy',
  }

  return (
    <div className="flex flex-col space-y-4 pt-2 max-w-2xl mx-auto w-full pb-8">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-navy-soft text-navy text-[10.5px] font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-orange" />
          <span>Ganesh Chaturthi 2026 Movement Planner</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">
          Your Movement Plan
        </h1>
        <p className="text-xs text-text-secondary">
          Personalized arrival window and transit suggestions based on crowd telemetry
        </p>
      </div>

      {/* Destination Selector */}
      <div className="bg-surface border border-border rounded-card p-4 shadow-subtle space-y-2">
        <label className="text-[10.5px] uppercase font-bold text-text-secondary tracking-wider block">
          Select Planned Destination
        </label>
        <select
          value={selectedDestId}
          onChange={(e) => setSelectedDestId(e.target.value)}
          className="w-full px-3 py-2.5 rounded-card-sm border border-border bg-background text-xs sm:text-sm font-semibold text-text-primary focus:outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
        >
          {destinations.map(d => (
            <option key={d.destination_id} value={d.destination_id}>
              {d.name} ({d.area}) — {d.crowd_label || d.crowd_level}
            </option>
          ))}
        </select>
      </div>

      {/* Optimal Timing Recommendation Card */}
      <div className="bg-surface border border-border rounded-card p-5 shadow-subtle space-y-3.5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10.5px] text-text-muted font-bold uppercase tracking-wider block mb-0.5">
              Recommended Optimal Window
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight">
              7:40 PM – 8:30 PM
            </div>
          </div>

          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-teal-soft text-teal-dark border border-teal/30 uppercase">
            Saves ~35 mins
          </span>
        </div>

        <div className="bg-teal-soft/60 border-l-[3px] border-teal rounded-card-sm p-3.5 text-xs text-text-primary leading-relaxed space-y-1">
          <p className="font-semibold text-teal-dark">
            Why this arrival window for {selected.name}?
          </p>
          <p className="text-text-secondary">
            Transit and queue congestion at access corridors peaks between 6:15 PM and 7:30 PM. Arriving after 7:40 PM bypasses peak railway bottleneck surges and reduces queue delay.
          </p>
        </div>
      </div>

      {/* Action Links */}
      <div className="flex flex-col space-y-2.5 pt-1">
        <Link to={`/visitor/route?to=${selectedDestId}`} className="w-full">
          <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2 shadow-sm font-bold">
            <Navigation className="w-4 h-4 text-orange" />
            <span>View Transit Route to {selected.name}</span>
          </Button>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Link to="/visitor/stay" className="w-full">
            <Button variant="secondary" size="md" className="w-full flex items-center justify-center gap-2 font-semibold">
              <Bed className="w-4 h-4 text-navy" />
              <span>Accommodation Guide</span>
            </Button>
          </Link>

          <Link to="/visitor/support" className="w-full">
            <Button variant="secondary" size="md" className="w-full flex items-center justify-center gap-2 font-semibold">
              <LifeBuoy className="w-4 h-4 text-navy" />
              <span>Civic Welfare Support</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pb-2">
        <p className="text-[10px] text-text-muted">
          SIMULATED &middot; Calibrated to real Mumbai geographic network &middot; No individual tracking
        </p>
      </div>
    </div>
  )
}
