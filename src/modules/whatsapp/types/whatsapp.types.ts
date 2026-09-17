export type DeviceStatus =
  "CONNECTED" | "PAIRING" | "DISCONNECTED" | "HIBERNATED";

export interface Device {
  id: string;
  tenant_id?: string;
  tenantId?: string;
  jid?: string | null;
  name?: string;
  channel_type?: string;
  channelType?: string;
  push_name?: string | null;
  pushName?: string | null;
  phone: string | null;
  status: DeviceStatus;
  batteryLevel?: number | null;
  isCharging?: boolean;
  trustScore?: number;
  warmupDay?: number;
  dailySentCount?: number;
  platform?: string | null;
  lastSeenAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  is_over_limit?: boolean;
  isOverLimit?: boolean;
  webhook_url?: string | null;
  webhook_secret?: string | null;
  webhookUrl?: string | null;
  webhookSecret?: string | null;
  webhook_events?: string[] | null;
  webhookEvents?: string[] | null;
}

export interface UpdateDeviceInput {
  push_name?: string;
  webhook_url?: string | null;
  webhook_secret?: string | null;
  webhook_events?: string[] | null;
}

export interface QREventData {
  qrCode?: string;
  pairingCode?: string;
  status: DeviceStatus | "EXPIRED" | "ERROR" | "AUTHENTICATED";
  expiresIn?: number;
  message?: string;
}

export interface CreateDeviceInput {
  push_name: string;
}

export interface PairDeviceResponse {
  device_id: string;
  qr_code: string;
}

export interface PairPhoneInput {
  phone: string;
}

export interface PairPhoneResponse {
  device_id: string;
  pairing_code: string;
}

export interface DeviceStats {
  total: number;
  connected: number;
  pairing: number;
  disconnected: number;
  hibernated: number;
}
