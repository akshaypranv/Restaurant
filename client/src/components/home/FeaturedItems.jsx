import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItemCard from '../menu/MenuItemCard';
import GlassCard from '../ui/GlassCard';

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
          <span className="text-xs font-semibold tracking-widest text-amber-brand uppercase mb-2 block">
            Chef's Choices
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#F5F0E8] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Signature Specialties
          </h2>
          <p className="text-sm md:text-base text-[#8A8070] max-w-xl">
            A hand-picked selection of our most-loved dishes and crafted beverages.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[1, 2, 3].map(n => (
              <GlassCard key={n} className="p-5 flex flex-col gap-4 h-[160px] animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-sm bg-white/10" />
                  <div className="h-5 bg-white/10 rounded w-2/3" />
                </div>
                <div className="h-4 bg-white/5 rounded w-1/2" />
                <div className="h-6 bg-white/10 rounded w-1/4 mt-auto" />
              </GlassCard>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <GlassCard className="p-6 text-center text-red-400 max-w-md">
            <p className="text-sm">{error}</p>
          </GlassCard>
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
              <div className="col-span-3 text-center text-white/40 text-sm py-8">
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
