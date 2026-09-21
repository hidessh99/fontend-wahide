"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Smartphone,
  Building2,
  Send,
  Loader2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Bot,
  HelpCircle,
  Image as ImageIcon,
  MapPin,
  MessageSquare,
  Paperclip,
  Upload,
  X,
  FileText,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CountryCodeSelector } from "@/modules/whatsapp/components/shared/CountryCodeSelector";
import {
  CountryCodeItem,
  DEFAULT_COUNTRY,
  detectCountryFromPhone,
} from "@/lib/countryCodes";
import { isValidE164 } from "@/lib/phone";
import { useI18n } from "@/lib/i18n/context";
import { whatsappApi } from "@/modules/whatsapp/api/whatsapp.api";
import { wabaApi } from "@/modules/whatsapp/api/waba.api";
import { telegramApi } from "@/modules/telegram/api/telegram.api";
import {
  OmnichannelChannelType,
  UnifiedSender,
  OmnichannelActiveCounts,
} from "../types/omnichannel.types";
import { ChannelSwitcherPills } from "./ChannelSwitcherPills";

interface OmnichannelComposerProps {
  selectedChannel: OmnichannelChannelType;
  onChannelChange: (channel: OmnichannelChannelType) => void;
  sendersByChannel: Record<OmnichannelChannelType, UnifiedSender[]>;
  activeCounts: OmnichannelActiveCounts;
  isLoadingSenders: boolean;
  onMessageChange: (text: string) => void;
  onRecipientChange: (recipient: string) => void;
  onSenderChange: (name: string, identifier?: string) => void;
  onMessageTypeChange: (
    type: "chat" | "image" | "file" | "location" | "photo" | "document",
  ) => void;
  onMediaUrlChange: (url: string) => void;
  onFileNameChange: (name: string) => void;
  onLocationChange: (loc: string) => void;
  onWabaModeChange?: (mode: "session_text" | "template_hsm") => void;
  onTemplateNameChange?: (name: string) => void;
  onTemplateParamsChange?: (params: Record<string, string>) => void;
  onTelegramParseModeChange?: (mode: "HTML" | "MarkdownV2" | "Markdown") => void;
  onTelegramSilentChange?: (silent: boolean) => void;
  onSuccess?: () => void;
}

export function OmnichannelComposer({
  selectedChannel,
  onChannelChange,
  sendersByChannel,
  activeCounts,
  isLoadingSenders,
  onMessageChange,
  onRecipientChange,
  onSenderChange,
  onMessageTypeChange,
  onMediaUrlChange,
  onFileNameChange,
  onLocationChange,
  onWabaModeChange,
  onTemplateNameChange,
  onTemplateParamsChange,
  onTelegramParseModeChange,
  onTelegramSilentChange,
  onSuccess,
}: OmnichannelComposerProps) {
  const { t } = useI18n();
  // Selected Sender ID for current channel
  const [selectedSenderId, setSelectedSenderId] = useState<string>("");

  // Recipient state
  const [recipientNumber, setRecipientNumber] = useState<string>("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [telegramChatId, setTelegramChatId] = useState<string>("");

  // Message body & attachments
  const [messageText, setMessageText] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [locationAddress, setLocationAddress] = useState<string>("");
  const [messageType, setMessageType] = useState<
    "chat" | "image" | "file" | "location" | "photo" | "document"
  >("chat");
  const [mediaInputMode, setMediaInputMode] = useState<"upload" | "url">("upload");
  const [selectedLocalFile, setSelectedLocalFile] = useState<File | null>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // WhatsApp Web specific
  const [simulateTyping, setSimulateTyping] = useState<boolean>(true);
  const [parseSpintax, setParseSpintax] = useState<boolean>(true);

  // WABA specific
  const [wabaMode, setWabaMode] = useState<"session_text" | "template_hsm">(
    "session_text",
  );
  const [templateName, setTemplateName] = useState<string>("order_confirmation");
  const [templateParam1, setTemplateParam1] = useState<string>("Budi");
  const [templateParam2, setTemplateParam2] = useState<string>("INV-2026-001");

  // Telegram specific
  const [telegramParseMode, setTelegramParseMode] = useState<
    "HTML" | "MarkdownV2" | "Markdown"
  >("HTML");
  const [telegramSilent, setTelegramSilent] = useState<boolean>(false);
  const [telegramDisablePreview, setTelegramDisablePreview] =
    useState<boolean>(false);

  // Submission state
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentSenders = useMemo(() => {
    return sendersByChannel[selectedChannel] || [];
  }, [sendersByChannel, selectedChannel]);
  const hasActiveSender = currentSenders.length > 0;

  // Auto-select first active sender when channel changes
  useEffect(() => {
    if (currentSenders.length > 0) {
      const first = currentSenders[0];
      setSelectedSenderId(first.id);
      onSenderChange(first.displayName, first.identifier);
    } else {
      setSelectedSenderId("");
      onSenderChange("", "");
    }
  }, [selectedChannel, currentSenders, onSenderChange]);

  const handleSenderSelect = (id: string) => {
    setSelectedSenderId(id);
    const s = currentSenders.find((item) => item.id === id);
    if (s) {
      onSenderChange(s.displayName, s.identifier);
    } else {
      onSenderChange("", "");
    }
  };

  const handleCountrySelect = (country: CountryCodeItem) => {
    setSelectedCountry(country);
    const full = recipientNumber.trim()
      ? `${country.dialCode}${recipientNumber.trim()}`
      : "";
    onRecipientChange(full);
  };

  const handlePhoneInput = (val: string) => {
    if (val.trim().startsWith("+") || val.trim().startsWith("00")) {
      const detected = detectCountryFromPhone(val);
      if (detected.country) {
        setSelectedCountry(detected.country);
        setRecipientNumber(detected.subscriberNumber);
        const full = detected.subscriberNumber
          ? `${detected.country.dialCode}${detected.subscriberNumber}`
          : "";
        onRecipientChange(full);
        return;
      }
    }

    let clean = val.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = clean.slice(1);
    if (
      clean.startsWith(selectedCountry.dialCode) &&
      clean.length > selectedCountry.dialCode.length + 6
    ) {
      clean = clean.slice(selectedCountry.dialCode.length);
    }

    setRecipientNumber(clean);
    const full = clean ? `${selectedCountry.dialCode}${clean}` : "";
    onRecipientChange(full);
  };

  const handleTelegramChatIdChange = (val: string) => {
    setTelegramChatId(val);
    onRecipientChange(val);
  };

  const handleTextChange = (val: string) => {
    setMessageText(val);
    onMessageChange(val);
  };

  const handleTypeSwitch = (
    type: "chat" | "image" | "file" | "location" | "photo" | "document",
  ) => {
    setMessageType(type);
    onMessageTypeChange(type);
  };

  const processSelectedFile = async (file: File) => {
    setSelectedLocalFile(file);
    const localUrl = URL.createObjectURL(file);
    setMediaUrl(localUrl);
    onMediaUrlChange(localUrl);

    if (messageType === "file" || messageType === "document") {
      setFileName(file.name);
      onFileNameChange(file.name);
    }

    setIsUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      let uploadedUrl = "";
      try {
        const res = await httpClient.post<Record<string, unknown>>(
          `${env.NEXT_PUBLIC_WHATSAPP_API_URL}/support/tickets/upload`,
          formData,
        );
        const raw = res.payload || (res as unknown as Record<string, unknown>);
        uploadedUrl = String(raw.url || raw.public_url || "");
      } catch {
        const res = await httpClient.post<Record<string, unknown>>(
          `${env.NEXT_PUBLIC_WHATSAPP_API_URL}/api/upload`,
          formData,
        );
        const raw = res.payload || (res as unknown as Record<string, unknown>);
        uploadedUrl = String(raw.url || raw.public_url || "");
      }

      if (uploadedUrl) {
        setMediaUrl(uploadedUrl);
        onMediaUrlChange(uploadedUrl);
        toast.success(`${file.name} berhasil diunggah.`);
      }
    } catch {
      console.warn("Upload fallback: using local object preview.");
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSelectedFile(file);
    }
  };

  const handleRemoveMedia = () => {
    setSelectedLocalFile(null);
    setMediaUrl("");
    onMediaUrlChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGetCurrentLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Browser tidak mendukung geolokasi GPS.");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGettingLocation(false);
        const coord = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`;
        setLocationAddress(coord);
        onLocationChange(coord);
        toast.success("Koordinat GPS berhasil diperoleh: " + coord);
      },
      (err) => {
        setIsGettingLocation(false);
        toast.error("Gagal mendeteksi lokasi GPS: " + err.message);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  const insertSpintax = (sample: string) => {
    const updated = messageText ? `${messageText} ${sample}` : sample;
    setMessageText(updated);
    onMessageChange(updated);
  };

  // Dispatch message handler
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedSenderId) {
      setErrorMessage("Silakan pilih saluran pengirim terlebih dahulu.");
      return;
    }

    setIsSending(true);

    try {
      if (selectedChannel === "WHATSMEOW_UNOFFICIAL") {
        if (!recipientNumber.trim()) {
          throw new Error(t("omnichannel.composer.errRecipientRequired"));
        }
        const fullPhone = `${selectedCountry.dialCode}${recipientNumber.trim()}`;
        if (!isValidE164(fullPhone)) {
          throw new Error(
            t("whatsapp.messagesErrInvalidPhone") || "Format nomor tujuan tidak valid.",
          );
        }

        if (messageType === "chat" && !messageText.trim()) {
          throw new Error(t("omnichannel.composer.errMessageRequired"));
        }
        if (messageType === "image" && !mediaUrl.trim()) {
          throw new Error(t("whatsapp.messagesErrImageUrlRequired") || "URL gambar wajib diisi.");
        }
        if (messageType === "file" && !mediaUrl.trim()) {
          throw new Error(t("whatsapp.messagesErrFileUrlRequired") || "URL berkas wajib diisi.");
        }

        const payload = {
          device_id: selectedSenderId,
          phone: fullPhone,
          message:
            messageType === "location"
              ? `📍 Lokasi: ${locationAddress.trim()}\n${messageText.trim()}`
              : messageText.trim(),
          media_url:
            messageType === "image" || messageType === "file"
              ? mediaUrl.trim()
              : undefined,
          file_name:
            messageType === "file"
              ? fileName.trim() || "document.pdf"
              : undefined,
          simulate_typing: simulateTyping,
          parse_spintax: parseSpintax,
        };

        await whatsappApi.sendMessage(payload);
        toast.success(t("omnichannel.composer.toastSuccess", { channel: "WhatsApp Web" }));
      } else if (selectedChannel === "META_WABA_OFFICIAL") {
        if (!recipientNumber.trim()) {
          throw new Error(t("omnichannel.composer.errRecipientRequired"));
        }
        const fullPhone = `${selectedCountry.dialCode}${recipientNumber.trim()}`;
        if (!isValidE164(fullPhone)) {
          throw new Error(t("whatsapp.messagesErrInvalidPhone") || "Format nomor tujuan tidak valid.");
        }

        if (wabaMode === "session_text" && !messageText.trim()) {
          throw new Error(t("omnichannel.composer.errMessageRequired"));
        }

        await wabaApi.sendMessage({
          device_id: selectedSenderId,
          phone: fullPhone,
          message:
            wabaMode === "session_text"
              ? messageText.trim()
              : `[Meta Template: ${templateName}]`,
          media_url: mediaUrl.trim() || undefined,
          template_name:
            wabaMode === "template_hsm" ? templateName : undefined,
          template_params:
            wabaMode === "template_hsm"
              ? { "1": templateParam1, "2": templateParam2 }
              : undefined,
        });

        toast.success(t("omnichannel.composer.toastSuccess", { channel: "Meta WABA" }));
      } else if (selectedChannel === "TELEGRAM_BOT") {
        if (!telegramChatId.trim()) {
          throw new Error(t("omnichannel.composer.errRecipientRequired"));
        }
        const numericChatId = parseInt(telegramChatId.trim(), 10);
        if (isNaN(numericChatId)) {
          throw new Error(
            "Chat ID harus berupa angka numerik (contoh: 123456789).",
          );
        }

        if (messageType === "chat" && !messageText.trim()) {
          throw new Error(t("omnichannel.composer.errMessageRequired"));
        }

        await telegramApi.sendMessage({
          bot_id: selectedSenderId,
          chat_id: numericChatId,
          text: messageText.trim(),
          parse_mode: telegramParseMode,
          media_url: mediaUrl.trim() || undefined,
          media_type:
            messageType === "image" || messageType === "photo"
              ? "PHOTO"
              : messageType === "file" || messageType === "document"
                ? "DOCUMENT"
                : undefined,
          caption: messageText.trim() || undefined,
          disable_notification: telegramSilent,
          disable_web_page_preview: telegramDisablePreview,
        });

        toast.success(t("omnichannel.composer.toastSuccess", { channel: "Telegram Bot" }));
      }

      // Reset fields upon success
      setMessageText("");
      onMessageChange("");
      setMediaUrl("");
      onMediaUrlChange("");
      setFileName("");
      onFileNameChange("");
      setLocationAddress("");
      onLocationChange("");

      onSuccess?.();
    } catch (err: unknown) {
      const rawMsg =
        err instanceof Error ? err.message : t("common.genericError");

      const isChatNotFound =
        rawMsg.toLowerCase().includes("chat not found") ||
        rawMsg.toLowerCase().includes("belum menekan start") ||
        rawMsg.toLowerCase().includes("telegram_chat_not_found") ||
        rawMsg.toLowerCase().includes("telegram_bot_blocked") ||
        rawMsg.toLowerCase().includes("bot was blocked");

      let userMsg = rawMsg;
      if (selectedChannel === "TELEGRAM_BOT" && isChatNotFound) {
        const botName = selectedSender?.identifier || "bot Telegram ini";
        userMsg = t("omnichannel.composer.teleErrNotStarted", { bot: botName });
      }

      setErrorMessage(userMsg);
      toast.error(userMsg, {
        duration: 7000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectedSender = currentSenders.find(
    (s) => s.id === selectedSenderId,
  );

  return (
    <div className="border-border bg-surface rounded-2xl border p-5 shadow-xs sm:rounded-3xl sm:p-7 space-y-6">
      {/* Header & Channel Switcher */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>Kirim Pesan Omnichannel</span>
            <Sparkles className="size-4 text-wise-green" />
          </h2>
          <p className="text-xs sm:text-sm text-foreground-secondary font-medium">
            Pilih saluran pengiriman, tentukan penerima, dan sesuaikan parameter
            pesan dengan live preview instan.
          </p>
        </div>

        {/* Channel Selector Pills */}
        <div className="pt-1">
          <ChannelSwitcherPills
            selectedChannel={selectedChannel}
            onSelectChannel={(ch) => {
              if (ch !== "ALL") {
                onChannelChange(ch);
              }
            }}
            counts={activeCounts}
            size="md"
          />
        </div>
      </div>

      {/* No active sender warning banner */}
      {!hasActiveSender && !isLoadingSenders && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-xs text-foreground space-y-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
              {selectedChannel === "WHATSMEOW_UNOFFICIAL" && (
                <Smartphone className="size-4.5" />
              )}
              {selectedChannel === "META_WABA_OFFICIAL" && (
                <Building2 className="size-4.5" />
              )}
              {selectedChannel === "TELEGRAM_BOT" && (
                <Bot className="size-4.5" />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">
                {selectedChannel === "WHATSMEOW_UNOFFICIAL" &&
                  "Belum Ada Perangkat WhatsApp Web Terhubung"}
                {selectedChannel === "META_WABA_OFFICIAL" &&
                  "Belum Ada Nomor Meta WABA Aktif"}
                {selectedChannel === "TELEGRAM_BOT" &&
                  "Belum Ada Bot Telegram Aktif"}
              </h4>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {selectedChannel === "WHATSMEOW_UNOFFICIAL" &&
                  "Sambungkan perangkat WhatsApp fisik Anda via scan QR atau kode pairing untuk mulai mengirim pesan."}
                {selectedChannel === "META_WABA_OFFICIAL" &&
                  "Hubungkan akun Meta WhatsApp Business Cloud API Anda atau daftarkan nomor melalui Meta Embedded Signup."}
                {selectedChannel === "TELEGRAM_BOT" &&
                  "Daftarkan bot Telegram Anda menggunakan token BotFather untuk mulai mengoperasikan bot pesan."}
              </p>
            </div>
          </div>
          <div className="pl-12">
            <Link
              href={
                selectedChannel === "WHATSMEOW_UNOFFICIAL"
                  ? "/wa/devices"
                  : selectedChannel === "META_WABA_OFFICIAL"
                    ? "/waba/devices"
                    : "/tele/devices"
              }
            >
              <Button
                type="button"
                variant="primaryPill"
                size="sm"
                className="gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>
                  {selectedChannel === "WHATSMEOW_UNOFFICIAL"
                    ? "Tautkan Perangkat WhatsApp"
                    : selectedChannel === "META_WABA_OFFICIAL"
                      ? "Kelola Akun WABA"
                      : "Tambah Bot Telegram"}
                </span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="flex flex-col gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-700 dark:text-rose-400 animate-fadeIn">
          <div className="flex items-start gap-2.5 font-medium">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
          {selectedChannel === "TELEGRAM_BOT" &&
            selectedSender &&
            (errorMessage.includes("START") ||
              errorMessage.toLowerCase().includes("chat not found")) && (
              <div className="pl-6.5 pt-1">
                <a
                  href={`https://t.me/${selectedSender.identifier.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs"
                >
                  <Send className="size-3.5" />
                  <span>
                    Buka {selectedSender.identifier} & Tekan START ↗
                  </span>
                </a>
              </div>
            )}
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSend} className="space-y-5">
        {/* SENDER SELECTOR */}
        <div className="space-y-1.5">
          <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("omnichannel.composer.selectSender")}
          </Label>

          <div className="relative">
            <NativeSelect
              value={selectedSenderId}
              onChange={(e) => handleSenderSelect(e.target.value)}
              disabled={isLoadingSenders || isSending || !hasActiveSender}
              variant="rounded"
              wrapperClassName="w-full"
              className="pl-10 text-xs sm:text-sm font-semibold h-11"
            >
              {currentSenders.length === 0 ? (
                <option value="" disabled>
                  {isLoadingSenders
                    ? t("omnichannel.composer.loadingSenders")
                    : selectedChannel === "WHATSMEOW_UNOFFICIAL"
                      ? t("omnichannel.composer.noSendersWa")
                      : selectedChannel === "META_WABA_OFFICIAL"
                        ? t("omnichannel.composer.noSendersWaba")
                        : t("omnichannel.composer.noSendersTele")}
                </option>
              ) : (
                <>
                  <option value="" disabled>
                    -- {t("omnichannel.composer.selectSender")} --
                  </option>
                  {currentSenders.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.displayName} ({s.identifier}){" "}
                      {s.badgeText ? `• ${s.badgeText}` : ""}
                    </option>
                  ))}
                </>
              )}
            </NativeSelect>

            <div className="absolute left-3.5 top-3.5 pointer-events-none z-10 text-foreground-muted">
              {selectedChannel === "WHATSMEOW_UNOFFICIAL" && (
                <Smartphone className="size-4" />
              )}
              {selectedChannel === "META_WABA_OFFICIAL" && (
                <Building2 className="size-4" />
              )}
              {selectedChannel === "TELEGRAM_BOT" && (
                <Bot className="size-4" />
              )}
            </div>
          </div>

          {/* Active Sender Badge Details */}
          {selectedSender && (
            <div className="flex items-center gap-2 pt-1 text-[11px] text-foreground-secondary font-medium">
              <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {t("common.active")}: <strong>{selectedSender.displayName}</strong>
              </span>
              <span className="text-muted-foreground">•</span>
              <span>{selectedSender.identifier}</span>
              {selectedSender.qualityRating && (
                <Badge
                  variant="outline"
                  className="text-[9px] py-0 px-1 font-bold text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                >
                  Quality: {selectedSender.qualityRating}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* RECIPIENT INPUT */}
        <div className="space-y-1.5">
          <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {selectedChannel === "TELEGRAM_BOT"
              ? "Telegram Chat ID"
              : t("omnichannel.composer.recipient")}
          </Label>

          {selectedChannel === "TELEGRAM_BOT" ? (
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("omnichannel.composer.recipientTelePlaceholder")}
                  value={telegramChatId}
                  onChange={(e) => handleTelegramChatIdChange(e.target.value)}
                  disabled={isSending}
                  className="h-11 rounded-full pl-10 text-xs sm:text-sm font-semibold"
                />
                <Bot className="absolute left-3.5 top-3.5 size-4 text-foreground-muted pointer-events-none" />
              </div>

              {/* Bot START Action Button & Guide */}
              {selectedSender?.identifier && (
                <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-3 sm:p-3.5 space-y-2.5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400">
                        <Bot className="size-4" />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        Izin Chat Telegram Bot
                      </span>
                    </div>

                    <a
                      href={`https://t.me/${selectedSender.identifier.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer group"
                    >
                      <Send className="size-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      <span>
                        {t("omnichannel.composer.teleStartButton", {
                          bot: selectedSender.identifier,
                        })}
                      </span>
                      <ExternalLink className="size-3 opacity-80" />
                    </a>
                  </div>

                  <p className="text-[11px] text-foreground-secondary leading-relaxed flex items-start gap-1.5">
                    <HelpCircle className="size-3.5 text-sky-500 shrink-0 mt-0.5" />
                    <span>
                      {t("omnichannel.composer.teleStartHint")} Chat ID dapat dilihat dengan membuka bot{" "}
                      <a
                        href="https://t.me/userinfobot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sky-600 hover:underline dark:text-sky-400"
                      >
                        @userinfobot
                      </a>.
                    </span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <CountryCodeSelector
                  selectedCountry={selectedCountry}
                  onSelectCountry={handleCountrySelect}
                  disabled={isSending}
                />
                <Input
                  type="tel"
                  placeholder={t("omnichannel.composer.recipientWaPlaceholder")}
                  value={recipientNumber}
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  disabled={isSending}
                  className="h-11 rounded-full text-xs sm:text-sm font-semibold flex-1"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {t("omnichannel.composer.recipientHint")}
              </p>
            </div>
          )}
        </div>

        {/* WABA MODE SELECTOR (If WABA) */}
        {selectedChannel === "META_WABA_OFFICIAL" && (
          <div className="space-y-2 rounded-2xl bg-muted/40 p-4 border border-border/70">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider block">
              Mode Pesan Meta WABA
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setWabaMode("session_text");
                  onWabaModeChange?.("session_text");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                  wabaMode === "session_text"
                    ? "bg-surface border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "bg-transparent border-transparent text-foreground-secondary hover:bg-muted"
                }`}
              >
                Pesan Bebas Sesi 24J
              </button>
              <button
                type="button"
                onClick={() => {
                  setWabaMode("template_hsm");
                  onWabaModeChange?.("template_hsm");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer ${
                  wabaMode === "template_hsm"
                    ? "bg-surface border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "bg-transparent border-transparent text-foreground-secondary hover:bg-muted"
                }`}
              >
                Template Resmi (HSM)
              </button>
            </div>

            {wabaMode === "template_hsm" && (
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold text-foreground-secondary">
                    Nama Template Disetujui
                  </Label>
                  <NativeSelect
                    value={templateName}
                    onChange={(e) => {
                      setTemplateName(e.target.value);
                      onTemplateNameChange?.(e.target.value);
                    }}
                    variant="rounded"
                    className="h-9 text-xs"
                  >
                    <option value="order_confirmation">
                      order_confirmation (UTILITY)
                    </option>
                    <option value="payment_receipt">
                      payment_receipt (UTILITY)
                    </option>
                    <option value="promo_announcement">
                      promo_announcement (MARKETING)
                    </option>
                  </NativeSelect>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-foreground-secondary">
                      Variabel `{"{{1}}"}`
                    </Label>
                    <Input
                      value={templateParam1}
                      onChange={(e) => {
                        setTemplateParam1(e.target.value);
                        onTemplateParamsChange?.({
                          "1": e.target.value,
                          "2": templateParam2,
                        });
                      }}
                      placeholder="Nama Pelanggan"
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-foreground-secondary">
                      Variabel `{"{{2}}"}`
                    </Label>
                    <Input
                      value={templateParam2}
                      onChange={(e) => {
                        setTemplateParam2(e.target.value);
                        onTemplateParamsChange?.({
                          "1": templateParam1,
                          "2": e.target.value,
                        });
                      }}
                      placeholder="No. Invoice"
                      className="h-9 text-xs rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TELEGRAM PARSE MODE & OPTIONS (If Telegram) */}
        {selectedChannel === "TELEGRAM_BOT" && (
          <div className="space-y-3 rounded-2xl bg-muted/40 p-4 border border-border/70">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Parse Mode Telegram
              </Label>
              <div className="flex gap-1">
                {(["HTML", "MarkdownV2", "Markdown"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setTelegramParseMode(mode);
                      onTelegramParseModeChange?.(mode);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                      telegramParseMode === mode
                        ? "bg-surface border-sky-500 text-sky-600 dark:text-sky-400 shadow-xs"
                        : "border-transparent text-foreground-secondary hover:bg-muted"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegramSilent}
                  onChange={(e) => {
                    setTelegramSilent(e.target.checked);
                    onTelegramSilentChange?.(e.target.checked);
                  }}
                  className="rounded border-border accent-wise-green size-4"
                />
                <span>Kirim Senyap (Silent)</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={telegramDisablePreview}
                  onChange={(e) => setTelegramDisablePreview(e.target.checked)}
                  className="rounded border-border accent-wise-green size-4"
                />
                <span>Nonaktifkan Link Preview</span>
              </label>
            </div>
          </div>
        )}

        {/* MESSAGE TYPE TABS (Text / Image / File / Location) */}
        {wabaMode !== "template_hsm" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground-secondary text-xs font-semibold tracking-wider uppercase">
                Tipe Pesan & Lampiran
              </Label>
              {messageType !== "chat" && (
                <span className="text-[11px] font-bold text-wise-green dark:text-wise-green flex items-center gap-1">
                  ● Mode Lampiran Aktif
                </span>
              )}
            </div>

            {/* High-visibility Tab Buttons */}
            <div className="grid grid-cols-4 gap-2 p-1.5 rounded-2xl bg-muted/70 dark:bg-muted/40 border border-border text-xs font-bold">
              {/* Tab: Teks */}
              <button
                type="button"
                onClick={() => handleTypeSwitch("chat")}
                className={cn(
                  "py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none",
                  messageType === "chat"
                    ? "bg-wise-green text-dark-green font-black shadow-sm ring-2 ring-wise-green/60 scale-[1.02]"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface/70 active:scale-95",
                )}
              >
                <MessageSquare
                  className={cn(
                    "size-4",
                    messageType === "chat"
                      ? "text-dark-green stroke-[2.5]"
                      : "text-foreground-muted",
                  )}
                />
                <span>{t("omnichannel.composer.typeText")}</span>
              </button>

              {/* Tab: Gambar */}
              <button
                type="button"
                onClick={() => handleTypeSwitch("image")}
                className={cn(
                  "py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none",
                  messageType === "image" || messageType === "photo"
                    ? "bg-wise-green text-dark-green font-black shadow-sm ring-2 ring-wise-green/60 scale-[1.02]"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface/70 active:scale-95",
                )}
              >
                <ImageIcon
                  className={cn(
                    "size-4",
                    messageType === "image" || messageType === "photo"
                      ? "text-dark-green stroke-[2.5]"
                      : "text-foreground-muted",
                  )}
                />
                <span>{t("omnichannel.composer.typeImage")}</span>
              </button>

              {/* Tab: Dokumen */}
              <button
                type="button"
                onClick={() => handleTypeSwitch("file")}
                className={cn(
                  "py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none",
                  messageType === "file" || messageType === "document"
                    ? "bg-wise-green text-dark-green font-black shadow-sm ring-2 ring-wise-green/60 scale-[1.02]"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface/70 active:scale-95",
                )}
              >
                <Paperclip
                  className={cn(
                    "size-4",
                    messageType === "file" || messageType === "document"
                      ? "text-dark-green stroke-[2.5]"
                      : "text-foreground-muted",
                  )}
                />
                <span>{t("omnichannel.composer.typeFile")}</span>
              </button>

              {/* Tab: Lokasi */}
              <button
                type="button"
                onClick={() => handleTypeSwitch("location")}
                disabled={selectedChannel === "TELEGRAM_BOT"}
                className={cn(
                  "py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed",
                  messageType === "location"
                    ? "bg-wise-green text-dark-green font-black shadow-sm ring-2 ring-wise-green/60 scale-[1.02]"
                    : "text-foreground-secondary hover:text-foreground hover:bg-surface/70 active:scale-95",
                )}
              >
                <MapPin
                  className={cn(
                    "size-4",
                    messageType === "location"
                      ? "text-dark-green stroke-[2.5]"
                      : "text-foreground-muted",
                  )}
                />
                <span>{t("omnichannel.composer.typeLocation")}</span>
              </button>
            </div>

            {/* ATTACHMENT PANEL: IMAGE */}
            {(messageType === "image" || messageType === "photo") && (
              <div className="rounded-2xl border-2 border-wise-green/50 dark:border-wise-green/40 bg-wise-green/5 dark:bg-wise-green/10 p-4 space-y-3 transition-all animate-in fade-in-50 duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wise-green/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-wise-green text-dark-green shadow-xs">
                      <ImageIcon className="size-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {t("omnichannel.composer.panelImageTitle")}
                      </h4>
                      <p className="text-[10px] text-foreground-secondary">
                        {t("omnichannel.composer.dropzoneImageHint")}
                      </p>
                    </div>
                  </div>

                  {/* Upload vs URL Switcher */}
                  <div className="flex items-center p-0.5 rounded-lg bg-surface border border-border text-[11px] font-medium shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setMediaInputMode("upload")}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                        mediaInputMode === "upload"
                          ? "bg-wise-green text-dark-green font-bold shadow-2xs"
                          : "text-foreground-secondary hover:text-foreground",
                      )}
                    >
                      {t("omnichannel.composer.uploadTabFile")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaInputMode("url")}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                        mediaInputMode === "url"
                          ? "bg-wise-green text-dark-green font-bold shadow-2xs"
                          : "text-foreground-secondary hover:text-foreground",
                      )}
                    >
                      {t("omnichannel.composer.uploadTabUrl")}
                    </button>
                  </div>
                </div>

                {mediaInputMode === "upload" ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {mediaUrl ? (
                      /* Image Preview Card */
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border shadow-xs">
                        <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-border bg-black/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={mediaUrl}
                            alt="Preview Foto"
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {selectedLocalFile?.name || "image.jpg"}
                          </p>
                          <p className="text-[10px] text-foreground-secondary">
                            {selectedLocalFile
                              ? `${(selectedLocalFile.size / 1024).toFixed(1)} KB`
                              : "Tautan gambar aktif"}
                          </p>
                          {isUploadingMedia && (
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                              <Loader2 className="size-3 animate-spin" />
                              {t("omnichannel.composer.uploadingMedia")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs h-8 px-2.5 rounded-lg font-semibold cursor-pointer"
                          >
                            {t("omnichannel.composer.changeFile")}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveMedia}
                            className="text-xs h-8 px-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                            title={t("omnichannel.composer.removeFile")}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Dropzone */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center",
                          isDragging
                            ? "border-wise-green bg-wise-green/15 scale-[1.01]"
                            : "border-border hover:border-wise-green/60 bg-surface/60 hover:bg-surface",
                        )}
                      >
                        <div className="flex size-10 items-center justify-center rounded-full bg-wise-green/20 text-emerald-700 dark:text-wise-green shadow-xs">
                          <Upload className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {t("omnichannel.composer.dropzoneImage")}
                          </p>
                          <p className="text-[10px] text-foreground-secondary mt-0.5">
                            {t("omnichannel.composer.dropzoneImageHint")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* URL Mode */
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground-secondary">
                      {t("omnichannel.composer.imageUrl")}
                    </Label>
                    <Input
                      type="url"
                      placeholder={t("omnichannel.composer.imageUrlPlaceholder")}
                      value={mediaUrl}
                      onChange={(e) => {
                        setMediaUrl(e.target.value);
                        onMediaUrlChange(e.target.value);
                      }}
                      className="h-10 text-xs rounded-xl bg-surface"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ATTACHMENT PANEL: FILE / DOCUMENT */}
            {(messageType === "file" || messageType === "document") && (
              <div className="rounded-2xl border-2 border-wise-green/50 dark:border-wise-green/40 bg-wise-green/5 dark:bg-wise-green/10 p-4 space-y-3 transition-all animate-in fade-in-50 duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wise-green/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-wise-green text-dark-green shadow-xs">
                      <Paperclip className="size-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {t("omnichannel.composer.panelFileTitle")}
                      </h4>
                      <p className="text-[10px] text-foreground-secondary">
                        {t("omnichannel.composer.dropzoneFileHint")}
                      </p>
                    </div>
                  </div>

                  {/* Upload vs URL Switcher */}
                  <div className="flex items-center p-0.5 rounded-lg bg-surface border border-border text-[11px] font-medium shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setMediaInputMode("upload")}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                        mediaInputMode === "upload"
                          ? "bg-wise-green text-dark-green font-bold shadow-2xs"
                          : "text-foreground-secondary hover:text-foreground",
                      )}
                    >
                      {t("omnichannel.composer.uploadTabFile")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaInputMode("url")}
                      className={cn(
                        "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                        mediaInputMode === "url"
                          ? "bg-wise-green text-dark-green font-bold shadow-2xs"
                          : "text-foreground-secondary hover:text-foreground",
                      )}
                    >
                      {t("omnichannel.composer.uploadTabUrl")}
                    </button>
                  </div>
                </div>

                {mediaInputMode === "upload" ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    {selectedLocalFile || mediaUrl ? (
                      /* Document Preview Card */
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border shadow-xs">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                          <FileText className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">
                            {fileName || selectedLocalFile?.name || "document.pdf"}
                          </p>
                          <p className="text-[10px] text-foreground-secondary">
                            {selectedLocalFile
                              ? `${(selectedLocalFile.size / 1024).toFixed(1)} KB • Dokumen Siap Kirim`
                              : "Berkas Lampiran Siap Kirim"}
                          </p>
                          {isUploadingMedia && (
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                              <Loader2 className="size-3 animate-spin" />
                              {t("omnichannel.composer.uploadingMedia")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs h-8 px-2.5 rounded-lg font-semibold cursor-pointer"
                          >
                            {t("omnichannel.composer.changeFile")}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveMedia}
                            className="text-xs h-8 px-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                            title={t("omnichannel.composer.removeFile")}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Dropzone */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                          "flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center",
                          isDragging
                            ? "border-wise-green bg-wise-green/15 scale-[1.01]"
                            : "border-border hover:border-wise-green/60 bg-surface/60 hover:bg-surface",
                        )}
                      >
                        <div className="flex size-10 items-center justify-center rounded-full bg-wise-green/20 text-emerald-700 dark:text-wise-green shadow-xs">
                          <Upload className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {t("omnichannel.composer.dropzoneFile")}
                          </p>
                          <p className="text-[10px] text-foreground-secondary mt-0.5">
                            {t("omnichannel.composer.dropzoneFileHint")}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Editable display name for file */}
                    <div className="space-y-1.5 pt-1">
                      <Label className="text-xs font-semibold text-foreground-secondary">
                        {t("omnichannel.composer.fileName")}
                      </Label>
                      <Input
                        type="text"
                        placeholder={t("omnichannel.composer.fileNamePlaceholder")}
                        value={fileName}
                        onChange={(e) => {
                          setFileName(e.target.value);
                          onFileNameChange(e.target.value);
                        }}
                        className="h-10 text-xs rounded-xl bg-surface"
                      />
                    </div>
                  </div>
                ) : (
                  /* URL Mode */
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground-secondary">
                        {t("omnichannel.composer.fileUrl")}
                      </Label>
                      <Input
                        type="url"
                        placeholder={t("omnichannel.composer.fileUrlPlaceholder")}
                        value={mediaUrl}
                        onChange={(e) => {
                          setMediaUrl(e.target.value);
                          onMediaUrlChange(e.target.value);
                        }}
                        className="h-10 text-xs rounded-xl bg-surface"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground-secondary">
                        {t("omnichannel.composer.fileName")}
                      </Label>
                      <Input
                        type="text"
                        placeholder={t("omnichannel.composer.fileNamePlaceholder")}
                        value={fileName}
                        onChange={(e) => {
                          setFileName(e.target.value);
                          onFileNameChange(e.target.value);
                        }}
                        className="h-10 text-xs rounded-xl bg-surface"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ATTACHMENT PANEL: LOCATION */}
            {messageType === "location" && (
              <div className="rounded-2xl border-2 border-wise-green/50 dark:border-wise-green/40 bg-wise-green/5 dark:bg-wise-green/10 p-4 space-y-3 transition-all animate-in fade-in-50 duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wise-green/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500 text-white shadow-xs">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {t("omnichannel.composer.panelLocationTitle")}
                      </h4>
                      <p className="text-[10px] text-foreground-secondary">
                        Kirim pin lokasi GPS langsung ke obrolan
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isGettingLocation}
                    onClick={handleGetCurrentLocation}
                    className="text-[11px] h-8 px-2.5 rounded-lg border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Navigation className="size-3.5" />
                    )}
                    <span>
                      {isGettingLocation
                        ? t("omnichannel.composer.gettingLocation")
                        : t("omnichannel.composer.useCurrentLocation")}
                    </span>
                  </Button>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground-secondary">
                    {t("omnichannel.composer.location")}
                  </Label>
                  <Input
                    type="text"
                    placeholder={t("omnichannel.composer.locationPlaceholder")}
                    value={locationAddress}
                    onChange={(e) => {
                      setLocationAddress(e.target.value);
                      onLocationChange(e.target.value);
                    }}
                    className="h-10 text-xs rounded-xl bg-surface"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* MESSAGE BODY TEXTAREA */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-foreground-secondary block text-xs font-semibold tracking-wider uppercase">
              {wabaMode === "template_hsm"
                ? t("omnichannel.composer.templateName")
                : t("omnichannel.composer.messageText")}
            </Label>
            {selectedChannel === "WHATSMEOW_UNOFFICIAL" && (
              <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted">
                <Sparkles className="size-3 text-wise-green" />
                <span>{t("omnichannel.composer.spintaxHelper")}:</span>
                <button
                  type="button"
                  onClick={() => insertSpintax("{Halo|Hai|Pagi}")}
                  className="rounded px-1.5 py-0.5 bg-muted hover:bg-muted/80 text-foreground font-semibold cursor-pointer"
                >
                  {"{Halo|Hai}"}
                </button>
              </div>
            )}
          </div>

          <Textarea
            rows={4}
            placeholder={
              selectedChannel === "TELEGRAM_BOT"
                ? "Ketik pesan HTML atau MarkdownV2 untuk Telegram..."
                : selectedChannel === "META_WABA_OFFICIAL" &&
                    wabaMode === "template_hsm"
                  ? "Pesan template mengikuti definisi Meta Cloud API..."
                  : t("omnichannel.composer.messagePlaceholder")
            }
            value={messageText}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={isSending}
            className="text-xs sm:text-sm font-medium resize-none rounded-2xl p-3.5 leading-relaxed"
          />
        </div>

        {/* WhatsApp Web Extra Options */}
        {selectedChannel === "WHATSMEOW_UNOFFICIAL" && (
          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground-secondary hover:text-foreground">
              <input
                type="checkbox"
                checked={simulateTyping}
                onChange={(e) => setSimulateTyping(e.target.checked)}
                className="rounded border-border accent-wise-green size-4"
              />
              <span>Simulasi Mengetik (Human-like Typing)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground-secondary hover:text-foreground">
              <input
                type="checkbox"
                checked={parseSpintax}
                onChange={(e) => setParseSpintax(e.target.checked)}
                className="rounded border-border accent-wise-green size-4"
              />
              <span>Parse Spintax {"{A|B}"}</span>
            </label>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          disabled={isSending || !hasActiveSender}
          variant="primaryPill"
          className="w-full h-11 text-xs sm:text-sm font-bold shadow-md cursor-pointer gap-2"
        >
          {isSending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{t("omnichannel.composer.sending")}</span>
            </>
          ) : (
            <>
              <Send className="size-4" />
              <span>
                {t("omnichannel.composer.sendBtn")}{" "}
                (
                {selectedChannel === "WHATSMEOW_UNOFFICIAL"
                  ? t("omnichannel.channels.waWeb")
                  : selectedChannel === "META_WABA_OFFICIAL"
                    ? t("omnichannel.channels.waba")
                    : t("omnichannel.channels.telegram")}
                )
              </span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
