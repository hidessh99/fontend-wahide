"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Bot,
  Workflow,
  Inbox,
  Save,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Table as TableIcon,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useSpreadsheet } from "../hooks/useSpreadsheet";
import { useDevices } from "@/modules/whatsapp/hooks/useDevices";
import { toast } from "sonner";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export function SpreadsheetConfigView() {
  const { t } = useI18n();
  const { devices } = useDevices();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [channelType, setChannelType] = useState<string>("whatsapp");
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [syncInterval, setSyncInterval] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [testInput, setTestInput] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const {
    config,
    isSaving,
    isSyncing,
    isPreviewing,
    isTesting,
    previewResult,
    testResult,
    saveConfig,
    previewSheet,
    syncNow,
    testMatch,
  } = useSpreadsheet(selectedDeviceId);

  // Auto-select first device if available
  useEffect(() => {
    if (!selectedDeviceId && devices.length > 0) {
      setSelectedDeviceId(devices[0].id);
    }
  }, [devices, selectedDeviceId]);

  // Sync state when config loads
  useEffect(() => {
    if (config) {
      setSheetUrl(config.sheet_url || "");
      setSyncInterval(config.sync_interval_minutes || 30);
      setIsActive(config.is_active);
      setChannelType(config.channel_type || "whatsapp");
    } else {
      setSheetUrl("");
      setSyncInterval(30);
      setIsActive(true);
    }
  }, [config]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceId) {
      toast.error(t("autoreply.spreadsheet.selectDeviceWarning"));
      return;
    }
    if (!sheetUrl.trim()) {
      toast.error(t("autoreply.spreadsheet.emptyUrlWarning"));
      return;
    }

    const ok = await saveConfig({
      device_id: selectedDeviceId,
      channel_type: channelType,
      sheet_url: sheetUrl.trim(),
      sync_interval_minutes: syncInterval,
      is_active: isActive,
    });

    if (ok) {
      toast.success(t("autoreply.spreadsheet.saveSuccess"));
    }
  };

  const handlePreview = async () => {
    if (!sheetUrl.trim()) {
      toast.error(t("autoreply.spreadsheet.emptyUrlWarning"));
      return;
    }
    const res = await previewSheet(sheetUrl.trim());
    if (res && res.sample_rows?.length > 0) {
      setIsPreviewOpen(true);
    } else {
      toast.error(t("autoreply.spreadsheet.previewFailed"));
    }
  };

  const handleTestMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || !selectedDeviceId) return;
    await testMatch(selectedDeviceId, testInput.trim());
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8 pb-12">
      {/* Top Header & Navigation Tabs */}
      <div className="space-y-4">
        <div>
          <h1 className="text-foreground text-xl sm:text-2xl font-black tracking-tight">
            {t("autoreply.spreadsheet.title")}
          </h1>
          <p className="text-foreground-muted text-xs sm:text-sm mt-1 max-w-2xl">
            {t("autoreply.spreadsheet.subtitle")}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-border flex items-center gap-1.5 sm:gap-2 border-b pb-3 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <Link
            href="/autoreply"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
          >
            <Bot className="size-3.5" />
            <span>{t("autoreply.tabs.rules")}</span>
          </Link>
          <Link
            href="/autoreply/flow"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
          >
            <Workflow className="size-3.5" />
            <span>{t("autoreply.tabs.flows")}</span>
          </Link>
          <Link
            href="/autoreply/submission"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
          >
            <Inbox className="size-3.5" />
            <span>{t("autoreply.tabs.submissions")}</span>
          </Link>
          <Link
            href="/autoreply/spreadsheet"
            className="flex items-center gap-2 rounded-xl bg-wise-green px-3.5 py-1.5 text-xs font-bold text-dark-green shadow-xs whitespace-nowrap"
          >
            <FileSpreadsheet className="size-3.5" />
            <span>{t("autoreply.tabs.spreadsheet")}</span>
          </Link>
        </div>
      </div>

      {/* Device Selector Card */}
      <Card className="border-border bg-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border p-5 shadow-xs">
        <div className="space-y-1">
          <label className="text-foreground text-xs font-bold">
            {t("autoreply.spreadsheet.deviceSelect")}
          </label>
          <p className="text-foreground-muted text-[11px]">
            Setiap perangkat WhatsApp/Telegram memiliki konfigurasi Google
            Sheets tersendiri.
          </p>
        </div>
        <NativeSelect
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          variant="rounded"
          className="min-w-[240px] text-xs font-bold"
        >
          <NativeSelectOption value="">
            {t("autoreply.spreadsheet.selectDevicePlaceholder")}
          </NativeSelectOption>
          {devices.map((d) => (
            <NativeSelectOption key={d.id} value={d.id}>
              {d.name || d.phone || d.id} ({d.status})
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </Card>

      {/* Main Grid: Settings & Guide */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Form Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSave}
            className="border-border bg-surface rounded-2xl border p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-wise-green/10 p-2 text-dark-green dark:text-wise-green">
                  <FileSpreadsheet className="size-5" />
                </div>
                <div>
                  <h3 className="text-foreground text-sm font-bold">
                    Konfigurasi Spreadsheet
                  </h3>
                  <span className="text-foreground-muted text-[11px]">
                    {config?.last_synced_at
                      ? `Terakhir sinkron: ${new Date(config.last_synced_at).toLocaleString()}`
                      : "Belum pernah disinkronkan"}
                  </span>
                </div>
              </div>

              {config && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => syncNow(selectedDeviceId)}
                  disabled={isSyncing}
                  className="gap-1.5 rounded-xl text-xs font-bold"
                >
                  <RefreshCw
                    className={cn(
                      "size-3.5",
                      isSyncing && "animate-spin text-wise-green",
                    )}
                  />
                  <span>
                    {isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
                  </span>
                </Button>
              )}
            </div>

            {/* Google Sheets CSV URL */}
            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.spreadsheet.sheetUrlLabel")}
              </label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder={t("autoreply.spreadsheet.sheetUrlPlaceholder")}
                  variant="rounded"
                  className="flex-1 text-xs"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePreview}
                  disabled={isPreviewing}
                  className="gap-1.5 rounded-xl text-xs font-bold shrink-0"
                >
                  {isPreviewing ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Eye className="size-3.5 text-wise-green" />
                  )}
                  <span>{isPreviewing ? "Memuat..." : "Pratinjau"}</span>
                </Button>
              </div>
            </div>

            {/* Sync Interval & Active Switch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-foreground text-xs font-bold flex items-center gap-1.5">
                  <Clock className="size-3.5 text-wise-green" />
                  <span>Interval Sinkronisasi Otomatis</span>
                </label>
                <NativeSelect
                  value={syncInterval}
                  onChange={(e) =>
                    setSyncInterval(parseInt(e.target.value, 10))
                  }
                  variant="rounded"
                  className="w-full text-xs"
                >
                  <NativeSelectOption value={15}>
                    Setiap 15 Menit
                  </NativeSelectOption>
                  <NativeSelectOption value={30}>
                    Setiap 30 Menit (Direkomendasikan)
                  </NativeSelectOption>
                  <NativeSelectOption value={60}>
                    Setiap 1 Jam
                  </NativeSelectOption>
                  <NativeSelectOption value={360}>
                    Setiap 6 Jam
                  </NativeSelectOption>
                </NativeSelect>
              </div>

              <div className="flex items-center justify-between sm:justify-end sm:gap-4 rounded-xl border border-border p-3 sm:border-0 sm:p-0 pt-2 sm:pt-5">
                <div className="space-y-0.5 sm:text-right">
                  <span className="text-foreground text-xs font-bold block">
                    {t("autoreply.spreadsheet.isActiveLabel")}
                  </span>
                  <span className="text-foreground-muted text-[10px]">
                    {isActive ? "Sinkronisasi Aktif" : "Nonaktif"}
                  </span>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2 border-t border-border">
              <Button
                type="submit"
                variant="primaryPill"
                size="sm"
                disabled={isSaving}
                className="gap-1.5 px-5 text-xs font-bold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>{t("autoreply.rules.modal.saving")}</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>{t("autoreply.spreadsheet.saveConfig")}</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Test Match Simulator Card */}
          <div className="border-border bg-surface rounded-2xl border p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-wise-green" />
              <h3 className="text-foreground text-sm font-bold">
                {t("autoreply.spreadsheet.testLookupTitle")}
              </h3>
            </div>
            <p className="text-foreground-muted text-xs">
              Ketik kata kunci untuk menguji apakah algoritma Aho-Corasick
              berhasil mencocokkan baris dari Google Sheets secara real-time.
            </p>

            <form onSubmit={handleTestMatch} className="flex gap-2">
              <Input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder={t(
                  "autoreply.spreadsheet.testKeywordPlaceholder",
                )}
                variant="rounded"
                className="flex-1 text-xs"
              />
              <Button
                type="submit"
                variant="primaryPill"
                size="sm"
                disabled={isTesting || !testInput.trim()}
                className="px-4 text-xs font-bold shrink-0"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1" />
                    <span>Menguji...</span>
                  </>
                ) : (
                  t("autoreply.spreadsheet.testButton")
                )}
              </Button>
            </form>

            {testResult && (
              <div
                className={cn(
                  "rounded-2xl border p-4 space-y-1.5 animate-in fade-in duration-150",
                  testResult.matched
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : "bg-muted/40 border-border",
                )}
              >
                <div className="flex items-center gap-2">
                  {testResult.matched ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="size-4 text-amber-500" />
                  )}
                  <span className="text-foreground text-xs font-bold">
                    {testResult.matched
                      ? t("autoreply.spreadsheet.testMatchResult")
                      : t("autoreply.spreadsheet.testNoMatch")}
                  </span>
                </div>
                {testResult.matched && (
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="text-foreground-muted">
                      Kata Kunci Cocok:{" "}
                      <strong className="text-foreground font-mono">
                        {testResult.matched_keyword}
                      </strong>{" "}
                      ({testResult.matched_logic})
                    </p>
                    <div className="bg-surface rounded-xl border border-border p-3 text-foreground whitespace-pre-wrap shadow-xs">
                      {testResult.response_payload}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Educational Step Guide */}
        <div className="space-y-6">
          <div className="border-border bg-surface rounded-2xl border p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-4 text-wise-green" />
              <h3 className="text-foreground text-xs font-bold uppercase tracking-wider">
                {t("autoreply.spreadsheet.guideTitle")}
              </h3>
            </div>
            <div className="space-y-2.5 text-xs text-foreground-muted leading-relaxed">
              <p>{t("autoreply.spreadsheet.step1")}</p>
              <p
                dangerouslySetInnerHTML={{
                  __html: t("autoreply.spreadsheet.step2"),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t("autoreply.spreadsheet.step3"),
                }}
              />
              <p
                dangerouslySetInnerHTML={{
                  __html: t("autoreply.spreadsheet.step4"),
                }}
              />
            </div>

            {/* Required Columns Info */}
            <div className="border-border border-t pt-4 space-y-2">
              <h4 className="text-foreground text-xs font-bold">
                {t("autoreply.spreadsheet.requiredHeaderTitle")}
              </h4>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="bg-muted rounded-lg px-2.5 py-1 text-foreground">
                  A1: <strong>keyword</strong>
                </div>
                <div className="bg-muted rounded-lg px-2.5 py-1 text-foreground">
                  B1: <strong>logic</strong> (EXACT / CONTAINS)
                </div>
                <div className="bg-muted rounded-lg px-2.5 py-1 text-foreground">
                  C1: <strong>response</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Preview Modal with shadcn Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl rounded-2xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <TableIcon className="size-5 text-wise-green" />
              <DialogTitle className="text-foreground text-sm font-bold">
                {t("autoreply.spreadsheet.previewTitle")}
              </DialogTitle>
            </div>
            <DialogDescription className="text-foreground-muted text-xs">
              Ditemukan total {previewResult?.total_rows || 0} baris dengan{" "}
              {previewResult?.total_keywords || 0} kata kunci unik.
            </DialogDescription>
          </DialogHeader>

          <div className="border border-border rounded-xl overflow-hidden my-2">
            <Table className="w-full text-left text-xs">
              <TableHeader className="bg-muted/40 text-foreground-muted uppercase text-[10px] font-bold border-b border-border">
                <TableRow>
                  <TableHead className="px-3 py-2 font-bold">Keyword</TableHead>
                  <TableHead className="px-3 py-2 font-bold">Logic</TableHead>
                  <TableHead className="px-3 py-2 font-bold">
                    Response
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {previewResult?.sample_rows?.map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/30">
                    <TableCell className="px-3 py-2 font-mono text-foreground font-semibold">
                      {row.keyword}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-foreground-muted">
                      {row.logic}
                    </TableCell>
                    <TableCell className="px-3 py-2 text-foreground truncate max-w-xs">
                      {row.response}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="flex justify-end pt-2">
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
              className="text-xs font-bold"
            >
              Tutup Pratinjau
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
