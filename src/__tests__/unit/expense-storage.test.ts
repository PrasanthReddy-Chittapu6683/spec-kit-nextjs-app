/**
 * Unit tests for localStorage storage service
 *
 * These tests verify that expense storage operations work correctly with localStorage.
 * Tests are written BEFORE implementation (TDD approach).
 */

import { loadExpenses, saveExpenses, clearExpenses } from '@/server/storage/expense-storage';
import type { Expense } from '@/server/types/expense';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Replace global localStorage with mock
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Helper to create test expense
const createTestExpense = (id: string, amount: number): Expense => ({
  id,
  amount,
  date: '2025-10-01',
  category: 'Food',
  description: 'Test expense',
  createdAt: '2025-10-01T12:00:00.000Z',
});

describe('loadExpenses', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return empty array when no data in localStorage', () => {
    const expenses = loadExpenses();
    expect(expenses).toEqual([]);
    expect(Array.isArray(expenses)).toBe(true);
  });

  it('should parse and return expenses from localStorage', () => {
    const testExpenses = [
      createTestExpense('1', 42.99),
      createTestExpense('2', 100.0),
    ];
    localStorageMock.setItem('expenses', JSON.stringify(testExpenses));

    const expenses = loadExpenses();
    expect(expenses).toHaveLength(2);
    expect(expenses[0].id).toBe('1');
    expect(expenses[0].amount).toBe(42.99);
    expect(expenses[1].id).toBe('2');
    expect(expenses[1].amount).toBe(100.0);
  });

  it('should return properly typed Expense objects', () => {
    const testExpenses = [createTestExpense('1', 42.99)];
    localStorageMock.setItem('expenses', JSON.stringify(testExpenses));

    const expenses = loadExpenses();
    const expense = expenses[0];
    expect(expense).toHaveProperty('id');
    expect(expense).toHaveProperty('amount');
    expect(expense).toHaveProperty('date');
    expect(expense).toHaveProperty('category');
    expect(expense).toHaveProperty('createdAt');
  });

  it('should handle corrupted JSON gracefully', () => {
    localStorageMock.setItem('expenses', 'invalid json {{{');

    // Should either throw error or return empty array
    const loadFn = () => loadExpenses();
    try {
      const result = loadFn();
      expect(Array.isArray(result)).toBe(true);
      // If it doesn't throw, it should return empty array
    } catch (error) {
      // If it throws, that's also acceptable
      expect(error).toBeDefined();
    }
  });

  it('should handle null localStorage value', () => {
    localStorageMock.removeItem('expenses');
    const expenses = loadExpenses();
    expect(expenses).toEqual([]);
  });

  it('should handle non-array JSON data', () => {
    localStorageMock.setItem('expenses', JSON.stringify({ not: 'an array' }));

    const loadFn = () => loadExpenses();
    try {
      const result = loadFn();
      // Should return empty array or throw
      expect(Array.isArray(result)).toBe(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe('saveExpenses', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should save expenses to localStorage as JSON', () => {
    const testExpenses = [
      createTestExpense('1', 42.99),
      createTestExpense('2', 100.0),
    ];

    saveExpenses(testExpenses);

    const stored = localStorageMock.getItem('expenses');
    expect(stored).toBeDefined();
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].id).toBe('1');
    expect(parsed[1].id).toBe('2');
  });

  it('should save empty array correctly', () => {
    saveExpenses([]);

    const stored = localStorageMock.getItem('expenses');
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!);
    expect(parsed).toEqual([]);
  });

  it('should overwrite existing data', () => {
    const firstExpenses = [createTestExpense('1', 42.99)];
    saveExpenses(firstExpenses);

    const secondExpenses = [
      createTestExpense('2', 100.0),
      createTestExpense('3', 200.0),
    ];
    saveExpenses(secondExpenses);

    const stored = localStorageMock.getItem('expenses');
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].id).toBe('2');
    expect(parsed[1].id).toBe('3');
  });

  it('should preserve all expense properties', () => {
    const testExpense: Expense = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      amount: 42.99,
      date: '2025-10-01',
      category: 'Food',
      description: 'Lunch at cafe',
      createdAt: '2025-10-01T14:30:00.000Z',
    };
    saveExpenses([testExpense]);

    const stored = localStorageMock.getItem('expenses');
    const parsed = JSON.parse(stored!)[0];
    expect(parsed.id).toBe(testExpense.id);
    expect(parsed.amount).toBe(testExpense.amount);
    expect(parsed.date).toBe(testExpense.date);
    expect(parsed.category).toBe(testExpense.category);
    expect(parsed.description).toBe(testExpense.description);
    expect(parsed.createdAt).toBe(testExpense.createdAt);
  });

  it('should handle expenses without optional description', () => {
    const testExpense: Expense = {
      id: '1',
      amount: 42.99,
      date: '2025-10-01',
      category: 'Food',
      createdAt: '2025-10-01T14:30:00.000Z',
    };
    saveExpenses([testExpense]);

    const stored = localStorageMock.getItem('expenses');
    const parsed = JSON.parse(stored!)[0];
    expect(parsed.description).toBeUndefined();
  });
});

describe('clearExpenses', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should remove expenses from localStorage', () => {
    const testExpenses = [createTestExpense('1', 42.99)];
    localStorageMock.setItem('expenses', JSON.stringify(testExpenses));

    expect(localStorageMock.getItem('expenses')).not.toBeNull();

    clearExpenses();

    expect(localStorageMock.getItem('expenses')).toBeNull();
  });

  it('should work even if no expenses exist', () => {
    expect(localStorageMock.getItem('expenses')).toBeNull();

    // Should not throw error
    expect(() => clearExpenses()).not.toThrow();

    expect(localStorageMock.getItem('expenses')).toBeNull();
  });

  it('should only remove expenses key, not other data', () => {
    localStorageMock.setItem('expenses', JSON.stringify([createTestExpense('1', 42.99)]));
    localStorageMock.setItem('otherKey', 'otherValue');

    clearExpenses();

    expect(localStorageMock.getItem('expenses')).toBeNull();
    expect(localStorageMock.getItem('otherKey')).toBe('otherValue');
  });
});

describe('Integration: save and load cycle', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should successfully save and load expenses', () => {
    const originalExpenses = [
      createTestExpense('1', 42.99),
      createTestExpense('2', 100.0),
      createTestExpense('3', 25.5),
    ];

    saveExpenses(originalExpenses);
    const loadedExpenses = loadExpenses();

    expect(loadedExpenses).toHaveLength(3);
    expect(loadedExpenses).toEqual(originalExpenses);
  });

  it('should handle save, load, modify, save, load cycle', () => {
    const firstExpenses = [createTestExpense('1', 42.99)];
    saveExpenses(firstExpenses);

    const loaded = loadExpenses();
    const secondExpenses = [...loaded, createTestExpense('2', 100.0)];
    saveExpenses(secondExpenses);

    const finalLoaded = loadExpenses();
    expect(finalLoaded).toHaveLength(2);
    expect(finalLoaded[0].id).toBe('1');
    expect(finalLoaded[1].id).toBe('2');
  });

  it('should persist data through clear and reload', () => {
    const expenses = [createTestExpense('1', 42.99)];
    saveExpenses(expenses);

    clearExpenses();
    const afterClear = loadExpenses();
    expect(afterClear).toEqual([]);

    saveExpenses(expenses);
    const afterRestore = loadExpenses();
    expect(afterRestore).toHaveLength(1);
  });
});
