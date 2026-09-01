"use client";

import React, { useState, useEffect } from "react";
import { Ticket, TicketStatus } from "@/services/support/types/support.types";
import { supportApi } from "@/services/support/api/support.api";
import { Button } from "@/components/ui/button";
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

  // Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-lg bg-surface dark:bg-[#161715] rounded-xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="status-modal-title"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center shrink-0">
              <SlidersHorizontal className="size-4.5" />
            </div>
            <div>
              <h2 id="status-modal-title" className="text-base font-extrabold text-foreground">
                {t("support.updateStatusModalTitle")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {t("support.updateStatusModalSubtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-secondary hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold">
          {/* Target Ticket Overview Summary */}
          <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 px-2.5 py-0.5 rounded-full border border-wise-green/30">
                {ticket.ticketNumber}
              </span>
              <span className="text-[11px] font-bold text-foreground-muted uppercase">
                {ticket.category}
              </span>
            </div>
            <p className="font-bold text-foreground text-sm line-clamp-1">
              {ticket.subject}
            </p>
            {ticket.user && (
              <div className="flex items-center gap-3 text-[11px] text-foreground-secondary pt-1 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <User className="size-3 text-wise-green" />
                  <span className="font-bold text-foreground">{ticket.user.name}</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Mail className="size-3 text-foreground-muted" />
                  <span>{ticket.user.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Status Selection Cards */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-foreground tracking-wide uppercase">
              {t("support.targetStatusLabel")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = selectedStatus === opt.value;
                const Icon = opt.icon;

                return (
                  <div
                    key={opt.value}
                    onClick={() => setSelectedStatus(opt.value)}
                    className={`p-3 rounded-lg border transition cursor-pointer select-none relative ${
                      isSelected
                        ? opt.borderActiveClass
                        : "border-border bg-surface dark:bg-[#121310] hover:border-foreground-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`p-1 rounded-full border ${opt.accentClass}`}>
                          <Icon className="size-3" />
                        </span>
                        <span className="font-extrabold text-xs text-foreground">
                          {opt.label}
                        </span>
                      </div>
                      {isSelected && (
                        <span className="size-4 rounded-full bg-wise-green text-dark-green flex items-center justify-center">
                          <Check className="size-2.5 stroke-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-foreground-secondary leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkbox Dialog Section: Konfirmasi Prosedur Helpdesk */}
          <div className="pt-2 border-t border-border">
            <label className="flex items-start gap-2.5 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={confirmChange}
                onChange={(e) => setConfirmChange(e.target.checked)}
                className="mt-0.5 size-4 rounded border-border text-wise-green focus:ring-wise-green cursor-pointer"
              />
              <span className="text-xs text-foreground-secondary group-hover:text-foreground transition leading-tight font-bold">
                {t("support.confirmChangeLabel")}
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full px-4 text-xs font-bold border-border hover:border-foreground-muted"
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
