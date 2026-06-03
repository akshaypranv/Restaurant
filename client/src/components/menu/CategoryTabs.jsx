import React from 'react';
import useMenuStore from '../../store/useMenuStore';

const CategoryTabs = ({ categories = [] }) => {
  const { activeCategory, setActiveCategory } = useMenuStore();

  const allTabs = [
    { id: 'all', name: 'All Items', slug: 'all' },
    ...categories
  ];

  return (
    <div className="w-full border-b border-white/10 pb-2 mb-8">
      <div 
        className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allTabs.map((tab) => {
          const isActive = activeCategory === tab.slug;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.slug)}
              className={`snap-start flex-shrink-0 text-sm md:text-base font-medium tracking-wide uppercase px-2 py-3 border-b-2 transition-all duration-200 outline-none
                ${isActive 
                  ? 'border-amber-brand text-white' 
                  : 'border-transparent text-white/50 hover:text-white/80'}`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;
