"use client";

import React, { useState } from "react";
import { CreateContactInput } from "@/modules/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { UploadCloud, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengimpor kontak";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="border-border bg-surface max-h-[90vh] max-w-lg gap-0 overflow-hidden p-0 dark:bg-[#161715]">
        {/* Sticky Modal Header */}
        <DialogHeader className="border-border/80 flex flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <UploadCloud className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {t("contact.importCsvModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("contact.importCsvModalSubtitle")}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-4.5 overflow-y-auto p-5 sm:p-6">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Instructions Box */}
          <div className="border-border bg-muted/20 space-y-2 rounded-md border p-3.5 text-xs">
            <span className="text-foreground block font-bold">Ketentuan Format CSV:</span>
            <ul className="text-foreground-secondary list-inside list-disc space-y-1">
              <li>
                Gunakan baris pertama untuk header:{" "}
                <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[11px] font-bold">
                  name,phone,tags
                </code>
              </li>
              <li>
                Format nomor WhatsApp: diawali <code className="font-bold">628xxx</code> atau{" "}
                <code className="font-bold">08xxx</code> (otomatis dinormalisasi).
              </li>
              <li>
                Kolom <code className="font-bold">tags</code> bersifat opsional, pisahkan tag dengan
                titik koma (contoh: <code className="font-mono">VIP;Pelanggan;Bandung</code>).
              </li>
            </ul>
          </div>

          {/* Dropzone / File Picker */}
          <label className="border-border hover:border-wise-green/80 bg-surface group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition dark:bg-[#10110e]">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isLoading}
              className="sr-only"
            />
            <div className="dark:bg-wise-green/10 dark:text-wise-green flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 transition group-hover:scale-105">
              <FileSpreadsheet className="size-6" />
            </div>
            <span className="text-foreground mt-3 text-xs font-bold sm:text-sm">
              {fileName ? fileName : t("contact.dropCsvLabel")}
            </span>
            <span className="text-foreground-muted mt-1 text-[11px]">
              {fileName ? "Klik untuk mengganti file" : "Format yang didukung: .csv (Maksimal 5MB)"}
            </span>
          </label>

          {/* Preview Parsed Contacts */}
          {parsedData.length > 0 && (
            <div className="border-border bg-surface rounded-md border p-3.5 text-xs dark:bg-[#10110e]">
              <div className="border-border/60 flex items-center justify-between border-b pb-2">
                <span className="text-foreground flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="dark:text-wise-green size-4 text-emerald-600" />
                  <span>Pratinjau Data CSV Terbaca</span>
                </span>
                <span className="dark:bg-wise-green/15 dark:text-wise-green bg-light-mint text-dark-green rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold">
                  {parsedData.length} Kontak Siap Impor
                </span>
              </div>

              <div className="divide-border/40 mt-2 max-h-32 divide-y overflow-y-auto font-mono">
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
        <DialogFooter className="border-border/80 bg-surface/90 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 pt-3 backdrop-blur-sm sm:p-6 dark:bg-[#161715]/90">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
