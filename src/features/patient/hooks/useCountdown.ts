import { useEffect, useState } from 'react';

export type CountdownParts = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
};

function computeCountdown(targetMs: number, nowMs: number): CountdownParts {
  const totalMs = targetMs - nowMs;
  if (totalMs <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { totalMs, days, hours, minutes, seconds, isPast: false };
}

/** Live countdown to an ISO datetime; ticks once per second. */
export function useCountdown(targetIso: string): CountdownParts {
  const targetMs = new Date(targetIso).getTime();
  const [parts, setParts] = useState(() => computeCountdown(targetMs, Date.now()));

  useEffect(() => {
    setParts(computeCountdown(targetMs, Date.now()));
    const id = setInterval(() => {
      setParts(computeCountdown(targetMs, Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return parts;
}
