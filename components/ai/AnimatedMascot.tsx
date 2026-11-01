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

export function AnimatedMascot({ state = 'IDLE', onTap, size = 180 }: AnimatedMascotProps) {
  const [tapBubbleText, setTapBubbleText] = useState<string | null>(null);
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

  // Track active state animation loops
  const activeLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Sparkle twinkle loop
  useEffect(() => {
    const sparkleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleOpacity, {
          toValue: 0.2,
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
        // Floating up and down
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -12,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 2200,
              useNativeDriver: true,
            }),
          ])
        ),
        // Soft breathing scale
        Animated.loop(
          Animated.sequence([
            Animated.timing(breathAnim, {
              toValue: 1.04,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(breathAnim, {
              toValue: 0.98,
              duration: 2200,
              useNativeDriver: true,
            }),
          ])
        ),
        // Ambient aura pulse
        Animated.loop(
          Animated.sequence([
            Animated.timing(auraScaleAnim, {
              toValue: 1.15,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(auraScaleAnim, {
              toValue: 0.95,
              duration: 2200,
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
              toValue: -18,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(tiltAnim, {
              toValue: 0.05,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(tiltAnim, {
              toValue: -0.05,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(tiltAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      activeLoopRef.current = loop;
      loop.start();
    } else if (state === 'LISTENING') {
      // Gentle attentive hover + expanding soundwave rings
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -6,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(ring1Anim, {
              toValue: 1,
              duration: 1400,
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
            Animated.delay(700),
            Animated.timing(ring2Anim, {
              toValue: 1,
              duration: 1400,
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
      // Gentle rhythmic orbital drift with glowing nebula
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -8,
              duration: 1800,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 1800,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(tiltAnim, {
              toValue: -0.04,
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(tiltAnim, {
              toValue: 0.04,
              duration: 1200,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      activeLoopRef.current = loop;
      loop.start();
    } else if (state === 'SPEAKING') {
      // Syllable-paced bounce and speaking rhythm
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1.07,
              duration: 350,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0.96,
              duration: 350,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -10,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 700,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      activeLoopRef.current = loop;
      loop.start();
    } else if (state === 'COMFORTING') {
      // Deep 4-second box-breathing wave
      const loop = Animated.parallel([
        Animated.loop(
          Animated.sequence([
            // Inhale expansion (4s)
            Animated.timing(breathAnim, {
              toValue: 1.1,
              duration: 4000,
              useNativeDriver: true,
            }),
            // Exhale return (4s)
            Animated.timing(breathAnim, {
              toValue: 0.95,
              duration: 4000,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -14,
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
      // Gentle wobble
      Animated.sequence([
        Animated.timing(tiltAnim, { toValue: -0.08, duration: 80, useNativeDriver: true }),
        Animated.timing(tiltAnim, { toValue: 0.08, duration: 80, useNativeDriver: true }),
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

    // Pick random friendly message
    const msg = TAP_MESSAGES[Math.floor(Math.random() * TAP_MESSAGES.length)];
    setTapBubbleText(msg);

    // Spring bounce animation
    Animated.sequence([
      Animated.spring(bounceAnim, {
        toValue: 1.18,
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

    // Show speech bubble
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

    // Hide bubble after 2.8s
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

  // State colors and badges
  const getStateInfo = () => {
    switch (state) {
      case 'HAPPY':
        return { label: 'Cheerful', color: '#B8EEDA', icon: Heart };
      case 'LISTENING':
        return { label: "I'm listening...", color: '#64D2B4', icon: Mic };
      case 'THINKING':
        return { label: 'Reflecting...', color: '#9CD1BE', icon: Sparkles };
      case 'SPEAKING':
        return { label: 'Speaking', color: '#78B29C', icon: Volume2 };
      case 'COMFORTING':
        return { label: 'Breathing with you', color: '#B8EEDA', icon: Heart };
      case 'ERROR':
        return { label: 'Gentle pause', color: '#FFDAD6', icon: AlertCircle };
      default:
        return { label: 'Ready to listen', color: '#78B29C', icon: Sparkles };
    }
  };

  const stateInfo = getStateInfo();
  const StateIcon = stateInfo.icon;

  return (
    <View style={[styles.container, { width: size * 1.6, height: size * 1.6 }]}>
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
                  outputRange: [0.6, 0.3, 0],
                }),
                transform: [
                  {
                    scale: ring1Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1.35],
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
                  outputRange: [0.6, 0.3, 0],
                }),
                transform: [
                  {
                    scale: ring2Anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.85, 1.35],
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
            width: size * 1.18,
            height: size * 1.18,
            borderRadius: (size * 1.18) / 2,
            transform: [{ scale: auraScaleAnim }],
            backgroundColor:
              state === 'COMFORTING'
                ? 'rgba(120, 178, 156, 0.28)'
                : state === 'LISTENING'
                ? 'rgba(100, 210, 180, 0.25)'
                : state === 'THINKING'
                ? 'rgba(140, 120, 220, 0.25)'
                : 'rgba(110, 130, 220, 0.2)',
          },
        ]}
      />

      {/* Orbiting Twinkling Sparkles */}
      <Animated.View
        style={[
          styles.sparkleContainer,
          {
            opacity: sparkleOpacity,
            transform: [{ rotate: floatAnim.interpolate({ inputRange: [-15, 0], outputRange: ['-5deg', '5deg'] }) }],
          },
        ]}
        pointerEvents="none"
      >
        <Sparkles size={16} color="#B8EEDA" style={[styles.sparkleItem, { top: 12, left: 24 }]} />
        <Sparkles size={12} color="#D2E3DB" style={[styles.sparkleItem, { top: 28, right: 30 }]} />
        <Sparkles size={14} color="#B8EEDA" style={[styles.sparkleItem, { bottom: 34, left: 32 }]} />
        <Sparkles size={18} color="#9CD1BE" style={[styles.sparkleItem, { bottom: 22, right: 28 }]} />
      </Animated.View>

      {/* Central Interactive Mascot Button */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handleTap}
        style={styles.touchTarget}
        accessibilityLabel="Interactive Bloom Mascot"
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
                    outputRange: ['-6deg', '0deg', '6deg'],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Feathered Cloud Mascot Image */}
          <Image
            source={require('../../assets/bloom-cloud-mascot-feathered.png')}
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
    borderColor: 'rgba(184, 238, 218, 0.15)',
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
    top: -46,
    backgroundColor: '#1E2838',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 30,
    borderWidth: 1,
    borderColor: 'rgba(184, 238, 218, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
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
    bottom: -6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(23, 32, 48, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(91, 142, 125, 0.25)',
    zIndex: 12,
  },
  statePillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statePillText: {
    ...Typography.caption,
    color: '#D2E3DB',
    fontSize: 11,
    fontWeight: '600',
  },
});
