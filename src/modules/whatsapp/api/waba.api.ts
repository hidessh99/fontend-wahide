import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  WABAAccount,
  ConnectWABAInput,
  ConnectWABAResponse,
} from "../types/waba.types";

const BASE_URL = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const wabaApi = {
  getAccounts: async (signal?: AbortSignal): Promise<WABAAccount[]> => {
    try {
      const res = await httpClient.get<WABAAccount[]>(`${BASE_URL}/waba/accounts`, {
        signal,
      });
      const data = res?.payload;
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch {
      return [];
    }
  },

  getAccount: async (id: string, signal?: AbortSignal): Promise<WABAAccount> => {
    const res = await httpClient.get<WABAAccount>(`${BASE_URL}/waba/accounts/${id}`, {
      signal,
    });
    return res?.payload as WABAAccount;
  },

  connectAccount: async (
    payload: ConnectWABAInput,
  ): Promise<ConnectWABAResponse> => {
    const res = await httpClient.post<ConnectWABAResponse>(
      `${BASE_URL}/waba/accounts`,
      payload,
    );
    return res?.payload as ConnectWABAResponse;
  },

  disconnectAccount: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete<void>(`${BASE_URL}/waba/accounts/${id}`);
    return {
      success: res?.success ?? true,
      message: res?.message ?? "Akun WABA berhasil diputuskan",
    };
  },
};
