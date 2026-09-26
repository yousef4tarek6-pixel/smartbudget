import React from 'react';
import { Search, Sun, Moon, Plus, Wallet } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { Button } from '../common/Button';

interface HeaderProps {
  title: string;
  onOpenAddModal: () => void;
  onNavigateTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenAddModal,
  onNavigateTab,
  searchQuery,
  setSearchQuery,
}) => {
  const { themeMode, setThemeMode, effectiveTheme } = useTheme();

  const toggleTheme = () => {
    setThemeMode(effectiveTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 glass-nav border-b border-gray-800/80 light:border-gray-200">
      {/* View Title & Mobile Logo */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-md">
          <Wallet className="w-5 h-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-100 light:text-gray-900 capitalize tracking-tight">
          {title}
        </h2>
      </div>

      {/* Right Controls: Search, Theme Toggle, Notification Bell, Add Transaction Button */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Search Input (Hidden on tiny screens) */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800/80 light:bg-gray-100 border border-gray-700/80 light:border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-100 light:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2.5 text-gray-400 hover:text-white light:hover:text-gray-900 bg-gray-800/80 light:bg-gray-100 hover:bg-gray-700/80 light:hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
          title={`Switch to ${effectiveTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {effectiveTheme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>

        {/* Notification Bell */}
        <NotificationDropdown onNavigateTab={onNavigateTab} />

        {/* Add Transaction Button */}
        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenAddModal}
          className="hidden sm:inline-flex shadow-indigo-500/20"
        >
          Add Expense
        </Button>
      </div>
    </header>
  );
};
