"use client";

import React, { useState, useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ShieldCheck, ShieldAlert, Key, Activity, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditLogItem {
  id: string;
  email: string;
  ip: string;
  event: string;
  device: string;
  time: string;
  success: boolean;
}

const AUTH_LOGS: AuditLogItem[] = [
  {
    id: "log_a_01",
    email: "budi@tokoonline.com",
    ip: "103.28.112.45",
    event: "Login Berhasil (Password + Turnstile)",
    device: "Chrome 128 (Windows 11)",
    time: "2 menit yang lalu",
    success: true,
  },
  {
    id: "log_a_02",
    email: "superadmin@wahide.com",
    ip: "180.252.88.19",
    event: "Login Superadmin Panel",
    device: "Safari 17 (macOS Sonoma)",
    time: "15 menit yang lalu",
    success: true,
  },
  {
    id: "log_a_03",
    email: "unknown@attacker.net",
    ip: "45.133.1.99",
    event: "Login Gagal: Password Salah (Rate Limit Hit)",
    device: "Python-requests/2.31",
    time: "1 jam yang lalu",
    success: false,
  },
  {
    id: "log_a_04",
    email: "dewi@agency.id",
    ip: "36.84.12.8",
    event: "Login Berhasil (Session Cookie Active)",
    device: "Edge 127 (Windows 11)",
    time: "2 jam yang lalu",
    success: true,
  },
  {
    id: "log_a_05",
    email: "bot@crawler.org",
    ip: "185.220.101.5",
    event: "Login Blocked (Cloudflare WAF Captcha)",
    device: "Curl/8.4.0",
    time: "3 jam yang lalu",
    success: false,
  },
];

const ACTIVITY_LOGS: AuditLogItem[] = [
  {
    id: "log_act_01",
    email: "budi@tokoonline.com",
    ip: "103.28.112.45",
    event: "Membuat Broadcast Campaign (2.500 Pesan)",
    device: "Chrome 128 (Windows 11)",
    time: "5 menit yang lalu",
    success: true,
  },
  {
    id: "log_act_02",
    email: "superadmin@wahide.com",
    ip: "180.252.88.19",
    event: "Menyesuaikan Kuota User #usr_01 (+5.000)",
    device: "Safari 17 (macOS Sonoma)",
    time: "20 menit yang lalu",
    success: true,
  },
  {
    id: "log_act_03",
    email: "unknown@attacker.net",
    ip: "45.133.1.99",
    event: "Trigger Webhook Unauthorized",
    device: "Python-requests/2.31",
    time: "1 jam yang lalu",
    success: false,
  },
  {
    id: "log_act_04",
    email: "dewi@agency.id",
    ip: "36.84.12.8",
    event: "Ekspor Data Kontak CSV (1.200 Baris)",
    device: "Edge 127 (Windows 11)",
    time: "2 jam yang lalu",
    success: true,
  },
];

export function AuditLogsTable() {
  const [tab, setTab] = useState<"auth" | "activity">("auth");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const parentRef = useRef<HTMLDivElement>(null);

  const rawLogs = tab === "auth" ? AUTH_LOGS : ACTIVITY_LOGS;

  const filteredLogs = useMemo(() => {
    if (!activeSearch.trim()) return rawLogs;
    const term = activeSearch.toLowerCase().trim();
    return rawLogs.filter(
      (l) =>
        l.email.toLowerCase().includes(term) ||
        l.ip.includes(term) ||
        l.event.toLowerCase().includes(term) ||
        l.device.toLowerCase().includes(term)
    );
  }, [rawLogs, activeSearch]);

  const total = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  // High-Throughput Virtual Scrolling
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: paginatedLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  const handleTabChange = (t: "auth" | "activity") => {
    setTab(t);
    setPage(1);
  };

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground tracking-tight">
            Log Audit &amp; Keamanan Sistem
          </h2>
          <p className="text-xs font-semibold text-foreground-secondary">
            Catatan kronologis aktivitas login pengguna, perubahan hak akses, dan transaksi sistem.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-full bg-muted border border-border text-xs font-bold overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => handleTabChange("auth")}
            className={`px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
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
            onClick={() => handleTabChange("activity")}
            className={`px-3.5 py-1.5 rounded-full transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              tab === "activity"
                ? "bg-surface dark:bg-[#161715] text-foreground shadow-sm font-extrabold"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            <Activity className="size-3.5" />
            <span>Log Aktivitas</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Search Submit Form) */}
      <div className="p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari email, IP address, atau event..."
              className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
            />
            {(searchInput || activeSearch) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                title="Hapus Pencarian"
                aria-label="Hapus Pencarian"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            className="h-10 px-4 text-xs font-bold shadow-xs shrink-0 cursor-pointer"
          >
            <Search className="size-3.5 mr-1" />
            <span>Cari</span>
          </Button>
        </form>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {paginatedLogs.length === 0 ? (
          <div className="p-6 sm:p-10 text-center text-xs font-semibold text-foreground-secondary">
            {activeSearch
              ? `Tidak ditemukan catatan audit dengan kata kunci "${activeSearch}".`
              : "Belum ada log catatan sistem."}
          </div>
        ) : (
          <div>
            {/* Mobile View: Card-based Log List (Visible on < 768px) */}
            <div className="md:hidden divide-y divide-border/50">
              {paginatedLogs.map((l) => (
                <div key={l.id} className="p-3.5 sm:p-4 space-y-2 bg-surface dark:bg-[#161715]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {l.success ? (
                        <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <ShieldAlert className="size-3.5 text-rose-500 shrink-0" />
                      )}
                      <span className={`text-xs font-bold truncate ${l.success ? "text-foreground" : "text-rose-500"}`}>
                        {l.event}
                      </span>
                    </div>

                    <span className="text-[11px] text-foreground-muted font-mono shrink-0">
                      {l.time}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-xs text-foreground-secondary font-mono">
                    <span className="block text-foreground font-semibold truncate">{l.email}</span>
                    <div className="flex items-center justify-between text-[11px] text-foreground-muted pt-0.5">
                      <span>IP: {l.ip}</span>
                      <span className="truncate max-w-45">{l.device}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Tabular Virtualized Grid (Visible on >= 768px) */}
            <div className="hidden md:block">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
                <div className="col-span-3">Pengguna &amp; IP</div>
                <div className="col-span-4">Aktivitas / Event</div>
                <div className="col-span-3">User Agent / Perangkat</div>
                <div className="col-span-2 text-right">Waktu</div>
              </div>

              {/* Table Body */}
              <div
                ref={parentRef}
                className="max-h-135 overflow-auto divide-y divide-border/50 text-xs font-semibold"
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const l = paginatedLogs[virtualRow.index];
                    if (!l) return null;

                    return (
                      <div
                        key={l.id}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                        className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition-colors min-h-14.5"
                      >
                        {/* User & IP */}
                        <div className="col-span-3 space-y-0.5">
                          <span className="font-bold text-sm sm:text-base text-foreground block truncate">{l.email}</span>
                          <span className="text-xs sm:text-sm text-foreground-muted font-mono block truncate">{l.ip}</span>
                        </div>

                        {/* Activity / Event */}
                        <div className="col-span-4 flex items-center gap-2 truncate">
                          {l.success ? (
                            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
                          ) : (
                            <ShieldAlert className="size-4 text-rose-500 shrink-0" />
                          )}
                          <span className={`text-sm font-semibold truncate ${l.success ? "text-foreground" : "text-rose-500 font-bold"}`}>
                            {l.event}
                          </span>
                        </div>

                        {/* Device */}
                        <div className="col-span-3 text-foreground-secondary truncate font-mono text-xs sm:text-sm">
                          {l.device}
                        </div>

                        {/* Time */}
                        <div className="col-span-2 text-right text-foreground-muted font-mono text-xs sm:text-sm">
                          {l.time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-5 sm:py-3.5 border-t border-border bg-muted/30">
            {/* Item count summary */}
            <div className="text-xs font-semibold text-foreground-secondary">
              Menampilkan {startItem} - {endItem} dari {total} log audit
            </div>

            {/* Page navigation: Previous, Page Indicator, Next */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground-muted px-1.5 select-none">
                  Halaman {page} dari {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                  className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5" />
                  <span>Sebelumnya</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                  className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
