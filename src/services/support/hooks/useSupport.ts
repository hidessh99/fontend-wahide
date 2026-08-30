"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Ticket, TicketStatus, CreateTicketInput } from "../types/support.types";
import { supportApi } from "../api/support.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useSupport() {
  const { t } = useI18n();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("ALL");

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await supportApi.getTickets();
      setTickets(data);
    } catch {
      // Fallback in API client
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const data = await supportApi.getTickets();
        if (isMounted) {
          setTickets(data);
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
      toast.success(t("support.toastCreated"));
      return newTicket;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat tiket";
      toast.error(msg);
      throw err;
    }
  };

  const replyTicket = async (ticketId: string, content: string) => {
    try {
      const newMsg = await supportApi.replyTicket(ticketId, content);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                messages: [...t.messages, newMsg],
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      );
      toast.success(t("support.toastReplySent"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim balasan";
      toast.error(msg);
      throw err;
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        searchQuery === "" ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  return {
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
  };
}
