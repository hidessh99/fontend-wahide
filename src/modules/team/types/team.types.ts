export type AgentRole = "SELLER" | "AGENT" | "SUPERVISOR" | "USER";
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

export type Agent = TeamAgent;
export type TeamMember = TeamAgent;

export interface CreateAgentInput {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: AgentRole;
}

export type CreateTeamMemberInput = CreateAgentInput;
