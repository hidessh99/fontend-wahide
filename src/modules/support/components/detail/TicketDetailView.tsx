"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Ticket, TicketMessage, TicketStatus } from "../../types/support.types";
import { supportApi } from "../../api/support.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  User,
  ExternalLink,
  Paperclip,
  Send,
  Loader2,
  Lock,
  X,
  Check,
} from "lucide-react";

/**
 * Strict protocol sanitizer for media URLs (img src and a href)
 * Prevents DOM-based XSS (CodeQL js/xss-through-dom) and rejects dangerous schemes (javascript:, vbscript:, data:text/html)
 */
function getSafeMediaUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  if (
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://")
  ) {
    if (/^(javascript|vbscript|data:(?!image\/)):/i.test(trimmed)) {
      return null;
    }
    return trimmed;
  }
  return null;
}

interface TicketDetailViewProps {
  ticketId: string;
}

export function TicketDetailView({ ticketId }: TicketDetailViewProps) {
  const { t } = useI18n();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<TicketMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reply Composer State
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close Ticket State
  const [isClosing, setIsClosing] = useState(false);

  // Clean up object URL on unmount to prevent browser memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [ticketData, repliesData] = await Promise.all([
          supportApi.getTicket(ticketId),
          supportApi.getReplies(ticketId),
        ]);
        if (isMounted) {
          setTicket(ticketData);
          setReplies(repliesData);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : t("support.ticketNotFoundDesc");
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [ticketId, t]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Revoke previous blob url if exists
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setUploadError(null);
    setIsUploading(true);
    setAttachmentFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const url = await supportApi.uploadImage(file);
      setAttachmentUrl(url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("support.errUploadFailed");
      setUploadError(msg);
      setAttachmentUrl("");
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
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

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!replyText.trim() && !attachmentUrl && !attachmentFile) || !ticket) return;

    const text = replyText.trim();
    setIsSending(true);
    try {
      let finalAttachmentUrl = attachmentUrl;
      if (!finalAttachmentUrl && attachmentFile) {
        finalAttachmentUrl = await supportApi.uploadImage(attachmentFile);
      }

      const newMsg = await supportApi.replyTicket(ticket.id, text, finalAttachmentUrl || undefined);

      setReplies((prev) => [...prev, newMsg]);
      setReplyText("");
      handleRemoveAttachment();
      toast.success(t("support.toastReplySent"));

      // If status was WAITING_FOR_REPLY, user reply sets it back to OPEN
      setTicket((prev) => (prev ? { ...prev, status: "OPEN" } : prev));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("support.errReplyFailed");
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!ticket || ticket.status === "CLOSED") return;
    setIsClosing(true);
    try {
      await supportApi.closeTicket(ticket.id);
      setTicket((prev) => (prev ? { ...prev, status: "CLOSED" } : prev));
      toast.success(t("support.ticketClosedSuccess"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("support.ticketCloseFailed");
      toast.error(msg);
    } finally {
      setIsClosing(false);
    }
  };

  const renderStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "RESOLVED":
        return (
          <Badge variant="success">
            <CheckCircle2 className="size-3" />
            <span>{t("support.statusResolved")}</span>
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge variant="warning">
            <Clock className="size-3" />
            <span>{t("support.statusInProgress")}</span>
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge variant="neutral">
            <Lock className="size-3" />
            <span>{t("support.statusClosed")}</span>
          </Badge>
        );
      case "OPEN":
      default:
        return (
          <Badge variant="info">
            <AlertCircle className="size-3" />
            <span>{t("support.statusOpen")}</span>
          </Badge>
        );
    }
  };

  const renderPriorityBadge = (priority: string) => {
    if (priority === "HIGH") {
      return (
        <Badge variant="danger">
          <ShieldAlert className="size-3" />
          <span>{t("support.priorityHigh")}</span>
        </Badge>
      );
    }
    return (
      <Badge variant="neutral">
        {priority === "MEDIUM" ? t("support.priorityMedium") : t("support.priorityLow")}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
        <Skeleton className="h-4 w-40 rounded" />
        <Skeleton className="h-10 w-3/4 rounded-md" />
        <div className="grid grid-cols-1 gap-6 pt-4 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-80 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
        <Link
          href="/support"
          className="text-foreground-muted hover:text-foreground inline-flex items-center gap-2 text-xs font-bold transition"
        >
          <ArrowLeft className="size-3.5" />
          <span>{t("support.backToTickets")}</span>
        </Link>
        <div className="space-y-3 rounded-md border border-rose-500/20 bg-rose-500/10 p-8 text-center">
          <AlertCircle className="mx-auto size-10 text-rose-600 dark:text-rose-400" />
          <h2 className="text-foreground text-lg font-bold">{t("support.ticketNotFound")}</h2>
          <p className="text-foreground-muted mx-auto max-w-md text-xs">
            {error || t("support.ticketNotFoundDesc")}
          </p>
          <div className="pt-2">
            <Link
              href="/support"
              className="border-border bg-surface hover:bg-muted text-foreground inline-flex h-9 items-center rounded-full border px-4 text-xs font-bold transition"
            >
              {t("support.backToSupport")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section dengan Breadcrumb Terintegrasi */}
      <div className="border-border space-y-3 border-b pb-5 sm:pb-6">
        <div>
          <Link
            href="/support"
            className="text-foreground-muted hover:text-foreground group inline-flex items-center gap-1.5 text-xs font-bold transition"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{t("support.backToTickets")}</span>
          </Link>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {ticket.subject}
            </h1>
            <div className="text-foreground-muted flex flex-wrap items-center gap-2.5 text-xs font-semibold">
              <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 rounded-full border px-2.5 py-0.5 font-mono font-bold">
                {ticket.ticketNumber}
              </span>
              <span>•</span>
              {renderStatusBadge(ticket.status)}
              <span>•</span>
              {renderPriorityBadge(ticket.priority)}
              <span>•</span>
              <span className="bg-muted text-foreground-secondary rounded px-2 py-0.5 font-medium">
                {ticket.category}
              </span>
              <span>•</span>
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>

          {ticket.status !== "CLOSED" && (
            <div className="shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseTicket}
                disabled={isClosing}
                className="border-border h-9 cursor-pointer gap-1.5 rounded-full px-4 text-xs font-bold transition hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400"
              >
                {isClosing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                <span>{t("support.closeTicket")}</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column: Thread Timeline & Composer (Col-Span 8) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Initial Message Card */}
          <div className="border-border bg-surface overflow-hidden rounded-md border shadow-xs">
            <div className="border-border/60 bg-muted/30 flex items-center justify-between gap-3 border-b p-4 text-xs sm:p-5">
              <div className="flex items-center gap-2">
                <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-7 items-center justify-center rounded-full bg-emerald-500/10 font-bold text-emerald-700">
                  <User className="size-3.5" />
                </div>
                <div>
                  <span className="text-foreground font-bold">{t("support.senderYou")}</span>
                  <span className="text-foreground-muted ml-2 text-[11px]">
                    {t("support.ticketAuthor")}
                  </span>
                </div>
              </div>
              <span className="text-foreground-muted text-[11px]">
                {formatDate(ticket.createdAt)}
              </span>
            </div>

            <div className="text-foreground space-y-4 p-5 text-xs leading-relaxed font-semibold sm:p-6">
              <p className="whitespace-pre-wrap">{ticket.message || "-"}</p>

              {/* Initial Attachment */}
              {ticket.attachment && getSafeMediaUrl(ticket.attachment) && (
                <div className="bg-muted/40 border-border flex items-center justify-between gap-3 rounded-md border p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-surface border-border flex size-12 shrink-0 items-center justify-center overflow-hidden rounded border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getSafeMediaUrl(ticket.attachment)!}
                        alt="Screenshot"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-foreground block truncate font-bold">
                        {t("support.initialAttachment")}
                      </span>
                      <span className="text-foreground-muted text-[11px]">
                        Cloudflare R2 Storage
                      </span>
                    </div>
                  </div>

                  <a
                    href={getSafeMediaUrl(ticket.attachment)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dark:text-wise-green dark:bg-wise-green/10 dark:border-wise-green/20 inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    <span>{t("support.viewImage")}</span>
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Chronological Replies List */}
          {replies.map((reply) => (
            <div
              key={reply.id}
              className={`overflow-hidden rounded-md border shadow-xs ${
                reply.isStaff
                  ? "border-wise-green/30 bg-wise-green/5 dark:bg-wise-green/5"
                  : "border-border bg-surface"
              }`}
            >
              <div
                className={`flex items-center justify-between gap-3 border-b p-4 text-xs sm:p-5 ${
                  reply.isStaff
                    ? "border-wise-green/20 bg-wise-green/10"
                    : "border-border/60 bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-7 items-center justify-center rounded-full font-bold ${
                      reply.isStaff
                        ? "bg-wise-green text-black"
                        : "bg-muted text-foreground-secondary"
                    }`}
                  >
                    {reply.isStaff ? (
                      <ShieldCheck className="size-4" />
                    ) : (
                      <User className="size-3.5" />
                    )}
                  </div>
                  <div>
                    <span className="text-foreground font-bold">
                      {reply.isStaff
                        ? t("support.staffSupport")
                        : reply.senderName === "Anda" || reply.senderName === "You"
                          ? t("support.senderYou")
                          : reply.senderName}
                    </span>
                    {reply.isStaff && (
                      <span className="bg-wise-green/20 text-dark-green dark:text-wise-green border-wise-green/30 ml-2 rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase">
                        {t("support.staffSupport")}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-foreground-muted text-[11px]">
                  {formatDate(reply.createdAt)}
                </span>
              </div>

              <div className="text-foreground space-y-4 p-5 text-xs leading-relaxed font-semibold sm:p-6">
                {/* Reply Screenshot if any */}
                {reply.attachment && getSafeMediaUrl(reply.attachment) && (
                  <div className="border-border max-w-md overflow-hidden rounded-md border bg-black/5 dark:bg-black/30">
                    <a
                      href={getSafeMediaUrl(reply.attachment)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block cursor-pointer overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getSafeMediaUrl(reply.attachment)!}
                        alt="Screenshot"
                        className="max-h-72 w-full object-cover transition duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                        <span>{t("support.viewFullScreen")}</span>
                        <ExternalLink className="size-3.5" />
                      </div>
                    </a>
                  </div>
                )}

                {reply.content && <p className="whitespace-pre-wrap">{reply.content}</p>}
              </div>
            </div>
          ))}

          {/* Reply Composer Section */}
          {ticket.status !== "CLOSED" ? (
            <div className="border-border bg-surface space-y-4 rounded-xl border p-5 shadow-xs sm:p-6">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <h3 className="text-foreground text-sm font-bold">{t("support.replyToTicket")}</h3>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <Textarea
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t("support.replyPlaceholder")}
                  disabled={isSending}
                  variant="rounded"
                  className="p-4"
                />

                {/* File Attachment Preview Chip */}
                {(previewUrl || isUploading || uploadError) && (
                  <div>
                    {uploadError ? (
                      <div className="flex items-center justify-between gap-2 rounded-md border border-rose-500/20 bg-rose-500/10 p-2.5 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                        <span>{uploadError}</span>
                        <button
                          type="button"
                          onClick={() => setUploadError(null)}
                          className="text-foreground-muted hover:text-foreground cursor-pointer"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : getSafeMediaUrl(previewUrl) ? (
                      <div className="bg-muted/60 border-border flex items-center justify-between gap-3 rounded-md border p-2.5 px-3 text-xs">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="bg-surface border-border flex size-12 shrink-0 items-center justify-center overflow-hidden rounded border">
                            <div
                              role="img"
                              aria-label="Preview"
                              className="size-full bg-cover bg-center"
                              style={{ backgroundImage: `url("${getSafeMediaUrl(previewUrl)!}")` }}
                            />
                          </div>
                          <div className="overflow-hidden">
                            <span className="text-foreground block truncate font-bold">
                              {attachmentFile?.name || t("support.screenshotUploaded")}
                            </span>
                            <span className="text-foreground-muted text-[11px]">
                              {isUploading
                                ? t("support.uploadingImage")
                                : t("support.readyToAttach")}
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
                            title={t("support.removeAttachment")}
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

                <div className="flex flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSending || isUploading}
                      className="text-foreground-secondary hover:text-foreground hover:bg-muted border-border inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50"
                    >
                      <Paperclip className="dark:text-wise-green size-3.5 text-emerald-700" />
                      <span>{t("support.attachImage")}</span>
                    </button>
                    <p className="text-foreground-muted pl-1 text-[11px]">
                      {t("support.supportedFormats")}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="primaryPill"
                    disabled={
                      isSending ||
                      isUploading ||
                      (!replyText.trim() && !attachmentUrl && !attachmentFile)
                    }
                    className="h-9 w-full cursor-pointer gap-1.5 px-5 text-xs font-bold shadow-sm sm:w-auto"
                  >
                    {isSending || isUploading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="size-3.5" />
                        <span>{t("support.sendReply")}</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="border-border bg-muted/30 space-y-2 rounded-md border p-6 text-center">
              <Lock className="text-foreground-muted mx-auto size-5" />
              <h4 className="text-foreground text-xs font-bold">
                {t("support.ticketClosedNotice")}
              </h4>
              <p className="text-foreground-muted mx-auto max-w-sm text-[11px]">
                {t("support.ticketClosedNoticeDesc")}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Ticket Details Sidebar (Col-Span 4) */}
        <div className="lg:col-span-4">
          <div className="border-border bg-surface sticky top-6 space-y-5 rounded-md border p-5 shadow-xs">
            <h3 className="text-foreground border-border border-b pb-3 text-sm font-bold">
              {t("support.ticketDetailsTitle")}
            </h3>

            <div className="divide-border/60 divide-y text-xs font-semibold">
              <div className="flex items-center justify-between gap-2 py-2.5">
                <span className="text-foreground-muted">{t("support.detailStatus")}</span>
                <div>{renderStatusBadge(ticket.status)}</div>
              </div>

              <div className="flex items-center justify-between gap-2 py-2.5">
                <span className="text-foreground-muted">{t("support.detailPriority")}</span>
                <div>{renderPriorityBadge(ticket.priority)}</div>
              </div>

              <div className="flex items-center justify-between gap-2 py-2.5">
                <span className="text-foreground-muted">{t("support.detailCategory")}</span>
                <span className="text-foreground font-bold">{ticket.category}</span>
              </div>

              <div className="flex items-center justify-between gap-2 py-2.5">
                <span className="text-foreground-muted">{t("support.detailRefNumber")}</span>
                <span className="text-dark-green dark:text-wise-green font-mono font-bold">
                  {ticket.ticketNumber}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 py-2.5">
                <span className="text-foreground-muted">{t("support.detailCreatedAt")}</span>
                <span className="text-foreground">{formatDate(ticket.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between gap-2 py-2.5">
                <span className="text-foreground-muted">{t("support.detailUpdatedAt")}</span>
                <span className="text-foreground">{formatDate(ticket.updatedAt)}</span>
              </div>

              <div className="flex items-center justify-between gap-2 py-2.5">
                <span className="text-foreground-muted">{t("support.detailTotalReplies")}</span>
                <span className="bg-muted text-foreground rounded-full px-2 py-0.5 text-[11px] font-bold">
                  {replies.length}
                </span>
              </div>
            </div>

            {ticket.attachment && getSafeMediaUrl(ticket.attachment) && (
              <div className="border-border border-t pt-2">
                <span className="text-foreground-muted mb-2 block text-[11px] font-bold">
                  {t("support.initialAttachmentSidebar")}
                </span>
                <a
                  href={getSafeMediaUrl(ticket.attachment)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border group relative block overflow-hidden rounded border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getSafeMediaUrl(ticket.attachment)!}
                    alt="Attachment"
                    className="h-32 w-full object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
                    <span>{t("support.viewImage")}</span>
                    <ExternalLink className="size-3" />
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
