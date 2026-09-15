"use client";

import React, { useState } from "react";
import {
  Contact,
  CreateContactInput,
  Tag,
} from "@/modules/contact/types/contact.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/context";
import { normalizePhoneNumber, isValidE164 } from "@/lib/phone";
import { CountryCodeSelector } from "@/components/shared/CountryCodeSelector";
import { PhoneWarningNotice } from "@/components/shared/PhoneWarningNotice";
import {
  CountryCodeItem,
  DEFAULT_COUNTRY,
  detectCountryFromPhone,
  checkPhoneInputWarning,
  type PhoneWarningResult,
} from "@/lib/countryCodes";
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
  const detectedInitial = contact?.phone
    ? detectCountryFromPhone(contact.phone)
    : null;
  const [selectedCountry, setSelectedCountry] = useState<CountryCodeItem>(
    detectedInitial?.country || DEFAULT_COUNTRY,
  );
  const [name, setName] = useState(contact?.name || "");
  const [phone, setPhone] = useState(
    detectedInitial ? detectedInitial.subscriberNumber : "",
  );
  const [phoneWarning, setPhoneWarning] = useState<PhoneWarningResult>({
    hasWarning: false,
    suggestedValue: "",
  });
  const initialTagIds = (contact?.tags || []).map((t) =>
    typeof t === "string" ? t : t.id,
  );
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
      setSelectedTagIds((prev) =>
        prev.includes(created.id) ? prev : [...prev, created.id],
      );
      setNewTagName("");
    } catch {
      // toast is already handled in useContacts
    } finally {
      setIsAddingTag(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.includes("+")) {
      const detected = detectCountryFromPhone(val);
      if (detected.country) {
        setSelectedCountry(detected.country);
      }
      val = detected.subscriberNumber;
    }
    val = val.replace(/[^0-9]/g, "");

    const warning = checkPhoneInputWarning(val, selectedCountry.dialCode);
    setPhoneWarning(warning);

    setPhone(val);
    if (error) setError(null);
  };

  const handleFixPhone = (suggestedValue: string) => {
    setPhone(suggestedValue);
    setPhoneWarning({ hasWarning: false, suggestedValue: "" });
    if (error) setError(null);
  };

  const handleSelectCountry = (country: CountryCodeItem) => {
    setSelectedCountry(country);
    const warning = checkPhoneInputWarning(phone, country.dialCode);
    setPhoneWarning(warning);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("contact.errNameRequired"));
      return;
    }

    // Option 2: Blokir proses jika masih ada awalan 0 atau duplikasi dial code
    const warning = checkPhoneInputWarning(phone, selectedCountry.dialCode);
    if (warning.hasWarning) {
      setError(
        warning.message ||
          "Harap perbaiki format nomor WhatsApp terlebih dahulu.",
      );
      return;
    }

    const cleanDigits = phone.replace(/[^0-9]/g, "");
    if (!cleanDigits) {
      setError(t("contact.errPhonePrefix"));
      return;
    }

    const fullPhone = `${selectedCountry.dialCode}${cleanDigits}`;
    const cleanPhone = normalizePhoneNumber(fullPhone);
    if (!isValidE164(cleanPhone)) {
      setError(t("contact.errPhonePrefix"));
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
      const msg =
        err instanceof Error ? err.message : t("contact.errSaveFailed");
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
        {error && (
          <div className="rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div>
          <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("contact.nameLabel")}
          </Label>
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
          <Label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
            {t("contact.phoneLabel")}
          </Label>
          <div className="flex h-11 w-full items-center rounded-xl border border-border bg-surface shadow-xs transition hover:border-foreground-muted focus-within:border-wise-green focus-within:ring-2 focus-within:ring-wise-green">
            <CountryCodeSelector
              selectedCountry={selectedCountry}
              onSelectCountry={handleSelectCountry}
              disabled={isLoading}
              variant="rounded"
            />
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder={
                selectedCountry.formatHint ||
                t("contact.phonePlaceholder") ||
                "812 3456 7890"
              }
              disabled={isLoading}
              className="flex-1 bg-transparent px-3 text-xs sm:text-sm font-semibold text-foreground focus:outline-none font-mono placeholder:text-foreground-muted/60"
              required
            />
          </div>
          <PhoneWarningNotice warning={phoneWarning} onFix={handleFixPhone} />
        </div>

        {/* Tag / Category Selector */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <Label className="text-foreground-secondary flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
              <TagIcon className="dark:text-wise-green size-3 text-emerald-600" />
              <span>{t("contact.tagSegmentationLabel")}</span>
            </Label>
            <span className="text-foreground-muted text-[11px]">
              {t("contact.optional")}
            </span>
          </div>

          {/* Tag Badges List */}
          <div className="flex flex-wrap gap-1.5">
            {availableTags && availableTags.length > 0 ? (
              availableTags.map((tag) => {
                const isSelected =
                  selectedTagIds.includes(tag.id) ||
                  selectedTagIds.includes(tag.name);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setSelectedTagIds((prev) =>
                        isSelected
                          ? prev.filter(
                              (id) => id !== tag.id && id !== tag.name,
                            )
                          : [...prev, tag.id],
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
      <DialogFooter className="border-border/80 bg-surface/90 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 pt-3 backdrop-blur-sm sm:p-6/90">
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
              <span>
                {contact ? t("contact.submitEdit") : t("contact.submitAdd")}
              </span>
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
      <DialogContent className="border-border bg-surface flex max-h-[90dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-md">
        {/* Sticky Modal Header */}
        <DialogHeader className="border-border/80 flex shrink-0 flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <UserPlus className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {contact
                ? t("contact.editModalTitle")
                : t("contact.addModalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {contact
                ? t("contact.editModalSubtitle")
                : t("contact.addModalSubtitle")}
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
