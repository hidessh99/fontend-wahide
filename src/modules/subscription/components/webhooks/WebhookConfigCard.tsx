"use client";

import React, { useState } from "react";
import { WebhookConfig } from "@/modules/subscription/types/subscription.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import {
  Webhook,
  Key,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  Loader2,
  ShieldCheck,
} from "lucide-react";

interface WebhookConfigCardProps {
  config: WebhookConfig | null;
  onSave: (url: string, isEnabled: boolean) => Promise<unknown>;
  onRegenerateSecret: () => Promise<unknown>;
  onCopySecret: (secret: string) => void;
}

export function WebhookConfigCard({
  config,
  onSave,
  onRegenerateSecret,
  onCopySecret,
}: WebhookConfigCardProps) {
  const { t } = useI18n();
  const [url, setUrl] = useState(config?.url || "");
  const [isEnabled, setIsEnabled] = useState(config?.isEnabled ?? true);
  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(url.trim(), isEnabled);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (confirm("Apakah Anda yakin ingin membuat ulang kunci Signing Secret?")) {
      setIsRegenerating(true);
      try {
        await onRegenerateSecret();
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  return (
    <div className="border-border bg-surface space-y-6 rounded-md border p-6 shadow-sm sm:p-8 dark:bg-[#161715]">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <Webhook className="size-5" />
          </div>
          <div>
            <h2 className="text-foreground text-xl font-black tracking-tight">
              {t("subscription.webhookTitle")}
            </h2>
            <p className="text-foreground-secondary text-xs font-semibold">
              {t("subscription.webhookSubtitle")}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2.5">
          <span className="text-foreground text-xs font-bold">
            {isEnabled ? "Webhook Aktif" : "Webhook Nonaktif"}
          </span>
          <button
            type="button"
            onClick={() => setIsEnabled(!isEnabled)}
            className={`h-6 w-12 cursor-pointer rounded-full p-0.5 transition-colors ${
              isEnabled ? "bg-wise-green" : "bg-muted"
            }`}
            aria-label="Toggle Webhook"
          >
            <div
              className={`size-5 rounded-full bg-white transition-transform ${
                isEnabled ? "bg-dark-green translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Endpoint URL Input */}
        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("subscription.webhookUrlLabel")}
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("subscription.webhookUrlPlaceholder")}
            disabled={!isEnabled || isSaving}
            className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full rounded-full border px-4 font-mono text-xs font-semibold transition outline-none focus:ring-2 disabled:opacity-50 dark:bg-[#10110e]"
          />
        </div>

        {/* Signing Secret Box */}
        <div className="border-border bg-muted/30 space-y-2 rounded-md border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="dark:text-wise-green size-4 text-emerald-700" />
              <span className="text-foreground text-xs font-bold">
                {t("subscription.signingSecretLabel")}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSecret(!showSecret)}
                className="border-border size-7 rounded-full p-0"
                aria-label={showSecret ? "Sembunyikan Kunci" : "Tampilkan Kunci"}
              >
                {showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => config?.secret && onCopySecret(config.secret)}
                className="border-border size-7 rounded-full p-0"
                aria-label="Salin Secret"
              >
                <Copy className="size-3.5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isRegenerating}
                onClick={handleRegenerate}
                className="border-border size-7 rounded-full p-0"
                aria-label="Regenerate Secret"
              >
                <RefreshCw className={`size-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="bg-surface border-border text-foreground rounded border p-2.5 font-mono text-xs font-semibold break-all dark:bg-[#10110e]">
            {showSecret ? config?.secret || "whsec_..." : "whsec_••••••••••••••••••••••••••••••••"}
          </div>

          <div className="text-foreground-muted flex items-center gap-1.5 pt-1 text-[11px] font-semibold">
            <ShieldCheck className="dark:text-wise-green size-3.5 shrink-0 text-emerald-600" />
            <span>
              Gunakan kunci ini untuk memverifikasi signature header `X-Wahide-Signature-256`.
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isSaving || !isEnabled}
            className="gap-2 px-6 text-xs font-bold shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("subscription.saving")}</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>{t("subscription.saveWebhook")}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
