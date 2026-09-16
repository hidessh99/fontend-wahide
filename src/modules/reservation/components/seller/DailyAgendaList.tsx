"use client";

import React from "react";
import {
  Clock,
  User,
  Phone,
  Tag,
  FileText,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  Smartphone,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { NativeSelect } from "@/components/ui/native-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/context";
import { Reservation, ReservationStatus } from "../../types/reservation.types";

interface DailyAgendaListProps {
  reservations: Reservation[];
  isLoading: boolean;
  search: string;
  status: ReservationStatus | "ALL";
  selectedDate: string;
  page: number;
  totalPages: number;
  total: number;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: ReservationStatus | "ALL") => void;
  onPageChange: (page: number) => void;
  onStatusUpdate: (id: string, newStatus: ReservationStatus) => void;
  onDeleteClick: (reservation: Reservation) => void;
  onAddClick: () => void;
}

export function DailyAgendaList({
  reservations,
  isLoading,
  search,
  status,
  selectedDate,
  page,
  totalPages,
  total,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onStatusUpdate,
  onDeleteClick,
  onAddClick,
}: DailyAgendaListProps) {
  const { t } = useI18n();

  const formatBookingDate = (dateStr: string) => {
    if (!dateStr) return "";
    const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    const parts = clean.includes("-") ? clean.split("-") : clean.split("/");
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // YYYY-MM-DD -> DD/MM/YYYY
        return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[0]}`;
      }
      return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}/${parts[2]}`;
    }
    return dateStr;
  };

  const getStatusBadge = (resStatus: ReservationStatus) => {
    switch (resStatus) {
      case "CONFIRMED":
        return (
          <Badge variant="success" className="text-xs">
            {t("reservation.statusConfirmed")}
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="info" className="text-xs">
            {t("reservation.statusCompleted")}
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="danger" className="text-xs">
            {t("reservation.statusCancelled")}
          </Badge>
        );
      case "NO_SHOW":
        return (
          <Badge variant="warning" className="text-xs">
            {t("reservation.statusNoShow")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{resStatus}</Badge>;
    }
  };

  const getChannelBadge = (ch?: string) => {
    if (ch === "WHATSAPP_OFFICIAL") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <ShieldCheck className="size-3" />
          <span>WABA</span>
        </span>
      );
    }
    if (ch === "TELEGRAM") {
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
    <Card className="p-4 sm:p-5 flex flex-col gap-4">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {selectedDate
              ? `${t("reservation.agendaFor")}: ${selectedDate}`
              : t("reservation.allAgendas")}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {total} {t("reservation.itemsFound")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primaryPill"
            onClick={onAddClick}
            size="sm"
            className="h-9 cursor-pointer gap-1.5 px-3.5 text-xs font-bold shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{t("reservation.newReservation")}</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Search and Status Dropdown */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <SearchInput
            placeholder={t("reservation.searchPlaceholder")}
            value={search}
            onChange={onSearchChange}
            onSearch={onSearchChange}
            onClear={() => onSearchChange("")}
            className="h-9 text-xs"
          />
        </div>
        <div className="w-full sm:w-44">
          <NativeSelect
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as ReservationStatus | "ALL")
            }
            className="h-9 text-xs"
          >
            <option value="ALL">{t("reservation.allStatuses")}</option>
            <option value="CONFIRMED">
              {t("reservation.statusConfirmed")}
            </option>
            <option value="COMPLETED">
              {t("reservation.statusCompleted")}
            </option>
            <option value="CANCELLED">
              {t("reservation.statusCancelled")}
            </option>
            <option value="NO_SHOW">{t("reservation.statusNoShow")}</option>
          </NativeSelect>
        </div>
      </div>

      {/* Reservation List */}
      <div className="flex flex-col gap-3 min-h-62.5">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-lg bg-slate-100 dark:bg-slate-800/50 animate-pulse"
              />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-2">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <p className="font-medium text-sm text-slate-700 dark:text-slate-300">
              {t("reservation.noReservations")}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {selectedDate
                ? `${t("reservation.noBookingsOnDate")} ${selectedDate}.`
                : t("reservation.noBookingsEmpty")}
            </p>
            <Button
              onClick={onAddClick}
              variant="outline"
              size="sm"
              className="mt-4 text-xs"
            >
              + {t("reservation.newReservation")}
            </Button>
          </div>
        ) : (
          reservations.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border border-slate-200/90 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
            >
              {/* Left Column: Details */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    {item.customerName}
                  </span>
                  {getStatusBadge(item.status)}
                  {getChannelBadge(item.channelType)}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1 font-mono">
                    {item.channelType === "TELEGRAM" ? (
                      <Bot className="h-3 w-3 text-blue-500" />
                    ) : item.channelType === "WHATSAPP_OFFICIAL" ? (
                      <ShieldCheck className="h-3 w-3 text-sky-500" />
                    ) : (
                      <Phone className="h-3 w-3 text-emerald-500" />
                    )}
                    <span>{item.phone}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono font-medium">
                    <CalendarIcon className="h-3 w-3" />
                    {formatBookingDate(item.bookingDate)}
                  </span>
                  {item.bookingTime && (
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <Clock className="h-3 w-3 text-emerald-600" />
                      {item.bookingTime} WIB
                    </span>
                  )}
                  {item.serviceName && (
                    <span className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                      <Tag className="h-2.5 w-2.5" />
                      {item.serviceName}
                    </span>
                  )}
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic flex items-center gap-1">
                    <FileText className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{item.notes}</span>
                  </p>
                )}
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-2.5 cursor-pointer">
                    {t("reservation.changeStatus")}
                    <ChevronDown className="h-3 w-3 ml-1 text-slate-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-xs">
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(item.id, "CONFIRMED")}
                      disabled={item.status === "CONFIRMED"}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                      {t("reservation.statusConfirmed")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(item.id, "COMPLETED")}
                      disabled={item.status === "COMPLETED"}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-2 text-blue-600" />
                      {t("reservation.statusCompleted")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(item.id, "CANCELLED")}
                      disabled={item.status === "CANCELLED"}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-2 text-rose-600" />
                      {t("reservation.statusCancelled")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteClick(item)}
                  className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <>
          <Separator />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {t("common.page")} {page} {t("common.of")} {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1 || isLoading}
                className="h-8 px-2.5 text-xs"
              >
                {t("common.prev")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || isLoading}
                className="h-8 px-2.5 text-xs"
              >
                {t("common.next")}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
