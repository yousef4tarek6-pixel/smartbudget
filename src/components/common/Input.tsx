import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  endIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-gray-300 light:text-gray-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-gray-400 pointer-events-none">{icon}</div>}
        <input
          id={inputId}
          className={`w-full bg-gray-800/80 light:bg-gray-50 border ${
            error ? 'border-rose-500' : 'border-gray-700/80 light:border-gray-300'
          } rounded-xl px-3.5 py-2.5 text-sm text-gray-100 light:text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all ${
            icon ? 'pl-10' : ''
          } ${endIcon ? 'pr-10' : ''} ${className}`}
          {...props}
        />
        {endIcon && <div className="absolute right-3 text-gray-400">{endIcon}</div>}
      </div>
      {error && <span className="text-xs font-medium text-rose-500">{error}</span>}
    </div>
  );
};
