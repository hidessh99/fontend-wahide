import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { Contact, CreateContactInput } from "../types/contact.types";

const CONTACT_BASE = env.NEXT_PUBLIC_WHATSAPP_API_URL;

export const contactApi = {
  getContacts: async (): Promise<Contact[]> => {
    try {
      const res = await httpClient.get<Contact[]>(`${CONTACT_BASE}/contacts`);
      return res.payload || (Array.isArray(res) ? res : []);
    } catch {
      return [];
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
    const res = await httpClient.post<{ count: number }>(`${CONTACT_BASE}/contacts/bulk-delete`, { ids });
    return { success: res.success, count: res.payload?.count || ids.length };
  },

  importCsv: async (contacts: CreateContactInput[]): Promise<{ importedCount: number }> => {
    const res = await httpClient.post<{ importedCount: number }>(`${CONTACT_BASE}/contacts/import-csv`, { contacts });
    return { importedCount: res.payload?.importedCount || contacts.length };
  },
};
