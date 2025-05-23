export type RecordingState = "idle" | "recording" | "recorded" | "playing";

export interface VideoRecorderHookReturn {
  recordingState: RecordingState;
  videoBlob: Blob | null;
  videoUrl: string | null;
  error: string | null;
  isSupported: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  playVideo: () => void;
  saveVideo: () => void;
  deleteVideo: () => void;
}