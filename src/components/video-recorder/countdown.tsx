"use client";

import { useEffect, useState, useCallback } from "react";

interface CountdownProps {
  onComplete: () => void;
  duration?: number;
  enableSound?: boolean;
}

export function Countdown({ onComplete, duration = 3, enableSound = true }: CountdownProps) {
  const [count, setCount] = useState(duration);

  // Function to play countdown sound
  const playCountdownSound = useCallback((isGo: boolean = false) => {
    if (!enableSound) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sounds
      oscillator.frequency.setValueAtTime(isGo ? 800 : 600, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Sound envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (isGo ? 0.5 : 0.2));
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + (isGo ? 0.5 : 0.2));
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  }, [enableSound]);

  useEffect(() => {
    // Play sound for current count
    if (count > 0) {
      playCountdownSound(false);
    } else if (count === 0) {
      playCountdownSound(true); // Special "GO!" sound
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete, playCountdownSound]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 pointer-events-none">
      <div className="bg-black/40 backdrop-blur-md rounded-full w-32 h-32 flex items-center justify-center animate-countdown-pulse">
        <div className="text-white font-bold">
          {count === 0 ? (
            <div className="text-4xl">GO!</div>
          ) : (
            <div className="text-6xl">{count}</div>
          )}
        </div>
      </div>
    </div>
  );
}