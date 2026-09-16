"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { NativeSelect } from "@/components/ui/native-select";
import {
  ScrollText,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";

interface WABAMessageLogMock {
  id: string;
  wamid: string;
  recipientPhone: string;
  templateName: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION" | "SERVICE";
  conversationType: "BUSINESS_INITIATED" | "USER_INITIATED";
  status: "READ" | "DELIVERED" | "SENT" | "FAILED";
  timestamp: string;
}

const MOCK_WABA_LOGS: WABAMessageLogMock[] = [
  {
    id: "wlog_01",
    wamid: "wamid.HBgNNjI4MTIzNDU2Nzg5FQIAERgSMzEx",
    recipientPhone: "628123456789",
    templateName: "konfirmasi_pesanan_pelanggan",
    category: "UTILITY",
    conversationType: "BUSINESS_INITIATED",
    status: "READ",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "wlog_02",
    wamid: "wamid.HBgNNjI4OTg3NjU0MzIxFQIAERgSMzEy",
    recipientPhone: "628987654321",
    templateName: "kode_verifikasi_otp_login",
    category: "AUTHENTICATION",
    conversationType: "BUSINESS_INITIATED",
    status: "DELIVERED",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "wlog_03",
    wamid: "wamid.HBgNNjI4Nzc4ODk5MDAxFQIAERgSMzEz",
    recipientPhone: "628778899001",
    templateName: "promosi_spesial_akhir_bulan",
    category: "MARKETING",
    conversationType: "BUSINESS_INITIATED",
    status: "SENT",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export function WABALogsView() {
  const [logs] = useState<WABAMessageLogMock[]>(MOCK_WABA_LOGS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.recipientPhone.includes(search) ||
      l.wamid.toLowerCase().includes(search.toLowerCase()) ||
      l.templateName.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "ALL" || l.category === categoryFilter;
    const matchStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <ScrollText className="size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
              Log Pesan Meta WABA Official
            </h1>
          </div>
          <p className="text-foreground-secondary text-xs font-medium sm:text-sm">
            Audit rekam jejak transmisi Meta Cloud API, tanda terima pengiriman resmi (WAMID), dan pelacak status percakapan.
          </p>
        </div>

        <Button variant="outline" size="sm" className="text-xs font-semibold">
          <RefreshCw className="mr-1.5 size-3.5" />
          <span>Muat Ulang</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="text-foreground-muted absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Cari nomor telepon atau WAMID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <NativeSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs w-36 h-9"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="MARKETING">Marketing</option>
            <option value="UTILITY">Utility</option>
            <option value="AUTHENTICATION">Authentication</option>
          </NativeSelect>

          <NativeSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs w-36 h-9"
          >
            <option value="ALL">Semua Status</option>
            <option value="READ">Dibaca (Read)</option>
            <option value="DELIVERED">Diterima (Delivered)</option>
            <option value="SENT">Terkirim (Sent)</option>
            <option value="FAILED">Gagal</option>
          </NativeSelect>
        </div>
      </div>

      {/* Logs Table */}
      <div className="border-border overflow-hidden rounded-2xl border bg-surface dark:bg-[#151614]">
        {filteredLogs.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={<ScrollText className="size-10" />}
              title="Tidak Ada Log Pesan WABA"
              description="Pesan yang dikirimkan melalui saluran Meta WABA Official akan tercatat lengkap dengan WAMID dan status ACK."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-border border-b bg-muted/50 text-foreground-secondary font-bold">
                <tr>
                  <th className="px-4 py-3">Penerima</th>
                  <th className="px-4 py-3">Nama Template</th>
                  <th className="px-4 py-3">Kategori Meta</th>
                  <th className="px-4 py-3">Tipe Percakapan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono font-medium text-foreground">
                        +{log.recipientPhone}
                      </div>
                      <span className="text-[10px] text-foreground-muted font-mono truncate block max-w-xs">
                        {log.wamid}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-foreground whitespace-nowrap">
                      {log.templateName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {log.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-foreground-secondary whitespace-nowrap">
                      {log.conversationType === "BUSINESS_INITIATED" ? "Bisnis (Outbound)" : "Pelanggan (Inbound)"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {log.status === "READ" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-950/30 dark:text-sky-400">
                          <Eye className="size-3" />
                          <span>Dibaca</span>
                        </span>
                      ) : log.status === "DELIVERED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                          <CheckCircle2 className="size-3" />
                          <span>Diterima</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                          <Clock className="size-3" />
                          <span>Terkirim</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[11px] text-foreground-muted whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("id-ID", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
