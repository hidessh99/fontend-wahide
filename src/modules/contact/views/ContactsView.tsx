"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useContacts } from "@/modules/contact/hooks/useContacts";
import { ContactTable } from "@/modules/contact/components/list/ContactTable";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Contact, CreateContactInput } from "@/modules/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

const ContactModal = dynamic(
  () => import("@/modules/contact/components/modals/ContactModal").then((m) => m.ContactModal),
  { ssr: false }
);
const ImportCsvModal = dynamic(
  () => import("@/modules/contact/components/modals/ImportCsvModal").then((m) => m.ImportCsvModal),
  { ssr: false }
);
const DeleteContactModal = dynamic(
  () => import("@/modules/contact/components/modals/DeleteContactModal").then((m) => m.DeleteContactModal),
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
    activeSearch,
    page,
    pageSize,
    total,
    totalPages,
    nextPage,
    prevPage,
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

  const [searchInput, setSearchInput] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Delete Confirmation States
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

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

  const handleRequestDelete = (contact: Contact) => {
    setDeletingContact(contact);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteSingle = async () => {
    if (!deletingContact) return;
    await deleteContact(deletingContact.id);
    setDeletingContact(null);
  };

  const handleRequestBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    await bulkDelete();
    setIsBulkDeleteModalOpen(false);
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
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              {t("contact.title")}
            </h1>
            {total > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30">
                {total}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={contacts.length === 0}
            className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer h-9 px-3.5"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">{t("contact.exportCsv")}</span>
            <span className="sm:hidden">Ekspor</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted cursor-pointer h-9 px-3.5"
          >
            <FileSpreadsheet className="size-3.5 text-dark-green dark:text-wise-green" />
            <span className="hidden sm:inline">{t("contact.importCsv")}</span>
            <span className="sm:hidden">Impor</span>
          </Button>

          <Button
            variant="primaryPill"
            size="sm"
            onClick={() => {
              setEditingContact(null);
              setIsAddModalOpen(true);
            }}
            className="gap-1.5 text-xs font-bold shadow-sm cursor-pointer h-9 px-4 ml-auto sm:ml-0"
          >
            <UserPlus className="size-4" />
            <span>{t("contact.addContact")}</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-md border border-border bg-surface dark:bg-[#161715]">
        {/* Search Form with Submit Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch(searchInput);
          }}
          className="flex-1 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("contact.searchPlaceholder")}
              className="w-full h-10 pl-10 pr-9 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
            />
            {(searchInput || activeSearch) && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  clearSearch();
                }}
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
            <span>{t("contact.searchBtn")}</span>
          </Button>
        </form>

        {/* Bulk Action & Refresh */}
        <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
          {selectedIds.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestBulkDelete}
              className="rounded-full text-xs font-bold gap-1.5 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/10 cursor-pointer h-9 px-3.5"
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
            className="rounded-full size-8.5 p-0 border-border hover:border-foreground-muted cursor-pointer shrink-0 ml-auto sm:ml-0"
            aria-label="Refresh Kontak"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {isLoading && contacts.length === 0 ? (
        <div className="h-64 rounded-md border border-border bg-surface dark:bg-[#161715] animate-pulse p-6" />
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center rounded-md border border-dashed border-border bg-surface dark:bg-[#161715]/50 space-y-3">
          <div className="size-12 rounded-full bg-wise-green/10 text-dark-green dark:text-wise-green flex items-center justify-center">
            <Users className="size-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-extrabold text-base sm:text-lg text-foreground">
              {activeSearch
                ? t("contact.noSearchResults")
                : t("contact.noContacts")}
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary">
              {activeSearch
                ? `Tidak ditemukan kontak dengan kata kunci "${activeSearch}". Silakan periksa kembali ejaan atau hapus filter.`
                : t("contact.noContactsDesc")}
            </p>
          </div>
          {!activeSearch && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportModalOpen(true)}
                className="gap-2 rounded-full text-xs font-bold border-border cursor-pointer"
              >
                <FileSpreadsheet className="size-4 text-dark-green dark:text-wise-green" />
                <span>{t("contact.importCsv")}</span>
              </Button>
              <Button
                variant="primaryPill"
                size="sm"
                onClick={() => {
                  setEditingContact(null);
                  setIsAddModalOpen(true);
                }}
                className="gap-2 text-xs font-bold shadow-sm cursor-pointer"
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
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            onToggleSelectOne={toggleSelectOne}
            onToggleSelectAll={toggleSelectAll}
            onEdit={handleEdit}
            onDelete={handleRequestDelete}
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

      {/* Single Contact Delete Confirmation Modal */}
      <DeleteContactModal
        isOpen={isDeleteModalOpen}
        contact={deletingContact}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingContact(null);
        }}
        onConfirm={handleConfirmDeleteSingle}
      />

      {/* Bulk Delete Contacts Confirmation Modal */}
      <DeleteContactModal
        isOpen={isBulkDeleteModalOpen}
        isBulk
        bulkCount={selectedIds.size}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
      />
    </div>
  );
}
