// ==============================================================================
// Wahide Frontend - Google Spreadsheet Integration API Client
// Standard REST API communication for Live CSV Sync & Match Testing
// ==============================================================================

import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  SpreadsheetConfig,
  SaveSpreadsheetInput,
  SpreadsheetPreviewResult,
  TestSpreadsheetMatchInput,
  TestSpreadsheetMatchResult,
} from "../types/spreadsheet.types";

const BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;

export const spreadsheetApi = {
  getConfigByDevice: async (
    deviceId: string,
  ): Promise<SpreadsheetConfig | null> => {
    try {
      const res = await httpClient.get<SpreadsheetConfig>(
        `${BASE_URL}/autoreply/spreadsheet/${deviceId}`,
      );
      return res.payload || null;
    } catch {
      return null;
    }
  },

  saveConfig: async (
    input: SaveSpreadsheetInput,
  ): Promise<SpreadsheetConfig> => {
    const res = await httpClient.post<SpreadsheetConfig>(
      `${BASE_URL}/autoreply/spreadsheet`,
      input,
    );
    if (!res.payload) {
      throw new Error(res.message || "Failed to save spreadsheet config");
    }
    return res.payload;
  },

  previewSheet: async (
    sheetUrl: string,
  ): Promise<SpreadsheetPreviewResult> => {
    const res = await httpClient.post<SpreadsheetPreviewResult>(
      `${BASE_URL}/autoreply/spreadsheet/preview`,
      { sheet_url: sheetUrl },
    );
    if (!res.payload) {
      throw new Error(res.message || "Failed to preview spreadsheet CSV");
    }
    return res.payload;
  },

  syncNow: async (deviceId: string): Promise<boolean> => {
    const res = await httpClient.post(
      `${BASE_URL}/autoreply/spreadsheet/${deviceId}/sync`,
      {},
    );
    return res.success;
  },

  testMatch: async (
    input: TestSpreadsheetMatchInput,
  ): Promise<TestSpreadsheetMatchResult> => {
    const res = await httpClient.post<TestSpreadsheetMatchResult>(
      `${BASE_URL}/autoreply/spreadsheet/test`,
      input,
    );
    if (!res.payload) {
      throw new Error(res.message || "Spreadsheet test match failed");
    }
    return res.payload;
  },
};
