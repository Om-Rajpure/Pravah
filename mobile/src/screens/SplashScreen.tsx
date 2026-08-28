import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { useAuth } from '../context/AuthContext';

export const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Login');
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoText}>PRAVAAH</Text>
        <View style={styles.orangeDot} />
      </View>

      <Text style={styles.tagline}>MUMBAI CITY INTELLIGENCE</Text>
      <Text style={styles.subtext}>Ganesh Chaturthi 2026 &middot; Digital Twin</Text>

      <View style={styles.spinnerWrap}>
        <ActivityIndicator size="large" color={colors.orange} />
        <Text style={styles.loadingLabel}>Restoring telemetry session...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navyDark,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textWhite,
    letterSpacing: -1,
  },
  orangeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.orange,
    marginTop: 6,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 2,
    marginTop: 8,
  },
  subtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 4,
  },
  spinnerWrap: {
    marginTop: 48,
    alignItems: 'center',
    gap: 12,
  },
  loadingLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
});
