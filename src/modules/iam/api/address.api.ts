import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Province,
  City,
  District,
  UserAddress,
  UpsertAddressInput,
} from "../types/address.types";

const IAM_BASE = env.NEXT_PUBLIC_IAM_API_URL;
const CODEPOS_BASE = "https://apicodepos.hidessh.com/api";

function normalizeUserAddress(raw: Record<string, unknown>): UserAddress {
  return {
    id: String(raw.id || ""),
    userId: String(raw.user_id || raw.userId || ""),
    name: String(raw.name || ""),
    address: String(raw.address || ""),
    city: String(raw.city || ""),
    state: String(raw.state || ""),
    postalCode: String(raw.postal_code || raw.postalCode || ""),
    createdAt: raw.created_at ? String(raw.created_at) : undefined,
    updatedAt: raw.updated_at ? String(raw.updated_at) : undefined,
  };
}

export const addressApi = {
  // Backend Go Wahide IAM Endpoints
  getUserAddress: async (): Promise<UserAddress | null> => {
    try {
      const res = await httpClient.get<Record<string, unknown>>(`${IAM_BASE}/users/address/user`);
      if (res.payload && typeof res.payload === "object") {
        return normalizeUserAddress(res.payload as Record<string, unknown>);
      }
      return null;
    } catch {
      // Address not found or empty
      return null;
    }
  },

  upsertUserAddress: async (payload: UpsertAddressInput): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.post(`${IAM_BASE}/users/address/upsert`, payload);
    return {
      success: res.success,
      message: res.message || "Alamat berhasil diperbarui",
    };
  },

  // Third-Party Indonesia Location API (apicodepos.hidessh.com)
  getProvinces: async (): Promise<Province[]> => {
    try {
      const response = await fetch(`${CODEPOS_BASE}/provinces.json`, {
        headers: { Accept: "application/json" },
        cache: "force-cache",
      });
      if (!response.ok) throw new Error("Gagal mengambil data provinsi");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching provinces:", err);
      return [];
    }
  },

  getCities: async (provinceId: string): Promise<City[]> => {
    if (!provinceId) return [];
    try {
      const response = await fetch(`${CODEPOS_BASE}/regencies/${provinceId}.json`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Gagal mengambil data kota/kabupaten");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching cities:", err);
      return [];
    }
  },

  getDistricts: async (cityId: string): Promise<District[]> => {
    if (!cityId) return [];
    try {
      const response = await fetch(`${CODEPOS_BASE}/districts/${cityId}.json`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Gagal mengambil data kecamatan");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching districts:", err);
      return [];
    }
  },
};
