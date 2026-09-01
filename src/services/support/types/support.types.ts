export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";

export type TicketCategory = "GENERAL" | "WHATSAPP" | "BILLING" | "API";

export interface TicketMessage {
  id: string;
  senderName: string;
  isStaff: boolean;
  content: string;
  attachment?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  message?: string;
  attachment?: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  message: string;
  attachment?: string;
}

export interface GetTicketsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export interface TicketListResponse {
  tickets: Ticket[];
  total: number;
  page: number;
  pageSize: number;
}
