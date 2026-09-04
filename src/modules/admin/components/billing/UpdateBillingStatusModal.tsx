"use client";

import React, { useState } from "react";
import { AdminBillingItem } from "@/modules/admin/types/admin.types";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2, Save, Clock, Ban, Receipt, User } from "lucide-react";

interface UpdateBillingStatusModalProps {
  billing: AdminBillingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, status: "EXPIRED" | "CANCELLED") => Promise<unknown>;
}

export function UpdateBillingStatusModal({
  billing,
  isOpen,
  onClose,
  onSubmit,
}: UpdateBillingStatusModalProps) {
  const { t, locale } = useI18n();
  const [selectedStatus, setSelectedStatus] = useState<"EXPIRED" | "CANCELLED">("CANCELLED");
  const [isLoading, setIsLoading] = useState(false);

  if (!billing) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(billing.id, selectedStatus);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md">
        {/* Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Receipt className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight">
              {t("admin.billing.updateStatusModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("admin.billing.updateStatusModalSubtitle", { invoiceNumber: billing.id.slice(0, 8) })}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
            {/* Transaction Detail Card */}
            <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground-secondary flex items-center gap-1.5 font-semibold">
                  <User className="text-foreground-muted size-3.5" />
                  <span>{t("admin.billing.userLabel")}</span>
                </span>
                <span className="text-foreground max-w-50 truncate font-bold">
                  {billing.user?.name || `User ${billing.userId.slice(-6)}`}
                </span>
              </div>
              <div className="border-border/50 flex items-center justify-between border-t pt-1.5 text-xs">
                <span className="text-foreground-secondary font-semibold">{t("admin.billing.colAmount")}:</span>
                <span className="text-foreground font-mono font-bold">
                  Rp {billing.amount.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
                </span>
              </div>
              <div className="border-border/50 flex items-center justify-between border-t pt-1.5 text-xs">
                <span className="text-foreground-secondary font-semibold">{t("admin.billing.currentStatusLabel")}</span>
                <span className="rounded border border-amber-500/20 bg-amber-500/15 px-2 py-0.5 text-[10px] font-black tracking-wider text-amber-700 uppercase dark:text-amber-400">
                  {billing.status}
                </span>
              </div>
            </div>

            {/* Status Selection (EXPIRED vs CANCELLED only) */}
            <div className="space-y-2">
              <label className="text-foreground block text-xs font-bold tracking-wider uppercase">
                {t("admin.billing.newStatusLabel")}
              </label>

              <div className="space-y-2.5">
                {/* Option 1: CANCELLED */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition select-none ${
                    selectedStatus === "CANCELLED"
                      ? "text-foreground border-rose-500/60 bg-rose-500/10"
                      : "border-border bg-surface text-foreground-secondary hover:border-foreground-muted dark:bg-[#10110e]"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="CANCELLED"
                    checked={selectedStatus === "CANCELLED"}
                    onChange={() => setSelectedStatus("CANCELLED")}
                    className="mt-0.5 size-4 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <Ban className="size-3.5" />
                      <span>{t("admin.billing.statusCancelledTitle")}</span>
                    </div>
                    <p className="text-foreground-muted text-[11px] leading-tight">
                      {t("admin.billing.statusCancelledDesc")}
                    </p>
                  </div>
                </label>

                {/* Option 2: EXPIRED */}
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition select-none ${
                    selectedStatus === "EXPIRED"
                      ? "text-foreground border-zinc-500/60 bg-zinc-500/10"
                      : "border-border bg-surface text-foreground-secondary hover:border-foreground-muted dark:bg-[#10110e]"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value="EXPIRED"
                    checked={selectedStatus === "EXPIRED"}
                    onChange={() => setSelectedStatus("EXPIRED")}
                    className="mt-0.5 size-4 text-zinc-600 focus:ring-zinc-500"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                      <Clock className="size-3.5" />
                      <span>{t("admin.billing.statusExpiredTitle")}</span>
                    </div>
                    <p className="text-foreground-muted text-[11px] leading-tight">
                      {t("admin.billing.statusExpiredDesc")}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Information Alert */}
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-[11px] text-amber-700 dark:text-amber-400">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                {t("admin.billing.paidWebhookNotice")}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="border-border bg-muted/20 flex shrink-0 items-center justify-end gap-3 border-t p-4 sm:p-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="border-border hover:bg-muted rounded-full text-xs font-bold"
            >
              {t("common.cancel")}
            </Button>

            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="gap-1.5 rounded-full px-5 text-xs font-extrabold shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("admin.billing.updatingBtn")}</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>{t("admin.billing.updateConfirmBtn")}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
