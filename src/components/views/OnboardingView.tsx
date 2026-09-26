import React, { useState } from 'react';
import { Wallet, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Currency } from '../../types';
import { useAuth } from '../../context/AuthContext';

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

const GOALS_LIST = [
  '🏡 Buy a Home',
  '🛡️ Emergency Reserve',
  '✈️ Travel & Vacations',
  '📈 Investment Portfolio',
  '🚗 New Car',
  '🎓 Education & Up-skilling',
  '📱 Upgrade Tech Gear',
];

const CATEGORIES_LIST = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Subscriptions',
];

export const OnboardingView: React.FC = () => {
  const { completeOnboarding, skipOnboarding, user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [income, setIncome] = useState<string>('18000');
  const [currency, setCurrency] = useState<Currency>('AED');
  const [spendingTarget, setSpendingTarget] = useState<string>('6000');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['🏡 Buy a Home', '🛡️ Emergency Reserve']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Food', 'Shopping', 'Transport', 'Bills']);

  const handleToggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleFinish = () => {
    completeOnboarding({
      monthlyIncome: parseFloat(income) || 18000,
      currency,
      spendingTarget: parseFloat(spendingTarget) || 6000,
      mainGoals: selectedGoals,
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 light:bg-slate-50 flex items-center justify-center p-4 sm:p-6 bg-grid-pattern relative">
      <div className="w-full max-w-xl bg-gray-900/90 light:bg-white border border-gray-800 light:border-gray-200 rounded-3xl p-8 shadow-2xl backdrop-blur-xl animate-fade-in my-8">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800 light:border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white font-bold">
              {step}
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-100 light:text-gray-900">
                Setup Wizard ({step}/5)
              </h3>
              <p className="text-[11px] text-gray-400">Personalizing SmartBudget for {user?.name}</p>
            </div>
          </div>
          <button
            onClick={skipOnboarding}
            className="text-xs font-semibold text-gray-400 hover:text-white light:hover:text-gray-900 transition-colors cursor-pointer"
          >
            Skip Setup →
          </button>
        </div>

        {/* Step 1: Income */}
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-extrabold text-white light:text-gray-900 mb-2">
                What is your estimated monthly income?
              </h2>
              <p className="text-xs text-gray-400">
                This helps us calculate your monthly savings capacity and budget benchmarks.
              </p>
            </div>
            <Input
              label="Monthly Income Amount"
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 18000"
              autoFocus
            />
          </div>
        )}

        {/* Step 2: Currency */}
        {step === 2 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-extrabold text-white light:text-gray-900 mb-2">
                Which primary currency do you use?
              </h2>
              <p className="text-xs text-gray-400">
                All dashboard metrics and charts will display in this currency notation.
              </p>
            </div>
            <Select
              label="Default Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              options={CURRENCIES}
            />
          </div>
        )}

        {/* Step 3: Spending Target */}
        {step === 3 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-extrabold text-white light:text-gray-900 mb-2">
                What is your monthly spending target?
              </h2>
              <p className="text-xs text-gray-400">
                Set a cap on total monthly expenses to keep your savings trajectory on track.
              </p>
            </div>
            <Input
              label="Monthly Expense Target Cap"
              type="number"
              value={spendingTarget}
              onChange={(e) => setSpendingTarget(e.target.value)}
              placeholder="e.g. 6000"
              autoFocus
            />
          </div>
        )}

        {/* Step 4: Goals */}
        {step === 4 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-extrabold text-white light:text-gray-900 mb-2">
                What are your main financial goals?
              </h2>
              <p className="text-xs text-gray-400">Select any milestones you want to achieve.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GOALS_LIST.map((g) => {
                const isSelected = selectedGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleToggleGoal(g)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span>{g}</span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Categories */}
        {step === 5 && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-extrabold text-white light:text-gray-900 mb-2">
                Ready to take control of your money!
              </h2>
              <p className="text-xs text-gray-400">
                We've pre-configured your smart category budgets based on your inputs.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-3">
              <Sparkles className="w-5 h-5 shrink-0" />
              <span>You're all set! We've pre-populated demo records so you can test features right away.</span>
            </div>
          </div>
        )}

        {/* Bottom Wizard Controls */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800 light:border-gray-100">
          {step > 1 ? (
            <Button
              variant="outline"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setStep((s) => s - 1)}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <Button
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep((s) => s + 1)}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="emerald"
              icon={<Check className="w-4 h-4" />}
              onClick={handleFinish}
              className="shadow-emerald-600/30"
            >
              Launch Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
