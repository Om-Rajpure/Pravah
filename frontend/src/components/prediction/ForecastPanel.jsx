import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import { TrendingUp, AlertTriangle, ShieldCheck, HelpCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'

export function ForecastPanel({ zoneForecast, selectedHorizon = 120 }) {
  if (!zoneForecast) {
    return (
      <div className="bg-surface border border-border rounded-card p-6 text-center text-text-muted shadow-subtle">
        Select a zone from the operations map to inspect forecast telemetry and explainability drivers.
      </div>
    )
  }

  const {
    name,
    current_pressure = 72,
    current_level = 'HIGH',
    predictions = [],
    drivers = [],
    time_to_peak = '~2h 45m',
    trend = 'RISING'
  } = zoneForecast

  // Find active horizon prediction object
  const activePred = predictions.find(p => p.horizon_minutes === selectedHorizon) || predictions[2] || {
    predicted_pressure: current_pressure,
    predicted_level: current_level,
    confidence: 0.87,
    confidence_label: 'HIGH CONFIDENCE',
    delta: 0
  }

  const isRising = activePred.predicted_pressure > current_pressure

  // Construct chart series data
  const chartData = [
    { label: 'Observed (18:00)', pressure: current_pressure, type: 'actual' },
    { label: '+30m', pressure: predictions[0]?.predicted_pressure || current_pressure + 4, type: 'forecast' },
    { label: '+60m', pressure: predictions[1]?.predicted_pressure || current_pressure + 10, type: 'forecast' },
    { label: '+120m', pressure: predictions[2]?.predicted_pressure || current_pressure + 22, type: 'forecast' },
    { label: '+180m', pressure: predictions[3]?.predicted_pressure || current_pressure + 18, type: 'forecast' },
  ]

  return (
    <div className="bg-surface border border-border rounded-card p-4 sm:p-5 shadow-subtle space-y-4">
      {/* Header */}
      <div className="flex justify-between items-start pb-3 border-b border-border">
        <div>
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">Zone Forecast Intelligence</span>
          <h3 className="text-base sm:text-lg font-bold text-text-primary leading-tight">{name}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={activePred.predicted_level} />
        </div>
      </div>

      {/* Metric Cards: Current vs Predicted */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-muted/60 p-3 rounded-card-sm border border-border/70">
          <span className="text-[10px] uppercase font-semibold text-text-muted block mb-0.5">Observed Pressure</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-text-primary">{current_pressure}</span>
            <span className="text-xs text-text-muted">/ 100</span>
          </div>
          <span className="text-[10.5px] text-text-secondary font-medium mt-1 block">Live telemetry state</span>
        </div>

        <div className={`p-3 rounded-card-sm border ${
          isRising ? 'bg-terracotta-soft/60 border-terracotta/40' : 'bg-surface-muted/60 border-border/70'
        }`}>
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[10px] uppercase font-bold text-terracotta-dark">
              Forecast (+{selectedHorizon === 0 ? '120' : selectedHorizon}m)
            </span>
            <span className="text-[10px] font-bold text-terracotta-dark flex items-center">
              {isRising ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {activePred.delta > 0 ? `+${activePred.delta}` : activePred.delta}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-text-primary">{activePred.predicted_pressure}</span>
            <span className="text-xs text-text-muted">/ 100</span>
          </div>
          <span className="text-[10.5px] text-text-secondary font-medium mt-1 block">Peak: {time_to_peak}</span>
        </div>
      </div>

      {/* Confidence Badge */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface-muted/40 rounded-card-sm border border-border text-[11.5px]">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <ShieldCheck className="w-4 h-4 text-low" />
          <span>Model Confidence:</span>
        </div>
        <div className="flex items-center gap-1.5 font-semibold text-text-primary">
          <span>{Math.round(activePred.confidence * 100)}%</span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-low/15 text-low">
            {activePred.confidence_label}
          </span>
        </div>
      </div>

      {/* Explainability Drivers */}
      <div className="space-y-2">
        <span className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider block">
          Primary Contributing Factors
        </span>
        <div className="space-y-1.5">
          {drivers.map((driver, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[12px] text-text-primary bg-surface-muted/30 p-2 rounded border border-border/50">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 flex-shrink-0"></span>
              <span className="leading-snug">{driver}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time-series Trajectory Chart */}
      <div className="space-y-1.5 pt-2">
        <span className="text-[10.5px] uppercase font-bold text-text-muted tracking-wider block">
          Multi-Horizon Trajectory (18:00 – 21:00)
        </span>
        <div className="h-36 sm:h-40 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#536873' }} tickLine={false} />
              <YAxis domain={[20, 100]} tick={{ fontSize: 10, fill: '#536873' }} tickLine={false} />
              <ReferenceLine y={76} stroke="#A94338" strokeDasharray="3 3" strokeOpacity={0.6} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FBFAF7', borderColor: '#E8C9BC', fontSize: '11px', borderRadius: '6px' }}
                formatter={(val) => [`${val} / 100`, 'Crowd Pressure']}
              />
              <Line 
                type="monotone" 
                dataKey="pressure" 
                stroke="#B85C3E" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#B85C3E' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
