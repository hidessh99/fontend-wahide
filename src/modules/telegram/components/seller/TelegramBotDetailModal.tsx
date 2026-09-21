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
import { TelegramBot } from "../../types/telegram.types";
import {
  Bot,
  Webhook,
  ShieldCheck,
  Radio,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Zap,
  Calendar,
  Activity,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface TelegramBotDetailModalProps {
  bot: TelegramBot | null;
  isOpen: boolean;
  onClose: () => void;
  onSync?: (id: string) => Promise<void>;
  isSyncing?: boolean;
}

export function TelegramBotDetailModal({
  bot,
  isOpen,
  onClose,
  onSync,
  isSyncing = false,
}: TelegramBotDetailModalProps) {
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

  if (!bot) return null;

  const publicCallbackUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/v1/telegram/webhook/${bot.id}`
      : `https://api.wahide.com/api/v1/telegram/webhook/${bot.id}`;

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
                <Bot className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-foreground text-base font-bold tracking-tight">
                  {bot.name}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Detail informasi dan konfigurasi webhook Telegram Bot {bot.name}
                </DialogDescription>
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    href={`https://t.me/${bot.username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-mono text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400"
                  >
                    <span>@{bot.username}</span>
                    <ExternalLink className="size-3" />
                  </a>
                  <span className="text-foreground-muted text-xs">•</span>
                  <span className="text-foreground-muted font-mono text-xs">
                    ID: {bot.bot_id}
                  </span>
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                bot.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-500/30 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-700 border-amber-500/30 dark:bg-amber-950/30 dark:text-amber-400"
              }`}
            >
              {bot.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Section 1: Inbound Webhook dari Telegram API ke Wahide */}
          <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4 dark:bg-[#10110e]">
            <div className="flex items-center justify-between">
              <div className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                <Webhook className="size-4 text-sky-600 dark:text-sky-400" />
                <span>Inbound Webhook (Telegram API → Wahide)</span>
              </div>
              {bot.webhook_active ? (
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 className="size-3" />
                  <span>Aktif & Terhubung</span>
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="gap-1 border-amber-500/30 bg-amber-500/10 text-[10px] font-bold text-amber-600 dark:text-amber-400"
                >
                  <AlertCircle className="size-3" />
                  <span>Perlu Sinkronisasi</span>
                </Badge>
              )}
            </div>

            <p className="text-foreground-secondary text-[11px] leading-relaxed">
              Wahide secara otomatis menerima event percakapan dan pesan masuk
              dari Telegram Bot API melalui webhook khusus di bawah ini:
            </p>

            {/* Inbound Callback URL */}
            <div className="space-y-1.5">
              <span className="text-foreground-muted block text-[11px] font-semibold">
                Callback URL Endpoint
              </span>
              <div className="flex items-center gap-1.5">
                <Input
                  variant="rounded"
                  readOnly
                  value={publicCallbackUrl}
                  className="font-mono text-xs bg-surface dark:bg-zinc-900"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopy(publicCallbackUrl, "callback", "Callback URL")
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

            {/* Tombol Re-Sync Webhook */}
            {onSync && (
              <div className="pt-1 flex items-center justify-between border-t border-border/40">
                <span className="text-foreground-muted text-[11px]">
                  Pendaftaran webhook diperbarui secara otomatis dengan sertifikat SSL.
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onSync(bot.id)}
                  disabled={isSyncing}
                  className="h-7 text-[11px] font-bold gap-1.5 shrink-0"
                >
                  <RefreshCw
                    className={`size-3 ${isSyncing ? "animate-spin" : ""}`}
                  />
                  <span>
                    {isSyncing ? "Menyinkronkan..." : "Sinkronkan Webhook"}
                  </span>
                </Button>
              </div>
            )}
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
              Seluruh pesan yang diterima bot Telegram ini secara otomatis
              diteruskan ke <strong>Webhook Global Workspace</strong> Anda
              dengan signature keamanan HMAC-SHA256:
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
                  callback_query
                </Badge>
              </div>
            </div>
          </div>

          {/* Section 3: Ringkasan Metrik & Aktivitas */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="border-border bg-muted/20 rounded-xl border p-3 dark:bg-[#10110e]">
              <div className="flex items-center gap-1.5 text-foreground-muted text-[11px] font-medium">
                <Zap className="size-3.5 text-amber-500" />
                <span>Pesan Hari Ini</span>
              </div>
              <div className="text-foreground mt-1.5 font-mono text-base font-black">
                {bot.daily_sent_count.toLocaleString()}
              </div>
              <span className="text-foreground-muted text-[10px]">
                Reset tiap tengah malam
              </span>
            </div>

            <div className="border-border bg-muted/20 rounded-xl border p-3 dark:bg-[#10110e]">
              <div className="flex items-center gap-1.5 text-foreground-muted text-[11px] font-medium">
                <Activity className="size-3.5 text-emerald-600" />
                <span>Terakhir Sinkron</span>
              </div>
              <div className="text-foreground mt-1.5 font-mono text-xs font-bold truncate">
                {formatDateTime(bot.last_sync_at)}
              </div>
              <span className="text-foreground-muted text-[10px]">
                Status sinkronisasi webhook
              </span>
            </div>

            <div className="border-border bg-muted/20 rounded-xl border p-3 dark:bg-[#10110e]">
              <div className="flex items-center gap-1.5 text-foreground-muted text-[11px] font-medium">
                <Calendar className="size-3.5 text-sky-600" />
                <span>Tanggal Terhubung</span>
              </div>
              <div className="text-foreground mt-1.5 font-mono text-xs font-bold truncate">
                {formatDateTime(bot.created_at)}
              </div>
              <span className="text-foreground-muted text-[10px]">
                Waktu bot ditautkan
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="border-border border-t pt-3">
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
