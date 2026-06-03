import React from 'react';

const VegBadge = ({ isVeg }) => {
  return (
    <div
      data-testid="veg-badge"
      className={`w-4 h-4 border-2 flex items-center justify-center flex-shrink-0 rounded-sm
        ${isVeg ? 'border-green-500' : 'border-red-500'}`}
    >
      <div className={`w-2 h-2 rounded-full ${isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
    </div>
  );
};

export default VegBadge;
