import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../theme';
import { useNetwork } from '../../context/NetworkContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline, lastUpdated } = useNetwork();

  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <View style={styles.dot} />
      <Text style={styles.text}>
        You're offline &middot; Showing cached data from {lastUpdated}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.amberDark,
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surface,
  },
  text: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
});
