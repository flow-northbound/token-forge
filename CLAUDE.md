# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
UI Token Forge is a Next.js 15.4.1 application built with React 19 and TypeScript. It's a design system generator tool that creates base UI design tokens following Practical UI design principles.

## Essential Commands

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Create production build
- `pnpm start` - Run production server

### Code Quality
- `pnpm lint` - Run Next.js linting
- `pnpm check` - Run all checks: TypeScript, ESLint, Biome formatting, and Knip
- `pnpm knip` - Find unused exports and dependencies

### Database
- `pnpm db:push` - Push Drizzle schema changes to database
- `pnpm db:studio` - Open Drizzle Studio for visual database management
- `pnpm db:auth` - Update auth-related database tables

### UI Components
- `pnpm ui` - Add new shadcn/ui components

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (New York style, Zinc color)
- **Database**: Drizzle ORM
- **Authentication**: better-auth
- **Validation**: arktype

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/db/` - Database schema and models (Drizzle)
- `src/lib/` - Shared utilities and configurations
- `src/ui/components/` - Reusable UI components
- `src/ui/primitives/` - Base UI primitives

### Code Style Configuration
- **TypeScript**: Strict mode enabled, ES2022 target
- **Path Aliases**: `@/*` maps to `./src/*`
- **Formatting**: Biome with 2-space indentation, double quotes, 80 char line width
- **Linting**: ESLint with TypeScript, React, Perfectionist, and Readable Tailwind plugins

### Important Notes
- Package manager: pnpm 10.13.1 (always use pnpm, not npm or yarn)
- The project is currently in initial setup phase with default Next.js template
- No testing framework is configured yet
- When adding shadcn/ui components, they are configured to use CSS variables and the New York style