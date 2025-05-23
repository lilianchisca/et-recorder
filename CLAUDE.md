# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.1.8 application with TypeScript, using the App Router structure. The project uses pnpm as the package manager.

## Development Commands

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

## Architecture

The application follows Next.js App Router conventions:

- `/src/app/`: Contains the application routes and layouts
  - `layout.tsx`: Root layout with Geist font configuration
  - `page.tsx`: Homepage component
  - `globals.css`: Global styles with Tailwind CSS directives

The project uses:
- **Tailwind CSS** for styling with custom CSS variables
- **TypeScript** with strict mode enabled
- **Path alias** `@/*` mapped to `./src/*`