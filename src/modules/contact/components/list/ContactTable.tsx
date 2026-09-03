"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Contact } from "@/modules/contact/types/contact.types";
import { useI18n } from "@/lib/i18n/context";
import { Edit2, Trash2, Check } from "lucide-react";

import { DataTablePagination } from "@/components/ui/pagination";

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

  const isAllSelected = contacts.length > 0 && selectedIds.size === contacts.length;

  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = total > 0 ? Math.min(page * pageSize, total) : 0;

  return (
    <div className="border-border bg-surface overflow-hidden rounded-md border shadow-xs dark:bg-[#161715]">
      {/* Mobile View: Card-based Contact List (Visible on < 768px) */}
      <div className="divide-border/40 divide-y md:hidden">
        {/* Select All Bar on Mobile */}
        <div className="bg-muted/50 border-border text-foreground-muted flex items-center justify-between border-b p-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSelectAll(contacts.map((c) => c.id))}
              className={`flex size-4.5 cursor-pointer items-center justify-center rounded border transition ${
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
            <span className="dark:text-wise-green font-bold text-emerald-700">
              {selectedIds.size} terpilih
            </span>
          )}
        </div>

        {/* Contact Cards */}
        {contacts.map((contact) => {
          const isSelected = selectedIds.has(contact.id);
          return (
            <div
              key={contact.id}
              className={`space-y-2 p-3.5 transition-colors ${
                isSelected
                  ? "bg-wise-green/10 dark:bg-wise-green/5"
                  : "bg-surface dark:bg-[#161715]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleSelectOne(contact.id)}
                    className={`flex size-5 shrink-0 cursor-pointer items-center justify-center rounded border transition ${
                      isSelected
                        ? "bg-wise-green border-wise-green text-dark-green"
                        : "border-foreground-muted/50 hover:border-foreground"
                    }`}
                    aria-label={`Pilih ${contact.name}`}
                  >
                    {isSelected && <Check className="size-3.5 stroke-3" />}
                  </button>
                  <span className="text-foreground truncate text-sm font-bold">{contact.name}</span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(contact)}
                    className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition"
                    aria-label={`Ubah ${contact.name}`}
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(contact)}
                    className="flex size-8 cursor-pointer items-center justify-center rounded-full text-rose-500 transition hover:bg-rose-500/10"
                    aria-label={`Hapus ${contact.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-foreground-secondary pl-7 font-mono text-xs">
                +{contact.phone}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View: Tabular Virtualized Grid (Visible on >= 768px) */}
      <div className="hidden md:block">
        {/* Table Header */}
        <div className="bg-muted/60 border-border text-foreground-muted grid grid-cols-12 gap-3 border-b px-5 py-4 text-xs font-extrabold tracking-wider uppercase select-none">
          <div className="col-span-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => onToggleSelectAll(contacts.map((c) => c.id))}
              className={`flex size-4.5 cursor-pointer items-center justify-center rounded border transition ${
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
          className="divide-border/40 relative max-h-135 scrollbar-thin divide-y overflow-auto"
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
                  className={`grid min-h-14.5 grid-cols-12 items-center gap-3 px-5 py-3.5 transition-colors ${
                    isSelected ? "bg-wise-green/10 dark:bg-wise-green/5" : "hover:bg-muted/40"
                  }`}
                >
                  {/* Select Checkbox */}
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onToggleSelectOne(contact.id)}
                      className={`flex size-4.5 cursor-pointer items-center justify-center rounded border transition ${
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
                  <div className="text-foreground col-span-5 truncate text-sm font-bold tracking-tight sm:text-base">
                    {contact.name}
                  </div>

                  {/* Phone Column */}
                  <div className="text-foreground-secondary col-span-4 truncate font-mono text-xs font-medium tracking-wide sm:text-sm">
                    +{contact.phone}
                  </div>

                  {/* Action Buttons */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(contact)}
                      className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 cursor-pointer items-center justify-center rounded-full transition"
                      aria-label={`Ubah ${contact.name}`}
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(contact)}
                      className="flex size-8 cursor-pointer items-center justify-center rounded-full text-rose-500 transition hover:bg-rose-500/10"
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
        <div className="border-border bg-muted/30 flex flex-col items-center justify-between gap-3 border-t p-3 sm:flex-row sm:px-5 sm:py-3.5">
          {/* Item count summary */}
          <div className="text-foreground-secondary text-xs font-semibold sm:text-sm">
            {t("contact.showingPagination", {
              start: String(startItem),
              end: String(endItem),
              total: String(total),
            })}
          </div>

          {/* Shadcn UI Pagination */}
          {totalPages > 1 && (
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
              prevText={t("contact.prevPage")}
              nextText={t("contact.nextPage")}
              className="mx-0 w-auto"
            />
          )}
        </div>
      )}
    </div>
  );
}
