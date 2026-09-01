"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Invoice, TenantBalance, PaymentMethod } from "../types/finance.types";
import { financeApi } from "../api/finance.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useBilling() {
  const { t } = useI18n();
  const [balance, setBalance] = useState<TenantBalance | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSearch, setActiveSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchInvoices = useCallback(
    async (overrideSearch?: string, overrideStatus?: string, targetPage?: number) => {
      setIsLoading(true);
      try {
        const search = overrideSearch !== undefined ? overrideSearch.trim() : activeSearch.trim();
        const status = overrideStatus !== undefined ? overrideStatus : statusFilter;
        const p = targetPage !== undefined ? targetPage : page;

        const invRes = await financeApi.getInvoices({
          search,
          status,
          page: p,
          pageSize,
        });

        setInvoices(invRes.invoices);
        setTotal(invRes.total);
        setPage(invRes.page);

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

  const fetchBillingData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [balData, invRes] = await Promise.all([
        financeApi.getBalance(),
        financeApi.getInvoices({ page: 1, pageSize: 10 }),
      ]);
      setBalance(balData);
      setInvoices(invRes.invoices);
      setTotal(invRes.total);
      setPage(invRes.page);
    } catch {
      // Fallback in API client
    } finally {
      setIsLoading(false);
    }
  }, []);

  const executeSearch = async (query: string) => {
    await fetchInvoices(query, statusFilter, 1);
  };

  const clearSearch = async () => {
    await fetchInvoices("", statusFilter, 1);
  };

  const changeStatusFilter = async (status: string) => {
    await fetchInvoices(activeSearch, status, 1);
  };

  const nextPage = async () => {
    if (page < totalPages) {
      await fetchInvoices(activeSearch, statusFilter, page + 1);
    }
  };

  const prevPage = async () => {
    if (page > 1) {
      await fetchInvoices(activeSearch, statusFilter, page - 1);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [balData, invRes] = await Promise.all([
          financeApi.getBalance(),
          financeApi.getInvoices({ page: 1, pageSize: 10 }),
        ]);
        if (isMounted) {
          setBalance(balData);
          setInvoices(invRes.invoices);
          setTotal(invRes.total);
          setPage(invRes.page);
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

  const createTopUp = async (amount: number, paymentMethod: PaymentMethod): Promise<Invoice> => {
    try {
      const { invoice, invoiceUrl } = await financeApi.createTopUp({ amount, paymentMethod });
      setInvoices((prev) => [invoice, ...prev]);
      setTotal((prev) => prev + 1);
      toast.success(t("billing.toastTopUpSuccess"));
      if (invoiceUrl && typeof window !== "undefined") {
        window.open(invoiceUrl, "_blank", "noopener,noreferrer");
      }
      return invoice;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("billing.toastTopUpError");
      toast.error(msg);
      throw err;
    }
  };

  const filteredInvoices = useMemo(() => {
    let list = invoices;
    if (statusFilter !== "ALL") {
      list = list.filter((inv) => inv.status === statusFilter);
    }
    if (activeSearch.trim()) {
      const term = activeSearch.toLowerCase().trim();
      list = list.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(term) ||
          inv.description.toLowerCase().includes(term) ||
          inv.amount.toString().includes(term)
      );
    }
    return list;
  }, [invoices, statusFilter, activeSearch]);

  return {
    balance,
    invoices,
    filteredInvoices,
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
    fetchBillingData,
    fetchInvoices,
    createTopUp,
  };
}
