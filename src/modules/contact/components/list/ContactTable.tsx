"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Contact } from "@/modules/contact/types/contact.types";
import { useI18n } from "@/lib/i18n/context";
import { Edit2, Trash2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactTableProps {
  contacts: Contact[];
  selectedIds: Set<string>;
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onToggleSelectOne: (id: string) => void;
  onToggleSelectAll: (ids: string[]) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export function ContactTable({
  contacts,
  selectedIds,
  page = 1,
  pageSize = 10,
  total = 0,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  onToggleSelectOne,
  onToggleSelectAll,
  onEdit,
  onDelete,
}: ContactTableProps) {
  const { t } = useI18n();
  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: contacts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 5,
  });

  const isAllSelected =
    contacts.length > 0 && selectedIds.size === contacts.length;

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  return (
    <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden shadow-xs">
      {/* Mobile View: Card-based Contact List (Visible on < 768px) */}
      <div className="md:hidden divide-y divide-border/40">
        {/* Select All Bar on Mobile */}
        <div className="p-3 bg-muted/50 border-b border-border flex items-center justify-between text-xs font-bold text-foreground-muted">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSelectAll(contacts.map((c) => c.id))}
              className={`size-4.5 rounded border flex items-center justify-center transition cursor-pointer ${
                isAllSelected
                  ? "bg-wise-green border-wise-green text-dark-green"
                  : "border-foreground-muted/50 hover:border-foreground"
              }`}
              aria-label="Pilih Semua Kontak"
            >
              {isAllSelected && <Check className="size-3.5 stroke-3" />}
            </button>
            <span>Pilih Semua ({contacts.length})</span>
          </div>
          {selectedIds.size > 0 && (
            <span className="text-wise-green">{selectedIds.size} terpilih</span>
          )}
        </div>

        {/* Contact Cards */}
        {contacts.map((contact) => {
          const isSelected = selectedIds.has(contact.id);
          return (
            <div
              key={contact.id}
              className={`p-3.5 space-y-2 transition-colors ${
                isSelected
                  ? "bg-wise-green/10 dark:bg-wise-green/5"
                  : "bg-surface dark:bg-[#161715]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleSelectOne(contact.id)}
                    className={`size-5 rounded border flex items-center justify-center transition cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-wise-green border-wise-green text-dark-green"
                        : "border-foreground-muted/50 hover:border-foreground"
                    }`}
                    aria-label={`Pilih ${contact.name}`}
                  >
                    {isSelected && <Check className="size-3.5 stroke-3" />}
                  </button>
                  <span className="font-bold text-sm text-foreground truncate">
                    {contact.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEdit(contact)}
                    className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                    aria-label={`Ubah ${contact.name}`}
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(contact)}
                    className="size-8 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                    aria-label={`Hapus ${contact.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="pl-7 text-xs font-mono text-foreground-secondary">
                +{contact.phone}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View: Tabular Virtualized Grid (Visible on >= 768px) */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-4 bg-muted/60 border-b border-border text-xs font-extrabold uppercase tracking-wider text-foreground-muted select-none">
          <div className="col-span-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => onToggleSelectAll(contacts.map((c) => c.id))}
              className={`size-4.5 rounded border flex items-center justify-center transition cursor-pointer ${
                isAllSelected
                  ? "bg-wise-green border-wise-green text-dark-green"
                  : "border-foreground-muted/50 hover:border-foreground"
              }`}
              aria-label="Pilih Semua Kontak"
            >
              {isAllSelected && <Check className="size-3.5 stroke-3" />}
            </button>
          </div>
          <div className="col-span-5">{t("contact.tableHeaderName")}</div>
          <div className="col-span-4">{t("contact.tableHeaderPhone")}</div>
          <div className="col-span-2 text-right">{t("contact.tableHeaderActions")}</div>
        </div>

        {/* Virtualized Table Body */}
        <div
          ref={parentRef}
          className="overflow-auto max-h-135 relative scrollbar-thin divide-y divide-border/40"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const contact = contacts[virtualRow.index];
              if (!contact) return null;
              const isSelected = selectedIds.has(contact.id);

              return (
                <div
                  key={contact.id}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center transition-colors min-h-14.5 ${
                    isSelected
                      ? "bg-wise-green/10 dark:bg-wise-green/5"
                      : "hover:bg-muted/40"
                  }`}
                >
                  {/* Select Checkbox */}
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onToggleSelectOne(contact.id)}
                      className={`size-4.5 rounded border flex items-center justify-center transition cursor-pointer ${
                        isSelected
                          ? "bg-wise-green border-wise-green text-dark-green"
                          : "border-foreground-muted/50 hover:border-foreground"
                      }`}
                      aria-label={`Pilih ${contact.name}`}
                    >
                      {isSelected && <Check className="size-3.5 stroke-3" />}
                    </button>
                  </div>

                  {/* Name Column */}
                  <div className="col-span-5 font-bold text-sm sm:text-base text-foreground truncate tracking-tight">
                    {contact.name}
                  </div>

                  {/* Phone Column */}
                  <div className="col-span-4 text-foreground-secondary font-mono font-medium text-xs sm:text-sm tracking-wide truncate">
                    +{contact.phone}
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(contact)}
                      className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                      aria-label={`Ubah ${contact.name}`}
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(contact)}
                      className="size-8 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                      aria-label={`Hapus ${contact.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:px-5 sm:py-3.5 border-t border-border bg-muted/30">
          {/* Item count summary */}
          <div className="text-xs sm:text-sm font-semibold text-foreground-secondary">
            {t("contact.showingPagination", {
              start: String(startItem),
              end: String(endItem),
              total: String(total),
            })}
          </div>

          {/* Page buttons: Previous, Page Indicator, Next */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground-muted px-1.5 select-none">
                {t("contact.pageIndicator", {
                  page: String(page),
                  total: String(totalPages),
                })}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={onPrevPage}
                disabled={page <= 1}
                className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="size-3.5" />
                <span>{t("contact.prevPage")}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onNextPage}
                disabled={page >= totalPages}
                className="h-8.5 px-3.5 rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer disabled:opacity-40"
              >
                <span>{t("contact.nextPage")}</span>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
