"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  Building2,
  CheckCircle2,
} from "lucide-react";

export function ContactUsView() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("TECH");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMountedRef = useRef(true);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (submitTimerRef.current !== null) {
        clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(t("contactUs.nameLabel") + " & " + t("contactUs.emailLabel") + " required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API submission with unmount safety
      await new Promise((resolve) => {
        submitTimerRef.current = setTimeout(resolve, 700);
      });
      if (!isMountedRef.current) return;
      toast.success(t("contactUs.sendSuccess"));
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
          <MessageSquare className="size-3.5" />
          <span>{t("contactUs.badge")}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
          {t("contactUs.title")}
        </h1>
        <p className="text-sm sm:text-base font-semibold text-foreground-secondary leading-relaxed">
          {t("contactUs.subtitle")}
        </p>
      </div>

      {/* Top 3 Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Direct */}
        <div className="p-6 rounded-md border border-wise-green/30 bg-wise-green/5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="size-10 rounded-full bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green flex items-center justify-center">
              <Phone className="size-5" />
            </div>
            <h2 className="text-lg font-black text-foreground">
              {t("contactUs.cardDirectWhatsApp")}
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary">
              {t("contactUs.cardDirectWhatsAppDesc")}
            </p>
            <div className="text-sm font-black font-mono text-dark-green dark:text-wise-green pt-1">
              0877111301818
            </div>
          </div>

          <a
            href="https://wa.me/62877111301818"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="primaryPill" size="sm" className="w-full text-xs font-bold gap-2">
              <MessageSquare className="size-3.5" />
              <span>{t("contactUs.btnChatWhatsApp")}</span>
            </Button>
          </a>
        </div>

        {/* Email */}
        <div className="p-6 rounded-md border border-border bg-surface space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground-secondary">
              <Mail className="size-5" />
            </div>
            <h2 className="text-lg font-black text-foreground">
              {t("contactUs.cardEmail")}
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary">
              {t("contactUs.cardEmailDesc")}
            </p>
            <div className="text-sm font-black font-mono text-foreground pt-1">
              admin@hidessh.com
            </div>
          </div>

          <a href="mailto:admin@hidessh.com" className="block">
            <Button variant="outline" size="sm" className="w-full rounded-full text-xs font-bold border-border">
              <span>Kirim Email</span>
            </Button>
          </a>
        </div>

        {/* Office Address */}
        <div className="p-6 rounded-md border border-border bg-surface space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground-secondary">
              <Building2 className="size-5" />
            </div>
            <h2 className="text-lg font-black text-foreground">
              {t("contactUs.cardOffice")}
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
              Jl. Kampung Baris No.391, Karangturi, Kec. Semarang Tim., Kota Semarang, Jawa Tengah 50124
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground-muted pt-2 border-t border-border">
            <Clock className="size-3.5 text-dark-green dark:text-wise-green shrink-0" />
            <span>Senin – Sabtu (08:00 – 21:00 WIB)</span>
          </div>
        </div>
      </div>

      {/* Contact Form & Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-xl border border-border bg-surface space-y-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-foreground">
              {t("contactUs.formTitle")}
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary">
              {t("contactUs.formSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("contactUs.nameLabel")}
                </label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("contactUs.namePlaceholder")}
                  variant="pill"
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("contactUs.emailLabel")}
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("contactUs.emailPlaceholder")}
                  variant="pill"
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("contactUs.phoneLabel")}
                </label>
                <Input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("contactUs.phonePlaceholder")}
                  variant="pill"
                  className="h-10 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("contactUs.subjectLabel")}
                </label>
                <NativeSelect
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  variant="rounded"
                  className="h-10 text-xs"
                >
                  <option value="TECH">{t("contactUs.subjectTech")}</option>
                  <option value="SALES">{t("contactUs.subjectSales")}</option>
                  <option value="BILLING">{t("contactUs.subjectBilling")}</option>
                  <option value="OTHER">{t("contactUs.subjectOther")}</option>
                </NativeSelect>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                {t("contactUs.messageLabel")}
              </label>
              <Textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("contactUs.messagePlaceholder")}
                className="text-xs leading-relaxed"
              />
            </div>

            <Button
              type="submit"
              variant="primaryPill"
              size="default"
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs font-bold gap-2 px-8 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-3.5 mr-1" />
                  <span>{t("contactUs.submittingBtn")}</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>{t("contactUs.submitBtn")}</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Map & Office Detail */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-xl border border-border bg-surface space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-emerald-700 dark:text-wise-green" />
              <h2 className="text-lg font-black text-foreground">
                {t("contactUs.mapTitle")}
              </h2>
            </div>
            <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
              Kantor operasional Hide Group berlokasi strategis di Semarang, Jawa Tengah untuk melayani ribuan bisnis di seluruh Indonesia.
            </p>

            {/* Visual Location Card */}
            <div className="p-6 rounded-md bg-muted/40 border border-border space-y-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                <Building2 className="size-4 text-emerald-700 dark:text-wise-green" />
                <span>Hide Group Operations Center</span>
              </div>
              <p className="text-xs font-semibold text-foreground-secondary">
                Jl. Kampung Baris No.391, Karangturi, Kec. Semarang Tim., Kota Semarang, Jawa Tengah 50124
              </p>
              <div className="pt-2 text-[11px] font-mono font-bold text-emerald-700 dark:text-wise-green flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                <span>Koordinat Terverifikasi • Jawa Tengah, ID</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-md border border-border/80 bg-muted/20 text-xs font-semibold text-foreground-muted space-y-1">
            <div><strong>Dukungan Teknis 24/7:</strong> Tiket Helpdesk pada dashboard pengguna diproses dalam hitungan menit.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
