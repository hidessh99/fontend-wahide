"use client";

import React, { useState, useEffect } from "react";
import { CreateReminderInput, ReminderChannelType } from "../../types/reminder.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import {
  CalendarPlus,
  User,
  Phone,
  Calendar,
  FileText,
  Loader2,
  AlertTriangle,
  ArrowRight,
  Smartphone,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { isValidE164, formatDisplayPhone } from "@/lib/phone";
import {
  CountryCodeItem,
  DEFAULT_COUNTRY,
  detectCountryFromPhone,
  sanitizeSubscriberInput,
} from "@/lib/countryCodes";
import { CountryCodeSelector } from "@/components/shared/CountryCodeSelector";
import { useI18n } from "@/lib/i18n/context";

interface QuickScheduleCardProps {
  onSchedule: (input: CreateReminderInput) => Promise<boolean>;
  hasConfiguredDevice?: boolean;
  onNavigateToRules?: () => void;
}

export function QuickScheduleCard({
  onSchedule,
  hasConfiguredDevice = true,
  onNavigateToRules,
}: QuickScheduleCardProps) {
  const { t } = useI18n();
  const [channelType, setChannelType] =
    useState<ReminderChannelType>("WHATSAPP_WEB");
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [displayDate, setDisplayDate] = useState("");
  const [isoDate, setIsoDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const datePickerRef = React.useRef<HTMLInputElement>(null);

  // Set default target date to tomorrow formatted as DD/MM/YYYY
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    setIsoDate(`${yyyy}-${mm}-${dd}`);
    setDisplayDate(`${dd}/${mm}/${yyyy}`);
  }, []);

  const handleNativeDateChange = (val: string) => {
    if (!val) return;
    setIsoDate(val);
    const parts = val.split("-");
    if (parts.length === 3) {
      setDisplayDate(`${parts[2]}/${parts[1]}/${parts[0]}`);
    }
  };

  const handleDisplayDateChange = (val: string) => {
    setDisplayDate(val);
    const cleaned = val.trim().replace(/-/g, "/");
    const parts = cleaned.split("/");
    if (parts.length === 3 && parts[2].length === 4) {
      const dd = parts[0].padStart(2, "0");
      const mm = parts[1].padStart(2, "0");
      const yyyy = parts[2];
      setIsoDate(`${yyyy}-${mm}-${dd}`);
    }
  };

  const getDatePreview = () => {
    let dateObj: Date | null = null;
    if (displayDate.includes("/")) {
      const [d, m, y] = displayDate.split("/");
      if (d && m && y && y.length === 4) {
        const numD = Number(d);
        const numM = Number(m);
        const numY = Number(y);
        if (numM >= 1 && numM <= 12 && numD >= 1 && numD <= 31) {
          dateObj = new Date(numY, numM - 1, numD);
        }
      }
    } else if (isoDate) {
      dateObj = new Date(isoDate);
    }
    if (dateObj && !isNaN(dateObj.getTime())) {
      return dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Detect country if user pasted international format (+...)
    if (val.includes("+")) {
      const detected = detectCountryFromPhone(val);
      if (detected.country) {
        setSelectedCountry(detected.country);
      }
      val = detected.subscriberNumber;
    }

    // Keep only numeric characters and clean leading 0 or duplicate dialCode
    const cleaned = sanitizeSubscriberInput(val, selectedCountry.dialCode);
    setPhone(cleaned);
  };

  const cleanDigits = sanitizeSubscriberInput(phone, selectedCountry.dialCode);
  const fullPhone = cleanDigits
    ? `${selectedCountry.dialCode}${cleanDigits}`
    : "";
  const isPhoneValid = Boolean(
    fullPhone && isValidE164(fullPhone) && cleanDigits.length >= 8,
  );
  const isPhoneTooLong = cleanDigits.length > 14;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasConfiguredDevice) {
      toast.warning(t("reminder.quick.warnToastTitle") || "Perangkat Belum Diatur", {
        description: t("reminder.quick.warnToastDesc") || "Silakan atur saluran pengirim terlebih dahulu.",
      });
      onNavigateToRules?.();
      return;
    }

    if (!recipientName.trim()) {
      toast.error(t("reminder.quick.errNameRequired") || "Nama penerima wajib diisi.");
      return;
    }

    if (channelType === "TELEGRAM") {
      if (!telegramChatId.trim()) {
        toast.error("Telegram Chat ID / Username wajib diisi.");
        return;
      }
    } else {
      if (!cleanDigits) {
        toast.error(t("reminder.quick.errPhoneRequired") || "Nomor telepon wajib diisi.");
        return;
      }

      if (!isValidE164(fullPhone) || cleanDigits.length < 8) {
        toast.error(t("reminder.quick.errPhoneInvalid") || "Format nomor telepon tidak valid.");
        return;
      }
    }

    const finalDate = displayDate.trim();
    if (!finalDate) {
      toast.error(t("reminder.quick.errDateRequired") || "Tanggal target wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSchedule({
        recipientName: recipientName.trim(),
        phone: channelType === "TELEGRAM" ? telegramChatId.trim() : fullPhone,
        channelType,
        targetChatId:
          channelType === "TELEGRAM" ? telegramChatId.trim() : undefined,
        targetDate: finalDate,
        notes: notes.trim(),
      });

      if (success) {
        setRecipientName("");
        setPhone("");
        setTelegramChatId("");
        setSelectedCountry(DEFAULT_COUNTRY);
        setNotes("");
        // reset to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const dd = String(tomorrow.getDate()).padStart(2, "0");
        setIsoDate(`${yyyy}-${mm}-${dd}`);
        setDisplayDate(`${dd}/${mm}/${yyyy}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 sm:p-5 overflow-visible relative z-20">
      <CardHeader className="p-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarPlus className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold">
              {t("reminder.quick.title") || "Buat Jadwal Pengingat Cepat"}
            </CardTitle>
            <CardDescription className="text-xs">
              {t("reminder.quick.subtitle") || "Jadwalkan pengingat tanggal acara atau janji temu secara langsung."}
            </CardDescription>
          </div>
        </div>

        {/* Channel Selector Pills */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-surface-raised border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChannelType("WHATSAPP_WEB")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
              channelType === "WHATSAPP_WEB"
                ? "bg-emerald-500 text-white shadow-xs"
                : "text-foreground-muted hover:text-foreground hover:bg-surface"
            )}
          >
            <Smartphone className="size-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={() => setChannelType("TELEGRAM")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer",
              channelType === "TELEGRAM"
                ? "bg-blue-500 text-white shadow-xs"
                : "text-foreground-muted hover:text-foreground hover:bg-surface"
            )}
          >
            <Bot className="size-3.5" />
            <span>Telegram</span>
          </button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-0 flex flex-col gap-4">
        {!hasConfiguredDevice && (
          <Alert
            variant="warning"
            className="border-amber-300/80 bg-amber-500/10 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 rounded-xl"
          >
            <AlertTriangle className="size-4.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between w-full">
              <div>
                <AlertTitle className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-100">
                  {t("reminder.quick.warnNoDeviceTitle") || "Saluran Pengirim Belum Dikonfigurasi"}
                </AlertTitle>
                <AlertDescription className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                  {t("reminder.quick.warnNoDeviceDesc") || "Atur nomor pengirim atau bot pada tab Aturan Pengiriman agar pesan dapat terkirim."}
                </AlertDescription>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  toast.info(t("reminder.quick.errNoDevice") || "Silakan atur saluran terlebih dahulu.");
                  onNavigateToRules?.();
                }}
                className="h-8.5 px-3.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shrink-0 self-start sm:self-auto gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Smartphone className="size-3.5" />
                <span>{t("reminder.quick.setupSender") || "Atur Pengirim"}</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </Alert>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Recipient Name */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="rem-name"
              className="flex items-center gap-1.5 text-xs"
            >
              <User className="size-3.5 text-primary" />
              <span>{t("reminder.quick.recipientName") || "Nama Penerima"} *</span>
            </Label>
            <Input
              id="rem-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder={t("reminder.quick.namePlaceholder") || "Contoh: Budi Santoso"}
              className="h-10 text-xs rounded-xl"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Dynamic Target Input: Telegram Chat ID or WhatsApp Phone */}
          {channelType === "TELEGRAM" ? (
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="rem-tele-id"
                className="flex items-center gap-1.5 text-xs"
              >
                <Bot className="size-3.5 text-blue-500" />
                <span>Telegram Chat ID / Username *</span>
              </Label>
              <Input
                id="rem-tele-id"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder={t("reminder.schedule.telegramPlaceholder")}
                className="h-10 text-xs rounded-xl font-mono"
                disabled={isSubmitting}
                required
              />
              <span className="text-[10px] text-foreground-muted">
                {t("reminder.schedule.telegramHelp")}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="rem-phone"
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-emerald-500" />
                  <span>{t("reminder.quick.phoneLabel") || "Nomor WhatsApp"} *</span>
                </div>
                {phone.length > 0 && !isPhoneValid && (
                  <span className="text-[10px] font-mono text-foreground-muted">
                    {cleanDigits.length}/8+ digit
                  </span>
                )}
              </Label>
              <div
                className={cn(
                  "flex h-10 w-full items-center rounded-xl border bg-surface transition shadow-xs",
                  isPhoneValid
                    ? "border-emerald-500/70 focus-within:ring-2 focus-within:ring-emerald-500/30"
                    : isPhoneTooLong
                      ? "border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/30"
                      : "border-border hover:border-foreground-muted focus-within:border-wise-green focus-within:ring-2 focus-within:ring-wise-green",
                )}
              >
                <CountryCodeSelector
                  selectedCountry={selectedCountry}
                  onSelectCountry={(c) => {
                    setSelectedCountry(c);
                    if (phone) {
                      setPhone(sanitizeSubscriberInput(phone, c.dialCode));
                    }
                  }}
                  disabled={isSubmitting}
                  variant="rounded"
                  className="h-full rounded-l-xl rounded-r-none border-y-0 border-l-0 px-2.5"
                />
                <input
                  id="rem-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder={
                    selectedCountry.formatHint ||
                    t("reminder.quick.phonePlaceholder") ||
                    "812 3456 7890"
                  }
                  className="bg-transparent text-foreground h-full flex-1 rounded-r-xl px-3 text-xs font-semibold outline-none placeholder:text-foreground-muted/60"
                  disabled={isSubmitting}
                  required
                />
              </div>
              {/* Live Micro-Feedback */}
              <div className="min-h-4 text-[11px] leading-tight">
                {isPhoneValid ? (
                  <span className="text-emerald-700 dark:text-wise-green font-medium flex items-center gap-1">
                    <span>✓</span>
                    <span>
                      {t("reminder.quick.phoneReadyPreview", {
                        formatted: formatDisplayPhone(fullPhone),
                      }) || `Siap kirim ke ${formatDisplayPhone(fullPhone)}`}
                    </span>
                  </span>
                ) : isPhoneTooLong ? (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    {t("reminder.quick.phoneTooLong") || "Nomor terlalu panjang"}
                  </span>
                ) : phone.length > 0 ? (
                  <span className="text-foreground-muted">
                    +{selectedCountry.dialCode} {cleanDigits} (min. 8 digit)
                  </span>
                ) : (
                  <span className="text-foreground-muted/70 text-[10px]">
                    {t("reminder.quick.phoneHelperHint") || "Masukkan nomor tanpa awalan 0 atau kode negara"}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Target Date */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="rem-date-display"
                className="flex items-center gap-1.5 text-xs"
              >
                <Calendar className="size-3.5 text-blue-500" />
                <span>{t("reminder.quick.targetDate")} *</span>
              </Label>
              <span className="text-[10px] font-mono text-foreground-muted">
                {t("reminder.quick.dateFormat")}
              </span>
            </div>
            <div className="relative flex items-center">
              <Input
                id="rem-date-display"
                type="text"
                value={displayDate}
                onChange={(e) => handleDisplayDateChange(e.target.value)}
                placeholder="07/09/2026"
                className="h-10 text-xs font-mono rounded-xl pr-10"
                disabled={isSubmitting}
                required
              />
              {/* Invisible native input to invoke browser calendar picker via showPicker */}
              <input
                ref={datePickerRef}
                type="date"
                tabIndex={-1}
                aria-hidden="true"
                value={isoDate}
                onChange={(e) => handleNativeDateChange(e.target.value)}
                className="absolute right-2 opacity-0 pointer-events-none size-6"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  try {
                    datePickerRef.current?.showPicker?.();
                  } catch {
                    datePickerRef.current?.focus();
                  }
                }}
                disabled={isSubmitting}
                className="absolute right-1.5 size-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg cursor-pointer"
                title={t("reminder.quick.pickCalendar")}
              >
                <Calendar className="size-3.5" />
              </Button>
            </div>
            {/* Live Indonesian Confirmation Text */}
            {getDatePreview() && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                <Calendar className="size-3 shrink-0" />
                <span>{getDatePreview()}</span>
              </span>
            )}
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="rem-notes"
              className="flex items-center gap-1.5 text-xs"
            >
              <FileText className="size-3.5 text-amber-500" />
              <span>{t("reminder.quick.notes")}</span>
            </Label>
            <Input
              id="rem-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("reminder.quick.notesPlaceholder")}
              className="h-10 text-xs rounded-xl"
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Action */}
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-1">
            <Button
              type="submit"
              variant={hasConfiguredDevice ? "primaryPill" : "default"}
              disabled={isSubmitting}
              className={cn(
                "w-full sm:w-auto h-10 px-5 text-xs font-bold gap-2 shadow-xs cursor-pointer transition-all",
                !hasConfiguredDevice
                  ? "bg-amber-600 hover:bg-amber-700 text-white rounded-full"
                  : "",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  {t("reminder.rules.saving")}
                </>
              ) : !hasConfiguredDevice ? (
                <>
                  <Smartphone className="size-3.5" />
                  {t("reminder.quick.btnSetupDevice")}
                  <ArrowRight className="size-3" />
                </>
              ) : (
                <>
                  <CalendarPlus className="size-3.5" />
                  {t("reminder.quick.btnSubmit")}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
