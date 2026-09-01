"use client";

import React from "react";
import { useAdmin } from "@/services/admin/hooks/useAdmin";
import { UsersTable } from "@/services/admin/components/UsersTable";
import { useI18n } from "@/lib/i18n/context";
import { Users } from "lucide-react";

export function AdminUsersView() {
  const { t } = useI18n();
  const {
    paginatedUsers,
    isLoading,
    activeSearch,
    planFilter,
    page,
    pageSize,
    total,
    totalPages,
    executeSearch,
    clearSearch,
    setPlanFilter,
    nextPage,
    prevPage,
    fetchAdminData,
    adjustBalance,
  } = useAdmin();

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Users className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {t("admin.usersTitle")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("admin.usersSubtitle")}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        users={paginatedUsers}
        isLoading={isLoading}
        activeSearch={activeSearch}
        onSearch={executeSearch}
        onClearSearch={clearSearch}
        planFilter={planFilter}
        onPlanFilterChange={setPlanFilter}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onRefresh={fetchAdminData}
        onAdjustBalance={adjustBalance}
      />
    </div>
  );
}
