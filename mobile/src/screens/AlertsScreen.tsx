import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { PRHeader } from '../components/ui/PRHeader';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { AlertCard } from '../components/ui/AlertCard';
import { EmptyState } from '../components/ui/EmptyState';
import { fetchAlerts } from '../api/alerts';
import { Alert } from '../types';

export const AlertsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadAlerts = async () => {
    const res = await fetchAlerts();
    if (res.data) {
      setAlerts(res.data);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAlerts();
  };

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CRITICAL') return a.severity === 'CRITICAL';
    if (activeFilter === 'WARNING') return a.severity === 'WARNING' || a.severity === 'HIGH';
    return true;
  });

  return (
    <View style={styles.container}>
      <PRHeader
        title="Active Incident Alerts"
        subtitle="Real-time corridor pressure warnings"
      />

      <ScreenContainer refreshing={refreshing} onRefresh={onRefresh}>
        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['ALL', 'CRITICAL', 'WARNING'] as const).map(filter => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, isActive && styles.activeFilterPill]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                  {filter === 'ALL' && 'All Alerts'}
                  {filter === 'CRITICAL' && '🔴 Critical'}
                  {filter === 'WARNING' && '🟡 Warnings'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Alert Cards List */}
        <View style={styles.list}>
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onPress={() => navigation.navigate('AlertDetail', { alert })}
                onActionPress={() => navigation.navigate('Map', { zoneId: alert.zone_id })}
              />
            ))
          ) : (
            <EmptyState
              icon="✅"
              title="No Active Alerts"
              message="All monitored corridors are operating within safe crowd thresholds."
            />
          )}
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
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: spacing.radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterPill: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: colors.textWhite,
  },
  list: {
    gap: spacing.sm,
  },
});
