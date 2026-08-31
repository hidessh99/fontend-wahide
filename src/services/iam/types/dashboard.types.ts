export interface RecentUserItem {
  id: string;
  name: string;
  email: string;
  role_name: string;
  created_at: string;
}

export interface RecentTransactionItem {
  id: string;
  ref: string;
  title: string;
  total_price: number;
  status: string;
  created_at: string;
}

export interface RecentWithdrawalItem {
  id: string;
  user_name: string;
  amount: number;
  withdraw_method: string;
  status: string;
  created_at: string;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  description: string;
  created_at: string;
}

export interface UserDashboardStats {
  balance: number;
  income: number;
  total_devices: number;
  connected_devices: number;
  total_contacts: number;
  total_campaigns: number;
  total_messages_sent: number;
  plan_name: string;
  plan_status: string;
  device_limit: number;
  monthly_message_limit: number;
  open_tickets: number;
  recent_activities: RecentActivityItem[];
  recent_invoices: RecentTransactionItem[];
}

export interface AdminDashboardStats {
  total_users: number;
  total_tenants: number;
  total_devices: number;
  connected_devices: number;
  total_campaigns: number;
  total_messages_sent: number;
  total_transactions: number;
  pending_withdrawals: number;
  active_tickets: number;
  recent_users: RecentUserItem[];
  recent_transactions: RecentTransactionItem[];
  recent_withdrawals: RecentWithdrawalItem[];
}
