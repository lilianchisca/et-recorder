import { VideoRecorder } from "@/components/video-recorder";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <VideoRecorder />
      </div>
    </div>
  );
}
