import React from 'react';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div 
        className={`rounded-full border-amber-brand/20 border-t-amber-brand animate-spin ${sizeClasses[size] || sizeClasses.md}`}
      />
    </div>
  );
};

export default LoadingSpinner;
