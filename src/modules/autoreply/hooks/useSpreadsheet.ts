"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n/context";
import {
  SpreadsheetConfig,
  SaveSpreadsheetInput,
  SpreadsheetPreviewResult,
  TestSpreadsheetMatchResult,
} from "../types/spreadsheet.types";
import { spreadsheetApi } from "../api/spreadsheet.api";

export function useSpreadsheet(deviceId?: string) {
  const { t } = useI18n();
  const [config, setConfig] = useState<SpreadsheetConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const [previewResult, setPreviewResult] =
    useState<SpreadsheetPreviewResult | null>(null);
  const [testResult, setTestResult] =
    useState<TestSpreadsheetMatchResult | null>(null);

  const fetchConfig = useCallback(async (devId: string) => {
    if (!devId) return;
    setIsLoading(true);
    try {
      const data = await spreadsheetApi.getConfigByDevice(devId);
      setConfig(data);
    } catch {
      setConfig(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (deviceId) {
      fetchConfig(deviceId);
    }
  }, [deviceId, fetchConfig]);

  const saveConfig = async (input: SaveSpreadsheetInput): Promise<boolean> => {
    setIsSaving(true);
    try {
      const saved = await spreadsheetApi.saveConfig(input);
      setConfig(saved);
      toast.success(t("autoreply.spreadsheet.saveSuccess"));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.spreadsheet.saveFailed");
      toast.error(msg);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const previewSheet = async (
    sheetUrl: string,
  ): Promise<SpreadsheetPreviewResult | null> => {
    setIsPreviewing(true);
    try {
      const res = await spreadsheetApi.previewSheet(sheetUrl);
      setPreviewResult(res);
      return res;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load CSV preview";
      toast.error(msg);
      return null;
    } finally {
      setIsPreviewing(false);
    }
  };

  const syncNow = async (devId: string): Promise<boolean> => {
    if (!devId) return false;
    setIsSyncing(true);
    try {
      const ok = await spreadsheetApi.syncNow(devId);
      if (ok) {
        toast.success(t("autoreply.spreadsheet.syncSuccess"));
        await fetchConfig(devId);
      }
      return ok;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.spreadsheet.syncFailed");
      toast.error(msg);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const testMatch = async (
    devId: string,
    inputText: string,
  ): Promise<TestSpreadsheetMatchResult | null> => {
    setIsTesting(true);
    try {
      const res = await spreadsheetApi.testMatch({
        device_id: devId,
        input_text: inputText,
      });
      setTestResult(res);
      return res;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Test match failed";
      toast.error(msg);
      return null;
    } finally {
      setIsTesting(false);
    }
  };

  return {
    config,
    isLoading,
    isSaving,
    isSyncing,
    isPreviewing,
    isTesting,
    previewResult,
    testResult,
    fetchConfig,
    saveConfig,
    previewSheet,
    syncNow,
    testMatch,
    setTestResult,
    setPreviewResult,
  };
}
