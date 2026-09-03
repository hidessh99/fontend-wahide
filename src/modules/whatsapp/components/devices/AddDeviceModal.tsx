"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import { X, Smartphone, Loader2, Plus } from "lucide-react";

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<unknown>;
}

export function AddDeviceModal({ isOpen, onClose, onSubmit }: AddDeviceModalProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama perangkat wajib diisi");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(name.trim());
      setName("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan perangkat";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-md border shadow-2xl dark:bg-[#161715]">
        {/* Sticky Header */}
        <div className="border-border flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <Smartphone className="size-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-black tracking-tight sm:text-xl">
                {t("whatsapp.addModalTitle")}
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                {t("whatsapp.addModalSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-4 p-5 sm:p-6">
            {error && (
              <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("whatsapp.deviceNameLabel")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder={t("whatsapp.deviceNamePlaceholder")}
                disabled={isLoading}
                className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-12 w-full rounded-full border px-4 text-sm font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
                autoFocus
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="border-border/80 bg-surface/90 flex shrink-0 items-center justify-end gap-2.5 border-t p-4 pt-3 backdrop-blur-sm sm:p-6 dark:bg-[#161715]/90">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-5 text-xs font-bold"
            >
              {t("whatsapp.addCancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="cursor-pointer gap-2 rounded-full px-6 text-xs font-bold shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("whatsapp.addSaving")}</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>{t("whatsapp.addSubmit")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
