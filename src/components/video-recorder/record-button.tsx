"use client";

import type { RecordingState } from "@/types/video";

interface RecordButtonProps {
  recordingState: RecordingState;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function RecordButton({ 
  recordingState, 
  onStartRecording, 
  onStopRecording 
}: RecordButtonProps) {
  const isRecording = recordingState === "recording";
  const isDisabled = recordingState === "playing" || recordingState === "countdown" || recordingState === "paused";

  return (
    <button
      onClick={isRecording ? onStopRecording : onStartRecording}
      disabled={isDisabled}
      className={`w-full py-4 px-6 rounded-lg font-medium text-white flex items-center justify-center gap-3 transition-colors ${
        isRecording
          ? "bg-red-600 hover:bg-red-700"
          : "bg-[#ff3365] hover:bg-[#e62d58] disabled:bg-gray-300"
      }`}
    >
      <span className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
        {isRecording ? (
          <span className="w-3 h-3 bg-white rounded-sm" />
        ) : (
          <span className="w-3 h-3 bg-white rounded-full" />
        )}
      </span>
      {isRecording ? "Stop Recording" : "Record Video"}
    </button>
  );
}