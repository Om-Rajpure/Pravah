import { Alert, Destination, ZoneSummary } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainTabs: undefined;
  AlertDetail: { alert: Alert };
  Hospitality: undefined;
  Mobility: undefined;
  Welfare: undefined;
  Predictions: undefined;
  Recommendations: undefined;
  Scenarios: undefined;
  GlassBox: undefined;
  VisitorExperience: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Map: { zoneId?: string } | undefined;
  Alerts: undefined;
  Journey: { originId?: string; destinationId?: string } | undefined;
  More: undefined;
};
