"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Ticket, TicketStatus, CreateTicketInput, TicketMessage } from "../types/support.types";
import { supportApi } from "../api/support.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useSupport() {
  const { t } = useI18n();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchTickets = useCallback(
    async (overrideSearch?: string, overrideStatus?: TicketStatus | "ALL", targetPage?: number) => {
      setIsLoading(true);
      try {
        const search = overrideSearch !== undefined ? overrideSearch.trim() : activeSearch.trim();
        const status = overrideStatus !== undefined ? overrideStatus : statusFilter;
        const p = targetPage !== undefined ? targetPage : page;

        const res = await supportApi.getTickets({
          search,
          status,
          page: p,
          pageSize,
        });

        setTickets(res.tickets);
        setTotal(res.total);
        setPage(res.page);

        if (overrideSearch !== undefined) {
          setActiveSearch(overrideSearch.trim());
        }
        if (overrideStatus !== undefined) {
          setStatusFilter(overrideStatus);
        }
      } catch {
        // Fallback in API client
      } finally {
        setIsLoading(false);
      }
    },
    [activeSearch, statusFilter, page, pageSize]
  );

  const executeSearch = async (query: string) => {
    await fetchTickets(query, statusFilter, 1);
  };

  const clearSearch = async () => {
    await fetchTickets("", statusFilter, 1);
  };

  const changeStatusFilter = async (status: TicketStatus | "ALL") => {
    await fetchTickets(activeSearch, status, 1);
  };

  const nextPage = async () => {
    if (page < totalPages) {
      await fetchTickets(activeSearch, statusFilter, page + 1);
    }
  };

  const prevPage = async () => {
    if (page > 1) {
      await fetchTickets(activeSearch, statusFilter, page - 1);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const res = await supportApi.getTickets({ page: 1, pageSize: 10 });
        if (isMounted) {
          setTickets(res.tickets);
          setTotal(res.total);
          setPage(res.page);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) setIsLoading(false);
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const createTicket = async (payload: CreateTicketInput): Promise<Ticket> => {
    try {
      const newTicket = await supportApi.createTicket(payload);
      setTickets((prev) => [newTicket, ...prev]);
      setTotal((prev) => prev + 1);
      toast.success(t("support.toastCreated"));
      return newTicket;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat tiket";
      toast.error(msg);
      throw err;
    }
  };

  const replyTicket = async (
    ticketId: string,
    content: string,
    attachment?: string
  ): Promise<TicketMessage> => {
    try {
      const newMsg = await supportApi.replyTicket(ticketId, content, attachment);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId || t.ticketNumber === ticketId
            ? {
                ...t,
                messages: [...t.messages, newMsg],
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
      toast.success(t("support.toastReplySent"));
      return newMsg;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim balasan";
      toast.error(msg);
      throw err;
    }
  };

  const filteredTickets = useMemo(() => {
    let list = tickets;
    if (statusFilter !== "ALL") {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (activeSearch.trim()) {
      const term = activeSearch.toLowerCase().trim();
      list = list.filter(
        (t) => t.subject.toLowerCase().includes(term) || t.ticketNumber.toLowerCase().includes(term)
      );
    }
    return list;
  }, [tickets, activeSearch, statusFilter]);

  return {
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
    setStatusFilter: changeStatusFilter,
    nextPage,
    prevPage,
    fetchTickets,
    createTicket,
    replyTicket,
  };
}
