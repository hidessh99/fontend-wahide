"use client";

import React, { useState, useRef } from "react";
import { Ticket, TicketMessage } from "@/modules/support/types/support.types";
import { supportApi } from "@/modules/support/api/support.api";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useI18n } from "@/lib/i18n/context";
import { X, Send, Loader2, User, ShieldCheck, ExternalLink, Paperclip } from "lucide-react";

interface TicketThreadModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onSendReply: (ticketId: string, message: string, attachment?: string) => Promise<unknown>;
}

export function TicketThreadModal({
  ticket,
  isOpen,
  onClose,
  onSendReply,
}: TicketThreadModalProps) {
  const { t } = useI18n();
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [replies, setReplies] = useState<TicketMessage[]>([]);
  const [isFetchingReplies, setIsFetchingReplies] = useState(false);

  // Attachment state for replies
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

  // Initial message of the ticket (first message created by the user)
  const initialMessage: TicketMessage | null = React.useMemo(() => {
    if (!ticket) return null;
    const initText = ticket.message || ticket.messages?.[0]?.content || "";
    if (!initText) return null;
    return {
      id: "init_" + (ticket.id || ticket.ticketNumber),
      senderName: "Anda",
      isStaff: false,
      content: initText,
      attachment: ticket.attachment,
      createdAt: ticket.createdAt,
    };
  }, [ticket]);

  // Automatically fetch conversation replies from database whenever modal opens
  React.useEffect(() => {
    if (!isOpen || !ticket?.id) {
      return;
    }

    const controller = new AbortController();
    let isCancelled = false;

    // Asynchronous microtask avoids synchronous cascading render in effect body
    queueMicrotask(() => {
      if (!isCancelled) {
        setIsFetchingReplies(true);
      }
    });

    supportApi
      .getReplies(ticket.id, controller.signal)
      .then((data) => {
        if (!isCancelled) setReplies(data);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("Gagal memuat balasan tiket:", err);
      })
      .finally(() => {
        if (!isCancelled) setIsFetchingReplies(false);
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [isOpen, ticket?.id]);

  // Combine initial message and replies chronologically without duplication
  const allMessages = React.useMemo(() => {
    const list: TicketMessage[] = [];
    if (initialMessage) {
      list.push(initialMessage);
    }
    replies.forEach((r) => {
      // Avoid duplicate of initial message
      if (
        initialMessage &&
        r.content === initialMessage.content &&
        Math.abs(new Date(r.createdAt).getTime() - new Date(initialMessage.createdAt).getTime()) <
          3000
      ) {
        return;
      }
      list.push(r);
    });
    return list;
  }, [initialMessage, replies]);

  if (!isOpen || !ticket) return null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Format file tidak valid: hanya PNG, JPG, dan JPEG");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 1 MB");
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setAttachmentFile(file);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const url = await supportApi.uploadImage(file);
      setAttachmentUrl(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah gambar";
      setUploadError(msg);
      setAttachmentUrl("");
      setPreviewUrl("");
      setAttachmentFile(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentFile(null);
    setAttachmentUrl("");
    setPreviewUrl("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!replyText.trim() && !attachmentUrl && !attachmentFile) || !ticket) return;

    const text = replyText.trim();
    setIsLoading(true);
    try {
      let finalAttachmentUrl = attachmentUrl;
      if (!finalAttachmentUrl && attachmentFile) {
        finalAttachmentUrl = await supportApi.uploadImage(attachmentFile);
      }

      const result = await onSendReply(ticket.id, text, finalAttachmentUrl || undefined);
      const newMsg: TicketMessage =
        result && typeof result === "object" && "content" in result
          ? (result as TicketMessage)
          : {
              id: "reply_" + Date.now(),
              senderName: "Anda",
              isStaff: false,
              content: text,
              attachment: finalAttachmentUrl || undefined,
              createdAt: new Date().toISOString(),
            };

      // Instant optimistic update: bubble chat appears immediately!
      setReplies((prev) => [...prev, newMsg]);
      setReplyText("");
      handleRemoveAttachment();
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
      <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-md border shadow-2xl dark:bg-[#161715]">
        {/* Sticky Header */}
        <div className="border-border flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                {ticket.ticketNumber}
              </span>
              <span className="text-foreground-muted text-xs font-semibold">{ticket.category}</span>
            </div>
            <h2 className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {ticket.subject}
            </h2>
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

        {/* Scrollable Body: Attachment & Messages */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {/* Top Initial Attachment preview if exists */}
          {ticket.attachment && (
            <div className="bg-muted/50 border-border flex items-center justify-between gap-3 rounded-md border p-3 text-xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="bg-surface border-border flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border dark:bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ticket.attachment}
                    alt="Lampiran Tiket"
                    className="size-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <span className="text-foreground block truncate font-bold">
                    {t("support.attachmentLabel")} (Awal)
                  </span>
                  <span className="text-foreground-muted text-[11px]">Cloudflare R2 Storage</span>
                </div>
              </div>
              <a
                href={ticket.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-wise-green dark:bg-wise-green/10 dark:border-wise-green/20 inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:underline"
              >
                <span>{t("support.viewAttachment")}</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          {/* Loading Indicator for replies */}
          {isFetchingReplies && replies.length === 0 && (
            <div className="text-foreground-muted flex items-center justify-center gap-2 py-3 text-xs font-semibold">
              <Loader2 className="dark:text-wise-green size-3.5 animate-spin text-emerald-700" />
              <span>Memuat riwayat balasan...</span>
            </div>
          )}

          {/* Message Thread History */}
          <div className="space-y-4 divide-y divide-transparent py-1">
            {allMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-1 ${msg.isStaff ? "items-start" : "items-end"}`}
              >
                <div className="text-foreground-muted flex items-center gap-1.5 px-1 text-[11px] font-bold">
                  {msg.isStaff ? (
                    <>
                      <ShieldCheck className="text-dark-green dark:text-wise-green size-3.5" />
                      <span className="text-dark-green dark:text-wise-green font-extrabold">
                        {msg.senderName}
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="text-foreground-muted size-3" />
                      <span>{msg.senderName}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] space-y-2.5 rounded-lg p-3.5 text-xs leading-relaxed font-semibold shadow-sm sm:p-4 ${
                    msg.isStaff
                      ? "bg-muted/80 text-foreground border-border border"
                      : "text-foreground border border-[#c4e8a5] bg-[#e2f7cb] dark:border-[#005c4b] dark:bg-[#005c4b]/50"
                  }`}
                >
                  {/* Inline Image Attachment in Bubble */}
                  {msg.attachment && (
                    <div className="border-border/50 max-w-sm overflow-hidden rounded border bg-black/5 dark:bg-black/30">
                      <a
                        href={msg.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block cursor-pointer overflow-hidden"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={msg.attachment}
                          alt="Lampiran Screenshot"
                          className="max-h-56 w-full object-cover transition duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 text-[11px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                          <span>Buka Ukuran Penuh</span>
                          <ExternalLink className="size-3" />
                        </div>
                      </a>
                    </div>
                  )}

                  {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Reply Composer Footer */}
        <form
          onSubmit={handleSend}
          className="border-border bg-surface/90 shrink-0 space-y-2.5 border-t p-4 pt-3 backdrop-blur-sm sm:p-6 dark:bg-[#161715]/90"
        >
          {/* File Attachment Preview Chip */}
          {(previewUrl || isUploading || uploadError) && (
            <div>
              {uploadError ? (
                <div className="flex items-center justify-between gap-2 rounded-md border border-rose-500/20 bg-rose-500/10 p-2 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <span>{uploadError}</span>
                  <button
                    type="button"
                    onClick={() => setUploadError(null)}
                    className="text-foreground-muted hover:text-foreground cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : previewUrl ? (
                <div className="bg-muted/60 border-border flex items-center justify-between gap-3 rounded-md border p-2 px-3 text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="bg-surface border-border flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview Lampiran"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-foreground block truncate font-bold">
                        {attachmentFile?.name || "Lampiran Gambar"}
                      </span>
                      <span className="text-foreground-muted text-[11px]">
                        {isUploading ? "Mengunggah ke Cloudflare R2..." : "Siap dilampirkan"}
                      </span>
                    </div>
                  </div>
                  {isUploading ? (
                    <Loader2 className="dark:text-wise-green size-4 shrink-0 animate-spin text-emerald-700" />
                  ) : (
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="text-foreground-muted flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full transition hover:bg-rose-500/10 hover:text-rose-500"
                      title="Hapus Lampiran"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
          />

          <div className="space-y-2">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={t("support.replyPlaceholder")}
              disabled={isLoading}
              className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green w-full rounded-md border p-3 text-xs font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
            />

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
                className="text-foreground-secondary hover:text-foreground hover:bg-muted border-border inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50"
                title="Unggah Gambar / Screenshot"
              >
                <Paperclip className="dark:text-wise-green size-3.5 text-emerald-700" />
                <span>Lampirkan Gambar</span>
              </button>

              <Button
                type="submit"
                variant="primaryPill"
                size="sm"
                disabled={
                  isLoading ||
                  isUploading ||
                  (!replyText.trim() && !attachmentUrl && !attachmentFile)
                }
                className="h-8 cursor-pointer gap-1.5 px-4 text-xs font-bold shadow-sm"
              >
                {isLoading || isUploading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="size-3.5" />
                    <span>Kirim</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
