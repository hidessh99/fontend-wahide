"use client";

import React, { useState } from "react";
import {
  Lock,
  Calendar,
  Send,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Wifi,
  Battery,
  User,
  Phone,
  Mail,
  Hash,
  AlignLeft,
  ChevronDown,
  Clock,
  FileText,
} from "lucide-react";
import { FormField, FormType } from "../../types/form.types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";

interface FormPhoneMockupProps {
  title: string;
  slug: string;
  description?: string;
  type?: FormType;
  fields: FormField[];
  successMessage?: string;
  redirectUrl?: string;
  className?: string;
}

export function FormPhoneMockup({
  title,
  slug,
  description,
  type = "STANDARD",
  fields = [],
  successMessage,
  redirectUrl,
  className = "",
}: FormPhoneMockupProps) {
  const { t } = useI18n();
  const [activePreviewTab, setActivePreviewTab] = useState<"form" | "success">(
    "form",
  );

  // Determine Form Type Badge
  const typeBadgeLabel =
    type === "RESERVATION"
      ? t("form.typeReservation")
      : type === "LEAD"
        ? t("form.typeLead")
        : t("form.preview.officialBadge");

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-85 sm:max-w-90 flex-col",
        className,
      )}
    >
      {/* Top Device Segmented View Mode Toggle */}
      <div className="mb-2 flex items-center justify-between px-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
          {t("form.preview.badge")}
        </span>
        <Tabs
          value={activePreviewTab}
          onValueChange={(v) => setActivePreviewTab(v as "form" | "success")}
        >
          <TabsList className="h-7 p-0.5 rounded-lg bg-muted/80 border border-border/60">
            <TabsTrigger
              value="form"
              className="text-[11px] px-2.5 py-0.5 rounded-md gap-1"
            >
              {t("form.preview.tabForm")}
            </TabsTrigger>
            <TabsTrigger
              value="success"
              className="text-[11px] px-2.5 py-0.5 rounded-md gap-1"
            >
              {t("form.preview.tabSuccess")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Smartphone Hardware Frame */}
      <div className="flex h-150 w-full flex-col overflow-hidden rounded-xl border-[7px] border-neutral-900 bg-neutral-900 shadow-2xl dark:border-neutral-800">
        {/* Top Notch & Status Bar */}
        <div className="flex h-7 w-full items-center justify-between bg-neutral-950 px-5 pt-1 text-white shrink-0">
          <span className="text-[11px] font-semibold tracking-tight">
            09:41
          </span>
          {/* Dynamic Island / Camera pill */}
          <div className="flex h-3.5 w-20 items-center justify-center rounded-full bg-neutral-800">
            <div className="size-1.5 rounded-full bg-neutral-950/80 mr-2" />
            <div className="size-2 rounded-full bg-neutral-900" />
          </div>
          <div className="flex items-center gap-1.5 text-neutral-300">
            <Wifi className="size-3" />
            <Battery className="size-3.5" />
          </div>
        </div>

        {/* Mobile Internal Mode Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-border/50 bg-slate-100 px-3 py-1.5 text-[11px] text-slate-700 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300 shrink-0">
          <div className="flex flex-1 items-center gap-1.5 overflow-hidden rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <Lock className="size-2.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate font-semibold text-[10px]">
              {t("form.preview.privateMode")}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 truncate">
            ref:{slug ? slug.toLowerCase() : "internal"}
          </span>
        </div>

        {/* Inner Mobile Screen Content (Scrollable Viewport) */}
        <div className="relative flex-1 overflow-y-auto bg-slate-50 p-3 text-slate-900 scrollbar-none dark:bg-neutral-950 dark:text-neutral-100">
          {activePreviewTab === "form" ? (
            <div className="space-y-3 pb-4">
              {/* Form Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                {/* Header Banner */}
                <div className="border-b border-slate-100 bg-primary/5 p-3.5 dark:border-neutral-800 dark:bg-primary/10">
                  <div className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary">
                    <Calendar className="size-2.5" />
                    <span>{typeBadgeLabel}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug wrap-break-word">
                    {title || t("form.fieldTitle")}
                  </h3>
                  {description ? (
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 wrap-break-word">
                      {description}
                    </p>
                  ) : (
                    <p className="mt-1 text-[10px] italic text-slate-400 dark:text-slate-500">
                      {t("form.noDescription")}
                    </p>
                  )}
                </div>

                {/* Form Fields Body */}
                <div className="space-y-3 p-3.5">
                  {/* Mandatory Full Name */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <User className="size-3 text-slate-400" />
                      <span>{t("form.preview.fullName")}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 flex items-center text-[11px] text-slate-400 dark:border-neutral-800 dark:bg-neutral-950/60">
                      Budi Santoso
                    </div>
                  </div>

                  {/* Mandatory WhatsApp Phone */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <Phone className="size-3 text-slate-400" />
                      <span>{t("form.preview.whatsappNumber")}</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 flex items-center text-[11px] text-slate-400 dark:border-neutral-800 dark:bg-neutral-950/60 font-mono">
                      0812-3456-7890
                    </div>
                  </div>

                  {/* Dynamic Custom Fields */}
                  {fields.length > 0 && (
                    <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-neutral-800">
                      {fields.map((f) => (
                        <div key={f.id} className="space-y-1">
                          <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {f.fieldType === "textarea" ? (
                              <AlignLeft className="size-3 text-slate-400" />
                            ) : f.fieldType === "number" ? (
                              <Hash className="size-3 text-slate-400" />
                            ) : f.fieldType === "email" ? (
                              <Mail className="size-3 text-slate-400" />
                            ) : f.fieldType === "date" ? (
                              <Calendar className="size-3 text-slate-400" />
                            ) : f.fieldType === "time" ? (
                              <Clock className="size-3 text-slate-400" />
                            ) : (
                              <FileText className="size-3 text-slate-400" />
                            )}
                            <span className="truncate">
                              {f.label || "Pertanyaan Tanpa Judul"}
                            </span>
                            {f.required && (
                              <span className="text-rose-500">*</span>
                            )}
                          </label>

                          {f.fieldType === "textarea" ? (
                            <div className="h-14 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 text-[10px] text-slate-400 dark:border-neutral-800 dark:bg-neutral-950/60 leading-tight">
                              {f.placeholder ||
                                t("form.previewTextareaPlaceholder")}
                            </div>
                          ) : f.fieldType === "select" ? (
                            <div className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 flex items-center justify-between text-[11px] text-slate-400 dark:border-neutral-800 dark:bg-neutral-950/60">
                              <span className="truncate">
                                {f.options && f.options.length > 0
                                  ? t("form.previewSelectOption", {
                                      label: f.label,
                                    })
                                  : t("form.previewNoOptions")}
                              </span>
                              <ChevronDown className="size-3 text-slate-400" />
                            </div>
                          ) : (
                            <div className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 flex items-center text-[11px] text-slate-400 dark:border-neutral-800 dark:bg-neutral-950/60">
                              {f.placeholder ||
                                t("form.previewInputPlaceholder", {
                                  label: f.label,
                                })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled
                      className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white shadow-xs opacity-95 transition-transform"
                    >
                      <Send className="size-3.5" />
                      <span>{t("form.preview.submitButton")}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Wahide Branding */}
              <div className="text-center">
                <span className="text-[10px] font-medium text-slate-400 dark:text-neutral-500">
                  {t("form.preview.poweredBy")}
                </span>
              </div>
            </div>
          ) : (
            /* Success Screen View */
            <div className="my-auto flex min-h-110 flex-col items-center justify-center p-3 text-center">
              <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="size-7 animate-in zoom-in-75 duration-200" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t("form.preview.successTitle")}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {successMessage ||
                    "Terima kasih! Formulir Anda telah berhasil kami terima."}
                </p>

                {/* WhatsApp Confirmation Callout */}
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50/80 p-2.5 text-left text-[11px] text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <MessageCircle className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <span>{t("form.preview.waNotice")}</span>
                </div>

                {/* Redirect Preview */}
                {redirectUrl && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[10px] text-slate-400 dark:text-neutral-400">
                      {t("form.preview.redirecting")}
                    </p>
                    <div className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
                      <span>{t("form.preview.continueNow")}</span>
                      <ExternalLink className="size-3" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Phone Navigation Indicator */}
        <div className="flex h-4 w-full items-center justify-center bg-neutral-950 shrink-0 pb-1">
          <div className="h-1 w-28 rounded-full bg-neutral-600" />
        </div>
      </div>
    </div>
  );
}
