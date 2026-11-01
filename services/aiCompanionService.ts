// AI Companion Service for BLOOM
// Architecture note: Provides gentle, student-focused wellness and study reflections.
// When an external backend (e.g. Gemini API / Cloud Functions) is configured,
// replace the mock generator function with your API call without breaking UI contracts.

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
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
    subtitle: 'Quick breathing & mindful reflection',
    prompt: "I'm feeling stressed with my studies right now. Can we do a gentle calming reset?",
    icon: 'spa',
    category: 'wellness',
  },
  {
    id: 'focus',
    title: 'Help me focus',
    subtitle: 'Set a relaxed 20-min pacing sprint',
    prompt: 'Help me stay focused. Can we set up a gentle 20-minute study sprint on Bio Chapter 4?',
    icon: 'timer',
    category: 'study',
  },
  {
    id: 'talk',
    title: "Let's talk",
    subtitle: 'Open, unhurried space for any thoughts',
    prompt: 'Can we just chat freely about what is on my mind today?',
    icon: 'chat',
    category: 'general',
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
        text: "Take a deep breath with me for a moment. 🌿 It's completely normal to feel that rush when deadlines overlap.\n\nLet's break this down into bite-sized momentum:",
        timestamp: '2:42 PM',
        steps: [
          {
            stepNumber: 1,
            title: 'Pick just one topic',
            detail: 'for a 20-minute low-pressure review.',
          },
          {
            stepNumber: 2,
            title: 'Hide everything else',
            detail: 'so your eyes only see one task.',
          },
          {
            stepNumber: 3,
            title: 'Quick check-in right after',
            detail: 'to celebrate your small win.',
          },
        ],
        quickReplies: ['Review Bio notes', 'Try 3-min breathing', 'Build timetable'],
      },
      {
        id: 'm3',
        sender: 'user',
        text: "Bio feels a bit easier. Let's do a 20-minute sprint on Chapter 4.",
        timestamp: '2:45 PM',
      },
      {
        id: 'm4',
        sender: 'ai',
        text: "Perfect! ⏱️ Starting your gentle 20-minute Bio sprint. I'll hold your focus space quietly until 3:05 PM.",
        timestamp: '2:45 PM',
        showSprintWidget: true,
        sprintTopic: 'Bio Chapter 4',
        sprintMinutes: 20,
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
        text: 'You worked hard today. 🌱 Let your shoulders drop away from your ears. Take a slow 4-count breath in... hold for 4... and exhale softly for 6. How is your jaw and neck feeling?',
        timestamp: '8:16 PM',
        quickReplies: ['Feeling lighter', 'Still tense', 'Going to sleep'],
      },
    ],
  },
  {
    id: 'checkin-3',
    title: 'Drafting essay outline',
    lastUpdated: 'Nov 10, 4:30 PM',
    messages: [
      {
        id: 'm3-1',
        sender: 'user',
        text: 'Need to structure my history essay thesis on industrialization.',
        timestamp: '4:30 PM',
      },
      {
        id: 'm3-2',
        sender: 'ai',
        text: "Let's capture the core argument in one single sentence first. What was the most surprising consequence of that period for you?",
        timestamp: '4:31 PM',
        quickReplies: ['Economic shifts', 'Social movements', 'Technological pace'],
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

export async function generateCompanionResponse(userText: string): Promise<ChatMessage> {
  // Simulate natural reflective typing delay
  await new Promise((resolve) => setTimeout(resolve, 950));

  const lower = userText.toLowerCase();
  const time = getFormattedTime();
  const id = 'msg-' + Date.now();

  // If user asks about focus / sprint / timer
  if (lower.includes('focus') || lower.includes('sprint') || lower.includes('timer') || lower.includes('25-min') || lower.includes('20-min')) {
    const topicMatch = userText.match(/(?:on|about|for)\s+([a-zA-Z0-9\s]+?)(?:\?|\.|$)/i);
    const topic = topicMatch ? topicMatch[1].trim() : 'Focus Session';

    return {
      id,
      sender: 'ai',
      text: `Perfect! ⏱️ Starting your gentle 20-minute focus sprint on "${topic}". I'll keep your space serene and quiet so you can get into flow.`,
      timestamp: time,
      showSprintWidget: true,
      sprintTopic: topic.length > 24 ? topic.substring(0, 24) + '...' : topic,
      sprintMinutes: 20,
      quickReplies: ['Need a break', 'Finished early', 'Add 5 mins'],
    };
  }

  // If user asks about stress / overwhelm / calming
  if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('anxious') || lower.includes('reset') || lower.includes('tired')) {
    return {
      id,
      sender: 'ai',
      text: "I hear you. Take a slow, deep breath with me right now. 🌿 Remember: you don't have to carry every exam and assignment all at once.\n\nHere is a gentle 3-step reset:",
      timestamp: time,
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
      text: "Let's do a soothing box-breath together:\n\n1. Inhale gently for 4 counts...\n2. Hold peacefully for 4 counts...\n3. Exhale smoothly for 4 counts...\n4. Rest empty for 4 counts.\n\nFeel that lightness returning? Whenever you're ready, we can return to your tasks.",
      timestamp: time,
      quickReplies: ['Repeat breath', "I'm ready to study", 'Feeling calmer'],
    };
  }

  // Default friendly mindful companion response
  return {
    id,
    sender: 'ai',
    text: `Thank you for sharing that with me 🌱. I'm right here with you. Studying and growing works best when you take things one step at a time at your own natural pace.\n\nWhat would feel most restorative or helpful to focus on next?`,
    timestamp: time,
    quickReplies: ['Help me prioritize', 'Start a focus sprint', 'Tips to unwind'],
  };
}
