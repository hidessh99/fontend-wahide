"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Conversation,
  InboxMessage,
  ConversationStatus,
} from "../types/inbox.types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

interface ChatWindowProps {
  conversation: Conversation | null;
  messages: InboxMessage[];
  isLoadingMessages: boolean;
  isSending: boolean;
  onSendReply: (text: string, mediaUrl?: string) => Promise<void>;
  onUpdateStatus: (id: string, status: ConversationStatus) => Promise<void>;
}

export function ChatWindow({
  conversation,
  messages,
  isLoadingMessages,
  isSending,
  onSendReply,
  onUpdateStatus,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20">
        <MessageSquare className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-semibold text-foreground">
          Pilih Percakapan
        </h3>
        <p className="mt-1 text-xs max-w-sm">
          Pilih salah satu kontak dari daftar di sebelah kiri untuk memulai layanan
          percakapan langsung (Omnichannel Live CS).
        </p>
      </div>
    );
  }

  const contactName =
    conversation.contact?.name || conversation.contact?.phone || "Kontak Tanpa Nama";

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const textToSend = inputText;
    setInputText("");
    await onSendReply(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "READ":
        return <CheckCheck className="h-3 w-3 text-sky-400" />;
      case "DELIVERED":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "SENT":
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case "FAILED":
        return <AlertCircle className="h-3 w-3 text-rose-500" />;
      default:
        return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            {contactName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {contactName}
              </h3>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase">
                {conversation.channel_type.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {conversation.contact?.phone || "No phone"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {conversation.status === "OPEN" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(conversation.id, "RESOLVED")}
              className="h-8 gap-1.5 text-xs text-emerald-600 border-emerald-600/30 hover:bg-emerald-500/10"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Tandai Selesai
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(conversation.id, "OPEN")}
              className="h-8 gap-1.5 text-xs text-blue-600 border-blue-600/30 hover:bg-blue-500/10"
            >
              Buka Kembali
            </Button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
        {isLoadingMessages ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground animate-pulse">
            Memuat riwayat obrolan...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-xs text-muted-foreground">
            Belum ada riwayat pesan dalam percakapan ini.
          </div>
        ) : (
          messages.map((msg) => {
            const isOutbound = msg.direction === "OUTBOUND";

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2",
                  isOutbound ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs",
                    isOutbound
                      ? "rounded-br-none bg-primary text-primary-foreground"
                      : "rounded-bl-none bg-card border border-border text-foreground",
                  )}
                >
                  {/* Media Preview if attached */}
                  {msg.media_url && (
                    <div className="mb-2 overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={msg.media_url}
                        alt="Attachment"
                        className="max-h-60 w-auto rounded object-cover cursor-pointer"
                        onClick={() => window.open(msg.media_url!, "_blank")}
                      />
                    </div>
                  )}

                  {/* Body Text */}
                  <p className="whitespace-pre-wrap leading-relaxed break-words">
                    {msg.message_body}
                  </p>

                  {/* Timestamp & Delivery status */}
                  <div
                    className={cn(
                      "mt-1 flex items-center justify-end gap-1 text-[10px]",
                      isOutbound ? "text-primary-foreground/75" : "text-muted-foreground",
                    )}
                  >
                    <span>{formatMessageTime(msg.timestamp)}</span>
                    {isOutbound && renderStatusIcon(msg.status)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="border-t border-border bg-card p-3">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <Textarea
              placeholder="Ketik balasan pesan Anda di sini... (Enter untuk kirim, Shift+Enter untuk baris baru)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="resize-none text-xs"
            />
          </div>

          <Button
            type="submit"
            disabled={!inputText.trim() || isSending}
            size="sm"
            className="h-10 px-4 shrink-0 gap-1.5"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Kirim</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
