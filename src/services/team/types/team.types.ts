export type AgentRole = "AGENT" | "SUPERVISOR";
export type AgentStatus = "ACTIVE" | "INACTIVE";

export interface TeamAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AgentRole;
  status: AgentStatus;
  assignedDevicesCount: number;
  createdAt: string;
}

export interface CreateAgentInput {
  name: string;
  email: string;
  phone: string;
  role: AgentRole;
  password?: string;
}
