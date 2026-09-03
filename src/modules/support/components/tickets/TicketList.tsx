"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Ticket, TicketStatus } from "@/modules/support/types/support.types";
import { useSupport } from "@/modules/support/hooks/useSupport";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
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
          <Badge variant="success">
            <CheckCircle2 className="size-3" />
            <span>{t("support.statusResolved")}</span>
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge variant="neutral">
            <Lock className="size-3" />
            <span>{t("support.statusClosed")}</span>
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge variant="warning">
            <Clock className="size-3" />
            <span>{t("support.statusInProgress")}</span>
          </Badge>
        );
      case "OPEN":
      default:
        return (
          <Badge variant="info">
            <AlertCircle className="size-3" />
            <span>{t("support.statusOpen")}</span>
          </Badge>
        );
    }
  };

  const renderPriorityBadge = (priority: string) => {
    if (priority === "HIGH") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-rose-600 uppercase dark:text-rose-400">
          <ShieldAlert className="size-3.5" />
          <span>{t("support.priorityHigh")}</span>
        </span>
      );
    }
    return (
      <span className="text-foreground-muted text-xs font-bold uppercase">
        {priority === "LOW" ? t("support.priorityLow") : t("support.priorityMedium")}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Superadmin Mode Banner Notice */}
      {isSuperAdmin && (
        <div className="flex w-fit items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1.5 text-xs font-bold text-rose-600 shadow-2xs dark:text-rose-400">
          <ShieldAlert className="size-3.5 shrink-0" />
          <span>{t("support.adminConsoleNotice")}</span>
        </div>
      )}

      {/* Action Toolbar (Search Form, Create Ticket CTA & Scrollable Filter Chips) */}
      <div className="border-border bg-surface space-y-3 rounded-md border p-3 sm:space-y-4 sm:p-4 dark:bg-[#161715]">
        {/* Top Row: Search Form + Primary CTA */}
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => executeSearch(searchInput.trim())}
            onClear={handleClearSearch}
            placeholder={t("support.searchPlaceholder")}
            buttonText={t("support.search")}
          />

          {/* Primary CTA Button */}
          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="h-10 shrink-0 cursor-pointer gap-2 px-4 text-xs font-bold shadow-sm"
          >
            <Plus className="size-4" />
            <span>{t("support.createTicket")}</span>
          </Button>
        </div>

        {/* Bottom Row: Horizontal Scrollable Filter Chips + Refresh Button */}
        <div className="border-border/50 flex items-center justify-between gap-2 border-t pt-1">
          {/* Scrollable Filter Chips (No awkward multi-line text wrapping on mobile!) */}
          <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scroll-smooth py-1">
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
                    className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition ${
                      isActive
                        ? "bg-dark-green dark:bg-wise-green font-extrabold text-white shadow-xs dark:text-black"
                        : "bg-muted/70 hover:bg-muted text-foreground-secondary hover:text-foreground border-border/60 border font-semibold"
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
            className="border-border hover:border-foreground-muted size-8.5 shrink-0 cursor-pointer rounded-full p-0"
            aria-label={t("support.refreshAria")}
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Ticket List Content */}
      {isLoading && tickets.length === 0 ? (
        <Skeleton className="h-64 w-full rounded-md" />
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          icon={<LifeBuoy className="size-6" />}
          title={t("support.noTickets")}
          description={t("support.noTicketsDesc")}
          action={
            <Button
              variant="primaryPill"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 cursor-pointer gap-2 text-xs font-bold shadow-sm"
            >
              <Plus className="size-4" />
              <span>{t("support.createTicket")}</span>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {/* Mobile View: Card-based Ticket List (Visible on < 768px) */}
          <div className="space-y-3 md:hidden">
            {filteredTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="border-border bg-surface space-y-2.5 rounded-md border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]"
              >
                {/* Header: Ticket Number & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {tkt.ticketNumber}
                  </span>
                  <div>{renderStatusBadge(tkt.status)}</div>
                </div>

                {/* Customer Identity Row (Only for Superadmin) */}
                {isSuperAdmin && (
                  <div className="bg-muted/50 border-border/60 flex items-center gap-2 rounded border px-2.5 py-1.5 text-xs">
                    <UserIcon className="dark:text-wise-green size-3.5 shrink-0 text-emerald-700" />
                    <div className="min-w-0 truncate">
                      <span className="text-foreground font-bold">
                        {tkt.user?.name || t("support.customerUnknown")}
                      </span>
                      {tkt.user?.email && (
                        <span className="text-foreground-secondary ml-1.5 font-mono text-[11px]">
                          ({tkt.user.email})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Subject Title (Clickable) */}
                <Link
                  href={`/support/${tkt.id}`}
                  className="text-foreground dark:hover:text-wise-green line-clamp-2 block text-sm font-bold transition hover:text-emerald-700 hover:underline"
                >
                  {tkt.subject}
                </Link>

                {/* Metadata & Actions */}
                <div className="border-border/50 text-foreground-secondary flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-xs font-semibold">
                  <div className="flex items-center gap-2 truncate text-[11px]">
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
                        className="border-border hover:border-foreground-muted text-foreground h-7 cursor-pointer gap-1 rounded-full px-2.5 text-[11px] font-bold transition"
                      >
                        <SlidersHorizontal className="dark:text-wise-green size-3 text-emerald-700" />
                        <span>{t("support.editStatus")}</span>
                      </Button>
                    )}

                    <Link
                      href={`/support/${tkt.id}`}
                      className="border-border bg-muted/50 hover:bg-muted text-foreground inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-3 text-xs font-bold transition"
                    >
                      <span>{t("support.viewThread")}</span>
                      <ChevronRight className="dark:text-wise-green size-3 text-emerald-700" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Tabular Grid (Visible on >= 768px) */}
          <div className="border-border bg-surface hidden overflow-x-auto rounded-md border shadow-xs md:block dark:bg-[#161715]">
            <div className="min-w-190">
              {/* Table Header */}
              <div className="bg-muted/60 border-border text-foreground-muted grid grid-cols-12 gap-3 border-b px-5 py-4 text-xs font-extrabold tracking-wider uppercase select-none">
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
              <div className="divide-border/50 divide-y text-xs font-semibold">
                {filteredTickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="hover:bg-muted/40 grid min-h-14.5 grid-cols-12 items-center gap-3 px-5 py-3.5 transition-colors"
                  >
                    {isSuperAdmin ? (
                      <>
                        {/* Col 3: Ticket No & Subject */}
                        <div className="col-span-3 space-y-1 pr-1">
                          <div className="flex items-center gap-2">
                            <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                              {tkt.ticketNumber}
                            </span>
                          </div>
                          <Link
                            href={`/support/${tkt.id}`}
                            className="text-foreground dark:hover:text-wise-green line-clamp-1 block text-sm font-bold transition hover:text-emerald-700 hover:underline"
                          >
                            {tkt.subject}
                          </Link>
                        </div>

                        {/* Col 2: Customer (Name & Email) */}
                        <div className="col-span-2 min-w-0 space-y-0.5 pr-1">
                          <div className="text-foreground flex items-center gap-1.5 truncate text-xs font-bold">
                            <UserIcon className="dark:text-wise-green size-3 shrink-0 text-emerald-700" />
                            <span className="truncate">
                              {tkt.user?.name || t("support.customerUnknown")}
                            </span>
                          </div>
                          {tkt.user?.email && (
                            <p className="text-foreground-secondary truncate pl-4.5 font-mono text-[11px]">
                              {tkt.user.email}
                            </p>
                          )}
                        </div>

                        {/* Col 1: Category */}
                        <div className="text-foreground-secondary col-span-1 truncate text-xs font-semibold">
                          {tkt.category}
                        </div>

                        {/* Col 1: Priority */}
                        <div className="col-span-1">{renderPriorityBadge(tkt.priority)}</div>

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
                            className="border-border bg-surface hover:bg-muted hover:border-foreground-muted text-foreground inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-xs font-bold shadow-2xs transition"
                            title={t("support.editStatus")}
                          >
                            <SlidersHorizontal className="dark:text-wise-green size-3.5 text-emerald-700" />
                            <span>{t("support.editStatus")}</span>
                          </Button>

                          <Link
                            href={`/support/${tkt.id}`}
                            className="border-border bg-muted/60 hover:bg-muted hover:border-foreground-muted text-foreground inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-bold shadow-2xs transition"
                            title={t("support.viewThread")}
                          >
                            <MessageSquare className="dark:text-wise-green size-3.5 text-emerald-700" />
                            <span>{t("support.viewThread")}</span>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Standard Non-Admin Row */}
                        <div className="col-span-5 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                              {tkt.ticketNumber}
                            </span>
                          </div>
                          <Link
                            href={`/support/${tkt.id}`}
                            className="text-foreground dark:hover:text-wise-green line-clamp-1 block text-sm font-bold transition hover:text-emerald-700 hover:underline sm:text-base"
                          >
                            {tkt.subject}
                          </Link>
                        </div>

                        <div className="text-foreground-secondary col-span-2 text-sm font-semibold">
                          {tkt.category}
                        </div>

                        <div className="col-span-2">{renderPriorityBadge(tkt.priority)}</div>

                        <div className="col-span-2 flex justify-center">
                          {renderStatusBadge(tkt.status)}
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <Link
                            href={`/support/${tkt.id}`}
                            className="border-border bg-surface hover:bg-muted hover:border-foreground-muted text-foreground inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-bold shadow-2xs transition"
                          >
                            <MessageSquare className="dark:text-wise-green size-3.5 text-emerald-700" />
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
            <div className="border-border bg-surface flex flex-col items-center justify-between gap-3 rounded-md border p-3 shadow-xs sm:flex-row sm:px-5 sm:py-3.5 dark:bg-[#161715]">
              {/* Item count summary */}
              <div className="text-foreground-secondary text-xs font-semibold">
                {t("support.paginationShowing")
                  .replace("{start}", String(startItem))
                  .replace("{end}", String(endItem))
                  .replace("{total}", String(total))}
              </div>

              {/* Page navigation: Previous, Page Indicator, Next */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-foreground-muted px-1.5 text-xs font-bold select-none">
                    {t("support.paginationPage")
                      .replace("{page}", String(page))
                      .replace("{total}", String(totalPages))}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={page <= 1}
                    className="border-border hover:border-foreground-muted h-8.5 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold disabled:opacity-40"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>{t("support.paginationPrev")}</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={page >= totalPages}
                    className="border-border hover:border-foreground-muted h-8.5 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold disabled:opacity-40"
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
