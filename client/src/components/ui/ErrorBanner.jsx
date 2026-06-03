import React from 'react';

const ErrorBanner = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 backdrop-blur-md flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <span className="text-lg">⚠️</span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="text-red-200/60 hover:text-red-200 hover:bg-white/5 rounded-full p-1 transition-colors"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
