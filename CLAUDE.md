# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Video Recorder** web application built with Next.js 15.1.8 and TypeScript. It provides a browser-based video recording interface with features like multiple takes, video trimming, and real-time audio monitoring.

## Development Commands

```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run all linting (ESLint + TypeScript)
pnpm lint

# Run ESLint only
pnpm lint:eslint

# Run TypeScript type checking
pnpm lint:types
```

## Architecture

### Core Technologies
- **Framework**: Next.js 15.1.8 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Package Manager**: pnpm
- **Path alias**: `@/*` mapped to `./src/*`

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Geist font
│   ├── page.tsx           # Home page rendering VideoRecorder
│   └── globals.css        # Global styles with Tailwind directives
├── components/            
│   └── video-recorder/    # All video recording components
│       ├── video-recorder.tsx  # Main component (entry point)
│       ├── audio-meter.tsx     # Real-time audio level visualization
│       ├── countdown.tsx       # 3-second countdown with sound
│       ├── recording-timer.tsx # Recording duration timer
│       ├── video-preview.tsx   # Video element wrapper
│       ├── video-trimmer.tsx   # Video trimming interface
│       ├── recordings-list.tsx # List of recorded takes
│       └── ...                 # Other UI components
├── hooks/
│   ├── use-video-recorder.ts  # Core recording logic & state
│   └── use-toast.ts           # Toast notification system
└── types/
    └── video.ts               # TypeScript interfaces

```

### Key Components

1. **VideoRecorder** (`video-recorder.tsx`): Main component that orchestrates the entire recording experience
   - Props: `maxRecordingTime` (default: 120s), `enableCountdownSound` (default: true)
   - Manages recording states: idle, countdown, recording, paused, playing, trimming

2. **useVideoRecorder** hook: Core business logic for:
   - MediaRecorder API management
   - Recording state transitions
   - Multiple recordings/takes management
   - Video trimming functionality
   - Browser compatibility checks

3. **Recording States**:
   - `idle`: No recording, ready to start
   - `countdown`: 3-second countdown before recording
   - `recording`: Actively recording
   - `paused`: Recording paused
   - `playing`: Playing back a recording
   - `trimming`: In trim mode

### Browser APIs Used

- **MediaRecorder API**: For video recording
- **getUserMedia API**: For camera/microphone access
- **Web Audio API**: For audio level monitoring
- **Blob API**: For video file handling

### Code Conventions

- Use functional components with hooks
- Prefer `interface` over `type` for object shapes
- Keep components focused and single-purpose
- Use custom hooks for complex logic
- Follow existing component patterns in `video-recorder/` folder
- Always handle browser compatibility checks

### Important Notes

- The app requires HTTPS in production (camera access requirement)
- Always check `isSupported` before using recording features
- Handle permissions properly (camera/microphone access)
- Test across different browsers (Chrome, Firefox, Safari)
- Maximum recording time is configurable but defaults to 2 minutes

### Git Commit Conventions

- Use conventional commit format (feat:, fix:, docs:, style:, refactor:, test:, chore:)
- Write clear, concise commit messages
- **NEVER include Claude Code references or signatures in commit messages**
- Do not add "Generated with Claude Code" or "Co-Authored-By: Claude" lines
- Keep commit messages professional and focused on the changes made