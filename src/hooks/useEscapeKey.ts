"use client";

import { useEffect, useRef } from "react";

/**
 * Universal hook to handle the Escape key for modal dialogs.
 * Uses a stable callback ref pattern to prevent re-attaching event listeners
 * whenever the parent component re-renders or updates the onEscape reference.
 *
 * @param isOpen - Boolean indicating if the modal is currently open
 * @param onEscape - Callback function to invoke when the Escape key is pressed
 */
export function useEscapeKey(isOpen: boolean, onEscape: () => void) {
  const onEscapeRef = useRef(onEscape);

  useEffect(() => {
    onEscapeRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscapeRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
}
