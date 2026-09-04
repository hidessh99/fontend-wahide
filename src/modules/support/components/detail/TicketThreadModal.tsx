"use client";

import React, { useState, useEffect, useRef } from "react";
import { Ticket, TicketMessage } from "@/modules/support/types/support.types";
import { supportApi } from "@/modules/support/api/support.api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { Send, Loader2, User, ShieldCheck, ExternalLink, Paperclip, X } from "lucide-react";

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
      .getTicket(ticket.id)
      .then((detail: Ticket) => {
        if (!isCancelled && detail) {
          const fetchedReplies =
            detail.messages && detail.messages.length > 0 ? detail.messages : [];
          setReplies(fetchedReplies);
        }
      })
      .catch(() => {
        // Silently preserve offline / cached state if query fails
      })
      .finally(() => {
        if (!isCancelled) {
          setIsFetchingReplies(false);
        }
      });

    return () => {
      isCancelled = true;
      controller.abort();
    };
  }, [isOpen, ticket?.id]);

  // Clean up object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!ticket) return null;

  // Handle file picker selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setUploadError(t("support.errInvalidFormat"));
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setUploadError(t("support.errFileSize"));
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setUploadError(null);
    setAttachmentFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveAttachment = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setAttachmentFile(null);
    setAttachmentUrl("");
    setPreviewUrl("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !attachmentFile && !attachmentUrl) return;

    setIsLoading(true);
    let finalAttachmentUrl = attachmentUrl;

    try {
      // Step 1: If there's a selected local file not yet uploaded to R2, upload it first
      if (attachmentFile && !attachmentUrl) {
        setIsUploading(true);
        try {
          const url = await supportApi.uploadImage(attachmentFile);
          finalAttachmentUrl = url;
        } catch {
          setUploadError(t("support.errUploadFailed"));
          setIsLoading(false);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Step 2: Send reply payload to backend
      const text = replyText.trim() || "(Lampiran Gambar)";
      const response = await onSendReply(ticket.id, text, finalAttachmentUrl || undefined);

      // Construct immediate message object for state representation
      const createdMessage =
        response && typeof response === "object" && "id" in response
          ? (response as unknown as TicketMessage)
          : null;

      const newMsg: TicketMessage = createdMessage
        ? {
            id: createdMessage.id || String(Date.now()),
            senderName: createdMessage.senderName || "Anda",
            isStaff: Boolean(createdMessage.isStaff),
            content: createdMessage.content || text,
            attachment: createdMessage.attachment || finalAttachmentUrl || undefined,
            createdAt: createdMessage.createdAt || new Date().toISOString(),
          }
        : {
            id: "local_" + Date.now(),
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-2xl">
        {/* Sticky Header */}
        <DialogHeader className="border-border flex shrink-0 flex-row items-start justify-between border-b p-5 pb-4 text-left sm:p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                {ticket.ticketNumber}
              </span>
              <span className="text-foreground-muted text-xs font-semibold">{ticket.category}</span>
            </div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {ticket.subject}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Percakapan tiket bantuan untuk nomor tiket {ticket.ticketNumber}
            </DialogDescription>
          </div>
        </DialogHeader>

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
                rel="noreferrer"
                className="dark:text-wise-green flex shrink-0 items-center gap-1 font-semibold text-emerald-700 hover:underline"
              >
                <span>{t("support.viewAttachment")}</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}

          {/* Initial First Message */}
          {initialMessage && (
            <div className="flex flex-col items-start gap-1 text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <div className="bg-muted text-foreground-secondary flex size-5 items-center justify-center rounded-full">
                  <User className="size-3" />
                </div>
                <span className="text-foreground">{initialMessage.senderName}</span>
                <span className="text-foreground-muted font-mono font-normal">
                  {new Date(initialMessage.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="bg-muted text-foreground max-w-[85%] rounded-2xl rounded-tl-xs px-4 py-2.5 text-xs leading-relaxed font-medium">
                {initialMessage.content}
              </div>
            </div>
          )}

          {/* Loading indicator while loading thread replies */}
          {isFetchingReplies && (
            <div className="text-foreground-muted flex items-center justify-center gap-2 py-4 text-xs font-semibold">
              <Loader2 className="dark:text-wise-green size-4 animate-spin text-emerald-600" />
              <span>{t("support.loadingMessages")}</span>
            </div>
          )}

          {/* Render List of Messages / Replies */}
          {replies.map((reply) => {
            const isUser = !reply.isStaff;
            return (
              <div
                key={reply.id}
                className={`flex flex-col gap-1 ${isUser ? "items-end text-right" : "items-start text-left"}`}
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  {reply.isStaff && (
                    <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
                      <ShieldCheck className="size-3" />
                    </div>
                  )}
                  <span className="text-foreground">{reply.senderName}</span>
                  <span className="text-foreground-muted font-mono font-normal">
                    {new Date(reply.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div
                  className={`max-w-[85%] space-y-2 rounded-2xl px-4 py-2.5 text-xs leading-relaxed font-medium ${
                    isUser
                      ? "dark:text-dark-green rounded-tr-xs bg-emerald-600 text-white dark:bg-[#d4f870]"
                      : "border-border bg-surface text-foreground rounded-tl-xs border shadow-2xs dark:bg-[#10110e]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{reply.content}</p>

                  {/* Inline Message Attachment Image */}
                  {reply.attachment && (
                    <div className="pt-1">
                      <a
                        href={reply.attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative block overflow-hidden rounded-lg border border-black/10"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={reply.attachment}
                          alt="Lampiran Pesan"
                          className="max-h-48 w-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                          <span className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 font-mono text-[10px] text-white backdrop-blur-xs">
                            <ExternalLink className="size-3" /> Buka Ukuran Asli
                          </span>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Input Form with Attachment capability */}
        <form
          onSubmit={handleReplySubmit}
          className="border-border bg-surface/50 shrink-0 border-t p-4 sm:p-5"
        >
          {/* File Picker Hidden */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />

          {uploadError && (
            <div className="mb-2 rounded-md border border-rose-500/20 bg-rose-500/10 p-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {uploadError}
            </div>
          )}

          {/* Selected Attachment Preview Bar */}
          {previewUrl && (
            <div className="border-border bg-muted/40 mb-3 flex items-center justify-between rounded-md border p-2 text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="bg-surface border-border flex size-8 shrink-0 items-center justify-center overflow-hidden rounded border dark:bg-black/40">
                  <div
                    role="img"
                    aria-label="Preview reply"
                    className="size-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${previewUrl}")` }}
                  />
                </div>
                <span className="text-foreground truncate font-mono text-[11px] font-semibold">
                  {attachmentFile?.name || "Lampiran.jpg"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemoveAttachment}
                disabled={isLoading}
                className="text-foreground-muted hover:bg-muted hover:text-foreground flex size-6 cursor-pointer items-center justify-center rounded-full"
                title="Hapus gambar"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={t("support.replyPlaceholder")}
              disabled={isLoading}
              variant="rounded"
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
      </DialogContent>
    </Dialog>
  );
}
