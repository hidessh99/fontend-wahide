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

export function useQRPairing({
  deviceId,
  isOpen,
  onSuccess,
  onError,
}: UseQRPairingProps) {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<DeviceStatus | "LOADING" | "ERROR" | "AUTHENTICATED">("LOADING");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(20);

  const isMountedRef = useRef<boolean>(true);
  const statusPollRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (statusPollRef.current) {
      clearInterval(statusPollRef.current);
      statusPollRef.current = null;
    }
  }, []);

  const stopCountdown = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, []);

  // 1. Initial QR Request when Modal Opens
  useEffect(() => {
    let isMounted = true;
    isMountedRef.current = true;

    const init = async () => {
      if (!isOpen || !deviceId) {
        return;
      }

      try {
        const res = await whatsappApi.pairDevice(deviceId);
        if (!isMounted) return;

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
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : "Gagal meminta QR Code pairing";
        setStatus("ERROR");
        setErrorMessage(msg);
        onError?.(msg);
      }
    };

    if (isOpen && deviceId) {
      init();
    }

    return () => {
      isMounted = false;
      isMountedRef.current = false;
      stopPolling();
      stopCountdown();
    };
  }, [isOpen, deviceId, onError, stopPolling, stopCountdown]);

  // 2. Countdown Timer (20s)
  useEffect(() => {
    if (!isOpen || status !== "PAIRING") {
      stopCountdown();
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
  }, [isOpen, status, stopCountdown]);

  // 3. Lightweight Status Polling Watcher (every 3s to auto-detect successful scan)
  useEffect(() => {
    if (!isOpen || !deviceId || status === "AUTHENTICATED") {
      stopPolling();
      return;
    }

    const interval = setInterval(async () => {
      try {
        const devices = await whatsappApi.getDevices();
        if (!isMountedRef.current) return;

        const currentDev = devices.find((d) => d.id === deviceId);
        if (currentDev && (currentDev.status === "CONNECTED" || (currentDev.status as string) === "ONLINE")) {
          setStatus("AUTHENTICATED");
          stopPolling();
          stopCountdown();
          onSuccess?.({ status: "AUTHENTICATED" });
        }
      } catch {
        // Silently continue polling
      }
    }, 3000);

    statusPollRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, deviceId, status, onSuccess, stopPolling, stopCountdown]);

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
      onError?.(msg);
    }
  }, [deviceId, onError]);

  return {
    qrCode,
    pairingCode: null,
    status,
    errorMessage,
    countdown,
    retryCount: 0,
    retry,
  };
}
