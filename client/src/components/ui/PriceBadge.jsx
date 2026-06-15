import React from 'react';
import { formatPrice } from '../../utils/formatPrice';

const PriceBadge = ({ price, priceAlt, priceLabel }) => {
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-brand-red font-semibold tracking-wide">
        {formatPrice(price, priceAlt)}
      </span>
      {priceLabel && (
        <span className="text-accent-taupe text-[10px] tracking-wider uppercase font-medium">
          {priceLabel}
        </span>
      )}
    </div>
  );
};

export default PriceBadge;
