"use client";

import React, { useState } from "react";
import { Contact, CreateContactInput } from "@/modules/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { UserPlus, Loader2, Save } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex-1 space-y-4 p-5 sm:p-6">
        {error && (
          <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("contact.nameLabel")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("contact.namePlaceholder")}
            disabled={isLoading}
            className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full rounded-full border px-4 text-xs font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
            autoFocus
          />
        </div>

        <div>
          <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("contact.phoneLabel")}
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("contact.phonePlaceholder")}
            disabled={isLoading}
            className="bg-surface text-foreground border-border hover:border-foreground-muted focus:border-wise-green focus:ring-wise-green h-11 w-full rounded-full border px-4 font-mono text-xs font-semibold transition outline-none focus:ring-2 dark:bg-[#10110e]"
          />
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

export function ContactModal({ isOpen, contact, onClose, onSubmit }: ContactModalProps) {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-border bg-surface max-h-[90vh] max-w-md gap-0 overflow-hidden p-0 dark:bg-[#161715]">
        {/* Sticky Modal Header */}
        <DialogHeader className="border-border/80 flex flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
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
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
