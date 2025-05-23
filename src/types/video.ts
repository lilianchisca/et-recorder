export type RecordingState = "idle" | "countdown" | "recording" | "paused" | "recorded" | "playing";

export interface Recording {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  timestamp: Date;
  thumbnail?: string;
}

export interface VideoRecorderHookReturn {
  recordingState: RecordingState;
  recordings: Recording[];
  currentRecordingId: string | null;
  error: string | null;
  isSupported: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  startCountdown: () => Promise<void>;
  startRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  handleTimeLimit: () => void;
  playVideo: (recordingId?: string) => void;
  selectRecording: (recordingId: string) => void;
  deleteRecording: (recordingId: string) => void;
  deleteAllRecordings: () => void;
  saveVideo: () => void;
}