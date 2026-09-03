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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">Total Pesan</span>
          <MessageSquare className="text-foreground-secondary size-4" />
        </div>
        <div className="text-foreground font-mono text-lg font-black sm:text-xl">
          {metrics.totalCount.toLocaleString("id-ID")} Pesan
        </div>
        <span className="text-foreground-muted text-[10px]">
          {metrics.outboundCount} Keluar &bull; {metrics.inboundCount} Masuk
        </span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">Tersampaikan</span>
          <CheckCircle2 className="dark:text-wise-green size-4 text-emerald-600" />
        </div>
        <div className="dark:text-wise-green font-mono text-lg font-black text-emerald-700 sm:text-xl">
          {(metrics.deliveredCount + metrics.sentCount).toLocaleString("id-ID")} Pesan
        </div>
        <span className="text-foreground-muted text-[10px]">Berhasil terkirim ke WhatsApp</span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">Terbaca</span>
          <CheckCheck className="size-4 text-blue-500" />
        </div>
        <div className="font-mono text-lg font-black text-blue-600 sm:text-xl dark:text-blue-400">
          {metrics.readCount.toLocaleString("id-ID")} Pesan
        </div>
        <span className="text-foreground-muted text-[10px]">Centang biru (dibaca penerima)</span>
      </div>

      <div className="border-border bg-surface rounded-xl border p-4 shadow-xs dark:bg-[#161715]">
        <div className="text-foreground-muted mb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wider uppercase">Gagal Terkirim</span>
          <AlertCircle className="size-4 text-rose-500" />
        </div>
        <div className="font-mono text-lg font-black text-rose-600 sm:text-xl dark:text-rose-400">
          {metrics.failedCount.toLocaleString("id-ID")} Pesan
        </div>
        <span className="text-foreground-muted text-[10px]">Perlu investigasi nomor/koneksi</span>
      </div>
    </div>
  );
}
