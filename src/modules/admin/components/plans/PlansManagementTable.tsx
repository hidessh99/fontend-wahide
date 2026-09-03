"use client";

import React, { useState } from "react";
import { useAdminPlans } from "@/modules/admin/hooks/useAdminPlans";
import { AdminPlanItem, CreatePlanInput, UpdatePlanInput } from "@/modules/admin/types/admin.types";
import { PlanFormModal } from "./PlanFormModal";
import { DeletePlanModal } from "./DeletePlanModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { DataTablePagination } from "@/components/ui/pagination";
import {
  Search,
  X,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Layers,
  Paperclip,
  Send,
  Bot,
  Clock,
  Tag,
  Sparkles,
  Loader2,
} from "lucide-react";

export function PlansManagementTable() {
  const {
    paginatedPlans,
    isLoading,
    searchQuery,
    page,
    pageSize,
    total,
    totalPages,
    createPlan,
    updatePlan,
    deletePlan,
    executeSearch,
    clearSearch,
    setPage,
    setPageSize,
    nextPage,
    prevPage,
    fetchPlans,
  } = useAdminPlans();

  const [searchInput, setSearchInput] = useState("");
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<AdminPlanItem | null>(null);
  const [selectedPlanForDelete, setSelectedPlanForDelete] = useState<AdminPlanItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setSelectedPlanForEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (plan: AdminPlanItem) => {
    setSelectedPlanForEdit(plan);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (plan: AdminPlanItem) => {
    setSelectedPlanForDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchInput);
  };

  const handleResetSearch = () => {
    setSearchInput("");
    clearSearch();
  };

  const handleFormSubmit = async (data: CreatePlanInput) => {
    if (selectedPlanForEdit) {
      await updatePlan(selectedPlanForEdit.id, data as UpdatePlanInput);
    } else {
      await createPlan(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedPlanForDelete) {
      await deletePlan(selectedPlanForDelete.id, selectedPlanForDelete.name);
    }
  };

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  return (
    <div className="space-y-5">
      {/* Search & Action Toolbar */}
      <div className="border-border bg-surface space-y-3 rounded-xl border p-3.5 shadow-xs sm:p-4 dark:bg-[#161715]">
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan nama paket langganan..."
                className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-9 pl-10 text-xs font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
              />
              {(searchInput || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="text-foreground-muted hover:text-foreground hover:bg-muted absolute top-1/2 right-3 flex size-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition"
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
              className="h-10 shrink-0 cursor-pointer px-4 text-xs font-bold shadow-xs"
            >
              <Search className="mr-1 size-3.5" />
              <span>Cari</span>
            </Button>
          </form>

          {/* Action Buttons: Add Plan & Refresh */}
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPlans}
              disabled={isLoading}
              className="border-border hover:border-foreground-muted size-10 shrink-0 cursor-pointer rounded-full p-0"
              aria-label="Refresh Data Paket"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>

            <Button
              variant="primaryPill"
              size="sm"
              onClick={handleOpenCreate}
              className="h-10 cursor-pointer gap-1.5 px-4 text-xs font-extrabold shadow-sm"
            >
              <Plus className="size-4" />
              <span>Tambah Paket Baru</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Plans Data Table & Mobile View */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
        {isLoading ? (
          <div className="text-foreground-muted flex flex-col items-center justify-center space-y-3 py-16">
            <Loader2 className="dark:text-wise-green size-7 animate-spin text-emerald-600" />
            <span className="text-xs font-bold">Memuat daftar paket langganan...</span>
          </div>
        ) : paginatedPlans.length === 0 ? (
          <EmptyState
            icon={<Layers />}
            title="Tidak Ada Paket Ditemukan"
            description={
              searchQuery
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchQuery}".`
                : "Belum ada paket langganan yang dikonfigurasi pada sistem."
            }
          />
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="divide-border/60 divide-y lg:hidden">
              {paginatedPlans.map((p) => {
                const isFree = p.price === 0;

                return (
                  <div key={p.id} className="bg-surface space-y-3 p-4 dark:bg-[#161715]">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-muted text-foreground border-border flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-black">
                          <Layers className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground text-sm font-bold">{p.name}</span>
                            {isFree ? (
                              <Badge variant="info">Free Tier</Badge>
                            ) : (
                              <Badge variant="success">Paid Tier</Badge>
                            )}
                          </div>
                          <span className="dark:text-wise-green font-mono text-xs font-bold text-emerald-700">
                            Rp {p.price.toLocaleString("id-ID")}
                            <span className="text-foreground-muted text-[10px] font-normal">
                              {" "}
                              / bulan
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(p)}
                          className="border-border size-8 rounded-full p-0"
                          title="Ubah Paket"
                        >
                          <Edit2 className="dark:text-wise-green size-3.5 text-emerald-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDelete(p)}
                          className="border-border size-8 rounded-full p-0 text-rose-600 hover:bg-rose-500/10"
                          title="Hapus Paket"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Quotas & Limits */}
                    <div className="bg-muted/20 border-border/50 grid grid-cols-3 gap-2 rounded-lg border p-2.5 text-xs">
                      <div>
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          Kuota Pesan
                        </span>
                        <span className="text-foreground font-mono font-bold">
                          {p.monthly_message_limit.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          Slot WA
                        </span>
                        <span className="text-foreground font-mono font-bold">
                          {p.max_devices} Device
                        </span>
                      </div>
                      <div>
                        <span className="text-foreground-muted block text-[10px] font-bold uppercase">
                          CS Agent
                        </span>
                        <span className="text-foreground font-mono font-bold">
                          {p.max_agents} Agent
                        </span>
                      </div>
                    </div>

                    {/* Capabilities Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.allow_attachment && (
                        <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                          <Paperclip className="size-2.5" />
                          <span>Lampiran</span>
                        </span>
                      )}
                      {p.allow_campaign && (
                        <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                          <Send className="size-2.5" />
                          <span>Broadcast</span>
                        </span>
                      )}
                      {p.allow_autoreply && (
                        <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                          <Bot className="size-2.5" />
                          <span>Bot / Auto-Reply</span>
                        </span>
                      )}
                      {p.allow_schedule && (
                        <span className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold">
                          <Clock className="size-2.5" />
                          <span>Jadwal</span>
                        </span>
                      )}
                      {p.has_watermark ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                          <Tag className="size-2.5" />
                          <span>Watermark</span>
                        </span>
                      ) : (
                        <span className="dark:text-wise-green inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <Sparkles className="size-2.5" />
                          <span>No Watermark</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (>= 1024px) */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-border bg-muted/50 text-foreground-muted border-b text-[11px] font-extrabold tracking-wider uppercase select-none">
                    <th className="px-5 py-3.5 font-extrabold">Nama Paket</th>
                    <th className="px-4 py-3.5 text-right font-extrabold">Harga / Bulan</th>
                    <th className="px-4 py-3.5 text-right font-extrabold">Batas Kuota Pesan</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Slot WhatsApp</th>
                    <th className="px-3 py-3.5 text-center font-extrabold">Batas CS Agent</th>
                    <th className="px-4 py-3.5 font-extrabold">Fitur &amp; Kemampuan</th>
                    <th className="px-5 py-3.5 text-right font-extrabold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-border/50 divide-y text-xs font-semibold">
                  {paginatedPlans.map((p) => {
                    const isFree = p.price === 0;

                    return (
                      <tr key={p.id} className="hover:bg-muted/30 group transition-colors">
                        {/* 1. Nama Paket */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-muted text-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-black">
                              <Layers className="size-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-foreground text-sm font-bold">{p.name}</span>
                                {isFree ? (
                                  <Badge variant="info">Free</Badge>
                                ) : (
                                  <Badge variant="success">Pro</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Harga / Bulan */}
                        <td className="px-4 py-3.5 text-right font-mono font-bold">
                          <span className="dark:text-wise-green text-sm text-emerald-700">
                            Rp {p.price.toLocaleString("id-ID")}
                          </span>
                          <span className="text-foreground-muted block text-[10px] font-normal">
                            / bulan
                          </span>
                        </td>

                        {/* 3. Batas Kuota Pesan */}
                        <td className="text-foreground px-4 py-3.5 text-right font-mono font-bold">
                          <span>{p.monthly_message_limit.toLocaleString("id-ID")}</span>
                          <span className="text-foreground-muted block text-[10px] font-normal">
                            Pesan / bln
                          </span>
                        </td>

                        {/* 4. Slot WhatsApp */}
                        <td className="text-foreground px-3 py-3.5 text-center font-mono font-bold">
                          <span>{p.max_devices} Device</span>
                        </td>

                        {/* 5. Batas CS Agent */}
                        <td className="text-foreground px-3 py-3.5 text-center font-mono font-bold">
                          <span>{p.max_agents} Agent</span>
                        </td>

                        {/* 6. Fitur & Kemampuan */}
                        <td className="px-4 py-3.5">
                          <div className="flex max-w-70 flex-wrap items-center gap-1">
                            {p.allow_attachment && (
                              <span
                                className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold"
                                title="Izinkan Kirim Dokumen & Media"
                              >
                                <Paperclip className="size-2.5" />
                                <span>Lampiran</span>
                              </span>
                            )}
                            {p.allow_campaign && (
                              <span
                                className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold"
                                title="Izinkan Broadcast & Campaign"
                              >
                                <Send className="size-2.5" />
                                <span>Broadcast</span>
                              </span>
                            )}
                            {p.allow_autoreply && (
                              <span
                                className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold"
                                title="Izinkan Auto-Reply & Bot"
                              >
                                <Bot className="size-2.5" />
                                <span>Bot</span>
                              </span>
                            )}
                            {p.allow_schedule && (
                              <span
                                className="bg-muted text-foreground-secondary border-border inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold"
                                title="Izinkan Pesan Terjadwal"
                              >
                                <Clock className="size-2.5" />
                                <span>Jadwal</span>
                              </span>
                            )}
                            {p.has_watermark ? (
                              <span
                                className="inline-flex items-center gap-0.5 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400"
                                title="Dengan Watermark Broadcast"
                              >
                                <Tag className="size-2.5" />
                                <span>Watermark</span>
                              </span>
                            ) : (
                              <span
                                className="dark:text-wise-green inline-flex items-center gap-0.5 rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700"
                                title="100% Bebas Watermark"
                              >
                                <Sparkles className="size-2.5" />
                                <span>No WM</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 7. Aksi */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEdit(p)}
                              className="border-border hover:border-foreground-muted hover:bg-muted h-8 gap-1 rounded-full px-2.5 text-xs font-bold"
                              title="Ubah Konfigurasi Paket"
                            >
                              <Edit2 className="dark:text-wise-green size-3.5 text-emerald-600" />
                              <span>Ubah</span>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDelete(p)}
                              className="border-border h-8 gap-1 rounded-full px-2.5 text-xs font-bold text-rose-600 hover:border-rose-500/50 hover:bg-rose-500/10"
                              title="Hapus Paket"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Hapus</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Responsive Pagination Footer */}
        {total > 0 && (
          <div className="border-border bg-muted/20 flex flex-col items-center justify-between gap-3 border-t p-3.5 sm:flex-row sm:px-5 sm:py-3.5">
            {/* Item count summary & Page size selector */}
            <div className="text-foreground-secondary flex items-center gap-3 text-xs font-semibold">
              <span>
                Menampilkan{" "}
                <strong className="text-foreground">
                  {startItem} - {endItem}
                </strong>{" "}
                dari <strong className="text-foreground">{total}</strong> paket langganan
              </span>

              <div className="text-foreground-muted flex items-center gap-1.5 text-xs">
                <span>| Baris:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-surface border-border text-foreground h-7 cursor-pointer rounded-md border px-2 text-xs font-bold outline-none dark:bg-[#10110e]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <DataTablePagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onPrevPage={prevPage}
              onNextPage={nextPage}
              className="mx-0 w-auto"
            />
          </div>
        )}
      </div>

      {/* Add / Edit Plan Modal */}
      <PlanFormModal
        plan={selectedPlanForEdit}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Plan Confirmation Modal */}
      <DeletePlanModal
        plan={selectedPlanForDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
