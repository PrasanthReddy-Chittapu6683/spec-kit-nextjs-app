'use client';

/**
 * ExpenseForm Component
 *
 * Form for adding new expenses with validation
 */

import { useState, FormEvent } from 'react';
import type { Expense, ExpenseCategory } from '@/server/types/expense';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Other',
];

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{
    amount?: string;
    date?: string;
    category?: string;
  }>({});

  const handleAmountChange = (value: string) => {
    setAmount(value);
    // Clear error when user starts typing
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    // Clear error when user selects a date
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value as ExpenseCategory);
    // Clear error when user selects a category
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate fields and collect errors
    const newErrors: { amount?: string; date?: string; category?: string } = {};

    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (!category) {
      newErrors.category = 'Category is required';
    }

    // If there are errors, update state and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Parse amount to number
    const parsedAmount = parseFloat(amount);

    // Create expense object
    const expense: Omit<Expense, 'id' | 'createdAt'> = {
      amount: parsedAmount,
      date,
      category: category as ExpenseCategory,
      description: description.trim() || undefined,
    };

    // Call parent handler
    onAddExpense(expense);

    // Clear form and errors
    setAmount('');
    setDate('');
    setCategory('');
    setDescription('');
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Add New Expense
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount Field */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount *
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            min="0.01"
            step="0.01"
            className={`w-full text-black px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.amount
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Date Field */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date *
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className={`w-full px-3 text-black py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.date
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Category Field */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={`w-full text-black px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.category
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Description Field (spans full width on desktop) */}
        <div className="md:col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add details about this expense..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}
