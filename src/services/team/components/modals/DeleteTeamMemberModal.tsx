"use client";

import React, { useEffect } from "react";
import { Agent } from "@/services/team/types/team.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

interface DeleteTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  targetMember: Agent | null;
  isDeleting: boolean;
}

export function DeleteTeamMemberModal({
  isOpen,
  onClose,
  onConfirm,
  targetMember,
  isDeleting,
}: DeleteTeamMemberModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !targetMember) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-surface dark:bg-[#161715] border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col scale-in-95 duration-150">
        {/* Header with Warning Accent */}
        <div className="flex items-start justify-between p-5 border-b border-border/80 bg-rose-500/5">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground tracking-tight">
                Hapus Anggota Tim
              </h3>
              <p className="text-xs font-semibold text-foreground-secondary mt-0.5">
                Konfirmasi penghapusan akses staf agen.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-50"
            aria-label="Tutup Dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body with Member Context */}
        <div className="p-5 space-y-4 text-xs font-semibold text-foreground-secondary">
          <p className="leading-relaxed">
            Apakah Anda yakin ingin menghapus akses anggota tim ini secara permanen dari akun Anda?
          </p>

          <div className="p-3.5 rounded-lg border border-border bg-muted/40 space-y-1">
            <div className="font-bold text-sm text-foreground">
              {targetMember.name}
            </div>
            <div className="text-xs text-foreground-secondary">
              {targetMember.email}
            </div>
            <div className="text-xs font-mono text-foreground-muted">
              +{targetMember.phone} • {targetMember.role}
            </div>
          </div>

          <p className="text-[11px] text-rose-500 font-medium">
            ⚠️ Tindakan ini tidak dapat dibatalkan. Staf tidak akan lagi dapat mengelola chat pelanggan atau membalas pesan.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-border bg-muted/30">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="h-9 px-4 rounded-full text-xs font-bold border-border hover:border-foreground-muted cursor-pointer"
          >
            {t("common.cancel") || "Batal"}
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-9 px-4.5 rounded-full text-xs font-bold gap-1.5 shadow-sm cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Ya, Hapus Anggota</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
