"use client";

import React from "react";
import { Contact } from "@/modules/contact/types/contact.types";
import { useI18n } from "@/lib/i18n/context";
import { Edit2, Trash2, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTablePagination } from "@/components/ui/pagination";
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

  const { sortKey, sortOrder, handleSort, sortData } = useTableSort<Contact>({
    initialKey: "name",
    initialOrder: "asc",
  });

  const sortedContacts = sortData(contacts);

  const isAllSelected = sortedContacts.length > 0 && selectedIds.size === sortedContacts.length;

  return (
    <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-xs dark:bg-[#161715]">
      {/* Mobile View: Card-based Contact List (Visible on < 1024px) */}
      <div className="divide-border/40 divide-y lg:hidden">
        {/* Select All Bar on Mobile */}
        <div className="bg-muted/50 border-border text-foreground-muted flex items-center justify-between border-b p-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={() => onToggleSelectAll(sortedContacts.map((c) => c.id))}
              aria-label="Pilih Semua Kontak"
            />
            <span>Pilih Semua ({sortedContacts.length})</span>
          </div>
          {selectedIds.size > 0 && (
            <span className="dark:text-wise-green font-bold text-emerald-700">
              {selectedIds.size} terpilih
            </span>
          )}
        </div>

        {/* Contact Cards */}
        {sortedContacts.map((contact) => {
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

              {/* Phone and Tags */}
              <div className="space-y-1.5 pl-6.5">
                <div className="text-foreground-secondary font-mono text-xs font-semibold">
                  +{contact.phone}
                </div>

                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {contact.tags.map((tag, idx) => {
                      const tagName = typeof tag === "string" ? tag : tag.name;
                      return (
                        <span
                          key={idx}
                          className="bg-wise-green/15 dark:text-wise-green border-wise-green/30 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold text-emerald-800"
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

      {/* Desktop View: Unified Table using shadcn/ui (Visible on >= 1024px) */}
      <div className="hidden lg:block">
        <Table className="min-w-[750px]">
          <TableHeader>
            <TableRow className="bg-muted/50 border-border hover:bg-muted/50">
              <TableHead className="w-[50px] text-center">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={() => onToggleSelectAll(sortedContacts.map((c) => c.id))}
                    aria-label="Pilih Semua Kontak"
                  />
                </div>
              </TableHead>
              <TableHead className="w-[28%] px-4 py-3.5">
                <DataTableColumnHeader
                  title={t("contact.tableHeaderName")}
                  columnKey="name"
                  currentSortKey={sortKey as string}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="w-[24%] px-4 py-3.5">
                <DataTableColumnHeader
                  title={t("contact.tableHeaderPhone")}
                  columnKey="phone"
                  currentSortKey={sortKey as string}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
              </TableHead>
              <TableHead className="w-[32%] px-4 py-3.5">
                <div className="text-foreground-muted text-[11px] font-extrabold tracking-wider uppercase select-none">
                  {t("contact.tableHeaderTags")}
                </div>
              </TableHead>
              <TableHead className="w-[16%] px-5 py-3.5 text-right">
                <div className="text-foreground-muted text-right text-[11px] font-extrabold tracking-wider uppercase select-none">
                  {t("contact.tableHeaderActions")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedContacts.map((contact) => {
              const isSelected = selectedIds.has(contact.id);
              return (
                <TableRow
                  key={contact.id}
                  data-state={isSelected ? "selected" : undefined}
                  className={`border-border/40 border-b transition-colors ${
                    isSelected ? "bg-wise-green/10 dark:bg-wise-green/5" : "hover:bg-muted/40"
                  }`}
                >
                  {/* Select Checkbox */}
                  <TableCell className="w-[50px] text-center align-middle">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelectOne(contact.id)}
                        aria-label={`Pilih ${contact.name}`}
                      />
                    </div>
                  </TableCell>

                  {/* Name Column */}
                  <TableCell className="px-4 py-3.5 align-middle">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {contact.name ? (
                          contact.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="size-3.5" />
                        )}
                      </div>
                      <span className="text-foreground block truncate text-xs font-bold sm:text-sm">
                        {contact.name}
                      </span>
                    </div>
                  </TableCell>

                  {/* Phone Column */}
                  <TableCell className="text-foreground-secondary px-4 py-3.5 align-middle font-mono text-xs font-semibold tracking-wide">
                    +{contact.phone}
                  </TableCell>

                  {/* Dedicated Tags Column */}
                  <TableCell className="px-4 py-3.5 align-middle">
                    {contact.tags && contact.tags.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {contact.tags.map((tag, idx) => {
                          const tagName = typeof tag === "string" ? tag : tag.name;
                          return (
                            <span
                              key={idx}
                              className="bg-wise-green/15 dark:text-wise-green border-wise-green/30 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold text-emerald-800"
                            >
                              #{tagName}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-foreground-muted/60 text-xs font-medium italic">-</span>
                    )}
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="px-5 py-3.5 text-right align-middle">
                    <div className="flex items-center justify-end gap-1.5">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Standardized Shadcn UI Data Table Pagination Footer */}
      {total > 0 && (
        <DataTablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          entityName="kontak"
          prevText={t("contact.prevPage") || "Sebelumnya"}
          nextText={t("contact.nextPage") || "Berikutnya"}
        />
      )}
    </div>
  );
}
