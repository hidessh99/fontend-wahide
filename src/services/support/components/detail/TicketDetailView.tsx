"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Ticket, TicketMessage, TicketStatus } from "../../types/support.types";
import { supportApi } from "../../api/support.api";
import { Button } from "@/components/ui/button";
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

      const newMsg = await supportApi.replyTicket(
        ticket.id,
        text,
        finalAttachmentUrl || undefined
      );

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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-3" />
            <span>{t("support.statusResolved")}</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="size-3" />
            <span>{t("support.statusInProgress")}</span>
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-muted text-foreground-muted border border-border">
            <Lock className="size-3" />
            <span>{t("support.statusClosed")}</span>
          </span>
        );
      case "OPEN":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <AlertCircle className="size-3" />
            <span>{t("support.statusOpen")}</span>
          </span>
        );
    }
  };

  const renderPriorityBadge = (priority: string) => {
    if (priority === "HIGH") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase">
          <ShieldAlert className="size-3.5" />
          <span>{t("support.priorityHigh")}</span>
        </span>
      );
    }
    return (
      <span className="text-xs font-bold text-foreground-muted uppercase">
        {priority === "MEDIUM"
          ? t("support.priorityMedium")
          : t("support.priorityLow")}
      </span>
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
      <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="h-4 w-40 bg-muted rounded" />
        <div className="h-10 w-3/4 bg-muted rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-48 bg-muted rounded-md" />
            <div className="h-64 bg-muted rounded-md" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-80 bg-muted rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link
          href="/support"
          className="inline-flex items-center gap-2 text-xs font-bold text-foreground-muted hover:text-foreground transition"
        >
          <ArrowLeft className="size-3.5" />
          <span>{t("support.backToTickets")}</span>
        </Link>
        <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-8 text-center space-y-3">
          <AlertCircle className="size-10 text-rose-600 dark:text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-foreground">
            {t("support.ticketNotFound")}
          </h2>
          <p className="text-xs text-foreground-muted max-w-md mx-auto">
            {error || t("support.ticketNotFoundDesc")}
          </p>
          <div className="pt-2">
            <Link
              href="/support"
              className="inline-flex items-center h-9 px-4 rounded-full text-xs font-bold border border-border bg-surface hover:bg-muted transition text-foreground"
            >
              {t("support.backToSupport")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Top Breadcrumb Link */}
      <div>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 text-xs font-bold text-foreground-muted hover:text-foreground transition group"
        >
          <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>{t("support.backToTickets")}</span>
        </Link>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
            {ticket.subject}
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-foreground-muted">
            <span className="font-mono text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 px-2.5 py-0.5 rounded-full border border-wise-green/30 font-bold">
              {ticket.ticketNumber}
            </span>
            <span>•</span>
            {renderStatusBadge(ticket.status)}
            <span>•</span>
            {renderPriorityBadge(ticket.priority)}
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-muted text-foreground-secondary font-medium">
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
              className="h-9 px-4 rounded-full text-xs font-bold gap-1.5 border-border hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
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

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Thread Timeline & Composer (Col-Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Initial Message Card */}
          <div className="rounded-md border border-border bg-surface dark:bg-[#161715] shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-border/60 bg-muted/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center font-bold">
                  <User className="size-3.5" />
                </div>
                <div>
                  <span className="font-bold text-foreground">
                    {t("support.senderYou")}
                  </span>
                  <span className="text-foreground-muted ml-2 text-[11px]">
                    {t("support.ticketAuthor")}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-foreground-muted">
                {formatDate(ticket.createdAt)}
              </span>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs font-semibold text-foreground leading-relaxed">
              <p className="whitespace-pre-wrap">{ticket.message || "-"}</p>

              {/* Initial Attachment */}
              {ticket.attachment && (
                <div className="p-3 rounded-md bg-muted/40 border border-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="size-12 rounded bg-surface border border-border overflow-hidden shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ticket.attachment}
                        alt="Screenshot"
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <span className="font-bold text-foreground block truncate">
                        {t("support.initialAttachment")}
                      </span>
                      <span className="text-[11px] text-foreground-muted">
                        Cloudflare R2 Storage
                      </span>
                    </div>
                  </div>

                  <a
                    href={ticket.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-wise-green hover:underline px-3 py-1.5 rounded-full bg-wise-green/10 border border-wise-green/20 shrink-0"
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
              className={`rounded-md border shadow-xs overflow-hidden ${
                reply.isStaff
                  ? "border-wise-green/30 bg-wise-green/5 dark:bg-wise-green/5"
                  : "border-border bg-surface dark:bg-[#161715]"
              }`}
            >
              <div
                className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 text-xs ${
                  reply.isStaff
                    ? "border-wise-green/20 bg-wise-green/10"
                    : "border-border/60 bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-7 rounded-full flex items-center justify-center font-bold ${
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
                    <span className="font-bold text-foreground">
                      {reply.isStaff
                        ? t("support.staffSupport")
                        : reply.senderName === "Anda" || reply.senderName === "You"
                        ? t("support.senderYou")
                        : reply.senderName}
                    </span>
                    {reply.isStaff && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-wise-green/20 text-dark-green dark:text-wise-green border border-wise-green/30">
                        {t("support.staffSupport")}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-foreground-muted">
                  {formatDate(reply.createdAt)}
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-4 text-xs font-semibold text-foreground leading-relaxed">
                {/* Reply Screenshot if any */}
                {reply.attachment && (
                  <div className="rounded-md overflow-hidden border border-border max-w-md bg-black/5 dark:bg-black/30">
                    <a
                      href={reply.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group relative overflow-hidden cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={reply.attachment}
                        alt="Screenshot"
                        className="max-h-72 w-full object-cover group-hover:scale-105 transition duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-bold gap-1.5">
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
            <div className="rounded-md border border-border bg-surface dark:bg-[#161715] shadow-xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="text-sm font-bold text-foreground">
                  {t("support.replyToTicket")}
                </h3>
              </div>

              <form onSubmit={handleSendReply} className="space-y-4">
                <textarea
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t("support.replyPlaceholder")}
                  disabled={isSending}
                  className="w-full p-4 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-semibold text-xs border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition"
                />

                {/* File Attachment Preview Chip */}
                {(previewUrl || isUploading || uploadError) && (
                  <div>
                    {uploadError ? (
                      <div className="flex items-center justify-between gap-2 p-2.5 px-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
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
                      <div className="flex items-center justify-between gap-3 p-2.5 px-3 rounded-md bg-muted/60 border border-border text-xs">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="size-12 rounded bg-surface border border-border overflow-hidden shrink-0 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="overflow-hidden">
                            <span className="font-bold text-foreground block truncate">
                              {attachmentFile?.name || t("support.screenshotUploaded")}
                            </span>
                            <span className="text-[11px] text-foreground-muted">
                              {isUploading
                                ? t("support.uploadingImage")
                                : t("support.readyToAttach")}
                            </span>
                          </div>
                        </div>
                        {isUploading ? (
                          <Loader2 className="size-4 animate-spin text-wise-green shrink-0" />
                        ) : (
                          <button
                            type="button"
                            onClick={handleRemoveAttachment}
                            className="size-6 rounded-full flex items-center justify-center text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isSending || isUploading}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-foreground-secondary hover:text-foreground hover:bg-muted border border-border transition cursor-pointer disabled:opacity-50"
                    >
                      <Paperclip className="size-3.5 text-wise-green" />
                      <span>{t("support.attachImage")}</span>
                    </button>
                    <p className="text-[11px] text-foreground-muted pl-1">
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
                    className="text-xs font-bold gap-1.5 shadow-sm h-9 px-5 cursor-pointer w-full sm:w-auto"
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
            <div className="rounded-md border border-border bg-muted/30 p-6 text-center space-y-2">
              <Lock className="size-5 text-foreground-muted mx-auto" />
              <h4 className="text-xs font-bold text-foreground">
                {t("support.ticketClosedNotice")}
              </h4>
              <p className="text-[11px] text-foreground-muted max-w-sm mx-auto">
                {t("support.ticketClosedNoticeDesc")}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Ticket Details Sidebar (Col-Span 4) */}
        <div className="lg:col-span-4">
          <div className="rounded-md border border-border bg-surface dark:bg-[#161715] shadow-xs p-5 space-y-5 sticky top-6">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3">
              {t("support.ticketDetailsTitle")}
            </h3>

            <div className="divide-y divide-border/60 text-xs font-semibold">
              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-foreground-muted">
                  {t("support.detailStatus")}
                </span>
                <div>{renderStatusBadge(ticket.status)}</div>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-foreground-muted">
                  {t("support.detailPriority")}
                </span>
                <div>{renderPriorityBadge(ticket.priority)}</div>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-foreground-muted">
                  {t("support.detailCategory")}
                </span>
                <span className="font-bold text-foreground">{ticket.category}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-foreground-muted">
                  {t("support.detailRefNumber")}
                </span>
                <span className="font-mono text-dark-green dark:text-wise-green font-bold">
                  {ticket.ticketNumber}
                </span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-foreground-muted">
                  {t("support.detailCreatedAt")}
                </span>
                <span className="text-foreground">{formatDate(ticket.createdAt)}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-foreground-muted">
                  {t("support.detailUpdatedAt")}
                </span>
                <span className="text-foreground">{formatDate(ticket.updatedAt)}</span>
              </div>

              <div className="py-2.5 flex items-center justify-between gap-2">
                <span className="text-foreground-muted">
                  {t("support.detailTotalReplies")}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-muted text-foreground font-bold text-[11px]">
                  {replies.length}
                </span>
              </div>
            </div>

            {ticket.attachment && (
              <div className="pt-2 border-t border-border">
                <span className="text-[11px] font-bold text-foreground-muted block mb-2">
                  {t("support.initialAttachmentSidebar")}
                </span>
                <a
                  href={ticket.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded overflow-hidden border border-border group relative"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ticket.attachment}
                    alt="Attachment"
                    className="h-32 w-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-xs font-bold gap-1">
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
