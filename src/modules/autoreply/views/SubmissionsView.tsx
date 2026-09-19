"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Inbox,
  Bot,
  Workflow,
  FileSpreadsheet,
  Search,
  Download,
  RefreshCw,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useSubmissions } from "../hooks/useSubmissions";
import { useFlows } from "../hooks/useFlows";
import { SubmissionTable } from "../components/SubmissionTable";
import { SubmissionDrawer } from "../components/SubmissionDrawer";
import { FlowSubmission } from "../types/submission.types";

export function SubmissionsView() {
  const { t } = useI18n();
  const { flows } = useFlows();
  const {
    submissions,
    isLoading,
    flowId,
    setFlowId,
    search,
    setSearch,
    fetchSubmissions,
    deleteSubmission,
    exportToCsv,
  } = useSubmissions();

  const [selectedSubmission, setSelectedSubmission] =
    useState<FlowSubmission | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Navigation Tabs */}
      <div className="space-y-4">
        <div>
          <h1 className="text-foreground text-xl sm:text-2xl font-black tracking-tight">
            {t("autoreply.submissions.title")}
          </h1>
          <p className="text-foreground-muted text-xs sm:text-sm mt-1 max-w-2xl">
            {t("autoreply.submissions.subtitle")}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-border flex items-center gap-1.5 sm:gap-2 border-b pb-3 overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-3 px-3 sm:mx-0 sm:px-0">
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
            className="flex items-center gap-2 rounded-xl bg-wise-green px-3.5 py-1.5 text-xs font-bold text-dark-green shadow-sm whitespace-nowrap"
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

      {/* Action Toolbar & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {/* Search by Phone or Name */}
          <div className="border-border bg-surface focus-within:ring-wise-green/30 focus-within:border-wise-green flex flex-1 min-w-[220px] items-center gap-2 rounded-xl border px-3 py-2 text-xs focus-within:ring-2">
            <Search className="size-3.5 text-foreground-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("autoreply.submissions.searchPhone")}
              className="bg-transparent text-foreground placeholder:text-foreground-muted w-full focus:outline-none"
            />
          </div>

          {/* Flow Filter */}
          <select
            value={flowId}
            onChange={(e) => setFlowId(e.target.value)}
            className="border-border bg-surface text-foreground rounded-xl border px-3 py-2 text-xs font-medium focus:outline-none max-w-[200px] truncate"
          >
            <option value="">{t("autoreply.submissions.filterFlow")}</option>
            {flows.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => fetchSubmissions()}
            className="border-border bg-surface text-foreground-secondary hover:bg-muted rounded-xl border p-2 transition-colors cursor-pointer"
            title="Muat ulang data"
          >
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
          </button>
        </div>

        {/* Export CSV Button */}
        <button
          type="button"
          onClick={exportToCsv}
          disabled={submissions.length === 0}
          className="border-border bg-surface hover:bg-muted text-foreground flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap disabled:opacity-50"
        >
          <Download className="size-3.5 text-wise-green" />
          <span>{t("autoreply.submissions.exportCsv")}</span>
        </button>
      </div>

      {/* Submissions Table */}
      <SubmissionTable
        submissions={submissions}
        isLoading={isLoading}
        onViewDetail={setSelectedSubmission}
        onDelete={deleteSubmission}
      />

      {/* Detail Flyout Drawer */}
      <SubmissionDrawer
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onDelete={deleteSubmission}
      />
    </div>
  );
}
