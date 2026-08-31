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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchContacts = useCallback(
    async (customParams?: { search?: string; tag?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const search = customParams?.search !== undefined ? customParams.search : searchQuery;
        const tag = customParams?.tag !== undefined ? customParams.tag : selectedTag;
        const data = await contactApi.getContacts({ search, tag });
        setContacts(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Gagal memuat kontak";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, selectedTag]
  );

  const executeSearch = async (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : searchQuery;
    await fetchContacts({ search: q, tag: selectedTag });
  };

  const clearSearch = async () => {
    setSearchQuery("");
    await fetchContacts({ search: "", tag: selectedTag });
  };

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const data = await contactApi.getContacts();
        if (isMounted) {
          setContacts(data);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Gagal memuat kontak";
          setError(msg);
          setIsLoading(false);
        }
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  const createContact = async (data: CreateContactInput): Promise<Contact> => {
    try {
      const newContact = await contactApi.createContact(data);
      setContacts((prev) => [newContact, ...prev]);
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
      const res = await contactApi.bulkDeleteContacts(ids);
      setContacts((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
      toast.success(t("contact.toastBulkDeleted", { count: res.count.toString() }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kontak";
      toast.error(msg);
      throw err;
    }
  };

  const importCsv = async (list: CreateContactInput[]): Promise<number> => {
    try {
      const res = await contactApi.importCsv(list);
      await fetchContacts();
      toast.success(t("contact.toastImportSuccess", { count: res.importedCount.toString() }));
      return res.importedCount;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengimpor CSV";
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

  const allTags = useMemo(() => {
    const set = new Set<string>();
    contacts.forEach((c) => {
      c.tags?.forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        selectedTag === "ALL" || (c.tags && c.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });
  }, [contacts, searchQuery, selectedTag]);

  return {
    contacts,
    filteredContacts,
    allTags,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
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
