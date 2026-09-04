import { httpClient } from "@/lib/api/http-client";
import { env } from "@/lib/config/env";
import { TeamAgent, CreateAgentInput } from "../types/team.types";

const IAM_BASE = env.NEXT_PUBLIC_IAM_API_URL;

export function normalizeTeamAgent(raw: Record<string, unknown>): TeamAgent {
  const rawRole = String(raw.role_name || raw.role || "AGENT").toUpperCase();
  let role: "SELLER" | "AGENT" | "SUPERVISOR" = "AGENT";
  if (rawRole === "SELLER" || rawRole === "OWNER") {
    role = "SELLER";
  } else if (rawRole === "SUPERVISOR") {
    role = "SUPERVISOR";
  } else {
    role = "AGENT";
  }
  const isActive = raw.is_active !== false && raw.status !== "INACTIVE";

  return {
    id: String(raw.id || ""),
    name: String(raw.name || "Anggota Tim"),
    email: String(raw.email || ""),
    phone: String(raw.phone_number || raw.phone || "-"),
    role,
    status: isActive ? "ACTIVE" : "INACTIVE",
    assignedDevicesCount: Number(raw.assigned_devices_count || raw.assignedDevicesCount || 0),
    createdAt: String(raw.created_at || raw.createdAt || new Date().toISOString()),
  };
}

export const teamApi = {
  getAgents: async (signal?: AbortSignal): Promise<TeamAgent[]> => {
    try {
      const res = await httpClient.get<Record<string, unknown>[]>(`${IAM_BASE}/tenant/team`, {
        signal,
      });
      if (res.payload && Array.isArray(res.payload)) {
        return res.payload.map(normalizeTeamAgent);
      }
      return [];
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") throw err;
      return [];
    }
  },

  createAgent: async (payload: CreateAgentInput): Promise<TeamAgent> => {
    const body = {
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone_number: payload.phone.trim(),
      phone: payload.phone.trim(),
      password: payload.password?.trim(),
      role: payload.role || "AGENT",
    };

    const res = await httpClient.post<Record<string, unknown>>(`${IAM_BASE}/tenant/team`, body);
    if (!res.payload) {
      throw new Error(res.message || "Gagal membuat anggota tim");
    }
    return normalizeTeamAgent(res.payload);
  },

  deleteAgent: async (id: string): Promise<boolean> => {
    const res = await httpClient.delete(`${IAM_BASE}/tenant/team/${id}`);
    return res.success;
  },
};
