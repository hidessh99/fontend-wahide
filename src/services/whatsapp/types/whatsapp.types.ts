export type DeviceStatus = "CONNECTED" | "PAIRING" | "DISCONNECTED" | "HIBERNATED";

export interface Device {
  id: string;
  name: string;
  phone: string | null;
  pushName: string | null;
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
  name: string;
}

export interface DeviceStats {
  total: number;
  connected: number;
  pairing: number;
  disconnected: number;
  hibernated: number;
}
