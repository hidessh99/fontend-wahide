"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Send,
  Loader2,
  Users,
  Mail,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface BroadcastComposerProps {
  isSending: boolean;
  onSendAll: (subject: string, message: string) => Promise<unknown>;
  onSendDirect: (email: string, name: string, subject: string, message: string) => Promise<unknown>;
}

export function BroadcastComposer({
  isSending,
  onSendAll,
  onSendDirect,
}: BroadcastComposerProps) {
  const [broadcastTarget, setBroadcastTarget] = useState<"ALL" | "SPECIFIC">("ALL");
  const [targetEmail, setTargetEmail] = useState("");
  const [targetName, setTargetName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    if (broadcastTarget === "ALL") {
      await onSendAll(subject.trim(), message.trim());
      setSubject("");
      setMessage("");
    } else {
      if (!targetEmail.trim()) return;
      await onSendDirect(targetEmail.trim(), targetName.trim(), subject.trim(), message.trim());
      setSubject("");
      setMessage("");
      setTargetEmail("");
      setTargetName("");
    }
  };

  const handleReset = () => {
    setSubject("");
    setMessage("");
    setTargetEmail("");
    setTargetName("");
  };

  return (
    <div className="p-5 sm:p-6 rounded-xl border border-border bg-surface dark:bg-[#161715] space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Megaphone className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-foreground tracking-tight">
              Kirim Siaran &amp; Email
            </h2>
            <p className="text-[11px] font-semibold text-foreground-secondary">
              Broadcast massal ke seluruh member atau kirim email spesifik.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="size-7 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer"
          title="Reset Form"
          aria-label="Reset Form"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
        {/* Target Switcher */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground-secondary">
            Target Penerima Siaran:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBroadcastTarget("ALL")}
              className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 font-bold text-xs transition cursor-pointer ${
                broadcastTarget === "ALL"
                  ? "border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-wise-green dark:border-wise-green"
                  : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary hover:border-foreground-muted"
              }`}
            >
              <Users className="size-3.5" />
              <span>Semua Pengguna Aktif</span>
            </button>

            <button
              type="button"
              onClick={() => setBroadcastTarget("SPECIFIC")}
              className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 font-bold text-xs transition cursor-pointer ${
                broadcastTarget === "SPECIFIC"
                  ? "border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-wise-green dark:border-wise-green"
                  : "border-border bg-surface dark:bg-[#10110e] text-foreground-secondary hover:border-foreground-muted"
              }`}
            >
              <Mail className="size-3.5" />
              <span>Email Tertentu (Per Email)</span>
            </button>
          </div>
        </div>

        {/* Specific Email Fields */}
        {broadcastTarget === "SPECIFIC" && (
          <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-2.5 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-bold text-foreground mb-1">
                Alamat Email Penerima: <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="contoh: user@tokoonline.com"
                className="w-full h-9 px-3 rounded-lg bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border focus:border-emerald-600 dark:focus:border-wise-green outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-foreground mb-1">
                Nama Penerima (Opsional):
              </label>
              <input
                type="text"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                placeholder="contoh: Budi Santoso"
                className="w-full h-9 px-3 rounded-lg bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border focus:border-emerald-600 dark:focus:border-wise-green outline-none text-xs"
              />
            </div>
          </div>
        )}

        {/* Subject */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
            Subjek Email: <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="contoh: Pengumuman Pemeliharaan Server & Fitur Baru"
            className="w-full h-10 px-3.5 rounded-lg bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs"
          />
        </div>

        {/* Message Content */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-foreground-secondary mb-1">
            Isi Pesan Siaran: <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan pesan lengkap yang akan dikirimkan ke email penerima..."
            className="w-full p-3 rounded-lg bg-surface dark:bg-[#10110e] text-foreground font-semibold text-xs border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition"
          />
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          variant="primaryPill"
          size="sm"
          disabled={isSending}
          className="w-full h-10 text-xs font-extrabold gap-2 shadow-xs cursor-pointer"
        >
          {isSending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Memasukkan ke Antrean Worker...</span>
            </>
          ) : (
            <>
              <Send className="size-3.5" />
              <span>
                {broadcastTarget === "ALL"
                  ? "Kirim Siaran ke Semua Pengguna"
                  : "Kirim Email ke Antrean"}
              </span>
            </>
          )}
        </Button>

        <div className="flex items-center gap-1.5 text-[11px] text-foreground-muted pt-1 justify-center">
          <Sparkles className="size-3 text-amber-500" />
          <span>Diproses di latar belakang via SumoPod &amp; Mailketing.</span>
        </div>
      </form>
    </div>
  );
}
