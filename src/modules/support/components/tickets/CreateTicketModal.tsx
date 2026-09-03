"use client";

import React, { useState, useRef } from "react";
import {
  CreateTicketInput,
  TicketCategory,
  TicketPriority,
} from "@/modules/support/types/support.types";
import { supportApi } from "@/modules/support/api/support.api";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import {
  X,
  LifeBuoy,
  Send,
  Loader2,
  Paperclip,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketInput) => Promise<unknown>;
}

export function CreateTicketModal({ isOpen, onClose, onSubmit }: CreateTicketModalProps) {
  const { t } = useI18n();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("WHATSAPP");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [message, setMessage] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [attachmentFileName, setAttachmentFileName] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError(t("support.errInvalidFormat"));
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setError(t("support.errFileSize"));
      return;
    }

    setError(null);
    setIsUploading(true);
    setAttachmentFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const url = await supportApi.uploadImage(file);
      setAttachmentUrl(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("support.errUploadFailed");
      setError(msg);
      setAttachmentUrl("");
      setAttachmentFileName("");
      setPreviewUrl("");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentUrl("");
    setAttachmentFileName("");
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError(t("support.errRequiredFields"));
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await onSubmit({
        subject: subject.trim(),
        category,
        priority,
        message: message.trim(),
        attachment: attachmentUrl || undefined,
      });
      setSubject("");
      setMessage("");
      setAttachmentUrl("");
      setAttachmentFileName("");
      setPreviewUrl("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("support.errCreateFailed");
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
        {/* Sticky Header */}
        <div className="border-border/80 flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <LifeBuoy className="size-5" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-black tracking-tight sm:text-xl">
                {t("support.createModalTitle")}
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                {t("support.createModalSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-4 p-5 sm:p-6">
            {error && (
              <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("support.subjectLabel")}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("support.subjectPlaceholder")}
                disabled={isLoading}
                className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full rounded-full border px-4 text-xs font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
                autoFocus
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("support.categoryLabel")}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="bg-surface text-foreground border-border focus:border-wise-green h-10 w-full rounded-md border px-3 text-xs font-semibold outline-none dark:bg-[#10110e]"
                >
                  <option value="WHATSAPP">{t("support.categoryWhatsapp")}</option>
                  <option value="BILLING">{t("support.categoryBilling")}</option>
                  <option value="API">{t("support.categoryApi")}</option>
                  <option value="GENERAL">{t("support.categoryGeneral")}</option>
                </select>
              </div>

              <div>
                <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("support.priorityLabel")}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="bg-surface text-foreground border-border focus:border-wise-green h-10 w-full rounded-md border px-3 text-xs font-semibold outline-none dark:bg-[#10110e]"
                >
                  <option value="LOW">{t("support.priorityLow")}</option>
                  <option value="MEDIUM">{t("support.priorityMedium")}</option>
                  <option value="HIGH">{t("support.priorityHigh")}</option>
                </select>
              </div>
            </div>

            {/* Detailed Message */}
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("support.messageLabel")}
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("support.messagePlaceholder")}
                disabled={isLoading}
                className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green w-full rounded-md border p-3 text-xs leading-relaxed font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
              />
            </div>

            {/* Screenshot Attachment */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-foreground-secondary block text-xs font-semibold tracking-wider uppercase">
                  {t("support.attachmentLabel")}
                </label>
                <span className="text-foreground-muted text-[11px] font-semibold">
                  {t("support.attachmentHint")}
                </span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
              />

              {!attachmentUrl && !previewUrl && !isUploading && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="border-border hover:border-wise-green bg-surface/50 hover:bg-wise-green/5 text-foreground-secondary hover:text-foreground flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-4 py-2.5 text-xs font-semibold transition dark:bg-[#10110e]/50"
                >
                  <Paperclip className="dark:text-wise-green size-3.5 text-emerald-700" />
                  <span>{t("support.selectScreenshot")}</span>
                </button>
              )}

              {isUploading && (
                <div className="border-border bg-surface text-foreground-secondary flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-xs font-semibold dark:bg-[#10110e]">
                  <Loader2 className="dark:text-wise-green size-4 animate-spin text-emerald-700" />
                  <span>{t("support.uploadingImage")}</span>
                </div>
              )}

              {(previewUrl || attachmentUrl) && !isUploading && (
                <div className="border-wise-green/30 bg-wise-green/5 dark:bg-wise-green/10 flex items-center justify-between gap-3 rounded-md border p-2.5">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="bg-surface border-border flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border dark:bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl || attachmentUrl}
                        alt="Thumbnail lampiran"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="dark:text-wise-green size-3 shrink-0 text-emerald-700" />
                        <p className="text-foreground truncate text-xs font-bold">
                          {attachmentFileName || t("support.screenshotUploaded")}
                        </p>
                      </div>
                      {attachmentUrl && (
                        <a
                          href={attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="dark:text-wise-green mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:underline"
                        >
                          <ImageIcon className="size-3" />
                          <span>{t("support.viewAttachment")} ↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveAttachment}
                    disabled={isLoading}
                    className="text-foreground-muted flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-rose-500/10 hover:text-rose-500"
                    title={t("support.removeAttachment")}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Modal Footer */}
          <div className="border-border/80 bg-surface/90 flex shrink-0 items-center justify-end gap-2.5 border-t p-4 pt-3 backdrop-blur-sm sm:p-6 dark:bg-[#161715]/90">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted rounded-full px-4 text-xs font-bold"
            >
              {t("support.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="gap-1.5 px-6 text-xs font-bold shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("support.submitting")}</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>{t("support.submitCreate")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
