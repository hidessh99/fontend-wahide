"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CreateTicketInput,
  TicketCategory,
  TicketPriority,
} from "@/modules/support/types/support.types";
import { supportApi } from "@/modules/support/api/support.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import {
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

  // Clean up object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
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
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setAttachmentUrl("");
    setAttachmentFileName("");
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Subjek tiket wajib diisi.");
      return;
    }
    if (!message.trim()) {
      setError("Pesan kendala wajib diisi.");
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
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat tiket bantuan";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-lg">
        {/* Sticky Modal Header */}
        <DialogHeader className="border-border/80 flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <LifeBuoy className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {t("support.createTicketTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("support.createTicketSubtitle")}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {error && (
              <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Subject Input */}
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("support.subjectLabel")}
              </label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("support.subjectPlaceholder")}
                disabled={isLoading}
                variant="rounded"
                autoFocus
              />
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("support.categoryLabel")}
                </label>
                <NativeSelect
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TicketCategory)}
                  disabled={isLoading}
                  variant="rounded"
                >
                  <option value="WHATSAPP">{t("support.catWhatsApp")}</option>
                  <option value="BILLING">{t("support.catBilling")}</option>
                  <option value="ACCOUNT">{t("support.catAccount")}</option>
                  <option value="FEATURE_REQUEST">{t("support.catFeature")}</option>
                  <option value="OTHER">{t("support.catOther")}</option>
                </NativeSelect>
              </div>

              <div>
                <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                  {t("support.priorityLabel")}
                </label>
                <NativeSelect
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  disabled={isLoading}
                  variant="rounded"
                >
                  <option value="LOW">{t("support.priorityLow")}</option>
                  <option value="MEDIUM">{t("support.priorityMedium")}</option>
                  <option value="HIGH">{t("support.priorityHigh")}</option>
                  <option value="URGENT">{t("support.priorityUrgent")}</option>
                </NativeSelect>
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("support.messageLabel")}
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("support.messagePlaceholder")}
                disabled={isLoading}
                rows={4}
                variant="rounded"
                className="resize-none"
              />
            </div>

            {/* Attachment Section */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-foreground-secondary text-xs font-semibold tracking-wider uppercase">
                  {t("support.attachmentLabel")}
                </label>
                <span className="text-foreground-muted text-[11px]">
                  {t("support.attachmentNotice")}
                </span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />

              {!attachmentUrl && !isUploading && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="border-border hover:border-wise-green/80 bg-surface text-foreground-secondary hover:text-foreground mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed py-3 text-xs font-semibold transition dark:bg-[#10110e]"
                >
                  <Paperclip className="size-4" />
                  <span>{t("support.attachScreenshot")}</span>
                </button>
              )}

              {isUploading && (
                <div className="border-border bg-surface mt-2 flex items-center justify-center gap-2 rounded-md border p-3 text-xs font-semibold dark:bg-[#10110e]">
                  <Loader2 className="dark:text-wise-green size-4 animate-spin text-emerald-600" />
                  <span>{t("support.uploadingImage")}</span>
                </div>
              )}

              {attachmentUrl && (
                <div className="border-border bg-surface mt-2 flex items-center justify-between gap-3 rounded-md border p-2.5 dark:bg-[#10110e]">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {previewUrl ? (
                      <div
                        role="img"
                        aria-label={attachmentFileName || "Screenshot Preview"}
                        className="size-10 shrink-0 rounded bg-cover bg-center"
                        style={{ backgroundImage: `url("${previewUrl}")` }}
                      />
                    ) : (
                      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded">
                        <ImageIcon className="text-foreground-muted size-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-foreground truncate text-xs font-bold">
                          {attachmentFileName || "Screenshot.jpg"}
                        </span>
                        <CheckCircle2 className="dark:text-wise-green size-3.5 shrink-0 text-emerald-600" />
                      </div>
                      {attachmentUrl && (
                        <a
                          href={attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="dark:text-wise-green block truncate font-mono text-[10px] text-emerald-600 hover:underline"
                        >
                          {attachmentUrl}
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
          <DialogFooter className="border-border/80 bg-surface/90 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 pt-3 backdrop-blur-sm sm:p-6/90">
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
