"use client";

import { useState, useRef, useEffect } from "react";
// Using inline SVG icons instead of lucide-react

interface VideoTrimmerProps {
  videoUrl: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
  onTrimStartChange: (time: number) => void;
  onTrimEndChange: (time: number) => void;
  onReset: () => void;
  onApply: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export function VideoTrimmer({
  videoUrl,
  duration,
  trimStart,
  trimEnd,
  onTrimStartChange,
  onTrimEndChange,
  onReset,
  onApply,
  onCancel,
  isProcessing = false,
}: VideoTrimmerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = videoUrl;
    video.currentTime = trimStart;
    setCurrentTime(trimStart);

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      
      // Stop playback at trim end
      if (time >= trimEnd) {
        video.pause();
        setIsPlaying(false);
        video.currentTime = trimStart;
        setCurrentTime(trimStart);
      }
    };

    const handleLoadedMetadata = () => {
      video.currentTime = trimStart;
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl, trimStart, trimEnd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      // If at the end, restart from beginning
      if (video.currentTime >= trimEnd) {
        video.currentTime = trimStart;
      }
      video.play();
      setIsPlaying(true);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || isDraggingStart || isDraggingEnd) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    // Clamp between trim bounds
    const clampedTime = Math.max(trimStart, Math.min(trimEnd, newTime));
    
    if (videoRef.current) {
      videoRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    }
  };

  const handleStartDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingStart(true);
  };

  const handleEndDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingEnd(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, mouseX / rect.width));
      const newTime = percentage * duration;

      if (isDraggingStart) {
        const clampedTime = Math.max(0, Math.min(trimEnd - 0.1, newTime));
        onTrimStartChange(clampedTime);
        if (videoRef.current) {
          videoRef.current.currentTime = clampedTime;
          setCurrentTime(clampedTime);
        }
      } else if (isDraggingEnd) {
        const clampedTime = Math.max(trimStart + 0.1, Math.min(duration, newTime));
        onTrimEndChange(clampedTime);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingStart(false);
      setIsDraggingEnd(false);
    };

    if (isDraggingStart || isDraggingEnd) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingStart, isDraggingEnd, duration, trimStart, trimEnd, onTrimStartChange, onTrimEndChange]);

  const trimDuration = trimEnd - trimStart;
  const startPercentage = (trimStart / duration) * 100;
  const endPercentage = (trimEnd / duration) * 100;
  const currentPercentage = (currentTime / duration) * 100;

  return (
    <div>
      {/* Preview Video */}
      <div className="relative aspect-9/16 bg-black w-full h-[60vh] max-h-[500px]">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted={false}
        />
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayPause}
            disabled={isProcessing}
            className="bg-black/50 hover:bg-black/70 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-xs disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="p-4 space-y-4">
        {/* Timeline */}
        <div className="space-y-2">
        <div className="text-sm text-gray-600 text-center">
          Timeline
        </div>
        
        <div
          ref={timelineRef}
          className="relative h-12 bg-gray-200 rounded-lg cursor-pointer overflow-hidden"
          onClick={handleTimelineClick}
        >
          {/* Background timeline */}
          <div className="absolute inset-0 bg-gray-300" />
          
          {/* Trimmed section */}
          <div
            className="absolute top-0 bottom-0 bg-blue-500 opacity-80"
            style={{
              left: `${startPercentage}%`,
              width: `${endPercentage - startPercentage}%`,
            }}
          />
          
          {/* Current playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
            style={{ left: `${currentPercentage}%` }}
          />
          
          {/* Start handle */}
          <div
            className="absolute top-0 bottom-0 w-3 bg-blue-600 cursor-ew-resize z-10 hover:bg-blue-700 flex items-center justify-center"
            style={{ left: `${startPercentage}%` }}
            onMouseDown={handleStartDrag}
          >
            <div className="w-1 h-6 bg-white rounded-sm" />
          </div>
          
          {/* End handle */}
          <div
            className="absolute top-0 bottom-0 w-3 bg-blue-600 cursor-ew-resize z-10 hover:bg-blue-700 flex items-center justify-center"
            style={{ left: `${endPercentage}%`, transform: 'translateX(-100%)' }}
            onMouseDown={handleEndDrag}
          >
            <div className="w-1 h-6 bg-white rounded-sm" />
          </div>
        </div>
        
        {/* Time markers */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(trimStart)}</span>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(trimEnd)}</span>
        </div>
      </div>

      {/* Duration info */}
      <div className="text-center space-y-1">
        <div className="text-sm text-gray-600">
          Original: {formatTime(duration)} → Trimmed: {formatTime(trimDuration)}
        </div>
        <div className="text-xs text-gray-500">
          Saved: {formatTime(duration - trimDuration)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={onReset}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
        
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
        
        <button
          onClick={onApply}
          disabled={isProcessing || trimDuration <= 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-700 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {isProcessing ? 'Processing...' : 'Apply'}
        </button>
        </div>
      </div>
    </div>
  );
}