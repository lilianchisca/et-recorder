"use client";

import type { RecordingState } from "@/types/video";

interface ControlButtonsProps {
  recordingState: RecordingState;
  hasVideo: boolean;
  onPlay: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export function ControlButtons({ 
  recordingState, 
  hasVideo, 
  onPlay, 
  onSave, 
  onDelete 
}: ControlButtonsProps) {
  const isRecording = recordingState === "recording";
  const isDisabled = !hasVideo || isRecording;

  return (
    <>
      <button
        onClick={onPlay}
        disabled={isDisabled}
        className="w-full py-4 px-6 bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        <span className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
          <span className="w-0 h-0 border-l-[8px] border-l-gray-600 border-y-[5px] border-y-transparent ml-1" />
        </span>
        Play Video
      </button>

      <button
        onClick={onSave}
        disabled={isDisabled}
        className="w-full py-4 px-6 bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        Save Video
      </button>

      <button
        onClick={onDelete}
        disabled={isDisabled}
        className="w-full py-4 px-6 bg-gray-200 rounded-lg font-medium text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete Video
      </button>
    </>
  );
}