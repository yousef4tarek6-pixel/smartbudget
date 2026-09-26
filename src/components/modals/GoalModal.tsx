import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { SavingsGoal } from '../../types';
import { useData } from '../../context/DataContext';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SavingsGoal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addGoal, updateGoal } = useData();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [icon, setIcon] = useState('📱');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTargetAmount(initialData.targetAmount.toString());
      setCurrentAmount(initialData.currentAmount.toString());
      setTargetDate(initialData.targetDate);
      setIcon(initialData.icon || '🎯');
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      setTargetDate(new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0]);
      setIcon('🎯');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Goal title is required.';
    if (!targetAmount || isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      errs.targetAmount = 'Enter a valid target amount.';
    }
    if (!targetDate) errs.targetDate = 'Target date is required.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const gData = {
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      targetDate,
      icon: icon || '🎯',
    };

    if (initialData) {
      updateGoal(initialData.id, gData);
    } else {
      addGoal(gData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Savings Goal' : 'Create Savings Goal'}
      subtitle="Track milestones for major purchases or investments"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Input
            label="Icon / Emoji"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-16 text-center"
          />
          <Input
            label="Goal Title *"
            placeholder="e.g. New iPhone 16 Pro"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            className="flex-1"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Target Amount *"
            type="number"
            step="0.01"
            placeholder="e.g. 5000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            error={errors.targetAmount}
          />
          <Input
            label="Already Saved"
            type="number"
            step="0.01"
            placeholder="0"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />
        </div>

        <Input
          label="Target Date *"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          error={errors.targetDate}
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Update Goal' : 'Save Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
