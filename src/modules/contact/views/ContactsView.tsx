"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useContacts } from "@/modules/contact/hooks/useContacts";
import { ContactTable } from "@/modules/contact/components/list/ContactTable";
import { ErrorBoundary } from "@/components/layout/shared/ErrorBoundary";
import { Contact, CreateContactInput } from "@/modules/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
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
  () =>
    import("@/modules/contact/components/modals/DeleteContactModal").then(
      (m) => m.DeleteContactModal
    ),
  { ssr: false }
);

import { Users, UserPlus, FileSpreadsheet, Download, Trash2, RefreshCw } from "lucide-react";

export function ContactsView() {
  const { t } = useI18n();
  const {
    contacts,
    filteredContacts,
    tags,
    createTag,
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
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-foreground text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl">
              {t("contact.title")}
            </h1>
            {total > 0 && (
              <span className="bg-wise-green/15 text-dark-green dark:text-wise-green border-wise-green/30 rounded-full border px-2.5 py-0.5 text-xs font-bold">
                {total}
              </span>
            )}
          </div>
          <p className="text-foreground-secondary text-xs font-semibold sm:text-sm">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={contacts.length === 0}
            className="border-border hover:border-foreground-muted h-9 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">{t("contact.exportCsv")}</span>
            <span className="sm:hidden">Ekspor</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="border-border hover:border-foreground-muted h-9 cursor-pointer gap-1.5 rounded-full px-3.5 text-xs font-bold"
          >
            <FileSpreadsheet className="text-dark-green dark:text-wise-green size-3.5" />
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
            className="ml-auto h-9 cursor-pointer gap-1.5 px-4 text-xs font-bold shadow-sm sm:ml-0"
          >
            <UserPlus className="size-4" />
            <span>{t("contact.addContact")}</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar & Actions */}
      <div className="border-border bg-surface flex flex-col justify-between gap-3 rounded-md border p-3 sm:flex-row sm:items-center sm:p-4 dark:bg-[#161715]">
        {/* Search Form with Submit Button */}
        <SearchInput
          value={searchInput}
          onChange={setSearchInput}
          onSearch={() => executeSearch(searchInput.trim())}
          onClear={() => {
            setSearchInput("");
            clearSearch();
          }}
          placeholder={t("contact.searchPlaceholder")}
          buttonText={t("contact.searchBtn")}
        />

        {/* Bulk Action & Refresh */}
        <div className="border-border/50 flex items-center justify-between gap-2 border-t pt-1 sm:justify-end sm:border-t-0 sm:pt-0">
          {selectedIds.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestBulkDelete}
              className="h-9 cursor-pointer gap-1.5 rounded-full border-rose-500/20 px-3.5 text-xs font-bold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
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
            className="border-border hover:border-foreground-muted ml-auto size-8.5 shrink-0 cursor-pointer rounded-full p-0 sm:ml-0"
            aria-label="Refresh Kontak"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {isLoading && contacts.length === 0 ? (
        <Skeleton className="h-64 w-full rounded-md" />
      ) : filteredContacts.length === 0 ? (
        <EmptyState
          icon={<Users className="size-6" />}
          title={activeSearch ? t("contact.noSearchResults") : t("contact.noContacts")}
          description={
            activeSearch
              ? `Tidak ditemukan kontak dengan kata kunci "${activeSearch}". Silakan periksa kembali ejaan atau hapus filter.`
              : t("contact.noContactsDesc")
          }
          action={
            !activeSearch && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImportModalOpen(true)}
                  className="border-border cursor-pointer gap-2 rounded-full text-xs font-bold"
                >
                  <FileSpreadsheet className="text-dark-green dark:text-wise-green size-4" />
                  <span>{t("contact.importCsv")}</span>
                </Button>
                <Button
                  variant="primaryPill"
                  size="sm"
                  onClick={() => {
                    setEditingContact(null);
                    setIsAddModalOpen(true);
                  }}
                  className="cursor-pointer gap-2 text-xs font-bold shadow-sm"
                >
                  <UserPlus className="size-4" />
                  <span>{t("contact.addContact")}</span>
                </Button>
              </div>
            )
          }
        />
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
        availableTags={tags}
        onCreateTag={createTag}
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
