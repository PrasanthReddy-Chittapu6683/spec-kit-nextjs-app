# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.4 application using React 19, TypeScript, and Tailwind CSS v4. The project uses Turbopack for faster builds and development. It follows the Next.js App Router architecture with the `src/app` directory structure.

## Development Commands

```bash
# Development server with hot reload (uses Turbopack)
npm run dev
# Opens at http://localhost:3000

# Production build (uses Turbopack)
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global styles and Tailwind directives

### Key Configurations
- **Path Aliases**: `@/*` maps to `./src/*` (tsconfig.json)
- **TypeScript**: Strict mode enabled, targeting ES2017
- **ESLint**: Uses Next.js core-web-vitals and TypeScript configs
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`

### Spec-Kit Integration
This project includes `.specify/` directory with:
- Project constitution (`.specify/memory/constitution.md` v1.0.0)
- Development templates (spec, plan, tasks, agent-file)
- PowerShell automation scripts for feature creation and planning

Use the `/specify`, `/plan`, `/clarify`, `/tasks`, `/analyze`, and `/implement` slash commands for spec-driven development workflows.

### Constitutional Principles
This project follows a formal constitution defining non-negotiable development standards. See `.specify/memory/constitution.md` for details. Key principles:
1. **Clean & Modular Code** - Single responsibility, small testable units
2. **Next.js 15 Best Practices** - App Router, Server Components by default, proper optimizations
3. **Type Safety** - Strict TypeScript, no `any` without justification
4. **Component Architecture** - Server-first, feature-based organization
5. **Performance & Optimization** - Use Next.js built-ins (Image, Font, lazy loading)

## Active Feature: Expense Tracking App (Branch: 001-basic-expense-tracking)

### Feature Overview
Personal expense tracking application with add, view, and delete functionality. No authentication - single-user, client-side only.

### Technical Stack
- **Storage**: localStorage (client-side persistence)
- **State**: React useState + useEffect (no external state library)
- **Validation**: HTML5 + TypeScript type guards
- **Testing**: Jest + React Testing Library

### Key Data Types
```typescript
type ExpenseCategory = 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Healthcare' | 'Other';

interface Expense {
  id: string;           // UUID v4
  amount: number;       // Positive, max 2 decimals
  date: string;         // ISO 8601 (YYYY-MM-DD)
  category: ExpenseCategory;
  description?: string; // Optional
  createdAt: string;    // ISO 8601 timestamp
}
```

### Component Architecture
- `src/app/page.tsx` - Main dashboard (Client Component)
- `src/components/expenses/ExpenseForm.tsx` - Add expense form
- `src/components/expenses/ExpenseList.tsx` - Display all expenses
- `src/components/expenses/ExpenseSummary.tsx` - Display totals
- `src/server/storage/expense-storage.ts` - localStorage operations
- `src/server/utils/calculations.ts` - Total calculations
- `src/server/types/expense.ts` - TypeScript interfaces

### Business Rules
- Categories: Fixed set of 6 (no custom categories)
- Sorting: Newest first (by date)
- Totals: Overall, by category, current month, last 7 days
- Validation: Amount must be positive, date and category required
- Future dates: Allowed

### Implementation Notes
- All expenses stored in localStorage under key `"expenses"` as JSON array
- Calculations run on-demand (use useMemo for performance)
- No edit functionality (v1 scope - add/delete only)
- Immutable expense records

### Feature Documentation
- Spec: `specs/001-basic-expense-tracking/spec.md`
- Plan: `specs/001-basic-expense-tracking/plan.md`
- Research: `specs/001-basic-expense-tracking/research.md`
- Data Model: `specs/001-basic-expense-tracking/data-model.md`
- Quickstart: `specs/001-basic-expense-tracking/quickstart.md`

---

## Notes
- All builds and dev commands use Turbopack (`--turbopack` flag)
- The project uses Tailwind CSS v4 with PostCSS
- Static assets go in `public/` directory
- Edit `src/app/page.tsx` to modify the home page
