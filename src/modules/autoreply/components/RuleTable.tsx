"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Bot, AlertTriangle, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { AutoreplyRule } from "../types/autoreply.types";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty";
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

interface RuleTableProps {
  rules: AutoreplyRule[];
  isLoading: boolean;
  onEdit: (rule: AutoreplyRule) => void;
  onDelete: (id: string) => Promise<boolean>;
  onToggle: (id: string, currentActive: boolean) => Promise<boolean>;
  onCreateNew: () => void;
}

export function RuleTable({
  rules,
  isLoading,
  onEdit,
  onDelete,
  onToggle,
  onCreateNew,
}: RuleTableProps) {
  const { t } = useI18n();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteId || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="border-border bg-surface flex min-h-[260px] sm:min-h-[300px] flex-col items-center justify-center rounded-2xl border p-6 sm:p-8 shadow-xs">
        <div className="border-wise-green h-8 w-8 animate-spin rounded-full border-3 border-t-transparent" />
        <p className="text-foreground-muted mt-3 text-xs font-medium">
          {t("autoreply.rules.loading")}
        </p>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <Card className="border-border bg-surface rounded-2xl border p-2 shadow-xs">
        <EmptyState
          icon={<Bot className="size-9 text-wise-green" />}
          title={t("autoreply.rules.empty")}
          description={t("autoreply.subtitle")}
          action={
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={onCreateNew}
              className="text-xs font-bold"
            >
              {t("autoreply.rules.addRule")}
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <>
      {/* 1. Desktop Mode: High-Density Table with shadcn Primitives */}
      <Card className="hidden md:block border-border bg-surface overflow-hidden rounded-2xl border p-0 gap-0 shadow-xs">
        <div className="overflow-x-auto">
          <Table className="w-full text-left text-xs">
            <TableHeader className="border-border bg-muted/40 text-foreground-muted border-b uppercase text-[10px] font-bold tracking-wider">
              <TableRow className="hover:bg-transparent">
                <TableHead className="px-5 py-3.5 font-bold">
                  {t("autoreply.rules.table.name")}
                </TableHead>
                <TableHead className="px-4 py-3.5 font-bold">
                  {t("autoreply.rules.table.channel")}
                </TableHead>
                <TableHead className="px-4 py-3.5 font-bold">
                  {t("autoreply.rules.table.keywords")}
                </TableHead>
                <TableHead className="px-4 py-3.5 font-bold">
                  {t("autoreply.rules.table.logic")}
                </TableHead>
                <TableHead className="px-4 py-3.5 font-bold">
                  {t("autoreply.rules.table.replyType")}
                </TableHead>
                <TableHead className="px-4 py-3.5 font-bold">
                  {t("autoreply.rules.table.priority")}
                </TableHead>
                <TableHead className="px-4 py-3.5 text-center font-bold">
                  {t("autoreply.rules.table.status")}
                </TableHead>
                <TableHead className="px-5 py-3.5 text-right font-bold">
                  {t("autoreply.rules.table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-border divide-y">
              {rules.map((rule) => {
                return (
                  <TableRow
                    key={rule.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Name */}
                    <TableCell className="px-5 py-3.5 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px]">
                          {rule.name}
                        </span>
                      </div>
                      <span className="text-foreground-muted text-[10px] font-mono">
                        {rule.id.slice(0, 10)}...
                      </span>
                    </TableCell>

                    {/* Channel */}
                    <TableCell className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                          rule.channel_type === "whatsapp" &&
                            "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
                          rule.channel_type === "telegram" &&
                            "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
                          rule.channel_type === "waba" &&
                            "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
                        )}
                      >
                        {rule.channel_type}
                      </span>
                    </TableCell>

                    {/* Keywords */}
                    <TableCell className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[260px]">
                        {rule.keywords?.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className="bg-muted text-foreground-secondary rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                        {(rule.keywords?.length || 0) > 3 && (
                          <span className="text-foreground-muted text-[10px] self-center">
                            +{rule.keywords.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Match Logic */}
                    <TableCell className="px-4 py-3.5 whitespace-nowrap">
                      <span className="rounded-md bg-[#eef2eb] px-1.5 py-0.5 text-[10px] font-bold text-foreground-muted dark:bg-[#212320]">
                        {rule.match_logic}
                      </span>
                    </TableCell>

                    {/* Reply Type & Preview */}
                    <TableCell className="px-4 py-3.5 max-w-[240px]">
                      <span className="text-[10px] font-bold text-wise-green block">
                        {rule.reply_type}
                      </span>
                      <p className="text-foreground-muted truncate text-[11px]">
                        {rule.reply_type === "TEXT" && (rule.reply_text || "-")}
                        {rule.reply_type === "MEDIA" &&
                          (rule.media_url || "-")}
                        {rule.reply_type === "FLOW_TRIGGER" &&
                          `Flow: ${rule.flow_id}`}
                      </p>
                    </TableCell>

                    {/* Priority */}
                    <TableCell className="px-4 py-3.5 whitespace-nowrap font-mono text-foreground-muted">
                      {rule.priority}
                    </TableCell>

                    {/* Status Toggle */}
                    <TableCell className="px-4 py-3.5 text-center whitespace-nowrap">
                      <div className="flex justify-center">
                        <Switch
                          checked={rule.is_active}
                          onCheckedChange={() =>
                            onToggle(rule.id, rule.is_active)
                          }
                          aria-label={
                            rule.is_active
                              ? "Nonaktifkan aturan"
                              : "Aktifkan aturan"
                          }
                        />
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => onEdit(rule)}
                          className="text-foreground-muted hover:text-foreground rounded-lg"
                          title="Edit Aturan"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setDeleteId(rule.id)}
                          className="text-foreground-muted hover:text-destructive rounded-lg"
                          title="Hapus Aturan"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* 2. Mobile Mode: Adaptive Rule Cards Stack (visible on mobile, hidden on md+) */}
      <div className="md:hidden space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="border-border bg-surface rounded-2xl border p-3.5 sm:p-4 shadow-xs space-y-3"
          >
            {/* Card Header: Rule Name & Channel Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-foreground truncate">
                  {rule.name}
                </h4>
                <span className="text-foreground-muted text-[10px] font-mono">
                  ID: {rule.id.slice(0, 10)}...
                </span>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase shrink-0",
                  rule.channel_type === "whatsapp" &&
                    "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
                  rule.channel_type === "telegram" &&
                    "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
                  rule.channel_type === "waba" &&
                    "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400",
                )}
              >
                {rule.channel_type}
              </span>
            </div>

            {/* Trigger Details: Keywords & Logic */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground-muted">
                  {rule.match_logic}
                </span>
                <span className="text-foreground-muted text-[10px] font-mono">
                  Prioritas: {rule.priority}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {rule.keywords?.slice(0, 4).map((kw) => (
                  <span
                    key={kw}
                    className="bg-muted text-foreground-secondary rounded-md px-2 py-0.5 text-[11px] font-medium"
                  >
                    {kw}
                  </span>
                ))}
                {(rule.keywords?.length || 0) > 4 && (
                  <span className="text-foreground-muted text-[10px] self-center">
                    +{rule.keywords.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Reply Preview Bubble */}
            <div className="bg-muted/40 rounded-xl p-2.5 text-xs space-y-1">
              <span className="text-[10px] font-bold text-wise-green block uppercase tracking-wider">
                {rule.reply_type}
              </span>
              <p className="text-foreground-secondary line-clamp-2 text-xs leading-relaxed">
                {rule.reply_type === "TEXT" && (rule.reply_text || "-")}
                {rule.reply_type === "MEDIA" && (rule.media_url || "-")}
                {rule.reply_type === "FLOW_TRIGGER" && `Flow: ${rule.flow_id}`}
              </p>
            </div>

            {/* Footer: Accessible Toggle Switch & Action Buttons */}
            <div className="flex items-center justify-between border-t border-border/80 pt-2.5">
              {/* Status Toggle Switch with Label */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={rule.is_active}
                  onCheckedChange={() => onToggle(rule.id, rule.is_active)}
                  aria-label={
                    rule.is_active ? "Nonaktifkan aturan" : "Aktifkan aturan"
                  }
                />
                <span
                  className={cn(
                    "text-xs font-bold",
                    rule.is_active
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-foreground-muted",
                  )}
                >
                  {rule.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  onClick={() => onEdit(rule)}
                  className="rounded-xl border-border bg-surface text-foreground-secondary hover:text-foreground"
                  title="Edit Aturan"
                >
                  <Edit2 className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  onClick={() => setDeleteId(rule.id)}
                  className="rounded-xl border-border bg-surface text-foreground-secondary hover:text-destructive hover:bg-destructive/10"
                  title="Hapus Aturan"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Alert Dialog (Standardized shadcn) */}
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
                  {t("autoreply.rules.deleteConfirmTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-foreground-muted text-xs mt-0.5">
                  {t("autoreply.rules.deleteConfirmDesc")}
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
    </>
  );
}
