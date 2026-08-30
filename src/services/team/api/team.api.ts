import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { TeamAgent, CreateAgentInput } from "../types/team.types";

const IAM_BASE = env.NEXT_PUBLIC_IAM_API_URL;

export const DEFAULT_AGENTS: TeamAgent[] = [
  {
    id: "agt_01",
    name: "Rina Oktaviani",
    email: "rina.cs@bisnisanda.com",
    phone: "6281299887766",
    role: "SUPERVISOR",
    status: "ACTIVE",
    assignedDevicesCount: 2,
    createdAt: "2026-08-10T09:00:00Z",
  },
  {
    id: "agt_02",
    name: "Dimas Pratama",
    email: "dimas.support@bisnisanda.com",
    phone: "6285711223344",
    role: "AGENT",
    status: "ACTIVE",
    assignedDevicesCount: 1,
    createdAt: "2026-08-15T11:30:00Z",
  },
];

export const teamApi = {
  getAgents: async (): Promise<TeamAgent[]> => {
    try {
      const res = await httpClient.get<TeamAgent[]>(`${IAM_BASE}/tenant/agents`);
      return res.payload || DEFAULT_AGENTS;
    } catch {
      return DEFAULT_AGENTS;
    }
  },

  createAgent: async (payload: CreateAgentInput): Promise<TeamAgent> => {
    const res = await httpClient.post<TeamAgent>(`${IAM_BASE}/tenant/agents`, payload);
    return (
      res.payload || {
        id: "agt_" + Date.now(),
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        status: "ACTIVE",
        assignedDevicesCount: 0,
        createdAt: new Date().toISOString(),
      }
    );
  },

  deleteAgent: async (id: string): Promise<boolean> => {
    const res = await httpClient.delete(`${IAM_BASE}/tenant/agents/${id}`);
    return res.success;
  },
};
