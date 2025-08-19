import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/simple-chart';
import { useHabitStore } from '@/store/habitStore';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

export function AnalyticsPage() {
  const { habits, getAnalyticsData } = useHabitStore();
  const analyticsData = getAnalyticsData();

  const totalHabits = habits.length;
  const totalBadges = habits.reduce((sum, habit) => sum + habit.badges.length, 0);
  const averageStreak = habits.length > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + habit.currentStreak, 0) / habits.length)
    : 0;
  const totalCompletions = analyticsData.weeklyStats.reduce((sum, stat) => sum + stat.completed, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and discover patterns in your habits
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Habits</p>
                <p className="text-2xl font-bold text-foreground">{totalHabits}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Streak</p>
                <p className="text-2xl font-bold text-foreground">{averageStreak} days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Badges Earned</p>
                <p className="text-2xl font-bold text-foreground">{totalBadges}</p>
              </div>
              <Award className="h-8 w-8 text-accent-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Check-ins</p>
                <p className="text-2xl font-bold text-foreground">{totalCompletions}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary-blue" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rates Chart */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Completion Rates Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.completionRates[0]?.data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="week" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip />
                {analyticsData.completionRates.map((habit, index) => (
                  <Line
                    key={habit.habitId}
                    type="monotone"
                    dataKey="rate"
                    data={habit.data}
                    stroke={`hsl(var(--primary-${index % 2 === 0 ? 'purple' : 'blue'}))`}
                    strokeWidth={2}
                    dot={{ fill: `hsl(var(--primary-${index % 2 === 0 ? 'purple' : 'blue'}))`, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: `hsl(var(--primary-${index % 2 === 0 ? 'purple' : 'blue'}))`, strokeWidth: 2 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Weekly Pattern Chart */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Completion Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip />
                <Bar 
                  dataKey="completed" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Habit Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Top Performing Habits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits
              .sort((a, b) => b.currentStreak - a.currentStreak)
              .slice(0, 3)
              .map((habit) => (
                <div key={habit.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl">{habit.emoji}</div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{habit.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {habit.currentStreak} day streak
                    </p>
                  </div>
                  <div className="text-lg font-bold text-accent-green">
                    #{habits.indexOf(habit) + 1}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits
              .flatMap((habit) => 
                habit.badges.map((badge) => ({ ...badge, habitName: habit.name, habitEmoji: habit.emoji }))
              )
              .sort((a, b) => new Date(b.unlockedAt || 0).getTime() - new Date(a.unlockedAt || 0).getTime())
              .slice(0, 5)
              .map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="text-2xl">{badge.emoji}</div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{badge.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {badge.habitName} • {badge.description}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}