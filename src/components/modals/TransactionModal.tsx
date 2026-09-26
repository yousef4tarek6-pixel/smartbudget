import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Transaction, TransactionType, CategoryType, PaymentMethod } from '../../types';
import { useData } from '../../context/DataContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
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
  'Salary',
  'Freelance',
  'Investments',
  'Other',
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other Method' },
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { addTransaction, updateTransaction } = useData();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Food');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [merchant, setMerchant] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setDescription(initialData.description);
      setCategory(initialData.category);
      setDate(initialData.date);
      setPaymentMethod(initialData.paymentMethod);
      setMerchant(initialData.merchant || '');
      setNotes(initialData.notes || '');
    } else {
      resetForm();
    }
    setErrors({});
  }, [initialData, isOpen]);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setDescription('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('card');
    setMerchant('');
    setNotes('');
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      errs.amount = 'Please enter a valid positive amount.';
    }
    if (!description.trim()) {
      errs.description = 'Description is required.';
    }
    if (!date) {
      errs.date = 'Date is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const txData = {
      type,
      amount: parseFloat(amount),
      description: description.trim(),
      category,
      date,
      paymentMethod,
      merchant: merchant.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (initialData) {
      updateTransaction(initialData.id, txData);
    } else {
      addTransaction(txData);
    }

    onClose();
    resetForm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Add Transaction'}
      subtitle={initialData ? 'Update record details' : 'Record a new income or expense item'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Type Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-800 light:bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-400 light:text-gray-600 hover:text-white light:hover:text-gray-900'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <Input
          label="Amount *"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          autoFocus
        />

        {/* Description & Merchant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Description *"
            placeholder="e.g. Grocery store shopping"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
          />
          <Input
            label="Merchant / Payee"
            placeholder="e.g. Carrefour / Apple"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          />
          <Input
            label="Date *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
          />
        </div>

        {/* Payment Method */}
        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          options={PAYMENT_METHODS}
        />

        {/* Optional Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-300 light:text-gray-700">Notes (Optional)</label>
          <textarea
            rows={2}
            placeholder="Additional context or receipt details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-800/80 light:bg-gray-50 border border-gray-700/80 light:border-gray-300 rounded-xl p-3 text-xs text-gray-100 light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant={type === 'income' ? 'emerald' : 'primary'}>
            {initialData ? 'Update Record' : 'Save Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
