import React, { useState } from 'react';
import {
  User,
  Sun,
  Moon,
  Laptop,
  DollarSign,
  Bell,
  Lock,
  Trash2,
  Sparkles,
  CheckCircle2,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Currency, ThemeMode } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ConfirmDialog } from '../common/ConfirmDialog';

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'USD', label: 'USD - US Dollar ($)' },
  { value: 'EUR', label: 'EUR - Euro (€)' },
  { value: 'GBP', label: 'GBP - British Pound (£)' },
  { value: 'SAR', label: 'SAR - Saudi Riyal' },
  { value: 'QAR', label: 'QAR - Qatari Riyal' },
  { value: 'KWD', label: 'KWD - Kuwaiti Dinar' },
  { value: 'BHD', label: 'BHD - Bahraini Dinar' },
];

export const SettingsView: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { themeMode, setThemeMode } = useTheme();
  const {
    notificationSettings,
    updateNotificationSettings,
    loadDemoData,
    clearAllData,
  } = useData();

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState<Currency>(user?.defaultCurrency || 'AED');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Security Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Data Modals
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDemoConfirmOpen, setIsDemoConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, defaultCurrency: currency });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setOldPassword('');
    setNewPassword('');
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white light:text-gray-900 tracking-tight">
          Preferences & Settings
        </h1>
        <p className="text-xs text-gray-400">Manage account details, currency, theme, and data resets</p>
      </div>

      {/* 1. Profile Settings */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white light:text-gray-900">Profile Information</h3>
        </div>

        {profileSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Morgan"
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@smartbudget.app"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* 2. Appearance & Theme */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white light:text-gray-900">Appearance & Theme</h3>
        </div>
        <p className="text-xs text-gray-400 mb-6">
          Choose your visual preferences or match your operating system preferences.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'dark', label: 'Dark Mode', icon: <Moon className="w-5 h-5" /> },
            { id: 'light', label: 'Light Mode', icon: <Sun className="w-5 h-5" /> },
            { id: 'system', label: 'System Theme', icon: <Laptop className="w-5 h-5" /> },
          ].map((modeItem) => {
            const isSelected = themeMode === modeItem.id;
            return (
              <button
                key={modeItem.id}
                onClick={() => setThemeMode(modeItem.id as ThemeMode)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 font-bold text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/50'
                    : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                {modeItem.icon}
                <span>{modeItem.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. Currency Preferences */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white light:text-gray-900">Default Currency</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Set your primary currency notation across all dashboards and reports.
        </p>
        <div className="max-w-md">
          <Select
            label="Base Currency"
            value={currency}
            onChange={(e) => {
              const val = e.target.value as Currency;
              setCurrency(val);
              updateProfile({ defaultCurrency: val });
            }}
            options={CURRENCIES}
          />
        </div>
      </Card>

      {/* 4. Notification Toggles */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-white light:text-gray-900">Notification Preferences</h3>
        </div>
        <div className="space-y-3">
          {[
            {
              id: 'budgetWarnings',
              label: 'Budget Warning Notifications',
              desc: 'Get alerted when category spending reaches 80% or exceeds 100%.',
            },
            {
              id: 'recurringReminders',
              label: 'Recurring Payment Reminders',
              desc: 'Receive alerts 3 days before upcoming subscription due dates.',
            },
            {
              id: 'goalMilestones',
              label: 'Goal Milestone Achievements',
              desc: 'Celebrate reaching 50%, 75%, and 100% of savings goals.',
            },
          ].map((toggle) => {
            const key = toggle.id as keyof typeof notificationSettings;
            const isChecked = notificationSettings[key];
            return (
              <div
                key={toggle.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-950/40 light:bg-gray-50 border border-gray-800 light:border-gray-200"
              >
                <div>
                  <p className="font-bold text-xs text-gray-200 light:text-gray-900">
                    {toggle.label}
                  </p>
                  <p className="text-[11px] text-gray-400">{toggle.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => updateNotificationSettings({ [key]: e.target.checked })}
                  className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* 5. Security Settings */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-bold text-white light:text-gray-900">Security & Password</h3>
        </div>

        {passwordSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Password changed successfully!
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" size="sm">
              Update Password
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={logout} icon={<LogOut className="w-3.5 h-3.5" />}>
              Log Out All Sessions
            </Button>
          </div>
        </form>
      </Card>

      {/* 6. Data Management Section */}
      <Card className="border border-rose-500/30">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-bold text-white light:text-gray-900">Data Management & Demo Tools</h3>
        </div>
        <p className="text-xs text-gray-400 mb-6">
          Pre-fill demo records for testing or purge local storage data.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="secondary"
            icon={<Sparkles className="w-4 h-4 text-indigo-400" />}
            onClick={() => setIsDemoConfirmOpen(true)}
          >
            Load Rich Demo Dataset
          </Button>

          <Button
            variant="danger"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsResetConfirmOpen(true)}
          >
            Clear All Application Data
          </Button>
        </div>
      </Card>

      {/* Confirm Modals */}
      <ConfirmDialog
        isOpen={isDemoConfirmOpen}
        onClose={() => setIsDemoConfirmOpen(false)}
        onConfirm={loadDemoData}
        title="Load Demo Data?"
        message="This will load pre-populated transactions, budgets, goals, and notifications so you can explore the app."
        confirmText="Load Demo Data"
      />

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Saved Data?"
        message="Warning! This will erase all transactions, budgets, goals, and settings saved locally."
        confirmText="Erase All Data"
      />
    </div>
  );
};
