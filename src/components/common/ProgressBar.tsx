import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100+
  color?: string;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  showLabel = false,
  height = 'md',
  className = '',
}) => {
  const clamped = Math.min(Math.max(0, progress), 100);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  // Determine auto-color if not passed
  let barColor = color;
  if (!barColor) {
    if (progress > 100) barColor = '#EF4444'; // Red alert
    else if (progress >= 80) barColor = '#F59E0B'; // Amber warning
    else barColor = '#10B981'; // Emerald normal
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1 text-gray-400 light:text-gray-600">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-800 light:bg-gray-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};
