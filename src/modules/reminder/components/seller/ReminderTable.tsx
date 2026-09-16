"use client";

import React from "react";
import { Reminder, ReminderStatus } from "../../types/reminder.types";
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
import { SearchInput } from "@/components/ui/search-input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Phone,
  User,
  Play,
  Pause,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Bot,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface ReminderTableProps {
  reminders: Reminder[];
  isLoading: boolean;
  search: string;
  status: ReminderStatus | "ALL";
  page: number;
  totalPages: number;
  total: number;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: ReminderStatus | "ALL") => void;
  onPageChange: (p: number) => void;
  onToggleStatus: (id: string, currentStatus: ReminderStatus) => void;
  onDeleteRequest: (rem: Reminder) => void;
}

export function ReminderTable({
  reminders,
  isLoading,
  search,
  status,
  page,
  totalPages,
  total,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onToggleStatus,
  onDeleteRequest,
}: ReminderTableProps) {
  const { t } = useI18n();

  const getStatusBadge = (s: ReminderStatus) => {
    switch (s) {
      case "ACTIVE":
        return (
          <Badge variant="success" className="gap-1 text-[11px] font-semibold">
            <CheckCircle2 className="size-3" />
            <span>{t("reminder.table.tabActive")}</span>
          </Badge>
        );
      case "PAUSED":
        return (
          <Badge variant="warning" className="gap-1 text-[11px] font-semibold">
            <Pause className="size-3" />
            <span>{t("reminder.stats.paused")}</span>
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="secondary"
            className="gap-1 text-[11px] font-semibold"
          >
            <CheckCircle2 className="size-3" />
            <span>{t("reminder.stats.completed")}</span>
          </Badge>
        );
      case "CANCELLED":
      default:
        return (
          <Badge
            variant="destructive"
            className="gap-1 text-[11px] font-semibold"
          >
            <XCircle className="size-3" />
            <span>{t("reminder.table.tabCancelled")}</span>
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      let d: Date;
      if (dateStr.includes("/")) {
        const [day, month, year] = dateStr.split("/");
        d = new Date(Number(year), Number(month) - 1, Number(day));
      } else {
        d = new Date(dateStr);
      }
      if (isNaN(d.getTime())) return { numeric: dateStr, text: "" };

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const numeric = `${day}/${month}/${year}`;

      const text = d.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

      return { numeric, text };
    } catch {
      return { numeric: dateStr, text: "" };
    }
  };

  return (
    <Card className="p-5">
      {/* Header & Controls */}
      <CardHeader className="p-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-bold">
                {t("reminder.table.title")}
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {total}{" "}
                {t("reminder.table.tabAll") === "All" ? "contacts" : "kontak"}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {t("reminder.table.subtitle")}
            </CardDescription>
          </div>

          <div className="w-full sm:w-64">
            <SearchInput
              value={search}
              onChange={onSearchChange}
              onSearch={onSearchChange}
              onClear={() => onSearchChange("")}
              placeholder={t("reminder.table.searchPlaceholder")}
              className="h-9 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Status Filter Tabs (Scrollable on small mobile) */}
        <div className="no-scrollbar -mx-1 overflow-x-auto pt-2 px-1">
          <Tabs
            value={status}
            onValueChange={(v) => onStatusChange(v as ReminderStatus | "ALL")}
          >
            <TabsList className="h-8 w-max sm:w-auto">
              <TabsTrigger value="ALL" className="text-xs">
                {t("reminder.table.tabAll")}
              </TabsTrigger>
              <TabsTrigger value="ACTIVE" className="text-xs">
                {t("reminder.table.tabActive")}
              </TabsTrigger>
              <TabsTrigger value="PAUSED" className="text-xs">
                {t("reminder.stats.paused")}
              </TabsTrigger>
              <TabsTrigger value="COMPLETED" className="text-xs">
                {t("reminder.stats.completed")}
              </TabsTrigger>
              <TabsTrigger value="CANCELLED" className="text-xs">
                {t("reminder.table.tabCancelled")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <Separator />

      {/* Table Content */}
      <CardContent className="p-0">
        {/* 1. Mobile Card View (Visible on < 1024px) */}
        <div className="divide-border/50 divide-y lg:hidden">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3.5 w-40" />
                </div>
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            ))
          ) : reminders.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-foreground-muted">
              <Clock className="size-8 text-foreground-muted/40" />
              <p className="text-sm font-medium">
                {t("reminder.table.emptyTitle")}
              </p>
              <p className="text-xs text-foreground-muted/70">
                {t("reminder.table.emptyDesc")}
              </p>
            </div>
          ) : (
            reminders.map((rem) => {
              const formatted = formatDate(rem.targetDate);
              return (
                <div
                  key={rem.id}
                  className="bg-surface hover:bg-muted/20 space-y-3 p-4 transition-colors"
                >
                  {/* Top: Name & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5 text-sm font-bold text-foreground">
                      <User className="text-primary/70 size-3.5 shrink-0" />
                      <span className="truncate">{rem.recipientName}</span>
                    </div>
                    <div>{getStatusBadge(rem.status)}</div>
                  </div>

                  {/* Middle: Phone & Date/Time */}
                  <div className="space-y-1.5 text-xs font-medium text-foreground-secondary">
                    <div className="flex items-center gap-1.5 font-mono">
                      {rem.channelType === "TELEGRAM" ? (
                        <Bot className="size-3.5 shrink-0 text-blue-500" />
                      ) : rem.channelType === "WHATSAPP_OFFICIAL" ? (
                        <ShieldCheck className="size-3.5 shrink-0 text-sky-500" />
                      ) : (
                        <Phone className="size-3 shrink-0 text-emerald-500/80" />
                      )}
                      <span>{rem.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <Calendar className="size-3 shrink-0 text-blue-500/80" />
                      <span className="font-mono text-xs tracking-tight">
                        {formatted.numeric}
                      </span>
                      {formatted.text && (
                        <span className="text-[11px] font-normal text-foreground-muted">
                          ({formatted.text})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notes (if any) */}
                  {rem.notes && (
                    <div className="border-border/50 bg-muted/40 rounded-lg border p-2.5 text-xs text-foreground-secondary">
                      <p className="line-clamp-2">{rem.notes}</p>
                    </div>
                  )}

                  {/* Bottom: Action Controls */}
                  <div className="border-border/40 flex items-center justify-end gap-2 border-t pt-2.5">
                    {(rem.status === "ACTIVE" || rem.status === "PAUSED") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleStatus(rem.id, rem.status)}
                        className="border-border hover:border-foreground-muted h-8 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold"
                      >
                        {rem.status === "ACTIVE" ? (
                          <>
                            <Pause className="size-3 text-amber-500" />
                            <span>{t("reminder.table.pauseSchedule")}</span>
                          </>
                        ) : (
                          <>
                            <Play className="size-3 text-emerald-500" />
                            <span>{t("reminder.table.activateSchedule")}</span>
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteRequest(rem)}
                      className="border-border hover:border-rose-500/30 hover:bg-rose-500/10 h-8 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold text-rose-600 dark:text-rose-400"
                    >
                      <Trash2 className="size-3" />
                      <span>{t("reminder.table.deleteSchedule")}</span>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. Desktop Full Table (Visible on >= 1024px) */}
        <div className="hidden lg:block overflow-x-auto rounded-xl border border-border/50">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.table.colRecipient")}
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.quick.phoneLabel")}
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.table.colDate")}
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.table.colNotes")}
                </TableHead>
                <TableHead className="text-center text-xs font-semibold">
                  {t("reminder.table.colStatus")}
                </TableHead>
                <TableHead className="text-right text-xs font-semibold">
                  {t("reminder.table.colActions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="mx-auto h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-7 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              ) : reminders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-foreground-muted"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="size-8 text-foreground-muted/40" />
                      <p className="text-sm font-medium">
                        {t("reminder.table.emptyTitle")}
                      </p>
                      <p className="text-xs text-foreground-muted/70">
                        {t("reminder.table.emptyDesc")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reminders.map((rem) => (
                  <TableRow
                    key={rem.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                        <User className="size-3 text-primary/70" />
                        <span>{rem.recipientName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground-muted text-xs">
                      <div className="flex items-center gap-1.5 font-mono">
                        {rem.channelType === "TELEGRAM" ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-sans font-semibold">
                            <Bot className="size-2.5" />
                            <span>Telegram</span>
                          </span>
                        ) : rem.channelType === "WHATSAPP_OFFICIAL" ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 font-sans font-semibold">
                            <ShieldCheck className="size-2.5" />
                            <span>WABA</span>
                          </span>
                        ) : (
                          <Phone className="size-3 text-emerald-500/70 shrink-0" />
                        )}
                        <span>{rem.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {(() => {
                        const formatted = formatDate(rem.targetDate);
                        return (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 font-bold text-foreground">
                              <Calendar className="size-3 text-blue-500/80 shrink-0" />
                              <span className="font-mono tracking-tight text-xs">
                                {formatted.numeric}
                              </span>
                            </div>
                            {formatted.text && (
                              <span className="text-[11px] text-foreground-muted pl-4">
                                {formatted.text}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell className="text-foreground-muted text-xs">
                      <span className="line-clamp-1">
                        {rem.notes || (
                          <span className="opacity-50 italic">-</span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(rem.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle Pause / Active */}
                        {(rem.status === "ACTIVE" ||
                          rem.status === "PAUSED") && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() =>
                                    onToggleStatus(rem.id, rem.status)
                                  }
                                  className="text-foreground-muted hover:text-foreground cursor-pointer"
                                />
                              }
                            >
                              {rem.status === "ACTIVE" ? (
                                <Pause className="size-3.5 text-amber-500" />
                              ) : (
                                <Play className="size-3.5 text-emerald-500" />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              {rem.status === "ACTIVE"
                                ? t("reminder.table.pauseSchedule")
                                : t("reminder.table.activateSchedule")}
                            </TooltipContent>
                          </Tooltip>
                        )}

                        {/* Delete */}
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => onDeleteRequest(rem)}
                                className="text-foreground-muted hover:text-destructive cursor-pointer"
                              />
                            }
                          >
                            <Trash2 className="size-3.5" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("reminder.table.deleteSchedule")}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-0 pt-2 text-xs text-foreground-muted">
          <span className="text-center sm:text-left">
            {t("reminder.table.tabAll") === "All"
              ? `Showing page ${page} of ${totalPages} (Total ${total} items)`
              : `Menampilkan halaman ${page} dari ${totalPages} (Total ${total} data)`}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isLoading}
              className="cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="cursor-pointer"
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
