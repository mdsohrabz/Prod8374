import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Home, BarChart3, Plus, Moon, Sun, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  currentPage: 'dashboard' | 'analytics';
  onPageChange: (page: 'dashboard' | 'analytics') => void;
  onCreateHabit: () => void;
}

export function Navigation({ currentPage, onPageChange, onCreateHabit }: NavigationProps) {
  const [darkMode, setDarkMode] = useState(false);
  const { user, signOut } = useAuth();

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="border-b border-border/50 bg-gradient-card backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Habitca
              </h1>
              <p className="text-xs text-muted-foreground">Get Better Daily</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onPageChange('dashboard')}
              className={cn(
                "gap-2",
                currentPage === 'dashboard' && "bg-gradient-primary"
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={currentPage === 'analytics' ? 'default' : 'ghost'}
              onClick={() => onPageChange('analytics')}
              className={cn(
                "gap-2",
                currentPage === 'analytics' && "bg-gradient-primary"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onCreateHabit}
              className="gap-2 bg-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              New Habit
            </Button>
            
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={darkMode}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-gradient-primary"
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>

            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-foreground/70 hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}