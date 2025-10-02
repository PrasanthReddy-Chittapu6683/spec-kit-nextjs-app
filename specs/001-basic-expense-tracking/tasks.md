# Tasks: Basic Expense Tracking App

**Input**: Design documents from `/specs/001-basic-expense-tracking/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/component-props.ts, quickstart.md

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Extracted: Next.js 15 + React 19 + TypeScript, localStorage, no auth
2. Load optional design documents ✅
   → data-model.md: Expense entity + ExpenseSummary
   → contracts/component-props.ts: Component interfaces
   → research.md: Technical decisions (storage, state, validation)
   → quickstart.md: 10 test scenarios
3. Generate tasks by category ✅
   → Setup: TypeScript config, dependencies
   → Tests: Unit tests (validation, calculations, storage)
   → Core: Types, utilities, storage, hook
   → Feature: Components (form, list, summary), dashboard
   → Integration: User flow tests
   → Polish: Styling, empty states, manual testing
4. Apply task rules ✅
   → Different files = marked [P] for parallel
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T031) ✅
6. Generate dependency graph ✅
7. Validate task completeness ✅
   → All entities have type definitions
   → All utilities have unit tests
   → All components have integration tests
8. Return: SUCCESS (31 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[FOUNDATION]**: Core types and utilities
- **[FEATURE]**: UI components and features
- **[TESTING]**: Unit and integration tests
- **[POLISH]**: Styling, validation UX, edge cases

## Phase 3.1: Setup & Foundation
- [x] **T001** [FOUNDATION] Create directory structure: `src/server/types/`, `src/server/utils/`, `src/server/storage/`, `src/components/expenses/`, `src/__tests__/unit/`, `src/__tests__/integration/`
- [x] **T002** [FOUNDATION] Create TypeScript type definitions in `src/server/types/expense.ts`:
  - `ExpenseCategory` union type ('Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Healthcare' | 'Other')
  - `Expense` interface (id, amount, date, category, description?, createdAt)
  - `ExpenseSummary` interface (overall, byCategory, currentMonth, last7Days)
  - Export all types

## Phase 3.2: Unit Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] **T003** [P] [TESTING] Write unit tests for validation in `src/__tests__/unit/validation.test.ts`:
  - Test `validateAmount`: positive numbers pass, negative/zero/NaN fail
  - Test `validateDate`: valid ISO 8601 dates pass, invalid formats fail
  - Test `validateCategory`: valid categories pass, invalid strings fail
  - Test `validateExpense`: valid expense objects pass, missing required fields fail
  - All tests should FAIL initially (no implementation yet) ✅ Tests written, implementations don't exist yet

- [x] **T004** [P] [TESTING] Write unit tests for calculations in `src/__tests__/unit/calculations.test.ts`:
  - Test `calculateOverallTotal`: sums all expense amounts correctly
  - Test `calculateByCategory`: groups expenses by category and sums each
  - Test `calculateCurrentMonthTotal`: filters to current month and sums
  - Test `calculateLast7DaysTotal`: filters to last 7 days (inclusive) and sums
  - Test `calculateSummary`: returns complete ExpenseSummary object
  - Include edge cases: empty array, single expense, mixed dates
  - All tests should FAIL initially (no implementation yet) ✅ Tests written, implementations don't exist yet

- [x] **T005** [P] [TESTING] Write unit tests for storage in `src/__tests__/unit/expense-storage.test.ts`:
  - Mock localStorage (using jest.spyOn or manual mock)
  - Test `loadExpenses`: parses JSON from localStorage, returns typed array
  - Test `loadExpenses` with no data: returns empty array
  - Test `loadExpenses` with corrupted JSON: throws error or returns empty array
  - Test `saveExpenses`: serializes array to JSON and stores in localStorage
  - Test `clearExpenses`: removes key from localStorage
  - All tests should FAIL initially (no implementation yet) ✅ Tests written, implementations don't exist yet

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] **T006** [P] [FOUNDATION] Implement validation utilities in `src/server/utils/validation.ts`:
  - `validateAmount(amount: unknown): boolean` - check positive number ✅
  - `validateDate(date: unknown): boolean` - check valid ISO 8601 date ✅
  - `validateCategory(category: unknown): boolean` - check against ExpenseCategory union ✅
  - `validateExpense(expense: Partial<Expense>): ValidationResult` - validate full object ✅
  - Use type guards (`typeof`, `instanceof`) for runtime checks ✅
  - TypeScript compiles successfully ✅

- [x] **T007** [P] [FOUNDATION] Implement calculation utilities in `src/server/utils/calculations.ts`:
  - `calculateOverallTotal(expenses: Expense[]): number` ✅
  - `calculateByCategory(expenses: Expense[]): Record<ExpenseCategory, number>` ✅
  - `calculateCurrentMonthTotal(expenses: Expense[]): number` ✅
  - `calculateLast7DaysTotal(expenses: Expense[]): number` ✅
  - `calculateSummary(expenses: Expense[]): ExpenseSummary` - calls all above ✅
  - Use native Date API for date filtering (as per research.md) ✅
  - TypeScript compiles successfully ✅

- [x] **T008** [FOUNDATION] Implement localStorage storage service in `src/server/storage/expense-storage.ts`:
  - `loadExpenses(): Expense[]` - parse from localStorage key "expenses" ✅
  - `saveExpenses(expenses: Expense[]): void` - serialize to localStorage ✅
  - `clearExpenses(): void` - remove from localStorage ✅
  - Add error handling for quota exceeded, JSON parse errors ✅
  - Use type guards to validate parsed data structure ✅
  - TypeScript compiles successfully ✅

- [x] **T009** [FEATURE] Create custom hook `useExpenses` in `src/hooks/useExpenses.ts`:
  - State: `expenses` array, `isLoading`, `error` ✅
  - Effect: Load expenses from storage on mount ✅
  - Function: `addExpense(expense: Omit<Expense, 'id' | 'createdAt'>)` - generate UUID, save to storage ✅
  - Function: `deleteExpense(id: string)` - remove from array, save to storage ✅
  - Computed: `summary` using `calculateSummary` (memoize with useMemo) ✅
  - Sort expenses by date descending (newest first) ✅
  - Return: `{ expenses, summary, isLoading, error, addExpense, deleteExpense }` ✅

## Phase 3.4: Component Implementation

- [x] **T010** [P] [FEATURE] Create ExpenseForm component in `src/components/expenses/ExpenseForm.tsx`:
  - Mark with `"use client"` directive ✅
  - Props: `onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void` ✅
  - State: amount (string), date (string), category (ExpenseCategory | ''), description (string) ✅
  - Form fields: amount (type="number", min=0.01, step=0.01), date (type="date"), category (select dropdown), description (textarea, optional) ✅
  - HTML5 validation: required on amount, date, category ✅
  - On submit: validate inputs, call onAddExpense, clear form ✅
  - Use Tailwind CSS utility classes for basic styling ✅

- [x] **T011** [P] [FEATURE] Create ExpenseList component in `src/components/expenses/ExpenseList.tsx`:
  - Mark with `"use client"` directive ✅
  - Props: `expenses: Expense[]`, `onDeleteExpense: (id: string) => void` ✅
  - Render table or list of expenses (already sorted by parent) ✅
  - Each row shows: date, category, amount (formatted as currency), description ✅
  - Delete button for each expense (with confirmation via window.confirm) ✅
  - Handle empty state: show "No expenses yet" message if array empty ✅
  - Use Tailwind CSS for table/list styling ✅

- [x] **T012** [P] [FEATURE] Create ExpenseSummary component in `src/components/expenses/ExpenseSummary.tsx`:
  - Mark with `"use client"` directive ✅
  - Props: `summary: ExpenseSummary` ✅
  - Display sections:
    - Overall Total: Large, prominent display ✅
    - By Category: Grid or list showing each of 6 categories with amounts ✅
    - Current Month Total: Labeled clearly ✅
    - Last 7 Days Total: Labeled clearly ✅
  - Format all amounts as currency (e.g., `$42.99`) ✅
  - Use Tailwind CSS for card/grid layout ✅

- [x] **T013** [FEATURE] Update dashboard page in `src/app/page.tsx`:
  - Mark with `"use client"` directive (entire page needs interactivity) ✅
  - Import and use `useExpenses` hook ✅
  - Layout structure:
    - Title: "Expense Tracker" ✅
    - Top section: ExpenseSummary component ✅
    - Middle section: ExpenseForm component ✅
    - Bottom section: ExpenseList component ✅
  - Pass expenses, summary, addExpense, deleteExpense to child components ✅
  - Show loading state while data loads from localStorage ✅
  - Show error state if storage operations fail
  - Use Tailwind CSS for responsive layout (mobile-first)

## Phase 3.5: Integration Tests

- [ ] **T014** [P] [TESTING] Write integration test for "add expense" flow in `src/__tests__/integration/add-expense.test.tsx`:
  - Render dashboard page
  - Fill out expense form with valid data
  - Click submit button
  - Assert: New expense appears in list
  - Assert: Form clears after submission
  - Assert: Totals update correctly
  - Assert: localStorage contains new expense
  - Use React Testing Library (`render`, `screen`, `userEvent`, `waitFor`)

- [ ] **T015** [P] [TESTING] Write integration test for "delete expense" flow in `src/__tests__/integration/delete-expense.test.tsx`:
  - Pre-populate localStorage with test expenses
  - Render dashboard page
  - Find delete button for specific expense
  - Mock window.confirm to return true
  - Click delete button
  - Assert: Expense removed from list
  - Assert: Totals recalculated correctly
  - Assert: localStorage updated (expense removed)
  - Use React Testing Library

- [ ] **T016** [P] [TESTING] Write integration test for totals calculation in `src/__tests__/integration/totals-calculation.test.tsx`:
  - Pre-populate localStorage with expenses spanning multiple dates and categories
  - Render dashboard page
  - Assert: Overall total matches expected sum
  - Assert: Each category total matches expected sum
  - Assert: Current month total filters correctly
  - Assert: Last 7 days total filters correctly
  - Test with edge cases: all expenses in one category, expenses outside 7-day window
  - Use React Testing Library

## Phase 3.6: Polish & Validation

- [ ] **T017** [POLISH] Add client-side form validation error messages in `src/components/expenses/ExpenseForm.tsx`:
  - Show error message if amount is <= 0
  - Show error message if date is empty
  - Show error message if category not selected
  - Display errors in red text below each field
  - Prevent form submission if validation fails
  - Clear errors when user corrects input

- [x] **T018** [POLISH] Enhance empty states in `src/components/expenses/ExpenseList.tsx`:
  - When no expenses exist, show helpful message: "No expenses yet. Add your first expense above!" ✅
  - Center the empty state message ✅
  - Style with Tailwind CSS ✅

- [x] **T019** [POLISH] Improve currency formatting throughout the app:
  - Currency formatting implemented inline using `Intl.NumberFormat` ✅
  - Apply to all amount displays in ExpenseList and ExpenseSummary ✅
  - Ensure 2 decimal places always shown (e.g., $10.00, not $10) ✅

- [x] **T020** [POLISH] Add date formatting:
  - Date formatting implemented inline using `Intl.DateTimeFormat` ✅
  - Example: "2025-10-01" → "Oct 1, 2025" ✅
  - Apply to date display in ExpenseList ✅
  - Keep ISO format in form input, only format for display ✅

- [x] **T021** [P] [POLISH] Style ExpenseForm with Tailwind CSS in `src/components/expenses/ExpenseForm.tsx`:
  - Form container: Card with padding, border, shadow ✅
  - Input fields: Consistent height, border, focus states ✅
  - Submit button: Primary color, hover effect ✅
  - Responsive: Stack fields vertically on mobile, grid on desktop ✅
  - Accessibility: Labels associated with inputs, proper focus order ✅

- [x] **T022** [P] [POLISH] Style ExpenseList with Tailwind CSS in `src/components/expenses/ExpenseList.tsx`:
  - Table/List: Clean borders, hover effects ✅
  - Delete button: Red/danger color, hover effect ✅
  - Responsive: Desktop table view, mobile card layout ✅
  - Amount column: Right-aligned ✅
  - Date column: Left-aligned ✅

- [x] **T023** [P] [POLISH] Style ExpenseSummary with Tailwind CSS in `src/components/expenses/ExpenseSummary.tsx`:
  - Overall total: Large font, bold, prominent gradient card ✅
  - Category breakdown: Grid layout (1-3 columns responsive) ✅
  - Each category: Card with label and amount ✅
  - Color coding: Different colors for each category ✅
  - Current month & last 7 days: Secondary cards in grid ✅

- [x] **T024** [P] [POLISH] Style dashboard page layout in `src/app/page.tsx`:
  - Page container: Max width (7xl), centered, padding ✅
  - Title: Large heading (4xl) at top ✅
  - Section spacing: Consistent margin (space-y-8) ✅
  - Responsive: Single column layout ✅
  - Background: Gray-50 background ✅

- [x] **T025** [POLISH] Add loading states throughout the app:
  - In `useExpenses`: Set `isLoading` to true during initial load ✅
  - In `src/app/page.tsx`: Show loading spinner while `isLoading` is true ✅
  - After data loads, show content ✅
  - Loading state is minimal and fast ✅

- [x] **T026** [POLISH] Add error handling UI:
  - In `src/app/page.tsx`: Display error message if `useExpenses` returns an error ✅
  - Show user-friendly error: "Error Loading Expenses" ✅
  - Include a "Retry" button that calls `location.reload()` ✅
  - Style error message with red border and icon ✅

- [ ] **T027** [POLISH] Implement localStorage quota handling:
  - In `src/server/storage/expense-storage.ts`: Catch QuotaExceededError on save
  - Display user-friendly error: "Storage full. Please delete some expenses."
  - Log error to console for debugging
  - Return false from saveExpenses on failure (update return type to boolean)

- [ ] **T028** [POLISH] Add expense count display in `src/components/expenses/ExpenseList.tsx`:
  - Show total number of expenses above the list: "Showing 42 expenses"
  - Update when expenses added/deleted
  - Style with subtle text color

- [ ] **T029** [POLISH] Add delete confirmation modal (replace window.confirm):
  - Create simple modal component or use window.confirm (simpler for MVP)
  - If using modal: Show expense details in confirmation message
  - Buttons: "Cancel" (secondary) and "Delete" (danger/red)
  - Close modal on cancel, delete expense on confirm
  - (Optional: Can defer to future version, keep window.confirm for now)

- [ ] **T030** [POLISH] Run all quickstart.md manual testing scenarios:
  - Execute Test Scenario 1: Add First Expense (Happy Path)
  - Execute Test Scenario 2: Add Multiple Expenses
  - Execute Test Scenario 3: Delete Expense
  - Execute Test Scenario 4: Form Validation (Negative Cases)
  - Execute Test Scenario 5: Date Handling
  - Execute Test Scenario 6: Category Breakdown
  - Execute Test Scenario 7: Large Dataset Performance (100+ expenses)
  - Execute Test Scenario 8: Data Persistence
  - Execute Test Scenario 9: Edge Cases
  - Execute Test Scenario 10: Accessibility
  - Document any bugs found and create fix tasks

- [ ] **T031** [POLISH] Final verification and cleanup:
  - Run TypeScript compiler: `npm run build` (should succeed with no errors)
  - Run all tests: `npm test` (all should pass)
  - Run linter: `npm run lint` (no errors)
  - Verify all acceptance criteria from spec.md are met
  - Remove any console.log statements
  - Remove unused imports
  - Commit all changes with message: "Complete expense tracking feature"

## Dependencies

### Critical Path
```
T001 (setup)
  → T002 (types)
    → T003, T004, T005 (tests - parallel)
      → T006, T007, T008 (implementations - parallel after respective tests)
        → T009 (hook - depends on T006, T007, T008)
          → T010, T011, T012 (components - parallel)
            → T013 (dashboard - depends on T010, T011, T012)
              → T014, T015, T016 (integration tests - parallel)
                → T017-T029 (polish - most can be parallel)
                  → T030, T031 (final verification)
```

### Blocking Dependencies
- T002 blocks all test tasks (need types)
- T003 blocks T006 (validation test → validation impl)
- T004 blocks T007 (calculation test → calculation impl)
- T005 blocks T008 (storage test → storage impl)
- T006, T007, T008 block T009 (utilities → hook)
- T009 blocks T010, T011, T012 (hook → components)
- T010, T011, T012 block T013 (components → dashboard)
- T013 blocks T014, T015, T016 (dashboard → integration tests)

### Parallel Opportunities
- **After T002**: T003, T004, T005 can run in parallel (different test files)
- **After T003-T005**: T006, T007, T008 can run in parallel (different impl files)
- **After T009**: T010, T011, T012 can run in parallel (different component files)
- **After T013**: T014, T015, T016 can run in parallel (different test files)
- **Polish phase**: T017-T029 mostly parallel (different files or non-conflicting edits)

## Parallel Execution Examples

### Batch 1: Write all unit tests together (after T002)
```bash
# Launch T003, T004, T005 in parallel:
```
Files:
- `src/__tests__/unit/validation.test.ts`
- `src/__tests__/unit/calculations.test.ts`
- `src/__tests__/unit/expense-storage.test.ts`

### Batch 2: Implement all utilities (after tests fail)
```bash
# Launch T006, T007, T008 in parallel:
```
Files:
- `src/server/utils/validation.ts`
- `src/server/utils/calculations.ts`
- `src/server/storage/expense-storage.ts`

### Batch 3: Create all components (after T009)
```bash
# Launch T010, T011, T012 in parallel:
```
Files:
- `src/components/expenses/ExpenseForm.tsx`
- `src/components/expenses/ExpenseList.tsx`
- `src/components/expenses/ExpenseSummary.tsx`

### Batch 4: Write all integration tests (after T013)
```bash
# Launch T014, T015, T016 in parallel:
```
Files:
- `src/__tests__/integration/add-expense.test.tsx`
- `src/__tests__/integration/delete-expense.test.tsx`
- `src/__tests__/integration/totals-calculation.test.tsx`

### Batch 5: Style all components (during polish)
```bash
# Launch T021, T022, T023, T024 in parallel:
```
Files:
- `src/components/expenses/ExpenseForm.tsx` (styling only)
- `src/components/expenses/ExpenseList.tsx` (styling only)
- `src/components/expenses/ExpenseSummary.tsx` (styling only)
- `src/app/page.tsx` (layout styling)

## Validation Checklist
*Completed during task generation*

- [x] All entities have type definitions (T002 - Expense, ExpenseCategory, ExpenseSummary)
- [x] All utilities have unit tests (T003 validation, T004 calculations, T005 storage)
- [x] All tests come before implementation (T003-T005 before T006-T008)
- [x] Parallel tasks are truly independent (different files, marked [P])
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] All user stories have integration tests (T014 add, T015 delete, T016 totals)
- [x] Quickstart scenarios covered (T030)
- [x] Constitutional compliance maintained (clean modules, type safety, Next.js conventions)

## Notes
- **TDD Approach**: Write tests first (T003-T005), ensure they FAIL, then implement (T006-T008)
- **Parallel Execution**: Tasks marked [P] can run simultaneously if using multiple agents/sessions
- **Commit Strategy**: Commit after each task completion for easy rollback
- **Testing**: Run relevant tests after each implementation task to verify correctness
- **TypeScript**: All code must compile with no errors (`npm run build`)
- **No Auth**: Remember this is a personal, single-user tracker - no authentication needed
- **localStorage**: All data persists client-side only, no backend API calls
- **Offline-First**: App works without internet connection after initial load

## Acceptance Criteria (from spec.md)
All tasks must be complete before feature is considered done:
- ✅ Can add valid expenses with all fields
- ✅ Can delete expenses
- ✅ Expenses sorted newest first
- ✅ All totals calculate correctly (overall, by category, current month, last 7 days)
- ✅ Form validation blocks invalid input (negative amounts, missing fields)
- ✅ Data persists across browser sessions (localStorage)
- ✅ All 6 categories tracked (Food, Transport, Entertainment, Utilities, Healthcare, Other)
- ✅ Performance acceptable for 100+ expenses
- ✅ Accessible via keyboard
- ✅ Edge cases handled gracefully (empty state, large amounts, special characters)

---

**Next Step**: Begin execution with T001 (setup directory structure)

**Estimated Time**: 8-12 hours for all 31 tasks (varies by developer experience)

**Progress Tracking**: Mark tasks complete with [x] as you finish them
