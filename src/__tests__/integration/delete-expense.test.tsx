/**
 * Integration test for "delete expense" flow
 *
 * Tests the complete user flow of deleting an expense:
 * - Pre-populating localStorage with test data
 * - Rendering the dashboard
 * - Clicking the delete button
 * - Verifying the expense is removed from the list
 * - Verifying totals are recalculated
 * - Verifying localStorage is updated
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import type { Expense } from '@/server/types/expense';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock window.confirm
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

describe('Delete Expense Integration Test', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    mockConfirm.mockClear();
  });

  it('should delete an expense when delete button is clicked', async () => {
    const user = userEvent.setup();

    // Pre-populate localStorage with test expenses
    const testExpenses: Expense[] = [
      {
        id: 'expense-1',
        amount: 50.0,
        date: '2025-10-01',
        category: 'Food',
        description: 'Groceries',
        createdAt: '2025-10-01T10:00:00.000Z',
      },
      {
        id: 'expense-2',
        amount: 30.0,
        date: '2025-10-02',
        category: 'Transport',
        description: 'Bus fare',
        createdAt: '2025-10-02T10:00:00.000Z',
      },
    ];

    localStorageMock.setItem('expenses', JSON.stringify(testExpenses));

    // Mock confirm to return true (user confirms deletion)
    mockConfirm.mockReturnValue(true);

    // Render the dashboard
    render(<Home />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading expenses...')).not.toBeInTheDocument();
    });

    // Verify both expenses are displayed (may appear multiple times due to responsive design)
    expect(screen.getAllByText('Groceries').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bus fare').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$80.00').length).toBeGreaterThan(0); // Total

    // Find and click the delete button for the first expense (Bus fare - newest first)
    // Note: Delete buttons appear multiple times (table view + card view for responsive design)
    // Expenses are sorted newest first, so Bus fare (Oct 2) appears before Groceries (Oct 1)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    expect(deleteButtons.length).toBeGreaterThanOrEqual(2);

    await user.click(deleteButtons[0]);

    // Verify confirm was called with expense description
    expect(mockConfirm).toHaveBeenCalledTimes(1);
    expect(mockConfirm).toHaveBeenCalledWith('Delete expense: Bus fare?');

    // Wait for the expense to be removed
    await waitFor(() => {
      expect(screen.queryByText('Bus fare')).not.toBeInTheDocument();
    });

    // Verify the remaining expense is still displayed
    expect(screen.getAllByText('Groceries').length).toBeGreaterThan(0);

    // Verify the total has been recalculated (should be $50.00 for Groceries)
    expect(screen.getAllByText('$50.00').length).toBeGreaterThan(0);

    // Verify localStorage has been updated
    const storedData = localStorageMock.getItem('expenses');
    expect(storedData).not.toBeNull();

    if (storedData) {
      const expenses = JSON.parse(storedData);
      expect(expenses).toHaveLength(1);
      expect(expenses[0].id).toBe('expense-1');
      expect(expenses[0].description).toBe('Groceries');
    }
  });

  it('should not delete expense when user cancels confirmation', async () => {
    const user = userEvent.setup();

    // Pre-populate localStorage
    const testExpenses: Expense[] = [
      {
        id: 'expense-1',
        amount: 50.0,
        date: '2025-10-01',
        category: 'Food',
        description: 'Groceries',
        createdAt: '2025-10-01T10:00:00.000Z',
      },
    ];

    localStorageMock.setItem('expenses', JSON.stringify(testExpenses));

    // Mock confirm to return false (user cancels deletion)
    mockConfirm.mockReturnValue(false);

    render(<Home />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading expenses...')).not.toBeInTheDocument();
    });

    // Verify expense is displayed
    expect(screen.getAllByText('Groceries').length).toBeGreaterThan(0);

    // Click the delete button (use getAllByRole since responsive design creates multiple buttons)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Verify confirm was called
    expect(mockConfirm).toHaveBeenCalledTimes(1);

    // Expense should still be displayed (not deleted)
    expect(screen.getAllByText('Groceries').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$50.00').length).toBeGreaterThan(0);

    // Verify localStorage still has the expense
    const storedData = localStorageMock.getItem('expenses');
    expect(storedData).not.toBeNull();

    if (storedData) {
      const expenses = JSON.parse(storedData);
      expect(expenses).toHaveLength(1);
      expect(expenses[0].id).toBe('expense-1');
    }
  });

  it('should delete all expenses and show empty state', async () => {
    const user = userEvent.setup();

    // Pre-populate localStorage with a single expense
    const testExpenses: Expense[] = [
      {
        id: 'expense-1',
        amount: 50.0,
        date: '2025-10-01',
        category: 'Food',
        description: 'Groceries',
        createdAt: '2025-10-01T10:00:00.000Z',
      },
    ];

    localStorageMock.setItem('expenses', JSON.stringify(testExpenses));
    mockConfirm.mockReturnValue(true);

    render(<Home />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading expenses...')).not.toBeInTheDocument();
    });

    // Delete the expense (use getAllByRole since responsive design creates multiple buttons)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Wait for empty state to appear
    await waitFor(() => {
      expect(screen.getByText(/No expenses yet/i)).toBeInTheDocument();
    });

    // Verify totals are $0.00 (will appear multiple times for each category)
    expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0);

    // Verify localStorage is empty or has empty array
    const storedData = localStorageMock.getItem('expenses');
    if (storedData) {
      const expenses = JSON.parse(storedData);
      expect(expenses).toHaveLength(0);
    }
  });
});
