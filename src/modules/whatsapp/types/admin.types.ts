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

