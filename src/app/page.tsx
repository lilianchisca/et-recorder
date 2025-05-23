import { VideoRecorder } from "@/components/video-recorder";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <VideoRecorder />
      </div>
    </div>
  );
}
