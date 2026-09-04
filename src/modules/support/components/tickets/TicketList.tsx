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
import { DataTablePagination } from "@/components/ui/pagination";
import { useI18n } from "@/lib/i18n/context";
import { UpdateTicketStatusModal } from "./UpdateTicketStatusModal";

const CreateTicketModal = dynamic(
  () => import("./CreateTicketModal").then((m) => m.CreateTicketModal),
  { ssr: false }
);
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { isAdmin } from "@/modules/iam/types/auth.types";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { useTableSort } from "@/hooks/useTableSort";
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
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

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<Ticket>({
    initialKey: "updatedAt",
    initialOrder: "desc",
  });

  const sortedTickets = sortData(filteredTickets);

  const handleClearSearch = () => {
    setSearchInput("");
    clearSearch();
  };

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
      <div className="border-border bg-surface space-y-3 rounded-xl border p-3.5 shadow-xs sm:space-y-4 sm:p-4 dark:bg-[#161715]">
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
            className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
            aria-label={t("support.refreshAria")}
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
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
        <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
          {/* Mobile View: Card-based Ticket List (Visible on < 1024px) */}
          <div className="divide-border/50 divide-y lg:hidden">
            {sortedTickets.map((tkt) => (
              <div key={tkt.id} className="bg-surface space-y-2.5 p-3.5 sm:p-4 dark:bg-[#161715]">
                {/* Header: Ticket Number & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {tkt.ticketNumber}
                  </span>
                  <div>{renderStatusBadge(tkt.status)}</div>
                </div>

                {/* Subject & Category */}
                <div className="space-y-1">
                  <Link
                    href={`/support/${tkt.id}`}
                    className="text-foreground dark:hover:text-wise-green line-clamp-1 block text-sm font-bold transition hover:text-emerald-700 hover:underline"
                  >
                    {tkt.subject}
                  </Link>
                  {(tkt.message || tkt.messages?.[0]?.content) && (
                    <p className="text-foreground-secondary line-clamp-2 text-xs leading-relaxed">
                      {tkt.message || tkt.messages?.[0]?.content}
                    </p>
                  )}
                </div>

                {/* Extra Meta for SuperAdmin on Mobile */}
                {isSuperAdmin && tkt.user && (
                  <div className="bg-muted/40 border-border/50 flex items-center gap-1.5 rounded-md border p-2 text-xs">
                    <UserIcon className="dark:text-wise-green size-3.5 shrink-0 text-emerald-700" />
                    <span className="text-foreground truncate font-bold">{tkt.user.name}</span>
                    {tkt.user.email && (
                      <span className="text-foreground-muted truncate font-mono text-[11px]">
                        ({tkt.user.email})
                      </span>
                    )}
                  </div>
                )}

                {/* Footer: Priority, Date, & Detail Action */}
                <div className="border-border/50 flex items-center justify-between border-t pt-2.5">
                  <div className="flex items-center gap-2">
                    {renderPriorityBadge(tkt.priority)}
                    <span className="text-foreground-muted text-[11px]">
                      {tkt.updatedAt
                        ? new Date(tkt.updatedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })
                        : "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isSuperAdmin && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setStatusModalTicket(tkt)}
                        className="border-border bg-surface hover:bg-muted hover:border-foreground-muted text-foreground inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 text-xs font-bold shadow-2xs transition"
                        title={t("support.editStatus")}
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

          {/* Desktop View: shadcn/ui Table (Visible on >= 1024px) */}
          <div className="hidden overflow-x-auto lg:block">
            <Table className="min-w-[850px]">
              <TableHeader>
                <TableRow className="bg-muted/50 border-border hover:bg-muted/50">
                  {isSuperAdmin ? (
                    <>
                      <TableHead className="w-[28%] px-5 py-3.5">
                        <DataTableColumnHeader
                          title={t("support.tableHeaderTicket")}
                          columnKey="ticketNumber"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                      </TableHead>
                      <TableHead className="w-[20%] px-4 py-3.5">
                        <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                          {t("support.tableHeaderCustomer")}
                        </div>
                      </TableHead>
                      <TableHead className="w-[12%] px-3 py-3.5">
                        <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                          {t("support.tableHeaderCategory")}
                        </div>
                      </TableHead>
                      <TableHead className="w-[12%] px-3 py-3.5">
                        <DataTableColumnHeader
                          title={t("support.tableHeaderPriority")}
                          columnKey="priority"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                      </TableHead>
                      <TableHead className="w-[12%] px-3 py-3.5 text-center">
                        <DataTableColumnHeader
                          title={t("support.tableHeaderStatus")}
                          columnKey="status"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          align="center"
                        />
                      </TableHead>
                      <TableHead className="w-[16%] px-5 py-3.5 text-right">
                        <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                          {t("support.tableHeaderAction")}
                        </div>
                      </TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="w-[45%] px-5 py-3.5">
                        <DataTableColumnHeader
                          title={t("support.tableHeaderTicket")}
                          columnKey="ticketNumber"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                      </TableHead>
                      <TableHead className="w-[18%] px-4 py-3.5">
                        <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                          {t("support.tableHeaderCategory")}
                        </div>
                      </TableHead>
                      <TableHead className="w-[15%] px-3 py-3.5">
                        <DataTableColumnHeader
                          title={t("support.tableHeaderPriority")}
                          columnKey="priority"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                      </TableHead>
                      <TableHead className="w-[12%] px-3 py-3.5 text-center">
                        <DataTableColumnHeader
                          title={t("support.tableHeaderStatus")}
                          columnKey="status"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          align="center"
                        />
                      </TableHead>
                      <TableHead className="w-[10%] px-5 py-3.5 text-right">
                        <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                          {t("support.tableHeaderAction")}
                        </div>
                      </TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {sortedTickets.map((tkt) => (
                  <TableRow key={tkt.id} className="hover:bg-muted/30 transition-colors">
                    {isSuperAdmin ? (
                      <>
                        {/* Ticket No & Subject */}
                        <TableCell className="px-5 py-3.5 align-middle">
                          <div className="space-y-1">
                            <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 inline-block rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                              {tkt.ticketNumber}
                            </span>
                            <Link
                              href={`/support/${tkt.id}`}
                              className="text-foreground dark:hover:text-wise-green line-clamp-1 block text-sm font-bold transition hover:text-emerald-700 hover:underline"
                            >
                              {tkt.subject}
                            </Link>
                          </div>
                        </TableCell>

                        {/* Customer */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="min-w-0 space-y-0.5">
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
                        </TableCell>

                        {/* Category */}
                        <TableCell className="text-foreground-secondary px-3 py-3.5 align-middle text-xs font-semibold">
                          {tkt.category}
                        </TableCell>

                        {/* Priority */}
                        <TableCell className="px-3 py-3.5 align-middle">
                          {renderPriorityBadge(tkt.priority)}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
                            {renderStatusBadge(tkt.status)}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-5 py-3.5 text-right align-middle">
                          <div className="flex items-center justify-end gap-2">
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
                        </TableCell>
                      </>
                    ) : (
                      <>
                        {/* Standard Non-Admin Row */}
                        <TableCell className="px-5 py-3.5 align-middle">
                          <div className="space-y-1">
                            <span className="text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 border-wise-green/30 inline-block rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold">
                              {tkt.ticketNumber}
                            </span>
                            <Link
                              href={`/support/${tkt.id}`}
                              className="text-foreground dark:hover:text-wise-green line-clamp-1 block text-sm font-bold transition hover:text-emerald-700 hover:underline sm:text-base"
                            >
                              {tkt.subject}
                            </Link>
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell className="text-foreground-secondary px-4 py-3.5 align-middle text-sm font-semibold">
                          {tkt.category}
                        </TableCell>

                        {/* Priority */}
                        <TableCell className="px-3 py-3.5 align-middle">
                          {renderPriorityBadge(tkt.priority)}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
                            {renderStatusBadge(tkt.status)}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-5 py-3.5 text-right align-middle">
                          <div className="flex items-center justify-end">
                            <Link
                              href={`/support/${tkt.id}`}
                              className="border-border bg-surface hover:bg-muted hover:border-foreground-muted text-foreground inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-bold shadow-2xs transition"
                            >
                              <MessageSquare className="dark:text-wise-green size-3.5 text-emerald-700" />
                              <span className="hidden sm:inline">{t("support.viewThread")}</span>
                            </Link>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          {total > 0 && (
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              onPageChange={(p) => fetchTickets(undefined, undefined, p)}
              onPrevPage={prevPage}
              onNextPage={nextPage}
              entityName="tiket bantuan"
            />
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
