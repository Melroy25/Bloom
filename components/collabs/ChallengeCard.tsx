import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Users,
  Clock,
  Check,
  Plus,
  Wind,
  BookOpen,
  Footprints,
  Smartphone,
  Heart,
  Trophy,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { Shadows } from '../../constants/shadows';
import { Challenge } from '../../types/collabs';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: (challenge: Challenge) => void;
  onJoinToggle: (challengeId: string) => void;
}

const getChallengeIcon = (iconName: string) => {
  switch (iconName) {
    case 'wind':
      return Wind;
    case 'book-open':
      return BookOpen;
    case 'footprints':
      return Footprints;
    case 'smartphone':
      return Smartphone;
    case 'heart':
      return Heart;
    default:
      return Trophy;
  }
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPress,
  onJoinToggle,
}) => {
  const IconComponent = getChallengeIcon(challenge.iconName || 'flame');

  return (
    <TouchableOpacity
      style={[styles.card, Shadows.sm]}
      onPress={() => onPress(challenge)}
      activeOpacity={0.8}
    >
      {/* Cover Gradient Area */}
      <LinearGradient
        colors={challenge.gradientColors || ['#789B83', '#365B45']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.coverGradient}
      >
        <View style={styles.iconCircle}>
          <IconComponent size={22} color={Colors.primaryDark} strokeWidth={2} />
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{challenge.category}</Text>
        </View>
      </LinearGradient>

      {/* Body Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{challenge.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {challenge.description}
        </Text>

        {/* Meta Stats */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={13} color={Colors.mutedText} strokeWidth={1.8} />
            <Text style={styles.metaText}>{challenge.duration}</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={13} color={Colors.mutedText} strokeWidth={1.8} />
            <Text style={styles.metaText}>
              {challenge.participantsCount.toLocaleString()} joined
            </Text>
          </View>
        </View>

        {/* Progress Bar (if joined) */}
        {challenge.isJoined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Your Progress</Text>
              <Text style={styles.progressVal}>{challenge.userProgress ?? 0}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${challenge.userProgress ?? 0}%` },
                ]}
              />
            </View>
          </View>
        )}

        {/* Join / Status Button */}
        <TouchableOpacity
          style={[
            styles.joinBtn,
            challenge.isJoined && styles.joinedBtn,
          ]}
          onPress={e => {
            e.stopPropagation();
            onJoinToggle(challenge.id);
          }}
          activeOpacity={0.75}
        >
          {challenge.isJoined ? (
            <>
              <Check size={14} color={Colors.primaryDark} strokeWidth={2.4} />
              <Text style={styles.joinedBtnText}>Joined · In Progress</Text>
            </>
          ) : (
            <>
              <Plus size={14} color={Colors.white} strokeWidth={2.4} />
              <Text style={styles.joinBtnText}>Join Challenge</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  coverGradient: {
    height: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  categoryText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    fontSize: 17,
    color: Colors.darkText,
    marginBottom: 4,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.mutedText,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.mutedText,
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.mutedText,
    fontWeight: '600',
  },
  progressVal: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    gap: 6,
  },
  joinBtnText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.white,
    fontSize: 13,
  },
  joinedBtn: {
    backgroundColor: Colors.lightSage,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  joinedBtnText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 13,
  },
});
