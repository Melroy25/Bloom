import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bot, Send, Mic, Sparkles, User, ChevronRight, Leaf } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { Shadows } from '../../constants/shadows';
import { aiCompanion } from '../../data/mockData';

export default function AICompanionScreen() {
  const [inputText, setInputText] = useState('');
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
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Sparkles size={28} color={Colors.white} strokeWidth={1.5} />
            </View>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.headerTitle}>{aiCompanion.name}</Text>
          <Text style={styles.headerSubtitle}>Your personal wellness companion</Text>
        </View>

        {/* Welcome Card */}
        <View style={[styles.welcomeCard, Shadows.sm]}>
          <Text style={styles.welcomeGreeting}>{aiCompanion.greeting}</Text>
          <Text style={styles.welcomeDesc}>{aiCompanion.description}</Text>
        </View>

        {/* Character Selection */}
        <TouchableOpacity style={[styles.characterCard, Shadows.sm]} activeOpacity={0.7}>
          <View style={styles.characterLeft}>
            <View style={styles.characterIcon}>
              <Bot size={20} color={Colors.primary} strokeWidth={1.5} />
            </View>
            <View>
              <Text style={styles.characterTitle}>Choose AI Personality</Text>
              <Text style={styles.characterDesc}>Customize your companion's style</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.mutedText} />
        </TouchableOpacity>

        {/* Chat Preview */}
        <View style={styles.chatPreviewSection}>
          <Text style={styles.previewLabel}>CONVERSATION PREVIEW</Text>
          <View style={styles.chatContainer}>
            {aiCompanion.sampleMessages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'ai' ? styles.aiBubble : styles.userBubble,
                ]}
              >
                <View style={styles.messageHeader}>
                  {msg.sender === 'ai' ? (
                    <Sparkles size={12} color={Colors.primary} strokeWidth={2} />
                  ) : (
                    <User size={12} color={Colors.mutedText} strokeWidth={2} />
                  )}
                  <Text style={styles.messageLabel}>
                    {msg.sender === 'ai' ? 'Bloom AI' : 'You'}
                  </Text>
                </View>
                <Text style={styles.messageText}>{msg.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Coming Soon Note */}
        <View style={styles.comingSoon}>
          <Leaf size={16} color={Colors.primary} strokeWidth={1.5} style={{ opacity: 0.5 }} />
          <Text style={styles.comingSoonText}>AI integration coming soon</Text>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Chat Input Bar */}
      <View style={[styles.inputBar, Shadows.md]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Talk to Bloom..."
            placeholderTextColor={Colors.lightText}
            value={inputText}
            onChangeText={setInputText}
            editable={true}
          />
          <TouchableOpacity style={styles.micButton} activeOpacity={0.7}>
            <Mic size={20} color={Colors.primary} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendButton} activeOpacity={0.7}>
          <Send size={20} color={Colors.white} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>
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
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: Colors.background,
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
  welcomeCard: {
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.lightSage,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  welcomeGreeting: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
    fontSize: 16,
  },
  welcomeDesc: {
    ...Typography.bodySmall,
    color: Colors.mutedText,
    lineHeight: 20,
  },
  characterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  characterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.mint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  characterTitle: {
    ...Typography.body,
    fontWeight: '600',
  },
  characterDesc: {
    ...Typography.caption,
    marginTop: 1,
  },
  chatPreviewSection: {
    paddingHorizontal: Spacing.xl,
  },
  previewLabel: {
    ...Typography.label,
    marginBottom: Spacing.md,
  },
  chatContainer: {
    gap: Spacing.sm,
  },
  messageBubble: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    maxWidth: '85%',
  },
  aiBubble: {
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: Colors.lightSage,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  messageLabel: {
    ...Typography.caption,
    fontWeight: '600',
    fontSize: 10,
  },
  messageText: {
    ...Typography.body,
    fontSize: 14,
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
  inputBar: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    paddingVertical: 4,
  },
  micButton: {
    padding: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
