"use client";

import React, { useState, useMemo } from "react";
import { ReminderLog, ReminderChannelType } from "../../types/reminder.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Smartphone,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface ReminderLogsTableProps {
  logs: ReminderLog[];
  isLoading: boolean;
  isDispatching: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
  onDispatchNow: () => void;
  onReload: () => void;
}

export function ReminderLogsTable({
  logs,
  isLoading,
  isDispatching,
  page,
  totalPages,
  total,
  onPageChange,
  onDispatchNow,
  onReload,
}: ReminderLogsTableProps) {
  const { t, locale } = useI18n();
  const [channelFilter, setChannelFilter] =
    useState<"ALL" | ReminderChannelType>("ALL");

  const filteredLogs = useMemo(() => {
    if (channelFilter === "ALL") return logs;
    return logs.filter((log) => {
      const ch = log.channelType || "WHATSAPP_WEB";
      return ch === channelFilter;
    });
  }, [logs, channelFilter]);

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString(locale === "en" ? "en-US" : "id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getOffsetBadge = (offset: number) => {
    if (offset < 0) {
      return (
        <Badge variant="warning" className="font-mono text-[10px]">
          H{offset}
        </Badge>
      );
    }
    if (offset === 0) {
      return (
        <Badge variant="success" className="font-mono text-[10px]">
          {t("reminder.rules.sameDay")}
        </Badge>
      );
    }
    return (
      <Badge variant="info" className="font-mono text-[10px]">
        H+{offset}
      </Badge>
    );
  };

  const getChannelBadge = (ch?: ReminderChannelType) => {
    const channel = ch || "WHATSAPP_WEB";
    if (channel === "WHATSAPP_OFFICIAL") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <ShieldCheck className="size-3" />
          <span>WABA Official</span>
        </span>
      );
    }
    if (channel === "TELEGRAM") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Bot className="size-3" />
          <span>Telegram</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <Smartphone className="size-3" />
        <span>WA Web</span>
      </span>
    );
  };

  return (
    <Card className="p-5">
      {/* Header & Controls */}
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-0">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold">
              {t("reminder.logs.title") || "Riwayat Log Pengingat"}
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">
              {total} log audit
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {t("reminder.logs.description") || "Audit jejak pengiriman pesan pengingat otomatis per-saluran."}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Reload Button */}
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  onClick={onReload}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
              }
            >
              <RefreshCw
                className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
            </TooltipTrigger>
            <TooltipContent>{t("reminder.actions.refresh") || "Segarkan"}</TooltipContent>
          </Tooltip>

          {/* Trigger Cron Dispatch Now */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onDispatchNow}
            disabled={isDispatching}
            className="h-8 gap-1.5 rounded-xl px-3 text-xs font-semibold shadow-xs cursor-pointer"
          >
            {isDispatching ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>{t("reminder.actions.evaluating") || "Mengevaluasi..."}</span>
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                <span>{t("reminder.actions.dispatchNow") || "Jalankan Evaluasi"}</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <Separator />

      {/* Channel Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {[
          { id: "ALL" as const, label: "Semua Saluran", icon: null },
          { id: "WHATSAPP_WEB" as const, label: "WhatsApp Web", icon: Smartphone },
          { id: "WHATSAPP_OFFICIAL" as const, label: "Meta WABA", icon: ShieldCheck },
          { id: "TELEGRAM" as const, label: "Telegram", icon: Bot },
        ].map((tab) => {
          const isSelected = channelFilter === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setChannelFilter(tab.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0",
                isSelected
                  ? "bg-foreground text-background shadow-xs"
                  : "text-foreground-muted hover:text-foreground hover:bg-surface-raised"
              )}
            >
              {Icon && <Icon className="size-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Table Content */}
      <CardContent className="p-0">
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Saluran</TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.logs.colPhase") || "Fase"}
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.logs.colRecipient") || "Penerima"}
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.quick.phoneLabel") || "Kontak / ID"}
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.logs.colMessage") || "Isi Pesan"}
                </TableHead>
                <TableHead className="text-center text-xs font-semibold">
                  {t("reminder.logs.colStatus") || "Status"}
                </TableHead>
                <TableHead className="text-right text-xs font-semibold">
                  {t("reminder.logs.colTime") || "Waktu Eksekusi"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="mx-auto h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-foreground-muted"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="size-8 text-foreground-muted/40" />
                      <p className="text-sm font-medium">
                        {t("reminder.logs.empty") || "Belum ada riwayat log pengingat"}
                      </p>
                      <p className="text-xs text-foreground-muted/70">
                        {channelFilter !== "ALL"
                          ? `Tidak ada log pengiriman untuk saluran ${channelFilter}.`
                          : t("reminder.logs.emptyDesc") || "Log akan tercatat secara otomatis saat sistem mengevaluasi jadwal harian."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-xs">
                      {getChannelBadge(log.channelType)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {getOffsetBadge(log.daysOffset)}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        <User className="size-3 text-primary/70" />
                        <span>{log.recipientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground-muted text-xs">
                      <div className="flex items-center gap-1 font-mono">
                        {log.channelType === "TELEGRAM" ? (
                          <Bot className="size-3 text-blue-500" />
                        ) : log.channelType === "WHATSAPP_OFFICIAL" ? (
                          <ShieldCheck className="size-3 text-sky-500" />
                        ) : (
                          <Phone className="size-3 text-emerald-500/70" />
                        )}
                        <span>{log.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground text-xs">
                      <div className="flex items-start gap-1 max-w-md">
                        <MessageSquare className="size-3 text-foreground-muted shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed text-[11px]">
                          {log.messageContent}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {log.status === "SENT" ? (
                        <Badge
                          variant="success"
                          className="gap-1 text-[11px] font-semibold"
                        >
                          <CheckCircle2 className="size-3" />
                          <span>{t("reminder.logs.statusSuccess") || "Terkirim"}</span>
                        </Badge>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger render={
                            <Badge
                              variant="destructive"
                              className="gap-1 text-[11px] font-semibold cursor-help"
                            >
                              <AlertCircle className="size-3" />
                              <span>{t("reminder.logs.statusFailed") || "Gagal"}</span>
                            </Badge>
                          } />
                          <TooltipContent className="max-w-xs text-xs">
                            {log.errorReason || t("reminder.logs.unknownError") || "Terjadi kendala pengiriman"}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-foreground-muted font-mono">
                      {formatDateTime(log.sentAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <CardFooter className="flex items-center justify-between p-0 pt-2 text-xs">
          <span className="text-foreground-muted">
            {t("reminder.logs.pageInfo", { page, totalPages }) || `Halaman ${page} dari ${totalPages}`}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="h-8 gap-1 px-2.5 text-xs cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
              <span>{t("reminder.actions.prev") || "Sebelumnya"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="h-8 gap-1 px-2.5 text-xs cursor-pointer"
            >
              <span>{t("reminder.actions.next") || "Selanjutnya"}</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
