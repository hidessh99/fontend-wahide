"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { ShieldCheck, Sparkles, ExternalLink } from "lucide-react";
import { WABATemplateMock } from "@/modules/whatsapp/views/seller/WABATemplatesView";

export const DEFAULT_CAMPAIGN_WABA_TEMPLATES: WABATemplateMock[] = [
  {
    id: "tpl_waba_promo",
    metaTemplateId: "9823471029381",
    name: "promo_flash_sale_omnichannel",
    category: "MARKETING",
    language: "id",
    metaStatus: "APPROVED",
    headerType: "TEXT",
    headerText: "PENAWARAN SPESIAL HARI INI",
    bodyText:
      "Halo {{1}}! Nikmati diskon eksklusif hingga {{2}} untuk pembelian produk favoritmu hari ini. Gunakan voucher {{3}} saat checkout sebelum kehabisan!",
    footerText: "Wahide Omnichannel Gateway • Balas STOP untuk berhenti berlangganan",
    buttons: [
      { type: "URL", text: "Klaim Diskon Sekarang", value: "https://wahide.id/promo" },
    ],
    exampleValues: { "1": "Budi Santoso", "2": "50%", "3": "FLASH50" },
  },
  {
    id: "tpl_waba_order",
    metaTemplateId: "9823471029384",
    name: "konfirmasi_pesanan_pelanggan",
    category: "UTILITY",
    language: "id",
    metaStatus: "APPROVED",
    headerType: "TEXT",
    headerText: "KONFIRMASI PESANAN RESMI",
    bodyText:
      "Halo {{1}}, terima kasih telah berbelanja di toko kami! Pesanan dengan ID #{{2}} telah berhasil dikonfirmasi dan sedang dipersiapkan.",
    footerText: "Layanan Pelanggan Resmi",
    buttons: [
      { type: "URL", text: "Lacak Pesanan", value: "https://wahide.id/track" },
    ],
    exampleValues: { "1": "Kak Budi", "2": "ORD-2026-99" },
  },
  {
    id: "tpl_waba_announcement",
    metaTemplateId: "9823471029389",
    name: "pengumuman_layanan_resmi",
    category: "UTILITY",
    language: "id",
    metaStatus: "APPROVED",
    headerType: "NONE",
    bodyText:
      "Pemberitahuan resmi untuk {{1}}: Kami sedang meningkatkan performa gateway sistem. Silakan akses portal terbaru melalui tautan di bawah.",
    footerText: "Dukungan Teknis Wahide",
    buttons: [
      { type: "URL", text: "Buka Dashboard", value: "https://wahide.id/dashboard" },
    ],
    exampleValues: { "1": "Seluruh Mitra" },
  },
];

interface WabaTemplateCampaignPickerProps {
  selectedTemplateName: string;
  onSelectTemplate: (template: WABATemplateMock, paramsMapping: Record<string, string>) => void;
  className?: string;
}

export function WabaTemplateCampaignPicker({
  selectedTemplateName,
  onSelectTemplate,
  className,
}: WabaTemplateCampaignPickerProps) {
  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    DEFAULT_CAMPAIGN_WABA_TEMPLATES[0].id,
  );

  const activeTemplate = useMemo(() => {
    return (
      DEFAULT_CAMPAIGN_WABA_TEMPLATES.find(
        (t) => t.name === selectedTemplateName || t.id === activeTemplateId,
      ) || DEFAULT_CAMPAIGN_WABA_TEMPLATES[0]
    );
  }, [selectedTemplateName, activeTemplateId]);

  const [paramValues, setParamValues] = useState<Record<string, string>>(
    activeTemplate.exampleValues || {},
  );

  // Parse {{1}}, {{2}} from bodyText
  const extractedParams = useMemo(() => {
    const matches = activeTemplate.bodyText.match(/\{\{(\d+)\}\}/g) || [];
    return Array.from(new Set(matches)).map((m) => m.replace(/[{}]/g, ""));
  }, [activeTemplate]);

  const handleTemplateChange = (templateId: string) => {
    const found = DEFAULT_CAMPAIGN_WABA_TEMPLATES.find((t) => t.id === templateId);
    if (found) {
      setActiveTemplateId(found.id);
      setParamValues(found.exampleValues || {});
      onSelectTemplate(found, found.exampleValues || {});
    }
  };

  const handleParamChange = (key: string, val: string) => {
    const updated = { ...paramValues, [key]: val };
    setParamValues(updated);
    onSelectTemplate(activeTemplate, updated);
  };

  // Generate rendered preview text
  const renderedBody = useMemo(() => {
    let text = activeTemplate.bodyText;
    extractedParams.forEach((num) => {
      const val = paramValues[num] || `{{${num}}}`;
      text = text.replaceAll(`{{${num}}}`, val);
    });
    return text;
  }, [activeTemplate.bodyText, extractedParams, paramValues]);

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Template Selector Dropdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground">
              Pilih Template Resmi Meta (HSM APPROVED)
            </Label>
            <Badge variant="outline" className="border-sky-500/30 text-sky-600 dark:text-sky-400 gap-1 text-[10px] font-bold">
              <ShieldCheck className="size-3" />
              Meta Approved
            </Badge>
          </div>
          <NativeSelect
            value={activeTemplate.id}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full text-xs font-medium"
          >
            {DEFAULT_CAMPAIGN_WABA_TEMPLATES.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name} ({tpl.category} • {tpl.language.toUpperCase()})
              </option>
            ))}
          </NativeSelect>
        </div>

        {/* Dynamic Parameter Mapping Inputs */}
        {extractedParams.length > 0 && (
          <div className="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Sparkles className="size-3.5 text-sky-500" />
              <span>Pemetaan Variabel Template</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {extractedParams.map((paramNum) => (
                <div key={paramNum} className="space-y-1">
                  <Label className="text-[11px] font-semibold text-foreground-secondary">
                    Variabel {`{{${paramNum}}}`}:
                  </Label>
                  <Input
                    value={paramValues[paramNum] || ""}
                    onChange={(e) => handleParamChange(paramNum, e.target.value)}
                    placeholder={`Isi nilai {{${paramNum}}} (contoh: {nama})`}
                    className="h-8 text-xs font-medium"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Meta HSM Template Card Preview */}
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-sky-700 dark:text-sky-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" />
              <span>Pratinjau Pesan Template Meta WABA</span>
            </div>
            <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px]">
              {activeTemplate.category}
            </span>
          </div>

          <div className="rounded-lg bg-surface border border-border p-3.5 shadow-xs space-y-2">
            {activeTemplate.headerText && (
              <p className="text-xs font-black uppercase tracking-wider text-foreground">
                {activeTemplate.headerText}
              </p>
            )}
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {renderedBody}
            </p>
            {activeTemplate.footerText && (
              <p className="text-[10px] text-foreground-muted border-t border-border/60 pt-1.5">
                {activeTemplate.footerText}
              </p>
            )}
            {activeTemplate.buttons && activeTemplate.buttons.length > 0 && (
              <div className="pt-2 border-t border-border/60 flex flex-wrap gap-1.5">
                {activeTemplate.buttons.map((btn, bIdx) => (
                  <div
                    key={bIdx}
                    className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 px-2.5 py-1 text-[11px] font-bold"
                  >
                    <ExternalLink className="size-3" />
                    <span>{btn.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
