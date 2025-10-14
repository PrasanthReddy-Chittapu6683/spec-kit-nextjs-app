/**
 * Unit tests for validation utilities
 *
 * These tests verify that validation functions correctly identify valid and invalid data.
 * Tests are written BEFORE implementation (TDD approach).
 */

import { validateAmount, validateDate, validateCategory, validateExpense } from '@/server/utils/validation';
import type { Expense, ExpenseCategory } from '@/server/types/expense';

describe('validateAmount', () => {
  it('should return true for positive numbers', () => {
    expect(validateAmount(42.99)).toBe(true);
    expect(validateAmount(100)).toBe(true);
    expect(validateAmount(0.01)).toBe(true);
    expect(validateAmount(9999999.99)).toBe(true);
  });

  it('should return false for negative numbers', () => {
    expect(validateAmount(-10)).toBe(false);
    expect(validateAmount(-0.01)).toBe(false);
  });

  it('should return false for zero', () => {
    expect(validateAmount(0)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(validateAmount(NaN)).toBe(false);
  });

  it('should return false for Infinity', () => {
    expect(validateAmount(Infinity)).toBe(false);
    expect(validateAmount(-Infinity)).toBe(false);
  });

  it('should return false for non-numeric values', () => {
    expect(validateAmount('42')).toBe(false);
    expect(validateAmount('abc')).toBe(false);
    expect(validateAmount(null)).toBe(false);
    expect(validateAmount(undefined)).toBe(false);
    expect(validateAmount({})).toBe(false);
    expect(validateAmount([])).toBe(false);
  });
});

describe('validateDate', () => {
  it('should return true for valid ISO 8601 dates', () => {
    expect(validateDate('2025-10-01')).toBe(true);
    expect(validateDate('2024-01-15')).toBe(true);
    expect(validateDate('2026-12-31')).toBe(true);
  });

  it('should return true for past dates', () => {
    expect(validateDate('2020-01-01')).toBe(true);
    expect(validateDate('1990-06-15')).toBe(true);
  });

  it('should return true for future dates', () => {
    // Per clarification: future dates are allowed
    expect(validateDate('2030-12-31')).toBe(true);
    expect(validateDate('2099-01-01')).toBe(true);
  });

  it('should return false for invalid date formats', () => {
    expect(validateDate('10/01/2025')).toBe(false);
    expect(validateDate('01-10-2025')).toBe(false);
    expect(validateDate('2025/10/01')).toBe(false);
    expect(validateDate('Oct 1, 2025')).toBe(false);
  });

  it('should return false for invalid dates', () => {
    expect(validateDate('2025-13-01')).toBe(false); // Invalid month
    expect(validateDate('2025-02-30')).toBe(false); // Invalid day
    expect(validateDate('invalid-date')).toBe(false);
    expect(validateDate('')).toBe(false);
  });

  it('should return false for non-string values', () => {
    expect(validateDate(null)).toBe(false);
    expect(validateDate(undefined)).toBe(false);
    expect(validateDate(123)).toBe(false);
    expect(validateDate({})).toBe(false);
    expect(validateDate([])).toBe(false);
  });
});

describe('validateCategory', () => {
  const validCategories: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Other',
  ];

  it('should return true for all valid categories', () => {
    validCategories.forEach(category => {
      expect(validateCategory(category)).toBe(true);
    });
  });

  it('should return false for invalid category strings', () => {
    expect(validateCategory('food')).toBe(false); // Wrong case
    expect(validateCategory('FOOD')).toBe(false); // Wrong case
    expect(validateCategory('Groceries')).toBe(false);
    expect(validateCategory('Travel')).toBe(false);
    expect(validateCategory('')).toBe(false);
  });

  it('should return false for non-string values', () => {
    expect(validateCategory(null)).toBe(false);
    expect(validateCategory(undefined)).toBe(false);
    expect(validateCategory(123)).toBe(false);
    expect(validateCategory({})).toBe(false);
    expect(validateCategory([])).toBe(false);
  });
});

describe('validateExpense', () => {
  const validExpense: Expense = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    amount: 42.99,
    date: '2025-10-01',
    category: 'Food',
    description: 'Lunch at cafe',
    createdAt: '2025-10-01T14:30:00.000Z',
  };

  it('should return valid result for complete valid expense', () => {
    const result = validateExpense(validExpense);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return valid result for expense without optional description', () => {
    const expense: Partial<Expense> = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      amount: 42.99,
      date: '2025-10-01',
      category: 'Food',
      createdAt: '2025-10-01T14:30:00.000Z',
    };
    const result = validateExpense(expense);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid result for missing required fields', () => {
    const expenseWithoutAmount = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      date: '2025-10-01',
      category: 'Food' as ExpenseCategory,
      createdAt: '2025-10-01T14:30:00.000Z',
    };
    const result = validateExpense(expenseWithoutAmount);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some(e => e.includes('amount'))).toBe(true);
  });

  it('should return invalid result for invalid amount', () => {
    const expense: Partial<Expense> = {
      ...validExpense,
      amount: -10,
    };
    const result = validateExpense(expense);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('amount'))).toBe(true);
  });

  it('should return invalid result for invalid date', () => {
    const expense = {
      ...validExpense,
      date: 'invalid-date',
    };
    const result = validateExpense(expense);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('date'))).toBe(true);
  });

  it('should return invalid result for invalid category', () => {
    const expense = {
      ...validExpense,
      category: 'InvalidCategory' as unknown as ExpenseCategory,
    };
    const result = validateExpense(expense);
    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.includes('category'))).toBe(true);
  });

  it('should accumulate multiple validation errors', () => {
    const expense = {
      amount: -10,
      date: 'invalid',
      category: 'wrong' as unknown as ExpenseCategory,
    };
    const result = validateExpense(expense);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });

  it('should handle empty object', () => {
    const result = validateExpense({});
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
