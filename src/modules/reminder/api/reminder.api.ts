// ==============================================================================
// Wahide Frontend - Reminder Module API Client
// Standard REST API communication with Go Backend
// ==============================================================================

import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Reminder,
  CreateReminderInput,
  UpdateReminderInput,
  ListRemindersQuery,
  ReminderRule,
  UpdateReminderRuleInput,
  ReminderLog,
  ListReminderLogsQuery,
  DispatchResult,
} from "../types/reminder.types";

const REMINDER_BASE =
  env.NEXT_PUBLIC_REMINDER_API_URL || env.NEXT_PUBLIC_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendReminder = (r: any): Reminder => {
  if (!r || typeof r !== "object") {
    return {
      id: "",
      recipientName: "",
      phone: "",
      channelType: "WHATSAPP_WEB",
      targetDate: new Date().toISOString().slice(0, 10),
      notes: "",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Normalize target_date: can be RFC3339 string from Go or YYYY-MM-DD
  let targetDate = r.target_date || r.targetDate || "";
  if (targetDate.includes("T")) {
    targetDate = targetDate.split("T")[0];
  }

  return {
    id: r.id || "",
    tenantId: r.tenant_id || r.tenantId,
    recipientName: r.recipient_name || r.recipientName || "",
    phone: r.phone || "",
    channelType: r.channel_type || r.channelType || "WHATSAPP_WEB",
    targetChatId: r.target_chat_id || r.targetChatId || undefined,
    targetDate,
    notes: r.notes || "",
    status: (r.status || "ACTIVE").toUpperCase(),
    createdAt: r.created_at || r.createdAt || new Date().toISOString(),
    updatedAt: r.updated_at || r.updatedAt || new Date().toISOString(),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendReminderRule = (rule: any): ReminderRule => {
  if (!rule || typeof rule !== "object") {
    return {
      id: "",
      tenantId: "",
      deviceId: "",
      channelType: "WHATSAPP_WEB",
      sendTime: "09:00",
      showInChat: true,
      rules: [
        {
          daysOffset: -1,
          name: "Pengingat H-1",
          isEnabled: true,
          channelType: "WHATSAPP_WEB",
          template:
            "Halo Kak {{nama}}, besok {{tanggal}} ada jadwal: {{catatan}}.",
        },
        {
          daysOffset: 0,
          name: "Pengingat Hari H",
          isEnabled: true,
          channelType: "WHATSAPP_WEB",
          template:
            "Halo Kak {{nama}}, hari ini kami tunggu untuk jadwal: {{catatan}}.",
        },
        {
          daysOffset: 3,
          name: "Follow Up H+3",
          isEnabled: false,
          channelType: "WHATSAPP_WEB",
          template:
            "Halo Kak {{nama}}, bagaimana kondisi setelah kunjungan tanggal {{tanggal}}?",
        },
      ],
    };
  }

  let items = rule.rules;
  if (typeof items === "string" && items.trim() !== "") {
    try {
      items = JSON.parse(items);
    } catch {
      items = [];
    }
  }

  return {
    id: rule.id || "",
    tenantId: rule.tenant_id || rule.tenantId || "",
    deviceId: rule.device_id || rule.deviceId || "",
    channelType: rule.channel_type || rule.channelType || "WHATSAPP_WEB",
    sendTime: rule.send_time || rule.sendTime || "09:00",
    showInChat: rule.show_in_chat ?? rule.showInChat ?? true,
    rules: Array.isArray(items)
      ? items.map((i: Record<string, unknown>) => ({
          daysOffset: Number(i.days_offset ?? i.daysOffset ?? 0),
          name: (i.name as string) || "",
          isEnabled: Boolean(i.is_enabled ?? i.isEnabled ?? false),
          template: (i.template as string) || "",
          channelType: (i.channel_type || i.channelType || undefined) as
            | "WHATSAPP_WEB"
            | "WHATSAPP_OFFICIAL"
            | "TELEGRAM"
            | undefined,
          templateId: (i.template_id || i.templateId || undefined) as
            | string
            | undefined,
          templateParams: (i.template_params ||
            i.templateParams ||
            undefined) as Record<string, string> | undefined,
          telegramParseMode: (i.telegram_parse_mode ||
            i.telegramParseMode ||
            undefined) as "HTML" | "MarkdownV2" | undefined,
        }))
      : [],
    createdAt: rule.created_at || rule.createdAt,
    updatedAt: rule.updated_at || rule.updatedAt,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendReminderLog = (log: any): ReminderLog => {
  return {
    id: log.id || "",
    reminderId: log.reminder_id || log.reminderId || "",
    tenantId: log.tenant_id || log.tenantId || "",
    daysOffset: Number(log.days_offset ?? log.daysOffset ?? 0),
    recipientName: log.recipient_name || log.recipientName || "",
    phone: log.phone || "",
    channelType: log.channel_type || log.channelType || undefined,
    messageContent: log.message_content || log.messageContent || "",
    status:
      (log.status || "SENT").toUpperCase() === "FAILED" ? "FAILED" : "SENT",
    errorReason: log.error_reason || log.errorReason || undefined,
    sentAt: log.sent_at || log.sentAt || new Date().toISOString(),
  };
};

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export const reminderApi = {
  // Reminder CRUD
  getReminders: async (
    params?: ListRemindersQuery,
  ): Promise<PaginatedResult<Reminder>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.pageSize) query.set("page_size", params.pageSize.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.status && params.status !== "ALL")
      query.set("status", params.status);
    if (params?.startDate) query.set("start_date", params.startDate);
    if (params?.endDate) query.set("end_date", params.endDate);

    const qs = query.toString();
    const endpoint = `${REMINDER_BASE}/reminders${qs ? `?${qs}` : ""}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(endpoint);
    const rawItems = res.payload || (Array.isArray(res) ? res : []);
    const items = Array.isArray(rawItems)
      ? rawItems.map(mapBackendReminder)
      : [];

    const additionalInfo = res.additional_info as
      { page?: number; size?: number; total?: number } | undefined;

    return {
      items,
      page: Number(additionalInfo?.page ?? params?.page ?? 1),
      pageSize: Number(additionalInfo?.size ?? params?.pageSize ?? 10),
      total: Number(additionalInfo?.total ?? items.length),
    };
  },

  getReminder: async (id: string): Promise<Reminder> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(`${REMINDER_BASE}/reminders/${id}`);
    return mapBackendReminder(res.payload || res);
  },

  createReminder: async (input: CreateReminderInput): Promise<Reminder> => {
    const payload = {
      recipient_name: input.recipientName,
      phone: input.phone,
      channel_type: input.channelType || "WHATSAPP_WEB",
      target_chat_id: input.targetChatId,
      target_date: input.targetDate,
      notes: input.notes || "",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(
      `${REMINDER_BASE}/reminders`,
      payload,
    );
    return mapBackendReminder(res.payload || res);
  },

  updateReminder: async (
    id: string,
    input: UpdateReminderInput,
  ): Promise<Reminder> => {
    const payload: Record<string, unknown> = {};
    if (input.recipientName !== undefined)
      payload.recipient_name = input.recipientName;
    if (input.phone !== undefined) payload.phone = input.phone;
    if (input.channelType !== undefined) payload.channel_type = input.channelType;
    if (input.targetChatId !== undefined)
      payload.target_chat_id = input.targetChatId;
    if (input.targetDate !== undefined) payload.target_date = input.targetDate;
    if (input.notes !== undefined) payload.notes = input.notes;
    if (input.status !== undefined) payload.status = input.status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.put<any>(
      `${REMINDER_BASE}/reminders/${id}`,
      payload,
    );
    return mapBackendReminder(res.payload || res);
  },

  deleteReminder: async (id: string): Promise<void> => {
    await httpClient.delete(`${REMINDER_BASE}/reminders/${id}`);
  },

  // Tenant Rules
  getRules: async (): Promise<ReminderRule> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(`${REMINDER_BASE}/reminders/rules`);
    return mapBackendReminderRule(res.payload || res);
  },

  updateRules: async (
    input: UpdateReminderRuleInput,
  ): Promise<ReminderRule> => {
    const payload = {
      device_id: input.deviceId || "",
      channel_type: input.channelType || "WHATSAPP_WEB",
      send_time: input.sendTime,
      show_in_chat: input.showInChat,
      rules: input.rules.map((r) => ({
        days_offset: r.daysOffset,
        name: r.name,
        is_enabled: r.isEnabled,
        template: r.template,
        channel_type: r.channelType,
        template_id: r.templateId,
        template_params: r.templateParams,
        telegram_parse_mode: r.telegramParseMode,
      })),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.put<any>(
      `${REMINDER_BASE}/reminders/rules`,
      payload,
    );
    return mapBackendReminderRule(res.payload || res);
  },

  // Reminder Logs
  getLogs: async (
    params?: ListReminderLogsQuery,
  ): Promise<PaginatedResult<ReminderLog>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.pageSize) query.set("page_size", params.pageSize.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.reminderId) query.set("reminder_id", params.reminderId);
    if (params?.channelType && params.channelType !== "ALL")
      query.set("channel_type", params.channelType);
    if (params?.status && params.status !== "ALL")
      query.set("status", params.status);

    const qs = query.toString();
    const endpoint = `${REMINDER_BASE}/reminders/logs${qs ? `?${qs}` : ""}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(endpoint);
    const rawItems = res.payload || (Array.isArray(res) ? res : []);
    const items = Array.isArray(rawItems)
      ? rawItems.map(mapBackendReminderLog)
      : [];

    const additionalInfo = res.additional_info as
      { page?: number; size?: number; total?: number } | undefined;

    return {
      items,
      page: Number(additionalInfo?.page ?? params?.page ?? 1),
      pageSize: Number(additionalInfo?.size ?? params?.pageSize ?? 10),
      total: Number(additionalInfo?.total ?? items.length),
    };
  },

  // Manual Trigger Cron Dispatch
  dispatchNow: async (): Promise<DispatchResult> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(
      `${REMINDER_BASE}/cronjob/reminders/dispatch`,
    );
    const p = res.payload || res;
    return {
      dispatched: Number(p.dispatched ?? 0),
      skipped: Number(p.skipped ?? 0),
      failed: Number(p.failed ?? 0),
    };
  },
};
