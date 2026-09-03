"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Contact } from "@/modules/contact/types/contact.types";
import { useI18n } from "@/lib/i18n/context";
import { Edit2, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={() => onToggleSelectAll(contacts.map((c) => c.id))}
              aria-label="Pilih Semua Kontak"
            />
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
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelectOne(contact.id)}
                    aria-label={`Pilih ${contact.name}`}
                  />
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

              <div className="flex flex-wrap items-center gap-2 pl-7">
                <span className="text-foreground-secondary font-mono text-xs">
                  +{contact.phone}
                </span>
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((tag, idx) => {
                      const tagName = typeof tag === "string" ? tag : tag.name;
                      return (
                        <span
                          key={idx}
                          className="bg-wise-green/15 dark:text-wise-green border-wise-green/30 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold text-emerald-800"
                        >
                          #{tagName}
                        </span>
                      );
                    })}
                  </div>
                )}
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
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={() => onToggleSelectAll(contacts.map((c) => c.id))}
              aria-label="Pilih Semua Kontak"
            />
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
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelectOne(contact.id)}
                      aria-label={`Pilih ${contact.name}`}
                    />
                  </div>

                  {/* Name & Tags Column */}
                  <div className="col-span-5 min-w-0 pr-2">
                    <div className="text-foreground truncate text-sm font-bold tracking-tight sm:text-base">
                      {contact.name}
                    </div>
                    {contact.tags && contact.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {contact.tags.map((tag, idx) => {
                          const tagName = typeof tag === "string" ? tag : tag.name;
                          return (
                            <span
                              key={idx}
                              className="bg-wise-green/15 dark:text-wise-green border-wise-green/30 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold text-emerald-800"
                            >
                              #{tagName}
                            </span>
                          );
                        })}
                      </div>
                    )}
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
