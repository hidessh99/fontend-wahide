"use client";

import React, { useState } from "react";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { formatPhoneNumber } from "@/modules/whatsapp/components/seller/DeviceCard";
import { whatsappApi } from "@/modules/whatsapp/api/whatsapp.api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { normalizePhoneNumber, isValidE164 } from "@/lib/phone";
import { CountryCodeSelector } from "@/components/shared/CountryCodeSelector";
import { PhoneWarningNotice } from "@/components/shared/PhoneWarningNotice";
import {
  CountryCodeItem,
  DEFAULT_COUNTRY,
  detectCountryFromPhone,
  checkPhoneInputWarning,
  type PhoneWarningResult,
} from "@/lib/countryCodes";

interface SendMessageModalProps {
  devices: Device[];
  isOpen: boolean;
  onClose: () => void;
}

export function SendMessageModal({
  devices,
  isOpen,
  onClose,
}: SendMessageModalProps) {
  const { t } = useI18n();
  const connectedDevices = devices.filter(
    (d) => d.status === "CONNECTED" && !d.is_over_limit && !d.isOverLimit,
  );
  const [userSelectedDeviceId, setUserSelectedDeviceId] = useState<string>("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [recipient, setRecipient] = useState("");
  const [phoneWarning, setPhoneWarning] = useState<PhoneWarningResult>({
    hasWarning: false,
    suggestedValue: "",
  });
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.includes("+")) {
      const detected = detectCountryFromPhone(val);
      if (detected.country) {
        setSelectedCountry(detected.country);
      }
      val = detected.subscriberNumber;
    }
    val = val.replace(/[^0-9]/g, "");

    const warning = checkPhoneInputWarning(val, selectedCountry.dialCode);
    setPhoneWarning(warning);

    setRecipient(val);
  };

  const handleFixPhone = (suggestedValue: string) => {
    setRecipient(suggestedValue);
    setPhoneWarning({ hasWarning: false, suggestedValue: "" });
  };

  const handleSelectCountry = (country: CountryCodeItem) => {
    setSelectedCountry(country);
    const warning = checkPhoneInputWarning(recipient, country.dialCode);
    setPhoneWarning(warning);
  };

  const activeDeviceId =
    userSelectedDeviceId &&
    connectedDevices.some((d) => d.id === userSelectedDeviceId)
      ? userSelectedDeviceId
      : connectedDevices[0]?.id || "";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const warning = checkPhoneInputWarning(recipient, selectedCountry.dialCode);
    if (warning.hasWarning) {
      toast.error(
        warning.message ||
          "Harap perbaiki format nomor WhatsApp terlebih dahulu.",
      );
      return;
    }

    const cleanDigits = recipient.replace(/[^0-9]/g, "");
    if (!cleanDigits || !message.trim()) {
      toast.error(t("whatsapp.recipientPhoneHint"));
      return;
    }

    const fullPhone = `${selectedCountry.dialCode}${cleanDigits}`;
    const cleanPhone = normalizePhoneNumber(fullPhone);
    if (!isValidE164(cleanPhone)) {
      toast.error(
        t("contact.errPhonePrefix") || t("whatsapp.recipientPhoneHint"),
      );
      return;
    }

    if (!activeDeviceId) {
      toast.error(t("whatsapp.noConnectedDevices"));
      return;
    }

    setIsSending(true);
    try {
      await whatsappApi.sendMessage({
        device_id: activeDeviceId,
        phone: cleanPhone,
        message: message.trim(),
      });
      toast.success(t("whatsapp.sendSuccess"), { id: "whatsapp-fast-send" });
      setRecipient("");
      setMessage("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("whatsapp.qrError");
      toast.error(msg, { id: "whatsapp-fast-send" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isSending && onClose()}
    >
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
        {/* Sticky Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <Send className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {t("whatsapp.fastSendTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("whatsapp.fastSendSubtitle")}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSend}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {/* Select Device */}
            <div>
              <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("whatsapp.selectSenderDevice")}
              </Label>
              <NativeSelect
                value={activeDeviceId}
                onChange={(e) => setUserSelectedDeviceId(e.target.value)}
                variant="rounded"
              >
                {connectedDevices.length === 0 ? (
                  <option value="">{t("whatsapp.noConnectedDevices")}</option>
                ) : (
                  connectedDevices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.push_name || d.name} (
                      {d.phone
                        ? formatPhoneNumber(d.phone)
                        : "Nomor Belum Tertaut"}
                      )
                    </option>
                  ))
                )}
              </NativeSelect>
            </div>

            {/* Recipient Phone */}
            <div>
              <Label
                htmlFor="send-msg-phone"
                className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase"
              >
                {t("whatsapp.recipientPhoneLabel")}
              </Label>
              <div className="flex h-11 w-full items-center rounded-xl border border-border bg-surface shadow-xs transition hover:border-foreground-muted focus-within:border-wise-green focus-within:ring-2 focus-within:ring-wise-green">
                <CountryCodeSelector
                  selectedCountry={selectedCountry}
                  onSelectCountry={handleSelectCountry}
                  disabled={isSending}
                  variant="rounded"
                />
                <input
                  id="send-msg-phone"
                  type="tel"
                  value={recipient}
                  onChange={handleRecipientChange}
                  placeholder={selectedCountry.formatHint || "812 3456 7890"}
                  className="flex-1 bg-transparent px-3 text-xs sm:text-sm font-semibold text-foreground focus:outline-none font-mono placeholder:text-foreground-muted/60"
                  required
                />
              </div>
              <PhoneWarningNotice
                warning={phoneWarning}
                onFix={handleFixPhone}
              />
              <span className="text-foreground-muted mt-1 block text-[11px]">
                {t("whatsapp.recipientPhoneHint")}
              </span>
            </div>

            {/* Message Body */}
            <div>
              <Label
                htmlFor="send-msg-text"
                className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase"
              >
                {t("whatsapp.messageTextLabel")}
              </Label>
              <Textarea
                id="send-msg-text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder={t("whatsapp.messageTextPlaceholder")}
                variant="rounded"
                className="resize-none"
                required
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <DialogFooter className="border-border/80 bg-surface/90 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 pt-3 backdrop-blur-sm sm:p-6/90">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
              className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-5 text-xs font-bold"
            >
              {t("whatsapp.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isSending || connectedDevices.length === 0}
              className="cursor-pointer gap-2 rounded-full px-6 text-xs font-bold shadow-sm"
            >
              {isSending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("whatsapp.submittingSend")}</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>{t("whatsapp.submitSend")}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
