"use client";

import React, { useState, useMemo } from "react";
import { useTeam } from "@/modules/team/hooks/useTeam";
import { Agent } from "@/modules/team/types/team.types";
import { DeleteTeamMemberModal } from "@/modules/team/components/modals/DeleteTeamMemberModal";
import { AddTeamMemberModal } from "@/modules/team/components/modals/AddTeamMemberModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { DataTablePagination } from "@/components/ui/pagination";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { useI18n } from "@/lib/i18n/context";
import {
  Users,
  Plus,
  Trash2,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { useTableSort } from "@/hooks/useTableSort";

export function TeamView() {
  const { t } = useI18n();
  const { agents, isLoading, fetchAgents, createAgent, deleteAgent } = useTeam();

  // Search & Pagination State
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Add Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<Agent>({
    initialKey: "name",
    initialOrder: "asc",
  });

  const sortedFilteredAgents = useMemo(() => {
    return sortData(filteredAgents);
  }, [filteredAgents, sortData]);

  const total = sortedFilteredAgents.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const paginatedAgents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedFilteredAgents.slice(start, start + pageSize);
  }, [sortedFilteredAgents, page, pageSize]);

  const handleClearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
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
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
              <Users className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              {t("team.title")}
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            {t("team.subtitle")}
          </p>
        </div>

        <Button
          variant="primaryPill"
          onClick={() => setIsModalOpen(true)}
          className="h-10 shrink-0 cursor-pointer gap-2 px-4 text-xs font-bold shadow-sm"
        >
          <Plus className="size-4" />
          <span>{t("team.addAgent")}</span>
        </Button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="border-border bg-surface flex flex-col justify-between gap-3 rounded-xl border p-3.5 shadow-xs sm:flex-row sm:items-center sm:p-4 dark:bg-[#161715]">
        <div className="w-full flex-1 sm:max-w-lg">
          <SearchInput
            value={searchInput}
            onChange={setSearchInput}
            onSearch={(val) => {
              setActiveSearch(val.trim());
              setPage(1);
            }}
            onClear={handleClearSearch}
            placeholder="Cari nama, email, atau nomor staf..."
            buttonText="Cari"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchAgents}
          disabled={isLoading}
          className="border-border hover:border-foreground-muted h-10 shrink-0 cursor-pointer gap-1.5 self-start rounded-full px-3.5 text-xs font-bold transition sm:self-auto"
          aria-label="Refresh Anggota Tim"
          title="Refresh Anggota Tim"
        >
          <RefreshCw
            className={`size-3.5 ${isLoading ? "dark:text-wise-green animate-spin text-emerald-700" : ""}`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Agents Table with Error Boundary */}
      <ErrorBoundary fallbackTitle="Gagal Memuat Daftar Tim Staf Agen">
        <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
          {paginatedAgents.length === 0 ? (
            <EmptyState
              icon={<Users className="size-8" />}
              title={t("team.noAgents")}
              description={
                activeSearch
                  ? `Tidak ditemukan staf dengan kata kunci "${activeSearch}".`
                  : t("team.noAgentsDesc")
              }
            />
          ) : (
            <div>
              {/* Mobile View: Card-based Agent List (Visible on < 1024px) */}
              <div className="divide-border/50 divide-y lg:hidden">
                {paginatedAgents.map((agt) => (
                  <div
                    key={agt.id}
                    className="bg-surface space-y-2.5 p-3.5 sm:p-4 dark:bg-[#161715]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-foreground truncate text-sm font-bold">
                          {agt.name}
                        </span>
                        {agt.role === "SELLER" ? (
                          <Badge variant="warning">
                            <ShieldCheck className="size-2.5" />
                            <span>{t("team.roleOwner")}</span>
                          </Badge>
                        ) : (
                          <Badge variant="wise">
                            <ShieldCheck className="size-2.5" />
                            <span>{t("team.roleAgent")}</span>
                          </Badge>
                        )}
                      </div>

                      <Badge variant="success">
                        <CheckCircle2 className="size-3" />
                        <span>{t("team.statusActive")}</span>
                      </Badge>
                    </div>

                    <div className="text-foreground-secondary space-y-0.5 text-xs">
                      <span className="text-foreground-muted block truncate font-mono text-[11px]">
                        {agt.email}
                      </span>
                      <span className="block font-mono font-medium">+{agt.phone}</span>
                    </div>

                    <div className="border-border/50 flex items-center justify-between gap-2 border-t pt-2 text-xs">
                      <div className="text-foreground-secondary flex items-center gap-1 font-mono text-xs">
                        <Smartphone className="text-foreground-muted size-3.5" />
                        <span>{agt.assignedDevicesCount} Slot Device</span>
                      </div>

                      {agt.role === "SELLER" ? (
                        <span
                          className="text-foreground-muted px-2 text-xs select-none"
                          title="Akun Utama Pemilik"
                        >
                          -
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeletingMember(agt)}
                          className="text-foreground-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition hover:bg-rose-500/10 hover:text-rose-500"
                          aria-label={`${t("actions.delete")} ${agt.name}`}
                          title="Hapus Anggota Tim"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: shadcn/ui Table (Visible on >= 1024px) */}
              <div className="hidden overflow-x-auto lg:block">
                <Table className="min-w-187.5">
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-border hover:bg-muted/50">
                      <TableHead className="w-[30%] px-5 py-3.5">
                        <DataTableColumnHeader
                          title={t("team.tableHeaderName")}
                          columnKey="name"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                      </TableHead>
                      <TableHead className="w-[25%] px-4 py-3.5">
                        <DataTableColumnHeader
                          title={t("team.tableHeaderPhone")}
                          columnKey="phone"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                      </TableHead>
                      <TableHead className="w-[15%] px-3 py-3.5">
                        <DataTableColumnHeader
                          title={t("team.tableHeaderRole")}
                          columnKey="role"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                        />
                      </TableHead>
                      <TableHead className="w-[15%] px-3 py-3.5 text-center">
                        <DataTableColumnHeader
                          title={t("team.tableHeaderDevices")}
                          columnKey="assignedDevicesCount"
                          currentSortKey={sortKey as string}
                          currentSortOrder={sortOrder}
                          onSort={handleSort}
                          align="center"
                        />
                      </TableHead>
                      <TableHead className="w-[10%] px-3 py-3.5 text-center">
                        <div className="text-foreground-muted text-center text-[11px] font-extrabold tracking-wider uppercase select-none">
                          {t("team.tableHeaderStatus")}
                        </div>
                      </TableHead>
                      <TableHead className="w-[5%] px-5 py-3.5 text-right">
                        <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                          {t("team.tableHeaderAction")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAgents.map((agt) => (
                      <TableRow key={agt.id} className="hover:bg-muted/30 transition-colors">
                        {/* Name & Email */}
                        <TableCell className="px-5 py-3.5 align-middle">
                          <div className="space-y-0.5">
                            <span className="text-foreground block truncate text-sm font-bold sm:text-base">
                              {agt.name}
                            </span>
                            <span className="text-foreground-muted block truncate font-mono text-xs">
                              {agt.email}
                            </span>
                          </div>
                        </TableCell>

                        {/* Phone */}
                        <TableCell className="text-foreground-secondary truncate px-4 py-3.5 align-middle font-mono text-xs sm:text-sm">
                          +{agt.phone}
                        </TableCell>

                        {/* Role */}
                        <TableCell className="px-3 py-3.5 align-middle">
                          {agt.role === "SELLER" ? (
                            <Badge variant="warning">
                              <ShieldCheck className="size-3" />
                              <span>{t("team.roleOwner")}</span>
                            </Badge>
                          ) : (
                            <Badge variant="wise">
                              <ShieldCheck className="size-3" />
                              <span>{t("team.roleAgent")}</span>
                            </Badge>
                          )}
                        </TableCell>

                        {/* Devices */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="text-foreground-secondary inline-flex items-center justify-center gap-1 font-mono text-xs sm:text-sm">
                            <Smartphone className="text-foreground-muted size-3.5" />
                            <span>{agt.assignedDevicesCount} Slot</span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-3 py-3.5 text-center align-middle">
                          <div className="inline-flex items-center justify-center">
                            <Badge variant="success">
                              <CheckCircle2 className="size-3.5" />
                              <span>{t("team.statusActive")}</span>
                            </Badge>
                          </div>
                        </TableCell>

                        {/* Action */}
                        <TableCell className="px-5 py-3.5 text-right align-middle">
                          <div className="flex items-center justify-end">
                            {agt.role === "SELLER" ? (
                              <span
                                className="text-foreground-muted px-2 text-xs select-none"
                                title="Akun Utama Pemilik"
                              >
                                -
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingMember(agt)}
                                className="text-foreground-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition hover:bg-rose-500/10 hover:text-rose-500"
                                aria-label={`${t("actions.delete")} ${agt.name}`}
                                title="Hapus Anggota Tim"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Pagination Footer */}
          {total > 0 && (
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              onPageChange={(p) => setPage(p)}
              entityName="anggota tim"
            />
          )}
        </div>
      </ErrorBoundary>

      {/* Modal Add Agent */}
      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createAgent}
      />

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
