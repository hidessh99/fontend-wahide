"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, Eye, EyeOff, ExternalLink, Loader2, KeyRound } from "lucide-react";
import { ConnectTelegramBotInput } from "../../types/telegram.types";

interface ConnectTelegramBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (input: ConnectTelegramBotInput) => Promise<boolean>;
  isLoading?: boolean;
}

export function ConnectTelegramBotModal({
  isOpen,
  onClose,
  onConnect,
  isLoading = false,
}: ConnectTelegramBotModalProps) {
  const [name, setName] = useState("");
  const [botToken, setBotToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama bot harus diisi");
      return;
    }
    if (!botToken.trim() || botToken.trim().length < 20) {
      setError("Bot token BotFather minimal 20 karakter valid");
      return;
    }

    setError(null);
    const ok = await onConnect({
      name: name.trim(),
      bot_token: botToken.trim(),
    });

    if (ok) {
      setName("");
      setBotToken("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400">
              <Bot className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Hubungkan Bot Telegram</DialogTitle>
              <DialogDescription className="text-xs">
                Daftarkan token API resmi dari BotFather untuk mengaktifkan bot engine.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-50 p-2.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="botName" className="text-xs font-semibold">
              Nama Label Bot
            </Label>
            <Input
              id="botName"
              placeholder="e.g. Bot Notifikasi CS Utama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="botToken" className="text-xs font-semibold">
                HTTP API Bot Token (BotFather)
              </Label>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:underline dark:text-sky-400"
              >
                <span>Buka BotFather</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
            <div className="relative">
              <Input
                id="botToken"
                type={showToken ? "text" : "password"}
                placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                disabled={isLoading}
                className="pr-9 font-mono text-xs"
                required
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="text-foreground-muted hover:text-foreground absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5"
              >
                {showToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-foreground-secondary text-[11px]">
              Dapatkan token dengan mengirim perintah <code className="bg-muted rounded px-1">/newbot</code> ke @BotFather di aplikasi Telegram.
            </p>
          </div>

          {/* Verification step note */}
          <div className="border-border/60 flex items-start gap-2.5 rounded-xl border bg-muted/40 p-3 text-xs">
            <KeyRound className="size-4 shrink-0 text-sky-500 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-foreground">Otomatisasi Webhook Instan</p>
              <p className="text-foreground-secondary text-[11px] leading-relaxed">
                Backend Wahide akan langsung mendaftarkan endpoint webhook aman dengan sertifikat SSL dan mengaktifkan token-bucket rate limiter.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2 sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="bg-wise-green text-dark-green hover:bg-wise-green/90 text-xs font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Hubungkan Bot</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
