import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { WeatherData } from '../../types';

interface WeatherCardProps {
  weather: WeatherData | null;
  loading?: boolean;
  style?: ViewStyle;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  loading = false,
  style,
}) => {
  if (loading || !weather) {
    return (
      <View style={[styles.card, shadows.subtle, style]}>
        <Text style={styles.loadingText}>Loading live weather telemetry...</Text>
      </View>
    );
  }

  const { current, hourly, source } = weather;

  return (
    <View style={[styles.card, shadows.subtle, style]}>
      {/* Top Header & Temperature */}
      <View style={styles.topRow}>
        <View style={styles.tempSection}>
          <Text style={styles.icon}>{current.icon || '🌤'}</Text>
          <View>
            <Text style={styles.temperature}>
              {current.temperature}°C
            </Text>
            <Text style={styles.condition}>
              {current.condition}
            </Text>
          </View>
        </View>

        {/* Source Badge */}
        <View style={styles.sourceBadge}>
          <View style={styles.sourceDot} />
          <Text style={styles.sourceText}>LIVE &middot; {source || 'OPEN-METEO'}</Text>
        </View>
      </View>

      {/* Sub-Metrics: Humidity, Wind, Rain */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Humidity</Text>
          <Text style={styles.metricValue}>{current.humidity}%</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Wind</Text>
          <Text style={styles.metricValue}>{current.wind_speed} km/h</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Rain</Text>
          <Text style={styles.metricValue}>{current.rain} mm</Text>
        </View>
      </View>

      {/* 3-Hour Forecast Pills */}
      {hourly && hourly.length > 0 && (
        <View style={styles.forecastRow}>
          {hourly.slice(0, 3).map((item, idx) => (
            <View key={idx} style={styles.forecastPill}>
              <Text style={styles.forecastHour}>{item.hour}</Text>
              <Text style={styles.forecastIcon}>{item.icon || '🌤'}</Text>
              <Text style={styles.forecastTemp}>{item.temperature}°</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  icon: {
    fontSize: 34,
  },
  temperature: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  condition: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealSoft,
    borderWidth: 1,
    borderColor: colors.teal,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.radius.full,
    gap: 4,
  },
  sourceDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.teal,
  },
  sourceText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.tealDark,
    letterSpacing: 0.4,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.borderLight,
  },
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  forecastPill: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: spacing.radius.xs,
    paddingVertical: 6,
    alignItems: 'center',
    gap: 2,
  },
  forecastHour: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  forecastIcon: {
    fontSize: 14,
  },
  forecastTemp: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
