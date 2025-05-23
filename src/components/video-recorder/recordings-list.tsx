"use client";

import type { Recording, RecordingState } from "@/types/video";

interface RecordingsListProps {
  recordings: Recording[];
  currentRecordingId: string | null;
  recordingState: RecordingState;
  onSelect: (recordingId: string) => void;
  onDelete: (recordingId: string) => void;
  onPlay: (recordingId: string) => void;
}

export function RecordingsList({
  recordings,
  currentRecordingId,
  recordingState,
  onSelect,
  onDelete,
  onPlay,
}: RecordingsListProps) {
  if (recordings.length === 0) {
    return null;
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-800">Your Takes</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {recordings.length}
        </span>
      </div>
      
      {/* Mobile-optimized list */}
      <div className="space-y-2">
        {recordings.map((recording, index) => {
          const isSelected = recording.id === currentRecordingId;
          const takeNumber = recordings.length - index;

          return (
            <div
              key={recording.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#ff3365] bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              onClick={() => onSelect(recording.id)}
            >
              <div className="flex items-center gap-3">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-sm bg-gray-900 overflow-hidden shrink-0">
                  {recording.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={recording.thumbnail}
                      alt={`Take ${takeNumber}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">Take {takeNumber}</span>
                    {isSelected && (
                      <span className="text-xs text-[#ff3365] bg-pink-100 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatDuration(recording.duration)} • {formatTime(recording.timestamp)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(recording.id);
                    }}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Play recording"
                    disabled={recordingState === "recording" || recordingState === "countdown"}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete Take ${takeNumber}?`)) {
                        onDelete(recording.id);
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Delete recording"
                    disabled={recordingState === "recording" || recordingState === "countdown"}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}