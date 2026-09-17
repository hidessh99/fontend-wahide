// ==============================================================================
// Wahide Frontend - Template Module API Client
// Standard REST API communication with Go Backend
// ==============================================================================

import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import {
  Template,
  CreateTemplateInput,
  UpdateTemplateInput,
  ListTemplatesQuery,
} from "../types/template.types";

const TEMPLATE_BASE =
  env.NEXT_PUBLIC_TEMPLATE_API_URL || env.NEXT_PUBLIC_API_BASE_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapBackendTemplate = (t: any): Template => {
  if (!t || typeof t !== "object") {
    return {
      id: "",
      name: "",
      category: "MARKETING",
      content: "",
      mediaType: "NONE",
      variables: [],
      isFavorite: false,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  let buttons = t.buttons;
  if (typeof buttons === "string" && buttons.trim() !== "") {
    try {
      buttons = JSON.parse(buttons);
    } catch {
      buttons = [];
    }
  }

  let variables = t.variables;
  if (typeof variables === "string" && variables.trim() !== "") {
    try {
      variables = JSON.parse(variables);
    } catch {
      variables = [];
    }
  }

  let telegramDetail = t.telegram_detail || t.telegramDetail;
  if (typeof telegramDetail === "string" && telegramDetail.trim() !== "") {
    try {
      telegramDetail = JSON.parse(telegramDetail);
    } catch {
      telegramDetail = undefined;
    }
  }

  let inlineKeyboard =
    telegramDetail?.inline_keyboard || telegramDetail?.inlineKeyboard;
  if (typeof inlineKeyboard === "string" && inlineKeyboard.trim() !== "") {
    try {
      inlineKeyboard = JSON.parse(inlineKeyboard);
    } catch {
      inlineKeyboard = [];
    }
  }

  const mappedTelegramDetail = telegramDetail
    ? {
        parseMode:
          telegramDetail.parse_mode || telegramDetail.parseMode || "HTML",
        inlineKeyboard: Array.isArray(inlineKeyboard) ? inlineKeyboard : [],
        disableWebPagePreview: Boolean(
          telegramDetail.disable_web_page_preview ??
            telegramDetail.disableWebPagePreview ??
            false,
        ),
      }
    : undefined;

  return {
    id: t.id || "",
    tenantId: t.tenant_id || t.tenantId,
    name: t.name || "",
    category: t.category || "MARKETING",
    channelType: t.channel_type || t.channelType || "ALL",
    content: t.content || "",
    mediaType: t.media_type || t.mediaType || "NONE",
    mediaUrl: t.media_url || t.mediaUrl || undefined,
    buttons: Array.isArray(buttons) ? buttons : [],
    variables: Array.isArray(variables) ? variables : [],
    isFavorite: Boolean(t.is_favorite ?? t.isFavorite ?? false),
    usageCount: Number(t.usage_count ?? t.usageCount ?? 0),
    telegramDetail: mappedTelegramDetail,
    createdAt: t.created_at || t.createdAt || new Date().toISOString(),
    updatedAt: t.updated_at || t.updatedAt || new Date().toISOString(),
  };
};

export interface PaginatedTemplatesResult {
  templates: Template[];
  page: number;
  pageSize: number;
  total: number;
}

export const templateApi = {
  getTemplates: async (
    params?: ListTemplatesQuery,
  ): Promise<PaginatedTemplatesResult> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.pageSize) query.set("page_size", params.pageSize.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.category && params.category !== "ALL")
      query.set("category", params.category);
    if (params?.channelType && params.channelType !== "ALL") {
      query.set("channel_type", params.channelType);
    }
    if (params?.favoriteOnly || params?.isFavorite) {
      query.set("is_favorite", "true");
    }

    const qs = query.toString();
    const endpoint = `${TEMPLATE_BASE}/templates${qs ? `?${qs}` : ""}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(endpoint);
    const items = res.payload || (Array.isArray(res) ? res : []);
    const templates = Array.isArray(items) ? items.map(mapBackendTemplate) : [];

    const additionalInfo = res.additional_info as
      { page?: number; size?: number; total?: number } | undefined;

    return {
      templates,
      page: Number(additionalInfo?.page ?? params?.page ?? 1),
      pageSize: Number(additionalInfo?.size ?? params?.pageSize ?? 10),
      total: Number(additionalInfo?.total ?? templates.length),
    };
  },

  getTemplate: async (id: string): Promise<Template> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.get<any>(`${TEMPLATE_BASE}/templates/${id}`);
    return mapBackendTemplate(res.payload || res);
  },

  createTemplate: async (input: CreateTemplateInput): Promise<Template> => {
    const payload: Record<string, unknown> = {
      name: input.name,
      category: input.category,
      channel_type: input.channelType || "ALL",
      content: input.content,
      media_type: input.mediaType || "NONE",
      media_url: input.mediaUrl || null,
      is_favorite: Boolean(input.isFavorite),
    };

    if (input.telegramDetail) {
      payload.telegram_detail = {
        parse_mode: input.telegramDetail.parseMode || "HTML",
        inline_keyboard: input.telegramDetail.inlineKeyboard || [],
        disable_web_page_preview: Boolean(
          input.telegramDetail.disableWebPagePreview,
        ),
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(
      `${TEMPLATE_BASE}/templates`,
      payload,
    );
    return mapBackendTemplate(res.payload || res);
  },

  updateTemplate: async (
    id: string,
    input: UpdateTemplateInput,
  ): Promise<Template> => {
    const payload: Record<string, unknown> = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.category !== undefined) payload.category = input.category;
    if (input.channelType !== undefined) payload.channel_type = input.channelType;
    if (input.content !== undefined) payload.content = input.content;
    if (input.mediaType !== undefined) payload.media_type = input.mediaType;
    if (input.mediaUrl !== undefined) payload.media_url = input.mediaUrl;
    if (input.isFavorite !== undefined) payload.is_favorite = input.isFavorite;

    if (input.telegramDetail !== undefined) {
      payload.telegram_detail = {
        parse_mode: input.telegramDetail.parseMode || "HTML",
        inline_keyboard: input.telegramDetail.inlineKeyboard || [],
        disable_web_page_preview: Boolean(
          input.telegramDetail.disableWebPagePreview,
        ),
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.put<any>(
      `${TEMPLATE_BASE}/templates/${id}`,
      payload,
    );
    return mapBackendTemplate(res.payload || res);
  },

  duplicateTemplate: async (id: string): Promise<Template> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.post<any>(
      `${TEMPLATE_BASE}/templates/${id}/duplicate`,
    );
    return mapBackendTemplate(res.payload || res);
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await httpClient.delete(`${TEMPLATE_BASE}/templates/${id}`);
  },

  toggleFavorite: async (id: string): Promise<Template> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await httpClient.patch<any>(
      `${TEMPLATE_BASE}/templates/${id}/favorite`,
    );
    return mapBackendTemplate(res.payload || res);
  },
};
