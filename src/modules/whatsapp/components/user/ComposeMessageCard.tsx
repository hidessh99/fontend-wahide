"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  MessageSquare,
  Image as ImageIcon,
  MapPin,
  Paperclip,
  Send,
  Loader2,
  Sparkles,
  Calendar,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useDevices } from "../../hooks/useDevices";
import { whatsappApi } from "../../api/whatsapp.api";
import { useI18n } from "@/lib/i18n/context";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CountryCodeSelector } from "../shared/CountryCodeSelector";
import {
  CountryCodeItem,
  DEFAULT_COUNTRY,
  detectCountryFromPhone,
} from "@/lib/countryCodes";
import { isValidE164 } from "@/lib/phone";

interface ComposeMessageCardProps {
  onMessageChange?: (text: string) => void;
  onRecipientChange?: (phone: string) => void;
  onDeviceChange?: (deviceName: string) => void;
  onTabChange?: (tab: "chat" | "image" | "location" | "file") => void;
  onMediaUrlChange?: (url: string) => void;
  onFileNameChange?: (name: string) => void;
  onLocationChange?: (address: string) => void;
  onSuccess?: () => void;
}

export function ComposeMessageCard({
  onMessageChange,
  onRecipientChange,
  onDeviceChange,
  onTabChange,
  onMediaUrlChange,
  onFileNameChange,
  onLocationChange,
  onSuccess,
}: ComposeMessageCardProps) {
  const { t } = useI18n();
  const { devices, isLoading: isLoadingDevices } = useDevices();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [recipientNumber, setRecipientNumber] = useState<string>("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [activeTab, setActiveTab] = useState<
    "chat" | "image" | "location" | "file"
  >("chat");

  const [messageText, setMessageText] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [locationAddress, setLocationAddress] = useState<string>("");

  const [scheduleForLater, setScheduleForLater] = useState<boolean>(false);
  const [scheduledAt, setScheduledAt] = useState<string>("");

  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connectedDevices = devices.filter(
    (d) => d.status === "CONNECTED" && !d.is_over_limit && !d.isOverLimit,
  );
  const hasActiveDevice = connectedDevices.length > 0;

  useEffect(() => {
    if (connectedDevices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(connectedDevices[0].id);
      const name =
        connectedDevices[0].name ||
        connectedDevices[0].pushName ||
        connectedDevices[0].phone ||
        "Device";
      onDeviceChange?.(name);
    } else if (connectedDevices.length === 0 && selectedDeviceId) {
      setSelectedDeviceId("");
      onDeviceChange?.("");
    }
  }, [connectedDevices, selectedDeviceId, onDeviceChange]);

  const handleDeviceSelect = (id: string) => {
    setSelectedDeviceId(id);
    const d = connectedDevices.find((dev) => dev.id === id);
    if (d) {
      const name = d.name || d.pushName || d.phone || "Device";
      onDeviceChange?.(name);
    } else {
      onDeviceChange?.("");
    }
  };

  const handleSelectCountry = (country: CountryCodeItem) => {
    setSelectedCountry(country);
    const full = recipientNumber.trim()
      ? `${country.dialCode}${recipientNumber.trim()}`
      : "";
    onRecipientChange?.(full);
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
        onRecipientChange?.(full);
        return;
      }
    }

    let clean = val.replace(/[^0-9]/g, "");

    if (clean.startsWith("0")) {
      clean = clean.slice(1);
    }

    if (
      clean.startsWith(selectedCountry.dialCode) &&
      clean.length > selectedCountry.dialCode.length + 6
    ) {
      clean = clean.slice(selectedCountry.dialCode.length);
    }

    setRecipientNumber(clean);
    const full = clean ? `${selectedCountry.dialCode}${clean}` : "";
    onRecipientChange?.(full);
  };

  const handleTextChange = (val: string) => {
    setMessageText(val);
    onMessageChange?.(val);
  };

  const handleTabSwitch = (tab: "chat" | "image" | "location" | "file") => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const insertSpintax = (sample: string) => {
    const updated = messageText ? `${messageText} ${sample}` : sample;
    setMessageText(updated);
    onMessageChange?.(updated);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedDeviceId) {
      setErrorMessage(t("whatsapp.messagesErrSelectDevice"));
      return;
    }

    if (!recipientNumber.trim()) {
      setErrorMessage(t("whatsapp.messagesErrRecipientRequired"));
      return;
    }

    const fullPhone = `${selectedCountry.dialCode}${recipientNumber.trim()}`;

    if (!isValidE164(fullPhone)) {
      setErrorMessage(t("whatsapp.messagesErrInvalidPhone"));
      return;
    }

    if (activeTab === "chat" && !messageText.trim()) {
      setErrorMessage(t("whatsapp.messagesErrTextRequired"));
      return;
    }

    if (activeTab === "image" && !mediaUrl.trim()) {
      setErrorMessage(t("whatsapp.messagesErrImageUrlRequired"));
      return;
    }

    if (activeTab === "file" && !mediaUrl.trim()) {
      setErrorMessage(t("whatsapp.messagesErrFileUrlRequired"));
      return;
    }

    setIsSending(true);
    try {
      const payload: {
        device_id: string;
        phone: string;
        message?: string;
        media_url?: string;
        file_name?: string;
        parse_spintax?: boolean;
        simulate_typing?: boolean;
      } = {
        device_id: selectedDeviceId,
        phone: fullPhone,
        parse_spintax: true,
        simulate_typing: true,
      };

      if (activeTab === "chat") {
        payload.message = messageText.trim();
      } else if (activeTab === "image") {
        payload.media_url = mediaUrl.trim();
        payload.message = messageText.trim();
      } else if (activeTab === "file") {
        payload.media_url = mediaUrl.trim();
        payload.file_name = fileName.trim() || "document.pdf";
        payload.message = messageText.trim();
      } else if (activeTab === "location") {
        payload.message = `${t("whatsapp.messagesLocationPrefix")} ${locationAddress.trim()}\n${messageText.trim()}`;
      }

      await whatsappApi.sendMessage(payload);
      toast.success(t("whatsapp.messagesSendSuccess"));

      setMessageText("");
      onMessageChange?.("");
      setMediaUrl("");
      onMediaUrlChange?.("");
      setFileName("");
      onFileNameChange?.("");
      setLocationAddress("");
      onLocationChange?.("");

      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("whatsapp.messagesErrSendFailed");
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  const selectedDevice = connectedDevices.find(
    (d) => d.id === selectedDeviceId,
  );

  return (
    <div className="border-border bg-surface rounded-2xl border p-5 shadow-xs sm:rounded-3xl sm:p-7">
      <div className="mb-6 space-y-1">
        <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
          {t("whatsapp.messagesComposeTitle")}
        </h2>
        <p className="text-xs sm:text-sm text-foreground-secondary font-medium">
          {t("whatsapp.messagesComposeSubtitle")}
        </p>
      </div>

      {!hasActiveDevice && !isLoadingDevices && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-xs text-foreground space-y-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Smartphone className="size-4.5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">
                {t("whatsapp.messagesNoActiveDevicesTitle")}
              </h4>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {t("whatsapp.messagesNoActiveDevicesDesc")}
              </p>
            </div>
          </div>
          <div className="pl-12">
            <Link href="/devices">
              <Button
                type="button"
                variant="primaryPill"
                size="sm"
                className="gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>{t("whatsapp.messagesLinkDeviceBtn")}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs font-medium text-rose-700 dark:text-rose-400">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-5">
        <div className="space-y-1.5">
          <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("whatsapp.messagesSelectDevice")}
          </Label>
          <div className="relative">
            <NativeSelect
              value={selectedDeviceId}
              onChange={(e) => handleDeviceSelect(e.target.value)}
              disabled={isLoadingDevices || isSending || !hasActiveDevice}
              variant="rounded"
              wrapperClassName="w-full"
              className="pl-10 text-xs sm:text-sm font-semibold h-11"
            >
              {connectedDevices.length === 0 ? (
                <option value="" disabled>
                  {isLoadingDevices
                    ? t("whatsapp.messagesLoadingDevices")
                    : t("whatsapp.messagesNoConnectedOption")}
                </option>
              ) : (
                <>
                  <option value="" disabled>
                    {t("whatsapp.messagesStatusSelectDevice")}
                  </option>
                  {connectedDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name || d.pushName || "Device"} (
                      {d.phone
                        ? `+${d.phone.replace(/^\+/, "")}`
                        : "Nomor Belum Ada"}
                      )
                    </option>
                  ))}
                </>
              )}
            </NativeSelect>
            <Smartphone className="absolute left-3.5 top-3.5 size-4 text-foreground-muted pointer-events-none z-10" />
          </div>
          {selectedDevice && (
            <div className="flex items-center gap-2 pt-1">
              <Badge
                variant="success"
                className="gap-1.5 text-[11px] font-semibold"
              >
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>{selectedDevice.status}</span>
              </Badge>
              {selectedDevice.phone && (
                <span className="text-[11px] font-mono text-foreground-secondary">
                  +{selectedDevice.phone.replace(/^\+/, "")}
                </span>
              )}
            </div>
          )}
          {!hasActiveDevice && !isLoadingDevices && (
            <p className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold flex items-center gap-1.5 pt-0.5">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{t("whatsapp.messagesErrDeviceNotConnected")}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("whatsapp.messagesRecipient")}
          </Label>
          <div className="flex h-10 sm:h-11 rounded-xl border border-border bg-surface shadow-xs focus-within:ring-2 focus-within:ring-wise-green focus-within:border-wise-green transition-all hover:border-foreground-muted">
            <CountryCodeSelector
              selectedCountry={selectedCountry}
              onSelectCountry={handleSelectCountry}
              disabled={isSending}
            />
            <input
              type="tel"
              value={recipientNumber}
              onChange={(e) => handlePhoneInput(e.target.value)}
              disabled={isSending}
              placeholder={selectedCountry.formatHint || "81234567890"}
              className="flex-1 bg-transparent px-3 text-xs sm:text-sm font-mono font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
            />
          </div>
          <p className="text-[11px] text-foreground-secondary font-medium">
            {t("whatsapp.messagesRecipientHint")}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-muted/60 p-1 border border-border w-fit">
            <button
              type="button"
              onClick={() => handleTabSwitch("chat")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer select-none",
                activeTab === "chat"
                  ? "bg-wise-green text-dark-green shadow-xs font-black"
                  : "text-foreground-secondary hover:text-foreground",
              )}
            >
              <MessageSquare className="size-3.5" />
              <span>{t("whatsapp.messagesTabChat")}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("image")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer select-none",
                activeTab === "image"
                  ? "bg-wise-green text-dark-green shadow-xs font-black"
                  : "text-foreground-secondary hover:text-foreground",
              )}
            >
              <ImageIcon className="size-3.5" />
              <span>{t("whatsapp.messagesTabImage")}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("location")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer select-none",
                activeTab === "location"
                  ? "bg-wise-green text-dark-green shadow-xs font-black"
                  : "text-foreground-secondary hover:text-foreground",
              )}
            >
              <MapPin className="size-3.5" />
              <span>{t("whatsapp.messagesTabLocation")}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("file")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition cursor-pointer select-none",
                activeTab === "file"
                  ? "bg-wise-green text-dark-green shadow-xs font-black"
                  : "text-foreground-secondary hover:text-foreground",
              )}
            >
              <Paperclip className="size-3.5" />
              <span>{t("whatsapp.messagesTabFile")}</span>
            </button>
          </div>

          {activeTab === "image" && (
            <div className="space-y-1.5 animate-fadeIn">
              <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("whatsapp.messagesImageUrl")}
              </Label>
              <Input
                type="url"
                variant="rounded"
                value={mediaUrl}
                onChange={(e) => {
                  setMediaUrl(e.target.value);
                  onMediaUrlChange?.(e.target.value);
                }}
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          )}

          {activeTab === "file" && (
            <div className="space-y-3 animate-fadeIn">
              <div className="space-y-1.5">
                <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("whatsapp.messagesFileUrl")}
                </Label>
                <Input
                  type="url"
                  variant="rounded"
                  value={mediaUrl}
                  onChange={(e) => {
                    setMediaUrl(e.target.value);
                    onMediaUrlChange?.(e.target.value);
                  }}
                  placeholder="https://example.com/invoice.pdf"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("whatsapp.messagesFileName")}
                </Label>
                <Input
                  type="text"
                  variant="rounded"
                  value={fileName}
                  onChange={(e) => {
                    setFileName(e.target.value);
                    onFileNameChange?.(e.target.value);
                  }}
                  placeholder="Invoice-1029.pdf"
                />
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="space-y-1.5 animate-fadeIn">
              <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("whatsapp.messagesLocationAddr")}
              </Label>
              <Input
                type="text"
                variant="rounded"
                value={locationAddress}
                onChange={(e) => {
                  setLocationAddress(e.target.value);
                  onLocationChange?.(e.target.value);
                }}
                placeholder="Jl. Jend. Sudirman No. 1, Jakarta Selatan"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {activeTab === "chat"
                  ? t("whatsapp.messagesTextLabel")
                  : t("whatsapp.messagesCaptionLabel")}
              </Label>
              <button
                type="button"
                onClick={() => insertSpintax("{Halo|Hai|Selamat Pagi}")}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-wise-green hover:underline cursor-pointer"
              >
                <Sparkles className="size-3" />
                {t("whatsapp.messagesSpintaxHelper")}
              </button>
            </div>
            <Textarea
              rows={4}
              variant="rounded"
              value={messageText}
              onChange={(e) => handleTextChange(e.target.value)}
              disabled={isSending}
              placeholder={t("whatsapp.messagesPlaceholder")}
              className="resize-y"
            />
            <div className="flex items-center justify-between text-[11px] text-foreground-secondary font-medium">
              <span>{t("whatsapp.messagesSpintaxHint")}</span>
              <span>
                {messageText.length} {t("whatsapp.messagesCharacters")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none font-semibold">
            <input
              type="checkbox"
              checked={scheduleForLater}
              onChange={(e) => setScheduleForLater(e.target.checked)}
              className="size-4 rounded-md border-border text-emerald-600 focus:ring-emerald-500"
            />
            <span>{t("whatsapp.messagesScheduleLater")}</span>
          </label>

          {scheduleForLater && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-2.5 shadow-xs max-w-xs animate-fadeIn">
              <Calendar className="size-4 text-foreground-muted" />
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="bg-transparent text-xs text-foreground focus:outline-none w-full font-semibold"
              />
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primaryPill"
            size="default"
            disabled={
              !hasActiveDevice ||
              isSending ||
              !selectedDeviceId ||
              !recipientNumber.trim()
            }
            className="w-full sm:w-auto h-11 px-8 text-sm font-bold shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{t("whatsapp.messagesSending")}</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>{t("whatsapp.messagesSendBtn")}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
