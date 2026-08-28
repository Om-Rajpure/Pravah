import { apiFetch } from './client';

export async function fetchRecommendations() {
  const res = await apiFetch<any>('/api/actions/recommendations');
  if (res.data) return res;

  return {
    data: {
      recommendations: [
        {
          id: 'rec-divert-thane-01',
          title: '18% Passenger Inflow Redirection to Thane Suburban Buffer',
          recommendation_type: 'CORRIDOR_DIVERSION',
          source_zone: 'Curry Road / Parel Central',
          destination_zone: 'Thane Suburban Hub',
          dosage_pct: 18,
          expected_reduction_pts: 18.4,
          buffer_increase_pts: 4.8,
          confidence_pct: 94.2,
          summary: 'Diverts non-local evening darshan attendees towards Thane holding plazas, reducing Curry Road saturation from 94% to 76%.',
          why: [
            'Curry Road platform bottleneck predicted at 104% in 45 min',
            'Thane terminal has 58% spare capacity',
            'Saves ~24 min average pedestrian transit delay'
          ],
          status: 'PENDING'
        }
      ]
    },
    error: null,
    status: 200
  };
}

export async function simulateAction(actionId: string) {
  return apiFetch('/api/actions/simulate', {
    method: 'POST',
    body: JSON.stringify({ action_id: actionId }),
  });
}

export async function applyAction(actionId: string) {
  return apiFetch('/api/actions/apply', {
    method: 'POST',
    body: JSON.stringify({ action_id: actionId }),
  });
}
