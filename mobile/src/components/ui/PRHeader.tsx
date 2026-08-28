import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../theme';
import { StatusBadge } from './StatusBadge';

interface PRHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const PRHeader: React.FC<PRHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightElement,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) + 8 }]}>
      <View style={styles.content}>
        {/* Left: Back button or PRAVAAH Brand Wordmark */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <View style={styles.brandRow}>
                <Text style={styles.brandText}>PRAVAAH</Text>
                <View style={styles.orangeDot} />
              </View>
              <Text style={styles.subBrandText}>City Intelligence</Text>
            </View>
          )}
        </View>

        {/* Center / Titles */}
        {title && (
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        )}

        {/* Right: LIVE Telemetry or Custom Action */}
        <View style={styles.rightSection}>
          {rightElement ? (
            rightElement
          ) : (
            <View style={styles.liveIndicator}>
              <View style={styles.livePulseDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.navyDark,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.screenPaddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  leftSection: {
    flexShrink: 0,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textWhite,
    letterSpacing: -0.3,
  },
  orangeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.orange,
  },
  subBrandText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: spacing.radius.xs,
  },
  backText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: '600',
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
    marginTop: 1,
  },
  rightSection: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 148, 136, 0.2)',
    borderColor: colors.teal,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.radius.full,
    gap: 5,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.tealLight,
  },
  liveText: {
    color: colors.tealLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
