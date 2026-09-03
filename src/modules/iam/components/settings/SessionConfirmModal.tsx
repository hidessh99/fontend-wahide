"use client";


import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import {
  X,
  AlertTriangle,
  Trash2,
  ShieldAlert,
  Loader2,
  Smartphone,
} from "lucide-react";

interface SessionConfirmModalProps {
  isOpen: boolean;
  mode: "LOGOUT_ALL" | "REVOKE_SINGLE";
  targetSession?: {
    tokenId: string;
    device: string;
    ip: string;
  } | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function SessionConfirmModal({
  isOpen,
  mode,
  targetSession,
  isLoading,
  onClose,
  onConfirm,
}: SessionConfirmModalProps) {
  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen && !isLoading, onClose);

  if (!isOpen) return null;

  const isLogoutAll = mode === "LOGOUT_ALL";

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
                isLogoutAll
                  ? "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25"
              }`}
            >
              {isLogoutAll ? (
                <ShieldAlert className="size-5.5" />
              ) : (
                <AlertTriangle className="size-5.5" />
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {isLogoutAll
                  ? "Keluar dari Semua Perangkat?"
                  : "Cabut Sesi Perangkat?"}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {isLogoutAll
                  ? "Tindakan keamanan pencabutan akses massal sesi akun."
                  : "Konfirmasi pencabutan akses login perangkat tertentu."}
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
            isLogoutAll
              ? "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20"
              : "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <span
              className={
                isLogoutAll
                  ? "text-rose-700 dark:text-rose-400"
                  : "text-amber-700 dark:text-amber-400"
              }
            >
              ⚠️ Perhatian Keamanan Sesi:
            </span>
          </div>

          <p className="text-xs font-medium text-foreground-secondary leading-relaxed">
            {isLogoutAll ? (
              <>
                Seluruh sesi login yang sedang aktif di browser atau perangkat lain
                akan{" "}
                <strong className="text-foreground font-bold">
                  dikeluarkan seketika secara permanen
                </strong>
                . Sesi pada perangkat ini akan tetap aktif.
              </>
            ) : (
              <>
                Sesi perangkat{" "}
                <strong className="text-foreground font-bold">
                  {targetSession?.device || "terpilih"}
                </strong>{" "}
                ({targetSession?.ip || "IP Unknown"}) akan langsung dicabut dan
                pengguna pada perangkat tersebut wajib login ulang.
              </>
            )}
          </p>
        </div>

        {/* Target Details preview */}
        {!isLogoutAll && targetSession && (
          <div className="p-3 rounded-lg border border-border bg-muted/30 flex items-center gap-3">
            <div className="size-8 rounded-full bg-muted flex items-center justify-center text-foreground-secondary">
              <Smartphone className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-foreground truncate">
                {targetSession.device}
              </div>
              <div className="text-[11px] text-foreground-muted font-mono truncate">
                IP: {targetSession.ip}
              </div>
            </div>
          </div>
        )}

        {/* Actions Button */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full text-xs font-bold text-foreground border-border hover:bg-muted"
          >
            Batalkan
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-full text-xs font-extrabold gap-2 px-5 text-white shadow-md ${
              isLogoutAll
                ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800"
                : "bg-amber-600 hover:bg-amber-700 active:bg-amber-800"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                <span>
                  {isLogoutAll
                    ? "Ya, Keluar Semua Perangkat"
                    : "Ya, Cabut Sesi Perangkat"}
                </span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
