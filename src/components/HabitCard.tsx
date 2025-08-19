import { useState } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Trophy, Flame, Edit3, Trash2 } from 'lucide-react';
import { Habit, DailyCheck } from '@/types/habit';
import { useHabitStore } from '@/store/habitStore';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
  dailyChecks: DailyCheck[];
  onEdit: () => void;
}

export function HabitCard({ habit, dailyChecks, onEdit }: HabitCardProps) {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { toggleHabitCheck, deleteHabit } = useHabitStore();

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCheck = dailyChecks.find(
    (check) => check.habitId === habit.id && check.date === today
  );

  const handleToggleToday = () => {
    const newBadges = toggleHabitCheck(habit.id, today);
    
    // Show toast notifications for new badges (simplified)
    if (newBadges.length > 0) {
      newBadges.forEach((badge) => {
        console.log(`🎉 Badge unlocked: ${badge.emoji} ${badge.name}!`);
      });
    }
  };

  const getHeatmapData = () => {
    const start = startOfMonth(addDays(new Date(), -30));
    const end = endOfMonth(new Date());
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const check = dailyChecks.find(
        (c) => c.habitId === habit.id && c.date === dateStr
      );
      return {
        date: dateStr,
        completed: !!check?.completed,
        day: day,
      };
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
        <div className={`absolute inset-0 bg-${habit.color} opacity-5`} />
        
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{habit.emoji}</div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">{habit.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {habit.goal} times per week
                </p>
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteHabit(habit.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          {/* Streak Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Flame className="h-4 w-4 text-accent-orange" />
              <span className="text-muted-foreground">Current:</span>
              <span className="font-bold text-foreground">{habit.currentStreak} days</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Trophy className="h-4 w-4 text-accent-green" />
              <span className="text-muted-foreground">Best:</span>
              <span className="font-bold text-foreground">{habit.longestStreak} days</span>
            </div>
          </div>

          {/* Badges */}
          {habit.badges.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {habit.badges.slice(0, 3).map((badge) => (
                <Badge
                  key={badge.id}
                  variant="secondary"
                  className="text-xs px-2 py-1"
                >
                  {badge.emoji} {badge.name}
                </Badge>
              ))}
              {habit.badges.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{habit.badges.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleToggleToday}
              className={cn(
                "flex-1 transition-all duration-200",
                todayCheck?.completed
                  ? `bg-${habit.color} text-white hover:opacity-90`
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {todayCheck?.completed ? "✓ Done Today" : "Mark Complete"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowHeatmap(true)}
              className="shrink-0"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Modal */}
      <Dialog open={showHeatmap} onOpenChange={setShowHeatmap}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {habit.emoji} {habit.name} - 30 Day History
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {getHeatmapData().map((data, index) => (
                <div
                  key={data.date}
                  className={cn(
                    "aspect-square rounded-lg border-2 transition-all duration-200 cursor-pointer",
                    data.completed
                      ? `bg-${habit.color} border-${habit.color}/50 shadow-sm`
                      : "bg-muted border-border hover:border-border/80"
                  )}
                  title={`${format(data.day, 'MMM dd')} - ${data.completed ? 'Completed' : 'Not completed'}`}
                />
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded bg-muted border border-border" />
                <div className={`w-3 h-3 rounded bg-${habit.color}/30 border border-${habit.color}/50`} />
                <div className={`w-3 h-3 rounded bg-${habit.color}/60 border border-${habit.color}/50`} />
                <div className={`w-3 h-3 rounded bg-${habit.color} border border-${habit.color}/50`} />
              </div>
              <span>More</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}