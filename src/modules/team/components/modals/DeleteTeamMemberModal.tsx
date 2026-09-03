"use client";

import { Agent } from "@/modules/team/types/team.types";
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
import { useI18n } from "@/lib/i18n/context";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

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

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      onClose();
    }
  };

  if (!targetMember) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-surface border-border max-w-md gap-0 overflow-hidden p-0 dark:bg-[#161715]">
        {/* Header with Warning Accent */}
        <AlertDialogHeader className="border-border/80 flex flex-row items-center gap-3 border-b bg-rose-500/5 p-5 text-left">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-base font-extrabold tracking-tight">
              Hapus Anggota Tim
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary mt-0.5 text-xs font-semibold">
              Konfirmasi penghapusan akses staf agen.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

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
        <AlertDialogFooter className="border-border bg-muted/30 m-0 flex flex-row items-center justify-end gap-2.5 rounded-none border-t px-5 py-4">
          <AlertDialogCancel
            disabled={isDeleting}
            className="border-border hover:border-foreground-muted h-9 cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            {t("common.cancel") || "Batal"}
          </AlertDialogCancel>

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
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
