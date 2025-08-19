import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Habit } from '@/types/habit';
import { useHabitStore } from '@/store/habitStore';

interface HabitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit;
}

const EMOJI_OPTIONS = [
  '🏃‍♂️', '📚', '🧘‍♀️', '💧', '🍎', '💪', '🎯', '✍️', 
  '🌅', '🛏️', '🚶‍♀️', '🎨', '🎵', '💻', '☕', '🧧'
];

const COLOR_OPTIONS = [
  { name: 'Primary', value: 'gradient-primary' },
  { name: 'Success', value: 'gradient-success' },
  { name: 'Warning', value: 'gradient-warning' },
  { name: 'Purple', value: 'primary-purple' },
  { name: 'Blue', value: 'primary-blue' },
  { name: 'Green', value: 'accent-green' },
  { name: 'Orange', value: 'accent-orange' },
  { name: 'Pink', value: 'accent-pink' },
];

export function HabitForm({ open, onOpenChange, habit }: HabitFormProps) {
  const { addHabit, updateHabit } = useHabitStore();
  const [formData, setFormData] = useState({
    name: habit?.name || '',
    emoji: habit?.emoji || '🎯',
    goal: habit?.goal || 5,
    color: habit?.color || 'gradient-primary',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    if (habit) {
      updateHabit(habit.id, formData);
    } else {
      addHabit(formData);
    }

    onOpenChange(false);
    setFormData({
      name: '',
      emoji: '🎯',
      goal: 5,
      color: 'gradient-primary',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {habit ? 'Edit Habit' : 'Create New Habit'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Morning Exercise"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Select
                value={formData.emoji}
                onValueChange={(emoji) => setFormData({ ...formData, emoji })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMOJI_OPTIONS.map((emoji) => (
                    <SelectItem key={emoji} value={emoji}>
                      <span className="text-lg">{emoji}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Goal (days/week)</Label>
              <Select
                value={formData.goal.toString()}
                onValueChange={(goal) => setFormData({ ...formData, goal: parseInt(goal) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'day' : 'days'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Theme Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`
                    relative h-10 rounded-lg border-2 transition-all duration-200
                    ${formData.color === color.value ? 'border-ring scale-110' : 'border-transparent hover:scale-105'}
                    ${color.value.startsWith('gradient-') ? `bg-${color.value}` : `bg-${color.value}`}
                  `}
                  title={color.name}
                >
                  {formData.color === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-primary">
              {habit ? 'Update Habit' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}