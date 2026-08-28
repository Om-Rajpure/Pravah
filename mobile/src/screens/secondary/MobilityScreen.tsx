import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { PRHeader } from '../../components/ui/PRHeader';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { MetricCard } from '../../components/ui/MetricCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { fetchMobilityData } from '../../api/mobility';

export const MobilityScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchMobilityData().then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  const stations = data?.stations || [];
  const closures = data?.road_closures || [];

  return (
    <View style={styles.container}>
      <PRHeader
        title="Mobility & Transit Loads"
        subtitle="Suburban train platforms & road closures"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScreenContainer>
        {/* Transit Load KPI */}
        <View style={styles.kpiRow}>
          <MetricCard
            title="Transport Load"
            value={`${data?.transport_load_pct || 66}%`}
            subtitle="Central & Western Lines"
            status="HIGH"
            style={{ flex: 1 }}
          />
          <MetricCard
            title="Bottleneck Stations"
            value="2"
            subtitle="Curry Road & Parel"
            status="CRITICAL"
            style={{ flex: 1 }}
          />
        </View>

        {/* Station Saturation List */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>🚆 SUBURBAN RAILWAY NODES</Text>
          <View style={styles.list}>
            {stations.map((stn: any, idx: number) => {
              const isCrit = stn.load_pct >= 85;
              return (
                <View key={idx} style={[styles.card, shadows.subtle]}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.stationName}>{stn.name}</Text>
                      <Text style={styles.lineName}>{stn.line}</Text>
                    </View>
                    <StatusBadge status={stn.status} size="sm" />
                  </View>

                  <View style={styles.progressRow}>
                    <View style={styles.barBg}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${stn.load_pct}%`,
                            backgroundColor: isCrit ? colors.critical : colors.navy,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.pctText, { color: isCrit ? colors.critical : colors.textPrimary }]}>
                      {stn.load_pct}%
                    </Text>
                  </View>

                  <Text style={styles.paxText}>
                    Throughput: ~{stn.passengers_per_hr?.toLocaleString()} passengers/hr
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Road Closures */}
        {closures.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>🚧 ACTIVE ROAD RESTRICTIONS</Text>
            <View style={styles.list}>
              {closures.map((c: any, idx: number) => (
                <View key={idx} style={[styles.closureCard, shadows.subtle]}>
                  <Text style={styles.roadName}>{c.road}</Text>
                  <Text style={styles.stretchText}>{c.stretch}</Text>
                  <View style={{ marginTop: 4 }}>
                    <StatusBadge status="WARNING" label={c.status} size="sm" />
                  </View>
                </View>
              ))}
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
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
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
  list: {
    gap: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stationName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  lineName: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: 4,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  pctText: {
    fontSize: 14,
    fontWeight: '800',
    width: 40,
    textAlign: 'right',
  },
  paxText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  closureCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  roadName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stretchText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
