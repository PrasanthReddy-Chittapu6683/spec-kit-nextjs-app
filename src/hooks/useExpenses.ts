'use client';

/**
 * Custom hook for managing expenses
 *
 * Encapsulates all expense-related state and operations:
 * - Loading expenses from localStorage
 * - Adding and deleting expenses
 * - Calculating summaries
 * - Sorting by date
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Expense, ExpenseSummary } from '@/server/types/expense';
import { loadExpenses, saveExpenses } from '@/server/storage/expense-storage';
import { calculateSummary } from '@/server/utils/calculations';

interface UseExpensesReturn {
  expenses: Expense[];
  summary: ExpenseSummary;
  isLoading: boolean;
  error: string | null;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
}

/**
 * Custom hook for expense management
 *
 * @returns Object with expenses state, summary, and mutation functions
 */
export function useExpenses(): UseExpensesReturn {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expenses from localStorage on mount
  useEffect(() => {
    try {
      const loadedExpenses = loadExpenses();
      setExpenses(loadedExpenses);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load expenses:', err);
      setError(err instanceof Error ? err.message : 'Failed to load expenses');
      setIsLoading(false);
    }
  }, []);

  // Sort expenses by date descending (newest first)
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      // Compare dates as strings (ISO 8601 format is sortable)
      // Reverse order for descending (newest first)
      return b.date.localeCompare(a.date);
    });
  }, [expenses]);

  // Calculate summary (memoized for performance)
  const summary = useMemo(() => {
    return calculateSummary(sortedExpenses);
  }, [sortedExpenses]);

  // Add a new expense
  const addExpense = useCallback(
    (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
      try {
        // Generate new expense with ID and timestamp
        const newExpense: Expense = {
          ...expenseData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };

        // Update state
        const updatedExpenses = [...expenses, newExpense];
        setExpenses(updatedExpenses);

        // Save to localStorage
        saveExpenses(updatedExpenses);

        // Clear any previous errors
        setError(null);
      } catch (err) {
        console.error('Failed to add expense:', err);
        setError(err instanceof Error ? err.message : 'Failed to add expense');
      }
    },
    [expenses]
  );

  // Delete an expense by ID
  const deleteExpense = useCallback(
    (id: string) => {
      try {
        // Filter out the expense
        const updatedExpenses = expenses.filter((expense) => expense.id !== id);
        setExpenses(updatedExpenses);

        // Save to localStorage
        saveExpenses(updatedExpenses);

        // Clear any previous errors
        setError(null);
      } catch (err) {
        console.error('Failed to delete expense:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete expense');
      }
    },
    [expenses]
  );

  return {
    expenses: sortedExpenses,
    summary,
    isLoading,
    error,
    addExpense,
    deleteExpense,
  };
}
