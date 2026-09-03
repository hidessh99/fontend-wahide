"use client";

import { useState, useEffect } from "react";

export interface OnlineStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

/**
 * Enterprise hook to detect browser network connectivity in real time.
 * Zero CPU overhead when online (pure event listener based).
 */
export function useOnlineStatus(): OnlineStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== "undefined") {
      return navigator.onLine;
    }
    return true;
  });

  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let recoveryTimer: NodeJS.Timeout | null = null;

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);

      // Keep the "Internet Restored" confirmation banner visible for 3.5s then dismiss
      if (recoveryTimer) clearTimeout(recoveryTimer);
      recoveryTimer = setTimeout(() => {
        setWasOffline(false);
      }, 3500);
    };

    const handleOffline = () => {
      if (recoveryTimer) clearTimeout(recoveryTimer);
      setIsOnline(false);
      setWasOffline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (recoveryTimer) clearTimeout(recoveryTimer);
    };
  }, []);

  return { isOnline, wasOffline };
}
