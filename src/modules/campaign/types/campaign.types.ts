export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED";

export type CampaignChannelType =
  | "WHATSMEOW_UNOFFICIAL"
  | "META_WABA_OFFICIAL"
  | "TELEGRAM_BOT";

export interface CampaignWABAConfigInput {
  templateId?: string;
  templateName?: string;
  languageCode?: string;
  conversationCategory?: "MARKETING" | "UTILITY" | "SERVICE" | "AUTHENTICATION";
  parametersMapping?: Record<string, string>;
}

export interface CampaignTelegramConfigInput {
  parseMode?: "HTML" | "MarkdownV2";
  inlineButtons?: Array<{
    text: string;
    url?: string;
    callbackData?: string;
  }>;
}

export interface Campaign {
  id: string;
  name: string;
  channelType: CampaignChannelType;
  deviceId?: string;
  deviceIds?: string[];
  deviceName?: string;
  wabaAccountId?: string;
  wabaAccountName?: string;
  telegramBotId?: string;
  telegramBotUsername?: string;
  messageTemplate: string;
  mediaUrl?: string;
  jitterDelaySeconds: number;
  enableHumanTyping: boolean;
  autoScrubDeadNumbers?: boolean;
  processedOffset?: number;
  targetType: "ALL" | "TAGS" | "CUSTOM";
  targetTags?: string[];
  targetNumbers?: string[];
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  status: CampaignStatus;
  scheduledAt?: string;
  createdAt: string;
}

export interface CreateCampaignInput {
  name: string;
  channelType: CampaignChannelType;
  // Senders
  deviceId?: string;
  deviceIds?: string[];
  wabaAccountId?: string;
  telegramBotId?: string;
  // Content & Configs
  messageTemplate: string;
  mediaUrl?: string;
  wabaConfig?: CampaignWABAConfigInput;
  telegramConfig?: CampaignTelegramConfigInput;
  // Anti-ban & Dispatch controls
  jitterDelaySeconds?: number;
  enableHumanTyping?: boolean;
  autoScrubDeadNumbers?: boolean;
  // Audiences
  targetType: "ALL" | "TAGS" | "CUSTOM";
  targetTags?: string[];
  targetNumbers?: string[];
  targetChatIds?: string[];
  scheduledAt?: string;
}

export interface MessageLogResponse {
  id: string;
  tenant_id: string;
  device_id: string;
  campaign_id?: string;
  recipient_jid: string;
  direction: string;
  message_body: string;
  media_url?: string;
  channel_type?: CampaignChannelType;
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
  error_message?: string;
  sent_at: string;
  created_at: string;
}
