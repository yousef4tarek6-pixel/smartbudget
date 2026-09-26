import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { RecurringExpense, CategoryType, PaymentMethod } from '../../types';
import { useData } from '../../context/DataContext';

interface RecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: RecurringExpense | null;
}

const CATEGORIES: CategoryType[] = [
  'Subscriptions',
  'Bills',
  'Food',
  'Health',
  'Transport',
  'Entertainment',
  'Education',
  'Other',
];

export const RecurringModal: React.FC<RecurringModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { addRecurringExpense, updateRecurringExpense } = useData();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryType>('Subscriptions');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setFrequency(initialData.frequency);
      setNextPaymentDate(initialData.nextPaymentDate);
      setPaymentMethod(initialData.paymentMethod);
    } else {
      setName('');
      setAmount('');
      setCategory('Subscriptions');
      setFrequency('monthly');
      setNextPaymentDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setPaymentMethod('card');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Subscription name is required.';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) errs.amount = 'Valid amount is required.';
    if (!nextPaymentDate) errs.nextPaymentDate = 'Next payment date is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const rData = {
      name: name.trim(),
      amount: parseFloat(amount),
      category,
      frequency,
      nextPaymentDate,
      paymentMethod,
    };

    if (initialData) {
      updateRecurringExpense(initialData.id, rData);
    } else {
      addRecurringExpense(rData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Recurring Payment' : 'New Recurring Payment'}
      subtitle="Track monthly subscriptions and automated bills"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Subscription / Payment Name *"
          placeholder="e.g. Netflix UHD"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount *"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={errors.amount}
          />
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as any)}
            options={[
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'yearly', label: 'Yearly' },
            ]}
          />
          <Input
            label="Next Payment Date *"
            type="date"
            value={nextPaymentDate}
            onChange={(e) => setNextPaymentDate(e.target.value)}
            error={errors.nextPaymentDate}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Payment' : 'Save Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
