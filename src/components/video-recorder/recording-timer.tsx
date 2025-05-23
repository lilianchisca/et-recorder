"use client";

import { useEffect, useState } from "react";
import type { RecordingState } from "@/types/video";

interface RecordingTimerProps {
  recordingState: RecordingState;
  maxDuration?: number; // in seconds
  onTimeLimit?: () => void;
}

export function RecordingTimer({ 
  recordingState, 
  maxDuration = 120, // 2 minutes default
  onTimeLimit 
}: RecordingTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const isActive = recordingState === "recording" || recordingState === "paused";

  useEffect(() => {
    // Reset timer when not recording
    if (!isActive) {
      setElapsedTime(0);
      return;
    }

    // Only increment timer when actively recording (not paused)
    if (recordingState !== "recording") {
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= maxDuration && onTimeLimit) {
          onTimeLimit();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [recordingState, isActive, maxDuration, onTimeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (elapsedTime / maxDuration) * 100;
  const remainingTime = maxDuration - elapsedTime;
  
  // Determine color based on remaining time
  const getProgressColor = () => {
    if (remainingTime <= 10) return "bg-red-500";
    if (remainingTime <= 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!isActive) return null;

  return (
    <div className="absolute top-4 right-4 bg-black/60 rounded-lg p-3 text-white">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-sm font-medium">
          {formatTime(elapsedTime)} / {formatTime(maxDuration)}
        </div>
        {recordingState === "paused" && (
          <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded font-medium animate-pulse">
            PAUSED
          </span>
        )}
      </div>
      <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {remainingTime <= 30 && (
        <div className="text-xs mt-1 text-yellow-300">
          {remainingTime}s remaining
        </div>
      )}
    </div>
  );
}