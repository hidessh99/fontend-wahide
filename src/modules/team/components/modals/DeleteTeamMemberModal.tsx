"use client";

import { Agent } from "@/modules/team/types/team.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
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

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen && !isDeleting, onClose);

  if (!isOpen || !targetMember) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="bg-surface border-border scale-in-95 relative flex w-full max-w-md flex-col overflow-hidden rounded-xl border shadow-2xl duration-150 dark:bg-[#161715]">
        {/* Header with Warning Accent */}
        <div className="border-border/80 flex items-start justify-between border-b bg-rose-500/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 className="text-foreground text-base font-extrabold tracking-tight">
                Hapus Anggota Tim
              </h3>
              <p className="text-foreground-secondary mt-0.5 text-xs font-semibold">
                Konfirmasi penghapusan akses staf agen.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition disabled:opacity-50"
            aria-label="Tutup Dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body with Member Context */}
        <div className="text-foreground-secondary space-y-4 p-5 text-xs font-semibold">
          <p className="leading-relaxed">
            Apakah Anda yakin ingin menghapus akses anggota tim ini secara permanen dari akun Anda?
          </p>

          <div className="border-border bg-muted/40 space-y-1 rounded-lg border p-3.5">
            <div className="text-foreground text-sm font-bold">{targetMember.name}</div>
            <div className="text-foreground-secondary text-xs">{targetMember.email}</div>
            <div className="text-foreground-muted font-mono text-xs">
              +{targetMember.phone} • {targetMember.role}
            </div>
          </div>

          <p className="text-[11px] font-medium text-rose-500">
            ⚠️ Tindakan ini tidak dapat dibatalkan. Staf tidak akan lagi dapat mengelola chat
            pelanggan atau membalas pesan.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="border-border bg-muted/30 flex items-center justify-end gap-2.5 border-t px-5 py-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="border-border hover:border-foreground-muted h-9 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            {t("common.cancel") || "Batal"}
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-9 cursor-pointer gap-1.5 rounded-full px-4.5 text-xs font-bold shadow-sm"
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
