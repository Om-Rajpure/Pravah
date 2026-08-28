import { apiFetch } from './client';

export async function fetchWelfareData() {
  const res = await apiFetch<any>('/api/welfare');
  if (res.data) return res;

  return {
    data: {
      summary: {
        total_amenities: 48,
        water_stations: 18,
        medical_aid_points: 12,
        police_help_desks: 10,
        sanitation_units: 8
      },
      emergency_hotlines: [
        { label: 'BMC Disaster Control Room', number: '1916', desc: '24x7 Emergency Management' },
        { label: 'Mumbai Police Helpline', number: '100 / 112', desc: 'Law & Order and Crowd Safety' },
        { label: 'Emergency Medical & Ambulance', number: '108', desc: 'Rapid Medical Response' },
        { label: 'Railway Police (GRP/RPF)', number: '1512', desc: 'Station Safety & Crowd Assistance' }
      ],
      amenities: [
        { id: 'w1', name: 'Chinchpokli Station Skywalk Water Point', type: 'Drinking Water', status: 'ACTIVE', capacity: '1,200/hr' },
        { id: 'w2', name: 'Lalbaug Raja Gate 2 Medical Camp', type: 'First Aid & Triage', status: 'ACTIVE', capacity: '300/hr' },
        { id: 'w3', name: 'Dadar East Station Police Help Desk', type: 'Police Help Desk', status: 'ACTIVE', capacity: '24x7' },
        { id: 'w4', name: 'Parel TT Mobile Sanitation Facility', type: 'Sanitation Unit', status: 'ACTIVE', capacity: '500/hr' }
      ]
    },
    error: null,
    status: 200
  };
}
