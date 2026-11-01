import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bot, Send, Mic, Sparkles, User, ChevronRight, Check } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { Shadows } from '../../constants/shadows';
import { getAICompanionChatResponse } from '../../services/aiWellnessService';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: "Hi there! I'm Bloom AI, your personal academic and wellness companion. How are you feeling today?",
    timestamp: '10:00 AM',
  },
  {
    id: 'msg-2',
    sender: 'ai',
    text: "I can help you analyze your screen time, break down upcoming assignments into study blocks, guide you through 4-7-8 stress breathing, or give you circadian sleep advice. Ask me anything!",
    timestamp: '10:01 AM',
  },
];

const QUICK_PROMPTS = [
  '⏱️ How do I reduce my Instagram screen time?',
  '🌙 Why does late-night screen time ruin my sleep?',
  '📚 Help me prioritize my assignments',
  '💓 Guide me through 4-7-8 breathing for stress',
  '⌚ How do I connect my smartwatch biometrics?',
];

export default function AICompanionScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [personality, setPersonality] = useState<'Warm & Empathetic' | 'Direct & Scientific' | 'Motivating Coach'>('Warm & Empathetic');
  const [showPersonalityPicker, setShowPersonalityPicker] = useState(false);

  const scrollViewRef = useRef<any>(null);
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const aiReplyText = await getAICompanionChatResponse(text, {
        screenMinutes: 151,
        tasksCount: 3,
        pendingAssignments: 2,
        sleepHours: 7.2,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "I'm here for you! You have 2 hrs, 31 mins of screen time recorded today. Setting an app timer in the Screen-Time Dashboard or starting a 25-minute Focus Mode block will help you stay balanced.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 150);
    }
  };

  const handleMicPress = () => {
    // Quick demo voice simulation
    handleSendMessage('How can I optimize my study time and reduce screen fatigue?');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: topPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Sparkles size={28} color={Colors.white} strokeWidth={1.8} />
            </View>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.headerTitle}>Bloom AI</Text>
          <Text style={styles.headerSubtitle}>Personal Student Wellness & Study Companion</Text>
        </View>

        {/* Personality Picker Card */}
        <TouchableOpacity
          style={[styles.characterCard, Shadows.sm]}
          activeOpacity={0.8}
          onPress={() => setShowPersonalityPicker(!showPersonalityPicker)}
        >
          <View style={styles.characterLeft}>
            <View style={styles.characterIcon}>
              <Bot size={20} color={Colors.primaryDark} strokeWidth={1.8} />
            </View>
            <View>
              <Text style={styles.characterTitle}>AI Personality: {personality}</Text>
              <Text style={styles.characterDesc}>Tap to switch tone and counseling style</Text>
            </View>
          </View>
          <ChevronRight size={18} color={Colors.mutedText} />
        </TouchableOpacity>

        {/* Personality Dropdown */}
        {showPersonalityPicker && (
          <View style={styles.personalityMenu}>
            {(['Warm & Empathetic', 'Direct & Scientific', 'Motivating Coach'] as const).map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.personalityItem, personality === p && styles.personalityItemActive]}
                onPress={() => {
                  setPersonality(p);
                  setShowPersonalityPicker(false);
                }}
              >
                <Text style={[styles.personalityText, personality === p && styles.personalityTextActive]}>
                  {p}
                </Text>
                {personality === p && <Check size={16} color={Colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Quick Suggestion Chips */}
        <View style={styles.quickPromptsSection}>
          <Text style={styles.quickPromptsHeader}>SUGGESTED QUESTIONS:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsRow}>
            {QUICK_PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                onPress={() => handleSendMessage(prompt)}
                activeOpacity={0.7}
              >
                <Text style={styles.promptChipText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat Conversation History */}
        <View style={styles.chatSection}>
          <Text style={styles.previewLabel}>LIVE CONVERSATION</Text>
          <View style={styles.chatContainer}>
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'ai' ? styles.aiBubble : styles.userBubble,
                  Shadows.sm,
                ]}
              >
                <View style={styles.messageHeader}>
                  {msg.sender === 'ai' ? (
                    <Sparkles size={12} color={Colors.primary} strokeWidth={2} />
                  ) : (
                    <User size={12} color={Colors.white} strokeWidth={2} />
                  )}
                  <Text
                    style={[
                      styles.messageLabel,
                      msg.sender === 'ai' ? { color: Colors.primaryDark } : { color: Colors.white },
                    ]}
                  >
                    {msg.sender === 'ai' ? 'Bloom AI' : 'You'} • {msg.timestamp}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'ai' ? { color: Colors.darkText } : { color: Colors.white },
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}

            {/* Thinking Indicator */}
            {isTyping && (
              <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.typingText}>Bloom AI is thinking...</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Interactive Chat Input Bar */}
      <View style={[styles.inputBar, Shadows.md]}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message to Bloom AI..."
            placeholderTextColor={Colors.mutedText}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendMessage()}
            returnKeyType="send"
            editable={!isTyping}
          />
          <TouchableOpacity
            style={styles.micButton}
            activeOpacity={0.7}
            onPress={handleMicPress}
          >
            <Mic size={18} color={Colors.primary} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
          activeOpacity={0.7}
          onPress={() => handleSendMessage()}
          disabled={!inputText.trim() || isTyping}
        >
          <Send size={18} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22C55E',
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  headerTitle: {
    ...Typography.h1,
    fontSize: 22,
    marginBottom: 2,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.mutedText,
    textAlign: 'center',
  },
  characterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  characterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  characterIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.mint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  characterTitle: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.darkText,
  },
  characterDesc: {
    ...Typography.caption,
    color: Colors.mutedText,
    fontSize: 11,
  },
  personalityMenu: {
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  personalityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  personalityItemActive: {
    backgroundColor: Colors.lightSage,
  },
  personalityText: {
    ...Typography.bodySmall,
    color: Colors.darkText,
  },
  personalityTextActive: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  quickPromptsSection: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  quickPromptsHeader: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.mutedText,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  promptsRow: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
  },
  promptChip: {
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.lightSage,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
  },
  promptChipText: {
    ...Typography.caption,
    color: Colors.primaryDark,
    fontWeight: '600',
    fontSize: 12,
  },
  chatSection: {
    paddingHorizontal: Spacing.xl,
  },
  previewLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.mutedText,
    marginBottom: Spacing.sm,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  chatContainer: {
    gap: Spacing.md,
  },
  messageBubble: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    maxWidth: '88%',
  },
  aiBubble: {
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    ...Typography.caption,
    color: Colors.mutedText,
    fontStyle: 'italic',
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
    lineHeight: 20,
  },
  inputBar: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
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
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    color: Colors.darkText,
    paddingVertical: 4,
  },
  micButton: {
    padding: 4,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.mutedText,
    opacity: 0.6,
  },
});
