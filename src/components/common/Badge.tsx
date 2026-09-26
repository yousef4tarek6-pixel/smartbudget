import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'income' | 'expense' | 'warning' | 'alert' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
}) => {
  const styles = {
    income: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 light:bg-emerald-50 light:text-emerald-700',
    expense: 'bg-rose-500/10 text-rose-400 border-rose-500/20 light:bg-rose-50 light:text-rose-700',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20 light:bg-amber-50 light:text-amber-700',
    alert: 'bg-red-500/10 text-red-400 border-red-500/20 light:bg-red-50 light:text-red-700',
    info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 light:bg-indigo-50 light:text-indigo-700',
    neutral: 'bg-gray-800 text-gray-300 border-gray-700 light:bg-gray-100 light:text-gray-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-lg border ${styles[variant]} ${sizes[size]}`}
    >
      {icon}
      {children}
    </span>
  );
};
