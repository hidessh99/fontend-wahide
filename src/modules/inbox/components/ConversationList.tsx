"use client";

import React from "react";
import {
  Conversation,
  ChannelType,
  ConversationStatus,
} from "../types/inbox.types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Search,
  MessageSquare,
  Bot,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  statusFilter: ConversationStatus | "ALL";
  setStatusFilter: (status: ConversationStatus | "ALL") => void;
  channelFilter: ChannelType | "ALL";
  setChannelFilter: (channel: ChannelType | "ALL") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  isLoading,
  statusFilter,
  setStatusFilter,
  channelFilter,
  setChannelFilter,
  searchQuery,
  setSearchQuery,
}: ConversationListProps) {
  const getChannelBadge = (type: ChannelType) => {
    switch (type) {
      case "WHATSMEOW_UNOFFICIAL":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <Smartphone className="h-3 w-3" /> WA Socket
          </span>
        );
      case "META_WABA_OFFICIAL":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
            <MessageSquare className="h-3 w-3" /> WABA
          </span>
        );
      case "TELEGRAM_BOT":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-medium text-sky-600 dark:text-sky-400">
            <Bot className="h-3 w-3" /> Telegram
          </span>
        );
      default:
        return null;
    }
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Header & Search */}
      <div className="space-y-3 p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Live Chat CS</h2>
          <span className="text-xs text-muted-foreground">
            {conversations.length} Percakapan
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kontak atau nomor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {(["ALL", "OPEN", "RESOLVED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {s === "ALL" ? "Semua Status" : s === "OPEN" ? "Terbuka" : "Selesai"}
            </button>
          ))}
        </div>

        {/* Channel Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          {(["ALL", "WHATSMEOW_UNOFFICIAL", "META_WABA_OFFICIAL", "TELEGRAM_BOT"] as const).map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => setChannelFilter(ch)}
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-medium transition-colors",
                channelFilter === ch
                  ? "bg-primary/20 text-primary font-bold"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted",
              )}
            >
              {ch === "ALL" ? "Semua Saluran" : ch === "WHATSMEOW_UNOFFICIAL" ? "WA Web" : ch === "META_WABA_OFFICIAL" ? "WABA" : "Telegram"}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/50">
        {isLoading ? (
          <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">
            Memuat percakapan...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            Tidak ada pesan percakapan ditemukan.
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = conv.id === activeId;
            const contactName =
              conv.contact?.name || conv.contact?.phone || "Kontak Tanpa Nama";

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "flex w-full items-start gap-3 p-3.5 text-left transition-colors",
                  isSelected
                    ? "bg-primary/10 hover:bg-primary/15"
                    : "hover:bg-muted/50",
                )}
              >
                {/* Avatar */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {contactName.slice(0, 2).toUpperCase()}
                  {conv.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow">
                      {conv.unread_count}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="truncate text-xs font-semibold text-foreground">
                      {contactName}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {formatTime(conv.last_message_at)}
                    </span>
                  </div>

                  <p className="truncate text-xs text-muted-foreground mb-1.5">
                    {conv.last_message_text || "Belum ada pesan"}
                  </p>

                  <div className="flex items-center gap-1.5">
                    {getChannelBadge(conv.channel_type)}
                    {conv.status === "RESOLVED" && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Selesai
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
