import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors, typography, spacing, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton, SecondaryButton } from '../components/ui/PrimaryButton';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login, loginGuest, isLoading } = useAuth();

  const [email, setEmail] = useState('admin@pravaah.gov.in');
  const [password, setPassword] = useState('pravaah2026');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await login(email.trim(), password.trim());
    if (res.success) {
      navigation.replace('MainTabs');
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleGuest = async () => {
    setErrorMessage(null);
    const res = await loginGuest();
    if (res.success) {
      navigation.replace('MainTabs');
    } else {
      setErrorMessage(res.error || 'Could not connect as guest.');
    }
  };

  const fillCredentials = (type: 'admin' | 'staff' | 'visitor') => {
    if (type === 'admin') {
      setEmail('admin@pravaah.gov.in');
      setPassword('pravaah2026');
    } else if (type === 'staff') {
      setEmail('staff@pravaah.gov.in');
      setPassword('field2026');
    } else {
      setEmail('visitor@pravaah.in');
      setPassword('visitor2026');
    }
    setErrorMessage(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Banner */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>PRAVAAH</Text>
            <View style={styles.orangeDot} />
          </View>
          <Text style={styles.headerTag}>CITY INTELLIGENCE PLATFORM</Text>
          <Text style={styles.headerSub}>Ganesh Chaturthi 2026 &middot; Field Access</Text>
        </View>

        {/* Login Card */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>Sign In</Text>
          <Text style={styles.cardSubtitle}>
            Access real-time crowd telemetry and mobility routing
          </Text>

          {errorMessage && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Official Email / ID</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. admin@pravaah.gov.in"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Primary Login Button */}
          <PrimaryButton
            title="Sign In to Control Room"
            onPress={handleLogin}
            loading={isLoading}
            variant="orange"
            style={{ marginTop: spacing.sm }}
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Quick Guest Access Button */}
          <SecondaryButton
            title="Explore as Citizen / Visitor (No Login)"
            onPress={handleGuest}
            disabled={isLoading}
          />
        </View>

        {/* Quick Demo Credentials Picker */}
        <View style={styles.quickPickBox}>
          <Text style={styles.quickPickTitle}>One-Tap Demo Credentials:</Text>
          <View style={styles.quickPickRow}>
            <TouchableOpacity
              style={styles.quickPickPill}
              onPress={() => fillCredentials('admin')}
            >
              <Text style={styles.quickPickText}>🛡️ Operator</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickPickPill}
              onPress={() => fillCredentials('staff')}
            >
              <Text style={styles.quickPickText}>🚆 Field Staff</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickPickPill}
              onPress={() => fillCredentials('visitor')}
            >
              <Text style={styles.quickPickText}>👥 Visitor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navyDark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textWhite,
    letterSpacing: -0.5,
  },
  orangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange,
    marginTop: 4,
  },
  headerTag: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1.5,
    marginTop: 6,
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.lg,
    padding: spacing.xl,
    gap: spacing.md,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: -8,
  },
  errorBox: {
    backgroundColor: colors.criticalBg,
    borderColor: colors.criticalBorder,
    borderWidth: 1,
    borderRadius: spacing.radius.xs,
    padding: spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: colors.critical,
    fontWeight: '600',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.sm,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: 15,
    color: colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
    gap: spacing.sm,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
  },
  quickPickBox: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickPickTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  quickPickRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  quickPickPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: spacing.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  quickPickText: {
    color: colors.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
});
