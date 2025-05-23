"use client";

export function Instructions() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-base font-medium text-gray-800 mb-2">Recording Tips</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ff3365] rounded-full"></span>
            Hit record when you&apos;re ready
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ff3365] rounded-full"></span>
            Keep your device in portrait mode
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ff3365] rounded-full"></span>
            Save to upload to Estate Track
          </div>
        </div>
      </div>
    </div>
  );
}