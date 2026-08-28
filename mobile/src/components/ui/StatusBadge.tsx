import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface StatusBadgeProps {
  status: 'CRITICAL' | 'HIGH' | 'WARNING' | 'MODERATE' | 'NORMAL' | 'LOW' | 'SAFE' | 'OPEN' | 'RESTRICTED' | string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  label,
}) => {
  const norm = (status || '').toUpperCase();

  let bgColor = colors.surfaceSecondary;
  let textColor = colors.textSecondary;
  let borderColor = colors.border;
  let dotColor = colors.textMuted;
  let displayLabel = label || status;

  if (norm.includes('CRIT') || norm === 'RESTRICTED' || norm === 'DISRUPTED') {
    bgColor = colors.criticalBg;
    textColor = colors.critical;
    borderColor = colors.criticalBorder;
    dotColor = colors.critical;
  } else if (norm.includes('HIGH') || norm === 'WARN' || norm === 'CONGESTED') {
    bgColor = colors.warningBg;
    textColor = colors.amberDark;
    borderColor = colors.warningBorder;
    dotColor = colors.amber;
  } else if (norm === 'MODERATE') {
    bgColor = colors.amberSoft;
    textColor = colors.amberDark;
    borderColor = colors.warningBorder;
    dotColor = colors.amber;
  } else if (norm === 'LOW' || norm === 'NORMAL' || norm === 'SAFE' || norm === 'OPEN' || norm === 'ACTIVE') {
    bgColor = colors.tealSoft;
    textColor = colors.tealDark;
    borderColor = colors.teal;
    dotColor = colors.teal;
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor,
          paddingHorizontal: isSmall ? 6 : isLarge ? 12 : 8,
          paddingVertical: isSmall ? 2 : isLarge ? 5 : 3,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize: isSmall ? 10 : isLarge ? 13 : 11,
          },
        ]}
      >
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: spacing.radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
