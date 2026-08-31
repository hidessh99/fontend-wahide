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
  MessageSquare,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";

export function TicketList() {
  const { t } = useI18n();
  const {
    tickets,
    filteredTickets,
    isLoading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    fetchTickets,
    createTicket,
    replyTicket,
  } = useSupport();

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
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase">
          <ShieldAlert className="size-3" />
          <span>Tinggi</span>
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold text-foreground-muted uppercase">
        {priority === "LOW" ? "Rendah" : "Sedang"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("support.searchPlaceholder")}
            className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
          />
        </div>

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
            onClick={fetchTickets}
            disabled={isLoading}
            className="rounded-full size-9 p-0 border-border hover:border-foreground-muted"
            aria-label="Refresh Tiket"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 text-xs font-bold shadow-sm"
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
            className="gap-2 text-xs font-bold mt-2 shadow-sm"
          >
            <Plus className="size-4" />
            <span>{t("support.createTicket")}</span>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-muted/60 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground-muted select-none">
            <div className="col-span-6 sm:col-span-5">{t("support.tableHeaderTicket")}</div>
            <div className="hidden sm:block sm:col-span-2">{t("support.tableHeaderCategory")}</div>
            <div className="hidden sm:block sm:col-span-2">{t("support.tableHeaderPriority")}</div>
            <div className="col-span-3 sm:col-span-2 text-center">{t("support.tableHeaderStatus")}</div>
            <div className="col-span-3 sm:col-span-1 text-right">{t("support.tableHeaderAction")}</div>
          </div>

          <div className="divide-y divide-border/50 text-xs font-semibold">
            {filteredTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-muted/40 transition-colors"
              >
                {/* Subject & Number */}
                <div className="col-span-6 sm:col-span-5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-wise-green bg-wise-green/15 px-2 py-0.5 rounded-full">
                      {tkt.ticketNumber}
                    </span>
                    <span className="text-[11px] text-foreground-muted sm:hidden">
                      {tkt.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground text-xs sm:text-sm line-clamp-1">
                    {tkt.subject}
                  </h4>
                </div>

                {/* Category */}
                <div className="hidden sm:block sm:col-span-2 text-foreground-secondary">
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
                    className="rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted"
                  >
                    <MessageSquare className="size-3.5 text-wise-green" />
                    <span className="hidden sm:inline">Buka</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
