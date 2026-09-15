"use client";

import React from "react";
import { ReminderLog } from "../../types/reminder.types";
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
  const { t } = useI18n();
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("id-ID", {
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
          Hari H
        </Badge>
      );
    }
    return (
      <Badge variant="info" className="font-mono text-[10px]">
        H+{offset}
      </Badge>
    );
  };

  return (
    <Card className="p-5">
      {/* Header & Controls */}
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-0">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-bold">
              {t("reminder.logs.title")}
            </CardTitle>
            <Badge variant="outline" className="text-[10px]">
              {total}{" "}
              {t("reminder.logs.colPhase") === "Phase"
                ? "audit logs"
                : "log audit"}
            </Badge>
          </div>
          <CardDescription className="text-xs">
            {t("reminder.logs.description")}
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
            <TooltipContent>{t("reminder.actions.refresh")}</TooltipContent>
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
                <span>{t("reminder.actions.evaluating")}</span>
              </>
            ) : (
              <>
                <Send className="size-3.5" />
                <span>{t("reminder.actions.dispatchNow")}</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <Separator />

      {/* Table Content */}
      <CardContent className="p-0">
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.logs.colPhase")}
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.logs.colRecipient")}
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.quick.phoneLabel")}
                </TableHead>
                <TableHead className="text-xs font-semibold">
                  {t("reminder.logs.colMessage")}
                </TableHead>
                <TableHead className="text-center text-xs font-semibold">
                  {t("reminder.logs.colStatus")}
                </TableHead>
                <TableHead className="text-right text-xs font-semibold">
                  {t("reminder.logs.colTime")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="mx-auto h-4 w-16" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-foreground-muted"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Clock className="size-8 text-foreground-muted/40" />
                      <p className="text-sm font-medium">
                        {t("reminder.logs.empty")}
                      </p>
                      <p className="text-xs text-foreground-muted/70">
                        {t("reminder.logs.emptyDesc")}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
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
                        <Phone className="size-3 text-emerald-500/70" />
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
                          <span>{t("reminder.logs.statusSuccess")}</span>
                        </Badge>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Badge
                                variant="destructive"
                                className="gap-1 text-[11px] font-semibold cursor-help"
                              >
                                <AlertCircle className="size-3" />
                                <span>{t("reminder.logs.statusFailed")}</span>
                              </Badge>
                            }
                          >
                            <span>
                              {log.errorReason ||
                                t("reminder.logs.statusFailed")}
                            </span>
                          </TooltipTrigger>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-[11px] text-foreground-muted">
                      {formatDateTime(log.sentAt)}
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
        <CardFooter className="flex items-center justify-between p-0 pt-2 text-xs text-foreground-muted">
          <span>
            Menampilkan halaman{" "}
            <strong className="text-foreground">{page}</strong> dari{" "}
            <strong className="text-foreground">{totalPages}</strong> (Total{" "}
            {total} log audit)
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
