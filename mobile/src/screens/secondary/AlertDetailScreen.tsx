import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { PRHeader } from '../../components/ui/PRHeader';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PrimaryButton, SecondaryButton } from '../../components/ui/PrimaryButton';
import { Alert } from '../../types';

export const AlertDetailScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const alert: Alert = route?.params?.alert || {
    id: 'alert-curry-road',
    title: 'Curry Road Station Platform Saturation',
    severity: 'CRITICAL',
    location: 'Curry Road / Parel Corridor',
    zone_id: 'curry-road',
    message: 'Platform 1 & 2 reaching 94% saturation. High risk of pedestrian bottleneck at south skywalk.',
    current_pressure: 94,
    predicted_pressure: 104,
    time_horizon: 'Next 30 mins',
    action_text: 'Hold northbound fast locals at Dadar; divert passengers to Lower Parel',
    action_type: 'REDIRECT',
    timestamp: '18:10',
  };

  return (
    <View style={styles.container}>
      <PRHeader
        title="Incident Detail"
        subtitle={alert.location}
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScreenContainer>
        {/* Severity Banner Card */}
        <View style={[styles.mainCard, shadows.card]}>
          <View style={styles.badgeRow}>
            <StatusBadge status={alert.severity} size="lg" />
            <Text style={styles.timestamp}>Reported at {alert.timestamp}</Text>
          </View>

          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.location}>📍 Location: {alert.location}</Text>
          <Text style={styles.message}>{alert.message}</Text>
        </View>

        {/* Telemetry Metrics Comparison */}
        <View style={[styles.metricsCard, shadows.subtle]}>
          <Text style={styles.sectionTitle}>Crowd Pressure Metrics</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Current Saturation</Text>
              <Text style={[styles.metricValue, { color: colors.critical }]}>
                {alert.current_pressure || 94}%
              </Text>
              <Text style={styles.metricSub}>Immediate Peak</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Forecast (+30m)</Text>
              <Text style={[styles.metricValue, { color: colors.criticalDark }]}>
                {alert.predicted_pressure || 104}%
              </Text>
              <Text style={styles.metricSub}>Critical Surge</Text>
            </View>
          </View>
        </View>

        {/* Recommended Mitigation Action */}
        <View style={[styles.actionCard, shadows.subtle]}>
          <Text style={styles.actionHeader}>🛡️ RECOMMENDED MITIGATION</Text>
          <Text style={styles.actionBody}>{alert.action_text}</Text>

          <View style={styles.buttonStack}>
            <PrimaryButton
              title="🗺️ View Corridor on Live Map"
              onPress={() => navigation.navigate('Map', { zoneId: alert.zone_id })}
              variant="orange"
            />
            <SecondaryButton
              title="🚆 Plan Transit Bypass"
              onPress={() => navigation.navigate('Journey', { destinationId: alert.zone_id })}
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
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.criticalBorder,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },
  location: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.navy,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 4,
  },
  metricsCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.xs,
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 2,
  },
  metricSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  actionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.orangeDark,
    letterSpacing: 0.5,
  },
  actionBody: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  buttonStack: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
