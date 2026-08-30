"use client";

import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Key, Activity } from "lucide-react";

export function AuditLogsTable() {
  const [tab, setTab] = useState<"auth" | "activity">("auth");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">
            Log Audit &amp; Keamanan Sistem
          </h2>
          <p className="text-xs font-semibold text-foreground-secondary">
            Catatan kronologis aktivitas login pengguna, perubahan hak akses, dan transaksi sistem.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-full bg-muted border border-border text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab("auth")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
              tab === "auth"
                ? "bg-surface dark:bg-[#161715] text-foreground shadow-sm font-extrabold"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Key className="size-3.5" />
            <span>Log Autentikasi</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("activity")}
            className={`px-3 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
              tab === "activity"
                ? "bg-surface dark:bg-[#161715] text-foreground shadow-sm font-extrabold"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Activity className="size-3.5" />
            <span>Log Aktivitas Operasional</span>
          </button>
        </div>
      </div>

      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-muted/60 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground-muted select-none">
          <div className="col-span-4 sm:col-span-3">Pengguna &amp; IP</div>
          <div className="col-span-4 sm:col-span-4">Aktivitas / Event</div>
          <div className="col-span-2 sm:col-span-3">User Agent / Perangkat</div>
          <div className="col-span-2 sm:col-span-2 text-right">Waktu</div>
        </div>

        <div className="divide-y divide-border/50 text-xs font-semibold">
          {[
            {
              email: "budi@tokoonline.com",
              ip: "103.28.112.45",
              event: tab === "auth" ? "Login Berhasil (Password + Turnstile)" : "Membuat Broadcast Campaign (2.500 Pesan)",
              device: "Chrome 128 (Windows 11)",
              time: "2 menit yang lalu",
              success: true,
            },
            {
              email: "superadmin@wahide.com",
              ip: "180.252.88.19",
              event: tab === "auth" ? "Login Superadmin Panel" : "Menyesuaikan Kuota User #usr_01 (+5.000)",
              device: "Safari 17 (macOS Sonoma)",
              time: "15 menit yang lalu",
              success: true,
            },
            {
              email: "unknown@attacker.net",
              ip: "45.133.1.99",
              event: tab === "auth" ? "Login Gagal: Password Salah (Rate Limit Hit)" : "Trigger Webhook Unauthorized",
              device: "Python-requests/2.31",
              time: "1 jam yang lalu",
              success: false,
            },
          ].map((l, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition-colors"
            >
              <div className="col-span-4 sm:col-span-3 space-y-0.5">
                <span className="font-bold text-foreground block truncate">{l.email}</span>
                <span className="text-[11px] text-foreground-muted font-mono block truncate">{l.ip}</span>
              </div>

              <div className="col-span-4 sm:col-span-4 flex items-center gap-2 truncate">
                {l.success ? (
                  <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <ShieldAlert className="size-3.5 text-rose-500 shrink-0" />
                )}
                <span className={l.success ? "text-foreground" : "text-rose-500 font-bold"}>
                  {l.event}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-3 text-foreground-secondary truncate font-mono text-[11px]">
                {l.device}
              </div>

              <div className="col-span-2 sm:col-span-2 text-right text-foreground-muted font-mono text-[11px]">
                {l.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
