"use client";

import React, { useState } from "react";
import { CreateTicketInput, TicketCategory, TicketPriority } from "../types/support.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { X, LifeBuoy, Send, Loader2 } from "lucide-react";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketInput) => Promise<unknown>;
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTicketModalProps) {
  const { t } = useI18n();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("WHATSAPP");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Subjek dan rincian pesan kendala wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit({
        subject: subject.trim(),
        category,
        priority,
        message: message.trim(),
      });
      setSubject("");
      setMessage("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat tiket";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <LifeBuoy className="size-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {t("support.createModalTitle")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {t("support.createModalSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("support.subjectLabel")}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("support.subjectPlaceholder")}
              disabled={isLoading}
              className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
              autoFocus
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                {t("support.categoryLabel")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
              >
                <option value="WHATSAPP">{t("support.categoryWhatsapp")}</option>
                <option value="BILLING">{t("support.categoryBilling")}</option>
                <option value="API">{t("support.categoryApi")}</option>
                <option value="GENERAL">{t("support.categoryGeneral")}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                {t("support.priorityLabel")}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
              >
                <option value="LOW">{t("support.priorityLow")}</option>
                <option value="MEDIUM">{t("support.priorityMedium")}</option>
                <option value="HIGH">{t("support.priorityHigh")}</option>
              </select>
            </div>
          </div>

          {/* Detailed Message */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("support.messageLabel")}
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("support.messagePlaceholder")}
              disabled={isLoading}
              className="w-full p-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-semibold text-xs border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition leading-relaxed"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-full text-xs font-bold px-4 border-border hover:border-foreground-muted"
            >
              {t("support.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="text-xs font-bold gap-1.5 px-6 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("support.submitting")}</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>{t("support.submitCreate")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
