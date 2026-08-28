import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { StatusBadge } from './StatusBadge';
import { PrimaryButton } from './PrimaryButton';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  pressure?: number;
  status?: string;
  expectedNext?: string;
  details?: string;
  onActionPress?: () => void;
  actionTitle?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  pressure,
  status,
  expectedNext,
  details,
  onActionPress,
  actionTitle = 'Get Route Directions',
}) => {
  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[styles.sheet, shadows.elevated]}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleArea}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            {pressure !== undefined && (
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Crowd Pressure</Text>
                <Text style={[styles.metricValue, { color: pressure >= 85 ? colors.critical : colors.navy }]}>
                  {pressure}%
                </Text>
              </View>
            )}

            {status && (
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Status</Text>
                <View style={{ marginTop: 4 }}>
                  <StatusBadge status={status} size="sm" />
                </View>
              </View>
            )}

            {expectedNext && (
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Forecast (+30m)</Text>
                <Text style={styles.forecastValue}>{expectedNext}</Text>
              </View>
            )}
          </View>

          {/* Details / Guidance */}
          {details && (
            <View style={styles.detailsBox}>
              <Text style={styles.detailsText}>{details}</Text>
            </View>
          )}

          {/* Primary CTA */}
          {onActionPress && (
            <View style={styles.ctaArea}>
              <PrimaryButton
                title={actionTitle}
                onPress={() => {
                  onClose();
                  onActionPress();
                }}
                variant="primary"
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(11, 35, 66, 0.4)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.radius.lg,
    borderTopRightRadius: spacing.radius.lg,
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleArea: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: spacing.radius.sm,
    padding: spacing.sm,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  forecastValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 3,
  },
  detailsBox: {
    backgroundColor: colors.background,
    borderRadius: spacing.radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  ctaArea: {
    marginTop: spacing.xs,
  },
});
