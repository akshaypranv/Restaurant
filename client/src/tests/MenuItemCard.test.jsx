import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import PriceBadge from '../components/ui/PriceBadge';
import MenuItemCard from '../components/menu/MenuItemCard';

describe('PriceBadge and MenuItemCard Component', () => {
  test('Dual price displays correctly as ₹150 / ₹190', () => {
    render(<PriceBadge price={150} priceAlt={190} priceLabel="VEG / CHICKEN" />);
    expect(screen.getByText(/₹150 \/ ₹190/)).toBeInTheDocument();
  });

  test('MenuItemCard renders item details correctly', () => {
    const item = {
      id: 1,
      name: 'Paneer Tikka',
      price: 275,
      price_alt: null,
      price_label: null,
      is_veg: true,
      is_popular: true,
      note: 'Delicious paneer chunks'
    };
    render(<MenuItemCard item={item} />);
    
    expect(screen.getByText('Paneer Tikka')).toBeInTheDocument();
    expect(screen.getByText('Delicious paneer chunks')).toBeInTheDocument();
    expect(screen.getByText('★ Popular')).toBeInTheDocument();
  });
});
