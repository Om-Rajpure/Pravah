import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { PRHeader } from '../../components/ui/PRHeader';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { fetchPredictions } from '../../api/predictions';

export const PredictionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchPredictions().then(res => setData(res.data));
  }, []);

  const horizons = data?.horizons || [
    { horizon: 'NOW', label: '18:10 Live', city_pressure: 70, status: 'HIGH' },
    { horizon: '+30m', label: '18:40', city_pressure: 76, status: 'HIGH' },
    { horizon: '+60m', label: '19:10', city_pressure: 82, status: 'CRITICAL' },
    { horizon: '+120m', label: '20:10', city_pressure: 91, status: 'CRITICAL' },
  ];

  const hotspots = data?.hotspots_projected || [];

  return (
    <View style={styles.container}>
      <PRHeader
        title="Multi-Horizon Predictions"
        subtitle="AI Residual Crowd Density Projections"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScreenContainer>
        {/* Horizon Timeline Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>📈 CITY PRESSURE PROJECTION (NEXT 2 HOURS)</Text>
          <View style={styles.timelineRow}>
            {horizons.map((h: any, idx: number) => {
              const isCrit = h.city_pressure >= 85;
              return (
                <View key={idx} style={[styles.timelineCard, shadows.subtle]}>
                  <Text style={styles.horizonLabel}>{h.horizon}</Text>
                  <Text style={[styles.pressureNum, { color: isCrit ? colors.critical : colors.navy }]}>
                    {h.city_pressure}
                  </Text>
                  <Text style={styles.timeTag}>{h.label}</Text>
                  <View style={{ marginTop: 4 }}>
                    <StatusBadge status={h.status} size="sm" />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Projected Hotspot Table */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>📍 PROJECTED HOTSPOT SURGES</Text>
          <View style={styles.list}>
            {hotspots.map((h: any, idx: number) => (
              <View key={idx} style={[styles.hotspotRow, shadows.subtle]}>
                <View style={styles.hotspotLeft}>
                  <Text style={styles.hotspotName}>{h.name}</Text>
                  <Text style={styles.trendText}>Surge trend: 🔺 Increasing</Text>
                </View>
                <View style={styles.hotspotValues}>
                  <View style={styles.valBox}>
                    <Text style={styles.valLabel}>Now</Text>
                    <Text style={styles.valNum}>{h.current}%</Text>
                  </View>
                  <Text style={styles.arrow}>→</Text>
                  <View style={styles.valBox}>
                    <Text style={styles.valLabel}>+60m</Text>
                    <Text style={[styles.valNum, { color: colors.critical }]}>{h.in_60m}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Warning Summary */}
        <View style={[styles.summaryCard, shadows.subtle]}>
          <Text style={styles.summaryTitle}>⚡ AI Model Advisory</Text>
          <Text style={styles.summaryBody}>
            {data?.summary_message || 'Crowd density is projected to cross critical threshold (85%) in Central Mumbai corridor by 19:10. Buffer diversion recommended.'}
          </Text>
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
  timelineRow: {
    flexDirection: 'row',
    gap: 6,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 2,
  },
  horizonLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  pressureNum: {
    fontSize: 26,
    fontWeight: '800',
    marginVertical: 2,
  },
  timeTag: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  list: {
    gap: spacing.xs,
  },
  hotspotRow: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotspotLeft: {
    flex: 1,
    marginRight: 8,
  },
  hotspotName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  trendText: {
    fontSize: 11,
    color: colors.critical,
    marginTop: 2,
    fontWeight: '600',
  },
  hotspotValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valBox: {
    alignItems: 'center',
  },
  valLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  valNum: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  arrow: {
    fontSize: 14,
    color: colors.textMuted,
  },
  summaryCard: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  summaryBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
