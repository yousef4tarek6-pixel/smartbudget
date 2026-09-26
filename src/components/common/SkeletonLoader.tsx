import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = 'h-12 w-full', count = 1 }) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-gray-800/60 light:bg-gray-200 animate-pulse rounded-xl ${className}`}
        />
      ))}
    </div>
  );
};
