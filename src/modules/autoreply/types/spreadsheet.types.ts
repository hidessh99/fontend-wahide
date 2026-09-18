// ==============================================================================
// Wahide Frontend - Google Spreadsheet Integration Types
// Live CSV lookup matching Aho-Corasick in-memory cache
// ==============================================================================

export interface SpreadsheetConfig {
  id: string;
  tenant_id: string;
  device_id: string;
  channel_type: string;
  sheet_url: string;
  is_active: boolean;
  sync_interval_minutes: number;
  last_synced_at?: string;
  last_sync_status: string;
  last_sync_error?: string;
  total_keywords: number;
  created_at: string;
  updated_at: string;
}

export interface SaveSpreadsheetInput {
  device_id: string;
  channel_type: string;
  sheet_url: string;
  sync_interval_minutes?: number;
  is_active?: boolean;
}

export interface SpreadsheetPreviewRow {
  keyword: string;
  logic: string;
  response: string;
}

export interface SpreadsheetPreviewResult {
  total_rows: number;
  total_keywords: number;
  sample_rows: SpreadsheetPreviewRow[];
  is_valid: boolean;
  error_message?: string;
}

export interface TestSpreadsheetMatchInput {
  device_id: string;
  input_text: string;
}

export interface TestSpreadsheetMatchResult {
  matched: boolean;
  matched_keyword?: string;
  matched_logic?: string;
  response_payload?: string;
}
