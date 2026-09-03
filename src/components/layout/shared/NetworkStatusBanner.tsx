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
        className="animate-in slide-in-from-top fixed inset-x-0 top-0 z-100 flex items-center justify-center gap-2.5 border-b border-emerald-500/40 bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg duration-200 sm:text-sm dark:bg-emerald-800"
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
      className="animate-in slide-in-from-top fixed inset-x-0 top-0 z-100 flex items-center justify-center gap-2.5 border-b border-amber-500/40 bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl duration-200 sm:text-sm dark:bg-rose-900"
    >
      <WifiOff className="size-4 shrink-0 animate-pulse" />
      <span>Koneksi internet terputus. Harap periksa jaringan Wi-Fi atau paket data Anda.</span>
      <span className="hidden items-center gap-1 text-xs font-normal opacity-80 sm:inline-flex">
        <RefreshCw className="size-3 animate-spin" /> Menghubungkan otomatis...
      </span>
    </div>
  );
}
