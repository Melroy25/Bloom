import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Sparkles, Heart, Volume2, Mic, AlertCircle } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { MascotState } from '../../services/aiCompanionService';

interface AnimatedMascotProps {
  state: MascotState;
  onTap?: () => void;
  size?: number;
}

const TAP_MESSAGES = [
  "Hey, I'm here for you! 🌱",
  "You're doing great, take it slow ✨",
  "Remember to breathe and unclench your jaw 🌿",
  "I'm listening anytime you need to talk 💬",
  "Small steps make big journeys 🌸",
];

export function AnimatedMascot({ state = 'IDLE', onTap, size = 240 }: AnimatedMascotProps) {
  const [tapBubbleText, setTapBubbleText] = useState<string | null>(null);
  const [speakingFrame, setSpeakingFrame] = useState<boolean>(false);
  const isTapAnimating = useRef(false);

  // Animated values
  const floatAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const auraScaleAnim = useRef(new Animated.Value(1)).current;
  const ring1Anim = useRef(new Animated.Value(0)).current;
  const ring2Anim = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const bubbleTranslate = useRef(new Animated.Value(10)).current;

  // Track active animation loops
  const activeLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const speakingIntervalRef = useRef<any>(null);

  // Alternating speaking frame toggle when state === 'SPEAKING'
  useEffect(() => {
    if (state === 'SPEAKING') {
      speakingIntervalRef.current = setInterval(() => {
        setSpeakingFrame((prev) => !prev);
      }, 240);
    } else {
      if (speakingIntervalRef.current) {
        clearInterval(speakingIntervalRef.current);
        speakingIntervalRef.current = null;
      }
      setSpeakingFrame(false);
    }

    return () => {
      if (speakingIntervalRef.current) {
        clearInterval(speakingIntervalRef.current);
        speakingIntervalRef.current = null;
      }
    };
  }, [state]);

  // Ambient Twinkling Sparkles Loop
  useEffect(() => {
    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity, {
          toValue: 0.25,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );
    sparkleLoop.start();
    return () => sparkleLoop.stop();
  }, [sparkleOpacity]);

  // Main state-driven animation controller
  useEffect(() => {
    if (activeLoopRef.current) {
      activeLoopRef.current.stop();
      activeLoopRef.current = null;
    }

    // Reset base transforms
    tiltAnim.setValue(0);

    if (state === 'IDLE') {
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -14,
              duration: 2400,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 2400,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(breathAnim, {
              toValue: 1.05,
              duration: 2400,
              useNativeDriver: true,
            }),
            Animated.timing(breathAnim, {
              toValue: 0.97,
              duration: 2400,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(auraScaleAnim, {
              toValue: 1.18,
              duration: 2400,
              useNativeDriver: true,
            }),
            Animated.timing(auraScaleAnim, {
              toValue: 0.94,
              duration: 2400,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      activeLoopRef.current = loop;
      loop.start();
    } else if (state === 'HAPPY') {
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -22,
              duration: 550,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 550,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(tiltAnim, {
              toValue: 0.06,
              duration: 275,
              useNativeDriver: true,
            }),
            Animated.timing(tiltAnim, {
              toValue: -0.06,
              duration: 275,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      activeLoopRef.current = loop;
      loop.start();
    } else if (state === 'LISTENING') {
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -8,
              duration: 1600,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 1600,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(ring1Anim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(ring1Anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.delay(750),
            Animated.timing(ring2Anim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(ring2Anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      activeLoopRef.current = loop;
      loop.start();
    } else if (state === 'THINKING') {
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -10,
              duration: 1900,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 1900,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(tiltAnim, {
              toValue: -0.05,
              duration: 1300,
              useNativeDriver: true,
            }),
            Animated.timing(tiltAnim, {
              toValue: 0.05,
              duration: 1300,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      activeLoopRef.current = loop;
      loop.start();
    } else if (state === 'SPEAKING') {
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1.08,
              duration: 320,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0.95,
              duration: 320,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -12,
              duration: 640,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 640,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      activeLoopRef.current = loop;
      loop.start();
    } else if (state === 'COMFORTING') {
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(breathAnim, {
              toValue: 1.12,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(breathAnim, {
              toValue: 0.94,
              duration: 4000,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -16,
              duration: 4000,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 4000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      activeLoopRef.current = loop;
      loop.start();
    } else if (state === 'ERROR') {
      Animated.sequence([
        Animated.timing(tiltAnim, { toValue: -0.09, duration: 80, useNativeDriver: true }),
        Animated.timing(tiltAnim, { toValue: 0.09, duration: 80, useNativeDriver: true }),
        Animated.timing(tiltAnim, { toValue: -0.06, duration: 80, useNativeDriver: true }),
        Animated.timing(tiltAnim, { toValue: 0.06, duration: 80, useNativeDriver: true }),
        Animated.timing(tiltAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]).start();
    }

    return () => {
      if (activeLoopRef.current) {
        activeLoopRef.current.stop();
      }
    };
  }, [state]);

  // Handle tap reaction
  const handleTap = () => {
    if (isTapAnimating.current) return;
    isTapAnimating.current = true;

    const msg = TAP_MESSAGES[Math.floor(Math.random() * TAP_MESSAGES.length)];
    setTapBubbleText(msg);

    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1.2,
        friction: 3,
        tension: 180,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(bubbleOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(bubbleTranslate, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    onTap?.();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(bubbleOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleTranslate, {
          toValue: 10,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTapBubbleText(null);
        isTapAnimating.current = false;
      });
    }, 2800);
  };

  // State info
  const getStateInfo = () => {
    switch (state) {
      case 'HAPPY':
        return { label: 'Cheerful', color: '#B8EEDA', icon: Heart };
      case 'LISTENING':
        return { label: 'Listening...', color: '#64D2B4', icon: Mic };
      case 'THINKING':
        return { label: 'Reflecting...', color: '#9CD1BE', icon: Sparkles };
      case 'SPEAKING':
        return { label: 'Speaking', color: '#78B29C', icon: Volume2 };
      case 'COMFORTING':
        return { label: 'Breathing gently', color: '#B8EEDA', icon: Heart };
      case 'ERROR':
        return { label: 'Gentle pause', color: '#FFDAD6', icon: AlertCircle };
      default:
        return { label: 'Ready to listen', color: '#78B29C', icon: Sparkles };
    }
  };

  const stateInfo = getStateInfo();

  // Choose the visual image frame based on state
  const getMascotFrame = () => {
    if (state === 'SPEAKING' && speakingFrame) {
      return require('../../assets/bloom-mascot-speaking.png');
    }
    if (state === 'HAPPY') {
      return require('../../assets/bloom-mascot-happy.png');
    }
    return require('../../assets/bloom-cloud-mascot-hd.png');
  };

  return (
    <View style={[styles.container, { width: size * 1.5, height: size * 1.5 }]}>
      {/* Floating Speech Bubble when tapped */}
      {tapBubbleText && (
        <Animated.View
          style={[
            styles.speechBubble,
            {
              opacity: bubbleOpacity,
              transform: [{ translateY: bubbleTranslate }],
            },
          ]}
        >
          <Text style={styles.speechBubbleText}>{tapBubbleText}</Text>
          <View style={styles.speechBubbleArrow} />
        </Animated.View>
      )}

      {/* Pulsing Listening Wave Rings */}
      {state === 'LISTENING' && (
        <>
          <Animated.View
            style={[
              styles.waveRing,
              {
                width: size * 1.35,
                height: size * 1.35,
                borderRadius: (size * 1.35) / 2,
                opacity: ring1Anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.65, 0.35, 0],
                }),
                transform: [
                  {
                    scale: ring1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1.4],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.waveRing,
              {
                width: size * 1.35,
                height: size * 1.35,
                borderRadius: (size * 1.35) / 2,
                opacity: ring2Anim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.65, 0.35, 0],
                }),
                transform: [
                  {
                    scale: ring2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1.4],
                    }),
                  },
                ],
              },
            ]}
          />
        </>
      )}

      {/* Ambient Celestial Aura */}
      <Animated.View
        style={[
          styles.ambientAura,
          {
            width: size * 1.25,
            height: size * 1.25,
            borderRadius: (size * 1.25) / 2,
            transform: [{ scale: auraScaleAnim }],
            backgroundColor:
              state === 'COMFORTING'
                ? 'rgba(120, 178, 156, 0.32)'
                : state === 'LISTENING'
                ? 'rgba(100, 210, 180, 0.28)'
                : state === 'THINKING'
                ? 'rgba(150, 130, 230, 0.28)'
                : state === 'SPEAKING'
                ? 'rgba(120, 178, 156, 0.35)'
                : 'rgba(110, 130, 230, 0.22)',
          },
        ]}
      />

      {/* Orbiting Twinkling Sparkles */}
      <Animated.View
        style={[
          styles.sparkleContainer,
          {
            opacity: sparkleOpacity,
            transform: [{ rotate: floatAnim.interpolate({ inputRange: [-15, 0], outputRange: ['-6deg', '6deg'] }) }],
          },
        ]}
        pointerEvents="none"
      >
        <Sparkles size={18} color="#B8EEDA" style={[styles.sparkleItem, { top: 12, left: 24 }]} />
        <Sparkles size={14} color="#D2E3DB" style={[styles.sparkleItem, { top: 28, right: 30 }]} />
        <Sparkles size={16} color="#B8EEDA" style={[styles.sparkleItem, { bottom: 34, left: 32 }]} />
        <Sparkles size={20} color="#9CD1BE" style={[styles.sparkleItem, { bottom: 22, right: 28 }]} />
      </Animated.View>

      {/* Central Interactive Mascot Button */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handleTap}
        style={styles.touchTarget}
        accessibilityLabel="Interactive Bloom Cloud Mascot"
      >
        <Animated.View
          style={[
            styles.mascotTransformWrapper,
            {
              transform: [
                { translateY: floatAnim },
                { scale: Animated.multiply(breathAnim, bounceAnim) },
                {
                  rotate: tiltAnim.interpolate({
                    inputRange: [-0.1, 0, 0.1],
                    outputRange: ['-7deg', '0deg', '7deg'],
                  }),
                },
              ],
            },
          ]}
        >
          {/* High-Resolution Mascot Image Frame */}
          <Image
            source={getMascotFrame()}
            style={[styles.mascotImage, { width: size, height: size }]}
            resizeMode="contain"
          />
        </Animated.View>
      </TouchableOpacity>

      {/* Live State Status Pill */}
      <View style={styles.statePill}>
        <View style={[styles.statePillDot, { backgroundColor: stateInfo.color }]} />
        <Text style={styles.statePillText}>{stateInfo.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  touchTarget: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  mascotTransformWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotImage: {
    zIndex: 5,
  },
  ambientAura: {
    position: 'absolute',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(184, 238, 218, 0.2)',
  },
  waveRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#64D2B4',
    zIndex: 3,
  },
  sparkleContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 6,
  },
  sparkleItem: {
    position: 'absolute',
  },
  speechBubble: {
    position: 'absolute',
    top: -50,
    backgroundColor: '#1E2838',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 30,
    borderWidth: 1,
    borderColor: 'rgba(184, 238, 218, 0.28)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  speechBubbleText: {
    ...Typography.bodySmall,
    color: '#F5FFF9',
    fontWeight: '600',
    fontSize: 13,
  },
  speechBubbleArrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 6,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1E2838',
  },
  statePill: {
    position: 'absolute',
    bottom: -10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(23, 32, 48, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.3)',
    zIndex: 12,
  },
  statePillDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statePillText: {
    ...Typography.caption,
    color: '#D2E3DB',
    fontSize: 12,
    fontWeight: '700',
  },
});
