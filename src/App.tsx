import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

import { LandingPage } from './components/views/LandingPage';
import { AuthView } from './components/views/AuthView';
import { OnboardingView } from './components/views/OnboardingView';

import { DashboardView } from './components/views/DashboardView';
import { TransactionsView } from './components/views/TransactionsView';
import { BudgetsView } from './components/views/BudgetsView';
import { SavingsGoalsView } from './components/views/SavingsGoalsView';
import { RecurringView } from './components/views/RecurringView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

import { TransactionModal } from './components/modals/TransactionModal';
import { Transaction } from './types';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>(() => {
    // Default to app if authenticated, otherwise landing
    return isAuthenticated ? 'app' : 'landing';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Global Transaction Modal State
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState<boolean>(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const handleOpenAddModal = () => {
    setEditingTx(null);
    setIsAddTxModalOpen(true);
  };

  const handleEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    setIsAddTxModalOpen(true);
  };

  // If user clicks Explore Demo on landing page -> automatically sign in demo user
  const handleExploreDemo = () => {
    setViewState('app');
  };

  // Unauthenticated view routing
  if (!isAuthenticated && viewState === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setViewState('auth')}
        onExploreDemo={handleExploreDemo}
      />
    );
  }

  if (!isAuthenticated && viewState === 'auth') {
    return <AuthView onBackToLanding={() => setViewState('landing')} />;
  }

  // Onboarding wizard check
  if (user && !user.onboardingCompleted) {
    return <OnboardingView />;
  }

  return (
    <div className="flex min-h-screen bg-gray-950 light:bg-slate-50 text-gray-100 light:text-gray-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header Bar */}
        <Header
          title={activeTab}
          onOpenAddModal={handleOpenAddModal}
          onNavigateTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Tab Page Router Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddModal={handleOpenAddModal}
              onNavigateTab={setActiveTab}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              onOpenAddModal={handleOpenAddModal}
              onEditTransaction={handleEditTx}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeTab === 'budgets' && <BudgetsView />}

          {activeTab === 'goals' && <SavingsGoalsView />}

          {activeTab === 'recurring' && <RecurringView />}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Global Add/Edit Transaction Modal */}
      <TransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
        initialData={editingTx}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
