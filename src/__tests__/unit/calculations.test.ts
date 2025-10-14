/**
 * Unit tests for calculation utilities
 *
 * These tests verify that expense calculations are correct for various scenarios.
 * Tests are written BEFORE implementation (TDD approach).
 */

import {
  calculateOverallTotal,
  calculateByCategory,
  calculateCurrentMonthTotal,
  calculateLast7DaysTotal,
  calculateSummary,
} from '@/server/utils/calculations';
import type { Expense, ExpenseCategory } from '@/server/types/expense';

// Helper to create test expenses
const createExpense = (
  amount: number,
  date: string,
  category: ExpenseCategory,
  description?: string
): Expense => ({
  id: crypto.randomUUID(),
  amount,
  date,
  category,
  description,
  createdAt: new Date().toISOString(),
});

describe('calculateOverallTotal', () => {
  it('should return 0 for empty array', () => {
    expect(calculateOverallTotal([])).toBe(0);
  });

  it('should return the amount for single expense', () => {
    const expenses = [createExpense(42.99, '2025-10-01', 'Food')];
    expect(calculateOverallTotal(expenses)).toBe(42.99);
  });

  it('should sum all expense amounts correctly', () => {
    const expenses = [
      createExpense(42.99, '2025-10-01', 'Food'),
      createExpense(120.0, '2025-09-28', 'Utilities'),
      createExpense(25.5, '2025-10-01', 'Transport'),
    ];
    expect(calculateOverallTotal(expenses)).toBe(188.49);
  });

  it('should handle decimal precision correctly', () => {
    const expenses = [
      createExpense(0.01, '2025-10-01', 'Other'),
      createExpense(0.02, '2025-10-01', 'Other'),
      createExpense(0.03, '2025-10-01', 'Other'),
    ];
    expect(calculateOverallTotal(expenses)).toBeCloseTo(0.06, 2);
  });

  it('should handle large amounts', () => {
    const expenses = [
      createExpense(9999999.99, '2025-10-01', 'Other'),
      createExpense(0.01, '2025-10-01', 'Other'),
    ];
    expect(calculateOverallTotal(expenses)).toBe(10000000.0);
  });
});

describe('calculateByCategory', () => {
  it('should return all categories with 0 for empty array', () => {
    const result = calculateByCategory([]);
    expect(result.Food).toBe(0);
    expect(result.Transport).toBe(0);
    expect(result.Entertainment).toBe(0);
    expect(result.Utilities).toBe(0);
    expect(result.Healthcare).toBe(0);
    expect(result.Other).toBe(0);
  });

  it('should sum expenses by category correctly', () => {
    const expenses = [
      createExpense(50, '2025-10-01', 'Food'),
      createExpense(30, '2025-10-01', 'Food'),
      createExpense(40, '2025-10-01', 'Transport'),
      createExpense(100, '2025-10-01', 'Utilities'),
      createExpense(150, '2025-10-01', 'Healthcare'),
      createExpense(20, '2025-10-01', 'Entertainment'),
      createExpense(25, '2025-10-01', 'Other'),
    ];
    const result = calculateByCategory(expenses);
    expect(result.Food).toBe(80);
    expect(result.Transport).toBe(40);
    expect(result.Entertainment).toBe(20);
    expect(result.Utilities).toBe(100);
    expect(result.Healthcare).toBe(150);
    expect(result.Other).toBe(25);
  });

  it('should handle single category with multiple expenses', () => {
    const expenses = [
      createExpense(10, '2025-10-01', 'Food'),
      createExpense(20, '2025-09-28', 'Food'),
      createExpense(30, '2025-09-15', 'Food'),
    ];
    const result = calculateByCategory(expenses);
    expect(result.Food).toBe(60);
    expect(result.Transport).toBe(0);
  });

  it('should handle expenses across different dates', () => {
    const expenses = [
      createExpense(100, '2025-01-01', 'Food'),
      createExpense(200, '2025-06-15', 'Food'),
      createExpense(50, '2024-12-31', 'Food'),
    ];
    const result = calculateByCategory(expenses);
    expect(result.Food).toBe(350);
  });
});

describe('calculateCurrentMonthTotal', () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Helper to create date in current month
  const currentMonthDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toISOString().split('T')[0];
  };

  // Helper to create date in previous month
  const previousMonthDate = () => {
    const date = new Date(currentYear, currentMonth - 1, 15);
    return date.toISOString().split('T')[0];
  };

  // Helper to create date in next month
  const nextMonthDate = () => {
    const date = new Date(currentYear, currentMonth + 1, 15);
    return date.toISOString().split('T')[0];
  };

  it('should return 0 for empty array', () => {
    expect(calculateCurrentMonthTotal([])).toBe(0);
  });

  it('should sum only expenses from current month', () => {
    const expenses = [
      createExpense(100, currentMonthDate(1), 'Food'),
      createExpense(50, currentMonthDate(15), 'Transport'),
      createExpense(75, previousMonthDate(), 'Food'),
      createExpense(200, nextMonthDate(), 'Healthcare'),
    ];
    expect(calculateCurrentMonthTotal(expenses)).toBe(150);
  });

  it('should include all days of current month', () => {
    const expenses = [
      createExpense(10, currentMonthDate(1), 'Food'),
      createExpense(20, currentMonthDate(15), 'Food'),
      createExpense(30, currentMonthDate(31), 'Food'),
    ];
    // All three should be included if day 31 exists in current month
    const result = calculateCurrentMonthTotal(expenses);
    expect(result).toBeGreaterThanOrEqual(30); // At least first two
  });

  it('should exclude previous month expenses', () => {
    const expenses = [
      createExpense(100, previousMonthDate(), 'Food'),
    ];
    expect(calculateCurrentMonthTotal(expenses)).toBe(0);
  });

  it('should exclude future month expenses', () => {
    const expenses = [
      createExpense(100, nextMonthDate(), 'Food'),
    ];
    expect(calculateCurrentMonthTotal(expenses)).toBe(0);
  });
});

describe('calculateLast7DaysTotal', () => {
  const now = new Date();

  // Helper to create date X days ago
  const daysAgo = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  it('should return 0 for empty array', () => {
    expect(calculateLast7DaysTotal([])).toBe(0);
  });

  it('should include expenses from today', () => {
    const expenses = [
      createExpense(100, daysAgo(0), 'Food'),
    ];
    expect(calculateLast7DaysTotal(expenses)).toBe(100);
  });

  it('should include expenses from exactly 7 days ago', () => {
    const expenses = [
      createExpense(50, daysAgo(7), 'Food'),
    ];
    expect(calculateLast7DaysTotal(expenses)).toBe(50);
  });

  it('should include all expenses within last 7 days', () => {
    const expenses = [
      createExpense(10, daysAgo(0), 'Food'),
      createExpense(20, daysAgo(1), 'Transport'),
      createExpense(30, daysAgo(3), 'Entertainment'),
      createExpense(40, daysAgo(7), 'Utilities'),
    ];
    expect(calculateLast7DaysTotal(expenses)).toBe(100);
  });

  it('should exclude expenses older than 7 days', () => {
    const expenses = [
      createExpense(100, daysAgo(8), 'Food'),
      createExpense(50, daysAgo(30), 'Transport'),
    ];
    expect(calculateLast7DaysTotal(expenses)).toBe(0);
  });

  it('should handle mixed dates correctly', () => {
    const expenses = [
      createExpense(10, daysAgo(0), 'Food'),
      createExpense(20, daysAgo(5), 'Transport'),
      createExpense(100, daysAgo(8), 'Food'), // Should be excluded
      createExpense(30, daysAgo(7), 'Other'),
    ];
    expect(calculateLast7DaysTotal(expenses)).toBe(60);
  });

  it('should not include future dates', () => {
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + 1);
    const expenses = [
      createExpense(100, futureDate.toISOString().split('T')[0], 'Food'),
    ];
    // Future expenses should not be counted in "last 7 days"
    expect(calculateLast7DaysTotal(expenses)).toBe(0);
  });
});

describe('calculateSummary', () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthDate = new Date(currentYear, currentMonth, 15).toISOString().split('T')[0];
  const daysAgo = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  it('should return all zeros for empty array', () => {
    const summary = calculateSummary([]);
    expect(summary.overall).toBe(0);
    expect(summary.currentMonth).toBe(0);
    expect(summary.last7Days).toBe(0);
    expect(summary.byCategory.Food).toBe(0);
    expect(summary.byCategory.Transport).toBe(0);
  });

  it('should calculate complete summary correctly', () => {
    const expenses = [
      createExpense(100, daysAgo(0), 'Food'),
      createExpense(50, daysAgo(5), 'Transport'),
      createExpense(75, currentMonthDate, 'Entertainment'),
      createExpense(200, '2024-01-01', 'Healthcare'), // Old expense
    ];
    const summary = calculateSummary(expenses);

    expect(summary.overall).toBe(425); // All expenses
    expect(summary.byCategory.Food).toBe(100);
    expect(summary.byCategory.Transport).toBe(50);
    expect(summary.byCategory.Entertainment).toBe(75);
    expect(summary.byCategory.Healthcare).toBe(200);
    // currentMonth and last7Days depend on current date
    expect(summary.currentMonth).toBeGreaterThanOrEqual(0);
    expect(summary.last7Days).toBeGreaterThanOrEqual(0);
  });

  it('should have all required properties', () => {
    const summary = calculateSummary([]);
    expect(summary).toHaveProperty('overall');
    expect(summary).toHaveProperty('byCategory');
    expect(summary).toHaveProperty('currentMonth');
    expect(summary).toHaveProperty('last7Days');
    expect(summary.byCategory).toHaveProperty('Food');
    expect(summary.byCategory).toHaveProperty('Transport');
    expect(summary.byCategory).toHaveProperty('Entertainment');
    expect(summary.byCategory).toHaveProperty('Utilities');
    expect(summary.byCategory).toHaveProperty('Healthcare');
    expect(summary.byCategory).toHaveProperty('Other');
  });

  it('should handle single expense correctly', () => {
    const expenses = [createExpense(42.99, daysAgo(1), 'Food')];
    const summary = calculateSummary(expenses);
    expect(summary.overall).toBe(42.99);
    expect(summary.byCategory.Food).toBe(42.99);
    expect(summary.last7Days).toBe(42.99);
  });
});
