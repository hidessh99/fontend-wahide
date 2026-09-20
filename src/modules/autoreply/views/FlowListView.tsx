"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { useFlows } from "../hooks/useFlows";
import { FlowDefinition } from "../types/flow.types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const FlowSimulatorModal = dynamic(
  () =>
    import("../components/FlowSimulatorModal").then(
      (m) => m.FlowSimulatorModal,
    ),
  { ssr: false },
);

export function FlowListView() {
  const { t } = useI18n();
  const { flows, isLoading, search, setSearch, fetchFlows, deleteFlow } =
    useFlows();

  const [simulatingFlow, setSimulatingFlow] = useState<FlowDefinition | null>(
    null,
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteFlow(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
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
            className="flex items-center gap-2 rounded-xl bg-wise-green px-3.5 py-1.5 text-xs font-bold text-dark-green shadow-xs whitespace-nowrap"
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
          <div className="border-border bg-surface focus-within:ring-wise-green/30 focus-within:border-wise-green flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-xs focus-within:ring-2 shadow-2xs">
            <Search className="size-3.5 text-foreground-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("autoreply.flows.searchPlaceholder")}
              className="bg-transparent text-foreground placeholder:text-foreground-muted w-full focus:outline-none"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => fetchFlows()}
            className="rounded-xl border-border bg-surface text-foreground-secondary hover:text-foreground"
            title="Muat ulang data"
          >
            <RefreshCw
              className={cn("size-3.5", isLoading && "animate-spin")}
            />
          </Button>
        </div>

        <Link
          href="/autoreply/flow/new"
          className={cn(
            buttonVariants({ variant: "primaryPill", size: "sm" }),
            "gap-2 px-5 text-xs font-bold shadow-xs whitespace-nowrap",
          )}
        >
          <Plus className="size-4" />
          <span>{t("autoreply.flows.createFlow")}</span>
        </Link>
      </div>

      {/* Flow List / Table */}
      {isLoading ? (
        <Card className="border-border bg-surface flex min-h-[300px] flex-col items-center justify-center rounded-2xl border p-8 shadow-xs">
          <div className="border-wise-green h-8 w-8 animate-spin rounded-full border-3 border-t-transparent" />
          <p className="text-foreground-muted mt-3 text-xs font-medium">
            {t("autoreply.flows.loadingList")}
          </p>
        </Card>
      ) : flows.length === 0 ? (
        <Card className="border-border bg-surface flex min-h-[350px] flex-col items-center justify-center rounded-2xl border p-8 text-center shadow-xs">
          <div className="rounded-full bg-emerald-500/10 p-3.5 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Workflow className="size-8" />
          </div>
          <h4 className="text-foreground mt-4 text-sm font-bold">
            {t("autoreply.flows.empty")}
          </h4>
          <p className="text-foreground-muted mt-1 max-w-md text-xs">
            {t("autoreply.flows.emptyDesc")}
          </p>
          <Link
            href="/autoreply/flow/new"
            className={cn(
              buttonVariants({ variant: "primaryPill", size: "sm" }),
              "mt-5 text-xs font-bold",
            )}
          >
            <Plus className="size-4 mr-1.5" />
            <span>{t("autoreply.flows.createFlow")}</span>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flows.map((flow) => {
            const nodeCount = flow.canvas_graph?.nodes?.length || 0;
            const edgeCount = flow.canvas_graph?.edges?.length || 0;

            return (
              <Card
                key={flow.id}
                className="border-border bg-surface hover:border-wise-green/50 flex flex-col justify-between rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md dark:bg-[#151714]"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="rounded-xl bg-wise-green/10 p-2 text-dark-green dark:text-wise-green shrink-0">
                        <Workflow className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-foreground text-sm font-bold truncate">
                          {flow.name}
                        </h4>
                        <span className="text-foreground-muted text-[10px] font-mono block">
                          {flow.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase shrink-0",
                        flow.is_active
                          ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                          : "bg-muted text-foreground-muted",
                      )}
                    >
                      {flow.is_active ? "Aktif" : "Draft"}
                    </span>
                  </div>

                  <p className="text-foreground-secondary line-clamp-2 text-xs leading-relaxed min-h-[2.5em]">
                    {flow.description ||
                      "Tidak ada deskripsi pada alur flow ini."}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-foreground-muted pt-1">
                    <div className="flex items-center gap-1">
                      <GitBranch className="size-3 text-wise-green" />
                      <span>{nodeCount} Nodes</span>
                    </div>
                    <span>•</span>
                    <div>{edgeCount} Koneksi</div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="border-border flex items-center justify-between border-t pt-3.5 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => setSimulatingFlow(flow)}
                    className="gap-1.5 rounded-full text-xs font-bold"
                  >
                    <Play className="size-3 fill-current text-wise-green" />
                    <span>{t("autoreply.flows.simulate")}</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/autoreply/flow/${flow.id}`}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon-xs" }),
                        "text-foreground-muted hover:text-foreground rounded-lg",
                      )}
                      title="Edit Flow"
                    >
                      <Edit2 className="size-3.5" />
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setDeleteId(flow.id)}
                      className="text-foreground-muted hover:text-destructive rounded-lg"
                      title="Hapus Flow"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Simulator Modal (Lazy Loaded) */}
      {simulatingFlow && (
        <FlowSimulatorModal
          isOpen={Boolean(simulatingFlow)}
          onClose={() => setSimulatingFlow(null)}
          flow={simulatingFlow}
        />
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="max-w-sm rounded-2xl p-6">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-destructive/10 p-2.5 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
              <div className="text-left">
                <AlertDialogTitle className="text-foreground text-sm font-bold">
                  {t("autoreply.flows.deleteConfirmTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-foreground-muted text-xs mt-0.5">
                  {t("autoreply.flows.deleteConfirmDesc")}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex items-center justify-end gap-2 pt-2 sm:justify-end">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-xl text-xs font-bold"
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90 rounded-xl text-xs font-bold"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1" />
                  <span>{t("common.deleting")}</span>
                </>
              ) : (
                t("common.delete")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
