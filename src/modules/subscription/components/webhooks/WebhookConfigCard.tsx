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
    <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green flex items-center justify-center">
            <Webhook className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground tracking-tight">
              {t("subscription.webhookTitle")}
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary">
              {t("subscription.webhookSubtitle")}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-foreground">
            {isEnabled ? "Webhook Aktif" : "Webhook Nonaktif"}
          </span>
          <button
            type="button"
            onClick={() => setIsEnabled(!isEnabled)}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
              isEnabled ? "bg-wise-green" : "bg-muted"
            }`}
            aria-label="Toggle Webhook"
          >
            <div
              className={`size-5 rounded-full bg-white transition-transform ${
                isEnabled ? "translate-x-6 bg-dark-green" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Endpoint URL Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
            {t("subscription.webhookUrlLabel")}
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t("subscription.webhookUrlPlaceholder")}
            disabled={!isEnabled || isSaving}
            className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono disabled:opacity-50"
          />
        </div>

        {/* Signing Secret Box */}
        <div className="p-4 rounded-md border border-border bg-muted/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="size-4 text-emerald-700 dark:text-wise-green" />
              <span className="text-xs font-bold text-foreground">
                {t("subscription.signingSecretLabel")}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowSecret(!showSecret)}
                className="size-7 rounded-full p-0 border-border"
                aria-label={showSecret ? "Sembunyikan Kunci" : "Tampilkan Kunci"}
              >
                {showSecret ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => config?.secret && onCopySecret(config.secret)}
                className="size-7 rounded-full p-0 border-border"
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
                className="size-7 rounded-full p-0 border-border"
                aria-label="Regenerate Secret"
              >
                <RefreshCw className={`size-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <div className="p-2.5 rounded bg-surface dark:bg-[#10110e] border border-border text-xs font-mono text-foreground font-semibold break-all">
            {showSecret
              ? config?.secret || "whsec_..."
              : "whsec_••••••••••••••••••••••••••••••••"}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground-muted pt-1">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-wise-green shrink-0" />
            <span>Gunakan kunci ini untuk memverifikasi signature header `X-Wahide-Signature-256`.</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isSaving || !isEnabled}
            className="text-xs font-bold gap-2 px-6 shadow-sm"
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
