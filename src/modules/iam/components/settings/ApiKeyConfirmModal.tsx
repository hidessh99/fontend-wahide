"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ShieldAlert,
  Loader2,
  Zap,
} from "lucide-react";

interface ApiKeyConfirmModalProps {
  isOpen: boolean;
  mode: "REGENERATE" | "REVOKE";
  currentKey?: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ApiKeyConfirmModal({
  isOpen,
  mode,
  currentKey,
  isLoading,
  onClose,
  onConfirm,
}: ApiKeyConfirmModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isRegenerate = mode === "REGENERATE";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
        {/* Header Icon & Close Button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div
              className={`size-11 rounded-full flex items-center justify-center shrink-0 border ${
                isRegenerate
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25"
              }`}
            >
              {isRegenerate ? (
                <AlertTriangle className="size-5.5" />
              ) : (
                <ShieldAlert className="size-5.5" />
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {isRegenerate
                  ? "Buat Ulang API Key Fast-Path?"
                  : "Cabut Akses API Key?"}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {isRegenerate
                  ? "Tindakan kritis rotasi kunci autentikasi sistem."
                  : "Tindakan permanen penonaktifan akses otentikasi."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-50"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Warning Callout Box */}
        <div
          className={`p-4 rounded-lg border space-y-2.5 ${
            isRegenerate
              ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20"
              : "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <span
              className={
                isRegenerate
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-rose-700 dark:text-rose-400"
              }
            >
              ⚠️ Perhatian Dampak Operasional:
            </span>
          </div>

          <p className="text-xs font-medium text-foreground-secondary leading-relaxed">
            {isRegenerate ? (
              <>
                Kunci API saat ini akan{" "}
                <strong className="text-foreground font-bold">
                  langsung dinonaktifkan secara permanen
                </strong>
                . Semua integrasi bot WhatsApp, backend microservice eksternal,
                atau script otomatisasi yang menggunakan kunci lama akan{" "}
                <strong className="text-foreground font-bold">
                  terputus seketika (HTTP 401 Unauthorized)
                </strong>{" "}
                hingga Anda memperbaruinya dengan kunci baru.
              </>
            ) : (
              <>
                API Key aktif Anda akan{" "}
                <strong className="text-foreground font-bold">
                  dihapus dan dicabut dari server
                </strong>
                . Seluruh aplikasi eksternal tidak akan lagi dapat mengirim
                pesan atau memanggil endpoint Wahide Fast-Path.
              </>
            )}
          </p>

          {currentKey && (
            <div className="pt-1.5">
              <span className="text-[11px] font-bold text-foreground-muted block mb-1">
                Kunci yang akan digantikan/dicabut:
              </span>
              <div className="p-2 rounded bg-muted/70 dark:bg-black/40 border border-border/80 text-[11px] font-mono font-semibold text-foreground break-all">
                {currentKey.slice(0, 12)}••••••••••••••••••••
              </div>
            </div>
          )}
        </div>

        {/* Informational Guidance */}
        <div className="flex items-start gap-2 text-[11px] font-medium text-foreground-muted">
          <Zap className="size-3.5 text-emerald-600 dark:text-wise-green shrink-0 mt-0.5" />
          <span>
            {isRegenerate
              ? "Kunci baru yang diterbitkan akan langsung aktif dalam hitungan milidetik di cluster gateway."
              : "Anda dapat menerbitkan API Key baru kapan saja melalui halaman pengaturan ini."}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full text-xs font-bold px-5 h-9 border-border hover:border-foreground-muted"
          >
            Batal
          </Button>

          {isRegenerate ? (
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={onConfirm}
              disabled={isLoading}
              className="gap-2 text-xs font-bold px-5 h-9 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Menerbitkan...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="size-3.5" />
                  <span>Ya, Terbitkan Kunci Baru</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={onConfirm}
              disabled={isLoading}
              className="rounded-full gap-2 text-xs font-bold px-5 h-9 bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Mencabut...</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
                  <span>Ya, Cabut Kunci</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
