import { Colors } from '../constants/colors';
import { DailyGoal, StatItem, QuickAction, ProgressData, HealZoneItem, TaskItem, CollabItem } from '../types';

export const userName = 'Melroy';

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const dailyQuote = {
  text: 'Small steps every day lead to big changes.',
  author: 'James Clear',
};

export const beforeData: ProgressData = {
  tasksCompleted: '2/9',
  focusTime: '1h 20m',
  energyLevel: '35%',
  message: "Let's make today better.",
};

export const afterData: ProgressData = {
  tasksCompleted: '8/9',
  focusTime: '6h 45m',
  energyLevel: '92%',
  message: "You're making wonderful progress!",
};

export const todayStats: StatItem[] = [
  {
    id: '1',
    label: 'Tasks Done',
    value: '5/8',
    icon: 'check-circle',
    color: Colors.primary,
    progress: 0.625,
  },
  {
    id: '2',
    label: 'Focus Time',
    value: '2h 45m',
    icon: 'clock',
    color: Colors.lavender,
    progress: 0.55,
  },
  {
    id: '3',
    label: 'Energy',
    value: '78%',
    icon: 'zap',
    color: Colors.peach,
    progress: 0.78,
  },
  {
    id: '4',
    label: 'Screen Time',
    value: '3h 20m',
    icon: 'smartphone',
    color: Colors.mint,
    progress: 0.42,
  },
];

export const quickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Heal Zone',
    description: 'Relax & recover',
    icon: 'heart',
    color: Colors.peach,
    route: '/heal-zone',
  },
  {
    id: '2',
    title: 'Talk to Bloom',
    description: 'AI companion',
    icon: 'message-circle',
    color: Colors.mint,
    route: '/ai',
  },
  {
    id: '3',
    title: 'Add Journal',
    description: 'Write your thoughts',
    icon: 'book-open',
    color: Colors.lavender,
    route: '/heal-zone',
  },
  {
    id: '4',
    title: 'Focus Mode',
    description: 'Deep work session',
    icon: 'target',
    color: Colors.lightSage,
    route: '/tasks',
  },
];

export const dailyGoals: DailyGoal[] = [
  { id: '1', title: 'Complete assignments', completed: false, icon: 'book' },
  { id: '2', title: 'Take a 20-minute walk', completed: false, icon: 'footprints' },
  { id: '3', title: 'Write a journal entry', completed: true, icon: 'pen-tool' },
  { id: '4', title: 'Reduce unnecessary scrolling', completed: false, icon: 'smartphone' },
];

export const healZoneItems: HealZoneItem[] = [
  { id: '1', title: 'Healing Bubble', description: 'Breathe, relax, and find your calm space', icon: 'wind', color: Colors.mint },
  { id: '2', title: 'Music Zone', description: 'Curated playlists for focus and relaxation', icon: 'music', color: Colors.lavender },
  { id: '3', title: 'Journal', description: 'Express your thoughts freely', icon: 'book-open', color: Colors.peach },
  { id: '4', title: 'Mood Tracking', description: 'Track and understand your emotions', icon: 'smile', color: Colors.lightSage },
  { id: '5', title: 'Healing Games', description: 'Mindful games to destress', icon: 'gamepad-2', color: Colors.paleBlue },
];

export const taskItems: TaskItem[] = [
  { id: '1', title: 'Screen Time', description: 'Monitor your daily screen usage', icon: 'monitor', color: Colors.lavender },
  { id: '2', title: 'Assignment Tracker', description: 'Keep track of your assignments', icon: 'clipboard-list', color: Colors.mint },
  { id: '3', title: 'Student Tasks', description: 'Manage your daily study tasks', icon: 'list-checks', color: Colors.lightSage },
  { id: '4', title: 'Sleep Tracking', description: 'Monitor your sleep patterns', icon: 'moon', color: Colors.peach },
  { id: '5', title: 'Stress Tracking', description: 'Understand your stress levels', icon: 'activity', color: Colors.lavender },
  { id: '6', title: 'Goals', description: 'Set and track personal goals', icon: 'target', color: Colors.mint },
  { id: '7', title: 'SOS Signal', description: 'Quick access to help when needed', icon: 'alert-circle', color: '#F5D5D5' },
  { id: '8', title: 'Focus Mode', description: 'Deep focus work sessions', icon: 'eye', color: Colors.lightSage },
];

export const collabItems: CollabItem[] = [
  { id: '1', title: 'Global Community', description: 'Connect with students worldwide', icon: 'globe', color: Colors.mint, members: 12453 },
  { id: '2', title: 'Friends', description: 'Your personal circle', icon: 'users', color: Colors.lavender, members: 24 },
  { id: '3', title: 'Trending Challenges', description: 'Join wellness challenges', icon: 'trending-up', color: Colors.peach, members: 856 },
  { id: '4', title: 'Group Streaks', description: 'Build habits with friends', icon: 'flame', color: Colors.lightSage, members: 8 },
  { id: '5', title: 'Community Activity', description: 'See what others are up to', icon: 'message-square', color: Colors.paleBlue, members: 3421 },
];

export const aiCompanion = {
  name: 'Bloom AI',
  greeting: "Hi there! I'm Bloom, your personal wellness companion. 🌿",
  description: "I'm here to listen, support, and help you navigate your day. Ask me anything about wellness, productivity, or just chat!",
  sampleMessages: [
    { id: '1', sender: 'ai', text: "Good morning! How are you feeling today? 🌱" },
    { id: '2', sender: 'user', text: "I'm feeling a bit stressed about my exams." },
    { id: '3', sender: 'ai', text: "That's completely normal. Let's break it down together. What's the biggest exam you're worried about?" },
  ],
};
