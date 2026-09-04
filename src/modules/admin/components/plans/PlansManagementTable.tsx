"use client";

import React, { useState } from "react";
import { useAdminPlans } from "@/modules/admin/hooks/useAdminPlans";
import { AdminPlanItem, CreatePlanInput, UpdatePlanInput } from "@/modules/admin/types/admin.types";
import { PlanFormModal } from "./PlanFormModal";
import { DeletePlanModal } from "./DeletePlanModal";
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
  Tag,
  Sparkles,
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

export function PlansManagementTable() {
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
  } = useAdminPlans();

  const [searchInput, setSearchInput] = useState("");
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<AdminPlanItem | null>(null);
  const [selectedPlanForDelete, setSelectedPlanForDelete] = useState<AdminPlanItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<AdminPlanItem>({
    initialKey: "price",
    initialOrder: "asc",
  });

  const sortedPlans = sortData(paginatedPlans);

  const handleOpenCreate = () => {
    setSelectedPlanForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (plan: AdminPlanItem) => {
    setSelectedPlanForEdit(plan);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (plan: AdminPlanItem) => {
    setSelectedPlanForDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    clearSearch();
  };

  const handleFormSubmit = async (data: CreatePlanInput) => {
    if (selectedPlanForEdit) {
      await updatePlan(selectedPlanForEdit.id, data as UpdatePlanInput);
    } else {
      await createPlan(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedPlanForDelete) {
      await deletePlan(selectedPlanForDelete.id, selectedPlanForDelete.name);
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Action Toolbar */}
      <div className="border-border bg-surface space-y-3 rounded-xl border p-3.5 shadow-xs sm:p-4">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={() => executeSearch(searchInput.trim())}
            onClear={handleResetSearch}
            placeholder={t("admin.plans.searchPlaceholder")}
          />

          {/* Action Buttons: Add Plan & Refresh */}
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPlans}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold transition"
              aria-label={t("admin.plans.refreshAria")}
            >
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{t("refresh")}</span>
            </Button>

            <Button
              variant="primaryPill"
              size="sm"
              onClick={handleOpenCreate}
              className="h-10 cursor-pointer gap-1.5 px-4 text-xs font-extrabold shadow-sm"
            >
              <Plus className="size-4" />
              <span>{t("admin.plans.addPlanBtn")}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Plans Data Table & Mobile View */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">{t("admin.plans.loadingText")}</span>
          </div>
        ) : paginatedPlans.length === 0 ? (
          <EmptyState
            icon={<Layers />}
            title={t("admin.plans.emptyTitle")}
            description={
              searchQuery
                ? t("admin.plans.emptySearchDesc", { query: searchQuery })
                : t("admin.plans.emptyDesc")
            }
          />
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {sortedPlans.map((p) => {
                const isFree = p.price === 0;

                return (
                  <div key={p.id} className="bg-surface space-y-3 p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-muted text-foreground border-border flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-black">
                          <Layers className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground text-sm font-bold">{p.name}</span>
                            {isFree ? (
                              <Badge variant="info">{t("admin.plans.freeTier")}</Badge>
                            ) : (
                              <Badge variant="success">{t("admin.plans.paidTier")}</Badge>
                            )}
                          </div>
                          <span className="dark:text-wise-green font-mono text-xs font-bold text-emerald-700">
                            Rp {p.price.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
                            <span className="text-foreground-muted text-[10px] font-normal">
                              {" "}
                              {t("admin.plans.perMonth")}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(p)}
                          className="border-border size-8 rounded-full p-0"
                          title={t("admin.plans.editPlanTooltip")}
                        >
                          <Edit2 className="dark:text-wise-green size-3.5 text-emerald-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDelete(p)}
                          className="border-border size-8 rounded-full p-0 text-rose-600 hover:bg-rose-500/10"
                          title={t("admin.plans.deletePlanTooltip")}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Quotas & Limits */}
                    <div className="bg-muted/20 border-border/50 grid grid-cols-3 gap-2 rounded-lg border p-2.5 text-xs">
                      <div>
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          {t("admin.plans.quota")}
                        </span>
                        <span className="text-foreground font-mono font-bold">
                          {p.monthly_message_limit.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          {t("admin.plans.waSlot")}
                        </span>
                        <span className="text-foreground font-mono font-bold">
                          {p.max_devices} {t("admin.plans.deviceUnit")}
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          {t("admin.plans.csAgent")}
                        </span>
                        <span className="text-foreground font-mono font-bold">
                          {p.max_agents} {t("admin.plans.agentUnit")}
                        </span>
                      </div>
                    </div>

                    {/* Capabilities Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.allow_attachment && (
                        <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                          <Paperclip className="size-2.5" />
                          <span>{t("admin.plans.featureAttachment")}</span>
                        </span>
                      )}
                      {p.allow_campaign && (
                        <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                          <Send className="size-2.5" />
                          <span>{t("admin.plans.featureCampaign")}</span>
                        </span>
                      )}
                      {p.allow_autoreply && (
                        <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                          <Bot className="size-2.5" />
                          <span>{t("admin.plans.featureAutoreply")}</span>
                        </span>
                      )}
                      {p.allow_schedule && (
                        <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                          <Clock className="size-2.5" />
                          <span>{t("admin.plans.featureSchedule")}</span>
                        </span>
                      )}
                      {p.has_watermark ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                          <Tag className="size-2.5" />
                          <span>{t("admin.plans.watermarkWith")}</span>
                        </span>
                      ) : (
                        <span className="dark:text-wise-green inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <Sparkles className="size-2.5" />
                          <span>{t("admin.plans.watermarkNo")}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= 1024px) */}
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[20%] px-5 py-3.5">
                      <DataTableColumnHeader
                        title={t("admin.plans.colName")}
                        columnKey="name"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                      />
                    </TableHead>
                    <TableHead className="w-[15%] px-4 py-3.5 text-right">
                      <DataTableColumnHeader
                        title={t("admin.plans.colPrice")}
                        columnKey="price"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="right"
                      />
                    </TableHead>
                    <TableHead className="w-[16%] px-4 py-3.5 text-right">
                      <DataTableColumnHeader
                        title={t("admin.plans.colQuota")}
                        columnKey="monthly_message_limit"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="right"
                      />
                    </TableHead>
                    <TableHead className="w-[12%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title={t("admin.plans.colSlots")}
                        columnKey="max_devices"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[12%] px-3 py-3.5 text-center">
                      <DataTableColumnHeader
                        title={t("admin.plans.colAgents")}
                        columnKey="max_agents"
                        currentSortKey={sortKey as string}
                        currentSortOrder={sortOrder}
                        onSort={handleSort}
                        align="center"
                      />
                    </TableHead>
                    <TableHead className="w-[15%] px-4 py-3.5">
                      <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.plans.colFeatures")}
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%] px-5 py-3.5 text-right">
                      <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                        {t("admin.plans.colActions")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPlans.map((p) => {
                    const isFree = p.price === 0;

                    return (
                      <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                        {/* 1. Nama Paket */}
                        <TableCell className="px-5 py-3.5 align-middle">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-muted text-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-black">
                              <Layers className="size-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-foreground text-sm font-bold">{p.name}</span>
                                {isFree ? (
                                  <Badge variant="info">{t("admin.plans.free")}</Badge>
                                ) : (
                                  <Badge variant="success">{t("admin.plans.pro")}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* 2. Harga / Bulan */}
                        <TableCell className="px-4 py-3.5 text-right align-middle font-mono font-bold">
                          <span className="dark:text-wise-green text-sm text-emerald-700">
                            Rp {p.price.toLocaleString(locale === "en" ? "en-US" : "id-ID")}
                          </span>
                          <span className="text-foreground-muted block text-[10px] font-normal">
                            {t("admin.plans.perMonth")}
                          </span>
                        </TableCell>

                        {/* 3. Batas Kuota Pesan */}
                        <TableCell className="text-foreground px-4 py-3.5 text-right align-middle font-mono font-bold">
                          <span>{p.monthly_message_limit.toLocaleString(locale === "en" ? "en-US" : "id-ID")}</span>
                          <span className="text-foreground-muted block text-[10px] font-normal">
                            {t("admin.plans.messagesPerMonth")}
                          </span>
                        </TableCell>

                        {/* 4. Slot WhatsApp */}
                        <TableCell className="text-foreground px-3 py-3.5 text-center align-middle font-mono font-bold">
                          <span>{p.max_devices} {t("admin.plans.deviceUnit")}</span>
                        </TableCell>

                        {/* 5. Batas CS Agent */}
                        <TableCell className="text-foreground px-3 py-3.5 text-center align-middle font-mono font-bold">
                          <span>{p.max_agents} {t("admin.plans.agentUnit")}</span>
                        </TableCell>

                        {/* 6. Fitur & Kemampuan */}
                        <TableCell className="px-4 py-3.5 align-middle">
                          <div className="flex max-w-70 flex-wrap items-center gap-1">
                            {p.allow_attachment && (
                              <span
                                className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold"
                                title={t("admin.plans.featureAttachmentTooltip")}
                              >
                                <Paperclip className="size-2.5" />
                                <span>{t("admin.plans.featureAttachment")}</span>
                              </span>
                            )}
                            {p.allow_campaign && (
                              <span
                                className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold"
                                title={t("admin.plans.featureCampaignTooltip")}
                              >
                                <Send className="size-2.5" />
                                <span>{t("admin.plans.featureCampaign")}</span>
                              </span>
                            )}
                            {p.allow_autoreply && (
                              <span
                                className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold"
                                title={t("admin.plans.featureAutoreplyTooltip")}
                              >
                                <Bot className="size-2.5" />
                                <span>{t("admin.plans.featureAutoreply")}</span>
                              </span>
                            )}
                            {p.allow_schedule && (
                              <span
                                className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold"
                                title={t("admin.plans.featureScheduleTooltip")}
                              >
                                <Clock className="size-2.5" />
                                <span>{t("admin.plans.featureSchedule")}</span>
                              </span>
                            )}
                            {p.has_watermark ? (
                              <span
                                className="inline-flex items-center gap-0.5 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400"
                                title={t("admin.plans.watermarkWithTooltip")}
                              >
                                <Tag className="size-2.5" />
                                <span>{t("admin.plans.watermarkWith")}</span>
                              </span>
                            ) : (
                              <span
                                className="dark:text-wise-green inline-flex items-center gap-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
                                title={t("admin.plans.watermarkNoTooltip")}
                              >
                                <Sparkles className="size-2.5" />
                                <span>{t("admin.plans.watermarkNoShort")}</span>
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* 7. Aksi */}
                        <TableCell className="px-5 py-3.5 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEdit(p)}
                              className="border-border hover:border-foreground-muted hover:bg-muted h-8 gap-1 rounded-full px-2.5 text-xs font-bold"
                              title={t("admin.plans.editPlanTooltip")}
                            >
                              <Edit2 className="dark:text-wise-green size-3.5 text-emerald-600" />
                              <span>{t("admin.plans.editPlan")}</span>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDelete(p)}
                              className="border-border h-8 gap-1 rounded-full px-2.5 text-xs font-bold text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
                              title={t("admin.plans.deletePlanTooltip")}
                            >
                              <Trash2 className="size-3.5" />
                              <span>{t("admin.plans.deletePlan")}</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Responsive Pagination Footer */}
        {total > 0 && (
          <DataTablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 25, 50]}
            entityName={t("admin.plans.entityName")}
          />
        )}
      </div>

      {/* Add / Edit Plan Modal */}
      <PlanFormModal
        plan={selectedPlanForEdit}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Plan Confirmation Modal */}
      <DeletePlanModal
        plan={selectedPlanForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
