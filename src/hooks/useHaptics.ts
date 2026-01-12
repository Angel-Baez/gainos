"use client";

import { useCallback } from "react";

export function useHaptics() {
  const vibrate = useCallback((pattern: number | number[] = 50) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Vibración no soportada
      }
    }
  }, []);

  const lightTap = useCallback(() => vibrate(10), [vibrate]);
  const mediumTap = useCallback(() => vibrate(25), [vibrate]);
  const heavyTap = useCallback(() => vibrate(50), [vibrate]);
  const success = useCallback(() => vibrate([50, 30, 50]), [vibrate]);
  const error = useCallback(() => vibrate([100, 50, 100]), [vibrate]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    success,
    error,
  };
}
