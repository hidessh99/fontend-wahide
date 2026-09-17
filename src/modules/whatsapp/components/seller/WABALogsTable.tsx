"use client";

import React, { useState } from "react";
import {
  Download,
  Check,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Loader2,
  ScrollText,
  Eye,
} from "lucide-react";
import { MessageLogResponse } from "@/modules/campaign/types/campaign.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { NativeSelect } from "@/components/ui/native-select";
import { DataTablePagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty";
import { WABAMessageDetailDialog } from "./WABAMessageDetailDialog";

const idDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const formatLogTime = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? "-" : idDateFormatter.format(d);
};

interface WABALogsTableProps {
  logs: MessageLogResponse[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onPageChange: (p: number) => void;
  onPageSizeChange?: (newSize: number) => void;
}

export function WABALogsTable({
  logs,
  total,
  page,
  pageSize,
  isLoading,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  onPageChange,
  onPageSizeChange,
}: WABALogsTableProps) {
  const [draftSearch, setDraftSearch] = useState(searchQuery ?? "");
  const [selectedLog, setSelectedLog] = useState<MessageLogResponse | null>(
    null,
  );

  React.useEffect(() => {
    if (searchQuery !== undefined) {
      setDraftSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (val: string) => {
    onSearchChange(val.trim());
  };

  const handleSearchClear = () => {
    setDraftSearch("");
    onSearchChange("");
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const escapeCell = (val: unknown) =>
      `"${String(val ?? "").replace(/"/g, '""')}"`;

    const headers = [
      "ID",
      "Recipient",
      "WAMID",
      "Category",
      "Message",
      "Status",
      "Created At",
    ];

    const rows = logs.map((l) => [
      escapeCell(l.id),
      escapeCell(l.recipient_jid),
      escapeCell(l.waba_info?.meta_message_id || ""),
      escapeCell(l.waba_info?.conversation_category || ""),
      escapeCell(l.message_body),
      escapeCell(l.status),
      escapeCell(l.created_at),
    ]);

    const csvContent =
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `waba-messages-page-${page}-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  };

  const renderStatusBadge = (status?: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "READ":
        return (
          <Badge variant="info" className="gap-1">
            <Eye className="size-3" />
            <span>READ</span>
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="size-3" />
            <span>DELIVERED</span>
          </Badge>
        );
      case "SENT":
        return (
          <Badge variant="neutral" className="gap-1">
            <Check className="size-3" />
            <span>SENT</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="danger" className="gap-1">
            <XCircle className="size-3" />
            <span>FAILED</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="size-3" />
            <span>{s || "PENDING"}</span>
          </Badge>
        );
    }
  };

  return (
    <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs">
      {/* Toolbar Bar */}
      <div className="border-border flex flex-col justify-between gap-3 border-b p-3.5 sm:flex-row sm:items-center sm:p-4">
        <div className="w-full sm:max-w-xs md:max-w-sm">
          <SearchInput
            value={draftSearch}
            onChange={setDraftSearch}
            onSearch={handleSearchSubmit}
            onClear={handleSearchClear}
            placeholder="Cari nomor telepon atau WAMID..."
            buttonText="Cari"
            hideSubmitButton={false}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <NativeSelect
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            variant="pill"
            wrapperClassName="w-auto"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="MARKETING">Marketing</option>
            <option value="UTILITY">Utility</option>
            <option value="AUTHENTICATION">Authentication</option>
            <option value="SERVICE">Service</option>
          </NativeSelect>

          {/* Status Filter */}
          <NativeSelect
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            variant="pill"
            wrapperClassName="w-auto"
          >
            <option value="ALL">Semua Status</option>
            <option value="READ">Dibaca (Read)</option>
            <option value="DELIVERED">Diterima (Delivered)</option>
            <option value="SENT">Terkirim (Sent)</option>
            <option value="FAILED">Gagal</option>
          </NativeSelect>

          {/* Export CSV */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="border-border hover:border-foreground-muted h-10 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold disabled:opacity-40"
          >
            <Download className="size-3.5" />
            <span>Ekspor CSV</span>
          </Button>
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <div className="space-y-3 p-8 text-center sm:p-12">
          <Loader2 className="text-emerald-600 dark:text-emerald-400 mx-auto size-8 animate-spin" />
          <p className="text-foreground-secondary text-xs font-semibold">
            Memuat riwayat log pesan Meta WABA...
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12">
          <EmptyState
            icon={<ScrollText className="size-10" />}
            title="Tidak Ada Log Pesan Meta WABA"
            description="Pesan yang dikirimkan melalui saluran Meta WABA Official akan tercatat lengkap dengan WAMID dan status ACK."
          />
        </div>
      ) : (
        <div>
          {/* Mobile Card List (lg:hidden) */}
          <div className="divide-border/50 divide-y lg:hidden">
            {logs.map((log) => {
              const phone = log.recipient_jid?.split("@")[0] || "-";
              const wamid = log.waba_info?.meta_message_id || "";
              const timeFormatted = formatLogTime(log.created_at);

              return (
                <div
                  key={log.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedLog(log)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedLog(log);
                    }
                  }}
                  className="bg-surface hover:bg-muted/40 cursor-pointer active:scale-[0.99] p-3.5 sm:p-4 space-y-2.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-foreground truncate">
                      +{phone.replace(/^\+/, "")}
                    </span>
                    {renderStatusBadge(log.status)}
                  </div>

                  {wamid && (
                    <span className="text-[10px] text-foreground-muted font-mono truncate block max-w-xs">
                      {wamid}
                    </span>
                  )}

                  <div className="text-xs text-foreground/90">
                    {log.media_url && (
                      <span className="inline-flex items-center gap-1 mr-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground-secondary">
                        <FileText className="size-2.5" /> Media
                      </span>
                    )}
                    <span className="line-clamp-2">
                      {log.message_body || "(Pesan template Meta HSM)"}
                    </span>
                    {log.error_message && (
                      <p className="text-[11px] text-rose-500 font-semibold truncate pt-1">
                        Error: {log.error_message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-foreground-secondary pt-0.5 font-medium">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {log.waba_info?.conversation_category || "UTILITY"}
                    </Badge>
                    <span className="whitespace-nowrap">{timeFormatted}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (hidden lg:block) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold text-foreground-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">Penerima & WAMID</th>
                  <th className="py-3 px-4">Konten Pesan / Template</th>
                  <th className="py-3 px-4">Kategori Meta</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {logs.map((log) => {
                  const phone = log.recipient_jid?.split("@")[0] || "-";
                  const wamid = log.waba_info?.meta_message_id || "";
                  const timeFormatted = formatLogTime(log.created_at);

                  return (
                    <tr
                      key={log.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedLog(log)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedLog(log);
                        }
                      }}
                      className="hover:bg-muted/40 cursor-pointer transition-colors outline-none focus-visible:bg-muted/50"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-medium text-foreground">
                          +{phone.replace(/^\+/, "")}
                        </div>
                        {wamid ? (
                          <span className="text-[10px] text-foreground-muted font-mono truncate block max-w-xs">
                            {wamid}
                          </span>
                        ) : (
                          <span className="text-[10px] text-foreground-muted italic block">
                            Meta Cloud API
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 max-w-xs sm:max-w-md truncate text-foreground/90">
                        {log.media_url && (
                          <span className="inline-flex items-center gap-1 mr-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded text-foreground-secondary">
                            <FileText className="size-2.5" /> Media
                          </span>
                        )}
                        <span>{log.message_body || "(Template Meta HSM)"}</span>
                        {log.error_message && (
                          <span className="text-[10px] text-rose-500 font-semibold block truncate">
                            Error: {log.error_message}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono"
                        >
                          {log.waba_info?.conversation_category || "UTILITY"}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-foreground-secondary whitespace-nowrap">
                        {timeFormatted}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {renderStatusBadge(log.status)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Standardized DataTablePagination */}
      <DataTablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 30, 50]}
        prevText="Sebelumnya"
        nextText="Selanjutnya"
        entityName="log pesan"
      />

      {/* WABA Message Detail Modal */}
      <WABAMessageDetailDialog
        log={selectedLog}
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
