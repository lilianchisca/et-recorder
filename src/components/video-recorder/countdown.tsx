"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  onComplete: () => void;
  duration?: number;
}

export function Countdown({ onComplete, duration = 3 }: CountdownProps) {
  const [count, setCount] = useState(duration);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

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