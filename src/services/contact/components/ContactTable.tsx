"use client";

import React, { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Contact } from "../types/contact.types";
import { useI18n } from "@/lib/i18n/context";
import { Edit2, Trash2, Check } from "lucide-react";

interface ContactTableProps {
  contacts: Contact[];
  selectedIds: Set<string>;
  onToggleSelectOne: (id: string) => void;
  onToggleSelectAll: (ids: string[]) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactTable({
  contacts,
  selectedIds,
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
    estimateSize: () => 56,
    overscan: 10,
  });

  const isAllSelected =
    contacts.length > 0 && selectedIds.size === contacts.length;

  return (
    <div className="rounded-md border border-border bg-surface dark:bg-[#161715] overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-3 px-4 py-3.5 bg-muted/60 border-b border-border text-xs font-bold uppercase tracking-wider text-foreground-muted select-none">
        <div className="col-span-1 flex items-center justify-center">
          <button
            type="button"
            onClick={() => onToggleSelectAll(contacts.map((c) => c.id))}
            className={`size-4 rounded border flex items-center justify-center transition cursor-pointer ${
              isAllSelected
                ? "bg-wise-green border-wise-green text-dark-green"
                : "border-foreground-muted/50 hover:border-foreground"
            }`}
            aria-label="Pilih Semua Kontak"
          >
            {isAllSelected && <Check className="size-3 stroke-3" />}
          </button>
        </div>
        <div className="col-span-6 sm:col-span-5">{t("contact.tableHeaderName")}</div>
        <div className="col-span-4 sm:col-span-5">{t("contact.tableHeaderPhone")}</div>
        <div className="col-span-1 text-right">{t("contact.tableHeaderActions")}</div>
      </div>

      {/* Virtualized Table Body */}
      <div
        ref={parentRef}
        className="overflow-auto max-h-125 relative scrollbar-thin divide-y divide-border/40"
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
                className={`grid grid-cols-12 gap-3 px-4 py-3 items-center text-xs font-semibold transition-colors ${
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
                    className={`size-4 rounded border flex items-center justify-center transition cursor-pointer ${
                      isSelected
                        ? "bg-wise-green border-wise-green text-dark-green"
                        : "border-foreground-muted/50 hover:border-foreground"
                    }`}
                    aria-label={`Pilih ${contact.name}`}
                  >
                    {isSelected && <Check className="size-3 stroke-3" />}
                  </button>
                </div>

                {/* Name Column */}
                <div className="col-span-6 sm:col-span-5 font-bold text-foreground truncate">
                  {contact.name}
                </div>

                {/* Phone Column */}
                <div className="col-span-4 sm:col-span-5 text-foreground-secondary font-mono text-[11px] truncate">
                  +{contact.phone}
                </div>

                {/* Action Buttons */}
                <div className="col-span-1 flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(contact)}
                    className="size-7 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                    aria-label={`Ubah ${contact.name}`}
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(contact.id)}
                    className="size-7 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                    aria-label={`Hapus ${contact.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
