"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  Voucher,
  CreateVoucherInput,
  UpdateVoucherInput,
} from "../types/coupon.types";
import { couponAdminApi } from "../api/coupon.api";
import { toast } from "sonner";

export function useAdminCoupons() {
  const { t } = useI18n();
  const [coupons, setCoupons] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await couponAdminApi.getList({
        page,
        pageSize,
        search: searchQuery,
      });
      setCoupons(res.data);
      setTotal(res.total);
    } catch {
      toast.error(t("admin.coupons.toastLoadFailed") || "Gagal memuat daftar kupon");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, t]);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await couponAdminApi.getList(
          {
            page,
            pageSize,
            search: searchQuery,
          },
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setCoupons(res.data);
          setTotal(res.total);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [page, pageSize, searchQuery]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const createCoupon = async (input: CreateVoucherInput): Promise<boolean> => {
    try {
      await couponAdminApi.create(input);
      toast.success(t("admin.coupons.toastCreateSuccess") || "Kupon baru berhasil dibuat");
      await fetchCoupons();
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("admin.coupons.toastCreateFailed") || "Gagal membuat kupon";
      toast.error(message);
      return false;
    }
  };

  const updateCoupon = async (
    id: string,
    input: UpdateVoucherInput,
  ): Promise<boolean> => {
    try {
      await couponAdminApi.update(id, input);
      toast.success(t("admin.coupons.toastUpdateSuccess") || "Kupon berhasil diperbarui");
      await fetchCoupons();
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("admin.coupons.toastUpdateFailed") || "Gagal memperbarui kupon";
      toast.error(message);
      return false;
    }
  };

  const deleteCoupon = async (id: string): Promise<boolean> => {
    try {
      await couponAdminApi.delete(id);
      toast.success(t("admin.coupons.toastDeleteSuccess") || "Kupon berhasil dihapus");
      await fetchCoupons();
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("admin.coupons.toastDeleteFailed") || "Gagal menghapus kupon";
      toast.error(message);
      return false;
    }
  };

  const toggleActive = async (voucher: Voucher): Promise<boolean> => {
    try {
      await couponAdminApi.update(voucher.id, {
        isActive: !voucher.isActive,
      });
      toast.success(
        voucher.isActive
          ? t("admin.coupons.toastDeactivated") || `Kupon ${voucher.code} dinonaktifkan`
          : t("admin.coupons.toastActivated") || `Kupon ${voucher.code} diaktifkan`,
      );
      await fetchCoupons();
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : t("admin.coupons.toastUpdateFailed") || "Gagal mengubah status kupon";
      toast.error(message);
      return false;
    }
  };

  const executeSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return {
    coupons,
    isLoading,
    searchQuery,
    page,
    pageSize,
    total,
    totalPages,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleActive,
    executeSearch,
    clearSearch,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
  };
}
