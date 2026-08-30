export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED";

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
