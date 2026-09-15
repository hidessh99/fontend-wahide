"use client";

import React, { useState } from "react";
import {
  Inbox,
  Search,
  MessageCircle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/lib/i18n/context";
import { normalizePhoneNumber } from "@/lib/phone";
import { Form, FormSubmission, SubmissionStatus } from "../../types/form.types";
import { useFormSubmissions } from "../../hooks/useFormSubmissions";

interface SubmissionsDrawerProps {
  form: Form | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadge = (status: SubmissionStatus) => {
  switch (status) {
    case "PROCESSED":
      return {
        label: "Diproses",
        variant: "success" as const,
      };
    case "ARCHIVED":
      return {
        label: "Diarsipkan",
        variant: "secondary" as const,
      };
    default:
      return {
        label: "Menunggu (Pending)",
        variant: "warning" as const,
      };
  }
};

export function SubmissionsDrawer({
  form,
  isOpen,
  onClose,
}: SubmissionsDrawerProps) {
  const { t } = useI18n();
  const {
    submissions,
    isLoading,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    total,
    totalPages,
    updateStatus,
    deleteSubmission,
  } = useFormSubmissions(form?.id || null);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!form) return null;

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCleanPhone = (raw: string) => {
    return normalizePhoneNumber(raw);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border/70 bg-surface flex max-h-[92dvh] w-[96vw] sm:max-w-4xl lg:max-w-5xl flex-col gap-0 overflow-hidden rounded-3xl p-0 shadow-2xl">
        <DialogHeader className="border-border/70 flex shrink-0 flex-col gap-4 border-b p-5 text-left sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                  {t("form.submissionsTitle")}
                </DialogTitle>
                <p className="text-xs text-foreground-muted line-clamp-1">
                  {form.title} ({total} respons terkumpul)
                </p>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-foreground-muted" />
              <Input
                placeholder={t("form.searchSubmissions")}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 text-xs h-9 rounded-xl border-border/70"
              />
            </div>

            <Tabs
              value={status}
              onValueChange={(val) => {
                setStatus(val as SubmissionStatus | "ALL");
                setPage(1);
              }}
            >
              <TabsList className="h-9 p-1 rounded-xl bg-muted/60 border border-border/70">
                <TabsTrigger value="ALL" className="text-xs px-3 rounded-lg">
                  {t("form.statusAll")}
                </TabsTrigger>
                <TabsTrigger
                  value="PENDING"
                  className="text-xs px-3 rounded-lg"
                >
                  {t("form.statusPending")}
                </TabsTrigger>
                <TabsTrigger
                  value="PROCESSED"
                  className="text-xs px-3 rounded-lg"
                >
                  {t("form.statusProcessed")}
                </TabsTrigger>
                <TabsTrigger
                  value="ARCHIVED"
                  className="text-xs px-3 rounded-lg"
                >
                  {t("form.statusArchived")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        {/* Submissions List Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              {t("form.loadingSubmissions")}
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-14 text-center">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {t("form.noSubmissionsFound")}
              </p>
            </div>
          ) : (
            submissions.map((sub: FormSubmission) => {
              const isExpanded = expandedId === sub.id;
              const badge = getStatusBadge(sub.status);
              const waLink = `https://wa.me/${getCleanPhone(sub.respondentPhone)}`;
              const formattedDate = new Date(sub.createdAt).toLocaleString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-border/90 hover:shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {sub.respondentName}
                        </span>
                        <Badge
                          variant={badge.variant}
                          className="text-[10px] py-0 px-2 font-medium"
                        >
                          {badge.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted mt-1">
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {sub.respondentPhone}
                        </a>
                        <span className="flex items-center gap-1 text-foreground-muted/70 text-[11px]">
                          <Clock className="w-3 h-3" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* Status Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-xl text-xs font-medium border border-border/70 bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 cursor-pointer">
                          {t("reservation.changeStatus")}{" "}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => updateStatus(sub.id, "PENDING")}
                          >
                            {t("form.markPending")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus(sub.id, "PROCESSED")}
                          >
                            {t("form.markProcessed")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateStatus(sub.id, "ARCHIVED")}
                          >
                            {t("form.markArchived")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Detail Expand Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 rounded-xl text-xs gap-1 cursor-pointer"
                        onClick={() => toggleExpand(sub.id)}
                      >
                        {isExpanded ? (
                          <>
                            {t("form.btnClose")}{" "}
                            <ChevronUp className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            {t("form.btnResponses")}{" "}
                            <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        onClick={() => deleteSubmission(sub.id)}
                        title={t("form.deleteSubmissionTooltip")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Detail View */}
                  {isExpanded && (
                    <div className="mt-3.5 bg-muted/30 rounded-xl p-3.5 border border-border/60">
                      <Separator className="mb-2.5" />
                      <h5 className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider mb-2">
                        {t("form.responsesTitle")}
                      </h5>
                      {Object.keys(sub.responses).length === 0 ? (
                        <p className="text-xs text-foreground-muted italic">
                          {t("form.noExtraResponses")}
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {Object.entries(sub.responses).map(([key, value]) => {
                            // Find human-friendly label from form fields if available
                            const matchedField = form.fields.find(
                              (f: { name: string; label: string }) => f.name === key,
                            );
                            const label = matchedField
                              ? matchedField.label
                              : key;

                            return (
                              <div
                                key={key}
                                className="bg-card p-2.5 rounded-lg border border-border/60"
                              >
                                <span className="font-semibold text-foreground-muted block mb-0.5">
                                  {label}
                                </span>
                                <span className="text-foreground font-mono text-[11px] break-all">
                                  {value !== null && value !== undefined
                                    ? String(value)
                                    : "-"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="border-border/70 bg-muted/20 flex shrink-0 items-center justify-between border-t p-4 sm:px-6 text-xs">
            <span className="text-foreground-muted">
              {t("common.page")} {page} {t("common.of")} {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl border-border/70 text-xs px-3 cursor-pointer"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                {t("common.prev")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-xl border-border/70 text-xs px-3 cursor-pointer"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                {t("common.next")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
