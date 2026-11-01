import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { ProfileAvatar } from '../common/ProfileAvatar';

interface BloomHeaderProps {
  greeting: string;
  userName: string;
  subtitle: string;
}

export const BloomHeader: React.FC<BloomHeaderProps> = ({ greeting, userName, subtitle }) => {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>BLOOM</Text>
          <Text style={styles.logoTag}>🌱</Text>
        </View>
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.notifButton} activeOpacity={0.7}>
            <Bell size={22} color={Colors.darkText} strokeWidth={1.5} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <ProfileAvatar name={userName} size={40} />
        </View>
      </View>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>{greeting}, {userName} 🌱</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: 2,
  },
  logoTag: {
    fontSize: 20,
    marginLeft: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  greetingContainer: {
    marginTop: Spacing.xs,
  },
  greeting: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.mutedText,
  },
});
