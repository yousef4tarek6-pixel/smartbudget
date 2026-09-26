export type Currency = 'AED' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'QAR' | 'KWD' | 'BHD';

export type ThemeMode = 'dark' | 'light' | 'system';

export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'card' | 'bank' | 'cash' | 'other';

export type CategoryType =
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Subscriptions'
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: CategoryType;
  date: string; // ISO string YYYY-MM-DD
  paymentMethod: PaymentMethod;
  merchant?: string;
  notes?: string;
  icon?: string;
}

export interface Budget {
  id: string;
  category: CategoryType;
  monthlyLimit: number;
  period: 'monthly' | 'weekly';
  color?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO date string
  icon?: string;
  color?: string;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: CategoryType;
  frequency: 'weekly' | 'monthly' | 'yearly';
  nextPaymentDate: string;
  paymentMethod: PaymentMethod;
  autoPay?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'alert' | 'success' | 'info';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  monthlyIncome: number;
  spendingTarget: number;
  defaultCurrency: Currency;
  onboardingCompleted: boolean;
  mainGoals?: string[];
  categories?: CategoryType[];
}

export interface NotificationSettings {
  emailAlerts: boolean;
  budgetWarnings: boolean;
  recurringReminders: boolean;
  goalMilestones: boolean;
  weeklyDigest: boolean;
}

export interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSavings: number;
  balanceChange: number;
  incomeChange: number;
  expenseChange: number;
  savingsChange: number;
}

export interface FinancialInsight {
  id: string;
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  actionText?: string;
}
