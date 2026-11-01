import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Wind,
  BookOpen,
  Gamepad2,
  Music,
  Leaf,
  CheckCircle2,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { Shadows } from '../../constants/shadows';
import { HealFeatureCard } from '../../components/heal-zone/HealFeatureCard';
import { CurrentMoodCard } from '../../components/heal-zone/CurrentMoodCard';
import { MoodSelectorModal } from '../../components/heal-zone/MoodSelectorModal';
import { MoodHistorySection } from '../../components/heal-zone/MoodHistorySection';
import { MoodTrendChart } from '../../components/heal-zone/MoodTrendChart';
import {
  FeatureDetailModal,
  FeatureDetail,
} from '../../components/heal-zone/FeatureDetailModal';
import {
  initialMoodHistory,
  initial7DayChart,
  initial30DayChart,
} from '../../data/mockData';
import { MoodEntry, MoodOption, MoodChartPoint } from '../../types';

export default function HealZoneScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);

  // Current mood state
  const [currentMood, setCurrentMood] = useState<{
    name: string;
    emoji: string;
    timeText: string;
  }>({
    name: 'Calm',
    emoji: '😌',
    timeText: 'Today, 8:45 AM',
  });

  // Mood history state
  const [history, setHistory] = useState<MoodEntry[]>(initialMoodHistory);

  // Mood chart data state
  const [sevenDayChart, setSevenDayChart] =
    useState<MoodChartPoint[]>(initial7DayChart);
  const [thirtyDayChart, setThirtyDayChart] =
    useState<MoodChartPoint[]>(initial30DayChart);

  // Modals state
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<FeatureDetail | null>(
    null
  );

  // Toast confirmation state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Feature cards data definition
  const features: Record<string, FeatureDetail> = {
    bubble: {
      title: 'Heal Bubble',
      subtitle: 'Breathe, relax and find your calm.',
      Icon: Wind,
      color: Colors.primaryDark,
      backgroundColor: Colors.lightSage,
      description:
        'Take a 3-minute guided pause to align your breath with soothing visual rhythms and release nervous tension.',
      tags: ['4-7-8 Breathing', 'Box Breathing', 'Deep Calming'],
      actionLabel: 'Begin Breathing Exercise',
    },
    documents: {
      title: 'Documents',
      subtitle: 'Your personal space to write.',
      Icon: BookOpen,
      color: '#7D5B3C',
      backgroundColor: Colors.peach,
      description:
        'A private, distraction-free sanctuary for journaling, gratitude reflections, exam thoughts, and daily notes.',
      tags: ['Daily Journal', 'Gratitude Prompts', 'Study Notes'],
      actionLabel: 'Open Journal Canvas',
    },
    games: {
      title: 'Games',
      subtitle: 'Relax, play and refresh your mind.',
      Icon: Gamepad2,
      color: '#5A4E80',
      backgroundColor: Colors.lavender,
      description:
        'Mindful mini-games designed to gently de-stress, stimulate gentle creativity, and reset your mind between study blocks.',
      tags: ['Zen Garden', 'Color Flow', 'Mindful Blocks'],
      actionLabel: 'Play Quick Game',
    },
    music: {
      title: 'Music',
      subtitle: 'Find your calm through music.',
      Icon: Music,
      color: '#2E5A70',
      backgroundColor: Colors.softBlue,
      description:
        'Curated ambient audio, nature frequencies, binaural focus beats, and soothing acoustic melodies.',
      tags: ['Gentle Rain', 'Forest Ambience', 'Lo-Fi Chill'],
      actionLabel: 'Play Soundscape',
    },
  };

  // Handle Mood selection
  const handleSelectMood = useCallback((option: MoodOption) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 1. Update Current Mood
    setCurrentMood({
      name: option.name,
      emoji: option.emoji,
      timeText: `Today, ${timeFormatted}`,
    });

    // 2. Add to Local Mood History (prepended)
    const newEntry: MoodEntry = {
      id: `m-${Date.now()}`,
      mood: option.name,
      emoji: option.emoji,
      score: option.score,
      date: 'Today',
      time: timeFormatted,
      timestamp: Date.now(),
    };

    setHistory(prev => [newEntry, ...prev]);

    // 3. Update 7-day and 30-day chart data with new reading
    setSevenDayChart(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        // Update today's score
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          score: option.score,
          mood: option.name,
          emoji: option.emoji,
        };
      }
      return updated;
    });

    setThirtyDayChart(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          score: option.score,
          mood: option.name,
          emoji: option.emoji,
        };
      }
      return updated;
    });

    // 4. Close modal and show confirmation toast
    setMoodModalVisible(false);
    setToastMessage(`Mood logged: ${option.name} ${option.emoji}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1 — HEADER */}
        <View style={styles.header}>
          <View style={styles.headerTopBadge}>
            <Leaf size={14} color={Colors.primary} strokeWidth={2} />
            <Text style={styles.headerBadgeText}>SANCTUARY & WELLNESS</Text>
          </View>
          <Text style={styles.headerTitle}>Heal Zone</Text>
          <Text style={styles.headerSubtitle}>
            Your safe space for healing and self-care.
          </Text>
        </View>

        {/* Confirmation Toast */}
        {toastMessage && (
          <View style={[styles.toastContainer, Shadows.md]}>
            <CheckCircle2 size={18} color={Colors.primaryDark} strokeWidth={2} />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        {/* SECTION 2 — FOUR FEATURE CARDS (2x2 GRID) */}
        <View style={styles.gridSection}>
          <View style={styles.gridRow}>
            {/* CARD 1 — HEAL BUBBLE */}
            <HealFeatureCard
              title={features.bubble.title}
              subtitle={features.bubble.subtitle}
              Icon={features.bubble.Icon}
              backgroundColor={features.bubble.backgroundColor}
              iconBgColor="rgba(54, 91, 69, 0.12)"
              iconColor={features.bubble.color}
              onPress={() => router.push('/heal-bubble')}
            />

            {/* CARD 2 — DOCUMENTS */}
            <HealFeatureCard
              title={features.documents.title}
              subtitle={features.documents.subtitle}
              Icon={features.documents.Icon}
              backgroundColor={features.documents.backgroundColor}
              iconBgColor="rgba(125, 91, 60, 0.12)"
              iconColor={features.documents.color}
              onPress={() => router.push('/documents')}
            />
          </View>

          <View style={styles.gridRow}>
            {/* CARD 3 — GAMES */}
            <HealFeatureCard
              title={features.games.title}
              subtitle={features.games.subtitle}
              Icon={features.games.Icon}
              backgroundColor={features.games.backgroundColor}
              iconBgColor="rgba(90, 78, 128, 0.12)"
              iconColor={features.games.color}
              onPress={() => router.push({ pathname: '/games', params: { from: '/heal-zone' } })}
            />

            {/* CARD 4 — MUSIC */}
            <HealFeatureCard
              title={features.music.title}
              subtitle={features.music.subtitle}
              Icon={features.music.Icon}
              backgroundColor={features.music.backgroundColor}
              iconBgColor="rgba(46, 90, 112, 0.12)"
              iconColor={features.music.color}
              onPress={() => router.push({ pathname: '/music', params: { from: '/heal-zone' } })}
            />
          </View>
        </View>

        {/* SECTION 3 — CURRENT MOOD / LOG MOOD */}
        <CurrentMoodCard
          moodEmoji={currentMood.emoji}
          moodName={currentMood.name}
          lastLoggedTime={currentMood.timeText}
          onLogMoodPress={() => setMoodModalVisible(true)}
        />

        {/* SECTION 4 — RECENT MOOD HISTORY */}
        <MoodHistorySection entries={history} />

        {/* SECTION 5 — MOOD ANALYTICS GRAPH */}
        <MoodTrendChart
          sevenDayData={sevenDayChart}
          thirtyDayData={thirtyDayChart}
        />

        {/* Bottom spacing to ensure content doesn't collide with the fixed navigation bar */}
        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Mood Selector Modal */}
      <MoodSelectorModal
        visible={moodModalVisible}
        onClose={() => setMoodModalVisible(false)}
        onSelectMood={handleSelectMood}
      />

      {/* Feature Detail Modal */}
      <FeatureDetailModal
        visible={!!selectedFeature}
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
      />
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
    paddingBottom: Spacing.massive,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  headerTopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  headerBadgeText: {
    ...Typography.label,
    color: Colors.primaryDark,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  headerTitle: {
    ...Typography.h1,
    fontSize: 30,
    color: Colors.darkText,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.mutedText,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightSage,
    marginHorizontal: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    marginBottom: Spacing.lg,
    gap: 8,
  },
  toastText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  gridSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
