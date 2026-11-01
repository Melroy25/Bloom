import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wind, Music, BookOpen, Smile, Gamepad2, Leaf, Heart } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { Shadows } from '../../constants/shadows';

const healItems = [
  { id: '1', title: 'Healing Bubble', description: 'Breathe, relax, and find your calm space', Icon: Wind, color: Colors.mint },
  { id: '2', title: 'Music Zone', description: 'Curated playlists for focus and relaxation', Icon: Music, color: Colors.lavender },
  { id: '3', title: 'Journal', description: 'Express your thoughts freely', Icon: BookOpen, color: Colors.peach },
  { id: '4', title: 'Mood Tracking', description: 'Track and understand your emotions', Icon: Smile, color: Colors.lightSage },
  { id: '5', title: 'Healing Games', description: 'Mindful games to destress', Icon: Gamepad2, color: Colors.paleBlue },
];

export default function HealZoneScreen() {
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
            <Heart size={24} color={Colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={styles.headerTitle}>Heal Zone</Text>
          <Text style={styles.headerSubtitle}>Your safe space for healing and self-care</Text>
        </View>

        {/* Wellness Banner */}
        <View style={[styles.banner, Shadows.sm]}>
          <View style={styles.bannerContent}>
            <Leaf size={28} color={Colors.primary} strokeWidth={1.5} />
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Take a moment for yourself</Text>
              <Text style={styles.bannerDesc}>Choose an activity that brings you peace</Text>
            </View>
          </View>
        </View>

        {/* Activity Cards */}
        {healItems.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.card, Shadows.sm]} activeOpacity={0.7}>
            <View style={[styles.cardIcon, { backgroundColor: item.color }]}>
              <item.Icon size={24} color={Colors.primaryDark} strokeWidth={1.5} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Coming Soon Note */}
        <View style={styles.comingSoon}>
          <Leaf size={16} color={Colors.primary} strokeWidth={1.5} style={{ opacity: 0.5 }} />
          <Text style={styles.comingSoonText}>Full features coming soon</Text>
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
  banner: {
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.lightSage,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  bannerTitle: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  bannerDesc: {
    ...Typography.caption,
    color: Colors.mutedText,
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
  cardArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
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
