import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import SearchBar from '../components/menu/SearchBar';

// Mock the Zustand store so it doesn't try to access real localStorage/sessions
vi.mock('../../store/useMenuStore', () => ({
  default: () => ({
    searchQuery: '',
    setSearchQuery: vi.fn()
  })
}));

describe('SearchBar Component', () => {
  test('Does not call API when query is less than 2 characters', async () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} />);
    
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'a');
    
    // Fast-forward or wait a moment to ensure it is not called
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(mockSearch).not.toHaveBeenCalled();
  });

  test('Calls API after debounce delay with valid query', async () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} />);
    
    const input = screen.getByRole('searchbox');
    await userEvent.type(input, 'paneer');
    
    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('paneer');
    }, { timeout: 600 });
  });
});
