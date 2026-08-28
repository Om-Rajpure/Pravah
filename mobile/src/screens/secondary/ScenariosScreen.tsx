import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { PRHeader } from '../../components/ui/PRHeader';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { fetchScenarios, runScenario } from '../../api/scenarios';
import { Scenario } from '../../types';

export const ScenariosScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchScenarios().then(res => {
      if (res.data?.scenarios) {
        setScenarios(res.data.scenarios);
        setSelectedScenario(res.data.scenarios[0]);
      }
    });
  }, []);

  const handleTestScenario = async () => {
    if (!selectedScenario) return;
    setLoading(true);
    await runScenario(selectedScenario.id);
    setLoading(false);
    Alert.alert(
      'Stress Scenario Evaluated',
      `Simulation Outcome:\n• City Pressure: 70 → ${70 + selectedScenario.impact_delta} (+${selectedScenario.impact_delta} pts)\n• Affected Nodes: ${selectedScenario.affected_zones.join(', ')}\n• Automated Strategy: ${selectedScenario.recommended_action}`
    );
  };

  return (
    <View style={styles.container}>
      <PRHeader
        title="What-If Stress Sandbox"
        subtitle="Simulate Extreme Weather & Transit Disruptions"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScreenContainer>
        {/* Scenario Selection Chips */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SELECT STRESS EVENT</Text>
          <View style={styles.chipGrid}>
            {scenarios.map(s => {
              const isSelected = selectedScenario?.id === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.scenarioChip, isSelected && styles.activeScenarioChip, shadows.subtle]}
                  onPress={() => setSelectedScenario(s)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipTitle, isSelected && styles.activeChipTitle]}>
                    {s.name}
                  </Text>
                  <Text style={[styles.chipCategory, isSelected && styles.activeChipCategory]}>
                    {s.category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Evaluated Scenario Details */}
        {selectedScenario && (
          <View style={[styles.detailCard, shadows.card]}>
            <View style={styles.detailHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailName}>{selectedScenario.name}</Text>
                <Text style={styles.detailCategory}>{selectedScenario.category}</Text>
              </View>
              <StatusBadge status={selectedScenario.severity} size="md" />
            </View>

            <Text style={styles.detailDesc}>{selectedScenario.description}</Text>

            {/* Impact Metric Row */}
            <View style={styles.impactBox}>
              <View style={styles.impactLeft}>
                <Text style={styles.impactLabel}>Projected Pressure Delta</Text>
                <Text style={styles.impactVal}>+{selectedScenario.impact_delta} points</Text>
              </View>
              <View style={styles.impactRight}>
                <Text style={styles.impactSub}>Simulated city pressure: 70 → {70 + selectedScenario.impact_delta}</Text>
              </View>
            </View>

            {/* Recommended Response */}
            <View style={styles.responseBox}>
              <Text style={styles.responseLabel}>Automated Contingency Response</Text>
              <Text style={styles.responseText}>{selectedScenario.recommended_action}</Text>
            </View>

            <PrimaryButton
              title="🧪 Run Sandbox Simulation"
              onPress={handleTestScenario}
              variant="orange"
              loading={loading}
            />
          </View>
        )}
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  chipGrid: {
    gap: spacing.xs,
  },
  scenarioChip: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 2,
  },
  activeScenarioChip: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  chipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  activeChipTitle: {
    color: colors.textWhite,
  },
  chipCategory: {
    fontSize: 11,
    color: colors.textMuted,
  },
  activeChipCategory: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  detailName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  detailCategory: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: '600',
    marginTop: 2,
  },
  detailDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  impactBox: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: spacing.radius.xs,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impactLeft: {
    flex: 1,
  },
  impactLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  impactVal: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.critical,
    marginTop: 2,
  },
  impactRight: {
    flex: 1,
  },
  impactSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  responseBox: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
    borderWidth: 1,
    borderRadius: spacing.radius.xs,
    padding: spacing.sm,
    gap: 2,
  },
  responseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.tealDark,
    textTransform: 'uppercase',
  },
  responseText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    lineHeight: 18,
  },
});
