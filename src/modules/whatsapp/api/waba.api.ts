import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  WABAAccount,
  ConnectWABAInput,
  ConnectWABAResponse,
  MetaEmbeddedConfig,
  MetaOAuthExchangeInput,
  SendWABAMessageInput,
  SendWABAMessageResponse,
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

  getEmbeddedConfig: async (signal?: AbortSignal): Promise<MetaEmbeddedConfig> => {
    const res = await httpClient.get<MetaEmbeddedConfig>(
      `${BASE_URL}/waba/embedded-config`,
      { signal },
    );
    return res?.payload as MetaEmbeddedConfig;
  },

  exchangeOAuthCode: async (
    payload: MetaOAuthExchangeInput,
  ): Promise<WABAAccount> => {
    const res = await httpClient.post<WABAAccount>(
      `${BASE_URL}/waba/oauth/exchange`,
      payload,
    );
    return res?.payload as WABAAccount;
  },

  sendMessage: async (
    payload: SendWABAMessageInput,
    signal?: AbortSignal,
  ): Promise<SendWABAMessageResponse> => {
    const res = await httpClient.post<SendWABAMessageResponse>(
      `${BASE_URL}/whatsapp/messages/send`,
      {
        device_id: payload.phone_number_id || payload.device_id,
        phone: payload.phone,
        message: payload.message,
        media_url: payload.media_url,
        file_name: payload.file_name,
        template_name: payload.template_name,
        template_params: payload.template_params,
      },
      { signal },
    );
    return (
      (res?.payload as SendWABAMessageResponse) ||
      (res as unknown as SendWABAMessageResponse)
    );
  },
};

