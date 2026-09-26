import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 glass-card rounded-2xl my-4 border border-dashed border-gray-800 light:border-gray-300">
      <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-4 light:bg-indigo-50 light:text-indigo-600">
        {icon}
      </div>
      <h4 className="text-lg font-bold text-gray-200 light:text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-400 light:text-gray-600 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
