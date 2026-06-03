import React from 'react';
import GlassCard from '../ui/GlassCard';
import VegBadge from '../ui/VegBadge';
import PriceBadge from '../ui/PriceBadge';

const MenuItemCard = ({ item }) => {
  const { name, price, price_alt, price_label, is_veg, is_popular, note } = item;

  return (
    <GlassCard className="p-5 flex flex-col justify-between gap-4 h-full relative overflow-hidden group">
      {/* Popular Badge decoration */}
      {is_popular && (
        <div className="absolute top-0 right-0 bg-amber-brand text-black text-[9px] font-bold tracking-widest px-3 py-1 rounded-bl-lg uppercase shadow-md animate-pulse">
          ★ Popular
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <VegBadge isVeg={is_veg} />
            <h3 className="text-white/90 font-medium text-base group-hover:text-white transition-colors duration-200">
              {name}
            </h3>
          </div>
          {note && (
            <p className="text-white/50 text-xs italic font-normal leading-relaxed">
              {note}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between mt-2 pt-2 border-t border-white/5">
        <PriceBadge price={price} priceAlt={price_alt} priceLabel={price_label} />
      </div>
    </GlassCard>
  );
};

export default MenuItemCard;
