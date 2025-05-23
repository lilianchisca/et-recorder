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
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg z-10 pointer-events-none">
      <div className="text-white font-bold animate-countdown-pulse">
        {count === 0 ? (
          <div className="text-6xl">GO!</div>
        ) : (
          <div className="text-8xl">{count}</div>
        )}
      </div>
    </div>
  );
}