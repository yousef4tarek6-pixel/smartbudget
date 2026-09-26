import React, { useState, useMemo } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Plus,
  ArrowRight,
  CreditCard,
  Building,
  Coins,
  Search,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
import { formatCurrency, formatDate, formatPercentage } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Transaction } from '../../types';

interface DashboardViewProps {
  onOpenAddModal: () => void;
  onNavigateTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

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

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddModal,
  onNavigateTab,
  searchQuery,
  setSearchQuery,
}) => {
  const { user } = useAuth();
  const { financialSummary, transactions, getBudgetProgress } = useData();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Time-based greeting helper
  const greetingTime = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Filtered recent transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.merchant && t.merchant.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategoryFilter ? t.category === selectedCategoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchQuery, selectedCategoryFilter]);

  // Spending Timeline chart data
  const chartData = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const map: Record<string, { date: string; income: number; expense: number }> = {};
    sorted.forEach((t) => {
      const dKey = t.date;
      if (!map[dKey]) map[dKey] = { date: dKey, income: 0, expense: 0 };
      if (t.type === 'income') map[dKey].income += t.amount;
      else map[dKey].expense += t.amount;
    });

    const entries = Object.values(map);
    if (timeRange === '7d') return entries.slice(-7);
    if (timeRange === '30d') return entries.slice(-14);
    if (timeRange === '3m') return entries.slice(-30);
    return entries;
  }, [transactions, timeRange]);

  // Expense Donut chart data
  const donutData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || '#6B7280',
    }));
  }, [transactions]);

  const currency = user?.defaultCurrency || 'AED';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Welcome Greeting Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-indigo-400 light:text-indigo-600 uppercase tracking-wider">
            {greetingTime}, {user?.name || 'Alex'} 👋
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white light:text-gray-900 tracking-tight mt-0.5">
            Financial Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => onNavigateTab('reports')}>
            View Reports
          </Button>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={onOpenAddModal}>
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Balance */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 light:text-gray-600">Total Balance</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl light:bg-indigo-50 light:text-indigo-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white light:text-gray-900 mt-3 tracking-tight">
            {formatCurrency(financialSummary.totalBalance, currency)}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <span
              className={`flex items-center font-bold ${
                financialSummary.balanceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {financialSummary.balanceChange >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {formatPercentage(financialSummary.balanceChange)}
            </span>
            <span className="text-gray-500">vs prev month</span>
          </div>
        </Card>

        {/* Monthly Income */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 light:text-gray-600">Monthly Income</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl light:bg-emerald-50 light:text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 light:text-emerald-600 mt-3 tracking-tight">
            {formatCurrency(financialSummary.monthlyIncome, currency)}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <span className="flex items-center font-bold text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +5.4%
            </span>
            <span className="text-gray-500">vs prev month</span>
          </div>
        </Card>

        {/* Monthly Expenses */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 light:text-gray-600">Monthly Expenses</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl light:bg-rose-50 light:text-rose-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 light:text-rose-600 mt-3 tracking-tight">
            {formatCurrency(financialSummary.monthlyExpenses, currency)}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <span className="flex items-center font-bold text-rose-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -3.1%
            </span>
            <span className="text-gray-500">vs prev month</span>
          </div>
        </Card>

        {/* Total Savings */}
        <Card hoverEffect className="relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 light:text-gray-600">Total Savings</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl light:bg-amber-50 light:text-amber-600">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-400 light:text-indigo-600 mt-3 tracking-tight">
            {formatCurrency(financialSummary.totalSavings, currency)}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <span className="flex items-center font-bold text-indigo-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +8.2%
            </span>
            <span className="text-gray-500">growth rate</span>
          </div>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Spending Area Chart */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-white light:text-gray-900">Spending & Income Flow</h3>
              <p className="text-xs text-gray-400">Cash movement analysis over time</p>
            </div>
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-gray-800/80 light:bg-gray-100 p-1 rounded-xl">
              {(['7d', '30d', '3m'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                    timeRange === r
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white light:text-gray-600'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickFormatter={(v) => formatDate(v)} />
                <YAxis stroke="#6B7280" fontSize={10} />
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
                <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Category Donut Chart */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-extrabold text-white light:text-gray-900">Expense Breakdown</h3>
              <p className="text-xs text-gray-400">Click category to filter list</p>
            </div>
            {selectedCategoryFilter && (
              <button
                onClick={() => setSelectedCategoryFilter(null)}
                className="text-xs text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="h-64 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  onClick={(entry: any) => setSelectedCategoryFilter(entry?.name ? String(entry.name) : null)}
                  className="cursor-pointer"
                >
                  {donutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={selectedCategoryFilter === entry.name ? '#FFF' : 'transparent'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [formatCurrency(Number(val || 0), currency), 'Category']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-gray-800 light:border-gray-100">
            {donutData.slice(0, 6).map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedCategoryFilter(item.name === selectedCategoryFilter ? null : item.name)}
                className={`flex items-center gap-1.5 p-1.5 rounded-lg text-[10px] font-medium cursor-pointer transition-colors ${
                  selectedCategoryFilter === item.name
                    ? 'bg-gray-800 text-white font-bold ring-1 ring-indigo-500'
                    : 'text-gray-400 hover:bg-gray-800/40'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions List */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-white light:text-gray-900">Recent Transactions</h3>
            <p className="text-xs text-gray-400">Latest financial activities and payments</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter category active tag */}
            {selectedCategoryFilter && (
              <Badge variant="info" icon={<Filter className="w-3 h-3" />}>
                Filter: {selectedCategoryFilter}
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => onNavigateTab('transactions')}
            >
              View All
            </Button>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 light:border-gray-200 text-[11px] font-bold text-gray-400 light:text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Merchant / Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 light:divide-gray-100 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No matching transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.slice(0, 6).map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-800/40 light:hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            tx.type === 'income'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-indigo-500/10 text-indigo-400'
                          }`}
                        >
                          {tx.merchant ? tx.merchant[0] : tx.category[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-200 light:text-gray-900">{tx.description}</p>
                          {tx.merchant && <p className="text-[10px] text-gray-500">{tx.merchant}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral">{tx.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">{formatDate(tx.date)}</td>
                    <td className="py-3.5 px-4 text-gray-400 capitalize flex items-center gap-1.5 mt-2">
                      <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                      {tx.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold">
                      <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
