"use client";

import React, { useState } from "react";
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
import { CreateAgentInput } from "../../types/team.types";
import { Users, ShieldCheck, Loader2 } from "lucide-react";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAgentInput) => Promise<unknown>;
}

export function AddTeamMemberModal({ isOpen, onClose, onSubmit }: AddTeamMemberModalProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setPasswordError(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    if (!password.trim() || password.trim().length < 6) {
      setPasswordError("Password akun agen wajib diisi minimal 6 karakter");
      return;
    }

    setPasswordError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: "AGENT",
        password: password.trim(),
      });
      resetForm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-border bg-surface max-h-[90vh] max-w-md gap-0 overflow-y-auto rounded-xl p-0 shadow-2xl dark:bg-[#161715]">
        <DialogHeader className="border-border flex flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <Users className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight">
              {t("team.modalTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("team.modalSubtitle")}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-6">
          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("team.nameLabel")}
            </label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("team.namePlaceholder")}
              variant="pill"
            />
          </div>

          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("team.emailLabel")}
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("team.emailPlaceholder")}
              variant="pill"
            />
          </div>

          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("team.phoneLabel")}
            </label>
            <Input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("team.phonePlaceholder")}
              variant="pill"
              className="font-mono"
            />
          </div>

          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("team.roleLabel")}
            </label>
            <div className="bg-muted/60 text-foreground border-border flex h-10 w-full items-center gap-2 rounded-full border px-4 text-xs font-bold select-none">
              <ShieldCheck className="text-wise-green size-4" />
              <span>{t("team.roleAgent")}</span>
            </div>
          </div>

          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              {t("team.passwordLabel")} <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              placeholder={t("team.passwordPlaceholder")}
              variant="pill"
              isError={!!passwordError}
            />
            {passwordError && (
              <p className="mt-1.5 pl-3 text-xs font-semibold text-rose-500">{passwordError}</p>
            )}
          </div>

          <DialogFooter className="border-border/80 flex items-center justify-end gap-2.5 border-t pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-border hover:border-foreground-muted rounded-full px-4 text-xs font-bold"
            >
              {t("team.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 px-6 text-xs font-bold shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("team.submitting")}</span>
                </>
              ) : (
                <span>{t("team.submitCreate")}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
