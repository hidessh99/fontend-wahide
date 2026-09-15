"use client";

import React, { useState } from "react";
import { useSubscriptionAdminPlans } from "@/modules/subscription/hooks/useSubscriptionAdminPlans";
import dynamic from "next/dynamic";
import {
  AdminPlanItem,
  CreatePlanInput,
  UpdatePlanInput,
} from "@/modules/subscription/types/admin.types";

const PlanFormModal = dynamic(
  () =>
    import("@/modules/subscription/components/admin/PlanFormModal").then(
      (m) => m.PlanFormModal,
    ),
  { ssr: false },
);
const DeletePlanModal = dynamic(
  () =>
    import("@/modules/subscription/components/admin/DeletePlanModal").then(
      (m) => m.DeletePlanModal,
    ),
  { ssr: false },
);
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Layers,
  Paperclip,
  Send,
  Bot,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { useTableSort } from "@/hooks/useTableSort";
import { useI18n } from "@/lib/i18n/context";

export function SubscriptionAdminPlansView() {
  const { t, locale } = useI18n();
  const {
    paginatedPlans,
    isLoading,
    searchQuery,
    page,
    pageSize,
    total,
    totalPages,
    createPlan,
    updatePlan,
    deletePlan,
    executeSearch,
    clearSearch,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    fetchPlans,
  } = useSubscriptionAdminPlans();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] =
    useState<AdminPlanItem | null>(null);
  const [selectedPlanForDelete, setSelectedPlanForDelete] =
    useState<AdminPlanItem | null>(null);

  const { sortKey, sortOrder, handleSort, sortData } =
    useTableSort<AdminPlanItem>({
      initialKey: "price",
      initialOrder: "asc",
    });

  const sortedData = sortData(paginatedPlans);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 sm:size-9">
              <Layers className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("admin.plans.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("admin.plans.subtitle")}
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-wise-green text-dark-green hover:bg-wise-green/90 h-9 cursor-pointer gap-1.5 rounded-full px-5 text-xs font-black shadow-xs"
        >
          <Plus className="size-4" />
          <span>{t("admin.plans.createPlanBtn")}</span>
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="space-y-4">
        <div className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-72">
            <SearchInput
              value={searchQuery}
              onSearch={executeSearch}
              onClear={clearSearch}
              placeholder={t("admin.plans.searchPlaceholder")}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchPlans}
            disabled={isLoading}
            className="border-border hover:bg-muted h-9 shrink-0 gap-1.5 rounded-full text-xs font-bold"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{t("common.refresh")}</span>
          </Button>
        </div>

        <div className="border-border bg-surface overflow-hidden rounded-2xl border shadow-xs">
          <div className="relative w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40 border-border border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-3">
                    <DataTableColumnHeader
                      title={t("admin.plans.colPlanName")}
                      columnKey="name"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </TableHead>
                  <TableHead className="py-3 text-right">
                    <DataTableColumnHeader
                      title={t("admin.plans.colMonthlyPrice")}
                      columnKey="price"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="right"
                    />
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <DataTableColumnHeader
                      title={t("admin.plans.colQuota")}
                      columnKey="monthly_message_limit"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="center"
                    />
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <DataTableColumnHeader
                      title={t("admin.plans.colDevices")}
                      columnKey="max_devices"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="center"
                    />
                  </TableHead>
                  <TableHead className="py-3 text-center">
                    <DataTableColumnHeader
                      title={t("admin.plans.colAgents")}
                      columnKey="max_agents"
                      currentSortKey={sortKey as string}
                      currentSortOrder={sortOrder}
                      onSort={handleSort}
                      align="center"
                    />
                  </TableHead>
                  <TableHead className="text-foreground-secondary py-3 text-xs font-black tracking-wider uppercase">
                    {t("admin.plans.colFeatures")}
                  </TableHead>
                  <TableHead className="text-foreground-secondary py-3 text-right text-xs font-black tracking-wider uppercase">
                    {t("common.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-border divide-y">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="dark:text-wise-green size-6 animate-spin text-emerald-600" />
                        <span className="text-foreground-secondary text-xs font-semibold">
                          {t("admin.plans.loadingPlans")}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="p-8">
                      <EmptyState
                        icon={<Layers className="size-10" />}
                        title={t("admin.plans.emptyTitle")}
                        description={t("admin.plans.emptyDesc")}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedData.map((plan: AdminPlanItem) => (
                    <TableRow
                      key={plan.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="py-3 font-bold text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-black">
                            {plan.name}
                          </span>
                          {plan.has_watermark && (
                            <Badge
                              variant="outline"
                              className="border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400"
                            >
                              Watermark
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-3 text-right font-mono text-xs font-black">
                        Rp{" "}
                        {plan.price.toLocaleString(
                          locale === "en" ? "en-US" : "id-ID",
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-center font-mono text-xs font-bold">
                        {plan.monthly_message_limit.toLocaleString(
                          locale === "en" ? "en-US" : "id-ID",
                        )}
                      </TableCell>

                      <TableCell className="py-3 text-center font-mono text-xs font-bold">
                        {plan.max_devices} {t("admin.plans.slotUnit")}
                      </TableCell>

                      <TableCell className="py-3 text-center font-mono text-xs font-bold">
                        {plan.max_agents} {t("admin.plans.agentUnit")}
                      </TableCell>

                      <TableCell className="py-3">
                        <div className="flex flex-wrap items-center gap-1">
                          {plan.allow_campaign && (
                            <Badge
                              variant="secondary"
                              className="px-1.5 py-0 text-[10px]"
                            >
                              <Send className="mr-0.5 size-2.5" />
                              Blast
                            </Badge>
                          )}
                          {plan.allow_autoreply && (
                            <Badge
                              variant="secondary"
                              className="px-1.5 py-0 text-[10px]"
                            >
                              <Bot className="mr-0.5 size-2.5" />
                              Autoreply
                            </Badge>
                          )}
                          {plan.allow_schedule && (
                            <Badge
                              variant="secondary"
                              className="px-1.5 py-0 text-[10px]"
                            >
                              <Clock className="mr-0.5 size-2.5" />
                              Schedule
                            </Badge>
                          )}
                          {plan.allow_attachment && (
                            <Badge
                              variant="secondary"
                              className="px-1.5 py-0 text-[10px]"
                            >
                              <Paperclip className="mr-0.5 size-2.5" />
                              Media
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedPlanForEdit(plan)}
                            className="hover:bg-muted text-foreground-secondary hover:text-foreground size-8 rounded-full"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedPlanForDelete(plan)}
                            className="text-foreground-muted hover:bg-rose-500/10 hover:text-rose-600 size-8 rounded-full"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {total > 0 && (
            <div className="border-border border-t p-3 sm:p-4">
              <DataTablePagination
                page={page}
                pageSize={pageSize}
                total={total}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                onNextPage={nextPage}
                onPrevPage={prevPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <PlanFormModal
        plan={null}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (data) => {
          await createPlan(data as CreatePlanInput);
        }}
        title={t("admin.plans.createModalTitle")}
      />

      {selectedPlanForEdit && (
        <PlanFormModal
          isOpen={Boolean(selectedPlanForEdit)}
          plan={selectedPlanForEdit}
          onClose={() => setSelectedPlanForEdit(null)}
          onSubmit={async (data) => {
            await updatePlan(selectedPlanForEdit.id, data as UpdatePlanInput);
          }}
          title={t("admin.plans.editModalTitle")}
        />
      )}

      {selectedPlanForDelete && (
        <DeletePlanModal
          isOpen={Boolean(selectedPlanForDelete)}
          planName={selectedPlanForDelete.name}
          onClose={() => setSelectedPlanForDelete(null)}
          onConfirm={async () => {
            await deletePlan(
              selectedPlanForDelete.id,
              selectedPlanForDelete.name,
            );
          }}
        />
      )}
    </div>
  );
}

export default SubscriptionAdminPlansView;
