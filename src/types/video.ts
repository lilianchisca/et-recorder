export type RecordingState = "idle" | "countdown" | "recording" | "paused" | "recorded" | "playing" | "trimming";

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
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  trimStart: number;
  trimEnd: number;
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
  startTrimming: () => void;
  setTrimStart: (time: number) => void;
  setTrimEnd: (time: number) => void;
  resetTrim: () => void;
  cancelTrimming: () => void;
  applyTrim: () => Promise<void>;
}