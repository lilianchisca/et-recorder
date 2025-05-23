"use client";

import { forwardRef } from "react";
import type { RecordingState } from "@/types/video";

interface VideoPreviewProps {
  recordingState: RecordingState;
  videoUrl: string | null;
}

export const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ recordingState, videoUrl }, ref) => {
    return (
      <div className="relative bg-gray-900 w-full h-full">
        <video
          ref={ref}
          className="w-full h-full object-cover"
          playsInline
          autoPlay={recordingState === "recording" || recordingState === "countdown" || recordingState === "paused"}
          muted={recordingState === "recording" || recordingState === "countdown" || recordingState === "paused"}
        />
        {recordingState === "idle" && !videoUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 text-sm">Camera preview will appear here</p>
          </div>
        )}
      </div>
    );
  }
);

VideoPreview.displayName = "VideoPreview";