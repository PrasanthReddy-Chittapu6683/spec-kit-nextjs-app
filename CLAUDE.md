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
- Project constitution template (`memory/constitution.md`)
- Development templates (spec, plan, tasks, agent-file)
- PowerShell automation scripts for feature creation and planning

Use the `/specify`, `/plan`, `/clarify`, `/tasks`, `/analyze`, and `/implement` slash commands for spec-driven development workflows.

## Notes
- All builds and dev commands use Turbopack (`--turbopack` flag)
- The project uses Tailwind CSS v4 with PostCSS
- Static assets go in `public/` directory
- Edit `src/app/page.tsx` to modify the home page
