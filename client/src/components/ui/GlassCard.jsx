import React from 'react';

const GlassCard = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`
        backdrop-blur-[12px]
        bg-white/[0.08]
        border border-white/[0.15]
        rounded-2xl
        hover:bg-white/[0.12]
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
