"use client";

import { useState, useCallback, useMemo } from "react";
import { SortOrder } from "@/components/ui/data-table-column-header";

export interface UseTableSortOptions<T> {
  initialKey?: keyof T | null;
  initialOrder?: SortOrder;
}

export function useTableSort<T>(options: UseTableSortOptions<T> = {}) {
  const [sortKey, setSortKey] = useState<keyof T | null>(options.initialKey ?? null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(options.initialOrder ?? null);

  const handleSort = useCallback((keyString: string) => {
    const key = keyString as keyof T;
    setSortKey((prevKey) => {
      if (prevKey !== key) {
        setSortOrder("asc");
        return key;
      }
      // Cycle: asc -> desc -> null
      setSortOrder((prevOrder) => {
        if (prevOrder === "asc") return "desc";
        if (prevOrder === "desc") return null;
        return "asc";
      });
      return key;
    });
  }, []);

  const sortData = useCallback(
    (data: T[]): T[] => {
      if (!sortKey || !sortOrder) return data;

      return [...data].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA == null && valB == null) return 0;
        if (valA == null) return sortOrder === "asc" ? 1 : -1;
        if (valB == null) return sortOrder === "asc" ? -1 : 1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        if (typeof valA === "boolean" && typeof valB === "boolean") {
          return sortOrder === "asc" ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
        }

        // Date string or ISO comparison
        const dateA = new Date(String(valA)).getTime();
        const dateB = new Date(String(valB)).getTime();
        if (
          !isNaN(dateA) &&
          !isNaN(dateB) &&
          String(valA).length >= 10 &&
          String(valB).length >= 10
        ) {
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortOrder === "asc" ? -1 : 1;
        if (strA > strB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    },
    [sortKey, sortOrder]
  );

  return useMemo(
    () => ({
      sortKey,
      sortOrder,
      handleSort,
      sortData,
      setSortKey,
      setSortOrder,
    }),
    [sortKey, sortOrder, handleSort, sortData]
  );
}
