"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AdminMetrics,
  UserItem,
  AdjustBalanceInput,
  UpdateUserInput,
} from "../types/admin.types";
import { adminApi } from "../api/admin.api";
import { toast } from "sonner";

export function useAdmin() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSearch, setActiveSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAdminData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metData, usrData] = await Promise.all([
        adminApi.getMetrics(),
        adminApi.getUsers({ page: 1, pageSize: 100 }),
      ]);
      setMetrics(metData);
      setUsers(usrData.users);
    } catch {
      // Fallbacks in API
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const [metData, usrData] = await Promise.all([
          adminApi.getMetrics(),
          adminApi.getUsers({ page: 1, pageSize: 100 }),
        ]);
        if (isMounted) {
          setMetrics(metData);
          setUsers(usrData.users);
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

  const adjustBalance = async (payload: AdjustBalanceInput) => {
    try {
      await adminApi.adjustUserBalance(payload);
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === payload.userId) {
            const current = u.balance ?? u.depositBalance ?? 0;
            const updated =
              payload.type === "ADD"
                ? current + payload.amount
                : Math.max(0, current - payload.amount);
            return {
              ...u,
              depositBalance: updated,
              balance: updated,
            };
          }
          return u;
        })
      );
      toast.success(
        payload.type === "ADD"
          ? `Berhasil menambahkan saldo Rp ${payload.amount.toLocaleString("id-ID")}.`
          : `Berhasil mengurangi saldo Rp ${payload.amount.toLocaleString("id-ID")}.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyesuaikan saldo";
      toast.error(msg);
      throw err;
    }
  };

  const updateUser = async (userId: string, payload: UpdateUserInput) => {
    try {
      await adminApi.updateUser(userId, payload);
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              name: payload.name ?? u.name,
              email: payload.email ?? u.email,
              phone: payload.phoneNumber ?? payload.phone ?? u.phone,
              phoneNumber: payload.phoneNumber ?? payload.phone ?? u.phoneNumber,
              role: payload.role ?? u.role,
              roleName: payload.role ?? u.roleName,
              status: payload.isActive !== undefined ? (payload.isActive ? "ACTIVE" : "SUSPENDED") : u.status,
              isActive: payload.isActive !== undefined ? payload.isActive : u.isActive,
            };
          }
          return u;
        })
      );
      toast.success("Data pengguna berhasil diperbarui.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui data pengguna";
      toast.error(msg);
      throw err;
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = activeSearch.toLowerCase().trim();
      const phone = (u.phoneNumber || u.phone || "").toLowerCase();
      const matchesSearch =
        query === "" ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        phone.includes(query);

      const upperRole = (u.role || u.roleName || "").toUpperCase();
      const matchesRole =
        roleFilter === "ALL" ||
        upperRole === roleFilter ||
        (roleFilter === "SELLER" && upperRole === "USER");

      const isActive = u.status === "ACTIVE" || u.isActive === true;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && isActive) ||
        (statusFilter === "SUSPENDED" && !isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, activeSearch, roleFilter, statusFilter]);

  const total = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const executeSearch = (query: string) => {
    setActiveSearch(query.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setActiveSearch("");
    setPage(1);
  };

  const changeRoleFilter = (role: string) => {
    setRoleFilter(role);
    setPage(1);
  };

  const changeStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const setPageNumber = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    }
  };

  const changePageSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return {
    metrics,
    users,
    filteredUsers,
    paginatedUsers,
    isLoading,
    activeSearch,
    roleFilter,
    statusFilter,
    page,
    pageSize,
    total,
    totalPages,
    executeSearch,
    clearSearch,
    setRoleFilter: changeRoleFilter,
    setStatusFilter: changeStatusFilter,
    setPage: setPageNumber,
    setPageSize: changePageSize,
    nextPage,
    prevPage,
    fetchAdminData,
    adjustBalance,
    updateUser,
  };
}
