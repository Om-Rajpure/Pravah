import { apiFetch } from './client';

export async function fetchScenarios() {
  const res = await apiFetch<any>('/api/scenarios/catalog');
  if (res.data) return res;

  return {
    data: {
      scenarios: [
        {
          id: 'SCN_RAIN_INTENSE',
          name: 'Intense Monsoon Downpour (+40mm)',
          category: 'Weather Stress',
          description: 'Flash rain causes 25% reduction in train frequency and speeds up station shelter crowding.',
          severity: 'HIGH',
          impact_delta: 14,
          affected_zones: ['Curry Road', 'Dadar', 'Hindmata Cinema'],
          recommended_response: 'Deploy emergency shelter protocols & hold crowds under Dadar skywalk.'
        },
        {
          id: 'SCN_RAIL_DISRUPT',
          name: 'Central Line Slow Track Signal Failure',
          category: 'Transit Outage',
          description: 'Curry Road to Chinchpokli signal failure halts slow locals, trapping 28,000 commuters.',
          severity: 'CRITICAL',
          impact_delta: 22,
          affected_zones: ['Curry Road', 'Parel', 'Chinchpokli', 'Byculla'],
          recommended_response: 'Activate Western line bypass via Lower Parel & BEST feeder buses.'
        },
        {
          id: 'SCN_VIP_INFLUX',
          name: 'VIP Convoy Arrival at Lalbaug',
          category: 'Event Surge',
          description: 'VIP motorcade triggers 40-minute road lockdown on GD Ambekar Marg.',
          severity: 'MODERATE',
          impact_delta: 8,
          affected_zones: ['Lalbaug', 'Bharatmata'],
          recommended_response: 'Reroute pedestrian flow via secondary eastern skywalk corridor.'
        }
      ]
    },
    error: null,
    status: 200
  };
}

export async function runScenario(scenarioId: string) {
  return apiFetch('/api/scenarios/run', {
    method: 'POST',
    body: JSON.stringify({ scenario_id: scenarioId }),
  });
}
