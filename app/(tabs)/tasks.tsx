import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Monitor, ClipboardList, ListChecks, Moon, Activity, Target, AlertCircle, Eye, LayoutGrid, Leaf } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { Shadows } from '../../constants/shadows';

const taskCategories = [
  { id: '1', title: 'Screen Time', description: 'Monitor your daily screen usage', Icon: Monitor, color: Colors.lavender },
  { id: '2', title: 'Assignment Tracker', description: 'Keep track of your assignments', Icon: ClipboardList, color: Colors.mint },
  { id: '3', title: 'Student Tasks', description: 'Manage your daily study tasks', Icon: ListChecks, color: Colors.lightSage },
  { id: '4', title: 'Sleep Tracking', description: 'Monitor your sleep patterns', Icon: Moon, color: Colors.peach },
  { id: '5', title: 'Stress Tracking', description: 'Understand your stress levels', Icon: Activity, color: Colors.lavender },
  { id: '6', title: 'Goals', description: 'Set and track personal goals', Icon: Target, color: Colors.mint },
  { id: '7', title: 'SOS Signal', description: 'Quick access to help when needed', Icon: AlertCircle, color: '#F5D5D5' },
  { id: '8', title: 'Focus Mode', description: 'Deep focus work sessions', Icon: Eye, color: Colors.lightSage },
];

export default function TasksScreen() {
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
            <LayoutGrid size={24} color={Colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.headerTitle}>Tasks & Tracking</Text>
          <Text style={styles.headerSubtitle}>Manage your productivity and well-being</Text>
        </View>

        {/* Quick Stats Banner */}
        <View style={[styles.statsBanner, Shadows.sm]}>
          <View style={styles.bannerStat}>
            <Text style={styles.bannerStatValue}>5</Text>
            <Text style={styles.bannerStatLabel}>Active</Text>
          </View>
          <View style={styles.bannerDivider} />
          <View style={styles.bannerStat}>
            <Text style={styles.bannerStatValue}>3</Text>
            <Text style={styles.bannerStatLabel}>Completed</Text>
          </View>
          <View style={styles.bannerDivider} />
          <View style={styles.bannerStat}>
            <Text style={styles.bannerStatValue}>78%</Text>
            <Text style={styles.bannerStatLabel}>Progress</Text>
          </View>
        </View>

        {/* Task Grid */}
        <View style={styles.grid}>
          {taskCategories.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.gridCard, Shadows.sm]} activeOpacity={0.7}>
              <View style={[styles.gridIcon, { backgroundColor: item.color }]}>
                <item.Icon size={24} color={Colors.primaryDark} strokeWidth={1.5} />
              </View>
              <Text style={styles.gridTitle}>{item.title}</Text>
              <Text style={styles.gridDesc} numberOfLines={2}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coming Soon Note */}
        <View style={styles.comingSoon}>
          <Leaf size={16} color={Colors.primary} strokeWidth={1.5} style={{ opacity: 0.5 }} />
          <Text style={styles.comingSoonText}>Full tracking features coming soon</Text>
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
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
    justifyContent: 'space-around',
  },
  bannerStat: {
    alignItems: 'center',
  },
  bannerStatValue: {
    ...Typography.stat,
    color: Colors.primary,
  },
  bannerStatLabel: {
    ...Typography.caption,
    marginTop: 2,
  },
  bannerDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  gridIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  gridTitle: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  gridDesc: {
    ...Typography.caption,
    lineHeight: 16,
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
