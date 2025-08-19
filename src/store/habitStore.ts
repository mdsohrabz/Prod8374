import { create } from 'zustand';
import { addDays, format, startOfWeek, subWeeks } from 'date-fns';
import { Habit, DailyCheck, Badge, AnalyticsData, AVAILABLE_BADGES } from '@/types/habit';

interface HabitStore {
  habits: Habit[];
  dailyChecks: DailyCheck[];
  
  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'badges' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCheck: (habitId: string, date: string) => Badge[];
  calculateStreaks: (habitId: string) => { currentStreak: number; longestStreak: number };
  getAnalyticsData: () => AnalyticsData;
  
  // Demo data
  loadDemoData: () => void;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  dailyChecks: [],

  addHabit: (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit_${Date.now()}`,
      currentStreak: 0,
      longestStreak: 0,
      badges: [],
      createdAt: new Date(),
    };

    set((state) => ({
      habits: [...state.habits, newHabit],
    }));
  },

  updateHabit: (id, updates) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, ...updates } : habit
      ),
    }));
  },

  deleteHabit: (id) => {
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id),
      dailyChecks: state.dailyChecks.filter((check) => check.habitId !== id),
    }));
  },

  toggleHabitCheck: (habitId, date) => {
    const { dailyChecks } = get();
    const existingCheck = dailyChecks.find(
      (check) => check.habitId === habitId && check.date === date
    );

    let newBadges: Badge[] = [];

    if (existingCheck) {
      // Remove check
      set((state) => ({
        dailyChecks: state.dailyChecks.filter(
          (check) => !(check.habitId === habitId && check.date === date)
        ),
      }));
    } else {
      // Add check
      const newCheck: DailyCheck = {
        id: `check_${Date.now()}`,
        habitId,
        date,
        completed: true,
        completedAt: new Date(),
      };

      set((state) => ({
        dailyChecks: [...state.dailyChecks, newCheck],
      }));

      // Calculate new streaks and check for badges
      const { currentStreak } = get().calculateStreaks(habitId);
      const habit = get().habits.find((h) => h.id === habitId);
      
      if (habit) {
        // Check for new badges
        const eligibleBadges = AVAILABLE_BADGES.filter(
          (badge) => 
            badge.milestone <= currentStreak &&
            !habit.badges.find((b) => b.milestone === badge.milestone)
        );

        if (eligibleBadges.length > 0) {
          newBadges = eligibleBadges.map((badge) => ({
            ...badge,
            id: `badge_${Date.now()}_${badge.milestone}`,
            unlockedAt: new Date(),
          }));

          set((state) => ({
            habits: state.habits.map((h) =>
              h.id === habitId
                ? {
                    ...h,
                    badges: [...h.badges, ...newBadges],
                    currentStreak,
                    longestStreak: Math.max(h.longestStreak, currentStreak),
                  }
                : h
            ),
          }));
        } else {
          set((state) => ({
            habits: state.habits.map((h) =>
              h.id === habitId
                ? {
                    ...h,
                    currentStreak,
                    longestStreak: Math.max(h.longestStreak, currentStreak),
                  }
                : h
            ),
          }));
        }
      }
    }

    return newBadges;
  },

  calculateStreaks: (habitId) => {
    const { dailyChecks } = get();
    const habitChecks = dailyChecks
      .filter((check) => check.habitId === habitId && check.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (habitChecks.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(addDays(new Date(), -1), 'yyyy-MM-dd');

    // Calculate current streak
    for (let i = 0; i < habitChecks.length; i++) {
      const checkDate = habitChecks[i].date;
      const expectedDate = format(addDays(new Date(), -i), 'yyyy-MM-dd');

      if (checkDate === expectedDate || (i === 0 && checkDate === yesterday)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    const allDates = habitChecks.map((check) => check.date).sort();
    for (let i = 0; i < allDates.length; i++) {
      tempStreak = 1;
      let currentDate = new Date(allDates[i]);

      for (let j = i + 1; j < allDates.length; j++) {
        const nextDate = new Date(allDates[j]);
        const dayDifference = Math.abs(
          (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dayDifference === 1) {
          tempStreak++;
          currentDate = nextDate;
        } else if (dayDifference > 1) {
          break;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { currentStreak, longestStreak };
  },

  getAnalyticsData: () => {
    const { habits, dailyChecks } = get();
    const weeks = 8;
    
    // Generate completion rates per habit over last 8 weeks
    const completionRates = habits.map((habit) => {
      const data = [];
      for (let i = weeks - 1; i >= 0; i--) {
        const weekStart = startOfWeek(subWeeks(new Date(), i));
        const weekEnd = addDays(weekStart, 6);
        
        const weekChecks = dailyChecks.filter((check) => {
          const checkDate = new Date(check.date);
          return (
            check.habitId === habit.id &&
            check.completed &&
            checkDate >= weekStart &&
            checkDate <= weekEnd
          );
        });

        const rate = Math.round((weekChecks.length / habit.goal) * 100);
        data.push({
          week: format(weekStart, 'MMM dd'),
          rate: Math.min(rate, 100),
        });
      }

      return {
        habitId: habit.id,
        habitName: habit.name,
        data,
      };
    });

    // Generate weekly stats (completed check-ins per weekday)
    const weeklyStats = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (day, index) => {
        const completed = dailyChecks.filter((check) => {
          const checkDate = new Date(check.date);
          return check.completed && checkDate.getDay() === (index + 1) % 7;
        }).length;

        return { day, completed };
      }
    );

    return { completionRates, weeklyStats };
  },

  loadDemoData: () => {
    const demoHabits: Habit[] = [
      {
        id: 'habit_1',
        name: 'Morning Exercise',
        emoji: '🏃‍♂️',
        goal: 5,
        color: 'gradient-success',
        currentStreak: 12,
        longestStreak: 23,
        badges: [
          {
            id: 'badge_1',
            name: 'First Steps',
            description: 'Complete your first day',
            emoji: '🌱',
            milestone: 1,
            unlockedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'badge_2',
            name: 'Week Warrior',
            description: '7 day streak',
            emoji: '🔥',
            milestone: 7,
            unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'habit_2',
        name: 'Read 30 minutes',
        emoji: '📚',
        goal: 7,
        color: 'gradient-primary',
        currentStreak: 5,
        longestStreak: 15,
        badges: [
          {
            id: 'badge_3',
            name: 'First Steps',
            description: 'Complete your first day',
            emoji: '🌱',
            milestone: 1,
            unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'habit_3',
        name: 'Meditation',
        emoji: '🧘‍♀️',
        goal: 4,
        color: 'gradient-warning',
        currentStreak: 3,
        longestStreak: 8,
        badges: [
          {
            id: 'badge_4',
            name: 'First Steps',
            description: 'Complete your first day',
            emoji: '🌱',
            milestone: 1,
            unlockedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ];

    // Generate demo check data for the last 30 days
    const demoDailyChecks: DailyCheck[] = [];
    for (let i = 0; i < 30; i++) {
      const date = format(addDays(new Date(), -i), 'yyyy-MM-dd');
      
      demoHabits.forEach((habit) => {
        // 70% completion rate for demo data
        if (Math.random() > 0.3) {
          demoDailyChecks.push({
            id: `check_${habit.id}_${date}`,
            habitId: habit.id,
            date,
            completed: true,
            completedAt: new Date(date),
          });
        }
      });
    }

    set({ habits: demoHabits, dailyChecks: demoDailyChecks });
  },
}));