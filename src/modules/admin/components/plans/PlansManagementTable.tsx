"use client";

import React, { useState } from "react";
import { useAdminPlans } from "@/modules/admin/hooks/useAdminPlans";
import { AdminPlanItem, CreatePlanInput, UpdatePlanInput } from "@/modules/admin/types/admin.types";
import { PlanFormModal } from "./PlanFormModal";
import { DeletePlanModal } from "./DeletePlanModal";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Layers,
  ChevronLeft,
  ChevronRight,
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

  // Pagination numbers
  const pageNumbers: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-5">
      {/* Search & Action Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berdasarkan nama paket langganan..."
                className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs"
              />
              {(searchInput || searchQuery) && (
                <button
                  type="button"
                  onClick={handleResetSearch}
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

          {/* Action Buttons: Add Plan & Refresh */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPlans}
              disabled={isLoading}
              className="rounded-full size-10 p-0 border-border hover:border-foreground-muted cursor-pointer shrink-0"
              aria-label="Refresh Data Paket"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>

            <Button
              variant="primaryPill"
              size="sm"
              onClick={handleOpenCreate}
              className="h-10 px-4 text-xs font-extrabold gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Tambah Paket Baru</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Plans Data Table & Mobile View */}
      <div className="rounded-xl border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-foreground-muted">
            <Loader2 className="size-7 animate-spin text-emerald-600 dark:text-wise-green" />
            <span className="text-xs font-bold">Memuat daftar paket langganan...</span>
          </div>
        ) : paginatedPlans.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Layers className="size-8 mx-auto text-foreground-muted" />
            <div className="text-xs font-bold text-foreground">Tidak Ada Paket Ditemukan</div>
            <p className="text-[11px] text-foreground-muted max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchQuery}".`
                : "Belum ada paket langganan yang dikonfigurasi pada sistem."}
            </p>
          </div>
        ) : (
          <div>
            {/* Mobile View: Cards (< 1024px) */}
            <div className="lg:hidden divide-y divide-border/60">
              {paginatedPlans.map((p) => {
                const isFree = p.price === 0;

                return (
                  <div key={p.id} className="p-4 space-y-3 bg-surface dark:bg-[#161715]">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-full bg-muted flex items-center justify-center font-black text-xs text-foreground shrink-0 border border-border">
                          <Layers className="size-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">{p.name}</span>
                            {isFree ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                Free Tier
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/20">
                                Paid Tier
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold font-mono text-emerald-700 dark:text-wise-green">
                            Rp {p.price.toLocaleString("id-ID")}
                            <span className="text-[10px] font-normal text-foreground-muted"> / bulan</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEdit(p)}
                          className="size-8 rounded-full p-0 border-border"
                          title="Ubah Paket"
                        >
                          <Edit2 className="size-3.5 text-emerald-600 dark:text-wise-green" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDelete(p)}
                          className="size-8 rounded-full p-0 border-border text-rose-600 hover:bg-rose-500/10"
                          title="Hapus Paket"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Quotas & Limits */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-muted/20 border border-border/50 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                          Kuota Pesan
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          {p.monthly_message_limit.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                          Slot WA
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          {p.max_devices} Device
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-foreground-muted block">
                          CS Agent
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          {p.max_agents} Agent
                        </span>
                      </div>
                    </div>

                    {/* Capabilities Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.allow_attachment && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-foreground-secondary border border-border">
                          <Paperclip className="size-2.5" />
                          <span>Lampiran</span>
                        </span>
                      )}
                      {p.allow_campaign && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-foreground-secondary border border-border">
                          <Send className="size-2.5" />
                          <span>Broadcast</span>
                        </span>
                      )}
                      {p.allow_autoreply && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-foreground-secondary border border-border">
                          <Bot className="size-2.5" />
                          <span>Bot / Auto-Reply</span>
                        </span>
                      )}
                      {p.allow_schedule && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-foreground-secondary border border-border">
                          <Clock className="size-2.5" />
                          <span>Jadwal</span>
                        </span>
                      )}
                      {p.has_watermark ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                          <Tag className="size-2.5" />
                          <span>Watermark</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/20">
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
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-[11px] font-extrabold uppercase tracking-wider text-foreground-muted select-none">
                    <th className="py-3.5 px-5 font-extrabold">Nama Paket</th>
                    <th className="py-3.5 px-4 font-extrabold text-right">Harga / Bulan</th>
                    <th className="py-3.5 px-4 font-extrabold text-right">Batas Kuota Pesan</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Slot WhatsApp</th>
                    <th className="py-3.5 px-3 font-extrabold text-center">Batas CS Agent</th>
                    <th className="py-3.5 px-4 font-extrabold">Fitur &amp; Kemampuan</th>
                    <th className="py-3.5 px-5 font-extrabold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-xs font-semibold">
                  {paginatedPlans.map((p) => {
                    const isFree = p.price === 0;

                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* 1. Nama Paket */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full bg-muted flex items-center justify-center font-black text-xs text-foreground shrink-0 border border-border">
                              <Layers className="size-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground text-sm">
                                  {p.name}
                                </span>
                                {isFree ? (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                    Free
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/20">
                                    Pro
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Harga / Bulan */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold">
                          <span className="text-emerald-700 dark:text-wise-green text-sm">
                            Rp {p.price.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[10px] text-foreground-muted block font-normal">
                            / bulan
                          </span>
                        </td>

                        {/* 3. Batas Kuota Pesan */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                          <span>{p.monthly_message_limit.toLocaleString("id-ID")}</span>
                          <span className="text-[10px] text-foreground-muted block font-normal">
                            Pesan / bln
                          </span>
                        </td>

                        {/* 4. Slot WhatsApp */}
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-foreground">
                          <span>{p.max_devices} Device</span>
                        </td>

                        {/* 5. Batas CS Agent */}
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-foreground">
                          <span>{p.max_agents} Agent</span>
                        </td>

                        {/* 6. Fitur & Kemampuan */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1 max-w-70">
                            {p.allow_attachment && (
                              <span
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground-secondary border border-border"
                                title="Izinkan Kirim Dokumen & Media"
                              >
                                <Paperclip className="size-2.5" />
                                <span>Lampiran</span>
                              </span>
                            )}
                            {p.allow_campaign && (
                              <span
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground-secondary border border-border"
                                title="Izinkan Broadcast & Campaign"
                              >
                                <Send className="size-2.5" />
                                <span>Broadcast</span>
                              </span>
                            )}
                            {p.allow_autoreply && (
                              <span
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground-secondary border border-border"
                                title="Izinkan Auto-Reply & Bot"
                              >
                                <Bot className="size-2.5" />
                                <span>Bot</span>
                              </span>
                            )}
                            {p.allow_schedule && (
                              <span
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-foreground-secondary border border-border"
                                title="Izinkan Pesan Terjadwal"
                              >
                                <Clock className="size-2.5" />
                                <span>Jadwal</span>
                              </span>
                            )}
                            {p.has_watermark ? (
                              <span
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                                title="Dengan Watermark Broadcast"
                              >
                                <Tag className="size-2.5" />
                                <span>Watermark</span>
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-wise-green border border-emerald-500/20"
                                title="100% Bebas Watermark"
                              >
                                <Sparkles className="size-2.5" />
                                <span>No WM</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 7. Aksi */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEdit(p)}
                              className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted hover:bg-muted"
                              title="Ubah Konfigurasi Paket"
                            >
                              <Edit2 className="size-3.5 text-emerald-600 dark:text-wise-green" />
                              <span>Ubah</span>
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDelete(p)}
                              className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-600"
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:px-5 sm:py-3.5 border-t border-border bg-muted/20">
            {/* Item count summary & Page size selector */}
            <div className="flex items-center gap-3 text-xs font-semibold text-foreground-secondary">
              <span>
                Menampilkan <strong className="text-foreground">{startItem} - {endItem}</strong> dari{" "}
                <strong className="text-foreground">{total}</strong> paket langganan
              </span>

              <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
                <span>| Baris:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="h-7 px-2 rounded-md bg-surface dark:bg-[#10110e] border border-border text-foreground font-bold text-xs outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Page navigation buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={page <= 1}
                className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>

              {/* Numbered Page Buttons */}
              {pageNumbers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`size-8 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                    page === p
                      ? "bg-emerald-600 dark:bg-wise-green text-white dark:text-black font-black shadow-xs"
                      : "text-foreground-secondary hover:bg-muted border border-border"
                  }`}
                >
                  {p}
                </button>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={page >= totalPages}
                className="h-8 px-2.5 rounded-full text-xs font-bold gap-1 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <span className="hidden sm:inline">Berikutnya</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
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
