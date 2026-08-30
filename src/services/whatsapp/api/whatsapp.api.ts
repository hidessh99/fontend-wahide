import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Device, CreateDeviceInput } from "../types/whatsapp.types";

const WHATSAPP_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const whatsappApi = {
  getDevices: async (): Promise<Device[]> => {
    try {
      const res = await httpClient.get<Device[]>(`${WHATSAPP_BASE}/whatsapp/devices`);
      return res.payload || (Array.isArray(res) ? res : []);
    } catch {
      // Fallback empty array on initial connection failure
      return [];
    }
  },

  createDevice: async (payload: CreateDeviceInput): Promise<Device> => {
    const res = await httpClient.post<Device>(`${WHATSAPP_BASE}/whatsapp/devices`, payload);
    return res.payload || (res as unknown as Device);
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

  getQRStreamUrl: (id: string): string => {
    return `${WHATSAPP_BASE}/whatsapp/devices/${id}/qr-stream`;
  },
};
