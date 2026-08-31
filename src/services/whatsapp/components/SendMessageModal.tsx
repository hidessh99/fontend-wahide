"use client";

import React, { useState, useEffect } from "react";
import { Device } from "../types/whatsapp.types";
import { whatsappApi } from "../api/whatsapp.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X, Send, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface SendMessageModalProps {
  devices: Device[];
  isOpen: boolean;
  onClose: () => void;
}

export function SendMessageModal({
  devices,
  isOpen,
  onClose,
}: SendMessageModalProps) {
  const { t } = useI18n();
  const connectedDevices = devices.filter((d) => d.status === "CONNECTED");
  const [userSelectedDeviceId, setUserSelectedDeviceId] = useState<string>("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Derive the active selected device ID cleanly without cascading effects
  const activeDeviceId =
    userSelectedDeviceId && connectedDevices.some((d) => d.id === userSelectedDeviceId)
      ? userSelectedDeviceId
      : connectedDevices[0]?.id || "";

  // Escape key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !message.trim()) {
      toast.error(t("whatsapp.recipientPhoneHint"));
      return;
    }

    if (!activeDeviceId) {
      toast.error(t("whatsapp.noConnectedDevices"));
      return;
    }

    setIsSending(true);
    try {
      await whatsappApi.sendMessage({
        device_id: activeDeviceId,
        phone: recipient.trim(),
        message: message.trim(),
      });
      toast.success(t("whatsapp.sendSuccess"));
      setRecipient("");
      setMessage("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("whatsapp.qrError");
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Sticky Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 pb-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
              <Send className="size-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                {t("whatsapp.fastSendTitle")}
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                {t("whatsapp.fastSendSubtitle")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label={t("whatsapp.qrClose")}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSend} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Select Device */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("whatsapp.selectSenderDevice")}
            </label>
            <select
              value={activeDeviceId}
              onChange={(e) => setUserSelectedDeviceId(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
            >
              {connectedDevices.length === 0 ? (
                <option value="">{t("whatsapp.noConnectedDevices")}</option>
              ) : (
                connectedDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.push_name || d.name} ({d.phone ? `+${d.phone}` : "Tanpa Nomor"})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Recipient Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("whatsapp.recipientPhoneLabel")}
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={t("whatsapp.recipientPhonePlaceholder")}
              className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
              required
            />
            <p className="text-[11px] text-foreground-muted mt-1">
              {t("whatsapp.recipientPhoneHint")}
            </p>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("whatsapp.messageTextLabel")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder={t("whatsapp.messageTextPlaceholder")}
              className="w-full p-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
              className="rounded-full text-xs font-bold px-5 border-border hover:border-foreground-muted cursor-pointer"
            >
              {t("whatsapp.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isSending || connectedDevices.length === 0}
              className="rounded-full text-xs font-bold gap-2 px-6 shadow-sm cursor-pointer"
            >
              {isSending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>{t("whatsapp.submittingSend")}</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>{t("whatsapp.submitSend")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
