import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { PRHeader } from '../../components/ui/PRHeader';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { PrimaryButton, SecondaryButton } from '../../components/ui/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { fetchRecommendations, simulateAction, applyAction } from '../../api/actions';

export const RecommendationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isOperator } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);

  useEffect(() => {
    fetchRecommendations().then(res => setData(res.data));
  }, []);

  const rec = data?.recommendations?.[0] || {
    id: 'rec-divert-thane-01',
    title: '18% Passenger Inflow Redirection to Thane Suburban Buffer',
    source_zone: 'Curry Road / Parel Central',
    destination_zone: 'Thane Suburban Hub',
    dosage_pct: 18,
    expected_reduction_pts: 18.4,
    buffer_increase_pts: 4.8,
    confidence_pct: 94.2,
    summary: 'Diverts non-local evening darshan attendees towards Thane holding plazas, reducing Curry Road saturation from 94% to 76%.',
    why: [
      'Curry Road platform bottleneck predicted at 104% in 45 min',
      'Thane terminal has 58% spare capacity',
      'Saves ~24 min average pedestrian transit delay'
    ]
  };

  const handleSimulate = async () => {
    setLoading(true);
    await simulateAction(rec.id);
    setLoading(false);
    Alert.alert(
      'Action Simulated',
      `Counterfactual impact calculated:\n• Bottleneck reduction: -18.4 pts\n• Spillover load on Thane: +4.8 pts (Safe)`
    );
  };

  const handleApply = async () => {
    if (!isOperator) {
      Alert.alert('Permission Denied', 'Only authorized Incident Commanders can apply live interventions.');
      return;
    }

    setLoading(true);
    await applyAction(rec.id);
    setLoading(false);
    setApplied(true);
    Alert.alert('Intervention Deployed', '18% redirection advisory pushed to railway passenger information systems.');
  };

  return (
    <View style={styles.container}>
      <PRHeader
        title="Action Recommendations"
        subtitle="Algorithmic Decision Center & Redirection"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScreenContainer>
        {/* Main Recommendation Card */}
        <View style={[styles.card, shadows.card]}>
          <View style={styles.badgeRow}>
            <View style={styles.recBadge}>
              <Text style={styles.recBadgeText}>⚡ OPTIMAL INTERVENTION</Text>
            </View>
            <Text style={styles.confText}>{rec.confidence_pct}% AI Confidence</Text>
          </View>

          <Text style={styles.title}>{rec.title}</Text>
          <Text style={styles.summary}>{rec.summary}</Text>

          {/* Impact Scorecard */}
          <View style={styles.scorecard}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Curry Road</Text>
              <Text style={[styles.scoreVal, { color: colors.teal }]}>-{rec.expected_reduction_pts} pts</Text>
              <Text style={styles.scoreSub}>Expected Relief</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Thane Buffer</Text>
              <Text style={[styles.scoreVal, { color: colors.amber }]}>+{rec.buffer_increase_pts} pts</Text>
              <Text style={styles.scoreSub}>Buffer Influx</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>Dosage</Text>
              <Text style={[styles.scoreVal, { color: colors.navy }]}>{rec.dosage_pct}%</Text>
              <Text style={styles.scoreSub}>Redirection</Text>
            </View>
          </View>

          {/* Justification Reasons */}
          <View style={styles.whyBox}>
            <Text style={styles.whyTitle}>Why this recommendation?</Text>
            {rec.why?.map((item: string, idx: number) => (
              <View key={idx} style={styles.whyItem}>
                <Text style={styles.check}>✓</Text>
                <Text style={styles.whyText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Action CTAs */}
          <View style={styles.ctaStack}>
            <PrimaryButton
              title={applied ? "✅ Intervention Active" : isOperator ? "🚀 Apply 18% Redirection" : "🗺️ View Corridor on Map"}
              onPress={isOperator && !applied ? handleApply : () => navigation.navigate('Map', { zoneId: 'curry-road' })}
              variant={isOperator ? "orange" : "navy"}
              loading={loading}
            />
            <SecondaryButton
              title="🔍 Open Glass Box Explainability Trace"
              onPress={() => navigation.navigate('GlassBox')}
            />
          </View>
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
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recBadge: {
    backgroundColor: colors.orangeSoft,
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: spacing.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  recBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.orangeDark,
  },
  confText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.tealDark,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  summary: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  scorecard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: spacing.radius.sm,
    padding: spacing.sm,
    marginVertical: 4,
  },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  scoreVal: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 2,
  },
  scoreSub: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderLight,
  },
  whyBox: {
    backgroundColor: colors.background,
    borderRadius: spacing.radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  whyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.navy,
    textTransform: 'uppercase',
  },
  whyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  check: {
    color: colors.teal,
    fontWeight: '800',
  },
  whyText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  ctaStack: {
    gap: spacing.xs,
    marginTop: 4,
  },
});
