"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MessageLogResponse } from "@/modules/campaign/types/campaign.types";
import { useClipboard } from "@/hooks/useClipboard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Copy,
  Check,
  CheckCheck,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Clock,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  ScrollText,
} from "lucide-react";

interface WABAMessageDetailDialogProps {
  log: MessageLogResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

const idDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const formatDetailTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "-" : idDateFormatter.format(d);
};

export function WABAMessageDetailDialog({
  log,
  isOpen,
  onClose,
}: WABAMessageDetailDialogProps) {
  const { isCopied: copiedText, copy: copyText } = useClipboard();
  const { isCopied: copiedPhone, copy: copyPhone } = useClipboard();
  const { isCopied: copiedWamid, copy: copyWamid } = useClipboard();
  const { isCopied: copiedId, copy: copyId } = useClipboard();

  if (!log) return null;

  const phone = log.recipient_jid
    ? log.recipient_jid.split("@")[0].replace(/^\+?/, "+")
    : "-";

  const wamid = log.waba_info?.meta_message_id || "";

  const handleCopyBody = async () => {
    if (!log.message_body) return;
    const ok = await copyText(log.message_body);
    if (ok) {
      toast.success("Teks pesan Meta WABA berhasil disalin!", {
        id: "copy-waba-text",
      });
    }
  };

  const handleCopyPhone = async () => {
    if (!phone || phone === "-") return;
    const ok = await copyPhone(phone);
    if (ok) {
      toast.success("Nomor penerima berhasil disalin!", {
        id: "copy-waba-phone",
      });
    }
  };

  const handleCopyWamid = async () => {
    if (!wamid) return;
    const ok = await copyWamid(wamid);
    if (ok) {
      toast.success("Meta WAMID berhasil disalin!", {
        id: "copy-waba-wamid",
      });
    }
  };

  const handleCopyId = async () => {
    if (!log.id) return;
    const ok = await copyId(log.id);
    if (ok) {
      toast.success("ID Log audit berhasil disalin!", {
        id: "copy-waba-logid",
      });
    }
  };

  const renderStatusBadge = (status?: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "READ":
        return (
          <Badge
            variant="info"
            className="gap-1 px-2.5 py-0.5 text-[11px] font-bold"
          >
            <CheckCheck className="size-3.5" />
            <span>READ (Dibaca)</span>
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge
            variant="success"
            className="gap-1 px-2.5 py-0.5 text-[11px] font-bold"
          >
            <CheckCircle2 className="size-3.5" />
            <span>DELIVERED (Diterima)</span>
          </Badge>
        );
      case "SENT":
        return (
          <Badge
            variant="neutral"
            className="gap-1 px-2.5 py-0.5 text-[11px] font-bold"
          >
            <Check className="size-3.5" />
            <span>SENT (Terkirim)</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="danger"
            className="gap-1 px-2.5 py-0.5 text-[11px] font-bold"
          >
            <XCircle className="size-3.5" />
            <span>FAILED (Gagal)</span>
          </Badge>
        );
      default:
        return (
          <Badge
            variant="warning"
            className="gap-1 px-2.5 py-0.5 text-[11px] font-bold"
          >
            <Clock className="size-3.5" />
            <span>{s || "PENDING"}</span>
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <ScrollText className="size-4.5" />
              </div>
              <DialogTitle className="text-base font-bold sm:text-lg">
                Detail Pesan Meta WABA Official
              </DialogTitle>
            </div>
            {renderStatusBadge(log.status)}
          </div>
          <p className="text-foreground-secondary text-xs">
            Audit rekam jejak resmi Meta Cloud API, WAMID, dan kategori percakapan.
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2 text-xs">
          {/* Diagnostic Error Banner if FAILED */}
          {log.status === "FAILED" && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/15 dark:text-rose-400">
              <AlertCircle className="size-4.5 shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0 flex-1">
                <p className="font-bold text-xs">Penolakan Transmisi Meta Cloud API</p>
                <p className="font-mono text-[11px] break-all">
                  {log.error_message || "Meta Cloud API returned an unclassified rejection"}
                </p>
              </div>
            </div>
          )}

          {/* Recipient & WAMID */}
          <div className="space-y-2 rounded-xl border border-border bg-surface p-3 dark:bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                Nomor Tujuan
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-foreground text-sm">
                  {phone}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyPhone}
                  className="size-7 p-0 text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  {copiedPhone ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {wamid && (
              <>
                <Separator className="bg-border/60" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                      Meta Official WAMID
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyWamid}
                      className="h-6 gap-1 px-1.5 text-[10px] text-foreground-muted hover:text-foreground cursor-pointer"
                    >
                      {copiedWamid ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span>Salin WAMID</span>
                    </Button>
                  </div>
                  <div className="rounded bg-muted/60 px-2 py-1.5 font-mono text-[11px] text-foreground break-all border border-border/50">
                    {wamid}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* WABA Meta Information (Category, Conversation ID, Fee) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 rounded-xl border border-border bg-surface p-3 dark:bg-muted/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                Kategori Percakapan
              </span>
              <div className="pt-0.5">
                <Badge variant="outline" className="font-mono text-[10px] font-bold">
                  {log.waba_info?.conversation_category || "UTILITY"}
                </Badge>
              </div>
            </div>

            <div className="space-y-1 rounded-xl border border-border bg-surface p-3 dark:bg-muted/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                Estimasi Biaya Meta
              </span>
              <div className="flex items-center gap-1 pt-0.5 font-mono text-xs font-bold text-foreground">
                <DollarSign className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {typeof log.waba_info?.conversation_fee === "number" &&
                  log.waba_info.conversation_fee > 0
                    ? `$${log.waba_info.conversation_fee.toFixed(4)}`
                    : "Termasuk Kuota"}
                </span>
              </div>
            </div>
          </div>

          {/* Full Message Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-secondary">
                Konten Pesan / Template
              </span>
              {log.message_body && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyBody}
                  className="h-6 gap-1 px-1.5 text-[10px] text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  {copiedText ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  <span>Salin Pesan</span>
                </Button>
              )}
            </div>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-border bg-muted/40 p-3 font-sans text-xs leading-relaxed text-foreground whitespace-pre-wrap select-text">
              {log.message_body || (
                <span className="italic text-foreground-muted">
                  (Pesan template Meta HSM atau lampiran berkas media)
                </span>
              )}
            </div>
          </div>

          {/* Media URL if exists */}
          {log.media_url && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 dark:bg-muted/20">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate text-xs font-mono text-foreground">
                  {log.media_url}
                </span>
              </div>
              <a
                href={log.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xs" }),
                  "h-7 text-[11px] gap-1 shrink-0 ml-2",
                )}
              >
                <ExternalLink className="size-3" />
                <span>Buka</span>
              </a>
            </div>
          )}

          {/* Timestamps & Log ID */}
          <div className="rounded-xl border border-border bg-surface p-3 space-y-2 dark:bg-muted/20">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-foreground-secondary font-medium flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Dibuat
              </span>
              <span className="font-mono text-foreground">
                {formatDetailTime(log.created_at)}
              </span>
            </div>

            {log.sent_at && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-foreground-secondary font-medium flex items-center gap-1.5">
                  <Clock className="size-3.5" /> Terkirim ke Meta
                </span>
                <span className="font-mono text-foreground">
                  {formatDetailTime(log.sent_at)}
                </span>
              </div>
            )}

            <Separator className="bg-border/60" />

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-foreground-secondary font-medium">
                Log UUID
              </span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[10px] text-foreground-muted truncate max-w-[170px] sm:max-w-xs">
                  {log.id}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyId}
                  className="size-6 p-0 text-foreground-muted hover:text-foreground cursor-pointer"
                >
                  {copiedId ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-xs font-semibold cursor-pointer"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
