import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Menu,
  RotateCcw,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Sparkles,
  ArrowRight,
  Heart,
  Leaf,
  Timer,
  MessageSquare,
  X,
  Radio,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import {
  MascotState,
  ChatMessage,
  INITIAL_SUGGESTIONS,
  ConversationThread,
  generateCompanionResponse,
  detectEmotionFromContext,
  getFormattedTime,
} from '../../services/aiCompanionService';
import { speechService } from '../../services/speechService';
import { AnimatedMascot } from '../../components/ai/AnimatedMascot';
import { SidebarDrawer } from '../../components/ai/SidebarDrawer';
import { StudySprintCard } from '../../components/ai/StudySprintCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SAMPLE_VOICE_PROMPTS = [
  "I'm feeling really anxious about my finals",
  "Help me focus with a 20-minute study sprint",
  "Can we do a gentle box-breathing exercise?",
  "How can I pace my study time today without burnout?",
];

export default function AICompanionScreen() {
  const insets = useSafeAreaInsets();

  // State
  const [mascotState, setMascotState] = useState<MascotState>('IDLE');
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(true); // Spoken audio playback enabled
  const [isListening, setIsListening] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [activeSpeechText, setActiveSpeechText] = useState<string>(
    "Hello! 🌱 I'm Bloom. Tap me, speak into the mic, or type below. I'm right here with you."
  );
  const [activeSpeaker, setActiveSpeaker] = useState<'ai' | 'user'>('ai');
  const [activeSteps, setActiveSteps] = useState<any[] | null>(null);
  const [showSprintWidget, setShowSprintWidget] = useState<boolean>(false);
  const [sprintTopic, setSprintTopic] = useState<string>('Focus Sprint');
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "I'm feeling stressed",
    'Help me focus',
    "Let's talk",
  ]);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(undefined);

  // Mobile voice prompt sheet (when native web speech recognition is unavailable in Expo Go)
  const [mobileVoiceModalVisible, setMobileVoiceModalVisible] = useState<boolean>(false);
  const [voiceWaveAnim] = useState(new Animated.Value(0.3));

  // Voice waveform pulse animation
  useEffect(() => {
    if (isListening || mobileVoiceModalVisible) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(voiceWaveAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(voiceWaveAnim, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [isListening, mobileVoiceModalVisible, voiceWaveAnim]);

  // Process and deliver AI response
  const processInput = async (userInput: string) => {
    const trimmed = userInput.trim();
    if (!trimmed) return;

    // Stop any ongoing speech
    await speechService.stopSpeaking();

    // Show user message in dialogue
    setActiveSpeaker('user');
    setActiveSpeechText(trimmed);
    setInputText('');

    // Emotional reaction based on user query
    const emotion = detectEmotionFromContext(trimmed);
    setMascotState('THINKING');

    try {
      const response = await generateCompanionResponse(trimmed);

      // Transition to speaking
      setActiveSpeaker('ai');
      setActiveSpeechText(response.text);
      setActiveSteps(response.steps || null);
      setShowSprintWidget(!!response.showSprintWidget);
      if (response.sprintTopic) setSprintTopic(response.sprintTopic);
      if (response.quickReplies) setQuickReplies(response.quickReplies);

      if (isVoiceMode) {
        setMascotState('SPEAKING');
        await speechService.speak(
          response.text,
          () => {
            setMascotState('SPEAKING');
          },
          () => {
            // Settle into appropriate resting emotion (COMFORTING or IDLE)
            setMascotState(response.emotion === 'COMFORTING' ? 'COMFORTING' : 'IDLE');
          },
          () => {
            setMascotState('IDLE');
          }
        );
      } else {
        // Voice muted
        setMascotState(response.emotion || 'IDLE');
      }
    } catch {
      setActiveSpeaker('ai');
      setActiveSpeechText("I'm right here with you 🌱. Take a gentle breath and let's take this one step at a time.");
      setMascotState('COMFORTING');
    }
  };

  // Toggle Voice Listening (Speech Recognition)
  const handleToggleListening = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setMascotState('IDLE');
      return;
    }

    // Stop speaking if mascot was talking
    speechService.stopSpeaking();

    setIsListening(true);
    setMascotState('LISTENING');
    setActiveSpeaker('ai');
    setActiveSpeechText("I'm listening softly... speak whenever you're ready 🌱");

    const started = speechService.startListening({
      onStart: () => {
        setIsListening(true);
        setMascotState('LISTENING');
      },
      onResult: (transcript: string) => {
        setIsListening(false);
        if (transcript.trim()) {
          processInput(transcript);
        } else {
          setMascotState('IDLE');
        }
      },
      onError: (errorMsg: string) => {
        setIsListening(false);
        if (errorMsg === 'MOBILE_EXPO_GO_VOICE') {
          // On mobile Expo Go, open the voice companion sheet
          setMobileVoiceModalVisible(true);
          setMascotState('LISTENING');
        } else {
          setMascotState('IDLE');
          setActiveSpeechText(`Mic note: ${errorMsg}`);
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (!started && Platform.OS !== 'web') {
      setIsListening(false);
      setMobileVoiceModalVisible(true);
      setMascotState('LISTENING');
    }
  };

  // Interrupt / Stop AI Speech
  const handleInterruptSpeech = async () => {
    await speechService.stopSpeaking();
    setMascotState('IDLE');
  };

  // New Chat action
  const handleNewChat = async () => {
    await speechService.stopSpeaking();
    setActiveThreadId(undefined);
    setActiveSpeaker('ai');
    setActiveSpeechText("Fresh reflection space 🌱 How are you feeling right now?");
    setActiveSteps(null);
    setShowSprintWidget(false);
    setQuickReplies(["I'm feeling stressed", 'Help me focus', "Let's talk"]);
    setMascotState('HAPPY');
    setTimeout(() => setMascotState('IDLE'), 1800);
  };

  // Select past thread
  const handleSelectThread = async (thread: ConversationThread) => {
    await speechService.stopSpeaking();
    setActiveThreadId(thread.id);
    const lastMsg = thread.messages[thread.messages.length - 1];
    if (lastMsg) {
      setActiveSpeaker(lastMsg.sender);
      setActiveSpeechText(lastMsg.text);
      setActiveSteps(lastMsg.steps || null);
      setShowSprintWidget(!!lastMsg.showSprintWidget);
      if (lastMsg.sprintTopic) setSprintTopic(lastMsg.sprintTopic);
      if (lastMsg.quickReplies) setQuickReplies(lastMsg.quickReplies);
      setMascotState(lastMsg.emotion || 'IDLE');
    }
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

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Controls Bar */}
        <View style={[styles.topBar, { paddingTop: topInset }]}>
          <View style={styles.topBarContent}>
            {/* Left: Menu */}
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => setSidebarOpen(true)}
              activeOpacity={0.7}
              accessibilityLabel="Open sidebar menu"
            >
              <Menu size={22} color="#D2E3DB" strokeWidth={2} />
            </TouchableOpacity>

            {/* Center Title */}
            <View style={styles.brandTitleGroup}>
              <Text style={styles.brandTitleText}>BLOOM AI</Text>
              <View style={styles.brandSubRow}>
                <View
                  style={[
                    styles.statusIndicatorDot,
                    {
                      backgroundColor:
                        mascotState === 'SPEAKING'
                          ? '#64D2B4'
                          : mascotState === 'LISTENING'
                          ? '#78B29C'
                          : '#B8EEDA',
                    },
                  ]}
                />
                <Text style={styles.brandSubText}>
                  {mascotState === 'SPEAKING'
                    ? 'Speaking softly'
                    : mascotState === 'LISTENING'
                    ? 'Listening...'
                    : mascotState === 'THINKING'
                    ? 'Reflecting...'
                    : 'Serene companion'}
                </Text>
              </View>
            </View>

            {/* Right: Audio Toggle & Reset */}
            <View style={styles.topRightControls}>
              <TouchableOpacity
                style={[styles.topButton, isVoiceMode && styles.topButtonActive]}
                onPress={() => {
                  const nextState = !isVoiceMode;
                  setIsVoiceMode(nextState);
                  if (!nextState) speechService.stopSpeaking();
                }}
                activeOpacity={0.7}
                accessibilityLabel={isVoiceMode ? 'Mute voice' : 'Enable voice'}
              >
                {isVoiceMode ? (
                  <Volume2 size={19} color="#B8EEDA" strokeWidth={2} />
                ) : (
                  <VolumeX size={19} color="#7D8E86" strokeWidth={2} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.topButton}
                onPress={handleNewChat}
                activeOpacity={0.7}
                accessibilityLabel="Restart conversation"
              >
                <RotateCcw size={18} color="#D2E3DB" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Centerpiece Stage: Animated Interactive Mascot */}
        <ScrollView
          style={styles.centerStageScroll}
          contentContainerStyle={styles.centerStageContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Animated Mascot */}
          <View style={styles.mascotContainer}>
            <AnimatedMascot
              state={mascotState}
              size={Math.min(200, SCREEN_WIDTH * 0.48)}
              onTap={() => {
                setMascotState('HAPPY');
                setTimeout(() => setMascotState('IDLE'), 2800);
              }}
            />
          </View>

          {/* Dynamic Dialogue Glass Card */}
          <View style={styles.dialogueGlassCard}>
            <View style={styles.dialogueHeader}>
              <View style={styles.dialogueSpeakerBadge}>
                <Sparkles size={13} color="#B8EEDA" strokeWidth={2} />
                <Text style={styles.dialogueSpeakerText}>
                  {activeSpeaker === 'ai' ? 'Bloom' : 'You'}
                </Text>
              </View>

              {/* Interrupt / Stop Button when Speaking */}
              {mascotState === 'SPEAKING' && (
                <TouchableOpacity
                  style={styles.interruptButton}
                  onPress={handleInterruptSpeech}
                  activeOpacity={0.8}
                >
                  <Square size={10} color="#FFDAD6" fill="#FFDAD6" />
                  <Text style={styles.interruptText}>Pause Voice</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Speech Prose */}
            <Text style={styles.dialogueBodyText}>{activeSpeechText}</Text>

            {/* Structured Steps if present */}
            {activeSteps && activeSteps.length > 0 && (
              <View style={styles.stepsContainer}>
                {activeSteps.map((st) => (
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

            {/* Interactive Focus Sprint Card if present */}
            {showSprintWidget && (
              <View style={styles.sprintCardWrapper}>
                <StudySprintCard topic={sprintTopic} initialMinutes={20} />
              </View>
            )}

            {/* Quick Action Suggestion Pills */}
            {quickReplies && quickReplies.length > 0 && (
              <View style={styles.quickRepliesRow}>
                {quickReplies.map((reply, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.quickReplyPill}
                    onPress={() => processInput(reply)}
                    activeOpacity={0.7}
                  >
                    <Leaf size={11} color="#B8EEDA" strokeWidth={2} />
                    <Text style={styles.quickReplyPillText}>{reply}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Spacer */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* Bottom Interactive Dock */}
        <View
          style={[
            styles.bottomDock,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <View style={styles.dockInner}>
            {/* Main Glowing Microphone Button */}
            <TouchableOpacity
              style={[
                styles.micLargeButton,
                isListening && styles.micLargeButtonActive,
              ]}
              onPress={handleToggleListening}
              activeOpacity={0.85}
              accessibilityLabel={isListening ? 'Stop listening' : 'Start voice chat'}
            >
              {isListening ? (
                <MicOff size={22} color="#FFFFFF" strokeWidth={2.4} />
              ) : (
                <Mic size={22} color="#FFFFFF" strokeWidth={2.4} />
              )}
            </TouchableOpacity>

            {/* Compact Text Composer Input */}
            <View style={styles.textInputHousing}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask or whisper to Bloom..."
                placeholderTextColor="rgba(210, 227, 219, 0.45)"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => processInput(inputText)}
                returnKeyType="send"
                enablesReturnKeyAutomatically={true}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  inputText.trim().length > 0 && styles.sendButtonActive,
                ]}
                onPress={() => processInput(inputText)}
                disabled={inputText.trim().length === 0}
                activeOpacity={0.8}
              >
                <Send
                  size={15}
                  color={inputText.trim().length > 0 ? '#FFFFFF' : '#52635B'}
                  strokeWidth={2.2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Mobile Voice Input Modal Sheet (Expo Go Helper) */}
      <Modal
        visible={mobileVoiceModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setMobileVoiceModalVisible(false);
          setMascotState('IDLE');
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                <Radio size={18} color="#64D2B4" strokeWidth={2.2} />
                <Text style={styles.modalTitle}>Voice Companion</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setMobileVoiceModalVisible(false);
                  setMascotState('IDLE');
                }}
                style={styles.modalCloseBtn}
              >
                <X size={18} color="#D2E3DB" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Choose a voice thought or speak aloud — Bloom will answer with live spoken voice:
            </Text>

            {/* Waveform indicator */}
            <View style={styles.waveformContainer}>
              <Animated.View
                style={[
                  styles.waveformBar,
                  { height: 32, transform: [{ scaleY: voiceWaveAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveformBar,
                  { height: 48, transform: [{ scaleY: voiceWaveAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveformBar,
                  { height: 24, transform: [{ scaleY: voiceWaveAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveformBar,
                  { height: 42, transform: [{ scaleY: voiceWaveAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveformBar,
                  { height: 28, transform: [{ scaleY: voiceWaveAnim }] },
                ]}
              />
            </View>

            {/* Quick Sample Voice Prompts */}
            <View style={styles.samplePromptsList}>
              {SAMPLE_VOICE_PROMPTS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.samplePromptCard}
                  onPress={() => {
                    setMobileVoiceModalVisible(false);
                    processInput(p);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.samplePromptText}>"{p}"</Text>
                  <ArrowRight size={15} color="#78B29C" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1B', // Deep cosmic midnight botanical background
  },
  keyboardContainer: {
    flex: 1,
  },
  topBar: {
    backgroundColor: 'rgba(11, 14, 27, 0.92)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(91, 142, 125, 0.12)',
    zIndex: 10,
  },
  topBarContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  topButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(25, 33, 49, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButtonActive: {
    backgroundColor: 'rgba(50, 101, 86, 0.65)',
    borderWidth: 1,
    borderColor: '#64D2B4',
  },
  brandTitleGroup: {
    alignItems: 'center',
  },
  brandTitleText: {
    ...Typography.body,
    fontWeight: '800',
    fontSize: 16,
    color: '#F5FFF9',
    letterSpacing: 0.8,
  },
  brandSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  statusIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  brandSubText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#9CD1BE',
    fontWeight: '500',
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  centerStageScroll: {
    flex: 1,
  },
  centerStageContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  mascotContainer: {
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogueGlassCard: {
    width: '100%',
    backgroundColor: 'rgba(18, 25, 40, 0.82)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(120, 178, 156, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
    marginTop: 10,
  },
  dialogueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dialogueSpeakerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(50, 101, 86, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  dialogueSpeakerText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: '#B8EEDA',
  },
  interruptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(186, 26, 26, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 218, 214, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  interruptText: {
    ...Typography.caption,
    fontSize: 10,
    color: '#FFDAD6',
    fontWeight: '700',
  },
  dialogueBodyText: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 24,
    color: '#E3F5EA',
  },
  stepsContainer: {
    backgroundColor: 'rgba(11, 16, 28, 0.65)',
    padding: 12,
    borderRadius: 14,
    gap: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.15)',
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
    backgroundColor: '#326556',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    ...Typography.bodySmall,
    fontSize: 13,
    color: '#D2E3DB',
    flex: 1,
    lineHeight: 18,
  },
  stepTitleBold: {
    fontWeight: '700',
    color: '#B8EEDA',
  },
  sprintCardWrapper: {
    marginTop: 10,
  },
  quickRepliesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(91, 142, 125, 0.12)',
  },
  quickReplyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(30, 42, 60, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(120, 178, 156, 0.25)',
  },
  quickReplyPillText: {
    ...Typography.caption,
    fontSize: 12,
    color: '#D2E3DB',
    fontWeight: '600',
  },
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(11, 14, 27, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(91, 142, 125, 0.12)',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  dockInner: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  micLargeButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#326556',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64D2B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  micLargeButtonActive: {
    backgroundColor: '#BA1A1A',
    shadowColor: '#FFDAD6',
  },
  textInputHousing: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 29, 46, 0.9)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.2)',
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 14,
    color: '#F5FFF9',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(35, 47, 70, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#326556',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#121828',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(120, 178, 156, 0.25)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    ...Typography.body,
    fontSize: 16,
    fontWeight: '700',
    color: '#F5FFF9',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSubtitle: {
    ...Typography.caption,
    fontSize: 13,
    color: '#9CD1BE',
    lineHeight: 18,
    marginBottom: 16,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    marginBottom: 16,
  },
  waveformBar: {
    width: 5,
    borderRadius: 3,
    backgroundColor: '#64D2B4',
  },
  samplePromptsList: {
    gap: 8,
    marginBottom: 12,
  },
  samplePromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(23, 33, 52, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.2)',
  },
  samplePromptText: {
    ...Typography.bodySmall,
    color: '#E3F5EA',
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },
});
