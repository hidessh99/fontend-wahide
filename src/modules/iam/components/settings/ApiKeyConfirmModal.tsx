"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, RefreshCw, Trash2, ShieldAlert, Loader2, Zap } from "lucide-react";

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
  const isRegenerate = mode === "REGENERATE";

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg dark:bg-[#161715]">
        {/* Header Icon & Title */}
        <AlertDialogHeader className="border-border flex shrink-0 flex-row items-center gap-3.5 border-b p-5 text-left sm:p-6">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${
              isRegenerate
                ? "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                : "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400"
            }`}
          >
            {isRegenerate ? (
              <AlertTriangle className="size-5.5" />
            ) : (
              <ShieldAlert className="size-5.5" />
            )}
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {isRegenerate ? "Buat Ulang API Key Fast-Path?" : "Cabut Akses API Key?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              {isRegenerate
                ? "Tindakan kritis rotasi kunci autentikasi sistem."
                : "Tindakan permanen penonaktifan akses otentikasi."}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Scrollable Body Content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Warning Callout Box */}
          <div
            className={`space-y-2.5 rounded-lg border p-4 ${
              isRegenerate
                ? "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10"
                : "border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10"
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

            <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
              {isRegenerate ? (
                <>
                  Kunci API saat ini akan{" "}
                  <strong className="text-foreground font-bold">
                    langsung dinonaktifkan secara permanen
                  </strong>
                  . Semua integrasi bot WhatsApp, backend microservice eksternal, atau script
                  otomatisasi yang menggunakan kunci lama akan{" "}
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
                  . Seluruh aplikasi eksternal tidak akan lagi dapat mengirim pesan atau memanggil
                  endpoint Wahide Fast-Path.
                </>
              )}
            </p>

            {currentKey && (
              <div className="pt-1.5">
                <span className="text-foreground-muted mb-1 block text-[11px] font-bold">
                  Kunci yang akan digantikan/dicabut:
                </span>
                <div className="bg-muted/70 border-border/80 text-foreground rounded border p-2 font-mono text-[11px] font-semibold break-all dark:bg-black/40">
                  {currentKey.slice(0, 12)}••••••••••••••••••••
                </div>
              </div>
            )}
          </div>

          {/* Informational Guidance */}
          <div className="text-foreground-muted flex items-start gap-2 text-[11px] font-medium">
            <Zap className="dark:text-wise-green mt-0.5 size-3.5 shrink-0 text-emerald-600" />
            <span>
              {isRegenerate
                ? "Kunci baru yang diterbitkan akan langsung aktif dalam hitungan milidetik di cluster gateway."
                : "Anda dapat menerbitkan API Key baru kapan saja melalui halaman pengaturan ini."}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <AlertDialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-3 rounded-none border-t p-4 sm:p-5">
          <AlertDialogCancel
            disabled={isLoading}
            className="border-border hover:border-foreground-muted h-9 rounded-full px-5 text-xs font-bold"
          >
            Batal
          </AlertDialogCancel>

          {isRegenerate ? (
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={onConfirm}
              disabled={isLoading}
              className="h-9 gap-2 px-5 text-xs font-bold shadow-sm"
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
              className="h-9 gap-2 rounded-full bg-rose-600 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
