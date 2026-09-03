import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Contact,
  CreateContactInput,
  GetContactsParams,
  ContactListResponse,
} from "../types/contact.types";

const CONTACT_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const contactApi = {
  getContacts: async (
    params?: GetContactsParams,
    signal?: AbortSignal
  ): Promise<ContactListResponse> => {
    try {
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;
      const query = new URLSearchParams();
      query.set("page", String(page));
      query.set("page_size", String(pageSize));
      if (params?.search && params.search.trim()) {
        query.set("search", params.search.trim());
      }
      const queryString = `?${query.toString()}`;
      const res = await httpClient.get<Contact[]>(`${CONTACT_BASE}/contacts${queryString}`, {
        signal,
      });
      const rawList = res.payload || (Array.isArray(res) ? res : []);
      const contacts = Array.isArray(rawList) ? rawList : [];

      const addInfo = res.additional_info as
        { total?: number; page?: number; size?: number } | undefined;
      const total = typeof addInfo?.total === "number" ? addInfo.total : contacts.length;
      const resPage = typeof addInfo?.page === "number" ? addInfo.page : page;
      const resSize = typeof addInfo?.size === "number" ? addInfo.size : pageSize;

      return {
        contacts,
        total,
        page: resPage,
        pageSize: resSize,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return {
        contacts: [],
        total: 0,
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
      };
    }
  },

  createContact: async (payload: CreateContactInput): Promise<Contact> => {
    const res = await httpClient.post<Contact>(`${CONTACT_BASE}/contacts`, payload);
    return res.payload || (res as unknown as Contact);
  },

  updateContact: async (id: string, payload: Partial<CreateContactInput>): Promise<Contact> => {
    const res = await httpClient.put<Contact>(`${CONTACT_BASE}/contacts/${id}`, payload);
    return res.payload || (res as unknown as Contact);
  },

  deleteContact: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete(`${CONTACT_BASE}/contacts/${id}`);
    return { success: res.success, message: res.message || "Kontak berhasil dihapus" };
  },

  bulkDeleteContacts: async (ids: string[]): Promise<{ success: boolean; count: number }> => {
    const res = await httpClient.post<{ count: number }>(`${CONTACT_BASE}/contacts/bulk-delete`, {
      ids,
    });
    return { success: res.success, count: res.payload?.count || ids.length };
  },

  importCsv: async (contacts: CreateContactInput[]): Promise<{ importedCount: number }> => {
    const res = await httpClient.post<{ importedCount: number }>(
      `${CONTACT_BASE}/contacts/import-csv`,
      { contacts }
    );
    return { importedCount: res.payload?.importedCount || contacts.length };
  },
};
