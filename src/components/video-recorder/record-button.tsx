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
      className={`w-full py-5 px-6 rounded-xl font-medium text-white flex items-center justify-center gap-3 transition-colors shadow-lg text-lg ${
        isRecording
          ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
          : "bg-gradient-to-r from-[#ff3365] to-[#ff5580] hover:from-[#e62d58] hover:to-[#ff3365] active:from-[#d12950] active:to-[#e62d58] disabled:from-gray-300 disabled:to-gray-400"
      } disabled:cursor-not-allowed`}
    >
      <span className="w-10 h-10 border-[3px] border-white rounded-full flex items-center justify-center">
        {isRecording ? (
          <span className="w-5 h-5 bg-white rounded-sm" />
        ) : (
          <span className="w-5 h-5 bg-white rounded-full" />
        )}
      </span>
      {isRecording ? "Stop Recording" : "Record Video"}
    </button>
  );
}