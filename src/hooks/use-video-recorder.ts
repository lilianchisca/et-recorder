"use client";

import { useState, useRef, useEffect } from "react";
import type { RecordingState, VideoRecorderHookReturn, Recording } from "@/types/video";

export function useVideoRecorder(): VideoRecorderHookReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentRecordingId, setCurrentRecordingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const recordingDurationRef = useRef<number>(0);

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

  const startCountdown = async () => {
    setError(null);
    try {
      // Get the stream early for audio meter
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
      
      setRecordingState("countdown");
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

  const startRecording = async () => {
    try {
      // Use existing stream if available, otherwise get new one
      let stream = streamRef.current;
      
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
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

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const duration = recordingDurationRef.current;
        
        // Generate unique ID for this recording
        const recordingId = `recording-${Date.now()}`;
        
        // Create new recording object
        const newRecording: Recording = {
          id: recordingId,
          blob,
          url,
          duration,
          timestamp: new Date(),
          thumbnail: undefined, // Will be generated later
        };
        
        // Add to recordings array
        setRecordings(prev => [newRecording, ...prev]);
        setCurrentRecordingId(recordingId);
        setRecordingState("recorded");
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.muted = false;
        }
        
        // Generate thumbnail
        generateThumbnail(url, recordingId);
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Recording failed. Please try again.");
        stopRecording();
      };

      mediaRecorder.start();
      recordingStartTimeRef.current = Date.now();
      recordingDurationRef.current = 0;
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

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      // Check if browser supports pause/resume
      if (typeof mediaRecorderRef.current.pause === 'function') {
        // Update duration before pausing
        recordingDurationRef.current += (Date.now() - recordingStartTimeRef.current) / 1000;
        mediaRecorderRef.current.pause();
        setRecordingState("paused");
      } else {
        setError("Your browser doesn't support pausing recordings.");
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingState === "paused") {
      // Check if browser supports pause/resume
      if (typeof mediaRecorderRef.current.resume === 'function') {
        recordingStartTimeRef.current = Date.now();
        mediaRecorderRef.current.resume();
        setRecordingState("recording");
      } else {
        setError("Your browser doesn't support resuming recordings.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && (recordingState === "recording" || recordingState === "paused")) {
      // Update final duration
      if (recordingState === "recording") {
        recordingDurationRef.current += (Date.now() - recordingStartTimeRef.current) / 1000;
      }
      mediaRecorderRef.current.stop();
    }
  };

  const handleTimeLimit = () => {
    console.log("Recording time limit reached");
    stopRecording();
  };

  const generateThumbnail = async (videoUrl: string, recordingId: string) => {
    try {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = reject;
      });
      
      video.currentTime = 0.1; // Capture frame at 0.1 seconds
      
      await new Promise((resolve) => {
        video.onseeked = resolve;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Calculate crop dimensions for square thumbnail
        const size = Math.min(video.videoWidth, video.videoHeight);
        const x = (video.videoWidth - size) / 2;
        const y = (video.videoHeight - size) / 2;
        
        ctx.drawImage(video, x, y, size, size, 0, 0, 120, 120);
        
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.7);
        
        setRecordings(prev => prev.map(rec => 
          rec.id === recordingId 
            ? { ...rec, thumbnail: thumbnailUrl }
            : rec
        ));
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  };

  const playVideo = (recordingId?: string) => {
    const targetId = recordingId || currentRecordingId;
    const recording = recordings.find(r => r.id === targetId);
    
    if (videoRef.current && recording) {
      videoRef.current.src = recording.url;
      videoRef.current.play();
      setRecordingState("playing");
      
      videoRef.current.onended = () => {
        setRecordingState("recorded");
      };
    }
  };

  const selectRecording = (recordingId: string) => {
    const recording = recordings.find(r => r.id === recordingId);
    if (recording && videoRef.current) {
      setCurrentRecordingId(recordingId);
      videoRef.current.src = recording.url;
      setRecordingState("recorded");
    }
  };

  const deleteRecording = (recordingId: string) => {
    const recording = recordings.find(r => r.id === recordingId);
    if (recording) {
      URL.revokeObjectURL(recording.url);
      if (recording.thumbnail) {
        URL.revokeObjectURL(recording.thumbnail);
      }
    }
    
    setRecordings(prev => prev.filter(r => r.id !== recordingId));
    
    // If deleting current recording, select the next one or reset
    if (recordingId === currentRecordingId) {
      const remainingRecordings = recordings.filter(r => r.id !== recordingId);
      if (remainingRecordings.length > 0) {
        selectRecording(remainingRecordings[0].id);
      } else {
        setCurrentRecordingId(null);
        setRecordingState("idle");
        if (videoRef.current) {
          videoRef.current.src = "";
        }
      }
    }
  };

  const deleteAllRecordings = () => {
    recordings.forEach(recording => {
      URL.revokeObjectURL(recording.url);
      if (recording.thumbnail) {
        URL.revokeObjectURL(recording.thumbnail);
      }
    });
    
    setRecordings([]);
    setCurrentRecordingId(null);
    setRecordingState("idle");
    
    if (videoRef.current) {
      videoRef.current.src = "";
    }
  };

  const saveVideo = () => {
    const recording = recordings.find(r => r.id === currentRecordingId);
    if (!recording) return;
    
    const formData = new FormData();
    formData.append("video", recording.blob, "welcome-video.webm");
    
    console.log("Video ready to upload to Estate Track");
    alert("Save functionality will be implemented with Estate Track API");
  };

  return {
    recordingState,
    recordings,
    currentRecordingId,
    error,
    isSupported,
    videoRef,
    stream: streamRef.current,
    startCountdown,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    handleTimeLimit,
    playVideo,
    selectRecording,
    deleteRecording,
    deleteAllRecordings,
    saveVideo,
  };
}