"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Template,
  TemplateCategory,
  TemplateChannelType,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "../types/template.types";
import { templateApi } from "../api/template.api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";

export function useTemplates(initialChannelType?: TemplateChannelType | "ALL") {
  const { t } = useI18n();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<TemplateCategory | "ALL">("ALL");
  const [channelType, setChannelType] = useState<TemplateChannelType | "ALL">(
    initialChannelType || "ALL",
  );
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchTemplates = useCallback(
    async (
      overrideParams?: {
        search?: string;
        category?: TemplateCategory | "ALL";
        channelType?: TemplateChannelType | "ALL";
        favoriteOnly?: boolean;
        page?: number;
      },
      signal?: AbortSignal,
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const querySearch =
          overrideParams?.search !== undefined ? overrideParams.search : search;
        const queryCategory =
          overrideParams?.category !== undefined
            ? overrideParams.category
            : category;
        const queryChannelType =
          overrideParams?.channelType !== undefined
            ? overrideParams.channelType
            : channelType;
        const queryFavoriteOnly =
          overrideParams?.favoriteOnly !== undefined
            ? overrideParams.favoriteOnly
            : favoriteOnly;
        const queryPage =
          overrideParams?.page !== undefined ? overrideParams.page : page;

        const res = await templateApi.getTemplates({
          page: queryPage,
          pageSize,
          search: querySearch.trim() || undefined,
          category: queryCategory,
          channelType: queryChannelType,
          favoriteOnly: queryFavoriteOnly || undefined,
        });

        if (signal?.aborted) return;

        setTemplates(res.templates);
        setTotal(res.total);
        setPage(res.page);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        const msg =
          err instanceof Error ? err.message : t("common.networkError");
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [search, category, channelType, favoriteOnly, page, pageSize, t],
  );

  // Initial load effect
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadInitialData = async () => {
      try {
        const res = await templateApi.getTemplates(
          {
            page: 1,
            pageSize,
            channelType: initialChannelType || "ALL",
          },
          // @ts-expect-error signal support if api client accepts
          controller.signal,
        );
        if (isMounted) {
          setTemplates(res.templates);
          setTotal(res.total);
          setPage(res.page);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat template",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [pageSize, initialChannelType]);

  // Filter setters that reset page to 1
  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
    fetchTemplates({ search: query, page: 1 });
  };

  const handleCategoryChange = (cat: TemplateCategory | "ALL") => {
    setCategory(cat);
    setPage(1);
    fetchTemplates({ category: cat, page: 1 });
  };

  const handleFavoriteOnlyToggle = () => {
    const nextVal = !favoriteOnly;
    setFavoriteOnly(nextVal);
    setPage(1);
    fetchTemplates({ favoriteOnly: nextVal, page: 1 });
  };

  const goToPage = (p: number) => {
    if (p < 1 || (total > 0 && p > totalPages) || p === page) return;
    setPage(p);
    fetchTemplates({ page: p });
  };

  const createTemplate = async (
    input: CreateTemplateInput,
  ): Promise<boolean> => {
    try {
      await templateApi.createTemplate(input);
      toast.success(t("template.createdSuccess"));
      await fetchTemplates();
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("template.createFailed");
      toast.error(msg);
      return false;
    }
  };

  const updateTemplate = async (
    id: string,
    input: UpdateTemplateInput,
  ): Promise<boolean> => {
    try {
      const updated = await templateApi.updateTemplate(id, input);
      toast.success(t("template.updatedSuccess"));
      setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("template.updateFailed");
      toast.error(msg);
      return false;
    }
  };

  const duplicateTemplate = async (id: string): Promise<boolean> => {
    try {
      await templateApi.duplicateTemplate(id);
      toast.success(t("template.duplicatedSuccess"));
      await fetchTemplates();
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("template.duplicateFailed");
      toast.error(msg);
      return false;
    }
  };

  const deleteTemplate = async (
    id: string,
    _name?: string,
  ): Promise<boolean> => {
    try {
      await templateApi.deleteTemplate(id);
      toast.success(t("template.deletedSuccess"));
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("template.deleteFailed");
      toast.error(msg);
      return false;
    }
  };

  const toggleFavorite = async (template: Template) => {
    const nextFavorite = !template.isFavorite;
    // Optimistic update
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === template.id ? { ...t, isFavorite: nextFavorite } : t,
      ),
    );
    try {
      await templateApi.toggleFavorite(template.id);
      toast.success(
        nextFavorite ? t("template.favorited") : t("template.unfavorited"),
      );
    } catch {
      // Rollback
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === template.id ? { ...t, isFavorite: template.isFavorite } : t,
        ),
      );
      toast.error(t("common.genericError"));
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const marketingCount = templates.filter(
      (t) => t.category === "MARKETING",
    ).length;
    const utilityCount = templates.filter(
      (t) => t.category === "UTILITY",
    ).length;
    const reminderCount = templates.filter(
      (t) => t.category === "REMINDER",
    ).length;
    const reservationCount = templates.filter(
      (t) => t.category === "RESERVATION",
    ).length;
    const quickReplyCount = templates.filter(
      (t) => t.category === "QUICK_REPLY",
    ).length;
    const favoriteCount = templates.filter((t) => t.isFavorite).length;

    return {
      total,
      marketing: marketingCount,
      utility: utilityCount,
      reminder: reminderCount,
      reservation: reservationCount,
      quickReply: quickReplyCount,
      favorites: favoriteCount,
    };
  }, [templates, total]);

  return {
    templates,
    isLoading,
    error,
    stats,
    // Filters & Pagination
    search,
    category,
    channelType,
    favoriteOnly,
    page,
    pageSize,
    total,
    totalPages,
    handleSearchChange,
    handleCategoryChange,
    handleChannelTypeChange: (ct: TemplateChannelType | "ALL") => {
      setChannelType(ct);
      fetchTemplates({ channelType: ct, page: 1 });
    },
    handleFavoriteOnlyToggle,
    goToPage,
    // CRUD Actions
    createTemplate,
    updateTemplate,
    duplicateTemplate,
    deleteTemplate,
    toggleFavorite,
    reload: () => fetchTemplates(),
  };
}
