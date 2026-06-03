import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import MenuSection from '../components/menu/MenuSection';
import VegToggle from '../components/menu/VegToggle';

// Mock Zustand store for VegToggle test
vi.mock('../../store/useMenuStore', () => ({
  default: () => ({
    vegFilter: false,
    setVegFilter: vi.fn()
  })
}));

describe('VegToggle and Veg Filtering', () => {
  test('VegToggle filters out non-veg items from displayed list', () => {
    const items = [
      { id: 1, name: 'Paneer Tikka', is_veg: true, price: 275 },
      { id: 2, name: 'Chicken Tikka', is_veg: false, price: 290 },
    ];
    render(<MenuSection items={items} vegOnly={true} />);
    expect(screen.getByText('Paneer Tikka')).toBeInTheDocument();
    expect(screen.queryByText('Chicken Tikka')).not.toBeInTheDocument();
  });

  test('VegToggle renders correctly', () => {
    render(<VegToggle />);
    expect(screen.getByText(/Veg Only/i)).toBeInTheDocument();
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });
});
