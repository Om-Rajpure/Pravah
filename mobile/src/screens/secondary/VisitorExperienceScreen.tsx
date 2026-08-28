import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { PRHeader } from '../../components/ui/PRHeader';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { fetchDestinations } from '../../api/visitor';
import { Destination } from '../../types';

export const VisitorExperienceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    fetchDestinations().then(res => setDestinations(res.data));
  }, []);

  return (
    <View style={styles.container}>
      <PRHeader
        title="Visitor Experience & Pandals"
        subtitle="Live Queue Estimates & Darshan Planning"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScreenContainer>
        {/* Recommended Timing Window */}
        <View style={[styles.windowCard, shadows.subtle]}>
          <Text style={styles.windowHeader}>✨ OPTIMAL DARSHAN WINDOW</Text>
          <Text style={styles.windowTime}>21:30 – 23:00 (Post-Peak)</Text>
          <Text style={styles.windowDesc}>
            Queue waiting times drop by ~45% after 21:30 compared to the evening aarti rush (18:00–20:30).
          </Text>
        </View>

        {/* Monitored Destinations */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>MAJOR MONITORED PANDALS</Text>
          <View style={styles.list}>
            {destinations.map(d => (
              <TouchableOpacity
                key={d.destination_id}
                style={[styles.destCard, shadows.subtle]}
                onPress={() => navigation.navigate('Journey', { destinationId: d.destination_id })}
                activeOpacity={0.7}
              >
                <View style={styles.destHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.destName}>{d.name}</Text>
                    <Text style={styles.destArea}>{d.area}</Text>
                  </View>
                  <StatusBadge status={d.crowd_level} label={d.crowd_label} size="sm" />
                </View>

                {d.description && (
                  <Text style={styles.destDesc}>{d.description}</Text>
                )}

                <View style={styles.destFooter}>
                  <Text style={styles.travelTime}>⏱️ ~{d.travel_time_min} mins transit</Text>
                  <Text style={styles.routeBtnText}>Plan Route →</Text>
                </View>
              </TouchableOpacity>
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
  windowCard: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
    borderWidth: 1,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    gap: 4,
    marginBottom: spacing.md,
  },
  windowHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.tealDark,
    letterSpacing: 0.5,
  },
  windowTime: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  windowDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
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
  list: {
    gap: spacing.xs,
  },
  destCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  destHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  destName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  destArea: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  destDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  destFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginTop: 2,
  },
  travelTime: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  routeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.orangeDark,
  },
});
