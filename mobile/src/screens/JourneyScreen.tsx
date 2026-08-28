import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { colors, typography, spacing, shadows } from '../theme';
import { PRHeader } from '../components/ui/PRHeader';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { PrimaryButton, SecondaryButton } from '../components/ui/PrimaryButton';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  fetchJourneyRoute,
  ORIGIN_STATIONS,
  DESTINATION_HUBS,
} from '../api/journey';
import { JourneyRoute } from '../types';

export const JourneyScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const initialDest = route?.params?.destinationId || 'lalbaugcha-raja';
  const initialOrigin = route?.params?.originId || 'stn-dadar';

  const [originId, setOriginId] = useState<string>(initialOrigin);
  const [destinationId, setDestinationId] = useState<string>(initialDest);
  const [preferAlternative, setPreferAlternative] = useState<boolean>(false);
  const [routeResult, setRouteResult] = useState<JourneyRoute | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateRoute = async (dest = destinationId, orig = originId, alt = preferAlternative) => {
    setLoading(true);
    const res = await fetchJourneyRoute(orig, dest, alt);
    if (res.data) {
      setRouteResult(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    calculateRoute();
  }, [originId, destinationId, preferAlternative]);

  return (
    <View style={styles.container}>
      <PRHeader
        title="Transit Route Planner"
        subtitle="Network-aware shortest path & crowd bypass"
      />

      <ScreenContainer>
        {/* Origin & Destination Card */}
        <View style={[styles.plannerCard, shadows.card]}>
          <Text style={styles.cardTitle}>Plan Your Movement</Text>

          {/* Starting From (Origin) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Starting From (Origin)</Text>
            <View style={styles.pickerRow}>
              {ORIGIN_STATIONS.slice(0, 3).map(station => {
                const isSelected = originId === station.id;
                return (
                  <TouchableOpacity
                    key={station.id}
                    style={[styles.stationChip, isSelected && styles.activeStationChip]}
                    onPress={() => setOriginId(station.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.stationChipText, isSelected && styles.activeStationChipText]}>
                      {station.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Destination */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Destination Pandal / Immersion</Text>
            <View style={styles.pickerRow}>
              {DESTINATION_HUBS.slice(0, 3).map(hub => {
                const isSelected = destinationId === hub.id;
                return (
                  <TouchableOpacity
                    key={hub.id}
                    style={[styles.stationChip, isSelected && styles.activeStationChip]}
                    onPress={() => setDestinationId(hub.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.stationChipText, isSelected && styles.activeStationChipText]}>
                      {hub.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Congestion Bypass Switch */}
          <View style={styles.switchRow}>
            <View style={styles.switchTextWrap}>
              <Text style={styles.switchTitle}>Bypass Congested Corridors</Text>
              <Text style={styles.switchSubtitle}>
                Diverts away from Curry Road bottleneck
              </Text>
            </View>
            <Switch
              value={preferAlternative}
              onValueChange={setPreferAlternative}
              trackColor={{ false: colors.border, true: colors.teal }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        {/* Route Calculation Results */}
        {routeResult && (
          <View style={styles.resultsSection}>
            {/* Travel Summary Strip */}
            <View style={[styles.summaryCard, shadows.subtle]}>
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Estimated Travel</Text>
                <Text style={styles.summaryTime}>
                  {routeResult.total_travel_time_min} <Text style={styles.summaryUnit}>min</Text>
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Distance</Text>
                <Text style={styles.summaryDistance}>
                  {routeResult.total_distance_km} <Text style={styles.summaryUnit}>km</Text>
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryBox}>
                <Text style={styles.summaryLabel}>Flow Status</Text>
                <View style={{ marginTop: 4 }}>
                  <StatusBadge status={routeResult.travel_status} size="sm" />
                </View>
              </View>
            </View>

            {/* Disruption Warning Notice */}
            {routeResult.disruption_notice && (
              <View style={styles.disruptionBox}>
                <Text style={styles.disruptionTitle}>⚠️ Transit Notice</Text>
                <Text style={styles.disruptionText}>{routeResult.disruption_notice}</Text>
              </View>
            )}

            {/* Step-by-Step Directions */}
            <View style={[styles.stepsCard, shadows.subtle]}>
              <Text style={styles.stepsTitle}>Step-by-Step Transit Guidance</Text>

              <View style={styles.stepsList}>
                {routeResult.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepItem}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>{idx + 1}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepInstruction}>{step.instruction}</Text>
                      <Text style={styles.stepMeta}>
                        ~{step.travel_time_min} min &middot; {step.distance_km} km ({step.transit_type.toUpperCase()})
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  plannerCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  stationChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: spacing.radius.xs,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStationChip: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  stationChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeStationChipText: {
    color: colors.textWhite,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 4,
  },
  switchTextWrap: {
    flex: 1,
    marginRight: spacing.sm,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  switchSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  resultsSection: {
    gap: spacing.sm,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryBox: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  summaryTime: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.navy,
    marginTop: 2,
  },
  summaryDistance: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  summaryUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.borderLight,
  },
  disruptionBox: {
    backgroundColor: colors.criticalBg,
    borderColor: colors.criticalBorder,
    borderWidth: 1,
    borderRadius: spacing.radius.sm,
    padding: spacing.sm,
    gap: 4,
  },
  disruptionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.critical,
  },
  disruptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stepsList: {
    gap: spacing.md,
    marginTop: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.navySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.navy,
  },
  stepContent: {
    flex: 1,
    gap: 2,
  },
  stepInstruction: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  stepMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
