"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Contact, CreateContactInput } from "../types/contact.types";
import { contactApi } from "../api/contact.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useContacts() {
  const { t } = useI18n();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchContacts = useCallback(
    async (overrideSearch?: string, targetPage?: number, signal?: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const search = overrideSearch !== undefined ? overrideSearch.trim() : activeSearch.trim();
        const p = targetPage !== undefined ? targetPage : page;
        const res = await contactApi.getContacts({ search, page: p, pageSize }, signal);
        setContacts(res.contacts);
        setTotal(res.total);
        setPage(res.page);
        if (overrideSearch !== undefined) {
          setActiveSearch(overrideSearch.trim());
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Gagal memuat kontak";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [activeSearch, page, pageSize]
  );

  const executeSearch = async (query: string) => {
    await fetchContacts(query, 1);
  };

  const clearSearch = async () => {
    await fetchContacts("", 1);
  };

  const setPageDirect = async (p: number) => {
    if (p < 1 || (total > 0 && p > totalPages) || p === page) return;
    await fetchContacts(undefined, p);
  };

  const nextPage = async () => {
    if (page < totalPages) {
      await fetchContacts(undefined, page + 1);
    }
  };

  const prevPage = async () => {
    if (page > 1) {
      await fetchContacts(undefined, page - 1);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadInitialContacts = async () => {
      try {
        const res = await contactApi.getContacts({ search: "", page: 1, pageSize: 10 }, controller.signal);
        if (isMounted) {
          setContacts(res.contacts);
          setTotal(res.total);
          setPage(res.page);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Gagal memuat kontak");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialContacts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const createContact = async (data: CreateContactInput): Promise<Contact> => {
    try {
      const newContact = await contactApi.createContact(data);
      setContacts((prev) => [newContact, ...prev]);
      setTotal((prev) => prev + 1);
      toast.success(t("contact.toastCreated"));
      return newContact;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan kontak";
      toast.error(msg);
      throw err;
    }
  };

  const updateContact = async (id: string, data: Partial<CreateContactInput>): Promise<Contact> => {
    try {
      const updated = await contactApi.updateContact(id, data);
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success(t("contact.toastUpdated"));
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui kontak";
      toast.error(msg);
      throw err;
    }
  };

  const deleteContact = async (id: string): Promise<void> => {
    try {
      await contactApi.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success(t("contact.toastDeleted"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kontak";
      toast.error(msg);
      throw err;
    }
  };

  const bulkDelete = async (): Promise<void> => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    try {
      await contactApi.bulkDeleteContacts(ids);
      setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setTotal((prev) => Math.max(0, prev - ids.length));
      setSelectedIds(new Set());
      toast.success(t("contact.selectedCount", { count: ids.length.toString() }) + " berhasil dihapus");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kontak";
      toast.error(msg);
      throw err;
    }
  };

  const importCsv = async (importedContacts: CreateContactInput[]): Promise<number> => {
    try {
      const res = await contactApi.importCsv(importedContacts);
      await fetchContacts(undefined, 1);
      return res.importedCount;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengimpor file CSV";
      toast.error(msg);
      throw err;
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = (allFilteredIds: string[]) => {
    setSelectedIds((prev) => {
      if (prev.size === allFilteredIds.length && allFilteredIds.length > 0) {
        return new Set();
      }
      return new Set(allFilteredIds);
    });
  };

  const filteredContacts = useMemo(() => {
    if (!activeSearch.trim()) return contacts;
    const term = activeSearch.toLowerCase().trim();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term)
    );
  }, [contacts, activeSearch]);

  return {
    contacts,
    filteredContacts,
    allTags: [] as string[],
    isLoading,
    error,
    activeSearch,
    page,
    pageSize,
    total,
    totalPages,
    setPage: setPageDirect,
    nextPage,
    prevPage,
    selectedIds,
    toggleSelectOne,
    toggleSelectAll,
    fetchContacts,
    executeSearch,
    clearSearch,
    createContact,
    updateContact,
    deleteContact,
    bulkDelete,
    importCsv,
  };
}
