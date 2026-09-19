"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const TemplatePresetPickerModal = dynamic(
  () =>
    import(
      "@/modules/template/components/seller/preset/TemplatePresetPickerModal"
    ).then((m) => m.TemplatePresetPickerModal),
  { ssr: false },
);
import { TemplatePreset } from "@/modules/template/data/templatePresets";
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
  ChevronDown,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

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

const WABA_TEMPLATES_STORAGE_KEY = "wahide_waba_seller_templates";

export function WABATemplatesView() {
  const { t } = useI18n();
  const [templates, setTemplates] = useState<WABATemplateMock[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(WABA_TEMPLATES_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(WABA_TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch {
      // ignore
    }
  }, [templates]);

  const handleDeleteTemplate = (id: string, name: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success(`Template "${name}" berhasil dihapus`);
  };

  const handleCopyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success("Konten template berhasil disalin ke clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Gagal menyalin pesan");
    }
  };

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
    setIsPickerOpen(true);
  };

  const handleSelectPreset = (preset: TemplatePreset) => {
    if (preset.isBlank) {
      setFormName("");
      setFormCategory("UTILITY");
      setFormLanguage("id");
      setFormHeaderType("NONE");
      setFormHeaderText("");
      setFormBodyText("");
      setFormFooterText("");
      setExampleValues({});
    } else {
      const w = preset.content.waba;
      setFormName(preset.title.toLowerCase().replace(/[^a-z0-9_]/g, "_"));
      setFormCategory(w.category);
      setFormLanguage("id");
      setFormHeaderType(w.headerType || "NONE");
      setFormHeaderText(w.headerText || "");
      setFormBodyText(w.bodyText);
      setFormFooterText(w.footerText || "");
      setExampleValues(w.exampleValues || {});
    }
    setIsEditorOpen(true);
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error(t("whatsapp.wabaTemplates.errNameRequired"));
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
    toast.success(t("whatsapp.wabaTemplates.toastSubmitted"));
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
              {t("whatsapp.wabaTemplates.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            {t("whatsapp.wabaTemplates.subtitle")}
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenEditor}
          className="bg-wise-green text-dark-green hover:bg-wise-green/90 text-xs font-bold shadow-sm"
        >
          <Plus className="mr-1.5 size-3.5" />
          <span>{t("whatsapp.wabaTemplates.createBtn")}</span>
        </Button>
      </div>

      {/* Info Card: Meta HSM Rules (Collapsible) */}
      <div className="border-border rounded-2xl border bg-muted/40 p-3.5 sm:p-4 space-y-2 transition-all">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Info className="size-4 text-wise-green shrink-0" />
            <span>{t("whatsapp.wabaTemplates.rulesTitle")}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowRules(!showRules)}
            className="text-xs font-semibold text-foreground-muted hover:text-foreground cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>{showRules ? "Sembunyikan" : "Pelajari Ketentuan"}</span>
            <ChevronDown className={cn("size-3.5 transition-transform", showRules && "rotate-180")} />
          </button>
        </div>
        {showRules && (
          <p className="text-foreground-secondary text-xs pt-1.5 leading-relaxed border-t border-border/40">
            {t("whatsapp.wabaTemplates.rulesDesc")}
          </p>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="text-foreground-muted absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder={t("whatsapp.wabaTemplates.searchPlaceholder")}
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
            <option value="ALL">{t("whatsapp.wabaTemplates.catAll")}</option>
            <option value="MARKETING">{t("whatsapp.wabaTemplates.formCatMarketing")}</option>
            <option value="UTILITY">{t("whatsapp.wabaTemplates.formCatUtility")}</option>
            <option value="AUTHENTICATION">{t("whatsapp.wabaTemplates.formCatAuth")}</option>
          </NativeSelect>

          <NativeSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs w-36 h-9"
          >
            <option value="ALL">{t("whatsapp.wabaTemplates.statusAll")}</option>
            <option value="APPROVED">{t("whatsapp.wabaTemplates.metaStatusApproved")}</option>
            <option value="PENDING">{t("whatsapp.wabaTemplates.metaStatusPending")}</option>
            <option value="REJECTED">{t("whatsapp.wabaTemplates.metaStatusRejected")}</option>
            <option value="DRAFT">{t("whatsapp.wabaTemplates.metaStatusDraft")}</option>
          </NativeSelect>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="size-10 text-emerald-600 dark:text-emerald-400" />}
          title={
            templates.length === 0
              ? t("whatsapp.wabaTemplates.emptyTitle")
              : "Tidak Ada Template yang Cocok"
          }
          description={
            templates.length === 0
              ? t("whatsapp.wabaTemplates.emptyDesc")
              : "Coba sesuaikan kata kunci pencarian atau reset filter kategori & status Meta Anda."
          }
          action={
            <Button
              size="sm"
              onClick={handleOpenEditor}
              className="bg-wise-green text-dark-green hover:bg-wise-green/90 font-bold text-xs rounded-full px-4 shadow-xs cursor-pointer"
            >
              <Plus className="mr-1.5 size-3.5" />
              <span>{t("whatsapp.wabaTemplates.createBtn")}</span>
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
                      <span>{t("whatsapp.wabaTemplates.statusApproved")}</span>
                    </span>
                  ) : tpl.metaStatus === "PENDING" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                      <Clock className="size-3" />
                      <span>{t("whatsapp.wabaTemplates.statusInReview")}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
                      <AlertCircle className="size-3" />
                      <span>{t("whatsapp.wabaTemplates.statusRejected")}</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-foreground text-sm font-bold font-mono tracking-tight">
                    {tpl.name}
                  </h3>
                  <span className="text-[11px] text-foreground-muted font-mono">{t("whatsapp.wabaTemplates.languageLabel", { lang: tpl.language })}</span>
                </div>

                {/* WhatsApp Official Bubble Live Mockup */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/10 p-3.5 space-y-2">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="size-3" />
                    <span>{t("whatsapp.wabaTemplates.bubbleTitle")}</span>
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

              {/* Card Footer with Copy and Delete Actions */}
              <div className="border-border/60 flex items-center justify-between border-t pt-3 mt-4 text-[11px] text-foreground-muted font-mono">
                <span>ID: {tpl.metaTemplateId.slice(0, 8)}...</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => handleCopyText(tpl.id, tpl.bodyText)}
                    className="h-7 px-2.5 rounded-lg text-xs gap-1 cursor-pointer"
                    title="Salin Pesan"
                  >
                    {copiedId === tpl.id ? (
                      <>
                        <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-sans">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span className="font-sans">Salin</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}
                    className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    title="Hapus Template"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
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
                <DialogTitle className="text-base font-bold">{t("whatsapp.wabaTemplates.dialogTitle")}</DialogTitle>
                <DialogDescription className="text-xs">
                  {t("whatsapp.wabaTemplates.dialogDesc")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSaveDraft} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tplName" className="text-xs font-semibold">{t("whatsapp.wabaTemplates.formNameLabel")}</Label>
                <Input
                  id="tplName"
                  placeholder={t("whatsapp.wabaTemplates.formNamePlaceholder")}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                  className="font-mono text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tplCategory" className="text-xs font-semibold">{t("whatsapp.wabaTemplates.formCatLabel")}</Label>
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
                  <option value="UTILITY">{t("whatsapp.wabaTemplates.formCatUtility")}</option>
                  <option value="MARKETING">{t("whatsapp.wabaTemplates.formCatMarketing")}</option>
                  <option value="AUTHENTICATION">{t("whatsapp.wabaTemplates.formCatAuth")}</option>
                </NativeSelect>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="tplBody" className="text-xs font-semibold">{t("whatsapp.wabaTemplates.formBodyLabel")}</Label>
                <span className="text-[11px] text-foreground-muted">{t("whatsapp.wabaTemplates.formBodyHint")}</span>
              </div>
              <Textarea
                id="tplBody"
                rows={4}
                value={formBodyText}
                onChange={(e) => setFormBodyText(e.target.value)}
                placeholder={t("whatsapp.wabaTemplates.formBodyPlaceholder")}
                className="text-xs"
                required
              />
            </div>

            {/* Dynamic Example Values Input (Mandatory for Meta Review) */}
            {detectedVariables.length > 0 && (
              <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Sparkles className="size-3.5 text-wise-green" />
                  <span>{t("whatsapp.wabaTemplates.exampleValuesTitle")}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {detectedVariables.map((v) => (
                    <div key={v} className="space-y-1">
                      <Label className="text-[11px] font-mono text-foreground-secondary">{t("whatsapp.wabaTemplates.exampleValueLabel", { var: "{{" + v + "}}" })}</Label>
                      <Input
                        value={exampleValues[v] || ""}
                        onChange={(e) => setExampleValues({ ...exampleValues, [v]: e.target.value })}
                        placeholder={t("whatsapp.wabaTemplates.exampleValuePlaceholder", { var: `{{${v}}}` })}
                        className="text-xs h-8"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="tplFooter" className="text-xs font-semibold">{t("whatsapp.wabaTemplates.formFooterLabel")}</Label>
              <Input
                id="tplFooter"
                maxLength={60}
                placeholder={t("whatsapp.wabaTemplates.formFooterPlaceholder")}
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
                {t("whatsapp.wabaTemplates.cancelBtn")}
              </Button>
              <Button
                type="submit"
                className="bg-wise-green text-dark-green hover:bg-wise-green/90 font-bold text-xs"
              >
                {t("whatsapp.wabaTemplates.submitReviewBtn")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Template Preset Picker Modal */}
      {isPickerOpen && (
        <TemplatePresetPickerModal
          isOpen={isPickerOpen}
          lockChannel="META_WABA_OFFICIAL"
          onClose={() => setIsPickerOpen(false)}
          onSelectPreset={handleSelectPreset}
        />
      )}
    </div>
  );
}
