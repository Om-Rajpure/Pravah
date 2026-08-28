import { apiFetch } from './client';
import { CityOverview, ZoneSummary } from '../types';

export async function fetchCityOverview() {
  return apiFetch<CityOverview>('/api/overview');
}

export async function fetchZones() {
  return apiFetch<{ zones: ZoneSummary[]; count: number }>('/api/zones');
}

export async function fetchZoneDetail(zoneId: string) {
  return apiFetch<any>(`/api/zones/${zoneId}`);
}

export async function fetchMapData() {
  return apiFetch<any>('/api/map');
}

export async function fetchSimulationStatus() {
  return apiFetch<any>('/api/demo/status');
}
