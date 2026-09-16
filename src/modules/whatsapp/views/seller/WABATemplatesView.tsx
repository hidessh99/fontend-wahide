"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import {
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Phone,
  MessageSquare,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export interface WABATemplateMock {
  id: string;
  metaTemplateId: string;
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  metaStatus: "APPROVED" | "PENDING" | "REJECTED" | "DRAFT";
  rejectedReason?: string;
  headerType: "NONE" | "TEXT" | "IMAGE" | "DOCUMENT";
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons: Array<{
    type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
    text: string;
    value?: string;
  }>;
  exampleValues: Record<string, string>;
}

const DEFAULT_WABA_TEMPLATES: WABATemplateMock[] = [
  {
    id: "tpl_waba_01",
    metaTemplateId: "9823471029384",
    name: "konfirmasi_pesanan_pelanggan",
    category: "UTILITY",
    language: "id",
    metaStatus: "APPROVED",
    headerType: "TEXT",
    headerText: "Konfirmasi Pesanan",
    bodyText: "Halo {{1}}, pesanan Anda dengan nomor ID #{{2}} telah kami terima dan sedang diproses oleh tim kami. Estimasi pengiriman: {{3}}.",
    footerText: "Terima kasih telah berbelanja di Wahide Official Store",
    buttons: [
      { type: "URL", text: "Lacak Pesanan", value: "https://wahide.com/track/{{2}}" },
      { type: "QUICK_REPLY", text: "Bantuan CS" },
    ],
    exampleValues: {
      "1": "Budi Santoso",
      "2": "WH-9082",
      "3": "1 - 2 Hari Kerja",
    },
  },
  {
    id: "tpl_waba_02",
    metaTemplateId: "1238910238120",
    name: "kode_verifikasi_otp_login",
    category: "AUTHENTICATION",
    language: "id",
    metaStatus: "APPROVED",
    headerType: "NONE",
    bodyText: "Kode verifikasi Anda adalah {{1}}. Jangan berikan kode ini kepada siapapun demi keamanan akun Anda. Berlaku selama 5 menit.",
    footerText: "Pesan otomatis sistem keamanan",
    buttons: [
      { type: "QUICK_REPLY", text: "Salin Kode" },
    ],
    exampleValues: {
      "1": "892014",
    },
  },
  {
    id: "tpl_waba_03",
    metaTemplateId: "5910283019231",
    name: "promosi_spesial_akhir_bulan",
    category: "MARKETING",
    language: "id",
    metaStatus: "PENDING",
    headerType: "IMAGE",
    headerText: "Banner Promo",
    bodyText: "Hai {{1}}! Dapatkan diskon spesial hingga 40% untuk upgrade langganan paket {{2}} hanya di akhir pekan ini.",
    footerText: "Syarat & Ketentuan berlaku",
    buttons: [
      { type: "URL", text: "Klaim Diskon", value: "https://wahide.com/promo" },
    ],
    exampleValues: {
      "1": "Siti Nurhaliza",
      "2": "Enterprise Pro",
    },
  },
];

export function WABATemplatesView() {
  const [templates, setTemplates] = useState<WABATemplateMock[]>(DEFAULT_WABA_TEMPLATES);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Form State for Specialized WABA HSM Builder
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<"UTILITY" | "MARKETING" | "AUTHENTICATION">("UTILITY");
  const [formLanguage, setFormLanguage] = useState("id");
  const [formHeaderType, setFormHeaderType] = useState<"NONE" | "TEXT" | "IMAGE" | "DOCUMENT">("NONE");
  const [formHeaderText, setFormHeaderText] = useState("");
  const [formBodyText, setFormBodyText] = useState("");
  const [formFooterText, setFormFooterText] = useState("");
  const [exampleValues, setExampleValues] = useState<Record<string, string>>({});

  // Detect sequential {{n}} variables
  const detectedVariables = Array.from(
    new Set((formBodyText.match(/\{\{(\d+)\}\}/g) || []).map((m) => m.replace(/[\{\}]/g, "")))
  );

  const handleOpenEditor = () => {
    setFormName("");
    setFormCategory("UTILITY");
    setFormLanguage("id");
    setFormHeaderType("NONE");
    setFormHeaderText("");
    setFormBodyText("Halo {{1}}, pesanan Anda {{2}} telah dikonfirmasi.");
    setFormFooterText("");
    setExampleValues({ "1": "Nama Pembeli", "2": "Nomor Order" });
    setIsEditorOpen(true);
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Nama template resmi wajib diisi");
      return;
    }
    const cleanName = formName.toLowerCase().replace(/[^a-z0-9_]/g, "_");

    const newTpl: WABATemplateMock = {
      id: `tpl_waba_${Date.now()}`,
      metaTemplateId: `meta_${Date.now()}`,
      name: cleanName,
      category: formCategory,
      language: formLanguage,
      metaStatus: "PENDING",
      headerType: formHeaderType,
      headerText: formHeaderText || undefined,
      bodyText: formBodyText,
      footerText: formFooterText || undefined,
      buttons: [
        { type: "URL", text: "Buka Tautan", value: "https://wahide.com" },
      ],
      exampleValues,
    };

    setTemplates([newTpl, ...templates]);
    setIsEditorOpen(false);
    toast.success("Template HSM berhasil diajukan ke Meta untuk review!");
  };

  const filteredTemplates = templates.filter((tpl) => {
    const matchSearch =
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tpl.bodyText.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "ALL" || tpl.category === categoryFilter;
    const matchStatus = statusFilter === "ALL" || tpl.metaStatus === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <ShieldCheck className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Template Resmi Meta WABA (HSM)
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            Kelola template pesan terverifikasi Meta WhatsApp Business Platform untuk transmisi siaran massal resmi.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenEditor}
          className="bg-wise-green text-dark-green hover:bg-wise-green/90 text-xs font-bold shadow-sm"
        >
          <Plus className="mr-1.5 size-3.5" />
          <span>Buat Template HSM</span>
        </Button>
      </div>

      {/* Info Card: Meta HSM Rules */}
      <div className="border-border rounded-2xl border bg-muted/40 p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Info className="size-4 text-wise-green" />
          <span>Ketentuan Resmi Template Meta Cloud API (Graph API v20.0):</span>
        </div>
        <p className="text-foreground-secondary text-xs">
          Template WhatsApp Official (HSM) wajib dikurasi oleh sistem AI & tim peninjau Meta sebelum dapat digunakan.
          Variabel wajib menggunakan penomoran berurutan (<code className="bg-muted px-1 rounded font-mono">{"{{1}}"}</code>, <code className="bg-muted px-1 rounded font-mono">{"{{2}}"}</code>) dan tidak diperkenankan menggunakan karakter Spintax.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="text-foreground-muted absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Cari template resmi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <NativeSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs w-36 h-9"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="MARKETING">Marketing</option>
            <option value="UTILITY">Utility</option>
            <option value="AUTHENTICATION">Authentication</option>
          </NativeSelect>

          <NativeSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs w-36 h-9"
          >
            <option value="ALL">Semua Status</option>
            <option value="APPROVED">Disetujui (Approved)</option>
            <option value="PENDING">Review (Pending)</option>
            <option value="REJECTED">Ditolak (Rejected)</option>
            <option value="DRAFT">Draft</option>
          </NativeSelect>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="size-10" />}
          title="Tidak Ada Template WABA Ditemukan"
          description="Buat template resmi Meta pertama Anda untuk mulai mengirimkan notifikasi dan siaran WhatsApp centang hijau."
          action={
            <Button
              size="sm"
              onClick={handleOpenEditor}
              className="bg-wise-green text-dark-green hover:bg-wise-green/90 font-bold text-xs"
            >
              <Plus className="mr-1.5 size-3.5" />
              <span>Buat Template HSM</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-surface border-border flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all duration-150 hover:shadow-md dark:bg-[#151614]"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                    {tpl.category}
                  </Badge>

                  {tpl.metaStatus === "APPROVED" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      <span>APPROVED</span>
                    </span>
                  ) : tpl.metaStatus === "PENDING" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      <Clock className="size-3" />
                      <span>IN REVIEW</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
                      <AlertCircle className="size-3" />
                      <span>REJECTED</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-foreground text-sm font-bold font-mono tracking-tight">
                    {tpl.name}
                  </h3>
                  <span className="text-[11px] text-foreground-muted font-mono">Bahasa: {tpl.language}</span>
                </div>

                {/* WhatsApp Official Bubble Live Mockup */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 p-3.5 space-y-2">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="size-3" />
                    <span>WhatsApp Official Bubble</span>
                  </div>

                  {tpl.headerText && (
                    <p className="font-bold text-xs text-foreground">{tpl.headerText}</p>
                  )}

                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {tpl.bodyText}
                  </p>

                  {tpl.footerText && (
                    <p className="text-[10px] text-foreground-muted italic pt-1 border-t border-border/40">
                      {tpl.footerText}
                    </p>
                  )}

                  {/* Interactive Buttons Preview */}
                  {tpl.buttons && tpl.buttons.length > 0 && (
                    <div className="space-y-1 pt-1.5 border-t border-border/40">
                      {tpl.buttons.map((btn, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-surface dark:bg-[#181917] py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-xs"
                        >
                          {btn.type === "PHONE_NUMBER" ? (
                            <Phone className="size-3" />
                          ) : btn.type === "URL" ? (
                            <ExternalLink className="size-3" />
                          ) : (
                            <MessageSquare className="size-3" />
                          )}
                          <span>{btn.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-border/60 flex items-center justify-between border-t pt-3 mt-4 text-[11px] text-foreground-muted font-mono">
                <span>ID: {tpl.metaTemplateId.slice(0, 8)}...</span>
                <span>{Object.keys(tpl.exampleValues).length} variabel</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Specialized WABA Template Builder Modal */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">Buat Template Resmi Meta (HSM)</DialogTitle>
                <DialogDescription className="text-xs">
                  Susun komponen pesan sesuai spesifikasi resmi Meta Graph API v20.0 untuk kurasi review.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSaveDraft} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tplName" className="text-xs font-semibold">Nama Template (Snake_Case)</Label>
                <Input
                  id="tplName"
                  placeholder="e.g. konfirmasi_tiket_event"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tplCategory" className="text-xs font-semibold">Kategori Meta</Label>
                <NativeSelect
                  id="tplCategory"
                  value={formCategory}
                  onChange={(e) =>
                    setFormCategory(
                      e.target.value as "UTILITY" | "MARKETING" | "AUTHENTICATION",
                    )
                  }
                  className="text-xs h-9"
                >
                  <option value="UTILITY">Utility (Transaksi/Alert)</option>
                  <option value="MARKETING">Marketing (Promosi)</option>
                  <option value="AUTHENTICATION">Authentication (OTP)</option>
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="tplBody" className="text-xs font-semibold">Konten Utama (Body Text)</Label>
                <span className="text-[11px] text-foreground-muted">Gunakan {"{{1}}"}, {"{{2}}"} untuk variabel</span>
              </div>
              <Textarea
                id="tplBody"
                rows={4}
                value={formBodyText}
                onChange={(e) => setFormBodyText(e.target.value)}
                placeholder="Halo {{1}}, pesanan {{2}} Anda telah berhasil dibuat."
                className="text-xs"
                required
              />
            </div>

            {/* Dynamic Example Values Input (Mandatory for Meta Review) */}
            {detectedVariables.length > 0 && (
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Sparkles className="size-3.5 text-wise-green" />
                  <span>Contoh Nilai Variabel (Wajib untuk Kurasi Review Meta):</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {detectedVariables.map((v) => (
                    <div key={v} className="space-y-1">
                      <Label className="text-[11px] font-mono text-foreground-secondary">Variabel {"{{" + v + "}}"}</Label>
                      <Input
                        value={exampleValues[v] || ""}
                        onChange={(e) => setExampleValues({ ...exampleValues, [v]: e.target.value })}
                        placeholder={`Contoh nilai {{${v}}}`}
                        className="text-xs h-8"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="tplFooter" className="text-xs font-semibold">Footer Disclaimer (Opsional - Maks 60 Karakter)</Label>
              <Input
                id="tplFooter"
                maxLength={60}
                placeholder="Balas STOP untuk berhenti berlangganan"
                value={formFooterText}
                onChange={(e) => setFormFooterText(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditorOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-wise-green text-dark-green hover:bg-wise-green/90 font-bold text-xs"
              >
                Ajukan ke Meta (Review)
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
