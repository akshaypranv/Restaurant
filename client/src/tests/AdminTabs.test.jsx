import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';

// Mock all child components to isolate tab logic
vi.mock('../components/admin/AdminLogin', () => ({
  default: () => <div data-testid="admin-login">Login</div>
}));
vi.mock('../components/admin/AdminMenuTable', () => ({
  default: () => <div data-testid="admin-menu-table">Menu Table</div>
}));
vi.mock('../components/admin/AdminMessagesPanel', () => ({
  default: () => <div data-testid="admin-messages-panel">Messages Panel</div>
}));
vi.mock('../components/admin/AddItemModal', () => ({
  default: () => null
}));
vi.mock('../components/admin/EditItemModal', () => ({
  default: () => null
}));
vi.mock('../components/ui/LoadingSpinner', () => ({
  default: () => null
}));
vi.mock('../components/ui/ErrorBanner', () => ({
  default: () => null
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { status: 'success', data: [] } }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

// Mock store — simulate logged-in admin
vi.mock('../store/useMenuStore', () => ({
  default: () => ({
    adminToken: 'mock-admin-token',
    setAdminToken: vi.fn(),
    currentView: 'admin',
    setCurrentView: vi.fn()
  })
}));

import AdminPage from '../pages/AdminPage';

describe('AdminPage — Tab Navigation', () => {
  test('renders both "Menu Items" and "Messages" tab buttons', async () => {
    render(<AdminPage />);

    expect(screen.getByRole('button', { name: /menu items/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /messages/i })).toBeInTheDocument();
  });

  test('defaults to the "Menu Items" tab being active', async () => {
    render(<AdminPage />);

    // Wait for the async loading to resolve and menu table to render
    const menuTable = await screen.findByTestId('admin-menu-table');
    expect(menuTable).toBeInTheDocument();
    // Messages panel should NOT be in the DOM
    expect(screen.queryByTestId('admin-messages-panel')).not.toBeInTheDocument();
  });

  test('clicking "Messages" tab switches to messages view', async () => {
    const user = userEvent.setup();
    render(<AdminPage />);

    // Wait for initial load to finish
    await screen.findByTestId('admin-menu-table');

    const messagesTab = screen.getByRole('button', { name: /messages/i });
    await user.click(messagesTab);

    // Messages panel should now be visible
    expect(screen.getByTestId('admin-messages-panel')).toBeInTheDocument();
    // Menu table should be gone
    expect(screen.queryByTestId('admin-menu-table')).not.toBeInTheDocument();
  });
});
