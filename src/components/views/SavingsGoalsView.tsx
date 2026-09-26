import React, { useState } from 'react';
import { Plus, Edit, Trash2, Target, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { formatCurrency, formatFullDate } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ProgressBar } from '../common/ProgressBar';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { GoalModal } from '../modals/GoalModal';
import { DepositModal } from '../modals/DepositModal';
import { SavingsGoal } from '../../types';

export const SavingsGoalsView: React.FC = () => {
  const { user } = useAuth();
  const { goals, deleteGoal } = useData();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [depositGoal, setDepositGoal] = useState<SavingsGoal | null>(null);
  const [depositMode, setDepositMode] = useState<'deposit' | 'withdraw'>('deposit');

  const currency = user?.defaultCurrency || 'AED';

  const handleEdit = (g: SavingsGoal) => {
    setEditingGoal(g);
    setIsGoalModalOpen(true);
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenDeposit = (g: SavingsGoal, mode: 'deposit' | 'withdraw') => {
    setDepositGoal(g);
    setDepositMode(mode);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white light:text-gray-900 tracking-tight">
            Savings Goals
          </h1>
          <p className="text-xs text-gray-400">Track and compound funds for future milestones</p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleCreate}>
          New Savings Goal
        </Button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target className="w-8 h-8" />}
          title="No Active Savings Goals"
          description="Create savings goals for a new home, travel vacations, tech upgrades, or emergency reserves."
          actionText="+ Create Goal"
          onAction={handleCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((g) => {
            const percent = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
            const isCompleted = g.currentAmount >= g.targetAmount;

            return (
              <Card key={g.id} hoverEffect className="flex flex-col justify-between space-y-5">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-gray-800 light:bg-gray-100 rounded-2xl">
                      {g.icon || '🎯'}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-100 light:text-gray-900">
                        {g.title}
                      </h3>
                      <p className="text-[11px] text-gray-400">
                        Target date: {formatFullDate(g.targetDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(g)}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(g.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Stat Numbers */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-400 font-extrabold text-sm">
                      Saved: {formatCurrency(g.currentAmount, currency)}
                    </span>
                    <span className="text-gray-400">
                      Target: {formatCurrency(g.targetAmount, currency)}
                    </span>
                  </div>

                  <ProgressBar
                    progress={percent}
                    color={isCompleted ? '#10B981' : '#6366F1'}
                    height="lg"
                  />
                </div>

                {/* Status Badge & Quick Money Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-800/80 light:border-gray-100">
                  {isCompleted ? (
                    <Badge variant="income" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                      Goal Achieved! (100%)
                    </Badge>
                  ) : (
                    <span className="text-xs font-extrabold text-indigo-400">
                      {percent.toFixed(1)}% Completed
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ArrowDownRight className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenDeposit(g, 'withdraw')}
                    >
                      Withdraw
                    </Button>
                    <Button
                      variant="emerald"
                      size="sm"
                      icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenDeposit(g, 'deposit')}
                    >
                      + Deposit
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        initialData={editingGoal}
      />

      <DepositModal
        isOpen={!!depositGoal}
        onClose={() => setDepositGoal(null)}
        goal={depositGoal}
        mode={depositMode}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteGoal(deleteId);
        }}
        title="Delete Savings Goal?"
        message="Are you sure you want to delete this savings goal card?"
      />
    </div>
  );
};
