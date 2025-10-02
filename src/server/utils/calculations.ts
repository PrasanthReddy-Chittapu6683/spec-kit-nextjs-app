/**
 * Calculation utilities for expense tracking
 *
 * Provides functions to calculate various expense totals and summaries.
 * All calculations use native JavaScript Date API.
 */

import type { Expense, ExpenseCategory, ExpenseSummary } from '../types/expense';

/**
 * Calculates the overall total of all expenses
 *
 * @param expenses - Array of expenses
 * @returns Sum of all expense amounts
 */
export function calculateOverallTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Calculates totals grouped by category
 *
 * @param expenses - Array of expenses
 * @returns Object with sum for each category
 */
export function calculateByCategory(expenses: Expense[]): Record<ExpenseCategory, number> {
  // Initialize all categories to 0
  const totals: Record<ExpenseCategory, number> = {
    Food: 0,
    Transport: 0,
    Entertainment: 0,
    Utilities: 0,
    Healthcare: 0,
    Other: 0,
  };

  // Sum expenses by category
  expenses.forEach((expense) => {
    totals[expense.category] += expense.amount;
  });

  return totals;
}

/**
 * Calculates total for expenses in the current calendar month
 *
 * @param expenses - Array of expenses
 * @returns Sum of expenses in current month
 */
export function calculateCurrentMonthTotal(expenses: Expense[]): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (0 = January)

  return expenses
    .filter((expense) => {
      // Parse date as local date (YYYY-MM-DD format)
      const [year, month, day] = expense.date.split('-').map(Number);
      const expenseDate = new Date(year, month - 1, day);
      return (
        expenseDate.getFullYear() === currentYear &&
        expenseDate.getMonth() === currentMonth
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Calculates total for expenses in the last 7 days (inclusive of today)
 *
 * @param expenses - Array of expenses
 * @returns Sum of expenses in last 7 days
 */
export function calculateLast7DaysTotal(expenses: Expense[]): number {
  const now = new Date();
  now.setHours(23, 59, 59, 999); // End of today

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0); // Start of 7 days ago

  return expenses
    .filter((expense) => {
      // Parse date as local date (YYYY-MM-DD format)
      const [year, month, day] = expense.date.split('-').map(Number);
      const expenseDate = new Date(year, month - 1, day);
      expenseDate.setHours(0, 0, 0, 0); // Normalize to start of day

      return expenseDate >= sevenDaysAgo && expenseDate <= now;
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
}

/**
 * Calculates a complete expense summary with all totals
 *
 * @param expenses - Array of expenses
 * @returns ExpenseSummary object with all calculated totals
 */
export function calculateSummary(expenses: Expense[]): ExpenseSummary {
  return {
    overall: calculateOverallTotal(expenses),
    byCategory: calculateByCategory(expenses),
    currentMonth: calculateCurrentMonthTotal(expenses),
    last7Days: calculateLast7DaysTotal(expenses),
  };
}
