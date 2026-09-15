export type QueueStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface AdminQueueItem {
  id: string;
  userId: string;
  taskType: string;
  payload: Record<string, unknown>;
  priority: number;
  status: QueueStatus;
  scheduledAt?: string;
  startedAt?: string;
  finishedAt?: string;
  attempts: number;
  maxAttempts: number;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
  targetEmail?: string;
  targetName?: string;
}

export interface GetAdminQueueParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export interface AdminQueueListResponse {
  queues: AdminQueueItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BroadcastToAllInput {
  subject: string;
  message: string;
}

export interface BroadcastToUsersInput {
  userIds: string[];
  subject: string;
  message: string;
}

export interface CreateEmailQueueInput {
  email: string;
  name?: string;
  subject: string;
  message: string;
  taskType?: string;
  priority?: number;
}
