import { apiFetch } from './client';
import { Alert } from '../types';

export async function fetchAlerts(): Promise<{ data: Alert[]; error: string | null }> {
  // Derive alerts from overview / demo status / zone pressure
  const res = await apiFetch<any>('/api/overview');
  
  if (res.data) {
    const rawAlerts: Alert[] = [];
    const attentionItems = res.data.attention_items || [];
    
    attentionItems.forEach((item: any, idx: number) => {
      rawAlerts.push({
        id: item.id || `alert-${idx}`,
        title: item.zone_name ? `${item.zone_name} Surge Notice` : 'High Crowd Density',
        severity: item.severity === 'CRITICAL' ? 'CRITICAL' : item.severity === 'HIGH' ? 'HIGH' : 'WARNING',
        location: item.zone_name || 'Central Mumbai Corridor',
        zone_id: item.zone_id,
        message: item.message || 'Crowd saturation is elevated. Follow recommended bypass routes.',
        time_horizon: item.time_horizon_min ? `Next ${item.time_horizon_min} mins` : 'Immediate',
        action_text: item.recommended_action || 'Redirect to suburban buffer stations',
        action_type: 'REDIRECT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_resolved: false,
      });
    });

    // If no attention items, add default operational alerts
    if (rawAlerts.length === 0 && res.data.city_pressure_index >= 60) {
      rawAlerts.push({
        id: 'alert-curry-road',
        title: 'Curry Road Station Saturation',
        severity: 'CRITICAL',
        location: 'Curry Road / Parel Interchange',
        zone_id: 'curry-road',
        message: 'Platform 1 & 2 reaching 94% saturation. High risk of pedestrian bottleneck at south skywalk.',
        current_pressure: 94,
        predicted_pressure: 102,
        time_horizon: 'Next 30 mins',
        action_text: 'Hold northbound fast locals at Dadar; divert passengers to Lower Parel',
        action_type: 'HOLD_DIVERTS',
        timestamp: '18:10',
        is_resolved: false,
      });
      rawAlerts.push({
        id: 'alert-lalbaug',
        title: 'Lalbaugcha Raja Main Queues',
        severity: 'HIGH',
        location: 'Lalbaug / Dr. Ambedkar Road',
        zone_id: 'lalbaug',
        message: 'Darshan queue waiting time extended to ~120 mins. Road traffic restricted on GD Ambekar Marg.',
        current_pressure: 88,
        predicted_pressure: 92,
        time_horizon: 'Next 60 mins',
        action_text: 'Suggest post-peak darshan window (21:30) via Visitor Planner',
        action_type: 'DISPERSE',
        timestamp: '18:05',
        is_resolved: false,
      });
    }

    return { data: rawAlerts, error: null };
  }

  return {
    data: [
      {
        id: 'alert-curry-road',
        title: 'Curry Road Station Saturation',
        severity: 'CRITICAL',
        location: 'Curry Road / Parel Interchange',
        zone_id: 'curry-road',
        message: 'Platform 1 & 2 reaching 94% saturation. High risk of pedestrian bottleneck at south skywalk.',
        current_pressure: 94,
        predicted_pressure: 102,
        time_horizon: 'Next 30 mins',
        action_text: 'Hold northbound fast locals at Dadar; divert passengers to Lower Parel',
        action_type: 'HOLD_DIVERTS',
        timestamp: '18:10',
        is_resolved: false,
      },
      {
        id: 'alert-lalbaug',
        title: 'Lalbaugcha Raja Main Queues',
        severity: 'HIGH',
        location: 'Lalbaug / Dr. Ambedkar Road',
        zone_id: 'lalbaug',
        message: 'Darshan queue waiting time extended to ~120 mins. Road traffic restricted on GD Ambekar Marg.',
        current_pressure: 88,
        predicted_pressure: 92,
        time_horizon: 'Next 60 mins',
        action_text: 'Suggest post-peak darshan window (21:30) via Visitor Planner',
        action_type: 'DISPERSE',
        timestamp: '18:05',
        is_resolved: false,
      }
    ],
    error: res.error,
  };
}
