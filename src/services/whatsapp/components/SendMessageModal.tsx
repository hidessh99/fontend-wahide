"use client";

import React, { useState } from "react";
import { Device } from "../types/whatsapp.types";
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
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    connectedDevices[0]?.id || ""
  );
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !message.trim()) {
      toast.error(t("whatsapp.recipientPhoneHint"));
      return;
    }

    setIsSending(true);
    try {
      // Simulate API call to POST /api/v1/wa/messages/send
      await new Promise((res) => setTimeout(res, 600));
      toast.success(t("whatsapp.sendSuccess"));
      setRecipient("");
      setMessage("");
      onClose();
    } catch {
      toast.error(t("whatsapp.qrError"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
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

        <form onSubmit={handleSend} className="space-y-4 pt-1">
          {/* Select Device */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("whatsapp.selectSenderDevice")}
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground text-xs font-semibold border border-border outline-none focus:border-wise-green"
            >
              {connectedDevices.length === 0 ? (
                <option value="">{t("whatsapp.noConnectedDevices")}</option>
              ) : (
                connectedDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} (+{d.phone || "Unknown"})
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
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-foreground-muted">
                +
              </span>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={t("whatsapp.recipientPhonePlaceholder")}
                className="w-full h-10 pl-8 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono"
              />
            </div>
            <p className="text-[11px] font-medium text-foreground-muted mt-1">
              {t("whatsapp.recipientPhoneHint")}
            </p>
          </div>

          {/* Message Text */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              {t("whatsapp.messageTextLabel")}
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("whatsapp.messageTextPlaceholder")}
              className="w-full p-3 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-semibold text-xs border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition leading-relaxed"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
              className="rounded-full text-xs font-bold px-4 border-border hover:border-foreground-muted"
            >
              {t("whatsapp.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isSending || connectedDevices.length === 0}
              className="text-xs font-bold gap-1.5 px-6 shadow-sm"
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
