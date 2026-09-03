export type DeviceStatus = "CONNECTED" | "PAIRING" | "DISCONNECTED" | "HIBERNATED";

export interface Device {
  id: string;
  name?: string;
  push_name?: string | null;
  pushName?: string | null;
  phone: string | null;
  status: DeviceStatus;
  batteryLevel: number | null;
  isCharging: boolean;
  platform: string | null;
  lastSeenAt: string | null;
  createdAt: string;
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
