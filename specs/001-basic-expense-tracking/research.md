# Research: Basic Expense Tracking App

**Feature**: 001-basic-expense-tracking
**Date**: 2025-10-01
**Phase**: 0 (Outline & Research)

## Technical Decisions

### 1. localStorage for Data Persistence

**Decision**: Use browser localStorage API for persisting expense data

**Rationale**:
- No backend infrastructure needed (aligns with "personal tracker" requirement)
- Synchronous API makes state management simpler
- Built-in browser API, no additional dependencies
- Sufficient for personal use case (5-10MB storage limit handles thousands of expenses)
- Offline-first by nature
- Data remains private on user's device

**Alternatives Considered**:
- **IndexedDB**: More powerful but overkill for simple key-value storage of expense array; adds complexity
- **Backend database (PostgreSQL/MongoDB)**: Violates "no auth" requirement; adds deployment complexity for personal use
- **File system API**: Limited browser support; localStorage more universally compatible

**Implementation Notes**:
- Store expenses as JSON array under single key `"expenses"`
- Implement proper TypeScript typing for parse/stringify operations
- Add error handling for storage quota exceeded
- Consider data migration strategy if schema changes in future

---

### 2. Client-Side State Management

**Decision**: Use React useState + useEffect for state management (no external state library)

**Rationale**:
- Simple, single-page application doesn't need Redux/Zustand complexity
- React built-in hooks sufficient for:
  - Loading expenses from localStorage on mount
  - Managing form state
  - Triggering re-renders on add/delete operations
- Follows Next.js/React best practices for simple apps
- Zero additional dependencies

**Alternatives Considered**:
- **Context API**: Unnecessary abstraction for single-page app with co-located components
- **Zustand/Redux**: Overkill for simple CRUD operations; adds bundle size
- **Server state libraries (React Query/SWR)**: Not applicable since no server

**Implementation Pattern**:
```typescript
// Custom hook for expense management
function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    // Load from localStorage on mount
  }, []);

  const addExpense = (expense: Expense) => {
    // Update state + localStorage
  };

  const deleteExpense = (id: string) => {
    // Update state + localStorage
  };

  return { expenses, addExpense, deleteExpense };
}
```

---

### 3. TypeScript Type System for Expenses

**Decision**: Define strict TypeScript interfaces for Expense entity and related types

**Rationale**:
- Satisfies Constitutional Principle III (Type Safety)
- Prevents runtime errors from malformed data
- Provides IDE autocomplete and refactoring safety
- Documents data shape in code

**Type Definitions**:
```typescript
// src/server/types/expense.ts
export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Utilities'
  | 'Healthcare'
  | 'Other';

export interface Expense {
  id: string;           // UUID v4
  amount: number;       // Positive float
  date: string;         // ISO 8601 format (YYYY-MM-DD)
  category: ExpenseCategory;
  description?: string; // Optional
  createdAt: string;    // ISO 8601 timestamp
}

export interface ExpenseSummary {
  overall: number;
  byCategory: Record<ExpenseCategory, number>;
  currentMonth: number;
  last7Days: number;
}
```

---

### 4. Date Handling Strategy

**Decision**: Use native JavaScript Date API with ISO 8601 string format for storage

**Rationale**:
- No external date library needed (day.js/date-fns would add 10-20KB)
- ISO 8601 strings (`YYYY-MM-DD`) are sortable lexicographically
- Native `Date` object sufficient for required calculations:
  - Current month filtering
  - Last 7 days filtering
  - Sorting by date
- HTML date input works with ISO format natively

**Alternatives Considered**:
- **day.js/date-fns**: More features but unnecessary overhead for simple date comparisons
- **Luxon**: Even heavier than day.js
- **Unix timestamps**: Less human-readable in localStorage debug, no better for sorting

**Implementation Notes**:
- Store dates as `YYYY-MM-DD` strings
- Use `new Date(dateString)` for comparisons
- Calculate "current month" as matching year+month
- Calculate "last 7 days" as `now - 7 days <= date <= now`

---

### 5. Form Validation Strategy

**Decision**: Implement validation at multiple layers:
1. HTML5 native validation (required, min, type="date")
2. TypeScript type guards for runtime validation
3. Business logic validation in utility functions

**Rationale**:
- HTML5 validation provides immediate user feedback
- Type guards ensure type safety when parsing localStorage data
- Utility functions enforce business rules (e.g., positive amounts)
- Defense in depth prevents invalid data from entering system

**Validation Rules** (from spec):
- Amount: Required, positive number (>0)
- Date: Required, valid date string (no future restriction per clarification)
- Category: Required, must be one of 6 valid categories
- Description: Optional, string

---

### 6. Testing Strategy

**Decision**: Jest + React Testing Library for unit and integration tests

**Rationale**:
- Already configured in Next.js projects
- React Testing Library aligns with best practices (testing user behavior, not implementation)
- Jest handles both unit tests (pure functions) and component tests
- No additional setup required

**Test Coverage Plan**:
- **Unit tests**: Calculation functions (totals, filtering), validation logic
- **Integration tests**: Full user workflows (add expense → appears in list → totals update)
- **Contract tests**: Not applicable (no API contracts, localStorage only)

**Alternatives Considered**:
- **Vitest**: Faster but requires setup; Jest already available
- **Cypress/Playwright**: E2E overkill for single-page app

---

### 7. Styling Approach

**Decision**: Tailwind CSS v4 utility classes with component-scoped styles

**Rationale**:
- Already configured in project
- Utility-first approach speeds development
- No CSS-in-JS runtime overhead
- Next.js optimizes Tailwind automatically
- Responsive design built-in

**UI Design Principles**:
- Mobile-first responsive design
- Simple, clean interface (no complex animations)
- Clear visual hierarchy (form at top, list below, summary sidebar/top)
- Accessible (semantic HTML, proper labels, keyboard navigation)

---

### 8. Component Architecture

**Decision**: Feature-based component organization with clear Server/Client split

**Rationale**:
- Follows Next.js 15 App Router best practices
- Server Components for static layout (header, structure)
- Client Components for interactivity (form, list, summary)
- Satisfies Constitutional Principles II & IV

**Component Breakdown**:
1. **Server Components**:
   - `app/layout.tsx`: Root layout (minimal, mostly HTML shell)

2. **Client Components**:
   - `ExpenseForm`: Add expense form with validation
   - `ExpenseList`: Display all expenses with delete buttons
   - `ExpenseSummary`: Display calculated totals
   - `app/page.tsx`: Main dashboard orchestrating all client components

**Data Flow**:
- `page.tsx` (Client) owns state via `useExpenses` custom hook
- Props flow down to child components
- Callbacks flow up for mutations (add, delete)

---

## Risk Assessment

### Low Risk
- ✅ localStorage API well-supported across modern browsers
- ✅ No backend complexity or deployment concerns
- ✅ Simple data model with no relationships
- ✅ Fixed category list prevents data inconsistency

### Medium Risk
- ⚠️ **localStorage quota exceeded**: Mitigated by displaying storage usage; unlikely with text data
- ⚠️ **Data loss if user clears browser data**: Acceptable for personal use; could add export/import feature in future

### No Risk
- ✅ No authentication complexity
- ✅ No network errors to handle
- ✅ No concurrency issues (single user, single tab assumed)

---

## Open Questions

**None** - All technical clarifications resolved through research and spec clarifications.

---

## Next Steps

Proceed to **Phase 1: Design & Contracts**
- Create data-model.md with detailed Expense entity specification
- Generate component contracts (props interfaces)
- Create quickstart.md with manual testing scenarios
- Update CLAUDE.md with feature context
