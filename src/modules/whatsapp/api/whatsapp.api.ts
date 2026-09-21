import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Device,
  CreateDeviceInput,
  UpdateDeviceInput,
  PairDeviceResponse,
  PairPhoneResponse,
} from "../types/whatsapp.types";

const WHATSAPP_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendDevice = (d: any): Device => {
  let mappedStatus = d.status?.toUpperCase?.() || d.status;
  const rawJid = d.jid || d.j_id || "";

  if (mappedStatus === "ONLINE" || mappedStatus === "CONNECTED") {
    mappedStatus = "CONNECTED";
  } else if (mappedStatus === "HIBERNATED") {
    mappedStatus = "HIBERNATED";
  } else if (mappedStatus === "PAIRING" || mappedStatus === "QR_PENDING") {
    mappedStatus = "PAIRING";
  } else {
    mappedStatus = "DISCONNECTED";
  }

  // Extract clean phone number from JID (e.g., "6282151743688:80@s.whatsapp.net" -> "6282151743688")
  let phone = d.phone || d.phone_number || d.phoneNumber || null;
  if (!phone && rawJid) {
    const userPart = rawJid.split("@")[0].split(":")[0];
    phone = userPart.split(".")[0] || null;
  }

  const pushName = d.push_name || d.pushName || d.name || "WhatsApp Device";

  return {
    ...d,
    id: String(d.id || ""),
    tenantId: d.tenant_id || d.tenantId,
    jid: rawJid || null,
    push_name: pushName,
    pushName: pushName,
    name: pushName,
    phone: phone,
    status: mappedStatus,
    trustScore:
      typeof d.trust_score === "number"
        ? d.trust_score
        : typeof d.trustScore === "number"
          ? d.trustScore
          : 10,
    warmupDay:
      typeof d.warmup_day === "number"
        ? d.warmup_day
        : typeof d.warmupDay === "number"
          ? d.warmupDay
          : 1,
    dailySentCount:
      typeof d.daily_sent_count === "number"
        ? d.daily_sent_count
        : typeof d.dailySentCount === "number"
          ? d.dailySentCount
          : 0,
    lastSeenAt: d.last_seen_at || d.lastSeenAt || null,
    createdAt: d.created_at || d.createdAt || new Date().toISOString(),
    updatedAt: d.updated_at || d.updatedAt || undefined,
    webhook_url: d.webhook_url ?? null,
    webhook_secret: d.webhook_secret ?? null,
    webhookUrl: d.webhook_url ?? null,
    webhookSecret: d.webhook_secret ?? null,
    webhook_events: d.webhook_events ?? null,
    webhookEvents: d.webhook_events ?? null,
    proxy_url: d.proxy_url ?? null,
    proxyUrl: d.proxy_url ?? null,
  };
};

export const whatsappApi = {
  getDevices: async (signal?: AbortSignal): Promise<Device[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await httpClient.get<any>(
        `${WHATSAPP_BASE}/whatsapp/devices`,
        { signal },
      );
      const data = res.payload || (Array.isArray(res) ? res : []);
      return data.map(mapBackendDevice);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      // Fallback empty array on initial connection failure
      return [];
    }
  },

  getDevice: async (id: string, signal?: AbortSignal): Promise<Device> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(
      `${WHATSAPP_BASE}/whatsapp/devices/${id}`,
      { signal },
    );
    const data = res.payload || res;
    return mapBackendDevice(data);
  },

  createDevice: async (payload: CreateDeviceInput): Promise<Device> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(
      `${WHATSAPP_BASE}/whatsapp/devices`,
      {
        push_name: payload.push_name,
        proxy_url: payload.proxy_url || undefined,
      },
    );
    const data = res.payload || res;
    return mapBackendDevice(data);
  },

  updateDevice: async (
    id: string,
    payload: UpdateDeviceInput,
  ): Promise<Device> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.put<any>(
      `${WHATSAPP_BASE}/whatsapp/devices/${id}`,
      payload,
    );
    const data = res.payload || res;
    return mapBackendDevice(data);
  },

  pairDevice: async (id: string): Promise<PairDeviceResponse> => {
    const res = await httpClient.post<PairDeviceResponse>(
      `${WHATSAPP_BASE}/whatsapp/devices/${id}/pair`,
    );
    return res.payload || (res as unknown as PairDeviceResponse);
  },

  pairPhone: async (id: string, phone: string): Promise<PairPhoneResponse> => {
    const res = await httpClient.post<PairPhoneResponse>(
      `${WHATSAPP_BASE}/whatsapp/devices/${id}/pair-phone`,
      {
        phone,
      },
    );
    return res.payload || (res as unknown as PairPhoneResponse);
  },

  deleteDevice: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(
      `${WHATSAPP_BASE}/whatsapp/devices/${id}`,
    );
    return {
      success: res.success,
      message: res.message || "Perangkat berhasil dihapus",
    };
  },

  disconnectDevice: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(
      `${WHATSAPP_BASE}/whatsapp/devices/${id}/disconnect`,
    );
    return {
      success: res.success,
      message: res.message || "Perangkat berhasil diputuskan",
    };
  },

  hibernateDevice: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(
      `${WHATSAPP_BASE}/whatsapp/devices/${id}/hibernate`,
    );
    return {
      success: res.success,
      message: res.message || "Sesi berhasil dihibernasi",
    };
  },

  wakeDevice: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(
      `${WHATSAPP_BASE}/whatsapp/devices/${id}/wake`,
    );
    return {
      success: res.success,
      message: res.message || "Sesi berhasil dibangunkan",
    };
  },

  sendMessage: async (payload: {
    device_id: string;
    phone: string;
    message?: string;
    media_url?: string;
    file_name?: string;
    simulate_typing?: boolean;
    parse_spintax?: boolean;
  }): Promise<{ message_id: string; status: string; sent_at: string }> => {
    const res = await httpClient.post<{
      message_id: string;
      status: string;
      sent_at: string;
    }>(`${WHATSAPP_BASE}/whatsapp/messages/send`, payload);
    return (
      res.payload ||
      (res as unknown as {
        message_id: string;
        status: string;
        sent_at: string;
      })
    );
  },
};
