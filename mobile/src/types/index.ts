/**
 * PRAVAAH Mobile Application Data Models & Type Definitions
 */

export type UserRole = 'OPERATOR' | 'STAFF' | 'VISITOR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  title?: string;
  department?: string;
  permissions?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
}

export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'MODERATE' | 'NORMAL' | 'SAFE';

export interface CityOverview {
  city_pressure_index: number;
  pressure_label: string;
  pressure_trend_pct: number;
  active_alerts_count: number;
  critical_alerts_count: number;
  hotel_availability_rate: number;
  hotels_available_count: number;
  transport_load_pct: number;
  simulation_time: string;
  updated_at: string;
  hotspots?: ZoneSummary[];
  attention_items?: AttentionItem[];
}

export interface ZoneSummary {
  id: string;
  name: string;
  pressure: number;
  level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  people?: number;
  capacity?: number;
  trend?: string;
  lat?: number;
  lng?: number;
}

export interface AttentionItem {
  id: string;
  zone_id: string;
  zone_name: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  message: string;
  time_horizon_min: number;
  recommended_action?: string;
}

export interface WeatherData {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    wind_speed: number;
    rain: number;
    icon: string;
  };
  hourly: Array<{
    hour: string;
    temperature: number;
    condition: string;
    icon: string;
  }>;
  weather_factor: number;
  source: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING' | 'INFO';
  location: string;
  zone_id?: string;
  message: string;
  current_pressure?: number;
  predicted_pressure?: number;
  time_horizon?: string;
  action_text?: string;
  action_type?: string;
  timestamp: string;
  is_resolved?: boolean;
}

export interface JourneyPlanRequest {
  from: string;
  to: string;
  prefer_alternative?: boolean;
}

export interface JourneyStep {
  instruction: string;
  distance_km: number;
  travel_time_min: number;
  transit_type: 'rail' | 'walk' | 'road' | 'bus';
}

export interface JourneyRoute {
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'DISRUPTED';
  origin: { id: string; name: string };
  destination: { id: string; name: string };
  total_travel_time_min: number;
  total_distance_km: number;
  travel_status: 'OPEN' | 'CONGESTED' | 'DISRUPTED';
  steps: JourneyStep[];
  disruption_notice?: string;
  alternative_route?: {
    total_travel_time_min: number;
    total_distance_km: number;
    savings_min: number;
    crowd_label: string;
  };
}

export interface Destination {
  destination_id: string;
  name: string;
  area: string;
  category?: string;
  crowd_level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  crowd_label: string;
  crowd_index: number;
  travel_time_min: number;
  travel_status: 'OPEN' | 'RESTRICTED';
  lat?: number;
  lng?: number;
  description?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  recommendation_type: string;
  source_zone: string;
  destination_zone: string;
  dosage_pct: number;
  expected_reduction_pts: number;
  buffer_increase_pts: number;
  confidence_pct: number;
  summary: string;
  why: string[];
  status: 'PENDING' | 'APPLIED';
}

export interface Scenario {
  id: string;
  name: string;
  category: string;
  description: string;
  severity: string;
  impact_delta: number;
  affected_zones: string[];
  recommended_action: string;
}

export interface HospitalityZone {
  region: string;
  status: string;
  occupancy_rate: number;
  available_rooms: number;
  total_rooms: number;
  advice: string;
  is_buffer: boolean;
}
