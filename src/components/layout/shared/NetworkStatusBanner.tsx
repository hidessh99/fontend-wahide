"use client";

import React from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

/**
 * Enterprise floating Network Status Banner.
 * Renders null when network is healthy (0 CPU & 0 DOM overhead).
 * Smoothly informs users when connection drops or recovers.
 */
export function NetworkStatusBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();

  // Healthy network: 0 DOM nodes rendered
  if (isOnline && !wasOffline) {
    return null;
  }

  // 1. Connection Restored Banner (temporarily displays for 3.5s)
  if (isOnline && wasOffline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed top-0 inset-x-0 z-100 flex items-center justify-center gap-2.5 px-4 py-2 bg-emerald-600 dark:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-lg border-b border-emerald-500/40 animate-in slide-in-from-top duration-200"
      >
        <Wifi className="size-4 shrink-0 animate-bounce" />
        <span>Koneksi internet pulih. Sistem kembali online.</span>
      </div>
    );
  }

  // 2. Connection Lost Banner
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-0 inset-x-0 z-100 flex items-center justify-center gap-2.5 px-4 py-2.5 bg-amber-600 dark:bg-rose-900 text-white text-xs sm:text-sm font-bold shadow-xl border-b border-amber-500/40 animate-in slide-in-from-top duration-200"
    >
      <WifiOff className="size-4 shrink-0 animate-pulse" />
      <span>
        Koneksi internet terputus. Harap periksa jaringan Wi-Fi atau paket data Anda.
      </span>
      <span className="hidden sm:inline-flex items-center gap-1 opacity-80 text-xs font-normal">
        <RefreshCw className="size-3 animate-spin" /> Menghubungkan otomatis...
      </span>
    </div>
  );
}
