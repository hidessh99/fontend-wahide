"use client";

import React, { useState } from "react";
import { useTeam } from "@/services/team/hooks/useTeam";
import { AgentRole } from "@/services/team/types/team.types";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import {
  Users,
  Plus,
  Trash2,
  X,
  Loader2,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export function TeamView() {
  const { t } = useI18n();
  const { agents, createAgent, deleteAgent } = useTeam();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<AgentRole>("AGENT");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await createAgent({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        password: password || undefined,
      });
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, agentName: string) => {
    if (confirm(`Apakah Anda yakin ingin menonaktifkan agen ${agentName}?`)) {
      await deleteAgent(id);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <Users className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t("team.title")}
            </h1>
          </div>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("team.subtitle")}
          </p>
        </div>

        <Button
          variant="primaryPill"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 text-xs font-bold shadow-sm"
        >
          <Plus className="size-4" />
          <span>{t("team.addAgent")}</span>
        </Button>
      </div>

      {/* Agents Table with Error Boundary */}
      <ErrorBoundary fallbackTitle="Gagal Memuat Daftar Tim Staf Agen">
        <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 gap-3 px-5 py-3.5 bg-muted/60 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground-muted select-none">
            <div className="col-span-4 sm:col-span-3">{t("team.tableHeaderName")}</div>
            <div className="col-span-3 sm:col-span-3">{t("team.tableHeaderPhone")}</div>
            <div className="hidden sm:block sm:col-span-2">{t("team.tableHeaderRole")}</div>
            <div className="hidden sm:block sm:col-span-2 text-center">{t("team.tableHeaderDevices")}</div>
            <div className="col-span-3 sm:col-span-1 text-center">{t("team.tableHeaderStatus")}</div>
            <div className="col-span-2 sm:col-span-1 text-right">{t("team.tableHeaderAction")}</div>
          </div>

          {agents.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="size-10 text-foreground-muted mx-auto" />
              <h3 className="font-bold text-sm text-foreground">{t("team.noAgents")}</h3>
              <p className="text-xs text-foreground-secondary">{t("team.noAgentsDesc")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50 text-xs font-semibold">
              {agents.map((agt) => (
                <div
                  key={agt.id}
                  className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-muted/40 transition-colors"
                >
                  {/* Name & Email */}
                  <div className="col-span-4 sm:col-span-3 space-y-0.5">
                    <span className="font-bold text-foreground block truncate">{agt.name}</span>
                    <span className="text-[11px] text-foreground-muted block truncate font-mono">
                      {agt.email}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="col-span-3 sm:col-span-3 font-mono text-foreground-secondary text-[11px] truncate">
                    +{agt.phone}
                  </div>

                  {/* Role */}
                  <div className="hidden sm:block sm:col-span-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        agt.role === "SUPERVISOR"
                          ? "bg-wise-green/15 text-wise-green border border-wise-green/30"
                          : "bg-muted text-foreground-secondary border border-border"
                      }`}
                    >
                      <ShieldCheck className="size-3" />
                      <span>{agt.role === "SUPERVISOR" ? "Supervisor" : "CS Agent"}</span>
                    </span>
                  </div>

                  {/* Devices */}
                  <div className="hidden sm:flex sm:col-span-2 items-center justify-center gap-1 font-mono text-[11px] text-foreground-secondary">
                    <Smartphone className="size-3.5 text-foreground-muted" />
                    <span>{agt.assignedDevicesCount} Device</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-3 sm:col-span-1 flex justify-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      <span className="hidden sm:inline">Aktif</span>
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(agt.id, agt.name)}
                      className="size-7 rounded-full flex items-center justify-center text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                      aria-label={`Hapus ${agt.name}`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ErrorBoundary>

      {/* Modal Add Agent */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
                  <Users className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground">{t("team.modalTitle")}</h2>
                  <p className="text-xs font-semibold text-foreground-secondary">{t("team.modalSubtitle")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                aria-label="Tutup"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("team.nameLabel")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("team.namePlaceholder")}
                  className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("team.emailLabel")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("team.emailPlaceholder")}
                  className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("team.phoneLabel")}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("team.phonePlaceholder")}
                  className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("team.roleLabel")}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AgentRole)}
                  className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
                >
                  <option value="AGENT">{t("team.roleAgent")}</option>
                  <option value="SUPERVISOR">{t("team.roleSupervisor")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                  {t("team.passwordLabel")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("team.passwordPlaceholder")}
                  className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-full text-xs font-bold px-4 border-border hover:border-foreground-muted"
                >
                  {t("team.cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="primaryPill"
                  size="sm"
                  disabled={isSubmitting}
                  className="text-xs font-bold gap-1.5 px-6 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>{t("team.submitting")}</span>
                    </>
                  ) : (
                    <span>{t("team.submitCreate")}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
