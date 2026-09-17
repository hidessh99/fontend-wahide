"use client";

import React from "react";
import { Plus, Trash2, Link as LinkIcon, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TelegramInlineButton,
  TelegramInlineRow,
} from "../../types/template.types";

interface TelegramInlineKeyboardBuilderProps {
  value: TelegramInlineRow[];
  onChange: (value: TelegramInlineRow[]) => void;
  disabled?: boolean;
}

export function TelegramInlineKeyboardBuilder({
  value,
  onChange,
  disabled = false,
}: TelegramInlineKeyboardBuilderProps) {
  const rows = value || [];

  const handleAddRow = () => {
    if (rows.length >= 8) return; // Telegram allows up to multiple rows, keep reasonable limit
    onChange([...rows, [{ text: "Tombol 1", url: "https://" }]]);
  };

  const handleRemoveRow = (rowIndex: number) => {
    onChange(rows.filter((_, i) => i !== rowIndex));
  };

  const handleAddButton = (rowIndex: number) => {
    const targetRow = rows[rowIndex];
    if (!targetRow || targetRow.length >= 3) return; // Max 3 buttons per row for good mobile readability
    const updatedRows = [...rows];
    updatedRows[rowIndex] = [
      ...targetRow,
      { text: `Tombol ${targetRow.length + 1}`, url: "https://" },
    ];
    onChange(updatedRows);
  };

  const handleRemoveButton = (rowIndex: number, btnIndex: number) => {
    const targetRow = rows[rowIndex];
    if (!targetRow) return;
    if (targetRow.length <= 1) {
      // If last button in row, remove the row
      handleRemoveRow(rowIndex);
      return;
    }
    const updatedRows = [...rows];
    updatedRows[rowIndex] = targetRow.filter((_, i) => i !== btnIndex);
    onChange(updatedRows);
  };

  const handleUpdateButton = (
    rowIndex: number,
    btnIndex: number,
    field: keyof TelegramInlineButton,
    val: string,
  ) => {
    const targetRow = rows[rowIndex];
    if (!targetRow || !targetRow[btnIndex]) return;
    const updatedRows = [...rows];
    const updatedRow = [...targetRow];
    updatedRow[btnIndex] = {
      ...updatedRow[btnIndex],
      [field]: val,
    };
    updatedRows[rowIndex] = updatedRow;
    onChange(updatedRows);
  };

  return (
    <div className="space-y-3 rounded-xl border border-sky-500/20 bg-sky-500/5 p-3.5 sm:p-4 dark:bg-sky-950/10">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-foreground text-xs font-bold sm:text-sm">
            Telegram Inline Keyboard Markup
          </h4>
          <p className="text-foreground-secondary text-[11px]">
            Tombol aksi interaktif di bawah balon pesan (Link URL / Callback Data).
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRow}
          disabled={disabled || rows.length >= 8}
          className="border-sky-500/30 text-sky-600 hover:bg-sky-500/10 hover:text-sky-700 h-7 px-2.5 text-xs font-bold dark:text-sky-400"
        >
          <Plus className="mr-1 size-3" />
          <span>Tambah Baris</span>
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="border-border rounded-lg border border-dashed p-4 text-center">
          <p className="text-foreground-muted text-xs">
            Belum ada tombol inline. Klik &ldquo;Tambah Baris&rdquo; untuk membuat tombol.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row, rIndex) => (
            <div
              key={`row-${rIndex}`}
              className="border-border bg-surface relative rounded-lg border p-2.5 shadow-2xs dark:bg-[#151614]"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-foreground-secondary text-[10px] font-bold uppercase tracking-wider">
                  Baris {rIndex + 1} ({row.length} Tombol)
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddButton(rIndex)}
                    disabled={disabled || row.length >= 3}
                    className="h-6 px-2 text-[11px] font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                  >
                    <Plus className="mr-1 size-3" />
                    Tambah Tombol
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRow(rIndex)}
                    disabled={disabled}
                    className="hover:bg-rose-500/10 hover:text-rose-600 h-6 w-6 p-0 text-muted-foreground"
                    title="Hapus baris ini"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>

              {/* Buttons in this row */}
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {row.map((btn, bIndex) => {
                  const isCallback = Boolean(btn.callback_data && !btn.url);

                  return (
                    <div
                      key={`btn-${rIndex}-${bIndex}`}
                      className="border-border/60 bg-muted/40 space-y-2 rounded-md border p-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-foreground-secondary font-semibold">
                          Tombol #{bIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveButton(rIndex, bIndex)}
                          className="hover:text-rose-500 text-muted-foreground transition"
                          title="Hapus tombol ini"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>

                      {/* Button Label */}
                      <div>
                        <Input
                          placeholder="Label Tombol..."
                          value={btn.text}
                          onChange={(e) =>
                            handleUpdateButton(
                              rIndex,
                              bIndex,
                              "text",
                              e.target.value,
                            )
                          }
                          disabled={disabled}
                          className="h-7 text-xs"
                        />
                      </div>

                      {/* Action Type: URL vs Callback */}
                      <div className="flex items-center gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateButton(
                              rIndex,
                              bIndex,
                              "url",
                              btn.url || "https://",
                            );
                            handleUpdateButton(
                              rIndex,
                              bIndex,
                              "callback_data",
                              "",
                            );
                          }}
                          className={`rounded px-1.5 py-0.5 font-bold transition ${
                            !isCallback
                              ? "bg-sky-500/20 text-sky-600 dark:text-sky-400"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <LinkIcon className="mr-0.5 inline size-2.5" />
                          Link URL
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateButton(rIndex, bIndex, "url", "");
                            handleUpdateButton(
                              rIndex,
                              bIndex,
                              "callback_data",
                              btn.callback_data || "action_id",
                            );
                          }}
                          className={`rounded px-1.5 py-0.5 font-bold transition ${
                            isCallback
                              ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Activity className="mr-0.5 inline size-2.5" />
                          Callback Data
                        </button>
                      </div>

                      {/* Target Value Input */}
                      <div>
                        {!isCallback ? (
                          <Input
                            placeholder="https://t.me/..."
                            value={btn.url || ""}
                            onChange={(e) =>
                              handleUpdateButton(
                                rIndex,
                                bIndex,
                                "url",
                                e.target.value,
                              )
                            }
                            disabled={disabled}
                            className="h-7 font-mono text-[11px]"
                          />
                        ) : (
                          <Input
                            placeholder="callback_payload_data"
                            value={btn.callback_data || ""}
                            onChange={(e) =>
                              handleUpdateButton(
                                rIndex,
                                bIndex,
                                "callback_data",
                                e.target.value,
                              )
                            }
                            disabled={disabled}
                            className="h-7 font-mono text-[11px]"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
