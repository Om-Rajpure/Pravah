import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { PRHeader } from '../../components/ui/PRHeader';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { fetchHospitalityData } from '../../api/hospitality';

export const HospitalityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHospitalityData().then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  const summary = data?.summary || {
    total_rooms: 15400,
    available_rooms: 8900,
    occupancy_rate: 42.2,
    avg_price_inr: 3850,
  };

  const zones = data?.zones || [];

  return (
    <View style={styles.container}>
      <PRHeader
        title="Visitor Accommodation Guide"
        subtitle="Suburban buffer capacity & live tariffs"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScreenContainer>
        {/* Summary Metrics */}
        <View style={styles.kpiRow}>
          <MetricCard
            title="Available Rooms"
            value={summary.available_rooms.toLocaleString()}
            subtitle="Across MMR Region"
            status="LOW"
            style={{ flex: 1 }}
          />
          <MetricCard
            title="Avg Tariff"
            value={`₹${summary.avg_price_inr}`}
            subtitle="Festival Standard"
            style={{ flex: 1 }}
          />
        </View>

        {/* Travel Advice Banner */}
        <View style={[styles.adviceCard, shadows.subtle]}>
          <Text style={styles.adviceHeader}>💡 PRAVAAH Travel Advice</Text>
          <Text style={styles.adviceText}>
            Central Mumbai hotels are at 89% occupancy with elevated tariffs. Book in the <strong>Thane / Navi Mumbai Suburban Buffer</strong> for 50% lower tariffs and 25-minute direct fast train access to Dadar.
          </Text>
        </View>

        {/* Regional Capacity Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>REGIONAL ACCOMMODATION HUBS</Text>

          <View style={styles.zoneList}>
            {zones.map((zone: any, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.zoneCard,
                  zone.is_buffer ? styles.bufferCard : styles.coreCard,
                  shadows.subtle,
                ]}
              >
                <View style={styles.zoneHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bufferTag}>
                      {zone.is_buffer ? '⭐ Recommended Buffer Hub' : '🔴 High-Density Core'}
                    </Text>
                    <Text style={styles.zoneTitle}>{zone.region}</Text>
                  </View>
                  <StatusBadge status={zone.is_buffer ? 'LOW' : 'CRITICAL'} size="sm" />
                </View>

                <View style={styles.statsRow}>
                  <View>
                    <Text style={styles.statLabel}>Occupancy</Text>
                    <Text style={styles.statVal}>{zone.occupancy_rate}%</Text>
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Available</Text>
                    <Text style={[styles.statVal, { color: zone.is_buffer ? colors.teal : colors.critical }]}>
                      {zone.available_rooms.toLocaleString()} rooms
                    </Text>
                  </View>
                </View>

                <Text style={styles.adviceSnippet}>{zone.advice}</Text>

                <TouchableOpacity
                  style={styles.transitLink}
                  onPress={() => navigation.navigate('Journey', { originId: zone.is_buffer ? 'stn-thane' : 'stn-csmt' })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.transitLinkText}>🚆 View Fast Local Train Connections →</Text>
                </TouchableOpacity>
              </View>
            ))}
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
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  adviceCard: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
    borderWidth: 1,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    gap: 4,
    marginBottom: spacing.md,
  },
  adviceHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.tealDark,
  },
  adviceText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  section: {
    gap: spacing.xs,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  zoneList: {
    gap: spacing.sm,
  },
  zoneCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
  bufferCard: {
    borderColor: colors.teal,
  },
  coreCard: {
    borderColor: colors.border,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  bufferTag: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.tealDark,
    textTransform: 'uppercase',
  },
  zoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: spacing.radius.xs,
    padding: spacing.sm,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 1,
  },
  adviceSnippet: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  transitLink: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  transitLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
});
