import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Budget, CategoryType } from '../../types';
import { useData } from '../../context/DataContext';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Budget | null;
}

const CATEGORIES: CategoryType[] = [
  'Food',
  'Shopping',
  'Transport',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Subscriptions',
  'Other',
];

export const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addBudget, updateBudget } = useData();

  const [category, setCategory] = useState<CategoryType>('Food');
  const [limit, setLimit] = useState<string>('');
  const [period, setPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category);
      setLimit(initialData.monthlyLimit.toString());
      setPeriod(initialData.period);
    } else {
      setCategory('Food');
      setLimit('');
      setPeriod('monthly');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || isNaN(Number(limit)) || Number(limit) <= 0) {
      setErrors({ limit: 'Please enter a valid positive budget amount.' });
      return;
    }

    if (initialData) {
      updateBudget(initialData.id, {
        category,
        monthlyLimit: parseFloat(limit),
        period,
      });
    } else {
      addBudget({
        category,
        monthlyLimit: parseFloat(limit),
        period,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Budget Cap' : 'Create Category Budget'}
      subtitle="Define monthly or weekly spending limits"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="Spending Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryType)}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />

        <Input
          label="Limit Amount *"
          type="number"
          step="0.01"
          placeholder="e.g. 1500"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          error={errors.limit}
          autoFocus
        />

        <Select
          label="Budget Period"
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'weekly', label: 'Weekly' },
          ]}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Budget' : 'Save Budget'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
