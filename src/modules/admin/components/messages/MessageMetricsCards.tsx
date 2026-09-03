import React from "react";
import { MessageSquare, CheckCircle2, CheckCheck, AlertCircle } from "lucide-react";

export interface MessageMetrics {
  totalCount: number;
  outboundCount: number;
  inboundCount: number;
  deliveredCount: number;
  sentCount: number;
  readCount: number;
  failedCount: number;
}

interface MessageMetricsCardsProps {
  metrics: MessageMetrics;
}

export function MessageMetricsCards({ metrics }: MessageMetricsCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex items-center justify-between text-foreground-muted mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Pesan</span>
          <MessageSquare className="size-4 text-foreground-secondary" />
        </div>
        <div className="text-lg sm:text-xl font-black font-mono text-foreground">
          {metrics.totalCount.toLocaleString("id-ID")} Pesan
        </div>
        <span className="text-[10px] text-foreground-muted">
          {metrics.outboundCount} Keluar &bull; {metrics.inboundCount} Masuk
        </span>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex items-center justify-between text-foreground-muted mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Tersampaikan</span>
          <CheckCircle2 className="size-4 text-emerald-600 dark:text-wise-green" />
        </div>
        <div className="text-lg sm:text-xl font-black font-mono text-emerald-700 dark:text-wise-green">
          {(metrics.deliveredCount + metrics.sentCount).toLocaleString("id-ID")} Pesan
        </div>
        <span className="text-[10px] text-foreground-muted">Berhasil terkirim ke WhatsApp</span>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex items-center justify-between text-foreground-muted mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Terbaca</span>
          <CheckCheck className="size-4 text-blue-500" />
        </div>
        <div className="text-lg sm:text-xl font-black font-mono text-blue-600 dark:text-blue-400">
          {metrics.readCount.toLocaleString("id-ID")} Pesan
        </div>
        <span className="text-[10px] text-foreground-muted">Centang biru (dibaca penerima)</span>
      </div>

      <div className="p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs">
        <div className="flex items-center justify-between text-foreground-muted mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider">Gagal Terkirim</span>
          <AlertCircle className="size-4 text-rose-500" />
        </div>
        <div className="text-lg sm:text-xl font-black font-mono text-rose-600 dark:text-rose-400">
          {metrics.failedCount.toLocaleString("id-ID")} Pesan
        </div>
        <span className="text-[10px] text-foreground-muted">Perlu investigasi nomor/koneksi</span>
      </div>
    </div>
  );
}
