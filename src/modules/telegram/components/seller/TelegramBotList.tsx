"use client";

import React from "react";
import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty";
import { TelegramBot } from "../../types/telegram.types";
import { TelegramBotCard } from "./TelegramBotCard";

interface TelegramBotListProps {
  bots: TelegramBot[];
  isLoading?: boolean;
  onConnectClick: () => void;
  onSync: (id: string) => Promise<void>;
  onDelete: (id: string, name: string) => Promise<void>;
  syncingId?: string | null;
  deletingId?: string | null;
  isActionLoading?: boolean;
}

export function TelegramBotList({
  bots,
  isLoading = false,
  onConnectClick,
  onSync,
  onDelete,
  syncingId = null,
  deletingId = null,
  isActionLoading = false,
}: TelegramBotListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-border rounded-2xl border p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <EmptyState
        icon={<Bot className="size-10" />}
        title="Belum Ada Bot Telegram Terhubung"
        description="Hubungkan bot Telegram pertama Anda menggunakan BotFather token untuk mulai mengirimkan pesan dan notifikasi instan."
        action={
          <Button
            size="sm"
            onClick={onConnectClick}
            className="bg-wise-green text-dark-green hover:bg-wise-green/90 font-bold text-xs"
          >
            <Plus className="mr-1.5 size-3.5" />
            <span>Hubungkan Bot Telegram</span>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bots.map((bot) => (
        <TelegramBotCard
          key={bot.id}
          bot={bot}
          onSync={onSync}
          onDelete={onDelete}
          isSyncing={syncingId === bot.id}
          isDeleting={deletingId === bot.id}
          disabled={isActionLoading}
        />
      ))}
    </div>
  );
}
