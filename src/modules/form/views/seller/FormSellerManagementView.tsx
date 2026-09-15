"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  FileSpreadsheet,
  FileCheck2,
  Calendar,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/context";
import dynamic from "next/dynamic";
import { Form, FormType } from "../../types/form.types";
import { useForms } from "../../hooks/useForms";
import { FormCard } from "../../components/seller/FormCard";
import { SubmissionsDrawer } from "../../components/seller/SubmissionsDrawer";

const FormBuilderModal = dynamic(
  () =>
    import("../../components/seller/FormBuilderModal").then((m) => m.FormBuilderModal),
  { ssr: false },
);
const DeleteFormModal = dynamic(
  () => import("../../components/seller/DeleteFormModal").then((m) => m.DeleteFormModal),
  { ssr: false },
);

export function FormSellerManagementView() {
  const { t } = useI18n();
  const {
    forms,
    isLoading,
    search,
    setSearch,
    type,
    setType,
    page,
    setPage,
    total,
    totalPages,
    fetchForms,
    createForm,
    updateForm,
    deleteForm,
  } = useForms();

  // Modal states
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingForm, setDeletingForm] = useState<Form | null>(null);

  const [isSubmissionsOpen, setIsSubmissionsOpen] = useState(false);
  const [viewingSubmissionsForm, setViewingSubmissionsForm] =
    useState<Form | null>(null);

  // Aggregated Stats from loaded forms
  const stats = useMemo(() => {
    let totalSubmissions = 0;
    let reservationForms = 0;
    let leadForms = 0;
    forms.forEach((f) => {
      totalSubmissions += f.submissionCount;
      if (f.type === "RESERVATION") reservationForms++;
      else if (f.type === "LEAD") leadForms++;
    });

    return {
      totalForms: total,
      totalSubmissions,
      reservationForms,
      leadForms,
    };
  }, [forms, total]);

  const handleCreateNew = () => {
    setEditingForm(null);
    setIsBuilderOpen(true);
  };

  const handleEdit = (form: Form) => {
    setEditingForm(form);
    setIsBuilderOpen(true);
  };

  const handleDelete = (form: Form) => {
    setDeletingForm(form);
    setIsDeleteOpen(true);
  };

  const handleViewSubmissions = (form: Form) => {
    setViewingSubmissionsForm(form);
    setIsSubmissionsOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start justify-between gap-3 sm:block">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {t("form.viewTitle")}
            </h1>
            <p className="mt-1 text-xs text-foreground-muted sm:text-sm">
              {t("form.viewSubtitle")}
            </p>
          </div>

          {/* Mobile-Only Header Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchForms()}
            disabled={isLoading}
            className="size-9 shrink-0 rounded-full border-border/70 text-xs cursor-pointer sm:hidden"
            title="Muat Ulang Data"
            aria-label="Refresh Data"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Desktop-Only Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchForms()}
            disabled={isLoading}
            className="hidden sm:inline-flex h-9 gap-1.5 rounded-full border-border/70 text-xs cursor-pointer"
            title="Muat Ulang Data"
          >
            <RefreshCw
              className={`size-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>

          {/* Primary Action Button */}
          <Button
            variant="primaryPill"
            onClick={handleCreateNew}
            size="sm"
            className="h-10 sm:h-9 gap-2 px-5 text-xs font-bold shadow-xs w-full sm:w-auto cursor-pointer justify-center rounded-full"
          >
            <Plus className="size-4" />
            <span>{t("form.createNewButton")}</span>
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* 1. Total Forms */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-3 sm:p-4 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground-muted leading-snug line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("form.stats.totalForms")}
            </span>
            <div className="flex size-7.5 sm:size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <FileSpreadsheet className="size-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {stats.totalForms}
            </p>
          </div>
        </div>

        {/* 2. Total Submissions */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-3 sm:p-4 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground-muted leading-snug line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("form.stats.totalSubmissions")}
            </span>
            <div className="flex size-7.5 sm:size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <FileCheck2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {stats.totalSubmissions.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 3. Reservation Forms */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-3 sm:p-4 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground-muted leading-snug line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("form.stats.reservationForms")}
            </span>
            <div className="flex size-7.5 sm:size-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
              <Calendar className="size-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {stats.reservationForms}
            </p>
          </div>
        </div>

        {/* 4. Lead Forms */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-3 sm:p-4 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground-muted leading-snug line-clamp-2 min-h-[2.4em] sm:min-h-0">
              {t("form.stats.leadForms")}
            </span>
            <div className="flex size-7.5 sm:size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <UserPlus className="size-4" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <p className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {stats.leadForms}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-xs">
        <div className="w-full lg:w-80">
          <SearchInput
            placeholder={t("form.searchPlaceholder")}
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            onClear={() => {
              setSearch("");
              setPage(1);
            }}
            hideSubmitButton={true}
            className="text-xs h-9 w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full lg:w-auto">
          <div className="overflow-x-auto scrollbar-none -mx-0.5 px-0.5 pb-0.5 w-full sm:w-auto">
            <Tabs
              value={type}
              onValueChange={(val) => {
                setType(val as FormType | "ALL");
                setPage(1);
              }}
              className="w-full sm:w-auto"
            >
              <TabsList className="h-9 w-full sm:w-auto justify-start shrink-0 gap-0.5">
                <TabsTrigger
                  value="ALL"
                  className="text-xs px-3 cursor-pointer shrink-0"
                >
                  {t("common.allTypesFilter")}
                </TabsTrigger>
                <TabsTrigger
                  value="STANDARD"
                  className="text-xs px-3 cursor-pointer shrink-0"
                >
                  {t("form.typeStandard")}
                </TabsTrigger>
                <TabsTrigger
                  value="RESERVATION"
                  className="text-xs px-3 cursor-pointer shrink-0"
                >
                  {t("form.typeReservation")}
                </TabsTrigger>
                <TabsTrigger
                  value="LEAD"
                  className="text-xs px-3 cursor-pointer shrink-0"
                >
                  {t("form.typeLead")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 animate-pulse"
            />
          ))}
        </div>
      ) : forms.length === 0 ? (
        <Card className="border-dashed p-8 sm:p-12 text-center flex flex-col items-center">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {t("form.emptyTitle")}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            {t("form.emptyDescription")}
          </p>
          <Button
            variant="primaryPill"
            onClick={handleCreateNew}
            size="sm"
            className="gap-2 px-5 text-xs font-bold shadow-xs w-full sm:w-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("form.createNewButton")}</span>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {forms.map((f) => (
            <FormCard
              key={f.id}
              form={f}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewSubmissions={handleViewSubmissions}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div>
          <Separator className="my-4" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              {t("common.page")} {page} {t("common.of")} {totalPages} ({total}{" "}
              {t("form.stats.totalForms")})
            </span>
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex-1 sm:flex-none"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                {t("common.prev")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs flex-1 sm:flex-none"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                {t("common.next")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      <FormBuilderModal
        form={editingForm}
        isOpen={isBuilderOpen}
        onClose={() => {
          setIsBuilderOpen(false);
          setEditingForm(null);
        }}
        onSubmitCreate={createForm}
        onSubmitUpdate={updateForm}
      />

      <DeleteFormModal
        form={deletingForm}
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingForm(null);
        }}
        onConfirm={deleteForm}
      />

      <SubmissionsDrawer
        form={viewingSubmissionsForm}
        isOpen={isSubmissionsOpen}
        onClose={() => {
          setIsSubmissionsOpen(false);
          setViewingSubmissionsForm(null);
        }}
      />
    </div>
  );
}

export default FormSellerManagementView;
