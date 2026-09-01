"use client";

import React, { useState } from "react";
import { UserItem, AdjustBalanceInput } from "../types/admin.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { X, Sliders, Loader2, Save } from "lucide-react";

interface AdjustBalanceModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdjustBalanceInput) => Promise<unknown>;
}

export function AdjustBalanceModal({
  user,
  isOpen,
  onClose,
  onSubmit,
}: AdjustBalanceModalProps) {
  const { t } = useI18n();
  const [addQuota, setAddQuota] = useState<number>(1000);
  const [addBalance, setAddBalance] = useState<number>(50000);
  const [isLoading, setIsLoading] = useState(false);

  // Escape key to dismiss
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({
        userId: user.id,
        addQuota: Number(addQuota) || 0,
        addBalance: Number(addBalance) || 0,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Sticky Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border/80 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Sliders className="size-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {t("admin.adjustModalTitle")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {t("admin.adjustModalSubtitle", { name: user.name })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="p-5 sm:p-6 space-y-4 flex-1">
            {/* Add Quota */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                {t("admin.addQuotaLabel")} (Saat ini: {user.quotaRemaining})
              </label>
              <input
                type="number"
                step={100}
                value={addQuota}
                onChange={(e) => setAddQuota(parseInt(e.target.value, 10) || 0)}
                className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono"
              />
            </div>

            {/* Add Balance */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                {t("admin.addBalanceLabel")} (Saat ini: Rp {user.depositBalance.toLocaleString("id-ID")})
              </label>
              <input
                type="number"
                step={10000}
                value={addBalance}
                onChange={(e) => setAddBalance(parseInt(e.target.value, 10) || 0)}
                className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono"
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-4 sm:p-6 pt-3 border-t border-border/80 bg-surface/90 dark:bg-[#161715]/90 backdrop-blur-sm flex items-center justify-end gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-full text-xs font-bold px-4 border-border hover:border-foreground-muted cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="text-xs font-bold gap-1.5 px-6 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("admin.submittingAdjust")}</span>
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  <span>{t("admin.submitAdjust")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
