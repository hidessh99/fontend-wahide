"use client";

import React, { useState } from "react";
import { Contact, CreateContactInput, Tag } from "@/modules/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { UserPlus, Loader2, Save, Tag as TagIcon, Plus } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  contact?: Contact | null;
  availableTags?: Tag[];
  onCreateTag?: (name: string) => Promise<Tag>;
  onClose: () => void;
  onSubmit: (data: CreateContactInput) => Promise<unknown>;
}

function ContactForm({
  contact,
  availableTags = [],
  onCreateTag,
  onClose,
  onSubmit,
}: {
  contact?: Contact | null;
  availableTags?: Tag[];
  onCreateTag?: (name: string) => Promise<Tag>;
  onClose: () => void;
  onSubmit: (data: CreateContactInput) => Promise<unknown>;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(contact?.name || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const initialTagIds = (contact?.tags || []).map((t) => (typeof t === "string" ? t : t.id));
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  const [newTagName, setNewTagName] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNewTag = async () => {
    if (!newTagName.trim() || isAddingTag || !onCreateTag) return;
    setIsAddingTag(true);
    try {
      const created = await onCreateTag(newTagName.trim());
      setSelectedTagIds((prev) => (prev.includes(created.id) ? prev : [...prev, created.id]));
      setNewTagName("");
    } catch {
      // toast is already handled in useContacts
    } finally {
      setIsAddingTag(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("contact.errNameRequired"));
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone.startsWith("62")) {
      setError(t("contact.errPhonePrefix"));
      return;
    }

    if (cleanPhone.length < 10) {
      setError(t("contact.errPhoneTooShort"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        phone: cleanPhone,
        tag_ids: selectedTagIds,
        tags: selectedTagIds,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("contact.errSaveFailed");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
        {error && (
          <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("contact.nameLabel")}
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("contact.namePlaceholder")}
            disabled={isLoading}
            variant="pill"
            autoFocus
          />
        </div>

        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("contact.phoneLabel")}
          </label>
          <Input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("contact.phonePlaceholder")}
            disabled={isLoading}
            variant="pill"
            className="font-mono"
          />
        </div>

        {/* Tag / Category Selector */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-foreground-secondary flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
              <TagIcon className="dark:text-wise-green size-3 text-emerald-600" />
              <span>{t("contact.tagSegmentationLabel")}</span>
            </label>
            <span className="text-foreground-muted text-[11px]">{t("contact.optional")}</span>
          </div>

          {/* Tag Badges List */}
          <div className="flex flex-wrap gap-1.5">
            {availableTags && availableTags.length > 0 ? (
              availableTags.map((tag) => {
                const isSelected =
                  selectedTagIds.includes(tag.id) || selectedTagIds.includes(tag.name);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedTagIds((prev) =>
                        isSelected
                          ? prev.filter((id) => id !== tag.id && id !== tag.name)
                          : [...prev, tag.id]
                      );
                    }}
                    className={`inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      isSelected
                        ? "bg-wise-green border-wise-green font-bold text-black shadow-xs"
                        : "bg-surface-secondary text-foreground-secondary border-border hover:border-foreground-muted hover:text-foreground"
                    }`}
                  >
                    <span>#{tag.name}</span>
                  </button>
                );
              })
            ) : (
              <p className="text-foreground-muted py-0.5 text-xs italic">
                {t("contact.noTagsAvailable")}
              </p>
            )}
          </div>

          {/* Quick Create Tag Input */}
          {onCreateTag && (
            <div className="flex items-center gap-2 pt-1">
              <Input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateNewTag();
                  }
                }}
                placeholder={t("contact.newTagPlaceholder")}
                disabled={isAddingTag || isLoading}
                variant="pill"
                className="h-9.5 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!newTagName.trim() || isAddingTag || isLoading}
                onClick={handleCreateNewTag}
                className="border-border hover:border-foreground-muted h-9.5 cursor-pointer rounded-full px-3.5 text-xs font-bold"
              >
                {isAddingTag ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-1 size-3.5" />
                    <span>{t("contact.addTagBtn")}</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Modal Footer */}
      <DialogFooter className="border-border/80 bg-surface/90 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 pt-3 backdrop-blur-sm sm:p-6 dark:bg-[#161715]/90">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
          className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-4 text-xs font-bold"
        >
          {t("contact.cancel")}
        </Button>
        <Button
          type="submit"
          variant="primaryPill"
          size="sm"
          disabled={isLoading}
          className="cursor-pointer gap-1.5 px-5 text-xs font-bold shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>{t("contact.submitting")}</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>{contact ? t("contact.submitEdit") : t("contact.submitAdd")}</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ContactModal({
  isOpen,
  contact,
  availableTags,
  onCreateTag,
  onClose,
  onSubmit,
}: ContactModalProps) {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md dark:bg-[#161715]">
        {/* Sticky Modal Header */}
        <DialogHeader className="border-border/80 flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <UserPlus className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {contact ? t("contact.editModalTitle") : t("contact.addModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {contact ? t("contact.editModalSubtitle") : t("contact.addModalSubtitle")}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Form Content Component with key for automatic state mount/unmount */}
        <ContactForm
          key={contact?.id || "new-contact"}
          contact={contact}
          availableTags={availableTags}
          onCreateTag={onCreateTag}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
