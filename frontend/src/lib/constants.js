export const PRESSURE_STATUS = {
  LOW: { label: 'LOW', color: 'low', bgClass: 'bg-low/10', textClass: 'text-low', min: 0, max: 49 },
  MODERATE: { label: 'MODERATE', color: 'warning', bgClass: 'bg-warning/10', textClass: 'text-warning', min: 50, max: 69 },
  HIGH: { label: 'HIGH', color: 'high', bgClass: 'bg-high/10', textClass: 'text-high', min: 70, max: 84 },
  CRITICAL: { label: 'CRITICAL', color: 'critical', bgClass: 'bg-critical/10', textClass: 'text-critical', min: 85, max: 100 },
}

export const getPressureStatus = (value) => {
  if (value >= 85) return PRESSURE_STATUS.CRITICAL
  if (value >= 70) return PRESSURE_STATUS.HIGH
  if (value >= 50) return PRESSURE_STATUS.MODERATE
  return PRESSURE_STATUS.LOW
}

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', path: '/control-room/overview', icon: 'LayoutDashboard' },
  { id: 'live-city', label: 'Live City', path: '/control-room/live-city', icon: 'Map' },
  { id: 'predictions', label: 'Predictions', path: '/control-room/predictions', icon: 'TrendingUp' },
  { id: 'actions', label: 'Actions', path: '/control-room/actions', icon: 'Zap' },
  { id: 'hospitality', label: 'Hospitality', path: '/control-room/hospitality', icon: 'Hotel' },
  { id: 'mobility', label: 'Mobility', path: '/control-room/mobility', icon: 'TrainFront' },
  { id: 'welfare', label: 'Welfare', path: '/control-room/welfare', icon: 'HeartHandshake' },
  { id: 'scenarios', label: 'Scenarios', path: '/control-room/scenarios', icon: 'FlaskConical' },
  { id: 'impact', label: 'Impact', path: '/control-room/impact', icon: 'BarChart3' },
  { id: 'glass-box', label: 'Glass Box', path: '/control-room/glass-box', icon: 'Shield' },
]

export const VISITOR_NAV_ITEMS = [
  { id: 'home',    label: 'Destinations', path: '/visitor',         icon: 'Compass' },
  { id: 'route',   label: 'Route',        path: '/visitor/route',   icon: 'Navigation' },
  { id: 'stay',    label: 'Stay',         path: '/visitor/stay',    icon: 'Bed' },
  { id: 'support', label: 'Support',      path: '/visitor/support', icon: 'LifeBuoy' },
  { id: 'privacy', label: 'Privacy',      path: '/visitor/privacy', icon: 'ShieldCheck' },
]

export const EVENT_INFO = {
  name: 'Ganesh Chaturthi 2026',
  day: 'Day 9',
  period: 'Evening',
  time: '18:00',
}
