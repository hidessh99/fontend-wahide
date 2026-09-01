"use client";

import React, { useState, useMemo } from "react";
import { useTeam } from "@/modules/team/hooks/useTeam";
import { Agent, AgentRole } from "@/modules/team/types/team.types";
import { DeleteTeamMemberModal } from "@/modules/team/components/modals/DeleteTeamMemberModal";
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
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function TeamView() {
  const { t } = useI18n();
  const { agents, createAgent, deleteAgent } = useTeam();

  // Search & Pagination State
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Add Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<AgentRole>("AGENT");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Member Modal State
  const [deletingMember, setDeletingMember] = useState<Agent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredAgents = useMemo(() => {
    if (!activeSearch.trim()) return agents;
    const term = activeSearch.toLowerCase().trim();
    return agents.filter(
      (agt) =>
        agt.name.toLowerCase().includes(term) ||
        agt.email.toLowerCase().includes(term) ||
        agt.phone.includes(term) ||
        agt.role.toLowerCase().includes(term)
    );
  }, [agents, activeSearch]);

  const total = filteredAgents.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginatedAgents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAgents.slice(start, start + pageSize);
  }, [filteredAgents, page, pageSize]);

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

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

  const handleConfirmDelete = async () => {
    if (!deletingMember) return;
    setIsDeleting(true);
    try {
      await deleteAgent(deletingMember.id);
      setDeletingMember(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center shrink-0">
              <Users className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              {t("team.title")}
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("team.subtitle")}
          </p>
        </div>

        <Button
          variant="primaryPill"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 text-xs font-bold shadow-sm cursor-pointer h-10 px-4 shrink-0"
        >
          <Plus className="size-4" />
          <span>{t("team.addAgent")}</span>
        </Button>
      </div>

      {/* Filter Toolbar (Search Submit Form) */}
      <div className="p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama, email, atau nomor staf..."
              className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
            />
            {(searchInput || activeSearch) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                title="Hapus Pencarian"
                aria-label="Hapus Pencarian"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            className="h-10 px-4 text-xs font-bold shadow-xs shrink-0 cursor-pointer"
          >
            <Search className="size-3.5 mr-1" />
            <span>Cari</span>
          </Button>
        </form>
      </div>

      {/* Agents Table with Error Boundary */}
      <ErrorBoundary fallbackTitle="Gagal Memuat Daftar Tim Staf Agen">
        <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
          {paginatedAgents.length === 0 ? (
            <div className="p-6 sm:p-10 text-center space-y-2">
              <Users className="size-10 text-foreground-muted mx-auto" />
              <h3 className="font-bold text-sm text-foreground">{t("team.noAgents")}</h3>
              <p className="text-xs text-foreground-secondary">
                {activeSearch
                  ? `Tidak ditemukan staf dengan kata kunci "${activeSearch}".`
                  : t("team.noAgentsDesc")}
              </p>
            </div>
          ) : (
            <div>
              {/* Mobile View: Card-based Agent List (Visible on < 768px) */}
              <div className="md:hidden divide-y divide-border/50">
                {paginatedAgents.map((agt) => (
                  <div key={agt.id} className="p-3.5 sm:p-4 space-y-2.5 bg-surface dark:bg-[#161715]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-sm text-foreground truncate">{agt.name}</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                            agt.role === "SUPERVISOR"
                              ? "bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30"
                              : "bg-muted text-foreground-secondary border border-border"
                          }`}
                        >
                          <ShieldCheck className="size-2.5" />
                          <span>{agt.role === "SUPERVISOR" ? "Supervisor" : "CS"}</span>
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CheckCircle2 className="size-3" />
                        <span>{t("team.statusActive")}</span>
                      </span>
                    </div>

                    <div className="space-y-0.5 text-xs text-foreground-secondary">
                      <span className="block font-mono text-foreground-muted text-[11px] truncate">{agt.email}</span>
                      <span className="block font-mono font-medium">+{agt.phone}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs">
                      <div className="flex items-center gap-1 font-mono text-xs text-foreground-secondary">
                        <Smartphone className="size-3.5 text-foreground-muted" />
                        <span>{agt.assignedDevicesCount} Slot Device</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDeletingMember(agt)}
                        className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                        aria-label={`${t("actions.delete")} ${agt.name}`}
                        title="Hapus Anggota Tim"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Tabular Grid (Visible on >= 768px) */}
              <div className="hidden md:block">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
                  <div className="col-span-3">{t("team.tableHeaderName")}</div>
                  <div className="col-span-3">{t("team.tableHeaderPhone")}</div>
                  <div className="col-span-2">{t("team.tableHeaderRole")}</div>
                  <div className="col-span-2 text-center">{t("team.tableHeaderDevices")}</div>
                  <div className="col-span-1 text-center">{t("team.tableHeaderStatus")}</div>
                  <div className="col-span-1 text-right">{t("team.tableHeaderAction")}</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border/50 text-xs font-semibold">
                  {paginatedAgents.map((agt) => (
                    <div
                      key={agt.id}
                      className="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-muted/40 transition-colors min-h-14.5"
                    >
                      {/* Name & Email */}
                      <div className="col-span-3 space-y-0.5">
                        <span className="font-bold text-sm sm:text-base text-foreground block truncate">{agt.name}</span>
                        <span className="text-xs text-foreground-muted block truncate font-mono">
                          {agt.email}
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="col-span-3 font-mono text-foreground-secondary text-xs sm:text-sm truncate">
                        +{agt.phone}
                      </div>

                      {/* Role */}
                      <div className="col-span-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            agt.role === "SUPERVISOR"
                              ? "bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30"
                              : "bg-muted text-foreground-secondary border border-border"
                          }`}
                        >
                          <ShieldCheck className="size-3" />
                          <span>{agt.role === "SUPERVISOR" ? "Supervisor" : "CS Agent"}</span>
                        </span>
                      </div>

                      {/* Devices */}
                      <div className="col-span-2 flex items-center justify-center gap-1 font-mono text-xs sm:text-sm text-foreground-secondary">
                        <Smartphone className="size-3.5 text-foreground-muted" />
                        <span>{agt.assignedDevicesCount} Slot</span>
                      </div>

                      {/* Status */}
                      <div className="col-span-1 flex justify-center">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="size-3.5" />
                          <span>{t("team.statusActive")}</span>
                        </span>
                      </div>

                      {/* Action */}
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setDeletingMember(agt)}
                          className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          aria-label={`${t("actions.delete")} ${agt.name}`}
                          title="Hapus Anggota Tim"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pagination Footer */}
          {total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-5 sm:py-3.5 border-t border-border bg-muted/30">
              {/* Item count summary */}
              <div className="text-xs font-semibold text-foreground-secondary">
                Menampilkan {startItem} - {endItem} dari {total} anggota tim
              </div>

              {/* Page navigation: Previous, Page Indicator, Next */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground-muted px-1.5 select-none">
                    Halaman {page} dari {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page <= 1}
                    className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                  >
                    <ChevronLeft className="size-3.5" />
                    <span>Sebelumnya</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page >= totalPages}
                    className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              )}
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

      {/* Modal Dialog Delete Confirmation */}
      <DeleteTeamMemberModal
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleConfirmDelete}
        targetMember={deletingMember}
        isDeleting={isDeleting}
      />
    </div>
  );
}
