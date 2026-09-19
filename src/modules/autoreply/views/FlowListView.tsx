"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Workflow,
  Bot,
  Inbox,
  FileSpreadsheet,
  Play,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw,
  GitBranch,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useFlows } from "../hooks/useFlows";
import { FlowDefinition } from "../types/flow.types";
import { FlowSimulatorModal } from "../components/FlowSimulatorModal";

export function FlowListView() {
  const { t } = useI18n();
  const {
    flows,
    isLoading,
    search,
    setSearch,
    fetchFlows,
    deleteFlow,
  } = useFlows();

  const [simulatingFlow, setSimulatingFlow] = useState<FlowDefinition | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    await deleteFlow(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8 pb-12">
      {/* Top Header & Navigation Tabs */}
      <div className="space-y-4">
        <div>
          <h1 className="text-foreground text-xl sm:text-2xl font-black tracking-tight">
            {t("autoreply.flows.title")}
          </h1>
          <p className="text-foreground-muted text-xs sm:text-sm mt-1 max-w-2xl">
            {t("autoreply.flows.subtitle")}
          </p>
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
            className="flex items-center gap-2 rounded-xl bg-wise-green px-3.5 py-1.5 text-xs font-bold text-dark-green shadow-sm whitespace-nowrap"
          >
            <Workflow className="size-3.5" />
            <span>{t("autoreply.tabs.flows")}</span>
          </Link>
          <Link
            href="/autoreply/submission"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-2 rounded-xl border border-transparent px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap"
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

      {/* Action Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <div className="border-border bg-surface focus-within:ring-wise-green/30 focus-within:border-wise-green flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-xs focus-within:ring-2">
            <Search className="size-3.5 text-foreground-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("autoreply.flows.searchPlaceholder")}
              className="bg-transparent text-foreground placeholder:text-foreground-muted w-full focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => fetchFlows()}
            className="border-border bg-surface text-foreground-secondary hover:bg-muted rounded-xl border p-2 transition-colors cursor-pointer"
            title="Muat ulang data"
          >
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
          </button>
        </div>

        <Link
          href="/autoreply/flow/new"
          className="bg-wise-green text-dark-green hover:brightness-105 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="size-4" />
          <span>{t("autoreply.flows.createFlow")}</span>
        </Link>
      </div>

      {/* Flow List / Table */}
      {isLoading ? (
        <div className="border-border bg-surface flex min-h-[300px] flex-col items-center justify-center rounded-2xl border p-8">
          <div className="border-wise-green h-8 w-8 animate-spin rounded-full border-3 border-t-transparent" />
          <p className="text-foreground-muted mt-3 text-xs font-medium">
            {t("autoreply.flows.loadingList")}
          </p>
        </div>
      ) : flows.length === 0 ? (
        <div className="border-border bg-surface flex min-h-[350px] flex-col items-center justify-center rounded-2xl border p-8 text-center">
          <div className="rounded-full bg-emerald-500/10 p-3.5 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Workflow className="size-8" />
          </div>
          <h4 className="text-foreground mt-4 text-sm font-bold">
            {t("autoreply.flows.empty")}
          </h4>
          <p className="text-foreground-muted mt-1 max-w-sm text-xs">
            {t("autoreply.flows.flowSubtitle")}
          </p>
          <Link
            href="/autoreply/flow/new"
            className="bg-wise-green text-dark-green hover:brightness-105 mt-5 flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{t("autoreply.flows.createFlow")}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flows.map((flow) => {
            const nodeCount = flow.canvas_graph?.nodes?.length || 0;
            const edgeCount = flow.canvas_graph?.edges?.length || 0;

            return (
              <div
                key={flow.id}
                className="border-border bg-surface hover:border-wise-green/50 flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="rounded-xl bg-wise-green/10 p-2 text-wise-green">
                        <Workflow className="size-4" />
                      </div>
                      <div>
                        <h3 className="text-foreground text-sm font-bold group-hover:text-wise-green transition-colors">
                          {flow.name}
                        </h3>
                        <span className="text-foreground-muted text-[10px] font-mono">
                          {flow.id.slice(0, 10)}...
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                      {flow.trigger_type}
                    </span>
                  </div>

                  <p className="text-foreground-muted line-clamp-2 text-xs">
                    {flow.description || "Alur percakapan visual interaktif."}
                  </p>

                  {/* Trigger Keywords */}
                  {flow.trigger_keywords && flow.trigger_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {flow.trigger_keywords.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          className="bg-muted text-foreground-secondary rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                      {flow.trigger_keywords.length > 3 && (
                        <span className="text-foreground-muted text-[10px] self-center">
                          +{flow.trigger_keywords.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Graph Stats */}
                  <div className="border-border flex items-center gap-3 border-t pt-3 text-[11px] text-foreground-muted font-medium">
                    <div className="flex items-center gap-1">
                      <GitBranch className="size-3 text-wise-green" />
                      <span>{nodeCount} Node</span>
                    </div>
                    <span>•</span>
                    <div>{edgeCount} Konektor</div>
                    <span>•</span>
                    <div>{flow.execution_count} Eksekusi</div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-border flex items-center justify-between border-t pt-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setSimulatingFlow(flow)}
                    className="text-foreground-secondary hover:text-wise-green flex items-center gap-1 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Play className="size-3.5" />
                    <span>{t("autoreply.flows.testFlow")}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/autoreply/flow/${flow.id}`}
                      className="text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors cursor-pointer"
                      title="Edit Canvas"
                    >
                      <Edit2 className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(flow.id)}
                      className="text-foreground-muted hover:text-destructive hover:bg-destructive/10 rounded-lg p-1.5 transition-colors cursor-pointer"
                      title="Hapus Flow"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Simulator Modal */}
      {simulatingFlow && (
        <FlowSimulatorModal
          isOpen={!!simulatingFlow}
          onClose={() => setSimulatingFlow(null)}
          flow={simulatingFlow}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface border-border max-w-sm w-full rounded-2xl border p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2.5 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h4 className="text-foreground text-sm font-bold">
                  {t("autoreply.flows.deleteConfirmTitle")}
                </h4>
                <p className="text-foreground-muted text-xs mt-0.5">
                  {t("autoreply.flows.deleteConfirmDesc")}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="border-border text-foreground-secondary hover:bg-muted rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-destructive text-white hover:bg-destructive/90 rounded-xl px-4 py-1.5 text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isDeleting ? t("common.deleting") : t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
