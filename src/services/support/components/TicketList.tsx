"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Ticket, TicketStatus } from "../types/support.types";
import { useSupport } from "../hooks/useSupport";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

const CreateTicketModal = dynamic(
  () => import("./CreateTicketModal").then((m) => m.CreateTicketModal),
  { ssr: false }
);
const TicketThreadModal = dynamic(
  () => import("./TicketThreadModal").then((m) => m.TicketThreadModal),
  { ssr: false }
);
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
} from "lucide-react";

export function TicketList() {
  const { t } = useI18n();
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
    replyTicket,
  } = useSupport();

  const [searchInput, setSearchInput] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isThreadOpen, setIsThreadOpen] = useState(false);

  const handleOpenThread = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsThreadOpen(true);
  };

  const handleCloseThread = () => {
    setIsThreadOpen(false);
    setSelectedTicket(null);
  };

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
          <span>Tinggi</span>
        </span>
      );
    }
    return (
      <span className="text-xs font-bold text-foreground-muted uppercase">
        {priority === "LOW" ? "Rendah" : "Sedang"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar (Search Submit & Filter Pills) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Search Form with Submit Button */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
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
            <span>Cari</span>
          </Button>
        </form>

        {/* Filter Pills & Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-full bg-muted border border-border text-xs font-bold">
            {(["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"] as (TicketStatus | "ALL")[]).map(
              (st) => {
                const label =
                  st === "ALL"
                    ? t("support.filterAll")
                    : st === "OPEN"
                    ? t("support.filterOpen")
                    : st === "IN_PROGRESS"
                    ? t("support.filterInProgress")
                    : t("support.filterResolved");

                const isActive = statusFilter === st;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                      isActive
                        ? "bg-surface dark:bg-[#161715] text-foreground shadow-sm font-extrabold"
                        : "text-foreground-secondary hover:text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                );
              }
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTickets()}
            disabled={isLoading}
            className="rounded-full size-9 p-0 border-border hover:border-foreground-muted cursor-pointer"
            aria-label="Refresh Tiket"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 text-xs font-bold shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("support.createTicket")}</span>
          </Button>
        </div>
      </div>

      {/* Ticket List Table */}
      {isLoading && tickets.length === 0 ? (
        <div className="h-64 rounded-md border border-border bg-surface dark:bg-[#161715] animate-pulse p-6" />
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-md border border-dashed border-border bg-surface dark:bg-[#161715]/50 space-y-4">
          <div className="size-14 rounded-full bg-wise-green/10 text-wise-green flex items-center justify-center">
            <LifeBuoy className="size-7" />
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
        <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
            <div className="col-span-6 sm:col-span-5">{t("support.tableHeaderTicket")}</div>
            <div className="hidden sm:block sm:col-span-2">{t("support.tableHeaderCategory")}</div>
            <div className="hidden sm:block sm:col-span-2">{t("support.tableHeaderPriority")}</div>
            <div className="col-span-3 sm:col-span-2 text-center">{t("support.tableHeaderStatus")}</div>
            <div className="col-span-3 sm:col-span-1 text-right">{t("support.tableHeaderAction")}</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/50 text-xs font-semibold">
            {filteredTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition-colors min-h-14.5"
              >
                {/* Subject & Number (Enlarged Typography) */}
                <div className="col-span-6 sm:col-span-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 px-2.5 py-0.5 rounded-full border border-wise-green/30">
                      {tkt.ticketNumber}
                    </span>
                    <span className="text-xs text-foreground-muted sm:hidden">
                      {tkt.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground text-sm sm:text-base line-clamp-1">
                    {tkt.subject}
                  </h4>
                </div>

                {/* Category */}
                <div className="hidden sm:block sm:col-span-2 text-sm font-semibold text-foreground-secondary">
                  {tkt.category}
                </div>

                {/* Priority */}
                <div className="hidden sm:block sm:col-span-2">
                  {renderPriorityBadge(tkt.priority)}
                </div>

                {/* Status */}
                <div className="col-span-3 sm:col-span-2 flex justify-center">
                  {renderStatusBadge(tkt.status)}
                </div>

                {/* Action */}
                <div className="col-span-3 sm:col-span-1 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenThread(tkt)}
                    className="h-8 px-3 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer"
                  >
                    <MessageSquare className="size-3.5 text-wise-green" />
                    <span className="hidden sm:inline">Buka</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          {total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-border bg-muted/30">
              {/* Item count summary */}
              <div className="text-xs sm:text-sm font-semibold text-foreground-secondary">
                Menampilkan {startItem} - {endItem} dari {total} tiket
              </div>

              {/* Page navigation: Previous, Page Indicator, Next */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground-muted px-1.5 select-none">
                    Halaman {page} dari {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={page <= 1}
                    className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>Sebelumnya</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={page >= totalPages}
                    className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                  >
                    <span>Berikutnya</span>
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

      {/* Ticket Thread Conversation Modal */}
      <TicketThreadModal
        ticket={selectedTicket}
        isOpen={isThreadOpen}
        onClose={handleCloseThread}
        onSendReply={replyTicket}
      />
    </div>
  );
}
