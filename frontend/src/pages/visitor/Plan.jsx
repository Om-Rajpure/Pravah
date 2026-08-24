import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Bed, LifeBuoy } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

export default function Plan() {
  return (
    <div className="flex flex-col space-y-4 pt-4 sm:pt-6 px-1">
      <div className="text-center mb-1">
        <h2 className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-semibold mb-1">Your Ganpati Pilgrimage Plan</h2>
        <h1 className="text-[20px] sm:text-[22px] font-bold text-text-primary">Lalbaugcha Raja</h1>
      </div>
      
      <Card className="flex flex-col space-y-3.5 shadow-subtle">
        <div>
          <div className="text-[11px] text-text-muted font-semibold uppercase tracking-wide mb-0.5">Recommended Optimal Arrival</div>
          <div className="text-[24px] font-bold text-terracotta-dark">7:40 PM</div>
        </div>
        <div className="bg-terracotta-soft border-l-[3px] border-terracotta rounded-card-sm p-3 text-[12.5px] text-text-primary leading-relaxed">
          Crowds at Bharat Mata & GD Ambekar Marg peak between 6:30 and 7:30 PM. Arriving at 7:40 PM reduces queue waiting time by ~35 minutes.
        </div>
      </Card>
      
      <div className="flex flex-col space-y-2.5 mt-2">
        <Link to="/visitor/route" className="w-full">
          <Button variant="primary" size="lg" className="w-full flex items-center justify-center">
            <MapPin className="w-4 h-4 mr-2.5" />
            View Congestion-Aware Route
          </Button>
        </Link>
        <Link to="/visitor/stay" className="w-full">
          <Button variant="secondary" size="lg" className="w-full flex items-center justify-center">
            <Bed className="w-4 h-4 mr-2.5" />
            View Available Accommodation
          </Button>
        </Link>
        <Link to="/visitor/support" className="w-full">
          <Button variant="secondary" size="lg" className="w-full flex items-center justify-center">
            <LifeBuoy className="w-4 h-4 mr-2.5" />
            Nearby Emergency & Welfare Support
          </Button>
        </Link>
      </div>
      
      <div className="text-center mt-8 pb-4">
        <p className="text-[10.5px] text-text-muted tracking-wide">
          Prototype data · Simulated + calibrated to real geography
        </p>
      </div>
    </div>
  )
}
