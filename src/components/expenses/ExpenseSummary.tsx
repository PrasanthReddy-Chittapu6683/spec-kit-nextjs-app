'use client';

/**
 * ExpenseSummary Component
 *
 * Displays aggregated expense totals and breakdowns
 */

import type { ExpenseSummary, ExpenseCategory } from '@/server/types/expense';

interface ExpenseSummaryProps {
  summary: ExpenseSummary;
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
 * Get color class for category badge
 */
function getCategoryColor(category: ExpenseCategory): string {
  const colors: Record<ExpenseCategory, string> = {
    Food: 'bg-green-100 text-green-800',
    Transport: 'bg-blue-100 text-blue-800',
    Entertainment: 'bg-purple-100 text-purple-800',
    Utilities: 'bg-yellow-100 text-yellow-800',
    Healthcare: 'bg-red-100 text-red-800',
    Other: 'bg-gray-100 text-gray-800',
  };
  return colors[category];
}

export function ExpenseSummary({ summary }: ExpenseSummaryProps) {
  const categories: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Entertainment',
    'Utilities',
    'Healthcare',
    'Other',
  ];

  return (
    <div className="space-y-6">
      {/* Overall Total - Large and Prominent */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-lg font-medium opacity-90 mb-2">Total Spent</h2>
        <p className="text-5xl font-bold">{formatCurrency(summary.overall)}</p>
      </div>

      {/* Time Period Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Current Month
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(summary.currentMonth)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Last 7 Days
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(summary.last7Days)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          By Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(
                    category
                  )}`}
                >
                  {category}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(summary.byCategory[category])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
