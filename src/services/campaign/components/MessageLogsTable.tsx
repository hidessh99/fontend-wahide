"use client";

import React, { useState, useRef, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Search, X, CheckCheck, Check, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

export interface MessageLogItem {
  id: string;
  campaignName: string;
  recipientPhone: string;
  recipientName?: string;
  messageSnippet: string;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
  sentAt: string;
  errorMessage?: string;
}

const DEFAULT_LOGS: MessageLogItem[] = [
  {
    id: "log_01",
    campaignName: "Promo Merdeka Flash Sale",
    recipientPhone: "6281234567890",
    recipientName: "Budi Santoso",
    messageSnippet: "Halo Budi! Dapatkan diskon 30% khusus hari ini...",
    status: "READ",
    sentAt: "2026-08-30T10:15:20Z",
  },
  {
    id: "log_02",
    campaignName: "Promo Merdeka Flash Sale",
    recipientPhone: "6285799887766",
    recipientName: "Siti Rahma",
    messageSnippet: "Hai Siti! Dapatkan diskon 30% khusus hari ini...",
    status: "DELIVERED",
    sentAt: "2026-08-30T10:15:25Z",
  },
  {
    id: "log_03",
    campaignName: "Follow Up Member VIP",
    recipientPhone: "6281987654321",
    recipientName: "Ahmad Dani",
    messageSnippet: "Selamat siang Ahmad, kupon cashback Anda akan hangus...",
    status: "FAILED",
    errorMessage: "Nomor tidak terdaftar di WhatsApp",
    sentAt: "2026-08-30T11:00:10Z",
  },
  {
    id: "log_04",
    campaignName: "Promo Merdeka Flash Sale",
    recipientPhone: "6281311223344",
    recipientName: "Dewi Lestari",
    messageSnippet: "Halo Kak Dewi, promo spesial HUT RI tinggal 2 jam lagi...",
    status: "READ",
    sentAt: "2026-08-30T11:15:00Z",
  },
  {
    id: "log_05",
    campaignName: "Pemberitahuan Tagihan Bulanan",
    recipientPhone: "6287711223399",
    recipientName: "Rian Hidayat",
    messageSnippet: "Yth. Bpk Rian, tagihan langganan Anda telah terbit...",
    status: "DELIVERED",
    sentAt: "2026-08-30T11:30:15Z",
  },
  {
    id: "log_06",
    campaignName: "Promo Merdeka Flash Sale",
    recipientPhone: "6282199887711",
    recipientName: "Eko Prasetyo",
    messageSnippet: "Halo Eko! Dapatkan diskon 30% khusus hari ini...",
    status: "SENT",
    sentAt: "2026-08-30T11:45:00Z",
  },
];

export function MessageLogsTable() {
  const { t } = useI18n();
  const [logs] = useState<MessageLogItem[]>(DEFAULT_LOGS);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        activeSearch === "" ||
        l.recipientPhone.includes(activeSearch) ||
        (l.recipientName && l.recipientName.toLowerCase().includes(activeSearch.toLowerCase())) ||
        l.campaignName.toLowerCase().includes(activeSearch.toLowerCase()) ||
        l.messageSnippet.toLowerCase().includes(activeSearch.toLowerCase());

      const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [logs, activeSearch, statusFilter]);

  const total = filteredLogs.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  // High-Throughput DOM Virtualization
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

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  const renderStatusBadge = (status: MessageLogItem["status"]) => {
    switch (status) {
      case "READ":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-500">
            <CheckCheck className="size-3.5" />
            <span>{t("campaign.statusRead")}</span>
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCheck className="size-3.5" />
            <span>{t("campaign.statusDelivered")}</span>
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertCircle className="size-3.5" />
            <span>{t("campaign.statusFailed")}</span>
          </span>
        );
      case "SENT":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground-muted">
            <Check className="size-3.5" />
            <span>{t("campaign.statusSent")}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Form with Submit Button & Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("campaign.searchLogsPlaceholder")}
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

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="h-10 px-3.5 rounded-full bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green cursor-pointer"
          >
            <option value="ALL">{t("campaign.filterAllStatus")}</option>
            <option value="READ">{t("campaign.statusRead")}</option>
            <option value="DELIVERED">{t("campaign.statusDelivered")}</option>
            <option value="FAILED">{t("campaign.statusFailed")}</option>
          </select>
        </div>
      </div>

      {/* Logs Virtualized Table */}
      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
          <div className="col-span-4 sm:col-span-3">{t("campaign.tableHeaderRecipient")}</div>
          <div className="hidden sm:block sm:col-span-3">{t("campaign.tableHeaderCampaign")}</div>
          <div className="col-span-5 sm:col-span-4">{t("campaign.tableHeaderMessage")}</div>
          <div className="col-span-3 sm:col-span-2 text-right">{t("campaign.tableHeaderStatusTime")}</div>
        </div>

        {/* Table Body */}
        {paginatedLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <AlertCircle className="size-10 text-foreground-muted mx-auto" />
            <h3 className="font-bold text-sm text-foreground">Tidak ada log pesan ditemukan</h3>
            <p className="text-xs text-foreground-secondary">
              {activeSearch
                ? `Tidak ditemukan pesan dengan kata kunci "${activeSearch}".`
                : "Belum ada riwayat pengiriman pesan."}
            </p>
          </div>
        ) : (
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
                const log = paginatedLogs[virtualRow.index];
                if (!log) return null;

                return (
                  <div
                    key={log.id}
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
                    {/* Recipient (Enlarged Typography) */}
                    <div className="col-span-4 sm:col-span-3 space-y-0.5">
                      <span className="font-bold text-sm sm:text-base text-foreground block truncate">
                        {log.recipientName || t("campaign.unnamedRecipient")}
                      </span>
                      <span className="text-xs sm:text-sm text-foreground-secondary font-mono block">
                        +{log.recipientPhone}
                      </span>
                    </div>

                    {/* Campaign */}
                    <div className="hidden sm:block sm:col-span-3 text-sm font-semibold text-foreground-secondary truncate">
                      {log.campaignName}
                    </div>

                    {/* Message Snippet */}
                    <div className="col-span-5 sm:col-span-4 text-xs sm:text-sm text-foreground-secondary truncate">
                      <span className="block truncate">{log.messageSnippet}</span>
                      {log.errorMessage && (
                        <span className="text-xs text-rose-500 block truncate font-mono mt-0.5">
                          {log.errorMessage}
                        </span>
                      )}
                    </div>

                    {/* Status & Time */}
                    <div className="col-span-3 sm:col-span-2 flex flex-col items-end justify-center space-y-0.5">
                      {renderStatusBadge(log.status)}
                      <span className="text-xs text-foreground-muted font-mono">
                        {new Date(log.sentAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-border bg-muted/30">
            {/* Item count summary */}
            <div className="text-xs sm:text-sm font-semibold text-foreground-secondary">
              Menampilkan {startItem} - {endItem} dari {total} log pesan
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
