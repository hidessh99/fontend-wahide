"use client";

import React, { useState } from "react";
import { CreateContactInput } from "../types/contact.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { X, UploadCloud, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: CreateContactInput[]) => Promise<unknown>;
}

export function ImportCsvModal({
  isOpen,
  onClose,
  onImport,
}: ImportCsvModalProps) {
  const { t } = useI18n();
  const [parsedData, setParsedData] = useState<CreateContactInput[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

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
        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

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
              const tags = rawTags ? rawTags.split(";").map((t) => t.trim()).filter(Boolean) : [];
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {t("contact.importModalTitle")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {t("contact.importModalSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dropzone Upload */}
        <div className="relative border-2 border-dashed border-border hover:border-wise-green/80 rounded-md p-6 flex flex-col items-center justify-center text-center transition bg-muted/20">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isLoading}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="size-12 rounded-full bg-wise-green/10 text-wise-green flex items-center justify-center mb-3">
            <UploadCloud className="size-6" />
          </div>
          <p className="text-xs font-bold text-foreground mb-1">
            {fileName || t("contact.importDropzone")}
          </p>
          <p className="text-[11px] font-semibold text-foreground-muted">
            {t("contact.importSupportedFormat")}
          </p>
        </div>

        {/* Preview of Parsed Contacts */}
        {parsedData.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span className="flex items-center gap-1.5 text-wise-green">
                <CheckCircle2 className="size-4" />
                <span>{t("contact.importPreviewTitle", { count: parsedData.length.toString() })}</span>
              </span>
            </div>

            <div className="max-h-36 overflow-y-auto rounded border border-border bg-muted/40 p-2 text-xs divide-y divide-border/50 font-mono">
              {parsedData.slice(0, 5).map((c, idx) => (
                <div key={idx} className="py-1.5 flex justify-between text-[11px]">
                  <span className="font-bold text-foreground truncate max-w-45">{c.name}</span>
                  <span className="text-foreground-secondary">+{c.phone}</span>
                </div>
              ))}
              {parsedData.length > 5 && (
                <div className="py-1 text-[10px] text-center text-foreground-muted font-sans">
                  ... dan {parsedData.length - 5} kontak lainnya
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full text-xs font-bold px-4 border-border hover:border-foreground-muted"
          >
            {t("contact.cancel")}
          </Button>
          <Button
            type="button"
            variant="primaryPill"
            size="sm"
            disabled={isLoading || parsedData.length === 0}
            onClick={handleStartImport}
            className="text-xs font-bold gap-1.5 px-5 shadow-sm"
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
