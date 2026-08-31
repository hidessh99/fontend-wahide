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
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [status, setStatus] = useState<DeviceStatus | "LOADING" | "ERROR" | "AUTHENTICATED">("LOADING");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(20);
  const [retryCount, setRetryCount] = useState<number>(0);

  const eventSourceRef = useRef<EventSource | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RETRY_ATTEMPTS = 5;

  useEffect(() => {
    if (!isOpen || !deviceId) {
      return;
    }

    let isMounted = true;
    let es: EventSource | null = null;
    let timer: NodeJS.Timeout | null = null;

    const connect = (attempt: number = 0) => {
      if (!isMounted) return;

      const streamUrl = whatsappApi.getQRStreamUrl(deviceId);

      timer = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 20));
      }, 1000);
      timerRef.current = timer;

      try {
        es = new EventSource(streamUrl);
        eventSourceRef.current = es;

        es.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data: QREventData = JSON.parse(event.data);

            if (data.status === "AUTHENTICATED" || data.status === "CONNECTED") {
              setStatus("AUTHENTICATED");
              onSuccess?.(data);
              return;
            }

            if (data.qrCode) {
              setQrCode(data.qrCode);
              setStatus("PAIRING");
              setCountdown(data.expiresIn || 20);
            }

            if (data.pairingCode) {
              setPairingCode(data.pairingCode);
            }
          } catch {
            if (event.data.length > 50) {
              setQrCode(event.data);
              setStatus("PAIRING");
            }
          }
        };

        es.addEventListener("qr", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            setQrCode(data.qrCode || data);
            setStatus("PAIRING");
            setCountdown(data.expiresIn || 20);
          } catch {
            setQrCode(event.data);
            setStatus("PAIRING");
          }
        });

        es.addEventListener("authenticated", (event: MessageEvent) => {
          if (!isMounted) return;
          setStatus("AUTHENTICATED");
          try {
            const data = JSON.parse(event.data);
            onSuccess?.(data);
          } catch {
            onSuccess?.();
          }
        });

        es.addEventListener("error", (event: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            setErrorMessage(data.message || "Koneksi stream terputus");
          } catch {
            setErrorMessage("Gagal menyambungkan ke stream pairing WhatsApp");
          }
          setStatus("ERROR");
          onError?.("Gagal menyambungkan ke stream pairing");
        });

        es.onerror = () => {
          if (!isMounted) return;
          if (es) {
            es.close();
            eventSourceRef.current = null;
          }

          // Exponential Backoff with Jitter Reconnect Strategy
          if (attempt < MAX_RETRY_ATTEMPTS) {
            const backoffMs = Math.min(
              1000 * Math.pow(1.5, attempt) + Math.random() * 500,
              8000
            );
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMounted) {
                setRetryCount(attempt + 1);
                connect(attempt + 1);
              }
            }, backoffMs);
          } else {
            setStatus("ERROR");
            setErrorMessage("Koneksi ke gateway terputus setelah beberapa percobaan. Silakan coba lagi.");
          }
        };
      } catch (err: unknown) {
        queueMicrotask(() => {
          if (!isMounted) return;
          const msg = err instanceof Error ? err.message : "Gagal memulai pairing";
          setStatus("ERROR");
          setErrorMessage(msg);
          onError?.(msg);
        });
      }
    };

    connect(0);

    // Teardown Cleanup (Zero Memory Leak)
    return () => {
      isMounted = false;
      if (timer) {
        clearInterval(timer);
        timerRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (es) {
        es.close();
        eventSourceRef.current = null;
      }
    };
  }, [deviceId, isOpen, onSuccess, onError]);

  const retry = useCallback(() => {
    setStatus("LOADING");
    setErrorMessage(null);
    setCountdown(20);
    setRetryCount(0);
  }, []);

  return {
    qrCode,
    pairingCode,
    status,
    errorMessage,
    countdown,
    retryCount,
    retry,
  };
}
