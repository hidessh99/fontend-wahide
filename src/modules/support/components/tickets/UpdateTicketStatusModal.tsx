"use client";

import React, { useState } from "react";
import { Ticket, TicketStatus } from "@/modules/support/types/support.types";
import { supportApi } from "@/modules/support/api/support.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import {
  SlidersHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Loader2,
  User,
  Mail,
  Check,
} from "lucide-react";

interface UpdateTicketStatusModalProps {
  isOpen: boolean;
  ticket: Ticket | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function UpdateTicketStatusModal({
  isOpen,
  ticket,
  onClose,
  onSuccess,
}: UpdateTicketStatusModalProps) {
  const { t } = useI18n();
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>(ticket?.status || "OPEN");
  const [confirmChange, setConfirmChange] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ticket) return null;

  const STATUS_OPTIONS: Array<{
    value: TicketStatus;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
    borderActiveClass: string;
  }> = [
    {
      value: "OPEN",
      label: t("support.statusOpen"),
      description: t("support.statusOptionOpenDesc"),
      icon: AlertCircle,
      accentClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      borderActiveClass: "border-sky-500 ring-1 ring-sky-500 bg-sky-500/5",
    },
    {
      value: "IN_PROGRESS",
      label: t("support.statusInProgress"),
      description: t("support.statusOptionProgressDesc"),
      icon: Clock,
      accentClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      borderActiveClass: "border-amber-500 ring-1 ring-amber-500 bg-amber-500/5",
    },
    {
      value: "RESOLVED",
      label: t("support.statusResolved"),
      description: t("support.statusOptionResolvedDesc"),
      icon: CheckCircle2,
      accentClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      borderActiveClass: "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-500/5",
    },
    {
      value: "CLOSED",
      label: t("support.statusClosed"),
      description: t("support.statusOptionClosedDesc"),
      icon: Lock,
      accentClass: "bg-muted text-foreground-muted border-border",
      borderActiveClass: "border-foreground-muted ring-1 ring-foreground-muted bg-muted/20",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmChange) {
      toast.error(t("support.confirmChangeLabel"));
      return;
    }

    try {
      setIsSubmitting(true);
      await supportApi.updateTicketStatus(ticket.id, selectedStatus);
      toast.success(t("support.statusUpdatedSuccess"));
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("support.statusUpdatedError");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <SlidersHorizontal className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {t("support.updateStatusTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("support.updateStatusDesc")}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4.5 overflow-y-auto p-5 text-xs sm:p-6">
            {/* Target Ticket Identity Snippet */}
            <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-foreground-muted font-mono text-[10px] font-bold uppercase">
                  ID: #{ticket.id.slice(0, 8)}
                </span>
                <span className="border-border bg-surface text-foreground-secondary rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold dark:bg-[#10110e]">
                  {ticket.category}
                </span>
              </div>
              <h3 className="text-foreground line-clamp-1 text-xs font-bold sm:text-sm">
                {ticket.subject}
              </h3>
              <div className="text-foreground-muted border-border/40 flex items-center gap-3 border-t pt-2 text-[11px]">
                <div className="flex items-center gap-1 truncate">
                  <User className="size-3 shrink-0" />
                  <span className="truncate">{ticket.user?.name || "Pengguna"}</span>
                </div>
                <div className="flex items-center gap-1 truncate font-mono">
                  <Mail className="size-3 shrink-0" />
                  <span className="truncate">{ticket.user?.email || "-"}</span>
                </div>
              </div>
            </div>

            {/* Status Option Grid */}
            <div className="space-y-2">
              <label className="text-foreground block text-xs font-bold">
                {t("support.selectNewStatus")}
              </label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = selectedStatus === opt.value;
                  const Icon = opt.icon;

                  return (
                    <div
                      key={opt.value}
                      onClick={() => setSelectedStatus(opt.value)}
                      className={`border-border bg-surface hover:border-foreground-muted relative flex cursor-pointer flex-col justify-between rounded-lg border p-3.5 transition select-none dark:bg-[#10110e] ${
                        isSelected ? opt.borderActiveClass : ""
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-black ${opt.accentClass}`}
                        >
                          <Icon className="size-3" />
                          <span>{opt.label}</span>
                        </span>
                        {isSelected && (
                          <div className="dark:bg-wise-green flex size-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <Check className="size-2.5 stroke-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-foreground-secondary text-[11px] leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checkbox Dialog Section: Konfirmasi Prosedur Helpdesk */}
            <div className="border-border border-t pt-2">
              <label className="group flex cursor-pointer items-start gap-2.5 select-none">
                <input
                  type="checkbox"
                  checked={confirmChange}
                  onChange={(e) => setConfirmChange(e.target.checked)}
                  className="border-border dark:text-wise-green dark:focus:ring-wise-green mt-0.5 size-4 cursor-pointer rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-foreground-secondary group-hover:text-foreground text-xs leading-tight font-bold transition">
                  {t("support.confirmChangeLabel")}
                </span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <DialogFooter className="border-border m-0 flex flex-row items-center justify-end gap-2.5 rounded-none border-t bg-transparent p-4 sm:p-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-border hover:border-foreground-muted rounded-full px-4 text-xs font-bold"
            >
              {t("support.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={!confirmChange || isSubmitting}
              className="gap-2 px-5 text-xs font-bold shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("support.savingStatus")}</span>
                </>
              ) : (
                <span>{t("support.saveStatusBtn")}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
