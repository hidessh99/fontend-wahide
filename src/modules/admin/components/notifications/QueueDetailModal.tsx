"use client";


import { AdminQueueItem } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { formatDateTime } from "@/lib/utils";
import { X, Layers, AlertCircle, Clock, CheckCircle2, User, Mail } from "lucide-react";

interface QueueDetailModalProps {
  queue: AdminQueueItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QueueDetailModal({ queue, isOpen, onClose }: QueueDetailModalProps) {
  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

  if (!isOpen || !queue) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
              <Layers className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground tracking-tight">
                Detail Tugas Antrean
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary font-mono">
                ID: {queue.id}
              </p>
            </div>
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

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Status & Task Type Card */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-border bg-muted/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-foreground-muted block mb-1">
                Tipe Tugas
              </span>
              <span className="px-2 py-1 rounded-md text-xs font-black font-mono bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/20 inline-block">
                {queue.taskType}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-foreground-muted block mb-1">
                Status Eksekusi
              </span>
              <span className="font-bold text-foreground inline-flex items-center gap-1">
                {queue.status === "COMPLETED" && <CheckCircle2 className="size-3.5 text-emerald-600" />}
                {queue.status === "PENDING" && <Clock className="size-3.5 text-amber-500" />}
                {queue.status === "FAILED" && <AlertCircle className="size-3.5 text-rose-500" />}
                <span>{queue.status}</span>
              </span>
            </div>
          </div>

          {/* Target Recipient Card */}
          <div className="p-3 rounded-lg border border-border bg-surface dark:bg-[#10110e] space-y-1.5 font-semibold text-xs">
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="size-3.5 text-foreground-muted" />
              <span className="font-bold text-foreground-secondary">Email Tujuan:</span>
              <span className="font-mono">{queue.targetEmail || "-"}</span>
            </div>
            {queue.targetName && (
              <div className="flex items-center gap-2 text-foreground">
                <User className="size-3.5 text-foreground-muted" />
                <span className="font-bold text-foreground-secondary">Nama:</span>
                <span>{queue.targetName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-foreground-secondary font-bold">Percobaan:</span>
              <span className="font-mono">
                {queue.attempts} / {queue.maxAttempts} (Prioritas: {queue.priority})
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-foreground-secondary p-2.5 rounded-lg border border-border/60 bg-muted/10 font-mono">
            <div>
              <span className="text-[10px] uppercase text-foreground-muted block">Dibuat Pada</span>
              <span>{formatDateTime(queue.createdAt)}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-foreground-muted block">Jadwal / Selesai</span>
              <span>
                {queue.finishedAt
                  ? formatDateTime(queue.finishedAt)
                  : queue.scheduledAt
                  ? formatDateTime(queue.scheduledAt)
                  : "-"}
              </span>
            </div>
          </div>

          {/* Error Details if any */}
          {queue.lastError && (
            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-xs">
                <AlertCircle className="size-3.5" />
                <span>Pesan Kesalahan Terakhir (Last Error):</span>
              </span>
              <pre className="text-[11px] font-mono whitespace-pre-wrap bg-rose-500/5 p-2 rounded border border-rose-500/20 max-h-32 overflow-y-auto">
                {queue.lastError}
              </pre>
            </div>
          )}

          {/* Payload JSON */}
          <div className="space-y-1.5">
            <span className="font-bold text-xs uppercase tracking-wider text-foreground">
              Payload Data (JSON):
            </span>
            <pre className="text-[11px] font-mono bg-muted/40 p-3 rounded-lg border border-border max-h-48 overflow-y-auto text-foreground">
              {JSON.stringify(queue.payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-end shrink-0 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-full text-xs font-bold border-border hover:bg-muted"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
