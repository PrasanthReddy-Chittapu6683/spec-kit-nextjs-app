/**
 * TypeScript type definitions for the Expense Tracking application
 *
 * This file defines the core data types used throughout the application:
 * - ExpenseCategory: Fixed set of 6 expense categories
 * - Expense: Individual expense record
 * - ExpenseSummary: Aggregated expense calculations
 */

/**
 * Fixed set of expense categories
 * Per specification: Cannot be customized by user
 */
export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Other';

/**
 * Represents a single expense transaction
 *
 * @property id - Unique identifier (UUID v4)
 * @property amount - Monetary value (positive number, max 2 decimals)
 * @property date - Date of expense in ISO 8601 format (YYYY-MM-DD)
 * @property category - One of the 6 predefined categories
 * @property description - Optional details about the expense
 * @property createdAt - Timestamp when record was created (ISO 8601)
 */
export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  description?: string;
  createdAt: string;
}

/**
 * Aggregated expense calculations
 * Computed on-demand from expense array, not stored directly
 *
 * @property overall - Sum of all expense amounts
 * @property byCategory - Sum of amounts grouped by each category
 * @property currentMonth - Sum of expenses in current calendar month
 * @property last7Days - Sum of expenses in last 7 days (inclusive of today)
 */
export interface ExpenseSummary {
  overall: number;
  byCategory: Record<ExpenseCategory, number>;
  currentMonth: number;
  last7Days: number;
}

/**
 * Result of expense validation
 *
 * @property isValid - Whether the expense data is valid
 * @property errors - Array of validation error messages (empty if valid)
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
