"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  CalendarCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { useReservations } from "../../hooks/useReservations";
import { MonthlyCalendar } from "../../components/seller/MonthlyCalendar";
import { DailyAgendaList } from "../../components/seller/DailyAgendaList";
import dynamic from "next/dynamic";
import { Reservation } from "../../types/reservation.types";

const AddReservationForm = dynamic(
  () =>
    import("../../components/seller/AddReservationForm").then(
      (m) => m.AddReservationForm,
    ),
  { ssr: false },
);

const DeleteReservationModal = dynamic(
  () =>
    import("../../components/seller/DeleteReservationModal").then(
      (m) => m.DeleteReservationModal,
    ),
  { ssr: false },
);

export function ReservationSellerCalendarView() {
  const { t } = useI18n();
  const {
    reservations,
    isLoading,
    error,
    stats,
    search,
    status,
    selectedDate,
    page,
    totalPages,
    total,
    handleSearchChange,
    handleStatusChange,
    handleSelectDate,
    goToPage,
    currentMonth,
    calendarSummary,
    isCalendarLoading,
    handleMonthChange,
    createReservation,
    updateStatus,
    deleteReservation,
    reload,
  } = useReservations();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] =
    useState<Reservation | null>(null);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start justify-between gap-3 sm:block">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <CalendarDays className="h-7 w-7 text-emerald-600 dark:text-emerald-500" />
              {t("reservation.pageTitle")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t("reservation.pageSubtitle")}
            </p>
          </div>

          {/* Mobile-Only Header Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={reload}
            disabled={isLoading || isCalendarLoading}
            className="size-9 shrink-0 rounded-full border-border/70 text-xs cursor-pointer sm:hidden"
            title={t("common.refresh")}
            aria-label="Refresh Data"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading || isCalendarLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Desktop-Only Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            disabled={isLoading || isCalendarLoading}
            className="hidden sm:inline-flex h-9 gap-1.5 rounded-full border-border/70 text-xs cursor-pointer"
            title={t("common.refresh")}
          >
            <RefreshCw
              className={`size-3.5 ${isLoading || isCalendarLoading ? "animate-spin" : ""}`}
            />
            <span>{t("common.refresh")}</span>
          </Button>

          {/* Primary Action Button */}
          <Button
            variant="primaryPill"
            onClick={() => setIsAddOpen(true)}
            size="sm"
            className="h-10 sm:h-9 gap-2 px-5 text-xs font-bold shadow-xs w-full sm:w-auto cursor-pointer justify-center rounded-full"
          >
            <Plus className="size-4" />
            <span>{t("reservation.newReservation")}</span>
          </Button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center justify-between">
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={reload}
            className="text-xs h-7 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50"
          >
            {t("common.retry")}
          </Button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Month */}
        <div className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3.5 shadow-xs transition hover:shadow-sm sm:p-4.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground-muted min-h-[2.4em] text-xs font-semibold leading-snug line-clamp-2 sm:min-h-0">
              {t("reservation.metricMonth")}
            </span>
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <CalendarCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black tracking-tight text-foreground sm:text-2xl">
            {stats.totalMonth}
          </div>
        </div>

        {/* Today */}
        <div className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3.5 shadow-xs transition hover:shadow-sm sm:p-4.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground-muted min-h-[2.4em] text-xs font-semibold leading-snug line-clamp-2 sm:min-h-0">
              {t("reservation.metricToday")}
            </span>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black tracking-tight text-foreground sm:text-2xl">
            {stats.today}
          </div>
        </div>

        {/* Confirmed */}
        <div className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3.5 shadow-xs transition hover:shadow-sm sm:p-4.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground-muted min-h-[2.4em] text-xs font-semibold leading-snug line-clamp-2 sm:min-h-0">
              {t("reservation.metricConfirmed")}
            </span>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black tracking-tight text-foreground sm:text-2xl">
            {stats.confirmed}
          </div>
        </div>

        {/* Completed */}
        <div className="border-border bg-surface flex flex-col justify-between rounded-xl border p-3.5 shadow-xs transition hover:shadow-sm sm:p-4.5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-foreground-muted min-h-[2.4em] text-xs font-semibold leading-snug line-clamp-2 sm:min-h-0">
              {t("reservation.metricCompleted")}
            </span>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black tracking-tight text-foreground sm:text-2xl">
            {stats.completed}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Monthly Calendar */}
        <div className="lg:col-span-5 w-full">
          <MonthlyCalendar
            currentMonth={currentMonth}
            calendarSummary={calendarSummary}
            isLoading={isCalendarLoading}
            selectedDate={selectedDate}
            onMonthChange={handleMonthChange}
            onSelectDate={handleSelectDate}
          />
        </div>

        {/* Right Column: Daily Agenda */}
        <div className="lg:col-span-7 w-full">
          <DailyAgendaList
            reservations={reservations}
            isLoading={isLoading}
            search={search}
            status={status}
            selectedDate={selectedDate}
            page={page}
            totalPages={totalPages}
            total={total}
            onSearchChange={handleSearchChange}
            onStatusChange={handleStatusChange}
            onPageChange={goToPage}
            onStatusUpdate={updateStatus}
            onDeleteClick={(r) => setReservationToDelete(r)}
            onAddClick={() => setIsAddOpen(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <AddReservationForm
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={createReservation}
        defaultDate={selectedDate}
      />

      <DeleteReservationModal
        reservation={reservationToDelete}
        isOpen={Boolean(reservationToDelete)}
        onClose={() => setReservationToDelete(null)}
        onConfirm={deleteReservation}
      />
    </div>
  );
}

export default ReservationSellerCalendarView;
