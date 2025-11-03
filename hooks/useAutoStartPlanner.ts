'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface UseAutoStartPlannerProps {
  area?: string;
  date?: string;
  debounceMs?: number;
}

export function useAutoStartPlanner({ 
  area, 
  date, 
  debounceMs = 250 
}: UseAutoStartPlannerProps) {
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasNavigatedRef = useRef(false);

  const trigger = useCallback(() => {
    // Clear any existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Only proceed if both area and date are set
    if (!area || !date) {
      hasNavigatedRef.current = false;
      return;
    }

    // Debounce navigation to prevent rapid triggers
    debounceRef.current = setTimeout(() => {
      if (!hasNavigatedRef.current) {
        const qs = `from=${encodeURIComponent(area)}&date=${date}`;
        router.replace(`/planner/build?${qs}`);
        hasNavigatedRef.current = true;
      }
    }, debounceMs);
  }, [area, date, debounceMs, router]);

  useEffect(() => {
    trigger();
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [trigger]);

  return {
    canStart: !!(area && date),
    isReady: !!(area && date)
  };
}
