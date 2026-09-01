"use client";

import React, { useState, useRef } from "react";
import { Ticket, TicketMessage } from "@/modules/support/types/support.types";
import { supportApi } from "@/modules/support/api/support.api";
import { Button } from "@/components/ui/button";
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

  // Escape key to dismiss
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

    let isMounted = true;
    supportApi
      .getReplies(ticket.id)
      .then((data) => {
        if (isMounted) {
          setReplies(data);
        }
      })
      .catch((err: unknown) => {
        console.error("Gagal memuat balasan tiket:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsFetchingReplies(false);
        }
      });

    return () => {
      isMounted = false;
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
        Math.abs(new Date(r.createdAt).getTime() - new Date(initialMessage.createdAt).getTime()) < 3000
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Sticky Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border flex items-start justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 px-2.5 py-0.5 rounded-full border border-wise-green/30">
                {ticket.ticketNumber}
              </span>
              <span className="text-xs font-semibold text-foreground-muted">
                {ticket.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
              {ticket.subject}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Body: Attachment & Messages */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 space-y-4">
          {/* Top Initial Attachment preview if exists */}
          {ticket.attachment && (
            <div className="p-3 rounded-md bg-muted/50 border border-border flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="size-10 rounded bg-surface dark:bg-black/40 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ticket.attachment}
                    alt="Lampiran Tiket"
                    className="size-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <span className="font-bold text-foreground block truncate">
                    {t("support.attachmentLabel")} (Awal)
                  </span>
                  <span className="text-[11px] text-foreground-muted">Cloudflare R2 Storage</span>
                </div>
              </div>
              <a
                href={ticket.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-wise-green hover:underline px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-wise-green/10 border border-emerald-500/20 dark:border-wise-green/20 shrink-0"
              >
                <span>{t("support.viewAttachment")}</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          {/* Loading Indicator for replies */}
          {isFetchingReplies && replies.length === 0 && (
            <div className="flex items-center justify-center py-3 text-foreground-muted gap-2 text-xs font-semibold">
              <Loader2 className="size-3.5 animate-spin text-emerald-700 dark:text-wise-green" />
              <span>Memuat riwayat balasan...</span>
            </div>
          )}

          {/* Message Thread History */}
          <div className="space-y-4 py-1 divide-y divide-transparent">
            {allMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col space-y-1 ${
                  msg.isStaff ? "items-start" : "items-end"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground-muted px-1">
                  {msg.isStaff ? (
                    <>
                      <ShieldCheck className="size-3.5 text-dark-green dark:text-wise-green" />
                      <span className="text-dark-green dark:text-wise-green font-extrabold">{msg.senderName}</span>
                    </>
                  ) : (
                    <>
                      <User className="size-3 text-foreground-muted" />
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
                  className={`p-3.5 sm:p-4 rounded-lg max-w-[85%] text-xs font-semibold leading-relaxed shadow-sm space-y-2.5 ${
                    msg.isStaff
                      ? "bg-muted/80 text-foreground border border-border"
                      : "bg-[#e2f7cb] dark:bg-[#005c4b]/50 text-foreground border border-[#c4e8a5] dark:border-[#005c4b]"
                  }`}
                >
                  {/* Inline Image Attachment in Bubble */}
                  {msg.attachment && (
                    <div className="rounded overflow-hidden border border-border/50 bg-black/5 dark:bg-black/30 max-w-sm">
                      <a
                        href={msg.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group relative overflow-hidden cursor-pointer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={msg.attachment}
                          alt="Lampiran Screenshot"
                          className="max-h-56 w-full object-cover group-hover:scale-105 transition duration-200"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-[11px] font-bold gap-1">
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
        <form onSubmit={handleSend} className="p-4 sm:p-6 pt-3 border-t border-border bg-surface/90 dark:bg-[#161715]/90 backdrop-blur-sm shrink-0 space-y-2.5">
          {/* File Attachment Preview Chip */}
          {(previewUrl || isUploading || uploadError) && (
            <div>
              {uploadError ? (
                <div className="flex items-center justify-between gap-2 p-2 px-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
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
                <div className="flex items-center justify-between gap-3 p-2 px-3 rounded-md bg-muted/60 border border-border text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="size-10 rounded bg-surface border border-border overflow-hidden shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Preview Lampiran" className="size-full object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-bold text-foreground block truncate">
                        {attachmentFile?.name || "Lampiran Gambar"}
                      </span>
                      <span className="text-[11px] text-foreground-muted">
                        {isUploading ? "Mengunggah ke Cloudflare R2..." : "Siap dilampirkan"}
                      </span>
                    </div>
                  </div>
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin text-emerald-700 dark:text-wise-green shrink-0" />
                  ) : (
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="size-6 rounded-full flex items-center justify-center text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
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
              className="w-full p-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-semibold text-xs border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition"
            />

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-foreground-secondary hover:text-foreground hover:bg-muted border border-border transition cursor-pointer disabled:opacity-50"
                title="Unggah Gambar / Screenshot"
              >
                <Paperclip className="size-3.5 text-emerald-700 dark:text-wise-green" />
                <span>Lampirkan Gambar</span>
              </button>

              <Button
                type="submit"
                variant="primaryPill"
                size="sm"
                disabled={isLoading || isUploading || (!replyText.trim() && !attachmentUrl && !attachmentFile)}
                className="text-xs font-bold gap-1.5 shadow-sm h-8 px-4 cursor-pointer"
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
