"use client";

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
import { AlertTriangle, RefreshCw, Trash2, ShieldAlert, Loader2, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface ApiKeyConfirmModalProps {
  isOpen: boolean;
  mode: "REGENERATE" | "REVOKE";
  currentKey?: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export function ApiKeyConfirmModal({
  isOpen,
  mode,
  currentKey,
  isLoading,
  onClose,
  onConfirm,
}: ApiKeyConfirmModalProps) {
  const { t } = useI18n();
  const isRegenerate = mode === "REGENERATE";

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="border-border bg-surface flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg dark:bg-[#161715]">
        {/* Header Icon & Title */}
        <AlertDialogHeader className="border-border flex shrink-0 flex-row items-center gap-3.5 border-b p-5 text-left sm:p-6">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${
              isRegenerate
                ? "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                : "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400"
            }`}
          >
            {isRegenerate ? (
              <AlertTriangle className="size-5.5" />
            ) : (
              <ShieldAlert className="size-5.5" />
            )}
          </div>
          <div>
            <AlertDialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {isRegenerate ? t("settings.regenerateTitle") : t("settings.revokeTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground-secondary text-xs font-semibold">
              {isRegenerate
                ? t("settings.regenerateSubtitle")
                : t("settings.revokeSubtitle")}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Scrollable Body Content */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 text-xs sm:p-6">
          {/* Warning Callout Box */}
          <div
            className={`space-y-2.5 rounded-lg border p-4 ${
              isRegenerate
                ? "border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10"
                : "border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10"
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-extrabold">
              <span
                className={
                  isRegenerate
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-rose-700 dark:text-rose-400"
                }
              >
                {t("settings.operationalImpactWarning")}
              </span>
            </div>

            <p className="text-foreground-secondary text-xs leading-relaxed font-medium">
              {isRegenerate
                ? t("settings.regenerateWarningDesc")
                : t("settings.revokeWarningDesc")}
            </p>

            {currentKey && (
              <div className="pt-1.5">
                <span className="text-foreground-muted mb-1 block text-[11px] font-bold">
                  {t("settings.targetKeyLabel")}
                </span>
                <div className="bg-muted/70 border-border/80 text-foreground rounded border p-2 font-mono text-[11px] font-semibold break-all dark:bg-black/40">
                  {currentKey.slice(0, 12)}••••••••••••••••••••
                </div>
              </div>
            )}
          </div>

          {/* Informational Guidance */}
          <div className="text-foreground-muted flex items-start gap-2 text-[11px] font-medium">
            <Zap className="dark:text-wise-green mt-0.5 size-3.5 shrink-0 text-emerald-600" />
            <span>
              {isRegenerate
                ? t("settings.regenerateHint")
                : t("settings.revokeHint")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <AlertDialogFooter className="border-border bg-muted/20 m-0 flex shrink-0 flex-row items-center justify-end gap-3 rounded-none border-t p-4 sm:p-5">
          <AlertDialogCancel
            disabled={isLoading}
            className="border-border hover:border-foreground-muted h-9 rounded-full px-5 text-xs font-bold"
          >
            {t("actions.cancel")}
          </AlertDialogCancel>

          {isRegenerate ? (
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={onConfirm}
              disabled={isLoading}
              className="h-9 gap-2 px-5 text-xs font-bold shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("settings.regeneratingBtn")}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="size-3.5" />
                  <span>{t("settings.regenerateConfirmBtn")}</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={onConfirm}
              disabled={isLoading}
              className="h-9 gap-2 rounded-full bg-rose-600 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("settings.revokingBtn")}</span>
                </>
              ) : (
                <>
                  <Trash2 className="size-3.5" />
                  <span>{t("settings.revokeConfirmBtn")}</span>
                </>
              )}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
