"use client";

import { useVideoRecorder } from "@/hooks/use-video-recorder";
import {
  VideoPreview,
  RecordButton,
  ControlButtons,
  ErrorMessage,
  Instructions,
  Countdown,
  RecordingTimer,
  AudioMeter,
} from "@/components/video-recorder";

export function VideoRecorder() {
  const {
    recordingState,
    videoUrl,
    error,
    isSupported,
    videoRef,
    stream,
    startCountdown,
    startRecording,
    stopRecording,
    handleTimeLimit,
    playVideo,
    saveVideo,
    deleteVideo,
  } = useVideoRecorder();

  if (!isSupported) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <p className="text-gray-600 text-sm">
          Please use a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    );
  }

  return (
    <>
      <ErrorMessage error={error} />
      
      <div className="mb-6 relative">
        <VideoPreview
          ref={videoRef}
          recordingState={recordingState}
          videoUrl={videoUrl}
        />
        {recordingState === "countdown" && (
          <Countdown onComplete={startRecording} />
        )}
        <RecordingTimer 
          isRecording={recordingState === "recording"}
          onTimeLimit={handleTimeLimit}
        />
        <AudioMeter 
          stream={stream}
          isActive={recordingState === "recording" || recordingState === "countdown"}
        />
      </div>

      <div className="space-y-3">
        <RecordButton
          recordingState={recordingState}
          onStartRecording={startCountdown}
          onStopRecording={stopRecording}
        />
        
        <ControlButtons
          recordingState={recordingState}
          hasVideo={!!videoUrl}
          onPlay={playVideo}
          onSave={saveVideo}
          onDelete={deleteVideo}
        />
      </div>

      <Instructions />
    </>
  );
}