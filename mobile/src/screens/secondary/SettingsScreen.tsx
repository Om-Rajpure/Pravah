import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Platform } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { PRHeader } from '../../components/ui/PRHeader';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { PrimaryButton, SecondaryButton } from '../../components/ui/PrimaryButton';
import { getApiBaseUrl, setCustomApiUrl } from '../../api/client';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [apiUrl, setApiUrl] = useState<string>(getApiBaseUrl());
  const [saved, setSaved] = useState<boolean>(false);

  const handleSaveUrl = () => {
    if (!apiUrl.trim()) {
      Alert.alert('Invalid URL', 'Please enter a valid HTTP/HTTPS API URL.');
      return;
    }
    setCustomApiUrl(apiUrl.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    Alert.alert('API Configured', `PRAVAAH will now connect to:\n${apiUrl.trim()}`);
  };

  const setPreset = (url: string) => {
    setApiUrl(url);
  };

  return (
    <View style={styles.container}>
      <PRHeader
        title="Settings & Connectivity"
        subtitle="Configure Backend Server & Cache"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScreenContainer>
        {/* Backend API Endpoint Configuration */}
        <View style={[styles.card, shadows.card]}>
          <Text style={styles.cardTitle}>Backend Server Connection</Text>
          <Text style={styles.cardDesc}>
            Configure the Flask API server address for local development or production deployment.
          </Text>

          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="http://10.0.2.2:5000"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.presetRow}>
            <TouchableOpacity
              style={styles.presetChip}
              onPress={() => setPreset('http://10.0.2.2:5000')}
            >
              <Text style={styles.presetText}>Android (10.0.2.2:5000)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.presetChip}
              onPress={() => setPreset('http://localhost:5000')}
            >
              <Text style={styles.presetText}>iOS / Web (localhost:5000)</Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton
            title={saved ? "✅ API URL Saved" : "Save API Configuration"}
            onPress={handleSaveUrl}
            variant="orange"
          />
        </View>

        {/* Permissions & Data */}
        <View style={[styles.card, shadows.subtle]}>
          <Text style={styles.cardTitle}>App Permissions</Text>
          <View style={styles.permRow}>
            <Text style={styles.permName}>📍 Approximate Location</Text>
            <Text style={styles.permStatus}>Granted</Text>
          </View>
          <View style={styles.permRow}>
            <Text style={styles.permName}>🔔 Incident Notifications</Text>
            <Text style={styles.permStatus}>Enabled</Text>
          </View>
        </View>

        {/* Data Architecture Info */}
        <View style={[styles.card, shadows.subtle]}>
          <Text style={styles.cardTitle}>Data Transparency</Text>
          <Text style={styles.infoText}>
            • OpenStreetMap & OpenFreeMap geometries (ODbL)
          </Text>
          <Text style={styles.infoText}>
            • Open-Meteo live weather telemetry (CC BY 4.0)
          </Text>
          <Text style={styles.infoText}>
            • Zero individual tracking &middot; Aggregated telemetry only
          </Text>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.sm,
    paddingHorizontal: spacing.md,
    height: 48,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: spacing.radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.navy,
  },
  permRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  permName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  permStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.teal,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
