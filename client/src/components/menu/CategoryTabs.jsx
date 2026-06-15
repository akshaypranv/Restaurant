import React from 'react';
import useMenuStore from '../../store/useMenuStore';

const CategoryTabs = ({ categories = [] }) => {
  const { activeCategory, setActiveCategory } = useMenuStore();

  const allTabs = [
    { id: 'all', name: 'All Items', slug: 'all' },
    ...categories
  ];

  return (
    <div className="flex-1 min-w-0">
      <div 
        className="flex items-center gap-4 md:gap-6 overflow-x-auto category-scrollbar snap-x snap-mandatory scroll-smooth pb-3"
      >
        {allTabs.map((tab) => {
          const isActive = activeCategory === tab.slug;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.slug)}
              className={`snap-start flex-shrink-0 text-sm md:text-base font-medium tracking-wide uppercase px-2 py-3 border-b-2 transition-all duration-200 outline-none
                ${isActive 
                  ? 'border-brand-red text-brand-red font-semibold' 
                  : 'border-transparent text-accent-taupe hover:text-text-dark'}`}
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
