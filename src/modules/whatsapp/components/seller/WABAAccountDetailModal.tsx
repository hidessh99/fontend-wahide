"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/context";
import { useClipboard } from "@/hooks/useClipboard";
import { toast } from "sonner";
import { subscriptionApi } from "@/modules/subscription/api/subscription.api";
import { WABAAccount } from "../../types/waba.types";
import {
  Building2,
  Webhook,
  ShieldCheck,
  Radio,
  Check,
  Copy,
  ExternalLink,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Hash,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface WABAAccountDetailModalProps {
  account: WABAAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onReconnect?: () => void;
}

export function WABAAccountDetailModal({
  account,
  isOpen,
  onClose,
  onReconnect,
}: WABAAccountDetailModalProps) {
  const { locale } = useI18n();
  const { copied: copiedField, copy } = useClipboard<string>();

  const [workspaceWebhookUrl, setWorkspaceWebhookUrl] = useState<string>("");
  const [isLoadingWebhook, setIsLoadingWebhook] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    setIsLoadingWebhook(true);

    subscriptionApi
      .getWebhookConfig(controller.signal)
      .then((cfg) => {
        setWorkspaceWebhookUrl(cfg.url || "");
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setWorkspaceWebhookUrl("");
        }
      })
      .finally(() => {
        setIsLoadingWebhook(false);
      });

    return () => {
      controller.abort();
    };
  }, [isOpen]);

  if (!account) return null;

  const callbackUrl =
    account.webhook_callback_url ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/waba/webhook`
      : "https://api.wahide.com/waba/webhook");

  const verifyToken =
    account.webhook_verify_token || "wahide_meta_waba_verify_2026";

  const handleCopy = async (text: string, fieldId: string, label: string) => {
    const success = await copy(text, fieldId);
    if (success) {
      toast.success(`${label} berhasil disalin ke clipboard!`);
    } else {
      toast.error("Gagal menyalin ke clipboard");
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString(
        locale === "id" ? "id-ID" : "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    } catch {
      return dateStr;
    }
  };

  const getQualityBadge = (rating?: string) => {
    switch (rating?.toUpperCase()) {
      case "GREEN":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[10px]">
            <CheckCircle2 className="size-2.5" />
            <span>Kualitas Bagus (GREEN)</span>
          </Badge>
        );
      case "YELLOW":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1 text-[10px]">
            <AlertTriangle className="size-2.5" />
            <span>Sedang (YELLOW)</span>
          </Badge>
        );
      case "RED":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-1 text-[10px]">
            <AlertTriangle className="size-2.5" />
            <span>Rendah (RED)</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 text-[10px]">
            <HelpCircle className="size-2.5" />
            <span>UNKNOWN</span>
          </Badge>
        );
    }
  };

  const getTierBadge = (tier?: string) => {
    const formatted = tier?.replace("TIER_", "") || "1K";
    return (
      <Badge variant="secondary" className="font-mono text-[10px] gap-1">
        <Zap className="size-2.5 text-amber-500" />
        <span>Limit {formatted} pesan/hari</span>
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                <Building2 className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-foreground text-base font-bold tracking-tight flex items-center gap-2">
                  <span>{account.name}</span>
                  {account.verified_name && (
                    <span title={`Terverifikasi oleh Meta: ${account.verified_name}`}>
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Detail konfigurasi akun dan webhook Meta WABA {account.name}
                </DialogDescription>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs font-semibold text-foreground-secondary">
                    {account.phone_number || "Nomor Telepon Belum Terhubung"}
                  </span>
                  <span className="text-foreground-muted text-xs">•</span>
                  <span className="text-foreground-muted font-mono text-xs">
                    Channel: {account.channel_id}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              {getQualityBadge(account.meta_quality_rating)}
              {getTierBadge(account.meta_messaging_tier)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Section 1: Inbound Webhook Meta for Developers */}
          <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4 dark:bg-[#10110e]">
            <div className="flex items-center justify-between">
              <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                <Webhook className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Inbound Webhook Meta Cloud API</span>
              </div>
              <Badge
                variant="outline"
                className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="size-3" />
                <span>Meta Official Verified</span>
              </Badge>
            </div>

            <p className="text-foreground-secondary text-[11px] leading-relaxed">
              Gunakan konfigurasi berikut pada dashboard <strong>Meta for Developers</strong> di menu{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px]">
                WhatsApp → Configuration → Webhook
              </code>{" "}
              agar pesan dan laporan delivery diteruskan ke Wahide:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Callback URL */}
              <div className="space-y-1.5">
                <span className="text-foreground-muted block text-[11px] font-semibold">
                  Callback URL
                </span>
                <div className="flex items-center gap-1.5">
                  <Input
                    variant="rounded"
                    readOnly
                    value={callbackUrl}
                    className="font-mono text-xs bg-surface dark:bg-zinc-900"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopy(callbackUrl, "callback", "Callback URL")
                    }
                    className="shrink-0 h-9 px-3 gap-1 text-xs font-semibold"
                  >
                    {copiedField === "callback" ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    <span>Salin</span>
                  </Button>
                </div>
              </div>

              {/* Verify Token */}
              <div className="space-y-1.5">
                <span className="text-foreground-muted block text-[11px] font-semibold">
                  Verify Token
                </span>
                <div className="flex items-center gap-1.5">
                  <Input
                    variant="rounded"
                    readOnly
                    value={verifyToken}
                    className="font-mono text-xs bg-surface dark:bg-zinc-900"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopy(verifyToken, "verifyToken", "Verify Token")
                    }
                    className="shrink-0 h-9 px-3 gap-1 text-xs font-semibold"
                  >
                    {copiedField === "verifyToken" ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    <span>Salin</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Subscribed Fields */}
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <span className="text-foreground-muted font-medium">
                Field Meta Wajib:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 py-0.5"
                >
                  messages
                </Badge>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 py-0.5"
                >
                  message_deliveries
                </Badge>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 py-0.5"
                >
                  message_reads
                </Badge>
              </div>
            </div>
          </div>

          {/* Section 2: Outbound Webhook Routing (Penerusan ke CRM Tenant) */}
          <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4 dark:bg-[#10110e]">
            <div className="flex items-center justify-between">
              <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                <Radio className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Outbound Webhook Routing (Wahide → CRM Tenant)</span>
              </div>
              <Badge
                variant="neutral"
                className="gap-1 py-0.5 text-[10px] font-bold"
              >
                <ShieldCheck className="size-2.5 text-zinc-500" />
                <span>Mewarisi Webhook Workspace</span>
              </Badge>
            </div>

            <p className="text-foreground-secondary text-[11px] leading-relaxed">
              Seluruh pesan masuk dari pelanggan serta laporan pengiriman status (sent, delivered, read)
              dari nomor WABA ini secara otomatis diteruskan ke <strong>Webhook Global Workspace</strong> Anda:
            </p>

            {/* Target Webhook URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-foreground-muted block text-[11px] font-semibold">
                  Target Destination URL (Endpoint CRM / Server Anda)
                </span>
                <Link
                  href="/subscription"
                  className="text-emerald-600 hover:underline inline-flex items-center gap-1 text-[10px] font-bold dark:text-emerald-400"
                >
                  <span>Atur di Settings Workspace</span>
                  <ExternalLink className="size-2.5" />
                </Link>
              </div>

              <div className="flex items-center gap-1.5">
                <Input
                  variant="rounded"
                  readOnly
                  placeholder={
                    isLoadingWebhook
                      ? "Memuat webhook workspace..."
                      : "Belum dikonfigurasi di Pengaturan Webhook Workspace"
                  }
                  value={workspaceWebhookUrl || ""}
                  className={`font-mono text-xs bg-surface dark:bg-zinc-900 ${
                    !workspaceWebhookUrl ? "italic text-foreground-muted" : ""
                  }`}
                />
                {workspaceWebhookUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopy(
                        workspaceWebhookUrl,
                        "workspaceUrl",
                        "Target Webhook URL",
                      )
                    }
                    className="shrink-0 h-9 px-3 gap-1 text-xs font-semibold"
                  >
                    {copiedField === "workspaceUrl" ? (
                      <Check className="size-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    <span>Salin</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Subscribed Events Tag */}
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <span className="text-foreground-muted font-medium">
                Event yang Diteruskan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] border-border bg-surface py-0.5"
                >
                  message.received
                </Badge>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] border-border bg-surface py-0.5"
                >
                  message.delivered
                </Badge>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] border-border bg-surface py-0.5"
                >
                  message.read
                </Badge>
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] border-border bg-surface py-0.5"
                >
                  message.sent
                </Badge>
              </div>
            </div>
          </div>

          {/* Section 3: Kredensial Meta Developer ID */}
          <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4 dark:bg-[#10110e]">
            <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
              <Hash className="size-4 text-sky-600 dark:text-sky-400" />
              <span>Identitas Kredensial Meta Developer</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border-border/60 bg-surface rounded-lg border p-3 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted text-[11px]">
                    WABA Account ID
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(account.waba_account_id, "wabaId", "WABA ID")
                    }
                    className="text-foreground-muted hover:text-foreground"
                    title="Salin WABA Account ID"
                  >
                    {copiedField === "wabaId" ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
                <span className="text-foreground font-mono text-xs font-bold block mt-1">
                  {account.waba_account_id}
                </span>
              </div>

              <div className="border-border/60 bg-surface rounded-lg border p-3 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted text-[11px]">
                    Phone Number ID
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        account.phone_number_id,
                        "phoneId",
                        "Phone Number ID",
                      )
                    }
                    className="text-foreground-muted hover:text-foreground"
                    title="Salin Phone Number ID"
                  >
                    {copiedField === "phoneId" ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </div>
                <span className="text-foreground font-mono text-xs font-bold block mt-1">
                  {account.phone_number_id}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-foreground-muted">
              <span>Waktu Akun Didaftarkan:</span>
              <span className="font-mono font-medium text-foreground">
                {formatDateTime(account.created_at)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-border border-t pt-3 flex items-center justify-between sm:justify-between">
          <div>
            {onReconnect && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onReconnect}
                className="text-xs font-semibold gap-1.5"
              >
                <Sparkles className="size-3 text-emerald-600" />
                <span>Re-Authenticate Meta</span>
              </Button>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold px-4"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
