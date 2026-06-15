import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import CategoryTabs from '../components/menu/CategoryTabs';

// Declare mock with prefix so hoisting is supported
const mockSetActiveCategory = vi.fn();

// Mock the store
vi.mock('../store/useMenuStore', () => {
  return {
    default: () => ({
      activeCategory: 'all',
      setActiveCategory: mockSetActiveCategory
    })
  };
});

describe('CategoryTabs Component', () => {
  test('renders all categories including All Items', () => {
    const categories = [
      { id: 1, name: 'Soups', slug: 'soups' },
      { id: 2, name: 'Veg Starters', slug: 'veg-starters' }
    ];

    render(<CategoryTabs categories={categories} />);
    
    expect(screen.getByText('All Items')).toBeInTheDocument();
    expect(screen.getByText('Soups')).toBeInTheDocument();
    expect(screen.getByText('Veg Starters')).toBeInTheDocument();
  });

  test('clicking a tab triggers setActiveCategory', async () => {
    const categories = [
      { id: 1, name: 'Soups', slug: 'soups' }
    ];

    render(<CategoryTabs categories={categories} />);
    
    const soupsTab = screen.getByText('Soups');
    await userEvent.click(soupsTab);
    
    expect(mockSetActiveCategory).toHaveBeenCalledWith('soups');
  });
});
