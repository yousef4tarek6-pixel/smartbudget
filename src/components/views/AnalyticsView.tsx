import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Sparkles,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10B981',
  Shopping: '#EC4899',
  Transport: '#3B82F6',
  Bills: '#F59E0B',
  Entertainment: '#8B5CF6',
  Health: '#EF4444',
  Education: '#06B6D4',
  Subscriptions: '#6366F1',
  Salary: '#10B981',
  Freelance: '#34D399',
  Other: '#6B7280',
};

export const AnalyticsView: React.FC = () => {
  const { user } = useAuth();
  const { financialSummary, transactions, financialInsights } = useData();

  const currency = user?.defaultCurrency || 'AED';

  // Savings rate calculation
  const savingsRate = useMemo(() => {
    if (financialSummary.monthlyIncome <= 0) return 0;
    const diff = financialSummary.monthlyIncome - financialSummary.monthlyExpenses;
    return Math.max(0, (diff / financialSummary.monthlyIncome) * 100);
  }, [financialSummary]);

  // Top 5 Biggest Expenses
  const biggestExpenses = useMemo(() => {
    return [...transactions]
      .filter((t) => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // Category Distribution
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#6B7280',
    }));
  }, [transactions]);

  // Monthly Comparison Bar Chart
  const monthlyData = useMemo(() => {
    const monthsMap: Record<string, { month: string; income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mLabel = d.toLocaleString('en-US', { month: 'short' });

      if (!monthsMap[mKey]) monthsMap[mKey] = { month: mLabel, income: 0, expense: 0 };
      if (t.type === 'income') monthsMap[mKey].income += t.amount;
      else monthsMap[mKey].expense += t.amount;
    });

    return Object.values(monthsMap).slice(-6);
  }, [transactions]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white light:text-gray-900 tracking-tight">
          Financial Analytics & Intelligence
        </h1>
        <p className="text-xs text-gray-400">
          Data-driven insights, spending trends, and category distribution
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card hoverEffect className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Monthly Savings Rate</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-2">{savingsRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-2">
            Target benchmark: <strong>20.0%</strong>
          </p>
        </Card>

        <Card hoverEffect className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Spending Trend</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-2">
            {formatPercentage(financialSummary.expenseChange)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Month-over-month expense change</p>
        </Card>

        <Card hoverEffect className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400">Net Financial Surplus</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-400 mt-2">
            {formatCurrency(financialSummary.monthlyIncome - financialSummary.monthlyExpenses, currency)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Unallocated income reserve</p>
        </Card>
      </div>

      {/* Automated Financial Insights Section */}
      <Card className="bg-gradient-to-r from-indigo-950/40 via-gray-900 to-emerald-950/40 border border-indigo-500/30">
        <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold mb-4">
          <Sparkles className="w-5 h-5" />
          <span>Automated Financial Insights</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {financialInsights.map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-2xl bg-gray-950/60 light:bg-white border border-gray-800 light:border-gray-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-extrabold text-sm text-gray-100 light:text-gray-900">
                    {ins.title}
                  </h4>
                  <Badge
                    variant={ins.type === 'positive' ? 'income' : ins.type === 'warning' ? 'warning' : 'info'}
                    size="sm"
                  >
                    {ins.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">{ins.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income vs Expenses Bar Chart */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-white light:text-gray-900">Monthly Spending Comparison</h3>
            <p className="text-xs text-gray-400">Income vs Expenses over recent months</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [formatCurrency(Number(val || 0), currency), '']}
                />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top 5 Biggest Expenses List */}
        <Card className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-white light:text-gray-900">Biggest Single Expenses</h3>
            <p className="text-xs text-gray-400">Highest transaction outflows recorded</p>
          </div>

          <div className="space-y-3">
            {biggestExpenses.map((tx, idx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-gray-950/40 light:bg-gray-50 border border-gray-800 light:border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-gray-800 text-gray-400 text-xs font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-xs text-gray-200 light:text-gray-900">{tx.description}</p>
                    <p className="text-[10px] text-gray-500">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-rose-400">
                  {formatCurrency(tx.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
