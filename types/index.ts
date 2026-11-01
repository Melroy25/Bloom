export interface DailyGoal {
  id: string;
  title: string;
  completed: boolean;
  icon: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  icon: string;
  color: string;
  progress?: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
}

export interface ProgressData {
  tasksCompleted: string;
  focusTime: string;
  energyLevel: string;
  message: string;
}

export interface HealZoneItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface CollabItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  members?: number;
}

export type MoodType =
  | 'Happy'
  | 'Excited'
  | 'Calm'
  | 'Neutral'
  | 'Tired'
  | 'Anxious'
  | 'Sad'
  | 'Stressed';

export interface MoodOption {
  id: string;
  name: MoodType;
  emoji: string;
  score: number;
  color: string;
  bgColor: string;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  emoji: string;
  score: number;
  date: string;
  time: string;
  timestamp: number;
}

export interface MoodChartPoint {
  label: string;
  score: number;
  mood: string;
  emoji: string;
}

