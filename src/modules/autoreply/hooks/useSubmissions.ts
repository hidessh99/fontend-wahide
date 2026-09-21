"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import { FlowSubmission } from "../types/submission.types";
import { submissionApi } from "../api/submission.api";

export function useSubmissions() {
  const { t } = useI18n();
  const [submissions, setSubmissions] = useState<FlowSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [flowId, setFlowId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(15);
  const [total, setTotal] = useState<number>(0);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await submissionApi.getSubmissions({
        flow_id: flowId || undefined,
        search: search || undefined,
        page,
        limit,
      });
      setSubmissions(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : t("autoreply.submissions.fetchFailed");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [flowId, search, page, limit, t]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const deleteSubmission = async (id: string): Promise<boolean> => {
    try {
      await submissionApi.deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success(t("autoreply.submissions.deletedSuccess"));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.submissions.deleteFailed");
      toast.error(msg);
      return false;
    }
  };

  const exportToCsv = () => {
    if (submissions.length === 0) {
      toast.error(t("autoreply.submissions.empty"));
      return;
    }

    const headers = ["Waktu", "ID", "Flow", "Pengirim", "No HP", "Status", "Jawaban"];
    const rows = submissions.map((s) => [
      s.created_at,
      s.id,
      s.flow_name || s.flow_id,
      s.sender_name || "-",
      s.sender_phone,
      s.status,
      JSON.stringify(s.answers || {}).replace(/"/g, '""'),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => `"${e.join('","')}"`)].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `leads_submissions_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    submissions,
    total,
    page,
    setPage,
    limit,
    isLoading,
    error,
    flowId,
    setFlowId,
    search,
    setSearch,
    fetchSubmissions,
    deleteSubmission,
    exportToCsv,
  };
}
