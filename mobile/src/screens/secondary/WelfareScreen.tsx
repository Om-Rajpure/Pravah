import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { colors, typography, spacing, shadows } from '../../theme';
import { PRHeader } from '../../components/ui/PRHeader';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { fetchWelfareData } from '../../api/welfare';

export const WelfareScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchWelfareData().then(res => setData(res.data));
  }, []);

  const hotlines = data?.emergency_hotlines || [
    { label: 'BMC Disaster Control Room', number: '1916', desc: '24x7 Emergency Management' },
    { label: 'Mumbai Police Helpline', number: '100', desc: 'Law & Order and Crowd Safety' },
    { label: 'Emergency Medical & Ambulance', number: '108', desc: 'Rapid Medical Response' },
    { label: 'Railway Police (GRP/RPF)', number: '1512', desc: 'Station Safety & Crowd Assistance' }
  ];

  const amenities = data?.amenities || [];

  const handleCall = (num: string) => {
    Linking.openURL(`tel:${num.split('/')[0].trim()}`);
  };

  return (
    <View style={styles.container}>
      <PRHeader
        title="Civic Welfare & Helplines"
        subtitle="Drinking water, first aid, police & emergency aid"
        showBack={true}
        onBack={() => navigation.goBack()}
      />

      <ScreenContainer>
        {/* 24x7 Hotlines Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>🚨 24X7 EMERGENCY HOTLINES</Text>
          <View style={styles.hotlineGrid}>
            {hotlines.map((h: any, idx: number) => (
              <TouchableOpacity
                key={idx}
                style={[styles.hotlineCard, shadows.card]}
                onPress={() => handleCall(h.number)}
                activeOpacity={0.7}
              >
                <Text style={styles.hotlineLabel}>{h.label}</Text>
                <Text style={styles.hotlineNumber}>{h.number}</Text>
                <Text style={styles.hotlineDesc}>{h.desc}</Text>
                <Text style={styles.callBadge}>📞 Tap to Call</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Monitored Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>🏥 MONITORED FIELD OUTPOSTS</Text>
          <View style={styles.amenityList}>
            {amenities.map((a: any, idx: number) => (
              <View key={idx} style={[styles.amenityCard, shadows.subtle]}>
                <View style={styles.amenityHeader}>
                  <Text style={styles.amenityName}>{a.name}</Text>
                  <StatusBadge status={a.status} size="sm" />
                </View>
                <View style={styles.amenityMeta}>
                  <Text style={styles.amenityType}>Category: {a.type}</Text>
                  <Text style={styles.amenityCapacity}>Capacity: ~{a.capacity}</Text>
                </View>
              </View>
            ))}
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
  section: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  hotlineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  hotlineCard: {
    width: '48%',
    backgroundColor: colors.navyDark,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    gap: 2,
  },
  hotlineLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  hotlineNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.orange,
    marginVertical: 2,
  },
  hotlineDesc: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  callBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.tealLight,
    marginTop: 6,
  },
  amenityList: {
    gap: spacing.xs,
  },
  amenityCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  amenityHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  amenityName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  amenityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  amenityType: {
    fontSize: 12,
    color: colors.navy,
    fontWeight: '600',
  },
  amenityCapacity: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
