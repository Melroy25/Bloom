import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors } from '../../../constants/colors';
import { Spacing, BorderRadius } from '../../../constants/spacing';
import { Challenge, TrendingDiscussion } from '../../../types/collabs';

interface TrendingTabProps {
  challenges: Challenge[];
  onToggleJoinChallenge: (id: string) => void;
  discussions?: TrendingDiscussion[];
  onOpenDiscussionComments?: (discussion: TrendingDiscussion) => void;
  onSelectActivity?: (activity: string) => void;
}

export const TrendingTab: React.FC<TrendingTabProps> = ({
  challenges,
  onToggleJoinChallenge,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Active Campus Challenges</Text>

      {/* Clean list of challenges with thin separators */}
      <View style={styles.listContainer}>
        {challenges.map((challenge, index) => (
          <View key={challenge.id} style={styles.challengeRow}>
            {/* Left Content */}
            <View style={styles.infoCol}>
              <View style={styles.titleRow}>
                <Text style={styles.challengeName}>{challenge.title}</Text>
                {challenge.categoryTag ? (
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {challenge.categoryTag}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.challengeDesc}>
                {challenge.description}
              </Text>

              <Text style={styles.participantCount}>
                {challenge.participantsText || `${challenge.participantsCount.toLocaleString()} joined`}
              </Text>
            </View>

            {/* Join Action Button */}
            <TouchableOpacity
              style={[
                styles.joinBtn,
                challenge.isJoined && styles.joinedBtn,
              ]}
              onPress={() => onToggleJoinChallenge(challenge.id)}
              activeOpacity={0.8}
            >
              {challenge.isJoined ? (
                <>
                  <Check size={12} color={Colors.white} strokeWidth={2.4} />
                  <Text style={styles.joinedBtnText}>Joined</Text>
                </>
              ) : (
                <Text style={styles.joinBtnText}>Join</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#141E19',
    marginBottom: 2,
  },
  listContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#E8ECE9',
    overflow: 'hidden',
  },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F1',
    gap: 12,
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  challengeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#141E19',
  },
  categoryBadge: {
    backgroundColor: '#E8F1E8',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#365B45',
    letterSpacing: 0.3,
  },
  challengeDesc: {
    fontSize: 12,
    color: Colors.mutedText,
    lineHeight: 16,
  },
  participantCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#365B45',
    marginTop: 2,
  },
  joinBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinedBtn: {
    backgroundColor: '#365B45',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
  },
  joinBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  joinedBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
});
