export interface Habit {
  id: string;
  name: string;
  emoji: string;
  goal: number; // days per week
  color: string;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  createdAt: Date;
}

export interface DailyCheck {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  completedAt?: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  milestone: number; // days
  unlockedAt?: Date;
}

export interface AnalyticsData {
  completionRates: {
    habitId: string;
    habitName: string;
    data: { week: string; rate: number }[];
  }[];
  weeklyStats: {
    day: string;
    completed: number;
  }[];
}

export const AVAILABLE_BADGES: Omit<Badge, 'id' | 'unlockedAt'>[] = [
  {
    name: "First Steps",
    description: "Complete your first day",
    emoji: "🌱",
    milestone: 1
  },
  {
    name: "Week Warrior",
    description: "7 day streak",
    emoji: "🔥",
    milestone: 7
  },
  {
    name: "Monthly Master",
    description: "30 day streak",
    emoji: "💎",
    milestone: 30
  },
  {
    name: "Century Club",
    description: "100 day streak",
    emoji: "👑",
    milestone: 100
  },
  {
    name: "Legendary",
    description: "365 day streak",
    emoji: "🌟",
    milestone: 365
  }
];