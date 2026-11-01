import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  X,
  Plus,
  Home,
  Sparkles,
  Settings,
  MessageSquare,
  Sprout,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { RECENT_CHECK_INS, ConversationThread } from '../../services/aiCompanionService';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectThread: (thread: ConversationThread) => void;
  activeThreadId?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(320, SCREEN_WIDTH * 0.82);

export function SidebarDrawer({
  isOpen,
  onClose,
  onNewChat,
  onSelectThread,
  activeThreadId,
}: SidebarDrawerProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, fadeAnim]);

  if (!isOpen && (slideAnim as any)._value === -DRAWER_WIDTH) {
    return null;
  }

  const navigateToHome = () => {
    onClose();
    router.replace('/(tabs)');
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Drawer Container */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 16),
            paddingBottom: Math.max(insets.bottom, 16),
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.brandIconContainer}>
                <Sprout size={20} color={Colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={styles.brandTitle}>BLOOM</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
              accessibilityLabel="Close menu"
            >
              <X size={20} color={Colors.darkText} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* New Chat Primary Button */}
          <View style={styles.newChatWrapper}>
            <TouchableOpacity
              style={styles.newChatButton}
              onPress={() => {
                onNewChat();
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Plus size={18} color={Colors.white} strokeWidth={2.4} />
              <Text style={styles.newChatText}>New chat</Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Links */}
          <View style={styles.navSection}>
            <TouchableOpacity
              style={styles.navItem}
              onPress={navigateToHome}
              activeOpacity={0.7}
            >
              <Home size={19} color={Colors.mutedText} strokeWidth={1.8} />
              <Text style={styles.navItemText}>Home</Text>
            </TouchableOpacity>

            <View style={[styles.navItem, styles.navItemActive]}>
              <Sparkles size={19} color={Colors.primaryDark} strokeWidth={2} />
              <Text style={[styles.navItemText, styles.navItemTextActive]}>AI Companion</Text>
            </View>

            <TouchableOpacity
              style={styles.navItem}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Settings size={19} color={Colors.mutedText} strokeWidth={1.8} />
              <Text style={styles.navItemText}>Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Recent Check-ins */}
          <View style={styles.recentHeader}>
            <Text style={styles.recentHeaderText}>RECENT CHECK-INS</Text>
          </View>

          <ScrollView style={styles.recentList} showsVerticalScrollIndicator={false}>
            {RECENT_CHECK_INS.map((thread) => {
              const isSelected = activeThreadId === thread.id;
              return (
                <TouchableOpacity
                  key={thread.id}
                  style={[styles.threadItem, isSelected && styles.threadItemActive]}
                  onPress={() => {
                    onSelectThread(thread);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <MessageSquare
                    size={16}
                    color={isSelected ? Colors.primary : Colors.mutedText}
                    strokeWidth={1.8}
                  />
                  <Text
                    style={[styles.threadTitle, isSelected && styles.threadTitleActive]}
                    numberOfLines={1}
                  >
                    {thread.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Student Profile Card Footer */}
          <View style={styles.footerProfile}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require('../../assets/maya-avatar.png')}
                style={styles.profileAvatar}
                resizeMode="cover"
              />
              <View style={styles.onlineBadge} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>
                Maya S.
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>Student Bloom</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(36, 51, 44, 0.35)',
    zIndex: 100,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.white,
    zIndex: 101,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAF4EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    ...Typography.h3,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F6F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 9999,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  newChatText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.white,
    fontSize: 14,
  },
  navSection: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  navItemActive: {
    backgroundColor: '#EAF3ED',
  },
  navItemText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.mutedText,
    fontWeight: '500',
  },
  navItemTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF2EF',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  recentHeader: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  recentHeaderText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.lightText,
    letterSpacing: 0.8,
  },
  recentList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  threadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  threadItemActive: {
    backgroundColor: '#F3F8F5',
  },
  threadTitle: {
    ...Typography.bodySmall,
    color: Colors.darkText,
    fontSize: 13,
    flex: 1,
  },
  threadTitleActive: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  footerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F8FAF9',
    borderTopWidth: 1,
    borderTopColor: '#EEF2EF',
  },
  avatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.body,
    fontWeight: '700',
    fontSize: 14,
    color: Colors.darkText,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4EFF8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    marginTop: 2,
  },
  roleBadgeText: {
    fontSize: 10,
    color: '#45617A',
    fontWeight: '600',
  },
});
