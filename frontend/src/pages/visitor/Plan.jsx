import { MapPin, Bed, LifeBuoy } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

export default function Plan() {
  return (
    <div className="flex flex-col space-y-5 pt-6 px-1">
      <div className="text-center mb-1">
        <h2 className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-semibold mb-1">Your Ganpati Plan</h2>
        <h1 className="text-[22px] font-semibold text-text-primary">Lalbaugcha Raja</h1>
      </div>
      
      <Card className="flex flex-col space-y-4">
        <div>
          <div className="text-[11px] text-text-muted font-medium uppercase tracking-wide mb-1">Recommended arrival</div>
          <div className="text-[22px] font-bold text-brand-orange-dark">7:40 PM</div>
        </div>
        <div className="bg-brand-orange-soft border-l-[3px] border-brand-orange rounded-card-sm p-3 text-[13px] text-text-primary leading-relaxed">
          Crowds are expected to peak between 6:30 and 7:30 PM. Arriving at 7:40 PM helps you avoid the longest queues.
        </div>
      </Card>
      
      <div className="flex flex-col space-y-2.5 mt-2">
        <Button variant="primary" size="lg" className="w-full flex items-center justify-center">
          <MapPin className="w-4 h-4 mr-2.5" />
          View Route
        </Button>
        <Button variant="secondary" size="lg" className="w-full flex items-center justify-center">
          <Bed className="w-4 h-4 mr-2.5" />
          View Stay
        </Button>
        <Button variant="secondary" size="lg" className="w-full flex items-center justify-center">
          <LifeBuoy className="w-4 h-4 mr-2.5" />
          Nearby Support
        </Button>
      </div>
      
      <div className="text-center mt-10 pb-6">
        <p className="text-[10px] text-text-muted tracking-wide">Prototype data · Simulated + calibrated to real geography</p>
      </div>
    </div>
  )
}
