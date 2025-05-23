"use client";

import { useState, useRef, useEffect } from "react";
import type { RecordingState, VideoRecorderHookReturn } from "@/types/video";

export function useVideoRecorder(): VideoRecorderHookReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setError("Your browser doesn't support camera access. Please use a modern browser.");
      return;
    }

    if (!window.MediaRecorder) {
      setIsSupported(false);
      setError("Your browser doesn't support video recording. Please use Chrome, Firefox, or Safari.");
      return;
    }

    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      setError("Camera access requires HTTPS. Please use HTTPS or localhost.");
    }
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 1280 }
        },
        audio: true
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
        ? 'video/webm;codecs=vp9' 
        : MediaRecorder.isTypeSupported('video/webm') 
        ? 'video/webm'
        : 'video/mp4';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setVideoBlob(blob);
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setRecordingState("recorded");
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.muted = false;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Recording failed. Please try again.");
        stopRecording();
      };

      mediaRecorder.start();
      setRecordingState("recording");
    } catch (err) {
      console.error("Error accessing camera:", err);
      const error = err as Error;
      if (error.name === 'NotAllowedError') {
        setError("Camera access denied. Please grant camera permissions and try again.");
      } else if (error.name === 'NotFoundError') {
        setError("No camera found. Please ensure your device has a camera.");
      } else if (error.name === 'NotReadableError') {
        setError("Camera is already in use by another application.");
      } else {
        setError("Unable to access camera. Please try again.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const playVideo = () => {
    if (videoRef.current && videoUrl) {
      videoRef.current.play();
      setRecordingState("playing");
      
      videoRef.current.onended = () => {
        setRecordingState("recorded");
      };
    }
  };

  const saveVideo = () => {
    if (!videoBlob) return;
    
    const formData = new FormData();
    formData.append("video", videoBlob, "welcome-video.webm");
    
    console.log("Video ready to upload to Estate Track");
    alert("Save functionality will be implemented with Estate Track API");
  };

  const deleteVideo = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoBlob(null);
    setVideoUrl(null);
    setRecordingState("idle");
    
    if (videoRef.current) {
      videoRef.current.src = "";
    }
  };

  return {
    recordingState,
    videoBlob,
    videoUrl,
    error,
    isSupported,
    videoRef,
    startRecording,
    stopRecording,
    playVideo,
    saveVideo,
    deleteVideo,
  };
}