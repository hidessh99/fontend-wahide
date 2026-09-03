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
import { AlertTriangle, Trash2, ShieldAlert, Loader2, Smartphone } from "lucide-react";

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
  const isLogoutAll = mode === "LOGOUT_ALL";

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-border bg-surface max-w-lg gap-0 space-y-6 overflow-hidden p-6 sm:p-8 dark:bg-[#161715]">
        {/* Header Icon & Title */}
        <AlertDialogHeader className="flex flex-row items-center gap-3.5 text-left">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${
              isLogoutAll
                ? "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                : "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            }`}
          >
            {isLogoutAll ? (
              <ShieldAlert className="size-5.5" />
            ) : (
              <AlertTriangle className="size-5.5" />
            )}
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {isLogoutAll ? "Keluar dari Semua Perangkat?" : "Cabut Sesi Perangkat?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              {isLogoutAll
                ? "Tindakan keamanan pencabutan akses massal sesi akun."
                : "Konfirmasi pencabutan akses login perangkat tertentu."}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Warning Callout Box */}
        <div
          className={`space-y-2.5 rounded-lg border p-4 ${
            isLogoutAll
              ? "border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10"
              : "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10"
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

          <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
            {isLogoutAll ? (
              <>
                Seluruh sesi login yang sedang aktif di browser atau perangkat lain akan{" "}
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
                ({targetSession?.ip || "IP Unknown"}) akan langsung dicabut dan pengguna pada
                perangkat tersebut wajib login ulang.
              </>
            )}
          </p>
        </div>

        {/* Target Details preview */}
        {!isLogoutAll && targetSession && (
          <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-3">
            <div className="bg-muted text-foreground-secondary flex size-8 items-center justify-center rounded-full">
              <Smartphone className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-foreground truncate text-xs font-bold">
                {targetSession.device}
              </div>
              <div className="text-foreground-muted truncate font-mono text-[11px]">
                IP: {targetSession.ip}
              </div>
            </div>
          </div>
        )}

        {/* Actions Button */}
        <AlertDialogFooter className="border-border m-0 flex flex-col-reverse gap-3 rounded-none border-t bg-transparent p-0 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <AlertDialogCancel
            disabled={isLoading}
            className="text-foreground border-border hover:bg-muted rounded-full text-xs font-bold"
          >
            Batalkan
          </AlertDialogCancel>

          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={`gap-2 rounded-full px-5 text-xs font-extrabold text-white shadow-md ${
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
                  {isLogoutAll ? "Ya, Keluar Semua Perangkat" : "Ya, Cabut Sesi Perangkat"}
                </span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
