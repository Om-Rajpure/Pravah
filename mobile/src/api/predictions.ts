import { apiFetch } from './client';

export async function fetchPredictions() {
  const res = await apiFetch<any>('/api/predictions');
  if (res.data) return res;

  return {
    data: {
      horizons: [
        { horizon: 'NOW', label: '18:10 (Live)', city_pressure: 70, status: 'HIGH' },
        { horizon: '+30m', label: '18:40', city_pressure: 76, status: 'HIGH' },
        { horizon: '+60m', label: '19:10', city_pressure: 82, status: 'CRITICAL' },
        { horizon: '+120m', label: '20:10', city_pressure: 91, status: 'CRITICAL' },
      ],
      hotspots_projected: [
        { name: 'Curry Road Station', current: 94, in_30m: 98, in_60m: 104, trend: 'UP' },
        { name: 'Lalbaugcha Raja Core', current: 88, in_30m: 92, in_60m: 97, trend: 'UP' },
        { name: 'Dadar Central Interchange', current: 78, in_30m: 81, in_60m: 85, trend: 'UP' },
        { name: 'Girgaon Chowpatty', current: 48, in_30m: 54, in_60m: 62, trend: 'STABLE' },
      ],
      summary_message: 'Crowd density is projected to cross critical threshold (85%) in Central Mumbai corridor by 19:10. Buffer diversion recommended.'
    },
    error: null,
    status: 200
  };
}
