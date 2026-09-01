"use client";

import React, { useState } from "react";
import { Contact, CreateContactInput } from "@/services/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { X, UserPlus, Loader2, Save } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  contact?: Contact | null;
  onClose: () => void;
  onSubmit: (data: CreateContactInput) => Promise<unknown>;
}

function ContactForm({
  contact,
  onClose,
  onSubmit,
}: {
  contact?: Contact | null;
  onClose: () => void;
  onSubmit: (data: CreateContactInput) => Promise<unknown>;
}) {
  const { t } = useI18n();
  const [name, setName] = useState(contact?.name || "");
  const [phone, setPhone] = useState(contact?.phone || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama kontak wajib diisi.");
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone.startsWith("62")) {
      setError("Nomor WhatsApp wajib diawali 62 (contoh: 6281234567890).");
      return;
    }

    if (cleanPhone.length < 10) {
      setError("Nomor WhatsApp terlalu pendek.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        phone: cleanPhone,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan kontak";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-0">
      <div className="p-5 sm:p-6 space-y-4 flex-1">
        {error && (
          <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
            {t("contact.nameLabel")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("contact.namePlaceholder")}
            disabled={isLoading}
            className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
            {t("contact.phoneLabel")}
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("contact.phonePlaceholder")}
            disabled={isLoading}
            className="w-full h-11 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono"
          />
        </div>
      </div>

      {/* Sticky Modal Footer */}
      <div className="p-4 sm:p-6 pt-3 border-t border-border/80 bg-surface/90 dark:bg-[#161715]/90 backdrop-blur-sm flex items-center justify-end gap-2.5 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-full text-xs font-bold px-4 border-border hover:border-foreground-muted cursor-pointer"
        >
          {t("contact.cancel")}
        </Button>
        <Button
          type="submit"
          variant="primaryPill"
          size="sm"
          disabled={isLoading}
          className="text-xs font-bold gap-1.5 px-5 shadow-sm cursor-pointer"
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
      </div>
    </form>
  );
}

export function ContactModal({
  isOpen,
  contact,
  onClose,
  onSubmit,
}: ContactModalProps) {
  const { t } = useI18n();

  // Escape key to dismiss
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Sticky Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border/80 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center shrink-0">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {contact ? t("contact.editModalTitle") : t("contact.addModalTitle")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {contact ? t("contact.editModalSubtitle") : t("contact.addModalSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Content Component with key for automatic state mount/unmount */}
        <ContactForm
          key={contact?.id || "new-contact"}
          contact={contact}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
