"use client";

import React, { useState } from "react";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { useClipboard } from "@/hooks/useClipboard";
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useI18n } from "@/lib/i18n/context";
import { formatPhoneNumber } from "./DeviceCard";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { whatsappApi } from "../../api/whatsapp.api";
import { AVAILABLE_WEBHOOK_EVENTS, WebhookEventDefinition } from "@/modules/subscription/components/seller/WebhookConfigCard";
import {
  Smartphone,
  Phone,
  QrCode,
  Power,
  Moon,
  Sun,
  ShieldCheck,
  Calendar,
  Copy,
  Check,
  Activity,
  Cpu,
  Loader2,
  Webhook,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
} from "lucide-react";

interface DeviceDetailModalProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onScanQR?: (device: Device) => void;
  onDisconnect?: (id: string) => Promise<void>;
  onHibernate?: (id: string) => Promise<void>;
  onWake?: (id: string) => Promise<void>;
  onUpdateSettings?: (
    id: string,
    data: {
      push_name?: string;
      webhook_url?: string | null;
      webhook_secret?: string | null;
      webhook_events?: string[] | null;
    },
  ) => Promise<unknown>;
}

export function DeviceDetailModal({
  device,
  isOpen,
  onClose,
  onScanQR,
  onDisconnect,
  onHibernate,
  onWake,
  onUpdateSettings,
}: DeviceDetailModalProps) {
  const { t, locale } = useI18n();
  const { copied: copiedField, copy } = useClipboard<string>();
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Webhook Routing State
  const [webhookUrl, setWebhookUrl] = useState(
    device?.webhook_url || device?.webhookUrl || "",
  );
  const [webhookSecret, setWebhookSecret] = useState(
    device?.webhook_secret || device?.webhookSecret || "",
  );
  const hasInitialCustomEvents = Boolean(
    (device?.webhook_events && device.webhook_events.length > 0) ||
    (device?.webhookEvents && device.webhookEvents.length > 0),
  );
  const [isCustomEvents, setIsCustomEvents] = useState(hasInitialCustomEvents);
  const [customEvents, setCustomEvents] = useState<string[]>(
    device?.webhook_events ||
      device?.webhookEvents || ["message.received", "device.status"],
  );
  const [showSecret, setShowSecret] = useState(false);
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{
    success: boolean;
    latency?: number;
    error?: string;
  } | null>(null);

  React.useEffect(() => {
    if (device) {
      setWebhookUrl(device.webhook_url || device.webhookUrl || "");
      setWebhookSecret(device.webhook_secret || device.webhookSecret || "");
      const hasCustom = Boolean(
        (device.webhook_events && device.webhook_events.length > 0) ||
        (device.webhookEvents && device.webhookEvents.length > 0),
      );
      setIsCustomEvents(hasCustom);
      setCustomEvents(
        device.webhook_events ||
          device.webhookEvents || ["message.received", "device.status"],
      );
      setPingResult(null);
    }
  }, [device]);

  const handleToggleCustomEvent = (eventId: string) => {
    setCustomEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    );
  };

  const handleGenerateSecret = () => {
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const newSecret = `whsec_dev_${randomHex}`;
    setWebhookSecret(newSecret);
    toast.info(t("whatsapp.deviceWebhook.toastSecretGenerated"));
  };

  const handleSaveWebhook = async () => {
    if (!device) return;
    if (!webhookUrl.trim()) {
      toast.error(t("whatsapp.deviceWebhook.toastWebhookSaveFailed"));
      return;
    }
    if (
      !webhookUrl.startsWith("http://") &&
      !webhookUrl.startsWith("https://")
    ) {
      toast.error("Format URL harus diawali dengan http:// atau https://");
      return;
    }

    setIsSavingWebhook(true);
    try {
      const payload: {
        webhook_url: string;
        webhook_secret: string | null;
        webhook_events?: string[] | null;
      } = {
        webhook_url: webhookUrl.trim(),
        webhook_secret: webhookSecret.trim() || null,
        webhook_events: isCustomEvents ? customEvents : [],
      };
      if (onUpdateSettings) {
        await onUpdateSettings(device.id, payload);
      } else {
        const updated = await whatsappApi.updateDevice(device.id, payload);
        if (updated.webhook_secret) {
          setWebhookSecret(updated.webhook_secret);
        }
      }
      toast.success(t("whatsapp.deviceWebhook.toastWebhookSaved"));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("whatsapp.deviceWebhook.toastWebhookSaveFailed");
      toast.error(msg);
    } finally {
      setIsSavingWebhook(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!device) return;
    setIsSavingWebhook(true);
    try {
      const payload = {
        webhook_url: "",
        webhook_secret: "",
        webhook_events: [],
      };
      if (onUpdateSettings) {
        await onUpdateSettings(device.id, payload);
      } else {
        await whatsappApi.updateDevice(device.id, payload);
      }
      setWebhookUrl("");
      setWebhookSecret("");
      setIsCustomEvents(false);
      setCustomEvents(["message.received", "device.status"]);
      toast.success(t("whatsapp.deviceWebhook.toastWebhookReset"));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("whatsapp.deviceWebhook.toastWebhookResetFailed");
      toast.error(msg);
    } finally {
      setIsSavingWebhook(false);
    }
  };

  const handleTestPing = async () => {
    if (!device) return;
    if (!webhookUrl.trim()) {
      toast.error("Masukkan URL endpoint webhook terlebih dahulu");
      return;
    }
    setIsPinging(true);
    setPingResult(null);
    const startTime = performance.now();
    try {
      toast.info("Mengirim simulasi test.ping ke endpoint...", {
        id: "device-webhook-ping",
      });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      try {
        await fetch(webhookUrl.trim(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Wahide-Secret": webhookSecret || "",
            "User-Agent": "Wahide-WhatsApp-Device-Webhook/2.0-TestPing",
          },
          body: JSON.stringify({
            event: "test.ping",
            device_id: device.id,
            timestamp: Math.floor(Date.now() / 1000),
            data: {
              phone: device.phone,
              push_name: device.push_name || device.pushName || device.name,
              message:
                "Uji coba konektivitas khusus untuk perangkat WhatsApp ini.",
            },
          }),
          signal: controller.signal,
          mode: "no-cors",
        });
        const latency = Math.round(performance.now() - startTime);
        setPingResult({ success: true, latency });
        toast.success(
          t("whatsapp.deviceWebhook.pingSuccess", {
            latency: String(latency),
          }),
          {
            id: "device-webhook-ping",
          },
        );
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Endpoint unreachable or timeout";
      setPingResult({ success: false, error: errorMsg });
      toast.error(
        t("whatsapp.deviceWebhook.toastPingFailed", { error: errorMsg }),
        {
          id: "device-webhook-ping",
        },
      );
    } finally {
      setIsPinging(false);
    }
  };

  if (!device) return null;

  const handleCopy = async (text: string, fieldName: string) => {
    const success = await copy(text, fieldName);
    if (success) {
      toast.success(
        `${fieldName} ${t("whatsapp.deviceIdCopied") || "berhasil disalin!"}`,
      );
    }
  };

  const handleAction = async (actionFn: (id: string) => Promise<void>) => {
    setIsActionLoading(true);
    try {
      await actionFn(device.id);
    } catch (err) {
      console.warn("Device action error:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatDateTime = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "-";
      return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
    } catch {
      return "-";
    }
  };

  const renderStatusBadge = () => {
    switch (device.status) {
      case "CONNECTED":
        return (
          <Badge variant="success" className="gap-1.5 py-1 text-xs font-bold">
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
            {t("whatsapp.statusConnected")}
          </Badge>
        );
      case "PAIRING":
        return (
          <Badge variant="warning" className="gap-1.5 py-1 text-xs font-bold">
            <span className="size-2 animate-ping rounded-full bg-amber-500" />
            {t("whatsapp.statusPairing")}
          </Badge>
        );
      case "HIBERNATED":
        return (
          <Badge variant="info" className="gap-1.5 py-1 text-xs font-bold">
            <Moon className="size-3" />
            {t("whatsapp.statusHibernated")}
          </Badge>
        );
      case "DISCONNECTED":
      default:
        return (
          <Badge variant="neutral" className="gap-1.5 py-1 text-xs font-bold">
            <span className="size-2 rounded-full bg-zinc-400" />
            {t("whatsapp.statusDisconnected")}
          </Badge>
        );
    }
  };

  const trustScore = device.trustScore ?? 10;
  const warmupDay = device.warmupDay ?? 1;
  const dailySent = device.dailySentCount ?? 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-2xl">
        {/* Sticky Header */}
        <DialogHeader className="border-border/80 shrink-0 space-y-2 border-b p-5 pr-12 text-left sm:p-6">
          <div className="flex items-start gap-3.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
              <Smartphone className="size-6" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <DialogTitle className="text-foreground truncate text-lg font-extrabold tracking-tight sm:text-xl">
                  {device.push_name ||
                    device.pushName ||
                    device.name ||
                    "WhatsApp Device"}
                </DialogTitle>
                {renderStatusBadge()}
              </div>
              <div className="text-foreground-secondary flex items-center gap-2 text-xs font-semibold">
                {device.phone ? (
                  <>
                    <Phone className="text-foreground-muted size-3.5" />
                    <span className="font-mono">
                      {formatPhoneNumber(device.phone)}
                    </span>
                  </>
                ) : (
                  <span className="text-foreground-muted italic">
                    Nomor belum terhubung
                  </span>
                )}
              </div>
              <DialogDescription className="text-foreground-secondary line-clamp-1 text-[11px] font-medium">
                {t("whatsapp.detailModalSubtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs font-semibold sm:p-6">
          {/* Identitas Perangkat */}
          <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4 dark:bg-[#10110e]">
            <div className="text-foreground flex items-center gap-2 text-xs font-black tracking-wider uppercase">
              <Cpu className="dark:text-wise-green size-4 text-emerald-700" />
              <span>{t("whatsapp.identityAndSessionParams")}</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Device ID */}
              <div className="border-border/60 bg-surface rounded-lg border p-3">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.deviceId") || "Device ID"}
                </span>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-foreground font-mono text-xs font-bold select-all">
                    {device.id}
                  </span>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          onClick={() => handleCopy(device.id, "Device ID")}
                          className="hover:bg-muted text-foreground-muted hover:text-foreground flex size-6 shrink-0 cursor-pointer items-center justify-center rounded transition"
                        />
                      }
                    >
                      {copiedField === "Device ID" ? (
                        <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {copiedField === "Device ID"
                        ? t("whatsapp.copied")
                        : t("whatsapp.copyDeviceId") || "Salin Device ID"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* JID */}
              <div className="border-border/60 bg-surface rounded-lg border p-3">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.jidLabel") || "WhatsApp JID"}
                </span>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-foreground truncate font-mono text-xs font-bold select-all">
                    {device.jid || "-"}
                  </span>
                  {device.jid && (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <button
                            onClick={() =>
                              handleCopy(device.jid || "", "WhatsApp JID")
                            }
                            className="hover:bg-muted text-foreground-muted hover:text-foreground flex size-6 shrink-0 cursor-pointer items-center justify-center rounded transition"
                          />
                        }
                      >
                        {copiedField === "WhatsApp JID" ? (
                          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {copiedField === "WhatsApp JID"
                          ? t("whatsapp.copied")
                          : t("whatsapp.copyJid")}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Telemetri Anti-Ban & Performa Slot */}
          <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4 dark:bg-[#10110e]">
            <div className="text-foreground flex items-center gap-2 text-xs font-black tracking-wider uppercase">
              <ShieldCheck className="dark:text-wise-green size-4 text-emerald-700" />
              <span>{t("whatsapp.healthAndAntiBanTelemetry")}</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Trust Score */}
              <div className="border-border/60 bg-surface rounded-lg border p-3">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.trustScoreLabel") || "Skor Reputasi"}
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="dark:text-wise-green font-mono text-lg font-extrabold text-emerald-700">
                    {trustScore}
                  </span>
                  <span className="text-foreground-muted text-xs">/ 10</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${Math.min(100, (trustScore / 10) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Warmup Day */}
              <div className="border-border/60 bg-surface rounded-lg border p-3">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.warmupDayLabel") || "Fase Pemanasan"}
                </span>
                <div className="text-foreground mt-1 text-sm font-extrabold">
                  {t("whatsapp.dayUnit", { day: String(warmupDay) }) ||
                    `Hari ke-${warmupDay}`}
                </div>
                <span className="text-foreground-muted mt-1 block text-[10px] font-normal">
                  {t("whatsapp.antiBanCooldownActive")}
                </span>
              </div>

              {/* Messages Sent Today */}
              <div className="border-border/60 bg-surface rounded-lg border p-3">
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.dailySentCountLabel") || "Pesan Hari Ini"}
                </span>
                <div className="text-foreground mt-1 flex items-baseline gap-1">
                  <span className="font-mono text-lg font-extrabold">
                    {dailySent}
                  </span>
                  <span className="text-foreground-muted text-xs">
                    {t("whatsapp.messagesSentTodayUnit")}
                  </span>
                </div>
                <span className="text-foreground-muted mt-1 block text-[10px] font-normal">
                  {t("whatsapp.resetAutoMidnight")}
                </span>
              </div>
            </div>
          </div>

          {/* Riwayat Waktu Koneksi */}
          <div className="border-border/60 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Last Active */}
            <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-3.5 dark:bg-[#10110e]">
              <Activity className="dark:text-wise-green size-4 shrink-0 text-emerald-700" />
              <div>
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.lastSeenLabel") || "Terakhir Aktif"}
                </span>
                <span className="text-foreground font-mono font-bold">
                  {formatDateTime(device.lastSeenAt)}
                </span>
              </div>
            </div>

            {/* Created At */}
            <div className="border-border bg-muted/30 flex items-center gap-3 rounded-lg border p-3.5 dark:bg-[#10110e]">
              <Calendar className="text-foreground-muted size-4 shrink-0" />
              <div>
                <span className="text-foreground-muted block text-[11px]">
                  {t("whatsapp.connectedAtLabel") || "Tanggal Ditautkan"}
                </span>
                <span className="text-foreground font-mono font-bold">
                  {formatDateTime(device.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Routing Webhook Perangkat (Mazhab 3: Hierarchical Hybrid) */}
          <div className="border-border bg-muted/20 space-y-4 rounded-xl border p-4 dark:bg-[#10110e]">
            <div className="flex items-center justify-between">
              <div className="text-foreground flex items-center gap-2 text-xs font-black tracking-wider uppercase">
                <Webhook className="dark:text-wise-green size-4 text-emerald-700" />
                <span>{t("whatsapp.deviceWebhook.routingTitle")}</span>
              </div>
              {device.webhook_url ? (
                <Badge
                  variant="success"
                  className="gap-1 py-0.5 text-[10px] font-bold"
                >
                  <Radio className="size-2.5 animate-pulse text-emerald-500" />
                  {t("whatsapp.deviceWebhook.overrideActive")}
                </Badge>
              ) : (
                <Badge
                  variant="neutral"
                  className="gap-1 py-0.5 text-[10px] font-bold"
                >
                  <ShieldCheck className="size-2.5 text-zinc-500" />
                  {t("whatsapp.deviceWebhook.inheritWorkspace")}
                </Badge>
              )}
            </div>

            <p className="text-foreground-secondary text-[11px] leading-relaxed font-normal">
              {t("whatsapp.deviceWebhook.routingDesc")}
            </p>

            <div className="space-y-3">
              {/* Webhook URL Input */}
              <div className="space-y-1.5">
                <label className="text-foreground-muted block text-[11px] font-bold">
                  {t("whatsapp.deviceWebhook.urlLabel")}
                </label>
                <div className="relative">
                  <Input
                    variant="rounded"
                    type="url"
                    placeholder={t("whatsapp.deviceWebhook.urlPlaceholder")}
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="font-mono text-xs pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleTestPing}
                      disabled={isPinging || !webhookUrl}
                      className="h-7 px-2 text-[10px] font-bold gap-1 text-emerald-600 hover:text-emerald-700"
                    >
                      {isPinging ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Radio className="size-3" />
                      )}
                      <span>{t("whatsapp.deviceWebhook.pingBtn")}</span>
                    </Button>
                  </div>
                </div>
                {pingResult && (
                  <div
                    className={`mt-1.5 flex items-center gap-2 rounded-lg p-2 text-[11px] ${
                      pingResult.success
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                    }`}
                  >
                    {pingResult.success ? (
                      <Check className="size-3.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="size-3.5 shrink-0" />
                    )}
                    <span>
                      {pingResult.success
                        ? t("whatsapp.deviceWebhook.pingSuccess", {
                            latency: String(pingResult.latency),
                          })
                        : t("whatsapp.deviceWebhook.pingFailed", {
                            error: String(pingResult.error),
                          })}
                    </span>
                  </div>
                )}
              </div>

              {/* Webhook Secret Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-foreground-muted block text-[11px] font-bold">
                    {t("whatsapp.deviceWebhook.secretLabel")}
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSecret}
                    className="dark:text-wise-green text-[10px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <RefreshCw className="size-2.5" />
                    {t("whatsapp.deviceWebhook.generateRandom")}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    variant="rounded"
                    type={showSecret ? "text" : "password"}
                    placeholder={t("whatsapp.deviceWebhook.secretPlaceholder")}
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    className="font-mono text-xs pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSecret(!showSecret)}
                      className="h-7 w-7 p-0 text-foreground-muted hover:text-foreground"
                    >
                      {showSecret ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </Button>
                    {webhookSecret && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleCopy(
                            webhookSecret,
                            t("whatsapp.deviceWebhook.secretLabel"),
                          )
                        }
                        className="h-7 w-7 p-0 text-foreground-muted hover:text-foreground"
                      >
                        {copiedField === webhookSecret ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-foreground-muted text-[10px]">
                  {t("whatsapp.deviceWebhook.secretHint")}
                </p>
              </div>

              {/* Granular Webhook Event Subscriptions Override */}
              <div className="space-y-2.5 rounded-xl border border-border/80 bg-muted/20 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[11px] font-bold text-foreground">
                      {t("whatsapp.deviceWebhook.customEventsTitle")}
                    </span>
                  </div>
                  <Switch
                    checked={isCustomEvents}
                    onCheckedChange={setIsCustomEvents}
                    aria-label={t("whatsapp.deviceWebhook.customEventsTitle")}
                  />
                </div>
                <p className="text-[10px] text-foreground-secondary leading-relaxed">
                  {isCustomEvents
                    ? t("whatsapp.deviceWebhook.customEventsActiveDesc")
                    : t("whatsapp.deviceWebhook.inheritWorkspaceDesc")}
                </p>

                {isCustomEvents && (
                  <div className="space-y-1.5 pt-1.5 border-t border-border/60">
                    {AVAILABLE_WEBHOOK_EVENTS.map((ev: WebhookEventDefinition) => {
                      const isChecked = customEvents.includes(ev.id);
                      return (
                        <div
                          key={ev.id}
                          onClick={() => handleToggleCustomEvent(ev.id)}
                          className={`flex items-center justify-between gap-2 rounded-lg border p-2 text-xs transition-all cursor-pointer select-none ${
                            isChecked
                              ? "border-emerald-500/40 bg-emerald-500/5 dark:border-emerald-400/30 dark:bg-emerald-500/10"
                              : "border-border/60 bg-surface/40 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[11px] font-bold text-foreground">
                                {ev.id}
                              </span>
                              <span className="rounded border border-border/70 bg-background/80 px-1 py-0.2 text-[9px] font-semibold text-foreground-secondary">
                                {ev.tag}
                              </span>
                            </div>
                            <p className="text-[10px] text-foreground-secondary truncate">
                              {ev.name}
                            </p>
                          </div>
                          <Switch
                            checked={isChecked}
                            onCheckedChange={() =>
                              handleToggleCustomEvent(ev.id)
                            }
                            className="shrink-0 scale-90"
                            aria-label={`Toggle custom event ${ev.id}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons for Webhook */}
              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="primaryPill"
                  disabled={isSavingWebhook}
                  onClick={handleSaveWebhook}
                  className="gap-1.5 text-xs font-bold"
                >
                  {isSavingWebhook ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  <span>
                    {isSavingWebhook
                      ? t("whatsapp.deviceWebhook.savingWebhookBtn")
                      : t("whatsapp.deviceWebhook.saveWebhookBtn")}
                  </span>
                </Button>

                {(device.webhook_url || webhookUrl) && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isSavingWebhook}
                    onClick={handleResetToDefault}
                    className="border-border rounded-full text-xs font-bold text-foreground-muted hover:text-foreground hover:bg-muted/50"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>{t("whatsapp.deviceWebhook.resetToDefaultBtn")}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer Actions */}
        <DialogFooter className="border-border/70 bg-muted/20 flex shrink-0 items-center justify-between border-t p-4 sm:justify-between sm:p-5 dark:bg-[#10110e]">
          <div className="flex items-center gap-2">
            {device.status === "HIBERNATED" && onWake && (
              <Button
                variant="primaryPill"
                size="sm"
                disabled={isActionLoading}
                onClick={() => handleAction(onWake)}
                className="gap-2 text-xs font-bold"
              >
                {isActionLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sun className="size-3.5" />
                )}
                <span>{t("whatsapp.wake")}</span>
              </Button>
            )}

            {device.status === "CONNECTED" && onHibernate && (
              <Button
                variant="outline"
                size="sm"
                disabled={isActionLoading}
                onClick={() => handleAction(onHibernate)}
                className="border-border gap-2 rounded-full text-xs font-bold"
              >
                {isActionLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Moon className="size-3.5" />
                )}
                <span>{t("whatsapp.hibernate")}</span>
              </Button>
            )}

            {device.status === "CONNECTED" && onDisconnect && (
              <Button
                variant="outline"
                size="sm"
                disabled={isActionLoading}
                onClick={() => handleAction(onDisconnect)}
                className="border-border gap-2 rounded-full text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
              >
                <Power className="size-3.5" />
                <span>{t("whatsapp.disconnect")}</span>
              </Button>
            )}

            {(device.status === "DISCONNECTED" ||
              device.status === "PAIRING") &&
              onScanQR && (
                <Button
                  variant="primaryPill"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onScanQR(device);
                  }}
                  className="gap-2 text-xs font-bold"
                >
                  <QrCode className="size-3.5" />
                  <span>{t("whatsapp.scanQr")}</span>
                </Button>
              )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-border text-xs font-bold"
          >
            {t("whatsapp.btnClose") || "Tutup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
