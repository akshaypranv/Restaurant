import React from 'react';
import MenuItemCard from './MenuItemCard';

const MenuSection = ({ categoryName, items = [], vegOnly = false }) => {
  // Filter items based on vegOnly prop.
  const displayedItems = vegOnly ? items.filter(item => item.is_veg) : items;

  if (displayedItems.length === 0) return null;

  return (
    <section className="mb-12 w-full">
      {categoryName && (
        <h2 className="text-text-dark font-bold text-lg tracking-wide uppercase mb-6 border-l-4 border-brand-red pl-3">
          {categoryName}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
