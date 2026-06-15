import React from 'react';
import useMenuStore from '../../store/useMenuStore';
import useSearch from '../../hooks/useSearch';
import MenuItemCard from './MenuItemCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const SearchResults = () => {
  const { searchQuery, vegFilter } = useMenuStore();
  const { results, loading, error } = useSearch(searchQuery);

  // Apply veg filter client side on search results for responsive experience
  const filteredResults = vegFilter ? results.filter(item => item.is_veg) : results;

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center">
        <LoadingSpinner />
        <p className="text-accent-taupe text-sm mt-3 animate-pulse">Searching menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center text-red-500 font-medium">
        Error searching menu: {error}
      </div>
    );
  }

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-8 pb-2 border-b border-surface-gray">
        <h2 className="text-text-dark font-bold text-lg tracking-wide uppercase">
          Search Results
        </h2>
        <span className="text-brand-red text-sm font-semibold">
          Found {filteredResults.length} {filteredResults.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {filteredResults.length === 0 ? (
        <div className="w-full py-16 text-center text-accent-taupe card rounded-xl">
          <span className="text-4xl block mb-3">🍽️</span>
          <p className="text-sm font-medium">No dishes match "{searchQuery}"</p>
          {vegFilter && (
            <p className="text-xs text-accent-taupe/80 mt-1">
              Try disabling the "Veg Only" toggle to see non-veg results.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
