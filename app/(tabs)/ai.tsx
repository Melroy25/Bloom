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
  Sparkles,
  Radio,
  X,
  ArrowRight,
  Play,
  Square,
  AlertCircle,
} from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import {
  MascotState,
  ConversationThread,
  generateCompanionResponse,
  detectEmotionFromContext,
} from '../../services/aiCompanionService';
import { speechService } from '../../services/speechService';
import { AnimatedMascot } from '../../components/ai/AnimatedMascot';
import { SidebarDrawer } from '../../components/ai/SidebarDrawer';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SAMPLE_VOICE_PROMPTS = [
  "I'm feeling anxious about finals",
  "Help me focus with a 20-min sprint",
  "Can we do a gentle breathing reset?",
  "How can I pace my study time today?",
];

export default function AICompanionScreen() {
  const insets = useSafeAreaInsets();

  // State
  const [mascotState, setMascotState] = useState<MascotState>('IDLE');
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(true); // Voice spoken output toggle
  const [isListening, setIsListening] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [recentUserQuery, setRecentUserQuery] = useState<string | null>(null);
  const [activeResponseText, setActiveResponseText] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>(undefined);

  // Mobile voice modal (fallback for Expo Go when Web Speech API is absent)
  const [mobileVoiceModalVisible, setMobileVoiceModalVisible] = useState<boolean>(false);
  const [voiceWaveAnim] = useState(new Animated.Value(0.3));

  // Stop speech if screen unmounts
  useEffect(() => {
    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
    };
  }, []);

  // Voice wave animation for listening modal
  useEffect(() => {
    if (isListening || mobileVoiceModalVisible) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(voiceWaveAnim, {
            toValue: 1,
            duration: 380,
            useNativeDriver: true,
          }),
          Animated.timing(voiceWaveAnim, {
            toValue: 0.3,
            duration: 380,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [isListening, mobileVoiceModalVisible, voiceWaveAnim]);

  // Main processing pipeline for user input
  const processMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Unlock browser audio policy immediately on user gesture
    speechService.unlockAudio();
    await speechService.stopSpeaking();

    setRecentUserQuery(trimmed);
    setInputText('');
    setSpeechError(null);

    // Emotional reaction & Thinking state
    const targetEmotion = detectEmotionFromContext(trimmed);
    setMascotState('THINKING');

    try {
      const response = await generateCompanionResponse(trimmed);
      setActiveResponseText(response.text);

      if (isVoiceMode) {
        setMascotState('SPEAKING');

        await speechService.speak(
          response.text,
          () => {
            setMascotState('SPEAKING');
          },
          () => {
            setMascotState(response.emotion === 'COMFORTING' ? 'COMFORTING' : 'IDLE');
          },
          (err) => {
            console.warn('[AI Screen] Speech playback note:', err);
            setMascotState(response.emotion || 'IDLE');
            setSpeechError('Audio tap required by browser. Tap replay.');
          }
        );
      } else {
        // Voice mode off
        setMascotState(response.emotion || 'IDLE');
      }
    } catch {
      setActiveResponseText("I'm right here with you 🌱. Take a gentle breath and let's take this one step at a time.");
      setMascotState('COMFORTING');
    }
  };

  // Toggle Microphone
  const handleToggleListening = () => {
    speechService.unlockAudio();

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setMascotState('IDLE');
      return;
    }

    speechService.stopSpeaking();
    setIsListening(true);
    setMascotState('LISTENING');

    const started = speechService.startListening({
      onStart: () => {
        setIsListening(true);
        setMascotState('LISTENING');
      },
      onResult: (transcript: string) => {
        setIsListening(false);
        if (transcript.trim()) {
          processMessage(transcript);
        } else {
          setMascotState('IDLE');
        }
      },
      onError: (errorMsg: string) => {
        setIsListening(false);
        if (errorMsg === 'MOBILE_EXPO_GO_VOICE') {
          setMobileVoiceModalVisible(true);
          setMascotState('LISTENING');
        } else {
          setMascotState('IDLE');
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

  // Replay speech audio
  const handleReplaySpeech = async () => {
    if (!activeResponseText) return;
    speechService.unlockAudio();
    setMascotState('SPEAKING');
    setSpeechError(null);

    await speechService.speak(
      activeResponseText,
      () => setMascotState('SPEAKING'),
      () => setMascotState('IDLE'),
      (err) => {
        setMascotState('IDLE');
        setSpeechError('Could not play audio. Tap again.');
      }
    );
  };

  // Stop / Pause audio
  const handleStopSpeech = async () => {
    await speechService.stopSpeaking();
    setMascotState('IDLE');
  };

  // Restart / New Chat
  const handleNewChat = async () => {
    speechService.unlockAudio();
    await speechService.stopSpeaking();
    setActiveThreadId(undefined);
    setRecentUserQuery(null);
    setActiveResponseText(null);
    setSpeechError(null);
    setMascotState('HAPPY');
    setTimeout(() => setMascotState('IDLE'), 2000);
  };

  // Select Thread
  const handleSelectThread = async (thread: ConversationThread) => {
    speechService.unlockAudio();
    await speechService.stopSpeaking();
    setActiveThreadId(thread.id);
    const lastMsg = thread.messages[thread.messages.length - 1];
    if (lastMsg) {
      setActiveResponseText(lastMsg.text);
      setMascotState(lastMsg.emotion || 'IDLE');
    }
  };

  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);

  // Mascot sizing dynamically scales to occupy focal center stage
  const mascotDisplaySize = Math.min(270, Math.max(220, SCREEN_WIDTH * 0.62));

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
        {/* Compact Header Bar */}
        <View style={[styles.topBar, { paddingTop: topInset }]}>
          <View style={styles.topBarContent}>
            {/* Left: Menu */}
            <TouchableOpacity
              style={styles.topButton}
              onPress={() => {
                speechService.unlockAudio();
                setSidebarOpen(true);
              }}
              activeOpacity={0.7}
              accessibilityLabel="Open sidebar menu"
            >
              <Menu size={20} color="#D2E3DB" strokeWidth={2} />
            </TouchableOpacity>

            {/* Center: Branding */}
            <View style={styles.brandGroup}>
              <Text style={styles.brandTitle}>BLOOM AI</Text>
              <Text style={styles.brandSub}>Mindful Companion</Text>
            </View>

            {/* Right: Speaker Audio Toggle & Reset */}
            <View style={styles.topRightControls}>
              <TouchableOpacity
                style={[
                  styles.topButton,
                  isVoiceMode && styles.topButtonActive,
                  mascotState === 'SPEAKING' && styles.topButtonSpeaking,
                ]}
                onPress={() => {
                  speechService.unlockAudio();
                  if (mascotState === 'SPEAKING') {
                    handleStopSpeech();
                  } else {
                    const next = !isVoiceMode;
                    setIsVoiceMode(next);
                    if (!next) speechService.stopSpeaking();
                  }
                }}
                activeOpacity={0.7}
                accessibilityLabel={
                  mascotState === 'SPEAKING'
                    ? 'Stop speaking'
                    : isVoiceMode
                    ? 'Mute speech'
                    : 'Enable speech'
                }
              >
                {mascotState === 'SPEAKING' ? (
                  <Square size={14} color="#B8EEDA" fill="#B8EEDA" />
                ) : isVoiceMode ? (
                  <Volume2 size={18} color="#B8EEDA" strokeWidth={2.2} />
                ) : (
                  <VolumeX size={18} color="#6C7A72" strokeWidth={2} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.topButton}
                onPress={handleNewChat}
                activeOpacity={0.7}
                accessibilityLabel="Restart companion"
              >
                <RotateCcw size={17} color="#D2E3DB" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Center Stage: Animated Interactive Mascot */}
        <View style={styles.centerStage}>
          {/* Prominent Center Mascot */}
          <View style={styles.mascotWrapper}>
            <AnimatedMascot
              state={mascotState}
              size={mascotDisplaySize}
              onTap={() => {
                speechService.unlockAudio();
                setMascotState('HAPPY');
                setTimeout(() => setMascotState('IDLE'), 2800);
              }}
            />
          </View>

          {/* Compact Response Area (Only appears when there is active speech or thoughts) */}
          {activeResponseText ? (
            <View style={styles.compactResponseCard}>
              <View style={styles.compactResponseHeader}>
                <View style={styles.responseSpeakerTag}>
                  <Sparkles size={12} color="#B8EEDA" strokeWidth={2} />
                  <Text style={styles.responseSpeakerText}>Bloom</Text>
                </View>

                {/* Audio controls for response */}
                <View style={styles.responseAudioControls}>
                  {mascotState === 'SPEAKING' ? (
                    <TouchableOpacity
                      style={styles.responseActionBtn}
                      onPress={handleStopSpeech}
                      activeOpacity={0.7}
                    >
                      <Square size={11} color="#FFDAD6" fill="#FFDAD6" />
                      <Text style={styles.responseActionBtnText}>Pause</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.responseActionBtn}
                      onPress={handleReplaySpeech}
                      activeOpacity={0.7}
                    >
                      <Play size={11} color="#B8EEDA" fill="#B8EEDA" />
                      <Text style={styles.responseActionBtnText}>Replay Voice</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Response Text */}
              <ScrollView
                style={styles.responseScroll}
                contentContainerStyle={styles.responseScrollContent}
                showsVerticalScrollIndicator={true}
              >
                {recentUserQuery && (
                  <Text style={styles.userQueryPreview}>
                    You: "{recentUserQuery}"
                  </Text>
                )}
                <Text style={styles.responseBodyText}>{activeResponseText}</Text>
              </ScrollView>

              {/* Error note if audio was blocked */}
              {speechError && (
                <View style={styles.speechErrorRow}>
                  <AlertCircle size={12} color="#F472B6" />
                  <Text style={styles.speechErrorText}>{speechError}</Text>
                </View>
              )}
            </View>
          ) : (
            /* Subtitle prompt when idle */
            <View style={styles.idleHintContainer}>
              <Text style={styles.idleHintTitle}>Hey, I'm Bloom 🌱</Text>
              <Text style={styles.idleHintSubtitle}>
                Tap me, speak into the mic, or type a thought below.
              </Text>
            </View>
          )}
        </View>

        {/* Compact Bottom Message Composer */}
        <View
          style={[
            styles.composerBar,
            { paddingBottom: Math.max(insets.bottom, 10) },
          ]}
        >
          <View style={styles.composerInner}>
            {/* Microphone Button */}
            <TouchableOpacity
              style={[
                styles.micBtn,
                isListening && styles.micBtnActive,
              ]}
              onPress={handleToggleListening}
              activeOpacity={0.85}
              accessibilityLabel={isListening ? 'Stop recording' : 'Voice check-in'}
            >
              {isListening ? (
                <MicOff size={20} color="#FFFFFF" strokeWidth={2.4} />
              ) : (
                <Mic size={20} color="#FFFFFF" strokeWidth={2.4} />
              )}
            </TouchableOpacity>

            {/* Text Input Housing */}
            <View style={styles.inputHousing}>
              <TextInput
                style={styles.textInput}
                placeholder="Talk or whisper to Bloom..."
                placeholderTextColor="rgba(210, 227, 219, 0.45)"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => processMessage(inputText)}
                returnKeyType="send"
                enablesReturnKeyAutomatically={true}
              />

              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  inputText.trim().length > 0 && styles.sendBtnActive,
                ]}
                onPress={() => processMessage(inputText)}
                disabled={inputText.trim().length === 0}
                activeOpacity={0.8}
                accessibilityLabel="Send message"
              >
                <Send
                  size={15}
                  color={inputText.trim().length > 0 ? '#FFFFFF' : '#4E5F57'}
                  strokeWidth={2.4}
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
              Select a thought to speak with Bloom — response will be spoken aloud:
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
                  { height: 50, transform: [{ scaleY: voiceWaveAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveformBar,
                  { height: 26, transform: [{ scaleY: voiceWaveAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveformBar,
                  { height: 44, transform: [{ scaleY: voiceWaveAnim }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveformBar,
                  { height: 30, transform: [{ scaleY: voiceWaveAnim }] },
                ]}
              />
            </View>

            {/* Quick Prompts */}
            <View style={styles.samplePromptsList}>
              {SAMPLE_VOICE_PROMPTS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.samplePromptCard}
                  onPress={() => {
                    setMobileVoiceModalVisible(false);
                    processMessage(p);
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
    backgroundColor: 'rgba(11, 14, 27, 0.94)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(91, 142, 125, 0.12)',
    zIndex: 10,
  },
  topBarContent: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  topButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(25, 33, 49, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButtonActive: {
    backgroundColor: 'rgba(50, 101, 86, 0.7)',
    borderWidth: 1,
    borderColor: '#64D2B4',
  },
  topButtonSpeaking: {
    backgroundColor: 'rgba(186, 26, 26, 0.4)',
    borderColor: '#FFDAD6',
    borderWidth: 1,
  },
  brandGroup: {
    alignItems: 'center',
  },
  brandTitle: {
    ...Typography.body,
    fontWeight: '800',
    fontSize: 15,
    color: '#F5FFF9',
    letterSpacing: 0.8,
  },
  brandSub: {
    ...Typography.caption,
    fontSize: 10,
    color: '#9CD1BE',
    fontWeight: '500',
    marginTop: 1,
  },
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  centerStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  mascotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  idleHintContainer: {
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 20,
  },
  idleHintTitle: {
    ...Typography.h3,
    fontSize: 18,
    fontWeight: '700',
    color: '#F5FFF9',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  idleHintSubtitle: {
    ...Typography.caption,
    fontSize: 13,
    color: '#9CD1BE',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 18,
  },
  compactResponseCard: {
    width: '100%',
    maxHeight: 180,
    backgroundColor: 'rgba(18, 25, 40, 0.88)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(120, 178, 156, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 12,
  },
  compactResponseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  responseSpeakerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(50, 101, 86, 0.4)',
    paddingHorizontal: 9,
    paddingVertical: 2.5,
    borderRadius: 9999,
  },
  responseSpeakerText: {
    ...Typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: '#B8EEDA',
  },
  responseAudioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  responseActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(25, 36, 54, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(120, 178, 156, 0.3)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999,
  },
  responseActionBtnText: {
    ...Typography.caption,
    fontSize: 10,
    color: '#D2E3DB',
    fontWeight: '600',
  },
  responseScroll: {
    maxHeight: 120,
  },
  responseScrollContent: {
    paddingVertical: 2,
  },
  userQueryPreview: {
    ...Typography.caption,
    fontSize: 11,
    color: '#7B8E86',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  responseBodyText: {
    ...Typography.bodySmall,
    fontSize: 13,
    lineHeight: 20,
    color: '#E3F5EA',
  },
  speechErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  speechErrorText: {
    ...Typography.caption,
    fontSize: 11,
    color: '#F472B6',
  },
  composerBar: {
    backgroundColor: 'rgba(11, 14, 27, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(91, 142, 125, 0.12)',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  composerInner: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#326556',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64D2B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  micBtnActive: {
    backgroundColor: '#BA1A1A',
    shadowColor: '#FFDAD6',
  },
  inputHousing: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 29, 46, 0.92)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.22)',
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    fontSize: 13,
    color: '#F5FFF9',
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(35, 47, 70, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
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
