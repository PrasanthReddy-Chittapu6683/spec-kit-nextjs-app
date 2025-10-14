'use client';

/**
 * Expense Tracker Dashboard
 *
 * Main page for the expense tracking application
 * Integrates all components and manages state via useExpenses hook
 */

import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseSummary } from '@/components/expenses/ExpenseSummary';

export default function Home() {
  const { expenses, summary, isLoading, error, addExpense, deleteExpense } =
    useExpenses();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md border border-red-200 max-w-md w-full">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Error Loading Expenses
          </h2>
          <p className="text-gray-600 mb-4 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600 mt-2">
            Track your personal expenses and monitor spending patterns
          </p>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Summary Section */}
          <section>
            <ExpenseSummary summary={summary} />
          </section>

          {/* Add Expense Form */}
          <section>
            <ExpenseForm onAddExpense={addExpense} />
          </section>

          {/* Expenses List */}
          <section>
            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Personal Expense Tracker • Built with Next.js</p>
        </footer>
      </div>
    </div>
  );
}
