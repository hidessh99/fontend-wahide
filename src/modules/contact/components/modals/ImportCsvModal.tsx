"use client";

import React, { useState } from "react";
import { CreateContactInput } from "@/modules/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import { X, UploadCloud, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: CreateContactInput[]) => Promise<unknown>;
}

export function ImportCsvModal({ isOpen, onClose, onImport }: ImportCsvModalProps) {
  const { t } = useI18n();
  const [parsedData, setParsedData] = useState<CreateContactInput[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);

        if (lines.length <= 1) {
          setError("File CSV kosong atau hanya memiliki baris header.");
          return;
        }

        const headerLine = lines[0].toLowerCase();
        const headers = headerLine.split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));

        const nameIndex = headers.indexOf("name");
        const phoneIndex = headers.indexOf("phone");
        const tagsIndex = headers.indexOf("tags");

        if (nameIndex === -1 || phoneIndex === -1) {
          setError("File CSV wajib memiliki kolom header 'name' dan 'phone'.");
          return;
        }

        const validContacts: CreateContactInput[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
          const rawName = cols[nameIndex];
          const rawPhone = cols[phoneIndex];
          const rawTags = tagsIndex !== -1 ? cols[tagsIndex] : "";

          if (rawName && rawPhone) {
            let cleanPhone = rawPhone.replace(/[^0-9]/g, "");
            if (cleanPhone.startsWith("08")) {
              cleanPhone = "62" + cleanPhone.slice(1);
            } else if (cleanPhone.startsWith("8")) {
              cleanPhone = "62" + cleanPhone;
            }

            if (cleanPhone.startsWith("62") && cleanPhone.length >= 10) {
              const tags = rawTags
                ? rawTags
                    .split(";")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [];
              validContacts.push({
                name: rawName,
                phone: cleanPhone,
                tags,
              });
            }
          }
        }

        if (validContacts.length === 0) {
          setError("Tidak ada nomor kontak valid yang diawali kode 62.");
          return;
        }

        setParsedData(validContacts);
      } catch {
        setError("Gagal memproses file CSV. Pastikan format CSV valid.");
      }
    };
    reader.readAsText(file);
  };

  const handleStartImport = async () => {
    if (parsedData.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      await onImport(parsedData);
      setParsedData([]);
      setFileName(null);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengimpor kontak";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
    >
      <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-md border shadow-2xl dark:bg-[#161715]">
        {/* Sticky Modal Header */}
        <div className="border-border/80 flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-black tracking-tight sm:text-xl">
                {t("contact.importModalTitle")}
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                {t("contact.importModalSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Dropzone Upload */}
          <div className="border-border hover:border-wise-green/80 bg-muted/20 relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center transition">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isLoading}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div className="dark:bg-wise-green/10 dark:text-wise-green mb-3 flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <UploadCloud className="size-6" />
            </div>
            <p className="text-foreground mb-1 text-xs font-bold">
              {fileName || t("contact.importDropzone")}
            </p>
            <p className="text-foreground-muted text-[11px] font-semibold">
              {t("contact.importSupportedFormat")}
            </p>
          </div>

          {/* Preview of Parsed Contacts */}
          {parsedData.length > 0 && (
            <div className="space-y-2">
              <div className="text-foreground flex items-center justify-between text-xs font-bold">
                <span className="text-dark-green dark:text-wise-green flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="size-4" />
                  <span>
                    {t("contact.importPreviewTitle", { count: parsedData.length.toString() })}
                  </span>
                </span>
              </div>

              <div className="border-border bg-muted/40 divide-border/50 max-h-40 divide-y overflow-y-auto rounded border p-2 font-mono text-xs">
                {parsedData.slice(0, 5).map((c, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 text-[11px]">
                    <span className="text-foreground max-w-45 truncate font-bold">{c.name}</span>
                    <span className="text-foreground-secondary">+{c.phone}</span>
                  </div>
                ))}
                {parsedData.length > 5 && (
                  <div className="text-foreground-muted py-1 text-center font-sans text-[10px]">
                    ... dan {parsedData.length - 5} kontak lainnya
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Modal Footer */}
        <div className="border-border/80 bg-surface/90 flex shrink-0 items-center justify-end gap-2.5 border-t p-4 pt-3 backdrop-blur-sm sm:p-6 dark:bg-[#161715]/90">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-4 text-xs font-bold"
          >
            {t("contact.cancel")}
          </Button>
          <Button
            type="button"
            variant="primaryPill"
            size="sm"
            disabled={isLoading || parsedData.length === 0}
            onClick={handleStartImport}
            className="cursor-pointer gap-1.5 px-5 text-xs font-bold shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("contact.importing")}</span>
              </>
            ) : (
              <span>{t("contact.importSubmit")}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
