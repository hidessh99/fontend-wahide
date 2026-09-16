"use client";

import React from "react";
import { useTelegramLogs } from "../hooks/useTelegramLogs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty";
import { NativeSelect } from "@/components/ui/native-select";
import {
  ScrollText,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TelegramMessageDirection, TelegramMessageStatus } from "../types/telegram.types";

export function TelegramLogsView() {
  const {
    logs,
    total,
    page,
    setPage,
    pageSize,
    searchQuery,
    setSearchQuery,
    directionFilter,
    setDirectionFilter,
    statusFilter,
    setStatusFilter,
    isLoading,
    reload,
  } = useTelegramLogs(1, 20);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <ScrollText className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Log Pengiriman Telegram
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            Audit riwayat pesan masuk dan keluar bot Telegram dengan status pengiriman real-time.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => reload()}
          disabled={isLoading}
          className="text-xs font-semibold"
        >
          <RefreshCw className={`mr-1.5 size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Muat Ulang</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="text-foreground-muted absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Cari chat ID atau teks pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Direction Filter */}
          <NativeSelect
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value as "ALL" | TelegramMessageDirection)}
            className="text-xs w-36 h-9"
          >
            <option value="ALL">Semua Arah</option>
            <option value="OUTBOUND">Keluar (Bot)</option>
            <option value="INBOUND">Masuk (User)</option>
          </NativeSelect>

          {/* Status Filter */}
          <NativeSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | TelegramMessageStatus)}
            className="text-xs w-36 h-9"
          >
            <option value="ALL">Semua Status</option>
            <option value="DELIVERED">Terkirim</option>
            <option value="SENT">Terkirim (Sent)</option>
            <option value="FAILED">Gagal</option>
            <option value="QUEUED">Antrean</option>
          </NativeSelect>
        </div>
      </div>

      {/* Logs Table */}
      <div className="border-border overflow-hidden rounded-2xl border bg-surface dark:bg-[#151614]">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={<ScrollText className="size-10" />}
              title="Belum Ada Log Pesan Telegram"
              description="Pesan yang dikirimkan atau diterima melalui bot Telegram Anda akan tercatat secara otomatis pada tabel ini."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-border border-b bg-muted/50 text-foreground-secondary font-bold">
                <tr>
                  <th className="px-4 py-3">Arah</th>
                  <th className="px-4 py-3">Chat ID</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Konten Pesan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {logs.map((log) => {
                  const isOutbound = log.direction === "OUTBOUND";
                  return (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isOutbound ? (
                            <ArrowUpRight className="size-3.5 text-sky-500" />
                          ) : (
                            <ArrowDownLeft className="size-3.5 text-emerald-500" />
                          )}
                          <span className="font-semibold text-[11px] text-foreground">
                            {isOutbound ? "Keluar" : "Masuk"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-foreground whitespace-nowrap">
                        {log.chat_id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {log.message_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 max-w-md truncate text-foreground-secondary">
                        {log.text || (log.media_url ? `[Media: ${log.media_url}]` : "-")}
                        {log.error_reason && (
                          <p className="text-[10px] text-rose-500 font-semibold truncate">
                            Error: {log.error_reason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.status === "DELIVERED" || log.status === "SENT" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                            <CheckCircle2 className="size-3" />
                            <span>Terkirim</span>
                          </span>
                        ) : log.status === "FAILED" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
                            <AlertCircle className="size-3" />
                            <span>Gagal</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                            <Clock className="size-3" />
                            <span>Antrean</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[11px] text-foreground-muted whitespace-nowrap">
                        {log.sent_at
                          ? new Date(log.sent_at).toLocaleString("id-ID", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : new Date(log.created_at).toLocaleString("id-ID", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {total > 0 && (
          <div className="border-border/60 flex items-center justify-between border-t px-4 py-3 text-xs">
            <span className="text-foreground-muted text-[11px]">
              Menampilkan {logs.length} dari {total} log pesan
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1 || isLoading}
                className="size-8 p-0"
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <span className="px-2 text-xs font-semibold text-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages || isLoading}
                className="size-8 p-0"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
