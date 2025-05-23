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
      <div className="relative bg-gray-200 rounded-lg overflow-hidden aspect-[9/16] max-h-[500px] mx-auto">
        <video
          ref={ref}
          className="w-full h-full object-cover"
          playsInline
          autoPlay={recordingState === "recording" || recordingState === "countdown"}
          muted={recordingState === "recording" || recordingState === "countdown"}
        />
        {recordingState === "idle" && !videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Camera preview will appear here</p>
          </div>
        )}
      </div>
    );
  }
);

VideoPreview.displayName = "VideoPreview";