// AI Companion Service for BLOOM
// Provides gentle student-wellness reflections, emotional intent analysis,
// and state-driven responses.

export type MascotState =
  | 'IDLE'
  | 'HAPPY'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'COMFORTING'
  | 'ERROR';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  emotion?: MascotState;
  steps?: { stepNumber: number; title: string; detail: string }[];
  showSprintWidget?: boolean;
  sprintTopic?: string;
  sprintMinutes?: number;
  quickReplies?: string[];
}

export interface ConversationThread {
  id: string;
  title: string;
  lastUpdated: string;
  messages: ChatMessage[];
}

export const INITIAL_SUGGESTIONS = [
  {
    id: 'stressed',
    title: "I'm feeling stressed",
    subtitle: 'Quick breathing & mindful reset',
    prompt: "I'm feeling stressed with my studies right now. Can we do a gentle calming reset?",
    icon: 'spa',
    emotion: 'COMFORTING' as MascotState,
  },
  {
    id: 'focus',
    title: 'Help me focus',
    subtitle: 'Start a 20-min pacing sprint',
    prompt: 'Help me stay focused. Can we set up a gentle 20-minute study sprint?',
    icon: 'timer',
    emotion: 'HAPPY' as MascotState,
  },
  {
    id: 'talk',
    title: "Let's talk",
    subtitle: 'Open, unhurried space for any thoughts',
    prompt: 'Can we just chat freely about what is on my mind today?',
    icon: 'chat',
    emotion: 'HAPPY' as MascotState,
  },
];

export const RECENT_CHECK_INS: ConversationThread[] = [
  {
    id: 'checkin-1',
    title: 'Exam stress & study pacing',
    lastUpdated: 'Today, 2:40 PM',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: "I have two finals on Thursday and I'm feeling overwhelmed with where to start...",
        timestamp: '2:41 PM',
      },
      {
        id: 'm2',
        sender: 'ai',
        text: "Take a deep breath with me for a moment. 🌿 It's completely normal to feel that rush when deadlines overlap.\n\nLet's break this down into bite-sized momentum:\n1. Pick just one topic for 20 minutes.\n2. Hide everything else.\n3. Celebrate your small win.",
        timestamp: '2:42 PM',
        emotion: 'COMFORTING',
        quickReplies: ['Review Bio notes', 'Try 3-min breathing', 'Build timetable'],
      },
    ],
  },
  {
    id: 'checkin-2',
    title: 'Mindful breathing check-in',
    lastUpdated: 'Yesterday, 8:15 PM',
    messages: [
      {
        id: 'm2-1',
        sender: 'user',
        text: 'Just finished a long study session and my head is buzzing.',
        timestamp: '8:15 PM',
      },
      {
        id: 'm2-2',
        sender: 'ai',
        text: 'You worked hard today. 🌱 Let your shoulders drop away from your ears. Take a slow 4-count breath in... hold for 4... and exhale softly for 6.',
        timestamp: '8:16 PM',
        emotion: 'COMFORTING',
        quickReplies: ['Feeling lighter', 'Still tense', 'Going to sleep'],
      },
    ],
  },
];

export function getFormattedTime(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Maps user input text to an emotional expression for the mascot
 */
export function detectEmotionFromContext(text: string): MascotState {
  const lower = text.toLowerCase();

  if (
    lower.includes('stress') ||
    lower.includes('anxious') ||
    lower.includes('overwhelm') ||
    lower.includes('scared') ||
    lower.includes('tired') ||
    lower.includes('sad') ||
    lower.includes('panic') ||
    lower.includes('calm') ||
    lower.includes('breath')
  ) {
    return 'COMFORTING';
  }

  if (
    lower.includes('hello') ||
    lower.includes('hey') ||
    lower.includes('hi') ||
    lower.includes('happy') ||
    lower.includes('yay') ||
    lower.includes('great') ||
    lower.includes('good') ||
    lower.includes('awesome') ||
    lower.includes('thank')
  ) {
    return 'HAPPY';
  }

  if (
    lower.includes('why') ||
    lower.includes('how') ||
    lower.includes('what') ||
    lower.includes('think') ||
    lower.includes('focus') ||
    lower.includes('plan')
  ) {
    return 'THINKING';
  }

  return 'IDLE';
}

/**
 * Generates companion response with emotional metadata
 */
export async function generateCompanionResponse(userText: string): Promise<ChatMessage> {
  // Simulate natural reflective typing delay
  await new Promise((resolve) => setTimeout(resolve, 900));

  const lower = userText.toLowerCase();
  const time = getFormattedTime();
  const id = 'msg-' + Date.now();

  // If user asks about focus / sprint / timer
  if (
    lower.includes('focus') ||
    lower.includes('sprint') ||
    lower.includes('timer') ||
    lower.includes('25-min') ||
    lower.includes('20-min')
  ) {
    const topicMatch = userText.match(/(?:on|about|for)\s+([a-zA-Z0-9\s]+?)(?:\?|\.|$)/i);
    const topic = topicMatch ? topicMatch[1].trim() : 'Focus Sprint';

    return {
      id,
      sender: 'ai',
      text: `Starting your gentle 20-minute focus sprint on ${topic}. I will keep your space serene and quiet so you can find your flow.`,
      timestamp: time,
      emotion: 'HAPPY',
      showSprintWidget: true,
      sprintTopic: topic.length > 24 ? topic.substring(0, 24) + '...' : topic,
      sprintMinutes: 20,
      quickReplies: ['Need a break', 'Finished early', 'Add 5 mins'],
    };
  }

  // If user asks about stress / overwhelm / anxiety
  if (
    lower.includes('stress') ||
    lower.includes('overwhelm') ||
    lower.includes('anxious') ||
    lower.includes('reset') ||
    lower.includes('tired')
  ) {
    return {
      id,
      sender: 'ai',
      text: "Take a slow, deep breath with me right now. 🌿 You don't have to carry every deadline at once. Drop your shoulders, take a sip of water, and pick just one small task for 15 minutes.",
      timestamp: time,
      emotion: 'COMFORTING',
      steps: [
        {
          stepNumber: 1,
          title: 'Unclench your jaw & drop shoulders',
          detail: 'Release the subtle physical tension.',
        },
        {
          stepNumber: 2,
          title: 'Pick just one 15-minute slice',
          detail: 'Everything else can pause without failing.',
        },
        {
          stepNumber: 3,
          title: 'Drink a sip of cool water',
          detail: 'Ground your senses in the present room.',
        },
      ],
      quickReplies: ['Start 15-min sprint', 'Try 3-min breathing', 'Just chat'],
    };
  }

  // If user asks about breathing
  if (lower.includes('breath') || lower.includes('meditat') || lower.includes('calm')) {
    return {
      id,
      sender: 'ai',
      text: "Let's do a soothing box-breath together. Inhale gently for 4... hold peacefully for 4... exhale smoothly for 4... and rest empty for 4. Feel that gentle lightness returning?",
      timestamp: time,
      emotion: 'COMFORTING',
      quickReplies: ['Repeat breath', "I'm ready to study", 'Feeling calmer'],
    };
  }

  // Greetings
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      id,
      sender: 'ai',
      text: "Hey there! 🌱 I'm Bloom, your mindful companion. I'm right here with you whenever you need to reflect, plan your studies, or simply take a breather.",
      timestamp: time,
      emotion: 'HAPPY',
      quickReplies: ['Help me focus', "I'm feeling stressed", "Let's talk"],
    };
  }

  // Default friendly mindful response
  return {
    id,
    sender: 'ai',
    text: "Thank you for sharing that with me 🌱. Studying and growing works best when you take things one step at a time at your own natural pace. What would feel most helpful to focus on next?",
    timestamp: time,
    emotion: 'HAPPY',
    quickReplies: ['Help me prioritize', 'Start a focus sprint', 'Tips to unwind'],
  };
}
