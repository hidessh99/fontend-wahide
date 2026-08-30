"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Bell,
  Send,
  Layers,
  CheckCircle2,
  Clock,
  Megaphone,
  Loader2,
} from "lucide-react";

export function AdminNotificationsView() {
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastChannel, setBroadcastChannel] = useState("ALL");
  const [isSending, setIsSending] = useState(false);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      toast.error("Judul dan pesan siaran wajib diisi.");
      return;
    }

    setIsSending(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      toast.success("Siaran pengumuman massal berhasil dijadwalkan ke 142 tenant!");
      setBroadcastTitle("");
      setBroadcastMessage("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2.5 border-b border-border pb-4">
        <div className="size-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <Bell className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">Siaran &amp; Antrean Notifikasi</h1>
          <p className="text-xs font-semibold text-foreground-secondary">
            Kirim pengumuman massal ke seluruh pengguna dan monitor worker background queue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Broadcast Form */}
        <div className="p-6 rounded-md border border-border bg-surface dark:bg-[#161715] space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Megaphone className="size-4 text-rose-500" />
            <h2 className="text-base font-extrabold text-foreground">Siaran Massal ke Seluruh User</h2>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Target Saluran Siaran
              </label>
              <select
                value={broadcastChannel}
                onChange={(e) => setBroadcastChannel(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
              >
                <option value="ALL">Semua Saluran (In-App Banner + Email)</option>
                <option value="IN_APP">Hanya Banner In-App Dasbor</option>
                <option value="EMAIL">Hanya Email Notifikasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Judul Pengumuman
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="Contoh: Pemeliharaan Server Jam 02:00 WIB"
                className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Isi Pengumuman
              </label>
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Rincian pesan pengumuman..."
                className="w-full p-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-semibold text-xs border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition"
              />
            </div>

            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isSending}
              className="w-full text-xs font-bold gap-2 shadow-sm"
            >
              {isSending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Mengirimkan Siaran...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Kirim ke 142 Tenant</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Right: Worker Queue Monitor Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-wise-green" />
            <h2 className="text-base font-extrabold text-foreground">Antrean Notifikasi Worker (Redis Stream)</h2>
          </div>

          <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-muted/60 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground-muted select-none">
              <div className="col-span-4">Tipe Antrean</div>
              <div className="col-span-4">Penerima</div>
              <div className="col-span-2 text-center">Percobaan</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            <div className="divide-y divide-border/50 text-xs font-semibold">
              {[
                { type: "EMAIL_VERIFICATION", target: "budi@tokoonline.com", attempts: "1/3", status: "COMPLETED" },
                { type: "WEBHOOK_DISPATCH", target: "api.bisnisanda.com/webhook", attempts: "1/5", status: "PROCESSING" },
                { type: "INVOICE_PAID_ALERT", target: "siti@agenproperti.id", attempts: "1/3", status: "COMPLETED" },
                { type: "PASSWORD_RESET", target: "user99@gmail.com", attempts: "2/3", status: "PENDING" },
              ].map((q, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition">
                  <div className="col-span-4 font-mono text-[11px] text-foreground truncate">{q.type}</div>
                  <div className="col-span-4 font-mono text-[11px] text-foreground-secondary truncate">{q.target}</div>
                  <div className="col-span-2 text-center font-mono text-foreground-muted">{q.attempts}</div>
                  <div className="col-span-2 flex justify-end">
                    {q.status === "COMPLETED" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                        <CheckCircle2 className="size-3" />
                        <span>Selesai</span>
                      </span>
                    ) : q.status === "PROCESSING" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-500">
                        <Loader2 className="size-3 animate-spin" />
                        <span>Proses</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Clock className="size-3" />
                        <span>Antre</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
