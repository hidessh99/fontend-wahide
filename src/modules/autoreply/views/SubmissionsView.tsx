"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Inbox,
  Search,
  Bot,
  Workflow,
  FileSpreadsheet,
  Download,
  RefreshCw,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useSubmissions } from "../hooks/useSubmissions";
import { useFlows } from "../hooks/useFlows";
import { SubmissionTable } from "../components/SubmissionTable";
import { SubmissionFormList } from "../components/SubmissionFormList";
import {
  FlowSubmission,
  LinearSubmissionFormInput,
} from "../types/submission.types";
import { FlowDefinition } from "../types/flow.types";
import { decompileFlowToLinearForm } from "../utils/formCompiler";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

const CreateSubmissionModal = dynamic(
  () =>
    import("../components/CreateSubmissionModal").then(
      (m) => m.CreateSubmissionModal,
    ),
  { ssr: false },
);

const SubmissionDrawer = dynamic(
  () =>
    import("../components/SubmissionDrawer").then((m) => m.SubmissionDrawer),
  { ssr: false },
);

export function SubmissionsView() {
  const { t } = useI18n();
  const {
    flows,
    isLoading: isFlowsLoading,
    fetchFlows,
    deleteFlow,
  } = useFlows();
  const {
    submissions,
    total,
    isLoading: isSubmissionsLoading,
    flowId,
    setFlowId,
    search,
    setSearch,
    fetchSubmissions,
    deleteSubmission,
    exportToCsv,
  } = useSubmissions();

  const [activeSubTab, setActiveSubTab] = useState<"forms" | "responses">(
    "forms",
  );
  const [selectedSubmission, setSelectedSubmission] =
    useState<FlowSubmission | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingForm, setEditingForm] =
    useState<LinearSubmissionFormInput | null>(null);

  const handleCreateNew = () => {
    setEditingForm(null);
    setIsCreateModalOpen(true);
  };

  const handleEditForm = (form: FlowDefinition) => {
    const decompiled = decompileFlowToLinearForm(form);
    if (decompiled) {
      setEditingForm(decompiled);
      setIsCreateModalOpen(true);
    } else {
      toast.info(
        "Formulir ini memiliki percabangan kondisional kompleks. Silakan edit lewat Visual Flow Builder.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8 pb-12">
      {/* Top Header & Navigation Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground text-xl sm:text-2xl font-black tracking-tight">
              {t("autoreply.submissions.title")}
            </h1>
            <p className="text-foreground-muted text-xs sm:text-sm mt-1 max-w-2xl">
              {t("autoreply.submissions.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={handleCreateNew}
              className="gap-2 px-5 text-xs font-bold shadow-xs whitespace-nowrap"
            >
              <FileText className="size-4" />
              <span>{t("autoreply.submissions.createFormBtn")}</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-border flex items-center gap-1.5 sm:gap-2 border-b pb-3 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <Link
            href="/autoreply"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
          >
            <Bot className="size-3.5" />
            <span>{t("autoreply.tabs.rules")}</span>
          </Link>
          <Link
            href="/autoreply/flow"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
          >
            <Workflow className="size-3.5" />
            <span>{t("autoreply.tabs.flows")}</span>
          </Link>
          <Link
            href="/autoreply/submission"
            className="flex items-center gap-2 rounded-xl bg-wise-green px-3.5 py-1.5 text-xs font-bold text-dark-green shadow-xs whitespace-nowrap"
          >
            <Inbox className="size-3.5" />
            <span>{t("autoreply.tabs.submissions")}</span>
          </Link>
          <Link
            href="/autoreply/spreadsheet"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
          >
            <FileSpreadsheet className="size-3.5" />
            <span>{t("autoreply.tabs.spreadsheet")}</span>
          </Link>
        </div>
      </div>

      {/* Sub-tabs: Daftar Formulir vs Data Masuk */}
      <div className="border-border bg-muted/40 p-1 flex items-center gap-1 rounded-2xl border w-fit">
        <Button
          type="button"
          variant={activeSubTab === "forms" ? "primaryPill" : "ghost"}
          size="sm"
          onClick={() => setActiveSubTab("forms")}
          className="text-xs font-bold h-8"
        >
          {t("autoreply.submissions.subtabs.forms")} ({flows.length})
        </Button>
        <Button
          type="button"
          variant={activeSubTab === "responses" ? "primaryPill" : "ghost"}
          size="sm"
          onClick={() => setActiveSubTab("responses")}
          className="text-xs font-bold h-8"
        >
          {t("autoreply.submissions.subtabs.responses")} ({total})
        </Button>
      </div>

      {/* Sub-tab Content */}
      {activeSubTab === "forms" ? (
        <SubmissionFormList
          forms={flows}
          isLoading={isFlowsLoading}
          onEditForm={handleEditForm}
          onDeleteForm={deleteFlow}
          onViewResponses={(id) => {
            setFlowId(id);
            setActiveSubTab("responses");
          }}
          onCreateNew={handleCreateNew}
        />
      ) : (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <div className="border-border bg-surface focus-within:ring-wise-green/30 focus-within:border-wise-green flex flex-1 min-w-[200px] items-center gap-2 rounded-xl border px-3 py-2 text-xs focus-within:ring-2 shadow-2xs">
                <Search className="size-3.5 text-foreground-muted shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("autoreply.submissions.searchPhone")}
                  className="bg-transparent text-foreground placeholder:text-foreground-muted w-full focus:outline-none"
                />
              </div>

              {/* Flow Filter */}
              <NativeSelect
                value={flowId}
                onChange={(e) => setFlowId(e.target.value)}
                variant="rounded"
                className="max-w-[200px]"
              >
                <NativeSelectOption value="">
                  {t("autoreply.submissions.filterFlow")}
                </NativeSelectOption>
                {flows.map((f) => (
                  <NativeSelectOption key={f.id} value={f.id}>
                    {f.name}
                  </NativeSelectOption>
                ))}
              </NativeSelect>

              {/* Refresh */}
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => fetchSubmissions()}
                className="rounded-xl border-border bg-surface text-foreground-secondary hover:text-foreground"
                title="Muat ulang data"
              >
                <RefreshCw
                  className={cn(
                    "size-3.5",
                    isSubmissionsLoading && "animate-spin",
                  )}
                />
              </Button>
            </div>

            {/* Export CSV Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              disabled={submissions.length === 0}
              className="gap-2 rounded-xl text-xs font-bold"
            >
              <Download className="size-3.5 text-wise-green" />
              <span>{t("autoreply.submissions.exportCsv")}</span>
            </Button>
          </div>

          {/* Submissions Table */}
          <SubmissionTable
            submissions={submissions}
            isLoading={isSubmissionsLoading}
            onViewDetail={setSelectedSubmission}
            onDelete={deleteSubmission}
          />
        </div>
      )}

      {/* Detail Flyout Drawer (Lazy Loaded) */}
      <SubmissionDrawer
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onDelete={deleteSubmission}
      />

      {/* Modal Linear Form Builder (Lazy Loaded) */}
      <CreateSubmissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialData={editingForm}
        onSuccess={() => {
          fetchFlows();
          fetchSubmissions();
        }}
      />
    </div>
  );
}
