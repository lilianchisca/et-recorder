"use client";

import type { RecordingState } from "@/types/video";

interface PauseResumeButtonProps {
  recordingState: RecordingState;
  onPause: () => void;
  onResume: () => void;
}

export function PauseResumeButton({ 
  recordingState, 
  onPause, 
  onResume 
}: PauseResumeButtonProps) {
  if (recordingState !== "recording" && recordingState !== "paused") {
    return null;
  }

  const isPaused = recordingState === "paused";

  return (
    <button
      onClick={isPaused ? onResume : onPause}
      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
      aria-label={isPaused ? "Resume recording" : "Pause recording"}
    >
      {isPaused ? (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Resume
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Pause
        </>
      )}
    </button>
  );
}