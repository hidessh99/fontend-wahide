"use client";

import React, { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
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
          throw new Error("Nomor WhatsApp tujuan wajib diisi.");
        }
        const fullPhone = `${selectedCountry.dialCode}${recipientNumber.trim()}`;
        if (!isValidE164(fullPhone)) {
          throw new Error(
            "Format nomor tujuan tidak valid (harus standar E.164).",
          );
        }

        if (messageType === "chat" && !messageText.trim()) {
          throw new Error("Pesan teks tidak boleh kosong.");
        }
        if (messageType === "image" && !mediaUrl.trim()) {
          throw new Error("URL gambar wajib diisi.");
        }
        if (messageType === "file" && !mediaUrl.trim()) {
          throw new Error("URL dokumen berkas wajib diisi.");
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
        toast.success("Pesan WhatsApp Web berhasil dikirim!");
      } else if (selectedChannel === "META_WABA_OFFICIAL") {
        if (!recipientNumber.trim()) {
          throw new Error("Nomor tujuan WhatsApp resmi wajib diisi.");
        }
        const fullPhone = `${selectedCountry.dialCode}${recipientNumber.trim()}`;
        if (!isValidE164(fullPhone)) {
          throw new Error("Format nomor telepon tujuan tidak valid.");
        }

        if (wabaMode === "session_text" && !messageText.trim()) {
          throw new Error("Pesan sesi teks tidak boleh kosong.");
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

        toast.success("Pesan resmi Meta WABA berhasil dikirim!");
      } else if (selectedChannel === "TELEGRAM_BOT") {
        if (!telegramChatId.trim()) {
          throw new Error("Chat ID Telegram penerima wajib diisi.");
        }
        const numericChatId = parseInt(telegramChatId.trim(), 10);
        if (isNaN(numericChatId)) {
          throw new Error(
            "Chat ID harus berupa angka numerik (contoh: 123456789).",
          );
        }

        if (messageType === "chat" && !messageText.trim()) {
          throw new Error("Pesan teks bot Telegram tidak boleh kosong.");
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

        toast.success("Pesan Telegram Bot berhasil dikirim!");
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
      const msg =
        err instanceof Error ? err.message : "Gagal mengirimkan pesan.";
      setErrorMessage(msg);
      toast.error(msg);
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
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-700 dark:text-rose-400">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSend} className="space-y-5">
        {/* SENDER SELECTOR */}
        <div className="space-y-1.5">
          <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {selectedChannel === "WHATSMEOW_UNOFFICIAL" &&
              "Pilih Perangkat Pengirim (WhatsApp Web)"}
            {selectedChannel === "META_WABA_OFFICIAL" &&
              "Pilih Nomor Pengirim Resmi (Meta WABA)"}
            {selectedChannel === "TELEGRAM_BOT" &&
              "Pilih Bot Pengirim (Telegram)"}
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
                    ? "Memuat data pengirim..."
                    : "Tidak ada pengirim aktif pada saluran ini"}
                </option>
              ) : (
                <>
                  <option value="" disabled>
                    -- Pilih Pengirim --
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
                Aktif: <strong>{selectedSender.displayName}</strong>
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
              ? "Telegram Chat ID Penerima"
              : "Nomor Telepon Tujuan"}
          </Label>

          {selectedChannel === "TELEGRAM_BOT" ? (
            <div className="space-y-1.5">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Contoh: 123456789 atau -100123456789"
                  value={telegramChatId}
                  onChange={(e) => handleTelegramChatIdChange(e.target.value)}
                  disabled={isSending}
                  className="h-11 rounded-full pl-10 text-xs sm:text-sm font-semibold"
                />
                <Bot className="absolute left-3.5 top-3.5 size-4 text-foreground-muted pointer-events-none" />
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <HelpCircle className="size-3 text-sky-500" />
                Pengguna dapat menemukan Chat ID melalui bot @userinfobot di
                Telegram.
              </p>
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
                  placeholder="81234567890"
                  value={recipientNumber}
                  onChange={(e) => handlePhoneInput(e.target.value)}
                  disabled={isSending}
                  className="h-11 rounded-full text-xs sm:text-sm font-semibold flex-1"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Format standar internasional (+E.164) otomatis diterapkan.
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
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/80 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleTypeSwitch("chat")}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  messageType === "chat"
                    ? "bg-surface text-foreground shadow-xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <MessageSquare className="size-3.5" />
                <span>Teks</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeSwitch("image")}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  messageType === "image" || messageType === "photo"
                    ? "bg-surface text-foreground shadow-xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <ImageIcon className="size-3.5" />
                <span>Gambar</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeSwitch("file")}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  messageType === "file" || messageType === "document"
                    ? "bg-surface text-foreground shadow-xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <Paperclip className="size-3.5" />
                <span>Berkas</span>
              </button>
              <button
                type="button"
                onClick={() => handleTypeSwitch("location")}
                disabled={selectedChannel === "TELEGRAM_BOT"}
                className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 ${
                  messageType === "location"
                    ? "bg-surface text-foreground shadow-xs"
                    : "text-foreground-secondary hover:text-foreground"
                }`}
              >
                <MapPin className="size-3.5" />
                <span>Lokasi</span>
              </button>
            </div>

            {/* Media Attachment URL */}
            {(messageType === "image" ||
              messageType === "photo" ||
              messageType === "file" ||
              messageType === "document") && (
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold text-foreground-secondary">
                  URL Media Lampiran (HTTPS)
                </Label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg atau file.pdf"
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    onMediaUrlChange(e.target.value);
                  }}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            )}

            {/* File Name if document */}
            {(messageType === "file" || messageType === "document") && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground-secondary">
                  Nama Berkas
                </Label>
                <Input
                  type="text"
                  placeholder="invoice-2026.pdf"
                  value={fileName}
                  onChange={(e) => {
                    setFileName(e.target.value);
                    onFileNameChange(e.target.value);
                  }}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            )}

            {/* Location address */}
            {messageType === "location" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground-secondary">
                  Alamat / Koordinat Lokasi
                </Label>
                <Input
                  type="text"
                  placeholder="Jl. Sudirman No. 1, Jakarta"
                  value={locationAddress}
                  onChange={(e) => {
                    setLocationAddress(e.target.value);
                    onLocationChange(e.target.value);
                  }}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            )}
          </div>
        )}

        {/* MESSAGE BODY TEXTAREA */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-foreground-secondary block text-xs font-semibold tracking-wider uppercase">
              {wabaMode === "template_hsm"
                ? "Preview Teks Template"
                : "Isi Pesan"}
            </Label>
            {selectedChannel === "WHATSMEOW_UNOFFICIAL" && (
              <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted">
                <Sparkles className="size-3 text-wise-green" />
                <span>Spintax:</span>
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
                  : "Ketik pesan Anda di sini..."
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
              <span>Sedang Mengirim Pesan...</span>
            </>
          ) : (
            <>
              <Send className="size-4" />
              <span>
                {selectedChannel === "WHATSMEOW_UNOFFICIAL" &&
                  "Kirim Pesan WhatsApp Web"}
                {selectedChannel === "META_WABA_OFFICIAL" &&
                  "Kirim Pesan Resmi Meta WABA"}
                {selectedChannel === "TELEGRAM_BOT" &&
                  "Kirim Pesan Bot Telegram"}
              </span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
