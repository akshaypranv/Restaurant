import React from 'react';
import useMenuStore from '../store/useMenuStore';
import useMenuData from '../hooks/useMenuData';
import SearchBar from '../components/menu/SearchBar';
import SearchResults from '../components/menu/SearchResults';
import CategoryTabs from '../components/menu/CategoryTabs';
import VegToggle from '../components/menu/VegToggle';
import MenuSection from '../components/menu/MenuSection';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorBanner from '../components/ui/ErrorBanner';

const MenuPage = () => {
  const { activeCategory, searchQuery, vegFilter } = useMenuStore();
  // Fetch full categorized menu
  const { data: menuCategories, loading, error } = useMenuData(vegFilter);

  // Extract category list (excluding item content) for the tabs
  const tabCategories = menuCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug
  }));

  const isSearching = searchQuery && searchQuery.trim().length >= 2;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Search Section */}
      <SearchBar />

      {error && <ErrorBanner message={error} />}

      {isSearching ? (
        <SearchResults />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <CategoryTabs categories={tabCategories} />
            <div className="flex justify-end md:pb-2">
              <VegToggle />
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="text-white/50 text-sm mt-4 animate-pulse">Loading cafe menu...</p>
            </div>
          ) : (
            <div className="w-full">
              {activeCategory === 'all' ? (
                // Display all categories
                menuCategories.map((category) => (
                  <MenuSection
                    key={category.id}
                    categoryName={category.name}
                    items={category.items}
                    vegOnly={false} // vegFilter is handled at API level, but we keep it safe
                  />
                ))
              ) : (
                // Display single active category
                (() => {
                  const targetCat = menuCategories.find(cat => cat.slug === activeCategory);
                  return targetCat ? (
                    <MenuSection
                      categoryName={targetCat.name}
                      items={targetCat.items}
                      vegOnly={false}
                    />
                  ) : (
                    <p className="text-center text-white/40 py-12">Category not found.</p>
                  );
                })()
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MenuPage;
