"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UseClipboardOptions {
  timeout?: number;
}

export function useClipboard<T = boolean>(options: UseClipboardOptions = {}) {
  const { timeout = 2000 } = options;
  const [copiedValue, setCopiedValue] = useState<T | boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const copy = useCallback(
    async (text: string, valueToSet: T | boolean = true): Promise<boolean> => {
      if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        clearTimer();
        setCopiedValue(valueToSet);

        timerRef.current = setTimeout(() => {
          setCopiedValue(false);
          timerRef.current = null;
        }, timeout);

        return true;
      } catch {
        return false;
      }
    },
    [clearTimer, timeout]
  );

  const reset = useCallback(() => {
    clearTimer();
    setCopiedValue(false);
  }, [clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    copied: copiedValue,
    copy,
    reset,
    isCopied: Boolean(copiedValue),
  };
}
