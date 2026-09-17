"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Template,
  TemplateChannelType,
  CreateTemplateInput,
  UpdateTemplateInput,
} from "../../types/template.types";
import { useTemplates } from "../../hooks/useTemplates";
import { TemplateFilterBar } from "../../components/seller/TemplateFilterBar";
import { TemplateCard } from "../../components/seller/TemplateCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  LayoutTemplate,
  Plus,
  RefreshCw,
  FolderOpen,
  Globe,
  Smartphone,
  Bot,
  ShieldCheck,
} from "lucide-react";

const TemplateEditorModal = dynamic(
  () =>
    import("../../components/seller/TemplateEditorModal").then(
      (m) => m.TemplateEditorModal,
    ),
  { ssr: false },
);

const DeleteTemplateModal = dynamic(
  () =>
    import("../../components/seller/DeleteTemplateModal").then(
      (m) => m.DeleteTemplateModal,
    ),
  { ssr: false },
);

export interface TemplateSellerLibraryViewProps {
  initialChannel?: TemplateChannelType | "ALL";
  lockChannel?: TemplateChannelType;
  title?: string;
  description?: string;
}

export function TemplateSellerLibraryView({
  initialChannel,
  lockChannel,
  title,
  description,
}: TemplateSellerLibraryViewProps = {}) {
  const { t } = useI18n();
  const effectiveChannel = lockChannel || initialChannel || "ALL";
  const {
    templates,
    isLoading,
    category,
    search,
    channelType,
    favoriteOnly,
    page,
    totalPages,
    total,
    stats,
    handleCategoryChange,
    handleSearchChange,
    handleChannelTypeChange,
    handleFavoriteOnlyToggle,
    goToPage,
    createTemplate,
    updateTemplate,
    duplicateTemplate,
    deleteTemplate,
    toggleFavorite,
    reload,
  } = useTemplates(effectiveChannel);

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  const [deletingTemplate, setDeletingTemplate] = useState<Template | null>(
    null,
  );

  const handleOpenNew = () => {
    setEditingTemplate(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (template: Template) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  };

  const handleConfirmDelete = async (): Promise<boolean> => {
    if (!deletingTemplate) return false;
    const ok = await deleteTemplate(deletingTemplate.id);
    if (ok) setDeletingTemplate(null);
    return ok;
  };

  const handleSaveModal = async (
    data: CreateTemplateInput | UpdateTemplateInput,
  ): Promise<boolean> => {
    if (editingTemplate && editingTemplate.id) {
      return await updateTemplate(editingTemplate.id, data as UpdateTemplateInput);
    } else {
      return await createTemplate(data as CreateTemplateInput);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start justify-between gap-3 sm:block">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <LayoutTemplate className="h-7 w-7 text-emerald-600 dark:text-emerald-500" />
              {title || t("template.title")}
            </h1>
            <p className="text-xs sm:text-sm text-foreground-muted mt-1">
              {description || t("template.subtitle")}
            </p>
          </div>

          {/* Mobile-Only Header Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => reload()}
            disabled={isLoading}
            className="size-9 shrink-0 rounded-full border-border/70 text-xs cursor-pointer sm:hidden"
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Desktop-Only Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => reload()}
            disabled={isLoading}
            className="hidden sm:inline-flex h-9 gap-1.5 rounded-full border-border/70 text-xs cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          {/* Primary Action Button */}
          <Button
            type="button"
            variant="primaryPill"
            size="sm"
            onClick={handleOpenNew}
            className="h-10 sm:h-9 gap-2 px-5 text-xs font-bold shadow-xs w-full sm:w-auto cursor-pointer justify-center rounded-full"
          >
            <Plus className="size-4" />
            <span>{t("template.actions.createNew")}</span>
          </Button>
        </div>
      </div>

      {/* Omnichannel Channel Filter Tabs (Only shown on Global Library /templates when channel is not locked) */}
      {!lockChannel && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/70 scrollbar-none">
          {[
            { id: "ALL", label: "Semua Saluran", icon: Globe },
            { id: "WHATSMEOW_UNOFFICIAL", label: "WhatsApp Web", icon: Smartphone },
            { id: "TELEGRAM_BOT", label: "Telegram Bot", icon: Bot },
            { id: "META_WABA_OFFICIAL", label: "Meta WABA", icon: ShieldCheck },
          ].map((ch) => {
            const Icon = ch.icon;
            const isActive = channelType === ch.id;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() =>
                  handleChannelTypeChange(ch.id as TemplateChannelType | "ALL")
                }
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer shrink-0 border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-muted/40 hover:bg-muted text-foreground-secondary border-border/60",
                )}
              >
                <Icon className="size-3.5" />
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Filter & Search Bar */}
      <TemplateFilterBar
        currentCategory={category}
        search={search}
        favoriteOnly={favoriteOnly}
        onSelectCategory={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onToggleFavoriteOnly={handleFavoriteOnlyToggle}
        stats={stats}
      />

      {/* Main Grid / Loading Skeleton / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <Skeleton key={idx} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="size-8 text-foreground-muted" />}
          title={
            search || category !== "ALL" || favoriteOnly
              ? "Tidak Ada Template yang Cocok"
              : t("template.empty.title")
          }
          description={
            search || category !== "ALL" || favoriteOnly
              ? "Coba sesuaikan kata kunci pencarian atau reset filter kategori untuk menemukan template yang Anda cari."
              : t("template.empty.subtitle")
          }
          action={
            <Button
              type="button"
              variant="primaryPill"
              size="sm"
              onClick={handleOpenNew}
              className="gap-2 px-5 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              <span>{t("template.actions.createNew")}</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onEdit={handleOpenEdit}
              onDuplicate={(id: string) => duplicateTemplate(id)}
              onDelete={(_id: string, _name: string) => setDeletingTemplate(tpl)}
              onToggleFavorite={(t: Template) => toggleFavorite(t)}
            />
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-4 border-t border-border">
          <span className="text-foreground-muted">
            Menampilkan halaman {page} dari {totalPages} ({total} template)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="h-8 text-xs rounded-full"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
              className="h-8 text-xs rounded-full"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      <TemplateEditorModal
        isOpen={isEditorOpen}
        initialData={editingTemplate}
        lockChannel={lockChannel}
        onClose={() => setIsEditorOpen(false)}
        onSubmit={handleSaveModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTemplateModal
        isOpen={Boolean(deletingTemplate)}
        onClose={() => setDeletingTemplate(null)}
        onConfirm={handleConfirmDelete}
        templateName={deletingTemplate?.name || ""}
      />
    </div>
  );
}

export default TemplateSellerLibraryView;
