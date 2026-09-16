"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import { WABATemplateMock } from "@/modules/whatsapp/views/seller/WABATemplatesView";

export const DEFAULT_REMINDER_WABA_TEMPLATES: WABATemplateMock[] = [
  {
    id: "tpl_waba_remind_h1",
    metaTemplateId: "9823471029111",
    name: "pengingat_jadwal_reservasi_h1",
    category: "UTILITY",
    language: "id",
    metaStatus: "APPROVED",
    headerType: "TEXT",
    headerText: "PENGINGAT JADWAL RESERVASI",
    bodyText:
      "Halo {{1}}! Mengingatkan bahwa besok tanggal {{2}} Anda memiliki jadwal: {{3}}. Mohon hadir 10 menit sebelum waktu kunjungan. Terima kasih!",
    footerText: "Wahide Omnichannel Service • Balas BATAL jika ingin mengubah jadwal",
    buttons: [
      { type: "URL", text: "Lihat Lokasi & Detail", value: "https://wahide.id/booking" },
    ],
    exampleValues: { "1": "Budi Santoso", "2": "17 Sep 2026", "3": "Konsultasi Dokter" },
  },
  {
    id: "tpl_waba_remind_hari_h",
    metaTemplateId: "9823471029222",
    name: "pengingat_hari_h_kunjungan",
    category: "UTILITY",
    language: "id",
    metaStatus: "APPROVED",
    headerType: "TEXT",
    headerText: "KUNJUNGAN HARI INI",
    bodyText:
      "Halo {{1}}! Hari ini adalah hari kunjungan Anda untuk {{3}}. Tim kami telah siap menyambut kedatangan Anda. Sampai jumpa!",
    footerText: "Wahide Omnichannel Service",
    buttons: [
      { type: "PHONE_NUMBER", text: "Hubungi Resepsionis", value: "+628123456789" },
    ],
    exampleValues: { "1": "Budi Santoso", "3": "Perawatan Gigi" },
  },
  {
    id: "tpl_waba_followup_h3",
    metaTemplateId: "9823471029333",
    name: "follow_up_kepuasan_layanan",
    category: "MARKETING",
    language: "id",
    metaStatus: "APPROVED",
    headerType: "TEXT",
    headerText: "TERIMA KASIH ATAS KUNJUNGAN ANDA",
    bodyText:
      "Halo {{1}}! Terima kasih telah berkunjung pada {{2}}. Bagaimana pengalaman Anda dengan layanan {{3}} kami? Berikan ulasan singkat Anda!",
    footerText: "Wahide Customer Care",
    buttons: [
      { type: "URL", text: "Beri Ulasan Bintang 5", value: "https://wahide.id/review" },
    ],
    exampleValues: { "1": "Budi Santoso", "2": "14 Sep 2026", "3": "Potong Rambut" },
  },
];

interface ReminderWabaTemplatePickerProps {
  selectedTemplateId?: string;
  onSelectTemplate: (templateId: string, params: Record<string, string>) => void;
  initialParams?: Record<string, string>;
  className?: string;
}

export function ReminderWabaTemplatePicker({
  selectedTemplateId,
  onSelectTemplate,
  initialParams = {},
  className,
}: ReminderWabaTemplatePickerProps) {
  const templates = DEFAULT_REMINDER_WABA_TEMPLATES;
  const activeTemplate = useMemo(() => {
    return (
      templates.find((t) => t.id === selectedTemplateId) ||
      templates[0]
    );
  }, [templates, selectedTemplateId]);

  const [params, setParams] = useState<Record<string, string>>({
    "1": initialParams["1"] || "{{nama}}",
    "2": initialParams["2"] || "{{tanggal}}",
    "3": initialParams["3"] || "{{catatan}}",
    ...initialParams,
  });

  // Extract variables {{1}}, {{2}} from bodyText
  const extractedVariables = useMemo(() => {
    if (!activeTemplate) return [];
    const matches = activeTemplate.bodyText.match(/\{\{(\d+)\}\}/g) || [];
    return Array.from(new Set(matches.map((m) => m.replace(/[{}]/g, ""))));
  }, [activeTemplate]);

  const handleParamChange = (index: string, val: string) => {
    const updated = { ...params, [index]: val };
    setParams(updated);
    if (activeTemplate) {
      onSelectTemplate(activeTemplate.id, updated);
    }
  };

  const handleSelectTemplateChange = (tplId: string) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (tpl) {
      const initial: Record<string, string> = {
        "1": "{{nama}}",
        "2": "{{tanggal}}",
        "3": "{{catatan}}",
      };
      setParams(initial);
      onSelectTemplate(tpl.id, initial);
    }
  };

  // Render preview with variable substitution
  const renderedPreview = useMemo(() => {
    if (!activeTemplate) return "";
    let text = activeTemplate.bodyText;
    extractedVariables.forEach((v) => {
      const val = params[v] || `{{${v}}}`;
      text = text.replaceAll(`{{${v}}}`, val);
    });
    return text;
  }, [activeTemplate, extractedVariables, params]);

  return (
    <div className={`flex flex-col gap-4 ${className || ""}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-sky-500" />
            <span>Pilih Template Resmi Meta (HSM Approved)</span>
          </Label>
          <Badge
            variant="outline"
            className="text-[10px] bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-800"
          >
            {activeTemplate?.category}
          </Badge>
        </div>

        <NativeSelect
          value={activeTemplate?.id || ""}
          onChange={(e) => handleSelectTemplateChange(e.target.value)}
          className="text-xs bg-surface border-border"
        >
          {templates.map((tpl) => (
            <option key={tpl.id} value={tpl.id}>
              {tpl.name} ({tpl.category} • {tpl.language.toUpperCase()})
            </option>
          ))}
        </NativeSelect>
        <p className="text-[11px] text-foreground-muted flex items-center gap-1">
          <Sparkles className="size-3 text-sky-500" />
          Template resmi Meta terverifikasi. Pengingat dijamin terkirim tanpa risiko blokir.
        </p>
      </div>

      {/* Parameter Inputs */}
      {extractedVariables.length > 0 && (
        <div className="flex flex-col gap-2.5 p-3.5 rounded-xl border border-border/70 bg-surface-raised/40">
          <span className="text-[11px] font-bold text-foreground">
            Pemetaan Variabel Template:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {extractedVariables.map((varNum) => {
              const placeholderLabel =
                varNum === "1"
                  ? "Variabel {{1}} (Nama):"
                  : varNum === "2"
                  ? "Variabel {{2}} (Tanggal):"
                  : "Variabel {{3}} (Jadwal/Catatan):";
              return (
                <div key={varNum} className="flex flex-col gap-1">
                  <Label className="text-[10px] font-medium text-foreground-muted">
                    {placeholderLabel}
                  </Label>
                  <Input
                    value={params[varNum] || ""}
                    onChange={(e) => handleParamChange(varNum, e.target.value)}
                    placeholder={`{{${varNum}}}`}
                    className="text-xs h-8 bg-surface border-border font-mono"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Preview Card */}
      {activeTemplate && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-[11px] font-semibold text-foreground-muted">
            Live Preview Kartu Meta WABA:
          </Label>
          <div className="p-4 rounded-2xl border border-sky-300 dark:border-sky-900 bg-linear-to-b from-sky-50/50 to-surface dark:from-sky-950/20 dark:to-surface shadow-xs text-xs space-y-2">
            {activeTemplate.headerText && (
              <div className="font-bold text-[11px] tracking-wider text-sky-700 dark:text-sky-400 uppercase">
                {activeTemplate.headerText}
              </div>
            )}
            <div className="text-foreground text-xs leading-relaxed whitespace-pre-wrap">
              {renderedPreview}
            </div>
            {activeTemplate.footerText && (
              <div className="text-[10px] text-foreground-muted border-t border-border/50 pt-2">
                {activeTemplate.footerText}
              </div>
            )}
            {activeTemplate.buttons && activeTemplate.buttons.length > 0 && (
              <div className="pt-2 flex flex-col gap-1.5 border-t border-border/60">
                {activeTemplate.buttons.map((btn, idx) => (
                  <div
                    key={idx}
                    className="w-full py-1.5 px-3 rounded-lg border border-sky-200 dark:border-sky-800/80 bg-sky-100/50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 font-semibold text-center text-xs flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="size-3" />
                    <span>{btn.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
