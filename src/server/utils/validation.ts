/**
 * Validation utilities for expense tracking
 *
 * Provides runtime type checking and validation for expense data.
 * Uses TypeScript type guards for safe runtime validation.
 */

import type { Expense, ExpenseCategory, ValidationResult } from '../types/expense';

/**
 * Valid expense categories
 */
const VALID_CATEGORIES: readonly ExpenseCategory[] = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Other',
] as const;

/**
 * Validates that an amount is a positive number
 *
 * @param amount - Value to validate
 * @returns true if amount is a positive finite number, false otherwise
 */
export function validateAmount(amount: unknown): boolean {
  // Check if it's a number
  if (typeof amount !== 'number') {
    return false;
  }

  // Check for NaN
  if (isNaN(amount)) {
    return false;
  }

  // Check for Infinity
  if (!isFinite(amount)) {
    return false;
  }

  // Check if positive (> 0)
  if (amount <= 0) {
    return false;
  }

  return true;
}

/**
 * Validates that a date string is in valid ISO 8601 format (YYYY-MM-DD)
 *
 * @param date - Value to validate
 * @returns true if date is a valid ISO 8601 date string, false otherwise
 */
export function validateDate(date: unknown): boolean {
  // Check if it's a string
  if (typeof date !== 'string') {
    return false;
  }

  // Check if empty
  if (date.trim() === '') {
    return false;
  }

  // Check if it matches ISO 8601 format (YYYY-MM-DD)
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!iso8601Regex.test(date)) {
    return false;
  }

  // Parse date components and create a local date
  const [year, month, day] = date.split('-').map(Number);

  // Create date in local timezone to avoid UTC offset issues
  const parsedDate = new Date(year, month - 1, day);

  // Verify the date is valid (catches invalid dates like 2025-02-30)
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month - 1 ||
    parsedDate.getDate() !== day
  ) {
    return false;
  }

  return true;
}

/**
 * Validates that a category is one of the allowed expense categories
 *
 * @param category - Value to validate
 * @returns true if category is a valid ExpenseCategory, false otherwise
 */
export function validateCategory(category: unknown): category is ExpenseCategory {
  // Check if it's a string
  if (typeof category !== 'string') {
    return false;
  }

  // Check if it's one of the valid categories (case-sensitive)
  return VALID_CATEGORIES.includes(category as ExpenseCategory);
}

/**
 * Validates a complete or partial expense object
 *
 * @param expense - Expense object to validate
 * @returns ValidationResult with isValid flag and array of error messages
 */
export function validateExpense(expense: Partial<Expense>): ValidationResult {
  const errors: string[] = [];

  // Validate amount
  if (expense.amount === undefined) {
    errors.push('amount is required');
  } else if (!validateAmount(expense.amount)) {
    errors.push('amount must be a positive number');
  }

  // Validate date
  if (expense.date === undefined) {
    errors.push('date is required');
  } else if (!validateDate(expense.date)) {
    errors.push('date must be a valid ISO 8601 date (YYYY-MM-DD)');
  }

  // Validate category
  if (expense.category === undefined) {
    errors.push('category is required');
  } else if (!validateCategory(expense.category)) {
    errors.push('category must be one of: Food, Transport, Entertainment, Utilities, Healthcare, Other');
  }

  // Description is optional, no validation needed

  // ID and createdAt are typically generated, but validate if present
  if (expense.id !== undefined && typeof expense.id !== 'string') {
    errors.push('ID must be a string');
  }

  if (expense.createdAt !== undefined && typeof expense.createdAt !== 'string') {
    errors.push('CreatedAt must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
