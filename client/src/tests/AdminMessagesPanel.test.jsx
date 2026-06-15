import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import AdminMessagesPanel from '../components/admin/AdminMessagesPanel';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn()
  }
}));

import axios from 'axios';

const mockMessages = [
  {
    id: 1,
    name: 'Meera',
    email: 'meera@example.com',
    subject: 'Reservation',
    message: 'I would like to book a table for 4 this Saturday.',
    read: false,
    created_at: '2026-06-14T10:00:00Z'
  },
  {
    id: 2,
    name: 'Raj',
    email: 'raj@example.com',
    subject: 'Feedback',
    message: 'Great coffee, loved the ambiance!',
    read: true,
    created_at: '2026-06-13T08:30:00Z'
  }
];

describe('AdminMessagesPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders table headers (Name, Subject, Date, Status)', async () => {
    axios.get.mockResolvedValueOnce({ data: { status: 'success', data: [] } });

    render(<AdminMessagesPanel adminToken="test-token" />);

    // Wait for loading to finish
    const nameHeader = await screen.findByText('Name');
    expect(nameHeader).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  test('shows empty state when there are no messages', async () => {
    axios.get.mockResolvedValueOnce({ data: { status: 'success', data: [] } });

    render(<AdminMessagesPanel adminToken="test-token" />);

    const emptyMessage = await screen.findByText(/no messages yet/i);
    expect(emptyMessage).toBeInTheDocument();
  });

  test('renders message rows with correct content', async () => {
    axios.get.mockResolvedValueOnce({ data: { status: 'success', data: mockMessages } });

    render(<AdminMessagesPanel adminToken="test-token" />);

    const meera = await screen.findByText('Meera');
    expect(meera).toBeInTheDocument();
    expect(screen.getByText('Raj')).toBeInTheDocument();
    expect(screen.getByText('Reservation')).toBeInTheDocument();
    expect(screen.getByText('Feedback')).toBeInTheDocument();
  });

  test('displays Unread badge for unread messages and Read badge for read messages', async () => {
    axios.get.mockResolvedValueOnce({ data: { status: 'success', data: mockMessages } });

    render(<AdminMessagesPanel adminToken="test-token" />);

    const unreadBadge = await screen.findByText('Unread');
    expect(unreadBadge).toBeInTheDocument();

    const readBadge = screen.getByText('Read');
    expect(readBadge).toBeInTheDocument();
  });

  test('expands a message row on click to show full message body', async () => {
    axios.get.mockResolvedValueOnce({ data: { status: 'success', data: mockMessages } });
    const user = userEvent.setup();

    render(<AdminMessagesPanel adminToken="test-token" />);

    // Wait for rows to appear
    const meeraRow = await screen.findByText('Meera');
    await user.click(meeraRow);

    // The full message body should now be visible
    const messageBody = await screen.findByText('I would like to book a table for 4 this Saturday.');
    expect(messageBody).toBeInTheDocument();
  });

  test('calls mark-as-read API when button is clicked', async () => {
    axios.get.mockResolvedValueOnce({ data: { status: 'success', data: mockMessages } });
    axios.put.mockResolvedValueOnce({ data: { status: 'success', data: { ...mockMessages[0], read: true } } });

    const user = userEvent.setup();
    render(<AdminMessagesPanel adminToken="test-token" />);

    // Expand the unread message first
    const meeraRow = await screen.findByText('Meera');
    await user.click(meeraRow);

    // Click the Mark as Read button
    const markReadBtn = await screen.findByRole('button', { name: /mark as read/i });
    await user.click(markReadBtn);

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/contact/1/read'),
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
  });
});
