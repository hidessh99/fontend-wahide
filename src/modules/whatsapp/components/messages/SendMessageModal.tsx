"use client";

import React, { useState } from "react";
import { Device } from "@/modules/whatsapp/types/whatsapp.types";
import { whatsappApi } from "@/modules/whatsapp/api/whatsapp.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface SendMessageModalProps {
  devices: Device[];
  isOpen: boolean;
  onClose: () => void;
}

export function SendMessageModal({ devices, isOpen, onClose }: SendMessageModalProps) {
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
      toast.success(t("whatsapp.sendSuccess"), { id: "whatsapp-fast-send" });
      setRecipient("");
      setMessage("");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("whatsapp.qrError");
      toast.error(msg, { id: "whatsapp-fast-send" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSending && onClose()}>
      <DialogContent className="border-border bg-surface max-h-[90vh] max-w-lg gap-0 overflow-hidden p-0 dark:bg-[#161715]">
        {/* Sticky Header */}
        <DialogHeader className="border-border flex flex-row items-center gap-3 border-b p-5 pb-4 text-left sm:p-6">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <Send className="size-5" />
          </div>
          <div>
            <DialogTitle className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              {t("whatsapp.fastSendTitle")}
            </DialogTitle>
            <DialogDescription className="text-foreground-secondary text-xs font-semibold">
              {t("whatsapp.fastSendSubtitle")}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSend} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-4 p-5 sm:p-6">
            {/* Select Device */}
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("whatsapp.selectSenderDevice")}
              </label>
              <select
                value={activeDeviceId}
                onChange={(e) => setUserSelectedDeviceId(e.target.value)}
                className="bg-surface text-foreground border-border focus:border-wise-green h-10 w-full rounded-md border px-3 text-xs font-semibold outline-none dark:bg-[#10110e]"
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
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("whatsapp.recipientPhoneLabel")}
              </label>
              <input
                type="tel"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="6281234567890"
                className="bg-surface text-foreground border-border focus:border-wise-green h-10 w-full rounded-md border px-3 font-mono text-xs font-semibold outline-none dark:bg-[#10110e]"
                required
              />
              <span className="text-foreground-muted mt-1 block text-[11px]">
                {t("whatsapp.recipientPhoneHint")}
              </span>
            </div>

            {/* Message Body */}
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                {t("whatsapp.messageTextLabel")}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder={t("whatsapp.messageTextPlaceholder")}
                className="bg-surface text-foreground border-border focus:border-wise-green w-full resize-none rounded-md border p-3 text-xs font-semibold outline-none dark:bg-[#10110e]"
                required
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <DialogFooter className="border-border/80 bg-surface/90 m-0 flex shrink-0 flex-row items-center justify-end gap-2.5 rounded-none border-t p-4 pt-3 backdrop-blur-sm sm:p-6 dark:bg-[#161715]/90">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSending}
              className="border-border hover:border-foreground-muted cursor-pointer rounded-full px-5 text-xs font-bold"
            >
              {t("whatsapp.cancel")}
            </Button>
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isSending || connectedDevices.length === 0}
              className="cursor-pointer gap-2 rounded-full px-6 text-xs font-bold shadow-sm"
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
