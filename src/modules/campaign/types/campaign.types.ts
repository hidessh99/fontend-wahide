export type CampaignStatus = "DRAFT" | "SCHEDULED" | "RUNNING" | "PAUSED" | "COMPLETED" | "FAILED";

export interface Campaign {
  id: string;
  name: string;
  deviceId: string;
  deviceName?: string;
  messageTemplate: string;
  jitterDelaySeconds: number;
  enableHumanTyping: boolean;
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
  deviceId: string;
  messageTemplate: string;
  jitterDelaySeconds: number;
  enableHumanTyping: boolean;
  targetType: "ALL" | "TAGS" | "CUSTOM";
  targetTags?: string[];
  targetNumbers?: string[];
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
  status: "SENT" | "DELIVERED" | "READ" | "FAILED";
  error_message?: string;
  sent_at: string;
  created_at: string;
}
