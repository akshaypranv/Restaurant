import React from 'react';
import useMenuStore from '../../store/useMenuStore';
import VegBadge from '../ui/VegBadge';

const VegToggle = () => {
  const { vegFilter, setVegFilter } = useMenuStore();

  return (
    <div className="flex items-center gap-3 bg-surface-gray/50 border border-surface-gray rounded-full px-4 py-2 select-none">
      <VegBadge isVeg={true} />
      <span className="text-text-dark text-xs font-medium uppercase tracking-wider">
        Veg Only
      </span>
      <button
        role="switch"
        aria-checked={vegFilter}
        onClick={() => setVegFilter(!vegFilter)}
        className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 outline-none focus:ring-2 focus:ring-brand-red/50
          ${vegFilter ? 'bg-green-600' : 'bg-surface-gray'}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300
            ${vegFilter ? 'translate-x-4' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
};

export default VegToggle;
