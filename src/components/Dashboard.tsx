import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target, Zap, Trophy, Calendar } from 'lucide-react';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';
import { useHabitStore } from '@/store/habitStore';
import { Habit } from '@/types/habit';
import { format } from 'date-fns';

interface DashboardProps {
  onCreateHabit: () => void;
}

export function Dashboard({ onCreateHabit }: DashboardProps) {
  const { habits, dailyChecks } = useHabitStore();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCompletions = dailyChecks.filter(
    (check) => check.date === today && check.completed
  ).length;

  const totalStreakDays = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
  const totalBadges = habits.reduce((sum, habit) => sum + habit.badges.length, 0);

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowEditForm(true);
  };

  const handleCloseForm = () => {
    setEditingHabit(null);
    setShowEditForm(false);
  };

  if (habits.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Welcome to Habitca!
              </h3>
              <p className="text-muted-foreground mb-6">
                Start your journey to better habits. Create your first habit and begin tracking your progress.
              </p>
            </div>
            <Button
              onClick={onCreateHabit}
              className="gap-2 bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Create Your First Habit
            </Button>
          </CardContent>
        </Card>

        <HabitForm
          open={showEditForm}
          onOpenChange={handleCloseForm}
          habit={editingHabit || undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}! 👋
          </h1>
          <p className="text-white/80 text-lg">
            Ready to make today count? You've got {habits.length} habits to work on.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {todayCompletions}/{habits.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((todayCompletions / habits.length) * 100) || 0}% complete
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Streak Days</p>
                <p className="text-2xl font-bold text-foreground">{totalStreakDays}</p>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </div>
              <Zap className="h-8 w-8 text-accent-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold text-foreground">{totalBadges}</p>
                <p className="text-xs text-muted-foreground">Achievements unlocked</p>
              </div>
              <Trophy className="h-8 w-8 text-accent-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habits Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Your Habits</h2>
          <Button
            onClick={onCreateHabit}
            variant="outline"
            className="gap-2 hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add Habit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              dailyChecks={dailyChecks}
              onEdit={() => handleEditHabit(habit)}
            />
          ))}
        </div>
      </div>

      {/* Edit Form */}
      <HabitForm
        open={showEditForm}
        onOpenChange={handleCloseForm}
        habit={editingHabit || undefined}
      />
    </div>
  );
}