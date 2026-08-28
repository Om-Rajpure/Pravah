import { apiFetch } from './client';
import { Destination } from '../types';

export async function fetchDestinations(): Promise<{ data: Destination[]; error: string | null }> {
  const res = await apiFetch<any>('/api/visitor/destinations');
  if (res.data && Array.isArray(res.data)) {
    return { data: res.data, error: null };
  }
  return {
    data: [
      {
        destination_id: 'lalbaugcha-raja',
        name: 'Lalbaugcha Raja',
        area: 'Lalbaug / Parel',
        category: 'Famous Pandal',
        crowd_level: 'CRITICAL',
        crowd_label: 'Critical Peak',
        crowd_index: 96,
        travel_time_min: 15,
        travel_status: 'RESTRICTED',
        lat: 18.9912,
        lng: 72.8365,
        description: 'Mumbai’s most visited pandal. Estimated darshan waiting time is ~120 mins.'
      },
      {
        destination_id: 'girgaon-chowpatty',
        name: 'Girgaon Chowpatty',
        area: 'Marine Drive / Charni Road',
        category: 'Immersion Beach',
        crowd_level: 'MODERATE',
        crowd_label: 'Smooth Flow',
        crowd_index: 48,
        travel_time_min: 25,
        travel_status: 'OPEN',
        lat: 18.9542,
        lng: 72.8122,
        description: 'Prime immersion location along Queen’s Necklace with broad pedestrian promenade.'
      },
      {
        destination_id: 'siddhivinayak',
        name: 'Siddhivinayak Temple',
        area: 'Prabhadevi',
        category: 'Historic Temple',
        crowd_level: 'HIGH',
        crowd_label: 'Busy',
        crowd_index: 74,
        travel_time_min: 18,
        travel_status: 'OPEN',
        lat: 19.0168,
        lng: 72.8304,
        description: 'Temple sanctum with organized barcode queuing.'
      },
      {
        destination_id: 'andhericha-raja',
        name: 'Andhericha Raja',
        area: 'Azad Nagar / Andheri West',
        category: 'Suburban Pandal',
        crowd_level: 'MODERATE',
        crowd_label: 'Accessible',
        crowd_index: 52,
        travel_time_min: 35,
        travel_status: 'OPEN',
        lat: 19.1245,
        lng: 72.8368,
        description: 'Connected directly via Mumbai Metro Line 1 (Azad Nagar Station).'
      }
    ],
    error: res.error,
  };
}

export async function fetchDestinationDetail(id: string) {
  return apiFetch(`/api/visitor/destination/${id}`);
}
