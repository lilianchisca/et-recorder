"use client";

import { useVideoRecorder } from "@/hooks/use-video-recorder";
import { useToast } from "@/hooks/use-toast";
import {
  VideoPreview,
  RecordButton,
  ErrorMessage,
  Instructions,
  Countdown,
  RecordingTimer,
  AudioMeter,
  PauseResumeButton,
  RecordingsList,
  VideoTrimmer,
  ToastContainer,
} from "@/components/video-recorder";

interface VideoRecorderProps {
  maxRecordingTime?: number; // in seconds, defaults to 120 (2 minutes)
  enableCountdownSound?: boolean; // enable countdown sound effects
}

export function VideoRecorder({ maxRecordingTime = 120, enableCountdownSound = true }: VideoRecorderProps = {}) {
  const {
    recordingState,
    recordings,
    currentRecordingId,
    error,
    isSupported,
    videoRef,
    stream,
    trimStart,
    trimEnd,
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
    startTrimming,
    setTrimStart,
    setTrimEnd,
    resetTrim,
    cancelTrimming,
    applyTrim,
  } = useVideoRecorder();

  const { toasts, addToast, removeToast } = useToast();

  const currentRecording = recordings.find(r => r.id === currentRecordingId);
  const hasVideo = recordings.length > 0;

  const handleTimeLimitWarning = (remainingTime: number) => {
    if (remainingTime === 60) {
      addToast("1 minute remaining", "warning");
    } else if (remainingTime === 30) {
      addToast("30 seconds remaining", "warning");
    } else if (remainingTime === 10) {
      addToast("10 seconds remaining! Recording will stop automatically", "error");
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 text-sm">
            Please use a modern browser like Chrome, Firefox, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ErrorMessage error={error} />
        
        {/* Video Section */}
        {recordingState === "trimming" && currentRecording ? (
          <div className="bg-white">
            <VideoTrimmer
              videoUrl={currentRecording.url}
              duration={currentRecording.duration}
              trimStart={trimStart}
              trimEnd={trimEnd}
              onTrimStartChange={setTrimStart}
              onTrimEndChange={setTrimEnd}
              onReset={resetTrim}
              onApply={applyTrim}
              onCancel={cancelTrimming}
            />
          </div>
        ) : (
          <div className="relative bg-black h-[60vh] max-h-[500px]">
            <VideoPreview
              ref={videoRef}
              recordingState={recordingState}
              videoUrl={currentRecording?.url || null}
            />
            {recordingState === "countdown" && (
              <Countdown 
                onComplete={startRecording} 
                enableSound={enableCountdownSound}
              />
            )}
            <RecordingTimer 
              recordingState={recordingState}
              maxDuration={maxRecordingTime}
              onTimeLimit={handleTimeLimit}
              onWarning={handleTimeLimitWarning}
            />
            <AudioMeter 
              stream={stream}
              isActive={recordingState === "recording" || recordingState === "countdown" || recordingState === "paused"}
            />
            {(recordingState === "recording" || recordingState === "paused") && (
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs rounded-lg px-3 py-2 text-white text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Take {recordings.length + 1}
              </div>
            )}
          </div>
        )}

        {/* Controls Section */}
        <div className="p-4 space-y-4 bg-white">
          {/* Main Record Button */}
          {recordingState !== "recording" && recordingState !== "paused" && recordingState !== "trimming" && (
            <RecordButton
              recordingState={recordingState}
              onStartRecording={startCountdown}
              onStopRecording={stopRecording}
            />
          )}
          
          {/* Recording Controls */}
          {(recordingState === "recording" || recordingState === "paused") && (
            <div className="flex gap-3">
              <PauseResumeButton
                recordingState={recordingState}
                onPause={pauseRecording}
                onResume={resumeRecording}
              />
              <button
                onClick={stopRecording}
                className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-4 px-6 rounded-xl transition-colors shadow-lg cursor-pointer"
              >
                Stop Recording
              </button>
            </div>
          )}
          
          {/* Playback Controls */}
          {hasVideo && recordingState !== "recording" && recordingState !== "paused" && recordingState !== "trimming" && (
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => playVideo()}
                disabled={recordingState === "playing"}
                className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-medium py-4 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex flex-col items-center gap-1"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Play</span>
              </button>
              <button
                onClick={startTrimming}
                className="bg-blue-100 hover:bg-blue-200 active:bg-blue-300 text-blue-700 font-medium py-4 px-4 rounded-xl transition-colors cursor-pointer flex flex-col items-center gap-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span className="text-xs">Trim</span>
              </button>
              <button
                onClick={saveVideo}
                className="bg-green-100 hover:bg-green-200 active:bg-green-300 text-green-700 font-medium py-4 px-4 rounded-xl transition-colors cursor-pointer flex flex-col items-center gap-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-xs">Save</span>
              </button>
              <button
                onClick={() => currentRecordingId && deleteRecording(currentRecordingId)}
                className="bg-red-100 hover:bg-red-200 active:bg-red-300 text-red-700 font-medium py-4 px-4 rounded-xl transition-colors cursor-pointer flex flex-col items-center gap-1"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Delete</span>
              </button>
            </div>
          )}


          {/* Takes List */}
          {recordings.length > 0 && recordingState !== "trimming" && (
            <div className="border-t pt-4">
              <RecordingsList
                recordings={recordings}
                currentRecordingId={currentRecordingId}
                recordingState={recordingState}
                onSelect={selectRecording}
                onDelete={deleteRecording}
                onPlay={playVideo}
              />
            </div>
          )}

          {/* Instructions */}
          {recordingState === "idle" && recordings.length === 0 && (
            <div className="text-center py-4 border-t">
              <Instructions />
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Notifications */}
      <ToastContainer 
        toasts={toasts} 
        onRemoveToast={removeToast}
      />
    </div>
  );
}