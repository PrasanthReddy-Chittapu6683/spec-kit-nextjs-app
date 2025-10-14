# Quickstart: Basic Expense Tracking App

**Feature**: 001-basic-expense-tracking
**Date**: 2025-10-01
**Purpose**: Manual testing scenarios to validate feature implementation

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Development server running (`npm run dev`)
- Modern browser (Chrome, Firefox, Safari, or Edge)

## Setup

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Open browser**
   Navigate to `http://localhost:3000`

3. **Clear localStorage (optional, for clean start)**
   Open browser DevTools → Application/Storage → localStorage → Delete `expenses` key

---

## Test Scenario 1: Add First Expense (Happy Path)

**Objective**: Verify user can add a valid expense and see it in the list

### Steps

1. **Navigate to dashboard**
   - URL: `http://localhost:3000`
   - **Expected**: Empty expense list, all totals show $0.00

2. **Fill out expense form**
   - Amount: `42.99`
   - Date: Today's date (or use date picker)
   - Category: Select `Food` from dropdown
   - Description: `Lunch at downtown cafe`

3. **Submit form**
   - Click "Add Expense" button
   - **Expected**:
     - ✅ Form clears after submission
     - ✅ New expense appears at top of list (newest first)
     - ✅ Expense shows correct amount: $42.99
     - ✅ Expense shows selected date
     - ✅ Expense shows category: Food
     - ✅ Expense shows description

4. **Verify totals updated**
   - **Expected**:
     - ✅ Overall total: $42.99
     - ✅ Food category total: $42.99
     - ✅ Other categories: $0.00
     - ✅ Current month total: $42.99 (if today)
     - ✅ Last 7 days total: $42.99

---

## Test Scenario 2: Add Multiple Expenses

**Objective**: Verify multiple expenses can be added and totals aggregate correctly

### Steps

1. **Add second expense**
   - Amount: `120.00`
   - Date: 3 days ago
   - Category: `Utilities`
   - Description: `Electricity bill`
   - **Expected**: Added to list, sorted by date (newest first)

2. **Add third expense**
   - Amount: `25.50`
   - Date: Today
   - Category: `Transport`
   - Description: `Uber to office`
   - **Expected**: Appears at top (most recent)

3. **Verify list order**
   - **Expected order** (newest first):
     1. Transport - $25.50 (today)
     2. Food - $42.99 (today)
     3. Utilities - $120.00 (3 days ago)

4. **Verify totals**
   - **Expected**:
     - ✅ Overall total: $188.49
     - ✅ Food: $42.99
     - ✅ Utilities: $120.00
     - ✅ Transport: $25.50
     - ✅ Last 7 days: $188.49 (all within 7 days)
     - ✅ Current month: $188.49 (all in current month)

---

## Test Scenario 3: Delete Expense

**Objective**: Verify user can delete an expense and totals recalculate

### Steps

1. **Starting state**: 3 expenses from Scenario 2 (total $188.49)

2. **Delete middle expense (Food - $42.99)**
   - Click delete button (trash icon or "Delete" text) on Food expense
   - **Expected**:
     - ✅ Expense immediately removed from list
     - ✅ Confirmation dialog may appear (optional UX choice)
     - ✅ Remaining expenses: Transport ($25.50), Utilities ($120.00)

3. **Verify totals updated**
   - **Expected**:
     - ✅ Overall total: $145.50
     - ✅ Food: $0.00
     - ✅ Transport: $25.50
     - ✅ Utilities: $120.00
     - ✅ Last 7 days: $145.50
     - ✅ Current month: $145.50

4. **Verify persistence**
   - Refresh browser page
   - **Expected**: Still only 2 expenses (delete persisted to localStorage)

---

## Test Scenario 4: Form Validation (Negative Cases)

**Objective**: Verify validation prevents invalid data entry

### Test 4a: Missing Required Fields

1. **Leave amount empty, fill other fields**
   - Date: Today
   - Category: Food
   - Description: Test
   - Click submit
   - **Expected**: ❌ Form does not submit, error message shown for amount field

2. **Leave date empty**
   - Amount: 50
   - Category: Food
   - Click submit
   - **Expected**: ❌ Form does not submit, error message shown for date field

3. **Leave category unselected**
   - Amount: 50
   - Date: Today
   - Click submit
   - **Expected**: ❌ Form does not submit, error message shown for category field

### Test 4b: Invalid Amount

1. **Enter negative amount**
   - Amount: `-10`
   - Date: Today
   - Category: Food
   - Click submit
   - **Expected**: ❌ HTML5 validation blocks submission, or JavaScript shows error

2. **Enter zero amount**
   - Amount: `0`
   - Date: Today
   - Category: Food
   - Click submit
   - **Expected**: ❌ Validation error "Amount must be positive"

3. **Enter non-numeric amount**
   - Amount: `abc`
   - Date: Today
   - Category: Food
   - Click submit
   - **Expected**: ❌ HTML input type="number" prevents non-numeric entry

### Test 4c: Optional Description

1. **Submit expense without description**
   - Amount: 10
   - Date: Today
   - Category: Other
   - Description: (leave empty)
   - Click submit
   - **Expected**: ✅ Expense added successfully (description is optional)

---

## Test Scenario 5: Date Handling

**Objective**: Verify date filtering for current month and last 7 days

### Setup

1. **Add expense from last month**
   - Amount: 200
   - Date: (manually select a date from previous month, e.g., if today is Oct 15, select Sep 20)
   - Category: Healthcare
   - Click submit

2. **Add expense from 10 days ago**
   - Amount: 75
   - Date: (calculate: today - 10 days)
   - Category: Entertainment
   - Click submit

3. **Add expense from today**
   - Amount: 30
   - Date: Today
   - Category: Food
   - Click submit

### Verify Totals

- **Expected**:
  - ✅ Overall total: $305 (all expenses)
  - ✅ Current month total: $105 (only today's + 10 days ago if same month)
  - ✅ Last 7 days total: $30 (only today's expense)
  - ✅ Last month's expense NOT counted in current month or last 7 days

---

## Test Scenario 6: Category Breakdown

**Objective**: Verify all 6 categories are tracked correctly

### Steps

1. **Clear existing data** (optional: delete all expenses or clear localStorage)

2. **Add one expense per category**
   - Food: $50
   - Transport: $40
   - Entertainment: $30
   - Utilities: $100
   - Healthcare: $150
   - Other: $25

3. **Verify summary display**
   - **Expected**:
     - ✅ Overall total: $395
     - ✅ Food: $50
     - ✅ Transport: $40
     - ✅ Entertainment: $30
     - ✅ Utilities: $100
     - ✅ Healthcare: $150
     - ✅ Other: $25
     - ✅ All categories visible in breakdown (even if $0)

---

## Test Scenario 7: Large Dataset Performance

**Objective**: Verify app handles hundreds of expenses without lag

### Steps

1. **Add 100+ expenses** (can use DevTools console for bulk insert)
   ```javascript
   // Open browser console and run:
   const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Other'];
   const expenses = [];
   for (let i = 0; i < 100; i++) {
     expenses.push({
       id: crypto.randomUUID(),
       amount: Math.random() * 100,
       date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
       category: categories[Math.floor(Math.random() * categories.length)],
       description: `Test expense ${i}`,
       createdAt: new Date().toISOString()
     });
   }
   localStorage.setItem('expenses', JSON.stringify(expenses));
   location.reload();
   ```

2. **Verify page loads quickly**
   - **Expected**: Page renders in <1 second

3. **Verify interactions remain responsive**
   - Scroll through list: smooth scrolling
   - Add new expense: immediate update
   - Delete expense: immediate update
   - **Expected**: <100ms for all UI interactions

---

## Test Scenario 8: Data Persistence

**Objective**: Verify localStorage persistence across sessions

### Steps

1. **Add 3 expenses** (any valid data)

2. **Close browser tab completely**

3. **Reopen `http://localhost:3000` in new tab**
   - **Expected**: ✅ All 3 expenses still present

4. **Refresh page (F5 or Cmd+R)**
   - **Expected**: ✅ All expenses persist

5. **Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)**
   - **Expected**: ✅ All expenses still persist (localStorage unaffected by hard refresh)

---

## Test Scenario 9: Edge Cases

### Test 9a: Empty State

1. **Delete all expenses** (or start with clean localStorage)
2. **Expected**:
   - ✅ Empty state message: "No expenses yet. Add your first expense above!"
   - ✅ All totals show $0.00
   - ✅ Form still functional

### Test 9b: Future Date

1. **Add expense with future date**
   - Date: Tomorrow's date
   - Amount: 100
   - Category: Other
   - **Expected**: ✅ Accepted (per clarification, future dates allowed)

### Test 9c: Very Large Amount

1. **Add expense with large amount**
   - Amount: 9999999.99
   - **Expected**: ✅ Accepted, displayed correctly with proper formatting

### Test 9d: Special Characters in Description

1. **Add description with special characters**
   - Description: `Coffee @ "Café" <Main St> & Bakery — $5 off!`
   - **Expected**: ✅ Saved and displayed correctly (no HTML escaping issues)

---

## Test Scenario 10: Accessibility

**Objective**: Verify keyboard navigation and screen reader support

### Steps

1. **Tab through form fields**
   - **Expected**: Logical tab order (amount → date → category → description → submit button)

2. **Submit form using Enter key**
   - Fill form, press Enter in any field
   - **Expected**: Form submits

3. **Delete expense using keyboard**
   - Tab to delete button, press Enter or Space
   - **Expected**: Expense deleted

4. **Check form labels**
   - **Expected**: All inputs have associated `<label>` elements

5. **Check error messages**
   - Trigger validation error
   - **Expected**: Error message has appropriate ARIA attributes

---

## Success Criteria

All test scenarios MUST pass for feature to be considered complete:

- ✅ Can add valid expenses
- ✅ Can delete expenses
- ✅ Expenses sorted newest first
- ✅ All totals calculate correctly (overall, by category, current month, last 7 days)
- ✅ Form validation blocks invalid input
- ✅ Data persists across sessions
- ✅ All 6 categories tracked
- ✅ Performance acceptable for 100+ expenses
- ✅ Accessible via keyboard
- ✅ Edge cases handled gracefully

---

## Troubleshooting

### Issue: Expenses not persisting

**Solution**: Check browser console for localStorage errors. Verify localStorage is not disabled in browser settings.

### Issue: Totals not updating

**Solution**: Check browser console for calculation errors. Verify date parsing is correct.

### Issue: Page crashes with many expenses

**Solution**: Check browser console for errors. May need to implement pagination or virtualization (not in v1 scope).

### Issue: Can't delete expense

**Solution**: Verify delete button has proper event handler. Check console for errors.

---

## Next Steps

After all quickstart scenarios pass:
- Run automated tests (`npm test`)
- Check TypeScript compilation (`npm run build`)
- Validate against feature spec acceptance criteria
- Deploy to production (if applicable)
