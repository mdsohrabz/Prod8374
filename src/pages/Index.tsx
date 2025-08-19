import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { AnalyticsPage } from '@/components/AnalyticsPage';
import { HabitForm } from '@/components/HabitForm';
import { useHabitStore } from '@/store/habitStore';
import { useAuth } from '@/hooks/useAuth';

type Page = 'dashboard' | 'analytics';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { loadDemoData, habits } = useHabitStore();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Load demo data if no habits exist and user is authenticated
    if (user && habits.length === 0) {
      loadDemoData();
    }
  }, [habits.length, loadDemoData, user]);

  const handleCreateHabit = () => {
    setShowCreateForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onCreateHabit={handleCreateHabit}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'dashboard' ? (
          <Dashboard onCreateHabit={handleCreateHabit} />
        ) : (
          <AnalyticsPage />
        )}
      </main>

      <HabitForm
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
      />
    </div>
  );
};

export default Index;
