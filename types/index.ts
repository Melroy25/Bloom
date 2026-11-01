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
