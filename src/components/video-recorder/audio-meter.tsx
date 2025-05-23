"use client";

import { useEffect, useRef, useState } from "react";

interface AudioMeterProps {
  stream: MediaStream | null;
  isActive: boolean;
}

export function AudioMeter({ stream, isActive }: AudioMeterProps) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastPeakTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!stream || !isActive) {
      setAudioLevel(0);
      setPeakLevel(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.7;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average level
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const average = sum / dataArray.length;
        const normalizedLevel = Math.min(100, (average / 255) * 100 * 2); // Amplify for better visibility

        setAudioLevel(normalizedLevel);

        // Peak detection and decay
        const currentTime = Date.now();
        setPeakLevel(prevPeak => {
          let newPeak = prevPeak;
          
          // If current level is higher than peak, update peak and timestamp
          if (normalizedLevel > prevPeak) {
            newPeak = normalizedLevel;
            lastPeakTimeRef.current = currentTime;
          } else {
            // Decay the peak over time (2% per frame, roughly 1 second to decay from 100 to 50)
            const timeSinceLastPeak = currentTime - lastPeakTimeRef.current;
            if (timeSinceLastPeak > 100) { // Wait 100ms before starting decay
              newPeak = Math.max(normalizedLevel, prevPeak * 0.98);
            }
          }
          
          return newPeak;
        });

        animationRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (error) {
      console.error("Error setting up audio meter:", error);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stream, isActive]);

  const getBarColor = (barIndex: number, totalBars: number) => {
    const threshold = (audioLevel / 100) * totalBars;
    if (barIndex < threshold) {
      if (barIndex > totalBars * 0.8) return "bg-red-500";
      if (barIndex > totalBars * 0.6) return "bg-yellow-500";
      return "bg-green-500";
    }
    return "bg-gray-300";
  };

  if (!isActive) return null;

  const bars = 10;

  return (
    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs rounded-lg p-3">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
        <div className="relative flex items-end gap-1 h-6">
          {Array.from({ length: bars }, (_, i) => (
            <div
              key={i}
              className={`w-1 transition-all duration-100 ${getBarColor(i, bars)}`}
              style={{ height: `${(i + 1) * (100 / bars)}%` }}
            />
          ))}
          {/* Peak indicator */}
          {peakLevel > 5 && (
            <div
              className="absolute w-full h-0.5 bg-white transition-all duration-75"
              style={{ 
                bottom: `${(peakLevel / 100) * 100}%`,
                opacity: Math.max(0.3, (peakLevel / 100))
              }}
            />
          )}
        </div>
        <div className="text-xs text-gray-300 ml-1 font-mono w-8">
          {Math.round(peakLevel)}
        </div>
      </div>
      {/* Reserve space for the low audio warning to prevent jumping */}
      <div className="h-5 mt-1">
        {audioLevel < 10 && (
          <div className="text-xs text-yellow-300 animate-pulse">Low audio</div>
        )}
      </div>
    </div>
  );
}
