import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { ZoneSummary } from '../../types';

interface HotspotCardProps {
  zone: ZoneSummary;
  onPress?: () => void;
}

export const HotspotCard: React.FC<HotspotCardProps> = ({ zone, onPress }) => {
  const isCritical = zone.pressure >= 85;
  const isHigh = zone.pressure >= 60 && zone.pressure < 85;

  let barColor = colors.teal;
  if (isCritical) barColor = colors.critical;
  else if (isHigh) barColor = colors.orange;
  else if (zone.pressure >= 40) barColor = colors.amber;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.container, shadows.subtle]}
    >
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {zone.name}
        </Text>
        <Text style={[styles.pressureValue, { color: barColor }]}>
          {zone.pressure}%
        </Text>
      </View>

      {/* Saturation Progress Bar */}
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${Math.min(100, zone.pressure)}%`, backgroundColor: barColor },
          ]}
        />
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.levelText}>{zone.level || (isCritical ? 'Critical' : isHigh ? 'High Pressure' : 'Normal')}</Text>
        {zone.people ? (
          <Text style={styles.countText}>~{zone.people.toLocaleString()} pax</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  pressureValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  barBackground: {
    height: 6,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  countText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
