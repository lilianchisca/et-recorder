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
  PauseResumeButton,
  RecordingsList,
} from "@/components/video-recorder";

export function VideoRecorder() {
  const {
    recordingState,
    recordings,
    currentRecordingId,
    error,
    isSupported,
    videoRef,
    stream,
    startCountdown,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    handleTimeLimit,
    playVideo,
    selectRecording,
    deleteRecording,
    saveVideo,
  } = useVideoRecorder();

  const currentRecording = recordings.find(r => r.id === currentRecordingId);
  const hasVideo = recordings.length > 0;

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
          videoUrl={currentRecording?.url || null}
        />
        {recordingState === "countdown" && (
          <Countdown onComplete={startRecording} />
        )}
        <RecordingTimer 
          recordingState={recordingState}
          onTimeLimit={handleTimeLimit}
        />
        <AudioMeter 
          stream={stream}
          isActive={recordingState === "recording" || recordingState === "countdown" || recordingState === "paused"}
        />
        {(recordingState === "recording" || recordingState === "paused") && (
          <div className="absolute top-4 left-4 bg-black/60 rounded-lg px-3 py-2 text-white text-sm font-medium">
            Take {recordings.length + 1}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <RecordButton
          recordingState={recordingState}
          onStartRecording={startCountdown}
          onStopRecording={stopRecording}
        />
        
        {(recordingState === "recording" || recordingState === "paused") && (
          <div className="flex gap-2">
            <PauseResumeButton
              recordingState={recordingState}
              onPause={pauseRecording}
              onResume={resumeRecording}
            />
            <button
              onClick={stopRecording}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Stop Recording
            </button>
          </div>
        )}
        
        <ControlButtons
          recordingState={recordingState}
          hasVideo={hasVideo}
          onPlay={() => playVideo()}
          onSave={saveVideo}
          onDelete={() => currentRecordingId && deleteRecording(currentRecordingId)}
        />
        
        <RecordingsList
          recordings={recordings}
          currentRecordingId={currentRecordingId}
          recordingState={recordingState}
          onSelect={selectRecording}
          onDelete={deleteRecording}
          onPlay={playVideo}
        />
      </div>

      <Instructions />
    </>
  );
}