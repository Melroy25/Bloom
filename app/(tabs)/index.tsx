import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Leaf } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { Shadows } from '../../constants/shadows';
import { BloomHeader } from '../../components/dashboard/BloomHeader';
import { QuoteCard } from '../../components/cards/QuoteCard';
import { ProgressComparisonCard } from '../../components/cards/ProgressComparisonCard';
import { StatisticCard } from '../../components/cards/StatisticCard';
import { QuickActionCard } from '../../components/cards/QuickActionCard';
import { DailyGoalCard } from '../../components/cards/DailyGoalCard';
import { SectionHeader } from '../../components/common/SectionHeader';
import {
  userName,
  getGreeting,
  dailyQuote,
  beforeData,
  afterData,
  todayStats,
  quickActions,
  dailyGoals as initialGoals,
} from '../../data/mockData';
import { DailyGoal } from '../../types';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<DailyGoal[]>(initialGoals);

  const toggleGoal = useCallback((id: string) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  }, []);

  const completedCount = goals.filter(g => g.completed).length;
  const totalCount = goals.length;
  const completionPercent = Math.round((completedCount / totalCount) * 100);

  const handleQuickAction = (route: string) => {
    try {
      router.push(route as any);
    } catch {
      // Fallback for navigation
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Section A: Header */}
        <BloomHeader
          greeting={getGreeting()}
          userName={userName}
          subtitle="Every small step counts. Keep growing."
        />

        {/* Section B: Daily Quote */}
        <QuoteCard text={dailyQuote.text} author={dailyQuote.author} />

        {/* Section C: Before & After Progress */}
        <SectionHeader
          title="Your Growth Journey"
          subtitle="See how small habits change your day."
        />
        <ProgressComparisonCard beforeData={beforeData} afterData={afterData} />

        {/* Section D: Today's Overview */}
        <SectionHeader title="Today's Overview" subtitle="Your daily snapshot" />
        <View style={styles.statsGrid}>
          {todayStats.map(stat => (
            <StatisticCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              progress={stat.progress}
            />
          ))}
        </View>

        {/* Section E: Quick Actions */}
        <SectionHeader title="Quick Access" />
        <View style={styles.quickGrid}>
          {quickActions.map(action => (
            <QuickActionCard
              key={action.id}
              title={action.title}
              description={action.description}
              icon={action.icon}
              color={action.color}
              onPress={() => handleQuickAction(action.route)}
            />
          ))}
        </View>

        {/* Section F: Daily Goals */}
        <SectionHeader
          title="Your Daily Goals"
          subtitle={`${completedCount}/${totalCount} completed`}
        />
        <View style={styles.goalsContainer}>
          {/* Progress bar */}
          <View style={styles.goalProgressContainer}>
            <View style={styles.goalProgressBar}>
              <View
                style={[
                  styles.goalProgressFill,
                  { width: `${completionPercent}%` },
                ]}
              />
            </View>
            <Text style={styles.goalProgressText}>{completionPercent}%</Text>
          </View>

          {goals.map(goal => (
            <DailyGoalCard
              key={goal.id}
              title={goal.title}
              icon={goal.icon}
              completed={goal.completed}
              onToggle={() => toggleGoal(goal.id)}
            />
          ))}

          {completedCount > 0 && (
            <View style={styles.encourageContainer}>
              <Text style={styles.encourageText}>
                {completedCount === totalCount
                  ? '🎉 Amazing! All goals completed!'
                  : `🌟 Great job! Keep going, you've got this!`}
              </Text>
            </View>
          )}
        </View>

        {/* Section G: Daily Motivation */}
        <View style={[styles.motivationCard, Shadows.sm]}>
          <View style={styles.motivationContent}>
            <View style={styles.motivationLeaf}>
              <Leaf size={24} color={Colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.motivationText}>
              Remember, growth isn't about perfection.{'\n'}It's about progress.
            </Text>
            <View style={styles.motivationDecor}>
              <Leaf size={14} color={Colors.primary} strokeWidth={1.2} style={{ opacity: 0.3, transform: [{ rotate: '-30deg' }] }} />
              <Text style={styles.bloomSign}>— bloom</Text>
              <Leaf size={14} color={Colors.primary} strokeWidth={1.2} style={{ opacity: 0.3, transform: [{ rotate: '30deg' }] }} />
            </View>
          </View>
        </View>

        {/* Bottom spacing for tab bar */}
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.huge,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  goalsContainer: {
    paddingHorizontal: Spacing.xl,
  },
  goalProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  goalProgressText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primary,
    minWidth: 36,
    textAlign: 'right',
  },
  encourageContainer: {
    backgroundColor: Colors.lightSage,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  encourageText: {
    ...Typography.bodySmall,
    color: Colors.primaryDark,
    fontWeight: '500',
    textAlign: 'center',
  },
  motivationCard: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xxl,
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.lightSage,
    overflow: 'hidden',
  },
  motivationContent: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  motivationLeaf: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.lightSage,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  motivationText: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.primaryDark,
    fontStyle: 'italic',
    lineHeight: 24,
    fontWeight: '500',
  },
  motivationDecor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    gap: 8,
  },
  bloomSign: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
