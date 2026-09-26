import React from 'react';
import { LayoutDashboard, Receipt, PieChart, BarChart3, Settings, Plus } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'Txns', icon: <Receipt className="w-5 h-5" /> },
    { id: 'budgets', label: 'Budgets', icon: <PieChart className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'More', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Floating Action Button (FAB) */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={onOpenAddModal}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-400 text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center active:scale-95 transition-transform cursor-pointer border-2 border-white/20"
          aria-label="Add Transaction"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Bottom Bar Container */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-950/90 light:bg-white/90 backdrop-blur-lg border-t border-gray-800/80 light:border-gray-200 px-2 py-2 flex items-center justify-around select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-indigo-400 light:text-indigo-600 font-bold scale-105'
                  : 'text-gray-400 light:text-gray-500 hover:text-gray-200 light:hover:text-gray-900'
              }`}
            >
              {tab.icon}
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
