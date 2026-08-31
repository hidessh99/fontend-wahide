"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useContacts } from "@/services/contact/hooks/useContacts";
import { ContactTable } from "@/services/contact/components/ContactTable";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Contact, CreateContactInput } from "@/services/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

const ContactModal = dynamic(
  () => import("@/services/contact/components/ContactModal").then((m) => m.ContactModal),
  { ssr: false }
);
const ImportCsvModal = dynamic(
  () => import("@/services/contact/components/ImportCsvModal").then((m) => m.ImportCsvModal),
  { ssr: false }
);
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  Download,
  Trash2,
  Search,
  RefreshCw,
  X,
} from "lucide-react";

export function ContactsView() {
  const { t } = useI18n();
  const {
    contacts,
    filteredContacts,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedIds,
    toggleSelectOne,
    toggleSelectAll,
    fetchContacts,
    executeSearch,
    clearSearch,
    createContact,
    updateContact,
    deleteContact,
    bulkDelete,
    importCsv,
  } = useContacts();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingContact(null);
  };

  const handleModalSubmit = async (data: CreateContactInput) => {
    if (editingContact) {
      await updateContact(editingContact.id, data);
    } else {
      await createContact(data);
    }
  };

  const handleExportCsv = () => {
    if (contacts.length === 0) return;
    const header = "name,phone,tags\n";
    const rows = contacts
      .map((c) => `"${c.name}","${c.phone}","${c.tags ? c.tags.join(";") : ""}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `contacts_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <Users className="size-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t("contact.title")}
            </h1>
          </div>
          <p className="text-sm font-semibold text-foreground-secondary max-w-2xl">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={contacts.length === 0}
            className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted"
          >
            <Download className="size-3.5" />
            <span>{t("contact.exportCsv")}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted"
          >
            <FileSpreadsheet className="size-3.5 text-wise-green" />
            <span>{t("contact.importCsv")}</span>
          </Button>

          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => {
              setEditingContact(null);
              setIsAddModalOpen(true);
            }}
            className="gap-1.5 text-xs font-bold shadow-sm"
          >
            <UserPlus className="size-4" />
            <span>{t("contact.addContact")}</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Search Form with Submit Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch();
          }}
          className="flex-1 max-w-lg flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("contact.searchPlaceholder")}
              className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-5 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
                title="Hapus Pencarian"
                aria-label="Hapus Pencarian"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isLoading}
            className="h-10 px-4.5 rounded-full text-xs font-bold gap-1.5 shrink-0 shadow-xs cursor-pointer"
          >
            <Search className="size-3.5" />
            <span>{t("contact.searchBtn") || "Cari"}</span>
          </Button>
        </form>

        {/* Bulk Delete & Refresh Actions */}
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={bulkDelete}
              className="rounded-full text-xs font-bold gap-1.5 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
            >
              <Trash2 className="size-3.5" />
              <span>{t("contact.selectedCount", { count: selectedIds.size.toString() })}</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchContacts()}
            disabled={isLoading}
            className="rounded-full size-9 p-0 border-border hover:border-foreground-muted"
            aria-label="Refresh Kontak"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {isLoading && contacts.length === 0 ? (
        <div className="h-64 rounded-md border border-border bg-surface dark:bg-[#161715] animate-pulse p-6" />
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-md border border-dashed border-border bg-surface dark:bg-[#161715]/50 space-y-4">
          <div className="size-14 rounded-full bg-wise-green/10 text-wise-green flex items-center justify-center">
            <Users className="size-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {searchQuery
                ? t("contact.noSearchResults")
                : t("contact.noContacts")}
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary">
              {searchQuery
                ? "Coba sesuaikan kata kunci pencarian nama atau nomor WhatsApp."
                : t("contact.noContactsDesc")}
            </p>
          </div>
          {!searchQuery && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportModalOpen(true)}
                className="gap-2 rounded-full text-xs font-bold border-border"
              >
                <FileSpreadsheet className="size-4 text-wise-green" />
                <span>{t("contact.importCsv")}</span>
              </Button>
              <Button
                variant="primaryPill"
                size="sm"
                onClick={() => {
                  setEditingContact(null);
                  setIsAddModalOpen(true);
                }}
                className="gap-2 text-xs font-bold shadow-sm"
              >
                <UserPlus className="size-4" />
                <span>{t("contact.addContact")}</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <ErrorBoundary fallbackTitle="Gagal Merender Tabel Kontak Virtual">
          <ContactTable
            contacts={filteredContacts}
            selectedIds={selectedIds}
            onToggleSelectOne={toggleSelectOne}
            onToggleSelectAll={toggleSelectAll}
            onEdit={handleEdit}
            onDelete={deleteContact}
          />
        </ErrorBoundary>
      )}

      {/* Add / Edit Contact Modal */}
      <ContactModal
        isOpen={isAddModalOpen}
        contact={editingContact}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
      />

      {/* Import CSV Modal */}
      <ImportCsvModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={importCsv}
      />
    </div>
  );
}
