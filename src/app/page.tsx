import { VideoRecorder } from "@/components/video-recorder";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-sm mx-auto">
        <VideoRecorder />
      </div>
    </div>
  );
}
