import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { Alert } from '../../types';
import { StatusBadge } from './StatusBadge';

interface AlertCardProps {
  alert: Alert;
  onPress?: () => void;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onPress,
  onActionPress,
  style,
}) => {
  const isCritical = alert.severity === 'CRITICAL';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.card,
        isCritical ? styles.criticalBorder : styles.standardBorder,
        shadows.subtle,
        style,
      ]}
    >
      <View style={styles.header}>
        <StatusBadge status={alert.severity} size="sm" />
        <Text style={styles.time}>{alert.timestamp || 'Live'}</Text>
      </View>

      <Text style={styles.title}>{alert.title}</Text>
      <Text style={styles.location}>📍 {alert.location}</Text>
      <Text style={styles.message}>{alert.message}</Text>

      {alert.action_text && (
        <View style={styles.actionContainer}>
          <Text style={styles.actionLabel}>Recommended Response:</Text>
          <Text style={styles.actionText}>{alert.action_text}</Text>
        </View>
      )}

      {onActionPress && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onActionPress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>View Corridor on Map →</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    gap: 6,
  },
  standardBorder: {
    borderColor: colors.border,
  },
  criticalBorder: {
    borderColor: colors.criticalBorder,
    backgroundColor: '#FFFBFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  location: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.navy,
  },
  message: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionContainer: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: spacing.radius.xs,
    padding: spacing.xs,
    marginTop: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.orange,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.orangeDark,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  actionText: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 2,
    fontWeight: '500',
  },
  actionButton: {
    marginTop: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
});
