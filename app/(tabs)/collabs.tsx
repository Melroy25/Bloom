import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Globe, Users, TrendingUp, Flame, MessageSquare, Leaf, UserPlus } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { Shadows } from '../../constants/shadows';

const collabCategories = [
  { id: '1', title: 'Global Community', description: 'Connect with students worldwide', Icon: Globe, color: Colors.mint, members: '12.4K' },
  { id: '2', title: 'Friends', description: 'Your personal circle', Icon: Users, color: Colors.lavender, members: '24' },
  { id: '3', title: 'Trending Challenges', description: 'Join wellness challenges', Icon: TrendingUp, color: Colors.peach, members: '856' },
  { id: '4', title: 'Group Streaks', description: 'Build habits with friends', Icon: Flame, color: Colors.lightSage, members: '8' },
  { id: '5', title: 'Community Activity', description: 'See what others are up to', Icon: MessageSquare, color: Colors.paleBlue, members: '3.4K' },
];

export default function CollabsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Users size={24} color={Colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.headerTitle}>Collabs</Text>
          <Text style={styles.headerSubtitle}>Grow together with your community</Text>
        </View>

        {/* Invite Banner */}
        <TouchableOpacity style={[styles.inviteBanner, Shadows.sm]} activeOpacity={0.7}>
          <View style={styles.inviteIcon}>
            <UserPlus size={22} color={Colors.white} strokeWidth={1.8} />
          </View>
          <View style={styles.inviteText}>
            <Text style={styles.inviteTitle}>Invite Friends</Text>
            <Text style={styles.inviteDesc}>Build your wellness circle</Text>
          </View>
        </TouchableOpacity>

        {/* Collab Cards */}
        {collabCategories.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.card, Shadows.sm]} activeOpacity={0.7}>
            <View style={[styles.cardIcon, { backgroundColor: item.color }]}>
              <item.Icon size={24} color={Colors.primaryDark} strokeWidth={1.5} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
            <View style={styles.membersBadge}>
              <Text style={styles.membersCount}>{item.members}</Text>
              <Text style={styles.membersLabel}>members</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Coming Soon Note */}
        <View style={styles.comingSoon}>
          <Leaf size={16} color={Colors.primary} strokeWidth={1.5} style={{ opacity: 0.5 }} />
          <Text style={styles.comingSoonText}>Full community features coming soon</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.lightSage,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.mutedText,
    textAlign: 'center',
  },
  inviteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  inviteIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  inviteText: {
    flex: 1,
  },
  inviteTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.white,
  },
  inviteDesc: {
    ...Typography.caption,
    color: Colors.white,
    opacity: 0.8,
    marginTop: 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  cardTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  cardDesc: {
    ...Typography.caption,
    marginTop: 2,
  },
  membersBadge: {
    alignItems: 'center',
    backgroundColor: Colors.cream,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  membersCount: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primary,
    fontSize: 14,
  },
  membersLabel: {
    ...Typography.caption,
    fontSize: 9,
  },
  comingSoon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 8,
  },
  comingSoonText: {
    ...Typography.caption,
    color: Colors.mutedText,
    fontStyle: 'italic',
  },
});
