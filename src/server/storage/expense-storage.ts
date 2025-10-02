/**
 * localStorage storage service for expenses
 *
 * Provides functions to persist and retrieve expenses from browser localStorage.
 * All data is stored under the key "expenses" as a JSON array.
 */

import type { Expense } from '../types/expense';

/**
 * localStorage key for storing expenses
 */
const STORAGE_KEY = 'expenses';

/**
 * Loads all expenses from localStorage
 *
 * @returns Array of expenses, or empty array if none exist or on error
 * @throws Error if localStorage is not available or data is corrupted beyond recovery
 */
export function loadExpenses(): Expense[] {
  try {
    // Check if localStorage is available (might not be in some environments)
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      console.warn('localStorage is not available');
      return [];
    }

    // Get data from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);

    // Return empty array if no data
    if (stored === null || stored === '') {
      return [];
    }

    // Parse JSON
    const parsed = JSON.parse(stored);

    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      console.error('Stored expenses data is not an array');
      return [];
    }

    // Basic validation of array items (ensure they look like Expense objects)
    const validated = parsed.filter((item): item is Expense => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.amount === 'number' &&
        typeof item.date === 'string' &&
        typeof item.category === 'string' &&
        typeof item.createdAt === 'string'
      );
    });

    // Warn if some items were filtered out
    if (validated.length !== parsed.length) {
      console.warn(
        `Filtered out ${parsed.length - validated.length} invalid expense records`
      );
    }

    return validated;
  } catch (error) {
    console.error('Error loading expenses from localStorage:', error);
    // For JSON parse errors, return empty array (graceful degradation)
    if (error instanceof SyntaxError) {
      console.warn('Corrupted data in localStorage, returning empty array');
      return [];
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * Saves expenses to localStorage
 *
 * @param expenses - Array of expenses to save
 * @throws Error if localStorage quota is exceeded or localStorage is not available
 */
export function saveExpenses(expenses: Expense[]): void {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      throw new Error('localStorage is not available');
    }

    // Serialize to JSON
    const serialized = JSON.stringify(expenses);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    // Check for quota exceeded error
    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      console.error('localStorage quota exceeded');
      throw new Error('Storage quota exceeded. Please delete some expenses.');
    }

    console.error('Error saving expenses to localStorage:', error);
    throw error;
  }
}

/**
 * Clears all expenses from localStorage
 *
 * @throws Error if localStorage is not available
 */
export function clearExpenses(): void {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      throw new Error('localStorage is not available');
    }

    // Remove the expenses key
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing expenses from localStorage:', error);
    throw error;
  }
}
