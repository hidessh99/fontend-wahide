// ==============================================================================
// Wahide Frontend - Template Module Types
// Strictly synchronized with Wahide Go Backend: internal/modules/template/domain
// ==============================================================================

export type TemplateCategory =
  "MARKETING" | "UTILITY" | "REMINDER" | "RESERVATION" | "QUICK_REPLY";

export type TemplateMediaType = "NONE" | "IMAGE" | "DOCUMENT";

export type TemplateChannelType =
  | "ALL"
  | "WHATSMEOW_UNOFFICIAL"
  | "META_WABA_OFFICIAL"
  | "TELEGRAM_BOT";

export type TelegramParseMode = "HTML" | "MarkdownV2" | "PLAIN";

export interface TelegramInlineButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export type TelegramInlineRow = TelegramInlineButton[];

export interface TelegramTemplateDetail {
  parseMode?: TelegramParseMode;
  inlineKeyboard?: TelegramInlineRow[];
  disableWebPagePreview?: boolean;
}

export type TemplateButtonType = "QUICK_REPLY" | "URL" | "CALL";

export interface TemplateButton {
  type: TemplateButtonType;
  text: string;
  value?: string;
}

export interface Template {
  id: string;
  tenantId?: string;
  name: string;
  category: TemplateCategory;
  channelType?: TemplateChannelType;
  content: string;
  mediaType: TemplateMediaType;
  mediaUrl?: string;
  buttons?: TemplateButton[];
  variables: string[];
  isFavorite: boolean;
  usageCount: number;
  telegramDetail?: TelegramTemplateDetail;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  category: TemplateCategory;
  channelType?: TemplateChannelType;
  content: string;
  mediaType?: TemplateMediaType;
  mediaUrl?: string;
  buttons?: TemplateButton[];
  isFavorite?: boolean;
  telegramDetail?: TelegramTemplateDetail;
}

export interface UpdateTemplateInput {
  name?: string;
  category?: TemplateCategory;
  channelType?: TemplateChannelType;
  content?: string;
  mediaType?: TemplateMediaType;
  mediaUrl?: string;
  buttons?: TemplateButton[];
  isFavorite?: boolean;
  telegramDetail?: TelegramTemplateDetail;
}

export interface ListTemplatesQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: TemplateCategory | "ALL";
  channelType?: TemplateChannelType | "ALL";
  favoriteOnly?: boolean;
  isFavorite?: boolean;
}
