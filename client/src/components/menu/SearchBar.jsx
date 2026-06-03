import React, { useState, useEffect } from 'react';
import useMenuStore from '../../store/useMenuStore';
import { sanitiseInput } from '../../utils/sanitiseInput';

const SearchBar = ({ onSearch }) => {
  const { searchQuery, setSearchQuery } = useMenuStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Sync local query if store query is reset (like when switching categories)
  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const sanitised = sanitiseInput(localQuery);
      
      // Execute callback or update store only if query is valid
      if (sanitised.length >= 2) {
        if (onSearch) {
          onSearch(sanitised);
        } else {
          setSearchQuery(sanitised);
        }
      } else {
        // If query is empty or 1 char, we clear the active search
        if (!onSearch) {
          setSearchQuery('');
        }
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localQuery, onSearch, setSearchQuery]);

  return (
    <div className="w-full max-w-2xl mx-auto sticky top-4 z-40 mb-8 px-4 md:px-0">
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl flex items-center px-4 py-3 shadow-xl focus-within:ring-2 focus-within:ring-amber-brand/50 transition-all duration-300">
        <span className="text-white/40 text-lg mr-3">🔍</span>
        <input
          type="search"
          role="searchbox"
          placeholder="Search dishes (e.g. momos, paneer, coffee)..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="bg-transparent text-white placeholder-white/40 text-sm md:text-base outline-none w-full font-normal"
        />
        {localQuery && (
          <button
            onClick={() => setLocalQuery('')}
            className="text-white/40 hover:text-white/80 p-1"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
