"use client";

import React, { useState } from "react";
import { Campaign } from "../../types/campaign.types";
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
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteCampaignModalProps {
  isOpen: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteCampaignModal({
  isOpen,
  campaign,
  onClose,
  onConfirm,
}: DeleteCampaignModalProps) {
  const { t } = useI18n();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open && !isDeleting) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error handling managed in useCampaigns hook
    } finally {
      setIsDeleting(false);
    }
  };

  if (!campaign) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border p-0 shadow-2xl sm:max-w-md">
        <AlertDialogHeader className="border-border/60 flex shrink-0 flex-row items-center gap-3.5 border-b p-6 pb-4 text-left">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-base font-bold tracking-tight sm:text-lg">
              {t("campaign.deleteModalTitle")}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>

        <div className="text-foreground-secondary min-h-0 flex-1 space-y-4 overflow-y-auto p-6 text-sm">
          <AlertDialogDescription className="text-foreground-secondary text-sm leading-relaxed">
            {t("campaign.deleteModalDesc", { name: campaign.name || "Kampanye" })}
          </AlertDialogDescription>
        </div>

        <AlertDialogFooter className="border-border/60 bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-6 pt-4">
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={onClose}
            className="border-border text-foreground hover:bg-muted cursor-pointer rounded-full px-4 text-xs font-semibold"
          >
            {t("campaign.deleteCancelBtn")}
          </AlertDialogCancel>

          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="cursor-pointer gap-2 rounded-full px-4 text-xs font-bold shadow-sm disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>{t("campaign.deleteConfirmBtn")}</span>
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
