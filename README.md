# Video Recorder

A browser-based video recording application built with Next.js 15, TypeScript, and Tailwind CSS v4. This application allows users to record, preview, trim, and save videos directly in their web browser.

## Features

- **Video Recording**: Record videos using your device's camera with a clean, intuitive interface
- **Multiple Takes**: Record multiple takes and manage them easily
- **Video Trimming**: Trim your recordings to keep only the best parts
- **Audio Monitoring**: Real-time audio level meter during recording
- **Countdown Timer**: 3-second countdown before recording starts (with optional sound effects)
- **Recording Timer**: Visual timer showing recording duration with configurable max duration
- **Pause/Resume**: Pause and resume recording as needed
- **Playback Controls**: Preview recordings before saving
- **Time Limit Warnings**: Automatic warnings at 60s, 30s, and 10s before max recording time
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js 15.1.8](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **Font**: Geist (auto-optimized with next/font)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (package manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd recorder
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
# Development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run all linting checks
pnpm lint

# Run ESLint only
pnpm lint:eslint

# Run TypeScript type checking
pnpm lint:types
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with Geist font
│   ├── page.tsx           # Home page with VideoRecorder
│   └── globals.css        # Global styles with Tailwind
├── components/            
│   └── video-recorder/    # Video recorder components
│       ├── audio-meter.tsx
│       ├── control-buttons.tsx
│       ├── countdown.tsx
│       ├── error-message.tsx
│       ├── instructions.tsx
│       ├── pause-resume-button.tsx
│       ├── record-button.tsx
│       ├── recording-timer.tsx
│       ├── recordings-list.tsx
│       ├── toast-notification.tsx
│       ├── video-preview.tsx
│       ├── video-recorder.tsx  # Main component
│       └── video-trimmer.tsx
├── hooks/                 # React hooks
│   ├── use-toast.ts      # Toast notifications
│   └── use-video-recorder.ts  # Core recording logic
└── types/                 # TypeScript types
    └── video.ts          # Video-related types
```

## Browser Support

This application requires a modern browser with support for:
- MediaRecorder API
- getUserMedia API
- Web Audio API

Supported browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Configuration

The `VideoRecorder` component accepts the following props:

- `maxRecordingTime` (number): Maximum recording duration in seconds (default: 120)
- `enableCountdownSound` (boolean): Enable countdown sound effects (default: true)

## Development

The project uses strict TypeScript configuration and ESLint for code quality. Make sure to run linting before committing:

```bash
pnpm lint
```
