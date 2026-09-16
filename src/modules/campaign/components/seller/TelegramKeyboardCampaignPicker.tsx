"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ExternalLink, Bot } from "lucide-react";

export interface TelegramButton {
  text: string;
  url: string;
}

interface TelegramKeyboardCampaignPickerProps {
  buttons: TelegramButton[];
  onChangeButtons: (buttons: TelegramButton[]) => void;
  parseMode: "HTML" | "MarkdownV2";
  onChangeParseMode: (mode: "HTML" | "MarkdownV2") => void;
  className?: string;
}

export function TelegramKeyboardCampaignPicker({
  buttons,
  onChangeButtons,
  parseMode,
  onChangeParseMode,
  className,
}: TelegramKeyboardCampaignPickerProps) {
  const [newBtnText, setNewBtnText] = useState("");
  const [newBtnUrl, setNewBtnUrl] = useState("");

  const handleAddButton = () => {
    if (!newBtnText.trim() || !newBtnUrl.trim()) return;
    onChangeButtons([...buttons, { text: newBtnText.trim(), url: newBtnUrl.trim() }]);
    setNewBtnText("");
    setNewBtnUrl("");
  };

  const handleRemoveButton = (idx: number) => {
    onChangeButtons(buttons.filter((_, i) => i !== idx));
  };

  return (
    <div className={className}>
      <div className="space-y-3.5">
        {/* Parse Mode Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/20 p-3">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold text-foreground">
              Format Teks Pesan Telegram
            </Label>
            <p className="text-[11px] text-foreground-secondary">
              Dukungan format tebal, miring, dan tautan teks
            </p>
          </div>
          <div className="flex rounded-full border border-border bg-surface p-0.5">
            <button
              type="button"
              onClick={() => onChangeParseMode("HTML")}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                parseMode === "HTML"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => onChangeParseMode("MarkdownV2")}
              className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                parseMode === "MarkdownV2"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-foreground-secondary hover:text-foreground"
              }`}
            >
              MarkdownV2
            </button>
          </div>
        </div>

        {/* Inline Keyboard Configurator */}
        <div className="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-3.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Bot className="size-3.5 text-blue-500" />
              <span>Tombol Interaktif (Inline Keyboard URL)</span>
            </Label>
            <span className="text-[10px] text-foreground-muted font-medium">
              Maks. 3 tombol
            </span>
          </div>

          {/* Existing Buttons List */}
          {buttons.length > 0 && (
            <div className="space-y-1.5">
              {buttons.map((btn, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-1.5 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <ExternalLink className="size-3 text-blue-500 shrink-0" />
                    <span className="font-bold text-foreground">{btn.text}</span>
                    <span className="text-foreground-muted truncate text-[11px]">
                      ({btn.url})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveButton(idx)}
                    className="text-foreground-muted hover:text-rose-500 transition-colors p-1 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Button Row */}
          {buttons.length < 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
              <div className="sm:col-span-2">
                <Input
                  value={newBtnText}
                  onChange={(e) => setNewBtnText(e.target.value)}
                  placeholder="Label Tombol (cth: Beli Sekarang)"
                  className="h-8 text-xs font-medium"
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  value={newBtnUrl}
                  onChange={(e) => setNewBtnUrl(e.target.value)}
                  placeholder="https://..."
                  className="h-8 text-xs font-medium"
                />
              </div>
              <div className="sm:col-span-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddButton}
                  disabled={!newBtnText.trim() || !newBtnUrl.trim()}
                  className="w-full h-8 text-xs font-bold rounded-lg cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="size-3 mr-1" />
                  Tambah
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
