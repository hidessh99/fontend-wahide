"use client";

import React, { useState } from "react";
import { Ticket } from "../types/support.types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { X, Send, Loader2, User, ShieldCheck } from "lucide-react";

interface TicketThreadModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onSendReply: (ticketId: string, message: string) => Promise<unknown>;
}

export function TicketThreadModal({
  ticket,
  isOpen,
  onClose,
  onSendReply,
}: TicketThreadModalProps) {
  const { t } = useI18n();
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Escape key to dismiss
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsLoading(true);
    try {
      await onSendReply(ticket.id, replyText.trim());
      setReplyText("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col justify-between rounded-md border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95 p-6 sm:p-8 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-dark-green dark:text-wise-green bg-light-mint dark:bg-wise-green/15 px-2.5 py-0.5 rounded-full border border-wise-green/30">
                {ticket.ticketNumber}
              </span>
              <span className="text-xs font-semibold text-foreground-muted">
                {ticket.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
              {ticket.subject}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
            aria-label="Tutup"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Message Thread History */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1 divide-y divide-transparent">
          {ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1 ${
                msg.isStaff ? "items-start" : "items-end"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-foreground-muted px-1">
                {msg.isStaff ? (
                  <>
                    <ShieldCheck className="size-3.5 text-dark-green dark:text-wise-green" />
                    <span className="text-dark-green dark:text-wise-green font-extrabold">{msg.senderName}</span>
                  </>
                ) : (
                  <>
                    <User className="size-3 text-foreground-muted" />
                    <span>{msg.senderName}</span>
                  </>
                )}
                <span>•</span>
                <span>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div
                className={`p-4 rounded-lg max-w-[85%] text-xs font-semibold leading-relaxed shadow-sm ${
                  msg.isStaff
                    ? "bg-muted/80 text-foreground border border-border"
                    : "bg-[#e2f7cb] dark:bg-[#005c4b]/50 text-foreground border border-[#c4e8a5] dark:border-[#005c4b]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Reply Composer */}
        <form onSubmit={handleSend} className="space-y-3 pt-3 border-t border-border">
          <div className="relative">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={t("support.replyPlaceholder")}
              disabled={isLoading}
              className="w-full p-3 pr-24 rounded-md bg-surface dark:bg-[#10110e] text-foreground font-semibold text-xs border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition"
            />
            <Button
              type="submit"
              variant="primaryPill"
              size="sm"
              disabled={isLoading || !replyText.trim()}
              className="absolute right-2.5 bottom-3.5 text-xs font-bold gap-1.5 shadow-sm h-8 px-4"
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <>
                  <Send className="size-3.5" />
                  <span>Kirim</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
