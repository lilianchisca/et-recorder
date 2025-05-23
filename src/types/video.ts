export type RecordingState = "idle" | "countdown" | "recording" | "recorded" | "playing";

export interface VideoRecorderHookReturn {
  recordingState: RecordingState;
  videoBlob: Blob | null;
  videoUrl: string | null;
  error: string | null;
  isSupported: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  startCountdown: () => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  handleTimeLimit: () => void;
  playVideo: () => void;
  saveVideo: () => void;
  deleteVideo: () => void;
}