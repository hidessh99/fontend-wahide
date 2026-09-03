"use client";

import React, { useState } from "react";
import { Ticket, TicketStatus } from "@/modules/support/types/support.types";
import { supportApi } from "@/modules/support/api/support.api";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import {
  X,
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

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

  if (!isOpen || !ticket) return null;

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
    } catch {
      toast.error(t("support.statusUpdateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        className="bg-surface border-border animate-in fade-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl duration-200 dark:bg-[#161715]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
      >
        {/* Header Section */}
        <div className="border-border bg-muted/30 flex items-center justify-between border-b p-5">
          <div className="flex items-center gap-3">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <SlidersHorizontal className="size-4.5" />
            </div>
            <div>
              <h2 id="status-modal-title" className="text-foreground text-base font-extrabold">
                {t("support.updateStatusModalTitle")}
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                {t("support.updateStatusModalSubtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 p-5 text-xs font-semibold">
          {/* Target Ticket Overview Summary */}
          <div className="border-border bg-muted/30 space-y-1.5 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                {ticket.ticketNumber}
              </span>
              <span className="text-foreground-muted text-[11px] font-bold uppercase">
                {ticket.category}
              </span>
            </div>
            <p className="text-foreground line-clamp-1 text-sm font-bold">{ticket.subject}</p>
            {ticket.user && (
              <div className="text-foreground-secondary border-border/50 flex items-center gap-3 border-t pt-1 text-[11px]">
                <div className="flex items-center gap-1">
                  <User className="dark:text-wise-green size-3 text-emerald-700" />
                  <span className="text-foreground font-bold">{ticket.user.name}</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Mail className="text-foreground-muted size-3" />
                  <span>{ticket.user.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Status Selection Cards */}
          <div className="space-y-2">
            <label className="text-foreground text-xs font-extrabold tracking-wide uppercase">
              {t("support.targetStatusLabel")}
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = selectedStatus === opt.value;
                const Icon = opt.icon;

                return (
                  <div
                    key={opt.value}
                    onClick={() => setSelectedStatus(opt.value)}
                    className={`relative cursor-pointer rounded-lg border p-3 transition select-none ${
                      isSelected
                        ? opt.borderActiveClass
                        : "border-border bg-surface hover:border-foreground-muted dark:bg-[#121310]"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`rounded-full border p-1 ${opt.accentClass}`}>
                          <Icon className="size-3" />
                        </span>
                        <span className="text-foreground text-xs font-extrabold">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <span className="bg-wise-green text-dark-green flex size-4 items-center justify-center rounded-full">
                          <Check className="size-2.5 stroke-3" />
                        </span>
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

          {/* Footer Actions */}
          <div className="border-border flex items-center justify-end gap-2.5 border-t pt-3">
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
          </div>
        </form>
      </div>
    </div>
  );
}
