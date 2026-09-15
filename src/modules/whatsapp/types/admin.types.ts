export interface AdminDeviceItem {
  id: string;
  tenantId: string;
  jid: string;
  pushName: string;
  status:
    "ONLINE" | "OFFLINE" | "QR_PENDING" | "HIBERNATED" | "BANNED" | string;
  trustScore: number;
  warmupDay: number;
  dailySentCount: number;
  lastSeenAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAdminDevicesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  tenantId?: string;
}

export interface AdminDeviceListResponse {
  devices: AdminDeviceItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminMessageLogItem {
  id: string;
  tenantId: string;
  deviceId: string;
  campaignId?: string;
  recipientJid: string;
  direction: "OUTBOUND" | "INBOUND";
  messageBody: string;
  mediaUrl?: string;
  status: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED" | string;
  errorMessage?: string;
  sentAt?: string;
  createdAt: string;
}

export interface GetAdminMessageLogsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  direction?: string;
  tenantId?: string;
  deviceId?: string;
}

export interface AdminMessageLogListResponse {
  logs: AdminMessageLogItem[];
  total: number;
  page: number;
  pageSize: number;
}
