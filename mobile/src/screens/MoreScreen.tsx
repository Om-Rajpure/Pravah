import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors, typography, spacing, shadows } from '../theme';
import { useAuth } from '../context/AuthContext';
import { PRHeader } from '../components/ui/PRHeader';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { StatusBadge } from '../components/ui/StatusBadge';

interface MenuItem {
  icon: string;
  title: string;
  subtitle: string;
  screen: string;
  badge?: string;
  roles?: ('OPERATOR' | 'STAFF' | 'VISITOR')[];
}

const MENU_ITEMS: MenuItem[] = [
  { icon: '🏨', title: 'Hospitality & Buffer Stays', subtitle: 'Suburban room availability & tariffs', screen: 'Hospitality' },
  { icon: '🚆', title: 'Mobility & Station Saturations', subtitle: 'Railway loads and road closures', screen: 'Mobility' },
  { icon: '💧', title: 'Civic Welfare & Assistance', subtitle: 'Drinking water, first aid & police desks', screen: 'Welfare' },
  { icon: '📈', title: 'Predictions (+30m to +180m)', subtitle: 'Multi-horizon crowd trend forecast', screen: 'Predictions' },
  { icon: '⚡', title: 'Action Recommendations', subtitle: '18% redirection decision center', screen: 'Recommendations' },
  { icon: '🧪', title: 'What-If Scenarios', subtitle: 'Monsoon rain & transit outage sandbox', screen: 'Scenarios' },
  { icon: '🔍', title: 'Glass Box Explainability', subtitle: '4-step algorithmic reasoning chain', screen: 'GlassBox' },
  { icon: '👥', title: 'Visitor Movement Guide', subtitle: 'Smart darshan windows & advice', screen: 'VisitorExperience' },
  { icon: '⚙️', title: 'Settings & Server URL', subtitle: 'Configure API endpoints & storage', screen: 'Settings' },
];

export const MoreScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to end your current session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <PRHeader
        title="More Operations"
        subtitle="Intelligence Modules & Preferences"
      />

      <ScreenContainer>
        {/* User Profile Card */}
        <View style={[styles.profileCard, shadows.subtle]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0) : 'U'}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest Explorer'}</Text>
            <Text style={styles.userRole}>{user?.department || 'PRAVAAH Network Access'}</Text>
            <View style={{ marginTop: 4 }}>
              <StatusBadge status={user?.role || 'VISITOR'} size="sm" />
            </View>
          </View>
        </View>

        {/* Modules List */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>INTELLIGENCE & FIELD MODULES</Text>
          <View style={[styles.menuList, shadows.subtle]}>
            {MENU_ITEMS.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.menuItem,
                  idx !== MENU_ITEMS.length - 1 && styles.menuItemBorder,
                ]}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>🚪 Sign Out of PRAVAAH</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          PRAVAAH Mobile v1.0 &middot; Ganesh Chaturthi 2026 Telemetry
        </Text>
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textWhite,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userRole: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
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
  menuList: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.criticalBg,
    borderColor: colors.criticalBorder,
    borderWidth: 1,
    borderRadius: spacing.radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoutText: {
    color: colors.critical,
    fontSize: 14,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    paddingBottom: spacing.md,
  },
});
