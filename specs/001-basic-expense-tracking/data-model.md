# Data Model: Basic Expense Tracking App

**Feature**: 001-basic-expense-tracking
**Date**: 2025-10-01
**Phase**: 1 (Design & Contracts)

## Entity: Expense

### Description
Represents a single personal expense transaction recorded by the user. Each expense captures the monetary amount, when it occurred, what category it falls under, and optional descriptive details.

### Fields

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | string (UUID v4) | Yes | Unique, immutable | Unique identifier for the expense |
| `amount` | number | Yes | > 0, max 2 decimal places | Monetary value of the expense |
| `date` | string (ISO 8601) | Yes | Format: `YYYY-MM-DD` | Date when the expense occurred |
| `category` | ExpenseCategory | Yes | One of 6 predefined values | Classification of the expense type |
| `description` | string | No | Max 500 characters | Optional details about the expense |
| `createdAt` | string (ISO 8601) | Yes | Auto-generated on creation | Timestamp when record was created |

### Type Definitions

```typescript
export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  description?: string;
  createdAt: string;
}
```

### Validation Rules

#### Amount
- **MUST** be a positive number (> 0)
- **MUST** be finite (not NaN, Infinity, or -Infinity)
- **SHOULD** have maximum 2 decimal places (cents precision)
- **Example valid**: `42.99`, `100`, `0.50`
- **Example invalid**: `-10`, `0`, `NaN`, `"forty-two"`

#### Date
- **MUST** be a valid date string in ISO 8601 format (`YYYY-MM-DD`)
- **MAY** be in the past, present, or future (per clarification)
- **MUST** be parseable by JavaScript Date constructor
- **Example valid**: `2025-10-01`, `2024-01-15`, `2026-12-31`
- **Example invalid**: `10/01/2025`, `2025-13-01`, `invalid-date`

#### Category
- **MUST** be exactly one of the 6 predefined categories
- **MUST** match case-sensitive string literal
- **Categories**: `Food`, `Transport`, `Entertainment`, `Utilities`, `Healthcare`, `Other`
- **Example valid**: `"Food"`, `"Healthcare"`
- **Example invalid**: `"food"`, `"FOOD"`, `"Groceries"`, `""`

#### Description
- **OPTIONAL** field (may be undefined or empty string)
- **MAY** contain any text up to 500 characters
- **SHOULD** be trimmed of leading/trailing whitespace on save
- **Example valid**: `"Lunch with client"`, `""`, `undefined`
- **Example invalid**: (none - any string is valid if present)

### State Transitions

Expense entities follow a simple immutable pattern:

```
[Created] → [Exists in localStorage] → [Deleted]
   ↓                                       ↑
   └────────────── (no updates) ──────────┘
```

- **Created**: New expense with all required fields
- **No Updates**: Expenses are immutable (no edit functionality in v1)
- **Deleted**: Removed from localStorage array

### Relationships

**None** - Expenses are independent entities with no relationships to other entities.

### Storage Schema

Expenses are stored in browser localStorage as a JSON array under the key `"expenses"`:

```json
{
  "expenses": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "amount": 42.99,
      "date": "2025-10-01",
      "category": "Food",
      "description": "Lunch at cafe",
      "createdAt": "2025-10-01T14:30:00.000Z"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "amount": 120.00,
      "date": "2025-09-28",
      "category": "Utilities",
      "description": "Electricity bill",
      "createdAt": "2025-09-28T09:15:00.000Z"
    }
  ]
}
```

### Indexing & Sorting

- **Primary Key**: `id` field (UUID v4)
- **Sort Order**: By `date` field descending (newest first)
- **No indexes**: localStorage is scanned linearly (acceptable for <10k records)

### Data Integrity

#### On Write
1. Validate all fields before writing to localStorage
2. Generate `id` using UUID v4 library or crypto.randomUUID()
3. Generate `createdAt` using `new Date().toISOString()`
4. Sanitize `description` (trim whitespace)
5. Serialize entire array to JSON string

#### On Read
1. Parse JSON string from localStorage
2. Validate array structure (is array?)
3. Validate each expense object shape
4. Filter out any malformed records (defensive)
5. Return typed array of Expense objects

#### Error Handling
- **localStorage quota exceeded**: Catch and display user-friendly error
- **JSON parse error**: Clear corrupted data, start fresh (log to console)
- **Invalid expense shape**: Skip invalid records, log warning

---

## Computed Entity: ExpenseSummary

### Description
Aggregated calculations derived from the Expense collection. Not stored directly; computed on-demand from expense array.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `overall` | number | Sum of all expense amounts |
| `byCategory` | Record<ExpenseCategory, number> | Sum of amounts grouped by category |
| `currentMonth` | number | Sum of expenses in current calendar month |
| `last7Days` | number | Sum of expenses in last 7 days (inclusive of today) |

### Type Definition

```typescript
export interface ExpenseSummary {
  overall: number;
  byCategory: Record<ExpenseCategory, number>;
  currentMonth: number;
  last7Days: number;
}
```

### Calculation Logic

#### Overall Total
```typescript
overall = expenses.reduce((sum, exp) => sum + exp.amount, 0)
```

#### By Category
```typescript
byCategory = {
  Food: expenses.filter(e => e.category === 'Food').reduce((sum, e) => sum + e.amount, 0),
  Transport: expenses.filter(e => e.category === 'Transport').reduce((sum, e) => sum + e.amount, 0),
  // ... repeat for all 6 categories
}
```

#### Current Month
```typescript
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

currentMonth = expenses
  .filter(e => {
    const expDate = new Date(e.date);
    return expDate.getFullYear() === currentYear &&
           expDate.getMonth() === currentMonth;
  })
  .reduce((sum, e) => sum + e.amount, 0);
```

#### Last 7 Days
```typescript
const now = new Date();
const sevenDaysAgo = new Date(now);
sevenDaysAgo.setDate(now.getDate() - 7);

last7Days = expenses
  .filter(e => {
    const expDate = new Date(e.date);
    return expDate >= sevenDaysAgo && expDate <= now;
  })
  .reduce((sum, e) => sum + e.amount, 0);
```

### Performance Considerations

- Calculations run on every render when expenses change
- O(n) for overall and currentMonth
- O(n) for byCategory (single pass with grouping)
- O(n) for last7Days
- Total: O(n) - acceptable for <10k records
- Consider memoization (useMemo) for large datasets

---

## Migration Strategy

### Version 1.0 (Current)
- Initial schema as defined above
- No migrations needed

### Future Considerations
If schema changes in future versions:
1. Add `schemaVersion` field to localStorage
2. Implement migration functions for each version bump
3. Run migrations on app load if version mismatch detected
4. Example: Add `updatedAt` field, default to `createdAt` for existing records

**Not implemented in v1** - noted for future reference only.
