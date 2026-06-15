import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItemCard from '../menu/MenuItemCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const FeaturedItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/menu?featured=true`);
        if (response.data && response.data.status === 'success') {
          // Flatten items from categories
          const categories = response.data.data;
          const flatItems = categories.flatMap(cat => cat.items);
          setItems(flatItems);
        } else {
          throw new Error('Failed to load signature items');
        }
      } catch (err) {
        setError(err.message || 'Error loading signature items');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="w-full py-16 px-6 bg-transparent">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Title Block */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-brand-red uppercase mb-2 block">
            Chef's Choices
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-text-dark mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Signature Specialties
          </h2>
          <p className="text-sm md:text-base text-accent-taupe max-w-xl">
            A hand-picked selection of our most-loved dishes and crafted beverages.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[1, 2, 3].map(n => (
              <div key={n} className="card p-5 flex flex-col gap-4 h-[160px] animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-sm bg-surface-gray" />
                  <div className="h-5 bg-surface-gray rounded w-2/3" />
                </div>
                <div className="h-4 bg-surface-gray/50 rounded w-1/2" />
                <div className="h-6 bg-surface-gray rounded w-1/4 mt-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="card p-6 text-center text-red-500 max-w-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {items.slice(0, 3).map(item => (
              <div key={item.id} className="h-full">
                <MenuItemCard item={item} />
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-3 text-center text-accent-taupe text-sm py-8">
                No featured items available today.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedItems;
