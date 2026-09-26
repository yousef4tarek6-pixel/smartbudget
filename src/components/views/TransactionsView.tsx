import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  Filter,
  Trash2,
  Edit,
  Copy,
  ArrowUpDown,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate, exportToCSV } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { Transaction, CategoryType, PaymentMethod, TransactionType } from '../../types';

interface TransactionsViewProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  onOpenAddModal,
  onEditTransaction,
  searchQuery,
  setSearchQuery,
}) => {
  const { user } = useAuth();
  const { transactions, deleteTransaction, duplicateTransaction } = useData();

  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const currency = user?.defaultCurrency || 'AED';

  // Filtered & Sorted Data
  const filteredList = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.merchant && t.merchant.toLowerCase().includes(searchQuery.toLowerCase())) ||
          t.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === 'all' ? true : t.type === typeFilter;
        const matchesCat = categoryFilter === 'all' ? true : t.category === categoryFilter;
        const matchesMethod = methodFilter === 'all' ? true : t.paymentMethod === methodFilter;
        return matchesSearch && matchesType && matchesCat && matchesMethod;
      })
      .sort((a, b) => {
        let valA = sortField === 'date' ? new Date(a.date).getTime() : a.amount;
        let valB = sortField === 'date' ? new Date(b.date).getTime() : b.amount;
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [transactions, searchQuery, typeFilter, categoryFilter, methodFilter, sortField, sortOrder]);

  const handleExport = () => {
    const exportRows = filteredList.map((t) => ({
      ID: t.id,
      Type: t.type,
      Description: t.description,
      Merchant: t.merchant || '',
      Category: t.category,
      Amount: t.amount,
      Currency: currency,
      Date: t.date,
      PaymentMethod: t.paymentMethod,
      Notes: t.notes || '',
    }));
    exportToCSV(`SmartBudget_Transactions_${new Date().toISOString().split('T')[0]}`, exportRows);
  };

  const categories = [
    'all',
    'Food',
    'Shopping',
    'Transport',
    'Bills',
    'Entertainment',
    'Health',
    'Education',
    'Subscriptions',
    'Salary',
    'Freelance',
    'Other',
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white light:text-gray-900 tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs text-gray-400">Search, filter, and export all financial records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={onOpenAddModal}>
            Add Record
          </Button>
        </div>
      </div>

      {/* Filter & Toolbar Controls Card */}
      <Card className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/80 light:bg-gray-100 border border-gray-700/80 light:border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-100 light:text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Type Filter */}
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'All Types (Income & Expense)' },
              { value: 'expense', label: 'Expenses Only' },
              { value: 'income', label: 'Income Only' },
            ]}
          />

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c === 'all' ? 'All Categories' : c }))}
          />

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              options={[
                { value: 'date', label: 'Sort by Date' },
                { value: 'amount', label: 'Sort by Amount' },
              ]}
              className="flex-1"
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 bg-gray-800 light:bg-gray-100 border border-gray-700 light:border-gray-300 rounded-xl text-gray-300 light:text-gray-700 hover:text-white cursor-pointer shrink-0"
              title={`Toggle ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      {filteredList.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No transactions found"
          description="No records match your selected search criteria. Try resetting filters or add a new transaction."
          actionText="+ Add Transaction"
          onAction={onOpenAddModal}
        />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 light:border-gray-200 bg-gray-950/40 light:bg-gray-50 text-[11px] font-bold text-gray-400 light:text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Description / Merchant</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Payment Method</th>
                  <th className="py-4 px-4 text-right">Amount</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 light:divide-gray-100 text-xs">
                {filteredList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-800/40 light:hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-4">
                      <Badge variant="neutral">{tx.category}</Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-400">{formatDate(tx.date)}</td>
                    <td className="py-4 px-4 text-gray-400 capitalize flex items-center gap-1.5 mt-2">
                      <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                      {tx.paymentMethod}
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-sm">
                      <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                        {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => duplicateTransaction(tx.id)}
                          title="Duplicate record"
                          className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditTransaction(tx)}
                          title="Edit transaction"
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(tx.id)}
                          title="Delete transaction"
                          className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteTransaction(deleteId);
        }}
        title="Delete Transaction?"
        message="Are you sure you want to permanently delete this transaction record? This action cannot be undone."
      />
    </div>
  );
};
