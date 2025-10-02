<!--
Sync Impact Report:
Version change: None → 1.0.0
Modified principles: N/A (initial version)
Added sections:
  - Core Principles (5 principles)
  - Development Standards
  - Quality Assurance
  - Governance
Removed sections: N/A (initial version)
Templates requiring updates:
  ✅ spec-template.md - verified no changes needed (constitution-agnostic)
  ✅ plan-template.md - verified constitution check section present
  ✅ tasks-template.md - verified task categorization aligns with principles
Follow-up TODOs: None
-->

# Spec-Kit Next.js App Constitution

## Core Principles

### I. Clean & Modular Code
All code MUST be organized into discrete, reusable modules with clear responsibilities. Each component, function, or service MUST have a single, well-defined purpose. Avoid large monolithic files; prefer breaking functionality into smaller, testable units. Shared logic MUST be extracted into utility functions or custom hooks.

**Rationale**: Modular code improves maintainability, testability, and allows multiple developers to work in parallel without conflicts. It reduces cognitive load and makes debugging significantly faster.

### II. Next.js 15 Best Practices
All code MUST adhere to official Next.js 15 conventions and patterns. This includes: using the App Router architecture, leveraging Server Components by default, implementing proper metadata handling, utilizing built-in optimizations (Image, Font, Script), and following the recommended file structure. Client Components MUST be explicitly marked with `"use client"` directive only when necessary (interactivity, hooks, browser APIs).

**Rationale**: Following framework conventions ensures optimal performance, enables automatic optimizations, reduces bugs, and maintains consistency across the codebase. It also ensures compatibility with future Next.js updates.

### III. Type Safety (Non-Negotiable)
TypeScript MUST be used throughout the codebase with strict mode enabled. All functions MUST have explicit parameter and return types. Any use of `any` type requires explicit justification in code comments. Component props MUST be strongly typed using interfaces or type aliases.

**Rationale**: Type safety catches errors at compile time, provides better IDE support, serves as living documentation, and prevents entire classes of runtime errors. This is especially critical in a React/Next.js environment where prop drilling and component composition are common.

### IV. Component Architecture
React components MUST follow a clear hierarchy: Server Components for data fetching and static content, Client Components for interactivity. Components MUST be co-located with their styles, tests, and related utilities in feature-based directories. Shared components live in `src/components/`, feature-specific components live within their feature directories.

**Rationale**: Proper component architecture prevents unnecessary client-side JavaScript, improves performance through optimal rendering strategies, and makes the codebase intuitive to navigate.

### V. Performance & Optimization
All features MUST be built with performance as a primary consideration. Images MUST use the `next/image` component. Fonts MUST be loaded via `next/font`. Heavy client-side operations MUST be code-split or lazy-loaded. Bundle size MUST be monitored and justified.

**Rationale**: Performance directly impacts user experience and SEO rankings. Next.js provides built-in optimizations that MUST be utilized. Ignoring these leads to slow page loads, poor Core Web Vitals, and user abandonment.

## Development Standards

### Code Organization
- `src/app/` - App Router pages, layouts, and route handlers
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions, helpers, and business logic
- `src/hooks/` - Custom React hooks
- `src/types/` - Shared TypeScript types and interfaces
- `src/styles/` - Global styles and Tailwind configuration
- `public/` - Static assets

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities/hooks: camelCase (e.g., `formatDate.ts`, `useAuth.ts`)
- Files: kebab-case for routes (e.g., `user-profile/page.tsx`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Import Order
1. React and Next.js imports
2. Third-party libraries
3. Internal absolute imports (`@/...`)
4. Relative imports
5. Type imports (separate block)
6. Styles

## Quality Assurance

### Testing Requirements
- New components SHOULD have associated tests
- Business logic MUST be unit tested
- Critical user flows SHOULD have integration tests
- Tests MUST pass before merging to main

### Code Review Standards
- All PRs MUST be reviewed before merging
- Reviews MUST verify compliance with constitution principles
- Feedback MUST focus on architecture, types, and Next.js best practices
- Automated lint and type checks MUST pass

### Documentation
- Complex logic MUST include inline comments explaining "why"
- Public APIs and shared utilities MUST have JSDoc comments
- Feature-level documentation SHOULD be maintained in feature directories
- CLAUDE.md MUST be kept up-to-date with architectural decisions

## Governance

**Amendment Process**: Changes to this constitution require documentation of rationale, team approval (if applicable), and updates to all dependent templates and guidance files.

**Version Control**: This constitution follows semantic versioning. Major changes (new principles, removal of principles) require a MAJOR bump. Adding guidance or expanding existing principles requires a MINOR bump. Clarifications and typo fixes require a PATCH bump.

**Compliance**: All code reviews MUST verify adherence to constitutional principles. Violations require explicit justification and documentation in the Complexity Tracking section of implementation plans. Complexity MUST be justified before introduction, not after.

**Runtime Guidance**: Agents and developers MUST reference `CLAUDE.md` for project-specific context and the latest architectural decisions. The constitution defines non-negotiable principles; CLAUDE.md provides practical guidance for day-to-day development.

**Version**: 1.0.0 | **Ratified**: 2025-10-01 | **Last Amended**: 2025-10-01
