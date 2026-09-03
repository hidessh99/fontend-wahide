"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { whatsappApi } from "../api/whatsapp.api";
import { QREventData, DeviceStatus } from "../types/whatsapp.types";

interface UseQRPairingProps {
  deviceId: string | null;
  isOpen: boolean;
  onSuccess?: (deviceData?: Partial<QREventData>) => void;
  onError?: (error: string) => void;
}

/**
 * Enterprise-grade QR & Phone Pairing hook for WhatsApp Engine.
 * Features 3-Layer Anti-Leak Architecture:
 * - Layer 1: Recursive setTimeout polling (Zero request stampede / overlapping)
 * - Layer 2: AbortController & explicit cleanup on modal close / unmount (Zero memory leak)
 * - Layer 3: Circuit Breaker with 2-minute auto-stop & Tab Visibility optimization
 */
export function useQRPairing({
  deviceId,
  isOpen,
  onSuccess,
  onError,
}: UseQRPairingProps) {
  const [pairMode, setPairMode] = useState<"QR" | "PHONE">("QR");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [status, setStatus] = useState<DeviceStatus | "LOADING" | "ERROR" | "AUTHENTICATED">("LOADING");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(20);
  const [isLoadingCode, setIsLoadingCode] = useState<boolean>(false);

  // Stable callback refs - prevents effect re-triggers when parent re-renders
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  const isMountedRef = useRef<boolean>(true);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollAbortRef = useRef<AbortController | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pollStartTimeRef = useRef<number>(0);

  const clearPollingResources = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (pollAbortRef.current) {
      pollAbortRef.current.abort();
      pollAbortRef.current = null;
    }
  }, []);

  const clearCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  // 1. Initial QR Request when Modal Opens in QR mode
  useEffect(() => {
    let isCancelled = false;
    isMountedRef.current = true;

    const init = async () => {
      if (!isOpen || !deviceId || pairMode !== "QR") {
        return;
      }

      try {
        const res = await whatsappApi.pairDevice(deviceId);
        if (isCancelled || !isMountedRef.current) return;

        if (res && res.qr_code) {
          let formattedQR = res.qr_code;
          if (!formattedQR.startsWith("data:image/") && !formattedQR.startsWith("http")) {
            formattedQR = `data:image/png;base64,${formattedQR}`;
          }
          setQrCode(formattedQR);
          setStatus("PAIRING");
          setCountdown(20);
        } else {
          setStatus("PAIRING");
        }
      } catch (err: unknown) {
        if (isCancelled || !isMountedRef.current) return;
        const msg = err instanceof Error ? err.message : "Gagal meminta QR Code pairing";
        setStatus("ERROR");
        setErrorMessage(msg);
        onErrorRef.current?.(msg);
      }
    };

    if (isOpen && deviceId && pairMode === "QR") {
      init();
    }

    return () => {
      isCancelled = true;
      clearPollingResources();
      clearCountdown();
    };
  }, [isOpen, deviceId, pairMode, clearPollingResources, clearCountdown]);

  // 2. Countdown Timer (20s for QR code refresh cycle)
  useEffect(() => {
    if (!isOpen || status !== "PAIRING" || pairMode !== "QR") {
      clearCountdown();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    countdownTimerRef.current = timer;

    return () => {
      clearInterval(timer);
    };
  }, [isOpen, status, pairMode, clearCountdown]);

  // 3. 3-Layer Anti-Leak Polling (Recursive setTimeout + AbortController + Tab Visibility + Circuit Breaker)
  useEffect(() => {
    if (!isOpen || !deviceId || status === "AUTHENTICATED") {
      clearPollingResources();
      return;
    }

    let isCancelled = false;
    pollStartTimeRef.current = Date.now();

    const scheduleNext = () => {
      if (isCancelled || !isMountedRef.current) return;

      // Layer 3: Circuit Breaker - Stop polling automatically after 2 minutes (120,000 ms)
      const elapsed = Date.now() - pollStartTimeRef.current;
      if (elapsed > 120000) {
        setStatus("ERROR");
        setErrorMessage("Sesi pairing kedaluwarsa. Silakan muat ulang QR code.");
        return;
      }

      // Schedule next poll only after previous request finished
      pollTimerRef.current = setTimeout(runPoll, 3000);
    };

    const runPoll = async () => {
      if (isCancelled || !isMountedRef.current) return;

      // Tab Visibility check: pause polling when browser tab is inactive/minimized
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }

      // Layer 2: Per-request AbortController
      const controller = new AbortController();
      pollAbortRef.current = controller;

      try {
        const devices = await whatsappApi.getDevices(controller.signal);
        if (isCancelled || !isMountedRef.current) return;

        const currentDev = devices.find((d) => d.id === deviceId);
        if (currentDev && (currentDev.status === "CONNECTED" || (currentDev.status as string) === "ONLINE")) {
          setStatus("AUTHENTICATED");
          clearPollingResources();
          clearCountdown();
          onSuccessRef.current?.({ status: "AUTHENTICATED" });
          return; // Stop polling loop on success
        }
      } catch {
        // Silently catch network drops during polling
      } finally {
        if (!isCancelled && isMountedRef.current) {
          scheduleNext();
        }
      }
    };

    // Tab Visibility listener: immediately resume poll when tab gains focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isCancelled && isMountedRef.current) {
        runPoll();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    // Start initial poll cycle
    scheduleNext();

    return () => {
      isCancelled = true;
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      clearPollingResources();
    };
  }, [isOpen, deviceId, status, clearPollingResources, clearCountdown]);

  // 4. Manual QR Retry
  const retry = useCallback(async () => {
    if (!deviceId) return;
    setStatus("LOADING");
    setErrorMessage(null);
    setCountdown(20);

    try {
      const res = await whatsappApi.pairDevice(deviceId);
      if (!isMountedRef.current) return;

      if (res && res.qr_code) {
        let formattedQR = res.qr_code;
        if (!formattedQR.startsWith("data:image/") && !formattedQR.startsWith("http")) {
          formattedQR = `data:image/png;base64,${formattedQR}`;
        }
        setQrCode(formattedQR);
        setStatus("PAIRING");
      }
    } catch (err: unknown) {
      if (!isMountedRef.current) return;
      const msg = err instanceof Error ? err.message : "Gagal meminta QR Code pairing";
      setStatus("ERROR");
      setErrorMessage(msg);
      onErrorRef.current?.(msg);
    }
  }, [deviceId]);

  // 5. Request 8-Character Phone Pairing Code
  const requestPairingCode = useCallback(async (phone: string) => {
    if (!deviceId) return null;
    setIsLoadingCode(true);
    setErrorMessage(null);

    try {
      const res = await whatsappApi.pairPhone(deviceId, phone);
      if (!isMountedRef.current) return null;

      setPairingCode(res.pairing_code);
      setStatus("PAIRING");
      setIsLoadingCode(false);
      return res.pairing_code;
    } catch (err: unknown) {
      if (!isMountedRef.current) return null;
      const msg = err instanceof Error ? err.message : "Gagal meminta kode pairing nomor";
      setErrorMessage(msg);
      setIsLoadingCode(false);
      onErrorRef.current?.(msg);
      return null;
    }
  }, [deviceId]);

  return {
    pairMode,
    setPairMode,
    qrCode,
    pairingCode,
    status,
    errorMessage,
    countdown,
    isLoadingCode,
    requestPairingCode,
    retry,
  };
}
