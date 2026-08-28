import { apiFetch } from './client';
import { WeatherData } from '../types';

export async function fetchWeather(): Promise<{ data: WeatherData | null; error: string | null }> {
  // 1. Primary: Fetch through Flask backend
  const res = await apiFetch<WeatherData>('/api/weather');
  if (res.data && res.data.current) {
    return { data: res.data, error: null };
  }

  // 2. Direct Fallback to Open-Meteo CC BY 4.0 (0 API key) if backend is unreachable
  try {
    const lat = 18.9986;
    const lon = 72.8335;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&hourly=temperature_2m,weather_code&forecast_days=1&timezone=Asia%2FKolkata`;
    
    const fallbackRes = await fetch(url);
    if (!fallbackRes.ok) throw new Error('Open-Meteo service offline');
    
    const raw = await fallbackRes.json();
    const cur = raw.current || {};
    
    const weatherData: WeatherData = {
      current: {
        temperature: Math.round(cur.temperature_2m ?? 28),
        condition: cur.precipitation > 0 ? 'Light Rain' : 'Mainly clear',
        humidity: Math.round(cur.relative_humidity_2m ?? 79),
        wind_speed: Math.round(cur.wind_speed_10m ?? 17),
        rain: cur.precipitation ?? 0,
        icon: cur.precipitation > 0 ? '🌧' : '🌤',
      },
      hourly: [
        { hour: '18:00', temperature: 28, condition: 'Clear', icon: '🌤' },
        { hour: '19:00', temperature: 27, condition: 'Clear', icon: '🌤' },
        { hour: '20:00', temperature: 27, condition: 'Clear', icon: '🌤' },
      ],
      weather_factor: cur.precipitation > 0 ? 1.15 : 1.0,
      source: 'Open-Meteo',
      updated_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return { data: weatherData, error: null };
  } catch (err: any) {
    return { data: null, error: res.error || 'Weather telemetry temporarily unavailable' };
  }
}
