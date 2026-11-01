// Speech Service for BLOOM AI Companion
// Provides cross-platform Text-To-Speech (via expo-speech) and Web Speech Recognition

import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

class SpeechService {
  private activeRecognition: any = null;
  private isCurrentlySpeaking: boolean = false;

  /**
   * Speak given text aloud using expo-speech
   */
  public async speak(
    text: string,
    onStart?: () => void,
    onDone?: () => void,
    onError?: (err: any) => void
  ): Promise<void> {
    try {
      // Stop any prior speech before beginning
      await this.stopSpeaking();

      // Clean markdown or emojis for smoother natural speech
      const cleanText = text
        .replace(/[🌱✨⏱️🌸🌿💬]/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .trim();

      if (!cleanText) {
        onDone?.();
        return;
      }

      this.isCurrentlySpeaking = true;

      Speech.speak(cleanText, {
        language: 'en-US',
        pitch: 1.15, // Friendly, warm companion pitch
        rate: 0.95,  // Gentle, calm pacing
        onStart: () => {
          this.isCurrentlySpeaking = true;
          onStart?.();
        },
        onDone: () => {
          this.isCurrentlySpeaking = false;
          onDone?.();
        },
        onStopped: () => {
          this.isCurrentlySpeaking = false;
          onDone?.();
        },
        onError: (err) => {
          this.isCurrentlySpeaking = false;
          onError?.(err);
        },
      });
    } catch (error) {
      this.isCurrentlySpeaking = false;
      onError?.(error);
    }
  }

  /**
   * Stop any current speech playback
   */
  public async stopSpeaking(): Promise<void> {
    try {
      this.isCurrentlySpeaking = false;
      await Speech.stop();
    } catch {
      // Silent catch
    }
  }

  /**
   * Check if speech is currently playing
   */
  public isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  /**
   * Start capturing speech from microphone
   * Supports Web Speech API natively in browsers, and provides a clear status callback
   */
  public startListening(callbacks: SpeechRecognitionCallbacks): boolean {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        callbacks.onError?.('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
        return false;
      }

      try {
        if (this.activeRecognition) {
          try {
            this.activeRecognition.stop();
          } catch {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          callbacks.onStart?.();
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript || '';
          callbacks.onResult?.(transcript);
        };

        recognition.onerror = (event: any) => {
          callbacks.onError?.(event.error || 'Microphone error');
        };

        recognition.onend = () => {
          this.activeRecognition = null;
          callbacks.onEnd?.();
        };

        this.activeRecognition = recognition;
        recognition.start();
        return true;
      } catch (err: any) {
        callbacks.onError?.(err?.message || 'Could not start speech recognition');
        return false;
      }
    } else {
      // Mobile Expo Go mode
      // Native SpeechRecognition requires custom dev client, so we notify caller
      callbacks.onError?.('MOBILE_EXPO_GO_VOICE');
      return false;
    }
  }

  /**
   * Stop active speech recognition
   */
  public stopListening(): void {
    if (this.activeRecognition) {
      try {
        this.activeRecognition.stop();
      } catch {}
      this.activeRecognition = null;
    }
  }
}

export const speechService = new SpeechService();
