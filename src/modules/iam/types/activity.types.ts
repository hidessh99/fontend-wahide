export interface UserActivityUser {
  id: string;
  name: string;
  email: string;
  roleName?: string;
  phoneNumber?: string;
  isActive: boolean;
}

export interface UserActivityItem {
  id: string;
  userId: string;
  tenantId?: string;
  activityType: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  user?: UserActivityUser;
}

export interface GetUserActivitiesParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface UserActivityListResponse {
  activities: UserActivityItem[];
  total: number;
  page: number;
  pageSize: number;
}
