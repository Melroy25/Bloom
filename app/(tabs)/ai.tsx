import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Menu,
  RotateCcw,
  Send,
  Mic,
  Plus,
  ArrowRight,
  ArrowUp,
  Leaf,
  Timer,
  MessageSquare,
  ThumbsUp,
  Copy,
  Check,
  BookOpen,
  Wind,
  Calendar,
  Sparkles,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import {
  ChatMessage,
  INITIAL_SUGGESTIONS,
  RECENT_CHECK_INS,
  ConversationThread,
  generateCompanionResponse,
  getFormattedTime,
} from '../../services/aiCompanionService';
import { SidebarDrawer } from '../../components/ai/SidebarDrawer';
import { StudySprintCard } from '../../components/ai/StudySprintCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_DESKTOP = Platform.OS === 'web' && SCREEN_WIDTH > 768;

export default function AICompanionScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(undefined);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessageIds, setLikedMessageIds] = useState<Record<string, boolean>>({});

  const scrollViewRef = useRef<any>(null);

  // Floating mascot animation in empty state
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [floatAnim]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    setInputText('');

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const companionReply = await generateCompanionResponse(text);
      setMessages((prev) => [...prev, companionReply]);
    } catch {
      const fallbackReply: ChatMessage = {
        id: 'fallback-' + Date.now(),
        sender: 'ai',
        text: "I'm right here with you 🌱. Take a gentle breath and let's take this one step at a time.",
        timestamp: getFormattedTime(),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveThreadId(undefined);
    setInputText('');
  };

  const handleSelectThread = (thread: ConversationThread) => {
    setActiveThreadId(thread.id);
    setMessages(thread.messages);
  };

  const handleCopyMessage = (id: string, text: string) => {
    setCopiedMessageId(id);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  const toggleLikeMessage = (id: string) => {
    setLikedMessageIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);

  return (
    <View style={styles.container}>
      {/* Sidebar Drawer */}
      <SidebarDrawer
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectThread={handleSelectThread}
        activeThreadId={activeThreadId}
      />

      {/* Main App Container */}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header Bar */}
        <View style={[styles.headerBar, { paddingTop: topInset }]}>
          <View style={styles.headerContent}>
            {/* Left: Menu & Mascot Avatar */}
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setSidebarOpen(true)}
                activeOpacity={0.7}
                accessibilityLabel="Open sidebar menu"
              >
                <Menu size={22} color={Colors.darkText} strokeWidth={2} />
              </TouchableOpacity>

              <View style={styles.headerTitleGroup}>
                <View style={styles.mascotAvatarSmall}>
                  <Image
                    source={require('../../assets/bloom-mascot.png')}
                    style={styles.mascotImgSmall}
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <View style={styles.brandTitleRow}>
                    <Text style={styles.brandTitleText}>Bloom</Text>
                    <View style={styles.onlineDot} />
                  </View>
                  <Text style={styles.brandSubtitleText}>Gentle pacing</Text>
                </View>
              </View>
            </View>

            {/* Right: Focus Space Pill & Reset */}
            <View style={styles.headerRight}>
              <View style={styles.focusSpaceBadge}>
                <View style={styles.focusPulseDot} />
                <Text style={styles.focusSpaceText}>Focus Space</Text>
              </View>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleNewChat}
                activeOpacity={0.7}
                accessibilityLabel="Start fresh chat"
              >
                <RotateCcw size={18} color={Colors.mutedText} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Chat / Content Viewport */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            messages.length === 0 && styles.scrollContentEmpty,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            /* EMPTY CHAT STATE */
            <View style={styles.emptyStateContainer}>
              {/* Floating Center Mascot */}
              <View style={styles.mascotWrapper}>
                <View style={styles.haloGlow} />
                <Animated.View
                  style={[
                    styles.mascotAnimatedContainer,
                    { transform: [{ translateY: floatAnim }] },
                  ]}
                >
                  <Image
                    source={require('../../assets/bloom-mascot.png')}
                    style={styles.mascotLarge}
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>

              {/* Welcome Headlines */}
              <View style={styles.welcomeTextGroup}>
                <Text style={styles.welcomeTitle}>Hey, I'm Bloom 🌱</Text>
                <Text style={styles.welcomeSubtitle}>
                  Your gentle companion to reflect, unwind, and study mindfully.
                </Text>
              </View>

              {/* Gentle Ways to Begin Section */}
              <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionsHeader}>
                  <Text style={styles.suggestionsLabel}>Gentle ways to begin</Text>
                  <View style={styles.tapToStartPill}>
                    <Sparkles size={12} color={Colors.primary} strokeWidth={2} />
                    <Text style={styles.tapToStartText}>Tap to start</Text>
                  </View>
                </View>

                {INITIAL_SUGGESTIONS.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestionCard}
                    onPress={() => handlePromptSelect(item.prompt)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.suggestionLeft}>
                      <View style={styles.suggestionIconBox}>
                        {item.icon === 'spa' && (
                          <Leaf size={18} color={Colors.primaryDark} strokeWidth={2} />
                        )}
                        {item.icon === 'timer' && (
                          <Timer size={18} color="#45617A" strokeWidth={2} />
                        )}
                        {item.icon === 'chat' && (
                          <MessageSquare size={18} color="#505F59" strokeWidth={2} />
                        )}
                      </View>
                      <View style={styles.suggestionTextGroup}>
                        <Text style={styles.suggestionTitle}>{item.title}</Text>
                        <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
                      </View>
                    </View>
                    <ArrowRight size={17} color={Colors.lightText} strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            /* ACTIVE CONVERSATION STREAM */
            <View style={styles.chatThread}>
              {/* Day Divider */}
              <View style={styles.dayDivider}>
                <View style={styles.dayDividerBadge}>
                  <Text style={styles.dayDividerText}>Today, Nov 12</Text>
                </View>
              </View>

              {/* Messages */}
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    msg.sender === 'user' ? styles.userRow : styles.aiRow,
                  ]}
                >
                  {/* AI Avatar */}
                  {msg.sender === 'ai' && (
                    <View style={styles.aiBubbleAvatar}>
                      <Image
                        source={require('../../assets/bloom-mascot.png')}
                        style={styles.aiAvatarImg}
                        resizeMode="contain"
                      />
                    </View>
                  )}

                  {/* Message Bubble Container */}
                  <View
                    style={[
                      styles.messageBubble,
                      msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
                    ]}
                  >
                    {/* Message Body Text */}
                    <Text
                      style={[
                        styles.messageText,
                        msg.sender === 'user' ? styles.userText : styles.aiText,
                      ]}
                    >
                      {msg.text}
                    </Text>

                    {/* Optional Structured Steps */}
                    {msg.steps && msg.steps.length > 0 && (
                      <View style={styles.stepsContainer}>
                        {msg.steps.map((st) => (
                          <View key={st.stepNumber} style={styles.stepRow}>
                            <View style={styles.stepBadge}>
                              <Text style={styles.stepBadgeText}>{st.stepNumber}</Text>
                            </View>
                            <Text style={styles.stepText}>
                              <Text style={styles.stepTitleBold}>{st.title} </Text>
                              {st.detail}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Optional Interactive Study Sprint Timer Card */}
                    {msg.showSprintWidget && (
                      <StudySprintCard
                        topic={msg.sprintTopic}
                        initialMinutes={msg.sprintMinutes || 20}
                      />
                    )}

                    {/* AI Message Action Footer */}
                    {msg.sender === 'ai' && (
                      <View style={styles.aiFooterRow}>
                        <Text style={styles.timestampText}>{msg.timestamp}</Text>
                        <View style={styles.aiActionButtons}>
                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => toggleLikeMessage(msg.id)}
                            activeOpacity={0.7}
                            accessibilityLabel="Helpful"
                          >
                            <ThumbsUp
                              size={14}
                              color={likedMessageIds[msg.id] ? Colors.primary : Colors.mutedText}
                              strokeWidth={1.8}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => handleCopyMessage(msg.id, msg.text)}
                            activeOpacity={0.7}
                            accessibilityLabel="Copy response"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check size={14} color={Colors.primary} strokeWidth={2} />
                            ) : (
                              <Copy size={14} color={Colors.mutedText} strokeWidth={1.8} />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* User Timestamp */}
                    {msg.sender === 'user' && (
                      <Text style={styles.userTimestampText}>{msg.timestamp}</Text>
                    )}

                    {/* Quick Reply Pills */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <View style={styles.quickRepliesContainer}>
                        {msg.quickReplies.map((reply, idx) => (
                          <TouchableOpacity
                            key={idx}
                            style={styles.quickReplyPill}
                            onPress={() => handlePromptSelect(reply)}
                            activeOpacity={0.7}
                          >
                            <Sparkles size={12} color={Colors.primary} strokeWidth={2} />
                            <Text style={styles.quickReplyText}>{reply}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {/* Typing / Thinking Indicator */}
              {isTyping && (
                <View style={[styles.messageRow, styles.aiRow]}>
                  <View style={styles.aiBubbleAvatar}>
                    <Image
                      source={require('../../assets/bloom-mascot.png')}
                      style={styles.aiAvatarImg}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
                    <Sparkles size={14} color={Colors.primary} strokeWidth={2} />
                    <Text style={styles.typingText}>Bloom is reflecting with you...</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Bottom spacing to clear composer */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Floating Bottom Message Composer Dock */}
        <View
          style={[
            styles.composerDock,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={styles.composerWrapper}>
            {/* Plus / Add Action */}
            <TouchableOpacity
              style={styles.plusButton}
              activeOpacity={0.7}
              onPress={() => handleSendMessage("Can we focus on my priorities today?")}
              accessibilityLabel="Quick reflection"
            >
              <Plus size={19} color={Colors.mutedText} strokeWidth={2.2} />
            </TouchableOpacity>

            {/* Text Input */}
            <TextInput
              style={styles.composerInput}
              placeholder="Ask Bloom anything..."
              placeholderTextColor={Colors.lightText}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSendMessage()}
              returnKeyType="send"
              enablesReturnKeyAutomatically={true}
            />

            {/* Mic Voice Trigger */}
            <TouchableOpacity
              style={styles.micButton}
              activeOpacity={0.7}
              onPress={() => handleSendMessage("I'd like to do a voice reflection")}
              accessibilityLabel="Voice reflection"
            >
              <Mic size={18} color={Colors.primary} strokeWidth={2} />
            </TouchableOpacity>

            {/* Send Button */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim().length > 0 && styles.sendButtonActive,
              ]}
              onPress={() => handleSendMessage()}
              activeOpacity={0.8}
              accessibilityLabel="Send message"
            >
              <ArrowUp
                size={18}
                color={inputText.trim().length > 0 ? Colors.white : Colors.mutedText}
                strokeWidth={2.4}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECFEF3',
  },
  keyboardContainer: {
    flex: 1,
  },
  headerBar: {
    backgroundColor: 'rgba(236, 254, 243, 0.94)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(91, 142, 125, 0.1)',
    zIndex: 10,
  },
  headerContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mascotAvatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.15)',
    overflow: 'hidden',
  },
  mascotImgSmall: {
    width: 28,
    height: 28,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandTitleText: {
    ...Typography.body,
    fontWeight: '700',
    color: '#101E18',
    fontSize: 15,
    letterSpacing: -0.2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  brandSubtitleText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.mutedText,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  focusSpaceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E2F3E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  focusPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  focusSpaceText: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 11,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  scrollContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  mascotWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  haloGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(184, 238, 218, 0.35)',
  },
  mascotAnimatedContainer: {
    zIndex: 2,
  },
  mascotLarge: {
    width: 120,
    height: 120,
  },
  welcomeTextGroup: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  welcomeTitle: {
    ...Typography.h1,
    fontSize: 26,
    fontWeight: '700',
    color: '#101E18',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.mutedText,
    textAlign: 'center',
    maxWidth: 300,
  },
  suggestionsContainer: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  suggestionsLabel: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.mutedText,
  },
  tapToStartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tapToStartText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.12)',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  suggestionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  suggestionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF4EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionTextGroup: {
    flex: 1,
  },
  suggestionTitle: {
    ...Typography.body,
    fontWeight: '700',
    fontSize: 14,
    color: '#101E18',
    marginBottom: 2,
  },
  suggestionSubtitle: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.mutedText,
  },
  chatThread: {
    gap: 16,
    paddingTop: 8,
  },
  dayDivider: {
    alignItems: 'center',
    marginVertical: 6,
  },
  dayDividerBadge: {
    backgroundColor: '#E2F0E7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  dayDividerText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.mutedText,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  aiBubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.15)',
    overflow: 'hidden',
    marginTop: 2,
  },
  aiAvatarImg: {
    width: 26,
    height: 26,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 14,
    maxWidth: '86%',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#326556',
    borderTopRightRadius: 4,
    alignSelf: 'flex-end',
  },
  aiBubble: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.12)',
    flex: 1,
  },
  messageText: {
    ...Typography.body,
    fontSize: 14,
    lineHeight: 22,
  },
  userText: {
    color: Colors.white,
  },
  aiText: {
    color: '#101E18',
  },
  userTimestampText: {
    ...Typography.caption,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  aiFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 4,
  },
  timestampText: {
    ...Typography.caption,
    fontSize: 10,
    color: Colors.lightText,
  },
  aiActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIconBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsContainer: {
    backgroundColor: '#F3F8F5',
    padding: 12,
    borderRadius: 14,
    gap: 8,
    marginVertical: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#B8EEDA',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#002018',
  },
  stepText: {
    ...Typography.bodySmall,
    fontSize: 13,
    color: '#101E18',
    flex: 1,
    lineHeight: 18,
  },
  stepTitleBold: {
    fontWeight: '700',
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  quickReplyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF3ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  quickReplyText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  typingText: {
    ...Typography.bodySmall,
    color: Colors.mutedText,
    fontStyle: 'italic',
  },
  composerDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  composerWrapper: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.15)',
    gap: 6,
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F6F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  composerInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    color: '#101E18',
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EBF4EF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E1E9E4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#326556',
  },
});
