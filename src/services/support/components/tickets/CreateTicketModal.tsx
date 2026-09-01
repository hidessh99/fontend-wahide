"use client";

import React, { useState, useRef } from "react";
import { CreateTicketInput, TicketCategory, TicketPriority } from "@/services/support/types/support.types";
import { supportApi } from "@/services/support/api/support.api";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { X, LifeBuoy, Send, Loader2, Paperclip, Trash2, CheckCircle2, Image as ImageIcon } from "lucide-react";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketInput) => Promise<unknown>;
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTicketModalProps) {
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

  // Escape key to dismiss
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Sticky Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border/80 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <LifeBuoy className="size-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {t("support.createModalTitle")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {t("support.createModalSubtitle")}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="p-5 sm:p-6 space-y-4 flex-1">
            {error && (
              <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                {t("support.subjectLabel")}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("support.subjectPlaceholder")}
                disabled={isLoading}
                className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
                autoFocus
              />
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("support.categoryLabel")}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
                >
                  <option value="WHATSAPP">{t("support.categoryWhatsapp")}</option>
                  <option value="BILLING">{t("support.categoryBilling")}</option>
                  <option value="API">{t("support.categoryApi")}</option>
                  <option value="GENERAL">{t("support.categoryGeneral")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("support.priorityLabel")}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
                >
                  <option value="LOW">{t("support.priorityLow")}</option>
                  <option value="MEDIUM">{t("support.priorityMedium")}</option>
                  <option value="HIGH">{t("support.priorityHigh")}</option>
                </select>
              </div>
            </div>

            {/* Detailed Message */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                {t("support.messageLabel")}
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("support.messagePlaceholder")}
                disabled={isLoading}
                className="w-full p-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-semibold text-xs border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition leading-relaxed"
              />
            </div>

            {/* Screenshot Attachment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  {t("support.attachmentLabel")}
                </label>
                <span className="text-[11px] font-semibold text-foreground-muted">
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
                  className="w-full py-2.5 px-4 rounded-md border border-dashed border-border hover:border-wise-green bg-surface/50 dark:bg-[#10110e]/50 hover:bg-wise-green/5 text-foreground-secondary hover:text-foreground flex items-center justify-center gap-2 text-xs font-semibold transition cursor-pointer"
                >
                  <Paperclip className="size-3.5 text-wise-green" />
                  <span>{t("support.selectScreenshot")}</span>
                </button>
              )}

              {isUploading && (
                <div className="w-full py-3 px-4 rounded-md border border-border bg-surface dark:bg-[#10110e] flex items-center justify-center gap-2 text-xs font-semibold text-foreground-secondary">
                  <Loader2 className="size-4 animate-spin text-wise-green" />
                  <span>{t("support.uploadingImage")}</span>
                </div>
              )}

              {(previewUrl || attachmentUrl) && !isUploading && (
                <div className="p-2.5 rounded-md border border-wise-green/30 bg-wise-green/5 dark:bg-wise-green/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="size-10 rounded bg-surface dark:bg-black/40 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl || attachmentUrl}
                        alt="Thumbnail lampiran"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="size-3 text-wise-green shrink-0" />
                        <p className="text-xs font-bold text-foreground truncate">
                          {attachmentFileName || t("support.screenshotUploaded")}
                        </p>
                      </div>
                      {attachmentUrl && (
                        <a
                          href={attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-wise-green hover:underline inline-flex items-center gap-1 mt-0.5"
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
                    className="size-7 rounded-full flex items-center justify-center text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
                    title={t("support.removeAttachment")}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Modal Footer */}
          <div className="p-4 sm:p-6 pt-3 border-t border-border/80 bg-surface/90 dark:bg-[#161715]/90 backdrop-blur-sm flex items-center justify-end gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-full text-xs font-bold px-4 border-border hover:border-foreground-muted"
            >
              {t("support.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading}
              className="text-xs font-bold gap-1.5 px-6 shadow-sm"
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
