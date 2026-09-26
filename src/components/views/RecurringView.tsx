import React, { useState } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Calendar, CheckCircle, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { RecurringModal } from '../modals/RecurringModal';
import { RecurringExpense } from '../../types';

export const RecurringView: React.FC = () => {
  const { user } = useAuth();
  const { recurringExpenses, deleteRecurringExpense, recordRecurringPayment } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringExpense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const currency = user?.defaultCurrency || 'AED';

  const handleEdit = (r: RecurringExpense) => {
    setEditingItem(r);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white light:text-gray-900 tracking-tight">
            Recurring Payments & Subscriptions
          </h1>
          <p className="text-xs text-gray-400">Never get caught off-guard by upcoming bills</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          New Recurring Item
        </Button>
      </div>

      {/* List / Cards Grid */}
      {recurringExpenses.length === 0 ? (
        <EmptyState
          icon={<RefreshCw className="w-8 h-8" />}
          title="No Recurring Payments Configured"
          description="Add subscriptions like Netflix, Spotify, Gym memberships, broadband, or utility bills."
          actionText="+ Add Recurring Item"
          onAction={handleCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recurringExpenses.map((r) => (
            <Card key={r.id} hoverEffect className="flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-gray-100 light:text-gray-900">
                      {r.name}
                    </h3>
                    <Badge variant="neutral" size="sm">
                      {r.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(r)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(r.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Details & Amount */}
              <div className="p-4 rounded-xl bg-gray-950/40 light:bg-gray-50 border border-gray-800/80 light:border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Billing Amount</span>
                  <span className="text-lg font-black text-white light:text-gray-900">
                    {formatCurrency(r.amount, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Next due: {formatDate(r.nextPaymentDate)}
                  </span>
                  <span className="capitalize font-semibold text-indigo-300">{r.frequency}</span>
                </div>
              </div>

              {/* Record Payment Button */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  icon={<CheckCircle className="w-4 h-4 text-emerald-400" />}
                  onClick={() => recordRecurringPayment(r.id)}
                >
                  Pay Now / Record Transaction
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <RecurringModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingItem}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteRecurringExpense(deleteId);
        }}
        title="Delete Recurring Payment?"
        message="Are you sure you want to remove this recurring payment schedule?"
      />
    </div>
  );
};
