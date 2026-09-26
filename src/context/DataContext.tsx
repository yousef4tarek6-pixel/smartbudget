import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  Budget,
  SavingsGoal,
  RecurringExpense,
  NotificationItem,
  NotificationSettings,
  FinancialSummary,
  FinancialInsight,
  CategoryType,
} from '../types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_RECURRING_EXPENSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_NOTIFICATION_SETTINGS,
} from '../data/demoData';
import confetti from 'canvas-confetti';

interface DataContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  recurringExpenses: RecurringExpense[];
  notifications: NotificationItem[];
  notificationSettings: NotificationSettings;
  
  // Transaction CRUD
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => void;

  // Budget CRUD
  addBudget: (b: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, b: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Savings Goal CRUD
  addGoal: (g: Omit<SavingsGoal, 'id'>) => void;
  updateGoal: (id: string, g: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  depositToGoal: (id: string, amount: number) => void;
  withdrawFromGoal: (id: string, amount: number) => void;

  // Recurring CRUD
  addRecurringExpense: (r: Omit<RecurringExpense, 'id'>) => void;
  updateRecurringExpense: (id: string, r: Partial<RecurringExpense>) => void;
  deleteRecurringExpense: (id: string) => void;
  recordRecurringPayment: (id: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  // Global actions
  loadDemoData: () => void;
  clearAllData: () => void;

  // Computed & Insights
  financialSummary: FinancialSummary;
  getBudgetProgress: (category: CategoryType) => { spent: number; limit: number; percent: number; isWarning: boolean; isAlert: boolean };
  financialInsights: FinancialInsight[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence states
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('smartbudget_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('smartbudget_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('smartbudget_goals');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(() => {
    const saved = localStorage.getItem('smartbudget_recurring');
    return saved ? JSON.parse(saved) : INITIAL_RECURRING_EXPENSES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('smartbudget_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('smartbudget_notification_settings');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATION_SETTINGS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('smartbudget_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('smartbudget_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('smartbudget_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('smartbudget_recurring', JSON.stringify(recurringExpenses));
  }, [recurringExpenses]);

  useEffect(() => {
    localStorage.setItem('smartbudget_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('smartbudget_notification_settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Transaction Actions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Push notification if expense budget threshold crossed
    if (tx.type === 'expense') {
      const prog = getBudgetProgress(tx.category);
      if (prog.limit > 0) {
        const newSpent = prog.spent + tx.amount;
        const newPercent = (newSpent / prog.limit) * 100;
        if (newPercent >= 80 && prog.percent < 80) {
          pushNotification({
            title: `${tx.category} Budget Alert`,
            message: `You have reached ${newPercent.toFixed(0)}% of your ${tx.category} monthly budget!`,
            type: newPercent > 100 ? 'alert' : 'warning',
            linkTab: 'budgets',
          });
        }
      }
    }
  };

  const updateTransaction = (id: string, tx: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...tx } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const duplicateTransaction = (id: string) => {
    const item = transactions.find((t) => t.id === id);
    if (!item) return;
    const duplicated: Transaction = {
      ...item,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `${item.description} (Copy)`,
    };
    setTransactions((prev) => [duplicated, ...prev]);
  };

  // Budget Actions
  const addBudget = (b: Omit<Budget, 'id'>) => {
    const newB: Budget = {
      ...b,
      id: `b-${Date.now()}`,
    };
    setBudgets((prev) => [...prev, newB]);
  };

  const updateBudget = (id: string, b: Partial<Budget>) => {
    setBudgets((prev) => prev.map((item) => (item.id === id ? { ...item, ...b } : item)));
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((item) => item.id !== id));
  };

  // Savings Goal Actions
  const addGoal = (g: Omit<SavingsGoal, 'id'>) => {
    const newG: SavingsGoal = {
      ...g,
      id: `g-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newG]);
  };

  const updateGoal = (id: string, g: Partial<SavingsGoal>) => {
    setGoals((prev) => prev.map((item) => (item.id === id ? { ...item, ...g } : item)));
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((item) => item.id !== id));
  };

  const depositToGoal = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updatedAmount = g.currentAmount + amount;
          if (updatedAmount >= g.targetAmount && g.currentAmount < g.targetAmount) {
            // Trigger confetti animation!
            try {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } catch (e) {
              console.log(e);
            }
            pushNotification({
              title: `🎉 Goal Achieved: ${g.title}!`,
              message: `Congratulations! You have reached your savings goal of ${g.targetAmount}!`,
              type: 'success',
              linkTab: 'goals',
            });
          }
          return { ...g, currentAmount: updatedAmount };
        }
        return g;
      })
    );
  };

  const withdrawFromGoal = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updatedAmount = Math.max(0, g.currentAmount - amount);
          return { ...g, currentAmount: updatedAmount };
        }
        return g;
      })
    );
  };

  // Recurring Expense Actions
  const addRecurringExpense = (r: Omit<RecurringExpense, 'id'>) => {
    const newR: RecurringExpense = {
      ...r,
      id: `r-${Date.now()}`,
    };
    setRecurringExpenses((prev) => [...prev, newR]);
  };

  const updateRecurringExpense = (id: string, r: Partial<RecurringExpense>) => {
    setRecurringExpenses((prev) => prev.map((item) => (item.id === id ? { ...item, ...r } : item)));
  };

  const deleteRecurringExpense = (id: string) => {
    setRecurringExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const recordRecurringPayment = (id: string) => {
    const item = recurringExpenses.find((r) => r.id === id);
    if (!item) return;
    
    // Add transaction
    addTransaction({
      type: 'expense',
      amount: item.amount,
      description: `${item.name} (Recurring)`,
      category: item.category,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: item.paymentMethod,
      merchant: item.name,
    });

    // Advance next payment date
    const nextDate = new Date(item.nextPaymentDate);
    if (item.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else if (item.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
    else if (item.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);

    updateRecurringExpense(id, { nextPaymentDate: nextDate.toISOString().split('T')[0] });
  };

  // Notification Helpers
  const pushNotification = (notif: { title: string; message: string; type: NotificationItem['type']; linkTab?: string }) => {
    const newN: NotificationItem = {
      id: `n-${Date.now()}`,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      timestamp: new Date().toISOString(),
      read: false,
      linkTab: notif.linkTab,
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...settings }));
  };

  // Demo / Reset Actions
  const loadDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_SAVINGS_GOALS);
    setRecurringExpenses(INITIAL_RECURRING_EXPENSES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setNotificationSettings(INITIAL_NOTIFICATION_SETTINGS);
  };

  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setRecurringExpenses([]);
    setNotifications([]);
  };

  // Computed Financial Summary & Progress
  const financialSummary = useMemo<FinancialSummary>(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let totalIncome = 0;
    let totalExpenses = 0;

    let currentMonthIncome = 0;
    let currentMonthExpenses = 0;

    let prevMonthIncome = 0;
    let prevMonthExpenses = 0;

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const m = d.getMonth();
      const y = d.getFullYear();

      if (tx.type === 'income') {
        totalIncome += tx.amount;
        if (m === currentMonth && y === currentYear) currentMonthIncome += tx.amount;
        if (m === prevMonth && y === prevYear) prevMonthIncome += tx.amount;
      } else {
        totalExpenses += tx.amount;
        if (m === currentMonth && y === currentYear) currentMonthExpenses += tx.amount;
        if (m === prevMonth && y === prevYear) prevMonthExpenses += tx.amount;
      }
    });

    const totalBalance = totalIncome - totalExpenses;
    const totalSavings = goals.reduce((acc, g) => acc + g.currentAmount, 0);

    const incomeChange = prevMonthIncome > 0 ? ((currentMonthIncome - prevMonthIncome) / prevMonthIncome) * 100 : 0;
    const expenseChange = prevMonthExpenses > 0 ? ((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100 : 0;
    const balanceChange = incomeChange - expenseChange;
    const savingsChange = 4.2; // Demo rate growth

    return {
      totalBalance,
      monthlyIncome: currentMonthIncome || totalIncome,
      monthlyExpenses: currentMonthExpenses || totalExpenses,
      totalSavings,
      balanceChange,
      incomeChange,
      expenseChange,
      savingsChange,
    };
  }, [transactions, goals]);

  const getBudgetProgress = (category: CategoryType) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const budget = budgets.find((b) => b.category === category);
    const limit = budget ? budget.monthlyLimit : 0;

    const spent = transactions
      .filter((t) => {
        if (t.type !== 'expense' || t.category !== category) return false;
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, t) => acc + t.amount, 0);

    const percent = limit > 0 ? (spent / limit) * 100 : 0;

    return {
      spent,
      limit,
      percent,
      isWarning: percent >= 80 && percent <= 100,
      isAlert: percent > 100,
    };
  };

  // Financial Insights Generator
  const financialInsights = useMemo<FinancialInsight[]>(() => {
    const insights: FinancialInsight[] = [];
    const summary = financialSummary;

    if (summary.monthlyExpenses > 0 && summary.monthlyIncome > 0) {
      const savingsRate = ((summary.monthlyIncome - summary.monthlyExpenses) / summary.monthlyIncome) * 100;
      if (savingsRate >= 20) {
        insights.push({
          id: 'ins-1',
          type: 'positive',
          title: 'Strong Savings Rate!',
          description: `You saved ${savingsRate.toFixed(1)}% of your monthly income, exceeding the recommended 20% benchmark.`,
          actionText: 'View Savings Goals',
        });
      } else if (savingsRate > 0) {
        insights.push({
          id: 'ins-2',
          type: 'info',
          title: 'Savings Opportunity',
          description: `Your savings rate is ${savingsRate.toFixed(1)}%. Cutting 10% off subscriptions or food could boost your monthly reserves.`,
          actionText: 'Review Budgets',
        });
      }
    }

    if (summary.expenseChange < 0) {
      insights.push({
        id: 'ins-3',
        type: 'positive',
        title: 'Decreased Monthly Spending',
        description: `You spent ${Math.abs(summary.expenseChange).toFixed(1)}% less this month compared to last month. Great discipline!`,
      });
    } else if (summary.expenseChange > 15) {
      insights.push({
        id: 'ins-4',
        type: 'warning',
        title: 'Higher Expense Trend',
        description: `Your spending increased by ${summary.expenseChange.toFixed(1)}% compared to last month. Check top expense categories.`,
        actionText: 'See Breakdown',
      });
    }

    const totalGoalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const totalGoalCurrent = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    if (totalGoalTarget > 0) {
      const goalDistance = totalGoalTarget - totalGoalCurrent;
      insights.push({
        id: 'ins-5',
        type: 'info',
        title: 'Goal Progress Distance',
        description: `You are currently ${goalDistance.toLocaleString()} away from fully funding all active savings goals.`,
        actionText: 'Deposit Savings',
      });
    }

    return insights;
  }, [financialSummary, goals]);

  return (
    <DataContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        recurringExpenses,
        notifications,
        notificationSettings,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        duplicateTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        depositToGoal,
        withdrawFromGoal,
        addRecurringExpense,
        updateRecurringExpense,
        deleteRecurringExpense,
        recordRecurringPayment,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        updateNotificationSettings,
        loadDemoData,
        clearAllData,
        financialSummary,
        getBudgetProgress,
        financialInsights,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
