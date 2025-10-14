'use client';

/**
 * ExpenseList Component
 *
 * Displays all expenses in a table with delete functionality
 */

import type { Expense } from '@/server/types/expense';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

/**
 * Format amount as USD currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date in readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const handleDelete = (id: string, description?: string) => {
    const confirmMessage = description
      ? `Delete expense: ${description}?`
      : 'Delete this expense?';

    if (window.confirm(confirmMessage)) {
      onDeleteExpense(id);
    }
  };

  // Empty state
  if (expenses.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
        <p className="text-gray-500 text-lg">
          No expenses yet. Add your first expense above!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          All Expenses ({expenses.length})
        </h2>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {expense.description || (
                    <span className="text-gray-400 italic">No description</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() =>
                      handleDelete(expense.id, expense.description)
                    }
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {expense.category}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(expense.date)}
                </p>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </p>
            </div>
            {expense.description && (
              <p className="text-sm text-gray-600 mb-2">
                {expense.description}
              </p>
            )}
            <button
              onClick={() => handleDelete(expense.id, expense.description)}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
