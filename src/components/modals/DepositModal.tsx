import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { SavingsGoal } from '../../types';
import { useData } from '../../context/DataContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal | null;
  mode: 'deposit' | 'withdraw';
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  goal,
  mode,
}) => {
  const { depositToGoal, withdrawFromGoal } = useData();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  if (!goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    if (mode === 'deposit') {
      depositToGoal(goal.id, val);
    } else {
      withdrawFromGoal(goal.id, val);
    }

    setAmount('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'deposit' ? `Deposit into ${goal.title}` : `Withdraw from ${goal.title}`}
      subtitle={`Current balance: ${goal.currentAmount.toLocaleString()}`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label={`${mode === 'deposit' ? 'Deposit' : 'Withdrawal'} Amount *`}
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={error}
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant={mode === 'deposit' ? 'emerald' : 'danger'}>
            Confirm {mode === 'deposit' ? 'Deposit' : 'Withdrawal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
