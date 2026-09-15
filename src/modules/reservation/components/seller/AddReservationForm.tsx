"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Tag,
  FileText,
  Info,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n/context";
import { isValidE164, formatDisplayPhone } from "@/lib/phone";
import {
  CountryCodeItem,
  DEFAULT_COUNTRY,
  detectCountryFromPhone,
  sanitizeSubscriberInput,
} from "@/lib/countryCodes";
import { CountryCodeSelector } from "@/components/shared/CountryCodeSelector";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CreateReservationInput } from "../../types/reservation.types";

interface AddReservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateReservationInput) => Promise<boolean>;
  defaultDate?: string;
}

export function AddReservationForm({
  isOpen,
  onClose,
  onSubmit,
  defaultDate,
}: AddReservationFormProps) {
  const { t } = useI18n();

  const [customerName, setCustomerName] = useState("");
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCodeItem>(DEFAULT_COUNTRY);
  const [phone, setPhone] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [isoDate, setIsoDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const datePickerRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCustomerName("");
      setPhone("");
      setSelectedCountry(DEFAULT_COUNTRY);
      setBookingTime("10:00");
      setServiceName("");
      setNotes("");

      const initialIso = defaultDate || new Date().toISOString().slice(0, 10);
      setIsoDate(initialIso);
      const parts = initialIso.split("-");
      if (parts.length === 3) {
        setDisplayDate(`${parts[2]}/${parts[1]}/${parts[0]}`);
      } else {
        setDisplayDate(initialIso);
      }
    }
  }, [isOpen, defaultDate]);

  const handlePhoneChange = (val: string) => {
    let currentVal = val;
    if (currentVal.includes("+")) {
      const detected = detectCountryFromPhone(currentVal);
      if (detected.country) {
        setSelectedCountry(detected.country);
        const cleaned = sanitizeSubscriberInput(
          detected.subscriberNumber,
          detected.country.dialCode,
        );
        setPhone(cleaned);
        return;
      }
      currentVal = detected.subscriberNumber;
    }
    const cleaned = sanitizeSubscriberInput(
      currentVal,
      selectedCountry.dialCode,
    );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalDate = isoDate || displayDate;
    if (!customerName.trim() || !phone.trim() || !finalDate.trim()) {
      return;
    }

    if (!isPhoneValid) {
      toast.error(
        t("contact.errPhonePrefix") || "Format nomor WhatsApp tidak valid.",
      );
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmit({
      customerName: customerName.trim(),
      phone: fullPhone,
      bookingDate: finalDate.trim(),
      bookingTime: bookingTime.trim() || undefined,
      serviceName: serviceName.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
        <DialogHeader className="border-b border-border/70 p-4 sm:p-5 shrink-0 text-left">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-bold">
            <CalendarIcon className="size-5 text-primary" />
            <span>{t("reservation.addReservationTitle")}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-foreground-muted">
            {t("reservation.addReservationDesc")}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3.5 text-xs">
            {/* Customer Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="res-customer-name" className="text-xs">
                <User className="size-3.5 text-foreground-muted" />
                <span>{t("reservation.customerName")}</span>
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="res-customer-name"
                required
                placeholder="Contoh: Budi Santoso"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            {/* Customer Phone */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="res-phone" className="text-xs">
                <Phone className="size-3.5 text-foreground-muted" />
                <span>{t("reservation.phone")}</span>
                <span className="text-destructive">*</span>
              </Label>
              <div
                className={cn(
                  "flex h-9 w-full items-center rounded-xl border bg-surface transition-all focus-within:ring-2",
                  isPhoneValid
                    ? "border-emerald-500/70 focus-within:ring-emerald-500/30"
                    : isPhoneTooLong
                      ? "border-rose-500/70 focus-within:ring-rose-500/30"
                      : "border-border focus-within:border-primary focus-within:ring-primary/20",
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
                <Input
                  id="res-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder={
                    t("reservation.phonePlaceholder") || "812 3456 7890"
                  }
                  className="h-full flex-1 rounded-r-xl rounded-l-none border-0 bg-transparent px-3 text-xs focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={isSubmitting}
                />
              </div>

              {/* Live Preview & Helper Micro-Feedback */}
              <div className="flex items-center justify-between px-1 text-[11px]">
                {isPhoneValid ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium animate-fadeIn">
                    <span>✓</span>
                    <span>
                      {t("reservation.phoneReadyPreview", {
                        formatted: formatDisplayPhone(fullPhone),
                      })}
                    </span>
                  </span>
                ) : isPhoneTooLong ? (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    {t("reservation.phoneTooLong")}
                  </span>
                ) : phone.length > 0 ? (
                  <span className="text-foreground-muted">
                    +{selectedCountry.dialCode} {cleanDigits} (min. 8 digit)
                  </span>
                ) : (
                  <span className="text-foreground-muted/70 text-[10px]">
                    {t("reservation.phoneHelperHint")}
                  </span>
                )}
              </div>
            </div>

            {/* Booking Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="res-booking-date" className="text-xs">
                    <CalendarIcon className="size-3.5 text-foreground-muted" />
                    <span>{t("reservation.bookingDate")}</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] font-mono text-foreground-muted">
                    (Tgl/Bln/Thn)
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Input
                    id="res-booking-date"
                    required
                    type="text"
                    placeholder="15/10/2026"
                    value={displayDate}
                    onChange={(e) => handleDisplayDateChange(e.target.value)}
                    className="h-9 text-xs font-mono rounded-xl pr-9"
                    disabled={isSubmitting}
                  />
                  <input
                    ref={datePickerRef}
                    type="date"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={isoDate}
                    onChange={(e) => handleNativeDateChange(e.target.value)}
                    className="absolute right-2 opacity-0 pointer-events-none size-5"
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
                    className="absolute right-1 size-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg cursor-pointer"
                    title={t("reservation.pickCalendar")}
                  >
                    <CalendarIcon className="size-3.5" />
                  </Button>
                </div>
                {getDatePreview() && (
                  <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 rounded-lg px-2.5 py-1 flex items-center gap-1.5 animate-in fade-in duration-200">
                    <CalendarIcon className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{getDatePreview()}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="res-booking-time" className="text-xs">
                  <Clock className="size-3.5 text-foreground-muted" />
                  <span>{t("reservation.bookingTime")}</span>
                </Label>
                <Input
                  id="res-booking-time"
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            {/* Service Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="res-service" className="text-xs">
                <Tag className="size-3.5 text-foreground-muted" />
                <span>{t("reservation.serviceName")}</span>
              </Label>
              <Input
                id="res-service"
                placeholder={t("reservation.servicePlaceholder")}
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="res-notes" className="text-xs">
                <FileText className="size-3.5 text-foreground-muted" />
                <span>{t("reservation.notes")}</span>
              </Label>
              <Textarea
                id="res-notes"
                rows={2}
                placeholder={t("reservation.notesPlaceholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs resize-none rounded-xl"
              />
            </div>

            {/* Cross-module Sync Banner */}
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2.5 text-foreground">
              <Info className="size-4 shrink-0 mt-0.5 text-primary" />
              <p className="text-[11px] leading-relaxed text-foreground-secondary">
                {t("reservation.syncNote")}
              </p>
            </div>
          </div>

          <DialogFooter className="border-t border-border/70 p-4 sm:p-5 bg-muted/20 shrink-0 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full cursor-pointer px-4"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isSubmitting}
              className="cursor-pointer px-5 font-bold shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("common.saving")}</span>
                </>
              ) : (
                <span>{t("reservation.saveReservation")}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
