
# Implementation Plan: Basic Expense Tracking App

**Branch**: `001-basic-expense-tracking` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-basic-expense-tracking/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Build a personal expense tracking application that allows users to add, view, and delete expenses with amount, date, category, and description. The dashboard displays all expenses sorted by date (newest first) with comprehensive totals: overall total, breakdown by category (Food, Transport, Entertainment, Utilities, Healthcare, Other), current month total, and last 7 days total. No authentication required as this is a single-user personal tracker.

## Technical Context
**Language/Version**: TypeScript 5.x with Next.js 15.5.4, React 19
**Primary Dependencies**: Next.js (App Router), React 19, Tailwind CSS v4, Turbopack
**Storage**: localStorage (client-side persistence, no backend database)
**Testing**: Jest with React Testing Library (following Next.js conventions)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Single-page web application (Next.js App Router with client-side storage)
**Performance Goals**: <100ms UI interactions, instant localStorage operations
**Constraints**: Client-side only (localStorage), offline-capable after first load, no auth system
**Scale/Scope**: Personal use (single user), hundreds of expense records, 1 main dashboard view + expense form

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Clean & Modular Code
- ✅ **PASS**: Expense logic will be separated into discrete modules (storage service, calculation utilities, validation)
- ✅ **PASS**: Components will have single responsibilities (ExpenseForm, ExpenseList, ExpenseSummary)
- ✅ **PASS**: Shared logic (date calculations, totals computation) extracted to utility functions

### II. Next.js 15 Best Practices
- ✅ **PASS**: Using App Router architecture (`src/app/` structure)
- ✅ **PASS**: Server Components by default for static layouts
- ✅ **PASS**: Client Components marked with `"use client"` for interactivity (form inputs, localStorage access)
- ✅ **PASS**: No custom Image/Font needs (using standard HTML inputs), but will follow Next.js conventions

### III. Type Safety (Non-Negotiable)
- ✅ **PASS**: Strict TypeScript enabled (already configured in project)
- ✅ **PASS**: All expense data strongly typed (Expense interface with explicit field types)
- ✅ **PASS**: Component props will use TypeScript interfaces
- ✅ **PASS**: No `any` types - localStorage operations will be properly typed with parsing/validation

### IV. Component Architecture
- ✅ **PASS**: Server Components for static page layout
- ✅ **PASS**: Client Components for interactive expense form and list
- ✅ **PASS**: Feature-based organization: `src/app/page.tsx` (main dashboard), components in `src/components/expenses/`
- ✅ **PASS**: Storage and calculation logic in `src/server/` as reusable utilities (even though client-side, maintains separation)

### V. Performance & Optimization
- ✅ **PASS**: Client-side operations (localStorage) are inherently fast (<1ms)
- ✅ **PASS**: Minimal bundle size (no heavy dependencies, just React state and localStorage)
- ✅ **PASS**: No images to optimize (data-driven UI)
- ✅ **PASS**: Code will be split per Next.js defaults (automatic code splitting)

**Initial Assessment**: ✅ ALL CHECKS PASS - No constitutional violations detected

---

**Post-Design Re-evaluation** (after Phase 1 complete):

### I. Clean & Modular Code ✅ PASS
- Design confirms modular separation: storage service, calculation utils, validation, types
- Each component has single responsibility (ExpenseForm for input, ExpenseList for display, ExpenseSummary for totals)
- Utility functions extracted (calculations.ts, validation.ts)
- No violations introduced

### II. Next.js 15 Best Practices ✅ PASS
- Component architecture uses Server Components for layout, Client Components for interactivity
- Follows App Router structure (`src/app/`)
- No framework violations in design
- localStorage access properly scoped to Client Components only

### III. Type Safety ✅ PASS
- Strong TypeScript contracts defined in contracts/component-props.ts
- Expense entity fully typed with strict category union type
- All component props interfaces defined
- Storage operations include type guards for runtime validation
- No violations introduced

### IV. Component Architecture ✅ PASS
- Clear Server/Client split maintained
- Feature-based organization in src/components/expenses/
- Business logic separated into src/server/ utilities
- Co-location of tests in src/__tests__/
- No violations introduced

### V. Performance & Optimization ✅ PASS
- O(n) calculations acceptable for expected scale (<10k records)
- useMemo recommended for calculation memoization
- No heavy dependencies added
- localStorage operations are synchronous and fast
- No violations introduced

**Post-Design Assessment**: ✅ ALL CHECKS STILL PASS - Design maintains constitutional compliance

## Project Structure

### Documentation (this feature)
```
specs/001-basic-expense-tracking/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── app/
│   ├── layout.tsx                    # Root layout (Server Component)
│   ├── page.tsx                      # Dashboard page (Client Component wrapper)
│   └── globals.css                   # Global styles
├── components/
│   └── expenses/
│       ├── ExpenseForm.tsx           # Add expense form (Client Component)
│       ├── ExpenseList.tsx           # List of expenses (Client Component)
│       └── ExpenseSummary.tsx        # Totals display (Client Component)
├── server/
│   ├── storage/
│   │   └── expense-storage.ts        # localStorage operations (client-side)
│   ├── utils/
│   │   ├── calculations.ts           # Total calculations, date filtering
│   │   └── validation.ts             # Expense validation logic
│   └── types/
│       └── expense.ts                # Expense TypeScript interfaces
└── __tests__/
    ├── unit/
    │   ├── calculations.test.ts      # Unit tests for calculations
    │   └── validation.test.ts        # Unit tests for validation
    └── integration/
        └── expense-workflow.test.tsx # Integration tests for user flows
```

**Structure Decision**: Single-project Next.js App Router architecture. All source code lives in `src/` following Next.js 15 conventions. The `src/server/` directory contains reusable business logic (storage, utilities, types) even though execution is client-side - this maintains clean separation of concerns per Constitutional Principle I. Client Components in `src/components/expenses/` handle UI interactivity. Tests are co-located in `src/__tests__/` organized by type (unit/integration).

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType cursor`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. **Foundation Tasks** (Types & Utilities):
   - Create TypeScript type definitions (`src/server/types/expense.ts`)
   - Implement validation utilities (`src/server/utils/validation.ts`)
   - Implement calculation utilities (`src/server/utils/calculations.ts`)
   - Write unit tests for validation [P]
   - Write unit tests for calculations [P]

2. **Storage Layer Tasks**:
   - Implement localStorage storage service (`src/server/storage/expense-storage.ts`)
   - Write unit tests for storage operations [P]

3. **Custom Hook Tasks**:
   - Create useExpenses hook encapsulating state + storage
   - Wire up add/delete operations with localStorage persistence

4. **Component Tasks** (can be done in parallel after hook ready):
   - Create ExpenseForm component [P]
   - Create ExpenseList component [P]
   - Create ExpenseSummary component [P]
   - Update main dashboard page to integrate all components

5. **Integration Test Tasks**:
   - Write integration test for "add expense" user flow
   - Write integration test for "delete expense" user flow
   - Write integration test for totals calculation verification

6. **Polish & Validation Tasks**:
   - Add form validation error messages
   - Add empty state handling (no expenses)
   - Style components with Tailwind CSS
   - Run quickstart.md manual testing scenarios
   - Fix any bugs found during testing

**Ordering Strategy**:
- **Bottom-up**: Types → Utilities → Storage → Hook → Components → Integration → Polish
- **TDD**: Unit tests before implementation (validation, calculations, storage)
- **Parallel**: Mark independent tasks with [P] (e.g., unit tests, component implementations)
- **Dependencies**: Hook depends on storage; components depend on hook; integration tests depend on components

**Task Categorization**:
- **[FOUNDATION]**: Types, utilities, storage (8-10 tasks)
- **[FEATURE]**: Components, hook, integration (8-10 tasks)
- **[TESTING]**: Unit tests, integration tests (6-8 tasks)
- **[POLISH]**: Styling, validation UX, edge cases (4-6 tasks)

**Estimated Output**: 26-34 numbered, dependency-ordered tasks in tasks.md

**Acceptance Gates**:
- All TypeScript compiles without errors
- All unit tests pass (100% coverage for utilities)
- All integration tests pass
- Quickstart manual scenarios pass
- No constitutional violations

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command) - 31 tasks
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (None - no violations)

**Artifacts Generated**:
- [x] research.md - Technical decisions and alternatives
- [x] data-model.md - Expense entity and ExpenseSummary specifications
- [x] contracts/component-props.ts - TypeScript interfaces for all components
- [x] quickstart.md - Manual testing scenarios (10 test scenarios)
- [x] CLAUDE.md - Updated with feature context

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
