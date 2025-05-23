# Video Recorder Enhancement Tasks

## Core Recording Features

### 1. Countdown Timer (3-2-1) Before Recording
- [x] Create a `Countdown` component with animated numbers
- [x] Add countdown state to the video recorder hook
- [x] Implement countdown logic with `setTimeout`/`setInterval`
- [x] Add CSS animations for number transitions
- [ ] Play countdown sound effects (optional)
- [x] Prevent user interactions during countdown
- [x] Auto-start recording when countdown reaches 0

### 2. Recording Time Limit with Visual Countdown
- [x] Add `maxRecordingTime` configuration (default: 2 minutes)
- [x] Create `RecordingTimer` component showing elapsed/remaining time
- [x] Implement circular progress indicator for time limit
- [x] Add warning states (yellow at 30s remaining, red at 10s)
- [x] Auto-stop recording when time limit reached
- [ ] Display toast/notification when approaching limit
- [ ] Make time limit configurable via props

### 3. Pause/Resume Recording Functionality
- [x] Research MediaRecorder pause/resume API support
- [x] Add `isPaused` state to recording states
- [x] Create pause/resume button component
- [x] Implement pause logic in the recorder hook
- [x] Handle browser compatibility (fallback for unsupported browsers)
- [x] Update UI to show paused state clearly
- [x] Maintain recording timer state during pause

### 4. Multiple Takes Feature
- [x] Extend data model to support array of recordings
- [x] Create `Recording` type with metadata (id, timestamp, duration, thumbnail)
- [x] Implement `RecordingsList` component to display all takes
- [x] Add thumbnail generation for each recording
- [x] Create take selection UI with preview
- [x] Add "Use this take" and "Delete take" actions
- [x] Implement storage management (memory cleanup)
- [x] Add take counter display (Take 1, Take 2, etc.)

## User Experience Features

### 5. Video Trimming - Basic Start/End
- [ ] Create `VideoTrimmer` component with timeline UI
- [ ] Implement video playback with frame-accurate seeking
- [ ] Add draggable start/end trim handles
- [ ] Display trim preview in real-time
- [ ] Create trim markers with time display
- [ ] Implement trim processing using Web APIs
- [ ] Generate new blob from trimmed video
- [ ] Add "Reset trim" option
- [ ] Show before/after duration

### 6. Audio Level Meter
- [x] Create `AudioMeter` component with visual bars
- [x] Implement Web Audio API analyzer
- [x] Connect audio stream to analyzer during recording
- [x] Add real-time level visualization (green/yellow/red zones)
- [ ] Include peak level indicator
- [ ] Add microphone sensitivity adjustment
- [x] Show "no audio" warning if levels too low
- [x] Implement smooth animations for level changes

## Technical Implementation Details

### State Management Updates
```typescript
type RecordingState = "idle" | "countdown" | "recording" | "paused" | "recorded" | "playing" | "trimming";

interface Recording {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  timestamp: Date;
  thumbnail?: string;
}

interface VideoRecorderState {
  recordings: Recording[];
  currentRecordingId: string | null;
  recordingTimeElapsed: number;
  trimStart: number;
  trimEnd: number;
  audioLevel: number;
}
```

### Component Structure
```
components/
├── video-recorder/
│   ├── countdown.tsx
│   ├── recording-timer.tsx
│   ├── pause-resume-button.tsx
│   ├── recordings-list.tsx
│   ├── video-trimmer.tsx
│   ├── audio-meter.tsx
│   └── ... (existing components)
```

### Hook Updates
- Extend `useVideoRecorder` to handle new states
- Create `useAudioLevel` hook for audio analysis
- Create `useVideoTrimmer` hook for trim functionality
- Add `useCountdown` hook for countdown logic

### Browser Compatibility Considerations
- Check MediaRecorder pause/resume support
- Fallback UI for unsupported features
- Polyfills for older browsers
- Progressive enhancement approach

### Performance Optimizations
- Lazy load trimmer component
- Use Web Workers for video processing
- Implement efficient blob management
- Add memory usage monitoring
- Clean up resources properly

### Testing Requirements
- Unit tests for new hooks
- Component tests for UI elements
- Integration tests for recording flow
- Browser compatibility tests
- Performance benchmarks

## Implementation Order
1. Countdown timer (simplest, immediate UX improvement)
2. Audio level meter (real-time feedback)
3. Recording time limit (builds on timer work)
4. Pause/resume (if supported by browser)
5. Multiple takes (data model change)
6. Video trimming (most complex feature)

## Estimated Timeline
- Countdown timer: 2-3 hours
- Audio level meter: 3-4 hours
- Recording time limit: 2-3 hours
- Pause/resume: 4-5 hours
- Multiple takes: 6-8 hours
- Video trimming: 8-10 hours

Total: ~25-35 hours of development time