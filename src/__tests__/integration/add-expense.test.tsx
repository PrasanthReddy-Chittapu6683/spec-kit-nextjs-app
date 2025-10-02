/**
 * Integration test for "add expense" flow
 *
 * Tests the complete user flow of adding a new expense:
 * - Filling out the form
 * - Submitting the form
 * - Verifying the expense appears in the list
 * - Verifying totals update correctly
 * - Verifying localStorage is updated
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';

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

describe('Add Expense Integration Test', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
  });

  it('should add a new expense through the form', async () => {
    const user = userEvent.setup();

    // Render the dashboard
    render(<Home />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading expenses...')).not.toBeInTheDocument();
    });

    // Verify initial state - should show empty state
    expect(screen.getByText(/No expenses yet/i)).toBeInTheDocument();

    // Verify initial totals are $0.00 (will appear multiple times for each category)
    expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0);

    // Fill out the form
    const amountInput = screen.getByLabelText(/amount/i);
    const dateInput = screen.getByLabelText(/date/i);
    const categorySelect = screen.getByLabelText(/category/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.clear(amountInput);
    await user.type(amountInput, '42.99');

    await user.clear(dateInput);
    await user.type(dateInput, '2025-10-01');

    await user.selectOptions(categorySelect, 'Food');

    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Lunch at cafe');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    // Wait for the expense to appear in the list
    await waitFor(() => {
      expect(screen.queryByText(/No expenses yet/i)).not.toBeInTheDocument();
    });

    // Verify the expense appears in the list (may appear multiple times due to responsive design)
    expect(screen.getAllByText('$42.99').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Food').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Lunch at cafe').length).toBeGreaterThan(0);

    // Verify the form has been cleared
    expect(amountInput).toHaveValue(null);
    expect(dateInput).toHaveValue('');
    expect(categorySelect).toHaveValue('');
    expect(descriptionInput).toHaveValue('');

    // Verify totals have updated
    // The total should now show $42.99
    const totalElements = screen.getAllByText('$42.99');
    expect(totalElements.length).toBeGreaterThan(0);

    // Verify localStorage has been updated
    const storedData = localStorageMock.getItem('expenses');
    expect(storedData).not.toBeNull();

    if (storedData) {
      const expenses = JSON.parse(storedData);
      expect(expenses).toHaveLength(1);
      expect(expenses[0].amount).toBe(42.99);
      expect(expenses[0].category).toBe('Food');
      expect(expenses[0].description).toBe('Lunch at cafe');
      expect(expenses[0].date).toBe('2025-10-01');
      expect(expenses[0].id).toBeDefined();
      expect(expenses[0].createdAt).toBeDefined();
    }
  });

  it('should add multiple expenses and update totals correctly', async () => {
    const user = userEvent.setup();

    render(<Home />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading expenses...')).not.toBeInTheDocument();
    });

    // Add first expense
    await user.type(screen.getByLabelText(/amount/i), '100');
    await user.type(screen.getByLabelText(/date/i), '2025-10-01');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Food');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    // Wait for first expense to appear
    await waitFor(() => {
      expect(screen.getAllByText('$100.00').length).toBeGreaterThan(0);
    });

    // Add second expense
    await user.type(screen.getByLabelText(/amount/i), '50');
    await user.type(screen.getByLabelText(/date/i), '2025-10-02');
    await user.selectOptions(screen.getByLabelText(/category/i), 'Transport');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    // Wait for second expense to appear
    await waitFor(() => {
      expect(screen.getAllByText('$50.00').length).toBeGreaterThan(0);
    });

    // Verify localStorage has both expenses
    const storedData = localStorageMock.getItem('expenses');
    expect(storedData).not.toBeNull();

    if (storedData) {
      const expenses = JSON.parse(storedData);
      expect(expenses).toHaveLength(2);
    }

    // Verify overall total is $150.00
    expect(screen.getAllByText('$150.00').length).toBeGreaterThan(0);
  });
});
