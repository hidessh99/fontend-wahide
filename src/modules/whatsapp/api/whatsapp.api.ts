import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Device, CreateDeviceInput, PairDeviceResponse, PairPhoneResponse } from "../types/whatsapp.types";

const WHATSAPP_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendDevice = (d: any): Device => {
  let mappedStatus = d.status?.toUpperCase?.() || d.status;
  if (mappedStatus === "ONLINE" || mappedStatus === "CONNECTED") {
    mappedStatus = "CONNECTED";
  } else if (mappedStatus === "HIBERNATED") {
    mappedStatus = "HIBERNATED";
  } else if (mappedStatus === "PAIRING" || mappedStatus === "QR_PENDING") {
    mappedStatus = d.jid ? "HIBERNATED" : "PAIRING";
  } else {
    mappedStatus = "DISCONNECTED";
  }
  
  // Extract clean phone number from JID (e.g., "6282151743688:80@s.whatsapp.net" -> "6282151743688")
  let phone = d.phone || null;
  const rawJid = d.jid || d.j_id || "";
  if (!phone && rawJid) {
    phone = rawJid.split(":")[0].split("@")[0] || null;
  }

  const pushName = d.push_name || d.pushName || d.name || "WhatsApp Device";
  
  return {
    ...d,
    push_name: pushName,
    pushName: pushName,
    name: pushName,
    phone: phone,
    status: mappedStatus,
  };
};

export const whatsappApi = {
  getDevices: async (signal?: AbortSignal): Promise<Device[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await httpClient.get<any>(`${WHATSAPP_BASE}/whatsapp/devices`, { signal });
      const data = res.payload || (Array.isArray(res) ? res : []);
      return data.map(mapBackendDevice);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      // Fallback empty array on initial connection failure
      return [];
    }
  },

  createDevice: async (payload: CreateDeviceInput): Promise<Device> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(`${WHATSAPP_BASE}/whatsapp/devices`, {
      push_name: payload.push_name,
    });
    const data = res.payload || res;
    return mapBackendDevice(data);
  },

  pairDevice: async (id: string): Promise<PairDeviceResponse> => {
    const res = await httpClient.post<PairDeviceResponse>(`${WHATSAPP_BASE}/whatsapp/devices/${id}/pair`);
    return res.payload || (res as unknown as PairDeviceResponse);
  },

  pairPhone: async (id: string, phone: string): Promise<PairPhoneResponse> => {
    const res = await httpClient.post<PairPhoneResponse>(`${WHATSAPP_BASE}/whatsapp/devices/${id}/pair-phone`, {
      phone,
    });
    return res.payload || (res as unknown as PairPhoneResponse);
  },


  deleteDevice: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${WHATSAPP_BASE}/whatsapp/devices/${id}`);
    return { success: res.success, message: res.message || "Perangkat berhasil dihapus" };
  },

  disconnectDevice: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${WHATSAPP_BASE}/whatsapp/devices/${id}/disconnect`);
    return { success: res.success, message: res.message || "Perangkat berhasil diputuskan" };
  },

  hibernateDevice: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${WHATSAPP_BASE}/whatsapp/devices/${id}/hibernate`);
    return { success: res.success, message: res.message || "Sesi berhasil dihibernasi" };
  },

  wakeDevice: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${WHATSAPP_BASE}/whatsapp/devices/${id}/wake`);
    return { success: res.success, message: res.message || "Sesi berhasil dibangunkan" };
  },

  sendMessage: async (payload: {
    device_id: string;
    phone: string;
    message: string;
  }): Promise<{ message_id: string; status: string; sent_at: string }> => {
    const res = await httpClient.post<{ message_id: string; status: string; sent_at: string }>(
      `${WHATSAPP_BASE}/whatsapp/messages/send`,
      payload
    );
    return res.payload || (res as unknown as { message_id: string; status: string; sent_at: string });
  },
};

