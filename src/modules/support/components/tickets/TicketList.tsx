"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Ticket, TicketStatus } from "@/modules/support/types/support.types";
import { useSupport } from "@/modules/support/hooks/useSupport";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { UpdateTicketStatusModal } from "./UpdateTicketStatusModal";

const CreateTicketModal = dynamic(
  () => import("./CreateTicketModal").then((m) => m.CreateTicketModal),
  { ssr: false }
);
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { isAdmin } from "@/modules/iam/types/auth.types";
import {
  LifeBuoy,
  Plus,
  Search,
  X,
  MessageSquare,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Lock,
  User as UserIcon,
  SlidersHorizontal,
} from "lucide-react";

export function TicketList() {
  const { t } = useI18n();
  const authUser = useAuth((s) => s.user);
  const isSuperAdmin = isAdmin(authUser?.role);
  const [statusModalTicket, setStatusModalTicket] = useState<Ticket | null>(null);
  const {
    tickets,
    filteredTickets,
    isLoading,
    activeSearch,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    executeSearch,
    clearSearch,
    setStatusFilter,
    nextPage,
    prevPage,
    fetchTickets,
    createTicket,
  } = useSupport();

  const [searchInput, setSearchInput] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    clearSearch();
  };

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  const renderStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-3" />
            <span>{t("support.statusResolved")}</span>
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-muted text-foreground-muted border border-border">
            <Lock className="size-3" />
            <span>{t("support.statusClosed")}</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="size-3" />
            <span>{t("support.statusInProgress")}</span>
          </span>
        );
      case "OPEN":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <AlertCircle className="size-3" />
            <span>{t("support.statusOpen")}</span>
          </span>
        );
    }
  };

  const renderPriorityBadge = (priority: string) => {
    if (priority === "HIGH") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase">
          <ShieldAlert className="size-3.5" />
          <span>{t("support.priorityHigh")}</span>
        </span>
      );
    }
    return (
      <span className="text-xs font-bold text-foreground-muted uppercase">
        {priority === "LOW" ? t("support.priorityLow") : t("support.priorityMedium")}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Superadmin Mode Banner Notice */}
      {isSuperAdmin && (
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold w-fit shadow-2xs">
          <ShieldAlert className="size-3.5 shrink-0" />
          <span>{t("support.adminConsoleNotice")}</span>
        </div>
      )}

      {/* Action Toolbar (Search Form, Create Ticket CTA & Scrollable Filter Chips) */}
      <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Top Row: Search Form + Primary CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("support.searchPlaceholder")}
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
              <span>{t("support.search")}</span>
            </Button>
          </form>

          {/* Primary CTA Button */}
          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 text-xs font-bold shadow-sm h-10 px-4 cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
            <span>{t("support.createTicket")}</span>
          </Button>
        </div>

        {/* Bottom Row: Horizontal Scrollable Filter Chips + Refresh Button */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
          {/* Scrollable Filter Chips (No awkward multi-line text wrapping on mobile!) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth flex-1 min-w-0">
            {(["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as (TicketStatus | "ALL")[]).map(
              (st) => {
                const label =
                  st === "ALL"
                    ? t("support.filterAll")
                    : st === "OPEN"
                    ? t("support.filterOpen")
                    : st === "IN_PROGRESS"
                    ? t("support.filterInProgress")
                    : st === "RESOLVED"
                    ? t("support.filterResolved")
                    : t("support.filterClosed");

                const isActive = statusFilter === st;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs transition cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-dark-green dark:bg-wise-green text-white dark:text-black font-extrabold shadow-xs"
                        : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground font-semibold border border-border/60"
                    }`}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>

          {/* Refresh Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTickets()}
            disabled={isLoading}
            className="rounded-full size-8.5 p-0 border-border hover:border-foreground-muted cursor-pointer shrink-0"
            aria-label={t("support.refreshAria")}
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Ticket List Content */}
      {isLoading && tickets.length === 0 ? (
        <div className="h-64 rounded-md border border-border bg-surface dark:bg-[#161715] animate-pulse p-6" />
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center rounded-md border border-dashed border-border bg-surface dark:bg-[#161715]/50 space-y-3">
          <div className="size-12 rounded-full bg-emerald-500/10 dark:bg-wise-green/10 text-emerald-700 dark:text-wise-green flex items-center justify-center">
            <LifeBuoy className="size-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {t("support.noTickets")}
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary">
              {t("support.noTicketsDesc")}
            </p>
          </div>
          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 text-xs font-bold mt-2 shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("support.createTicket")}</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mobile View: Card-based Ticket List (Visible on < 768px) */}
          <div className="md:hidden space-y-3">
            {filteredTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="p-3.5 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715] shadow-xs space-y-2.5"
              >
                {/* Header: Ticket Number & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 px-2.5 py-0.5 rounded-full border border-wise-green/30">
                    {tkt.ticketNumber}
                  </span>
                  <div>{renderStatusBadge(tkt.status)}</div>
                </div>

                {/* Customer Identity Row (Only for Superadmin) */}
                {isSuperAdmin && (
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-muted/50 border border-border/60 text-xs">
                    <UserIcon className="size-3.5 text-emerald-700 dark:text-wise-green shrink-0" />
                    <div className="truncate min-w-0">
                      <span className="font-bold text-foreground">
                        {tkt.user?.name || t("support.customerUnknown")}
                      </span>
                      {tkt.user?.email && (
                        <span className="text-[11px] text-foreground-secondary ml-1.5 font-mono">
                          ({tkt.user.email})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Subject Title (Clickable) */}
                <Link
                  href={`/support/${tkt.id}`}
                  className="font-bold text-foreground text-sm line-clamp-2 hover:underline hover:text-emerald-700 dark:hover:text-wise-green transition block"
                >
                  {tkt.subject}
                </Link>

                {/* Metadata & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs font-semibold text-foreground-secondary">
                  <div className="flex items-center gap-2 text-[11px] truncate">
                    <span>{tkt.category}</span>
                    <span>•</span>
                    <div>{renderPriorityBadge(tkt.priority)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Quick Status Modal Trigger for Admin */}
                    {isSuperAdmin && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setStatusModalTicket(tkt)}
                        className="h-7 px-2.5 rounded-full text-[11px] font-bold gap-1 border-border hover:border-foreground-muted transition cursor-pointer text-foreground"
                      >
                        <SlidersHorizontal className="size-3 text-emerald-700 dark:text-wise-green" />
                        <span>{t("support.editStatus")}</span>
                      </Button>
                    )}

                    <Link
                      href={`/support/${tkt.id}`}
                      className="inline-flex items-center h-7 px-3 rounded-full text-xs font-bold gap-1 border border-border bg-muted/50 hover:bg-muted transition text-foreground shrink-0"
                    >
                      <span>{t("support.viewThread")}</span>
                      <ChevronRight className="size-3 text-emerald-700 dark:text-wise-green" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Tabular Grid (Visible on >= 768px) */}
          <div className="hidden md:block rounded-md border border-border bg-surface dark:bg-[#161715] overflow-x-auto shadow-xs">
            <div className="min-w-190">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
                {isSuperAdmin ? (
                  <>
                    <div className="col-span-3">{t("support.tableHeaderTicket")}</div>
                    <div className="col-span-2">{t("support.tableHeaderCustomer")}</div>
                    <div className="col-span-1">{t("support.tableHeaderCategory")}</div>
                    <div className="col-span-1">{t("support.tableHeaderPriority")}</div>
                    <div className="col-span-2 text-center">{t("support.tableHeaderStatus")}</div>
                    <div className="col-span-3 text-right">{t("support.tableHeaderAction")}</div>
                  </>
                ) : (
                  <>
                    <div className="col-span-5">{t("support.tableHeaderTicket")}</div>
                    <div className="col-span-2">{t("support.tableHeaderCategory")}</div>
                    <div className="col-span-2">{t("support.tableHeaderPriority")}</div>
                    <div className="col-span-2 text-center">{t("support.tableHeaderStatus")}</div>
                    <div className="col-span-1 text-right">{t("support.tableHeaderAction")}</div>
                  </>
                )}
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border/50 text-xs font-semibold">
                {filteredTickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition-colors min-h-14.5"
                  >
                    {isSuperAdmin ? (
                      <>
                        {/* Col 3: Ticket No & Subject */}
                        <div className="col-span-3 space-y-1 pr-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 px-2.5 py-0.5 rounded-full border border-wise-green/30">
                              {tkt.ticketNumber}
                            </span>
                          </div>
                          <Link
                            href={`/support/${tkt.id}`}
                            className="font-bold text-foreground text-sm line-clamp-1 hover:underline hover:text-emerald-700 dark:hover:text-wise-green transition block"
                          >
                            {tkt.subject}
                          </Link>
                        </div>

                        {/* Col 2: Customer (Name & Email) */}
                        <div className="col-span-2 space-y-0.5 min-w-0 pr-1">
                          <div className="flex items-center gap-1.5 font-bold text-foreground text-xs truncate">
                            <UserIcon className="size-3 text-emerald-700 dark:text-wise-green shrink-0" />
                            <span className="truncate">{tkt.user?.name || t("support.customerUnknown")}</span>
                          </div>
                          {tkt.user?.email && (
                            <p className="text-[11px] font-mono text-foreground-secondary truncate pl-4.5">
                              {tkt.user.email}
                            </p>
                          )}
                        </div>

                        {/* Col 1: Category */}
                        <div className="col-span-1 text-xs font-semibold text-foreground-secondary truncate">
                          {tkt.category}
                        </div>

                        {/* Col 1: Priority */}
                        <div className="col-span-1">
                          {renderPriorityBadge(tkt.priority)}
                        </div>

                        {/* Col 2: Status */}
                        <div className="col-span-2 flex justify-center">
                          {renderStatusBadge(tkt.status)}
                        </div>

                        {/* Col 3: Actions (Edit Status & Open) */}
                        <div className="col-span-3 flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setStatusModalTicket(tkt)}
                            className="inline-flex items-center h-8 px-2.5 rounded-full text-xs font-bold gap-1.5 border border-border bg-surface hover:bg-muted hover:border-foreground-muted transition cursor-pointer text-foreground shadow-2xs shrink-0"
                            title={t("support.editStatus")}
                          >
                            <SlidersHorizontal className="size-3.5 text-emerald-700 dark:text-wise-green" />
                            <span>{t("support.editStatus")}</span>
                          </Button>

                          <Link
                            href={`/support/${tkt.id}`}
                            className="inline-flex items-center h-8 px-3 rounded-full text-xs font-bold gap-1.5 border border-border bg-muted/60 hover:bg-muted hover:border-foreground-muted transition cursor-pointer text-foreground shadow-2xs shrink-0"
                            title={t("support.viewThread")}
                          >
                            <MessageSquare className="size-3.5 text-emerald-700 dark:text-wise-green" />
                            <span>{t("support.viewThread")}</span>
                          </Link>
                        </div>
                      </>
                    ) : (
                    <>
                      {/* Standard Non-Admin Row */}
                      <div className="col-span-5 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 px-2.5 py-0.5 rounded-full border border-wise-green/30">
                            {tkt.ticketNumber}
                          </span>
                        </div>
                        <Link
                          href={`/support/${tkt.id}`}
                          className="font-bold text-foreground text-sm sm:text-base line-clamp-1 hover:underline hover:text-emerald-700 dark:hover:text-wise-green transition block"
                        >
                          {tkt.subject}
                        </Link>
                      </div>

                      <div className="col-span-2 text-sm font-semibold text-foreground-secondary">
                        {tkt.category}
                      </div>

                      <div className="col-span-2">
                        {renderPriorityBadge(tkt.priority)}
                      </div>

                      <div className="col-span-2 flex justify-center">
                        {renderStatusBadge(tkt.status)}
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <Link
                          href={`/support/${tkt.id}`}
                          className="inline-flex items-center h-8 px-3 rounded-full text-xs font-bold gap-1.5 border border-border bg-surface hover:bg-muted hover:border-foreground-muted transition cursor-pointer text-foreground shadow-2xs"
                        >
                          <MessageSquare className="size-3.5 text-emerald-700 dark:text-wise-green" />
                          <span className="hidden sm:inline">{t("support.viewThread")}</span>
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ))}
              </div>
            </div>
          </div>

          {/* Pagination Footer */}
          {total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-5 sm:py-3.5 rounded-md border border-border bg-surface dark:bg-[#161715] shadow-xs">
              {/* Item count summary */}
              <div className="text-xs font-semibold text-foreground-secondary">
                {t("support.paginationShowing")
                  .replace("{start}", String(startItem))
                  .replace("{end}", String(endItem))
                  .replace("{total}", String(total))}
              </div>

              {/* Page navigation: Previous, Page Indicator, Next */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground-muted px-1.5 select-none">
                    {t("support.paginationPage")
                      .replace("{page}", String(page))
                      .replace("{total}", String(totalPages))}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={page <= 1}
                    className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>{t("support.paginationPrev")}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={page >= totalPages}
                    className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                  >
                    <span>{t("support.paginationNext")}</span>
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={createTicket}
      />

      {/* Update Ticket Status Modal (Admin Dialog with Checkbox Confirmation) */}
      {statusModalTicket && (
        <UpdateTicketStatusModal
          key={statusModalTicket.id}
          isOpen={true}
          ticket={statusModalTicket}
          onClose={() => setStatusModalTicket(null)}
          onSuccess={() => fetchTickets()}
        />
      )}
    </div>
  );
}
