import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useNetwork } from '../context/NetworkContext';
import { PRHeader } from '../components/ui/PRHeader';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { MetricCard } from '../components/ui/MetricCard';
import { WeatherCard } from '../components/ui/WeatherCard';
import { HotspotCard } from '../components/ui/HotspotCard';
import { AlertCard } from '../components/ui/AlertCard';
import { PrimaryButton, SecondaryButton } from '../components/ui/PrimaryButton';
import { fetchCityOverview, fetchZones } from '../api/city';
import { fetchWeather } from '../api/weather';
import { fetchAlerts } from '../api/alerts';
import { CityOverview, WeatherData, Alert, ZoneSummary } from '../types';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const { setLastUpdated } = useNetwork();

  const [overview, setOverview] = useState<CityOverview | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [zones, setZones] = useState<ZoneSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadDashboardData = useCallback(async () => {
    try {
      const [overviewRes, weatherRes, alertsRes, zonesRes] = await Promise.all([
        fetchCityOverview(),
        fetchWeather(),
        fetchAlerts(),
        fetchZones(),
      ]);

      if (overviewRes.data) setOverview(overviewRes.data);
      if (weatherRes.data) setWeather(weatherRes.data);
      if (alertsRes.data) setAlerts(alertsRes.data);
      if (zonesRes.data?.zones) setZones(zonesRes.data.zones);

      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Dashboard load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [setLastUpdated]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const topCriticalAlert = alerts.find(a => a.severity === 'CRITICAL') || alerts[0];
  const pressureValue = overview?.city_pressure_index ?? 70;
  const pressureLabel = overview?.pressure_label || 'High Pressure';
  const trendPct = overview?.pressure_trend_pct ?? 8;

  return (
    <View style={styles.container}>
      <PRHeader
        title="Ganesh Chaturthi 2026"
        subtitle="Mumbai Central Corridor &middot; Day 9"
      />

      <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
        {/* Welcome Greeting */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome, {user?.name || 'Citizen'}
            </Text>
            <Text style={styles.roleTag}>
              {user?.role === 'OPERATOR' ? '🛡️ Incident Commander' : user?.role === 'STAFF' ? '🚆 Field Staff' : '👥 Visitor / Attendee'}
            </Text>
          </View>

          <View style={styles.timePill}>
            <Text style={styles.timeText}>🕒 18:10 Live</Text>
          </View>
        </View>

        {/* 1. Critical Attention Banner */}
        {topCriticalAlert && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>⚠️ WHAT NEEDS ATTENTION</Text>
            <AlertCard
              alert={topCriticalAlert}
              onPress={() => navigation.navigate('AlertDetail', { alert: topCriticalAlert })}
              onActionPress={() => navigation.navigate('Map', { zoneId: topCriticalAlert.zone_id })}
            />
          </View>
        )}

        {/* 2. City Status Overview KPI Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>📊 CITY TELEMETRY STATUS</Text>
          <View style={styles.kpiRow}>
            <MetricCard
              title="City Pressure"
              value={`${pressureValue}/100`}
              status={pressureValue >= 85 ? 'CRITICAL' : pressureValue >= 60 ? 'HIGH' : 'NORMAL'}
              trend={`+${trendPct}% vs 1h ago`}
              trendPositive={false}
              style={{ flex: 1 }}
            />
            <MetricCard
              title="Hotels Available"
              value={overview?.hotels_available_count ? `${overview.hotels_available_count.toLocaleString()}` : '11,750'}
              subtitle="Thane & Suburbs"
              status="LOW"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* 3. Nearby Monitored Hotspots */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionHeader}>📍 NEARBY CROWD SATURATION</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
              <Text style={styles.viewAllText}>View Map →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hotspotGrid}>
            {(zones.length > 0 ? zones.slice(0, 3) : [
              { id: 'curry-road', name: 'Curry Road Station', pressure: 94, level: 'CRITICAL' as const, people: 20900 },
              { id: 'lalbaug', name: 'Lalbaugcha Raja Core', pressure: 96, level: 'CRITICAL' as const, people: 42000 },
              { id: 'dadar', name: 'Dadar Interchange', pressure: 78, level: 'HIGH' as const, people: 38500 },
            ]).map(zone => (
              <HotspotCard
                key={zone.id}
                zone={zone}
                onPress={() => navigation.navigate('Map', { zoneId: zone.id })}
              />
            ))}
          </View>
        </View>

        {/* 4. Live Open-Meteo Weather Card */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>🌤️ LOCAL WEATHER TELEMETRY</Text>
          <WeatherCard weather={weather} loading={loading} />
        </View>

        {/* 5. Quick Actions Bar */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>⚡ QUICK ACTIONS</Text>
          <View style={styles.quickActionRow}>
            <PrimaryButton
              title="🗺️ Explore Live Map"
              onPress={() => navigation.navigate('Map')}
              variant="navy"
              style={{ flex: 1 }}
            />
            <PrimaryButton
              title="🚆 Plan Journey"
              onPress={() => navigation.navigate('Journey')}
              variant="orange"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roleTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  timePill: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: spacing.radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
  },
  section: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.orangeDark,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  hotspotGrid: {
    gap: spacing.xs,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
