import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Target,
  RefreshCw,
  BarChart3,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Sparkles,
  Wallet,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();
  const { loadDemoData } = useData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt className="w-5 h-5" /> },
    { id: 'budgets', label: 'Budgets', icon: <PieChart className="w-5 h-5" /> },
    { id: 'goals', label: 'Savings Goals', icon: <Target className="w-5 h-5" /> },
    { id: 'recurring', label: 'Recurring', icon: <RefreshCw className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-gray-800/80 light:border-gray-200 bg-gray-900/50 light:bg-white/80 backdrop-blur-xl h-screen sticky top-0 shrink-0 p-5 justify-between select-none">
      <div>
        {/* Logo Branding */}
        <div className="flex items-center gap-3 px-3 py-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight text-white light:text-gray-900 leading-tight">
              Smart<span className="text-indigo-400 light:text-indigo-600">Budget</span>
            </h1>
            <p className="text-[10px] text-gray-400 light:text-gray-500 font-medium">Fintech Money Suite</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                    : 'text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900 hover:bg-gray-800/50 light:hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="space-y-3">
        {/* Quick Demo Data Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-gray-900 light:from-indigo-50 light:to-white border border-indigo-500/20 light:border-indigo-200">
          <div className="flex items-center gap-2 text-indigo-400 light:text-indigo-600 text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Demo Dataset</span>
          </div>
          <p className="text-[11px] text-gray-400 light:text-gray-600 mb-3">
            Explore with pre-populated financial data.
          </p>
          <button
            onClick={loadDemoData}
            className="w-full py-1.5 px-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 light:text-indigo-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Demo Data
          </button>
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-800/40 light:bg-gray-100 border border-gray-800 light:border-gray-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-200 light:text-gray-900 truncate">
                {user?.name || 'Alex Morgan'}
              </p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email || 'alex@smartbudget.app'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
