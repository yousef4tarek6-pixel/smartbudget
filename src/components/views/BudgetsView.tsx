import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, CheckCircle2, PieChart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { BudgetModal } from '../modals/BudgetModal';
import { Budget } from '../../types';

export const BudgetsView: React.FC = () => {
  const { user } = useAuth();
  const { budgets, deleteBudget, getBudgetProgress } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const currency = user?.defaultCurrency || 'AED';

  const handleEdit = (b: Budget) => {
    setEditingBudget(b);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white light:text-gray-900 tracking-tight">
            Monthly Category Budgets
          </h1>
          <p className="text-xs text-gray-400">Set spending thresholds to prevent overspending</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          Create Budget
        </Button>
      </div>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <EmptyState
          icon={<PieChart className="w-8 h-8" />}
          title="No Budgets Defined Yet"
          description="Create custom monthly limits for Food, Shopping, Transport, and Bills to monitor your spending."
          actionText="+ Create First Budget"
          onAction={handleCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b) => {
            const prog = getBudgetProgress(b.category);
            const remaining = Math.max(0, b.monthlyLimit - prog.spent);

            return (
              <Card key={b.id} hoverEffect className="flex flex-col justify-between space-y-4">
                {/* Top Row: Category Title & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm text-white shadow-md"
                      style={{ backgroundColor: b.color || '#6366F1' }}
                    >
                      {b.category[0]}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-gray-100 light:text-gray-900">
                        {b.category}
                      </h3>
                      <span className="text-[10px] text-gray-500 capitalize">{b.period} limit</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(b)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit budget"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteId(b.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete budget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Amounts */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-400">Spent: {formatCurrency(prog.spent, currency)}</span>
                    <span className="text-gray-200 light:text-gray-900">
                      Cap: {formatCurrency(b.monthlyLimit, currency)}
                    </span>
                  </div>

                  <ProgressBar progress={prog.percent} color={b.color} height="md" />
                </div>

                {/* Status Badge & Remaining */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-800/80 light:border-gray-100 text-xs">
                  {prog.isAlert ? (
                    <Badge variant="alert" icon={<AlertTriangle className="w-3 h-3" />}>
                      Limit Exceeded! ({prog.percent.toFixed(0)}%)
                    </Badge>
                  ) : prog.isWarning ? (
                    <Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>
                      Warning ({prog.percent.toFixed(0)}% used)
                    </Badge>
                  ) : (
                    <Badge variant="income" icon={<CheckCircle2 className="w-3 h-3" />}>
                      On Track ({prog.percent.toFixed(0)}%)
                    </Badge>
                  )}

                  <span className="text-[11px] text-gray-400">
                    Remaining: <strong className="text-gray-200">{formatCurrency(remaining, currency)}</strong>
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal & Confirmation */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingBudget}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteBudget(deleteId);
        }}
        title="Delete Budget?"
        message="Are you sure you want to delete this category budget limit?"
      />
    </div>
  );
};
