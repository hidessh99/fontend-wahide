"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { UserItem } from "@/modules/admin/types/admin.types";
import { adminApi } from "@/modules/admin/api/admin.api";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Send,
  Loader2,
  Users,
  Mail,
  Sparkles,
  RotateCcw,
  Search,
  X,
  Check,
  UserCheck,
} from "lucide-react";

interface BroadcastComposerProps {
  isSending: boolean;
  onSendAll: (subject: string, message: string) => Promise<unknown>;
  onSendDirect: (email: string, name: string, subject: string, message: string) => Promise<unknown>;
  onSendBatch?: (
    targets: { email: string; name?: string }[],
    subject: string,
    message: string
  ) => Promise<unknown>;
}

export function BroadcastComposer({
  isSending,
  onSendAll,
  onSendDirect,
  onSendBatch,
}: BroadcastComposerProps) {
  const [broadcastTarget, setBroadcastTarget] = useState<"ALL" | "SPECIFIC">("ALL");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState<{
    subject?: string;
    message?: string;
    email?: string;
    target?: string;
  }>({});

  // User Selection State
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<UserItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Manual Email Fallback State
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");

  // Fetch users once when switching to SPECIFIC
  const hasLoadedUsersRef = useRef(false);
  useEffect(() => {
    if (broadcastTarget === "SPECIFIC" && !hasLoadedUsersRef.current) {
      hasLoadedUsersRef.current = true;
      const controller = new AbortController();

      const loadUsers = async () => {
        setIsLoadingUsers(true);
        try {
          const res = await adminApi.getUsers({ page: 1, pageSize: 100 });
          setUsers(res.users);
        } catch {
          // Handled gracefully
        } finally {
          setIsLoadingUsers(false);
        }
      };
      loadUsers();

      return () => {
        controller.abort();
      };
    }
  }, [broadcastTarget]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return users;
    const q = userSearchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q))
    );
  }, [users, userSearchQuery]);

  const handleToggleUser = (user: UserItem) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.id === user.id);
      if (exists) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSelectAllFiltered = () => {
    const newSelected = [...selectedUsers];
    filteredUsers.forEach((u) => {
      if (!newSelected.some((item) => item.id === u.id)) {
        newSelected.push(u);
      }
    });
    setSelectedUsers(newSelected);
  };

  const handleClearSelectedUsers = () => {
    setSelectedUsers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { subject?: string; message?: string; email?: string; target?: string } = {};

    if (!subject.trim()) {
      errors.subject = "Subjek siaran wajib diisi.";
    }
    if (!message.trim()) {
      errors.message = "Isi pesan siaran wajib diisi.";
    }

    if (broadcastTarget !== "ALL") {
      if (isManualMode) {
        if (!manualEmail.trim()) {
          errors.email = "Alamat email penerima wajib diisi.";
        }
      } else {
        if (selectedUsers.length === 0) {
          errors.target = "Pilih minimal 1 pengguna penerima siaran.";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    if (broadcastTarget === "ALL") {
      await onSendAll(subject.trim(), message.trim());
      setSubject("");
      setMessage("");
    } else {
      if (isManualMode) {
        await onSendDirect(manualEmail.trim(), manualName.trim(), subject.trim(), message.trim());
        setSubject("");
        setMessage("");
        setManualEmail("");
        setManualName("");
      } else {
        if (selectedUsers.length === 1) {
          const u = selectedUsers[0];
          await onSendDirect(u.email, u.name, subject.trim(), message.trim());
        } else if (onSendBatch) {
          const targets = selectedUsers.map((u) => ({ email: u.email, name: u.name }));
          await onSendBatch(targets, subject.trim(), message.trim());
        } else {
          for (const u of selectedUsers) {
            await onSendDirect(u.email, u.name, subject.trim(), message.trim());
          }
        }

        setSubject("");
        setMessage("");
        setSelectedUsers([]);
      }
    }
  };

  const handleReset = () => {
    setSubject("");
    setMessage("");
    setSelectedUsers([]);
    setManualEmail("");
    setManualName("");
    setUserSearchQuery("");
  };

  return (
    <div className="border-border bg-surface space-y-4 rounded-xl border p-5 shadow-xs sm:p-6 dark:bg-[#161715]">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <Megaphone className="size-4" />
          </div>
          <div>
            <h2 className="text-foreground text-base font-black tracking-tight">
              Kirim Siaran &amp; Email
            </h2>
            <p className="text-foreground-secondary text-[11px] font-semibold">
              Broadcast massal ke seluruh member atau pilih pengguna terdaftar.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-7 cursor-pointer items-center justify-center rounded-full transition"
          title="Reset Form"
          aria-label="Reset Form"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
        {/* Target Switcher */}
        <div className="space-y-1.5">
          <label className="text-foreground-secondary block text-[11px] font-bold tracking-wider uppercase">
            Target Penerima Siaran:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBroadcastTarget("ALL")}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-bold transition ${
                broadcastTarget === "ALL"
                  ? "dark:text-wise-green dark:border-wise-green border-emerald-600 bg-emerald-500/10 text-emerald-700"
                  : "border-border bg-surface text-foreground-secondary hover:border-foreground-muted dark:bg-[#10110e]"
              }`}
            >
              <Users className="size-3.5" />
              <span>Semua Pengguna Aktif</span>
            </button>

            <button
              type="button"
              onClick={() => setBroadcastTarget("SPECIFIC")}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-2.5 text-xs font-bold transition ${
                broadcastTarget === "SPECIFIC"
                  ? "dark:text-wise-green dark:border-wise-green border-emerald-600 bg-emerald-500/10 text-emerald-700"
                  : "border-border bg-surface text-foreground-secondary hover:border-foreground-muted dark:bg-[#10110e]"
              }`}
            >
              <Mail className="size-3.5" />
              <span>Pilih Pengguna Tertentu</span>
            </button>
          </div>
        </div>

        {/* Specific Target Mode: Searchable Combobox & Selected Users */}
        {broadcastTarget === "SPECIFIC" && (
          <div className="border-border bg-muted/20 animate-in fade-in space-y-3 rounded-xl border p-3.5">
            {!isManualMode ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-foreground flex items-center gap-1.5 text-[11px] font-bold">
                    <UserCheck className="dark:text-wise-green size-3.5 text-emerald-600" />
                    <span>Cari &amp; Pilih Pengguna Terdaftar:</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsManualMode(true)}
                    className="dark:text-wise-green cursor-pointer text-[10px] font-bold text-emerald-700 hover:underline"
                  >
                    + Input Email Manual
                  </button>
                </div>

                {/* Combobox Search Input & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Search className="text-foreground-muted pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Ketik nama atau email pengguna untuk mencari..."
                      className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green h-9 w-full rounded-lg border pr-8 pl-9 text-xs font-semibold outline-none focus:border-emerald-600 dark:bg-[#10110e]"
                    />
                    {userSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setUserSearchQuery("")}
                        className="text-foreground-muted hover:text-foreground absolute top-1/2 right-2.5 flex size-4 -translate-y-1/2 items-center justify-center rounded-full"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="border-border bg-surface animate-in fade-in zoom-in-95 absolute top-full right-0 left-0 z-30 mt-1 max-h-56 space-y-1 overflow-y-auto rounded-xl border p-1.5 shadow-xl dark:bg-[#161715]">
                      {isLoadingUsers ? (
                        <div className="text-foreground-muted flex items-center justify-center gap-2 p-4 text-center text-xs">
                          <Loader2 className="size-3.5 animate-spin text-emerald-600" />
                          <span>Memuat daftar pengguna...</span>
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="text-foreground-muted p-4 text-center text-xs">
                          Tidak ditemukan pengguna dengan kata kunci &quot;{userSearchQuery}&quot;
                        </div>
                      ) : (
                        <div>
                          <div className="border-border/50 text-foreground-muted mb-1 flex items-center justify-between border-b px-2 py-1 text-[10px]">
                            <span>Ditemukan {filteredUsers.length} pengguna</span>
                            <button
                              type="button"
                              onClick={handleSelectAllFiltered}
                              className="dark:text-wise-green font-bold text-emerald-700 hover:underline"
                            >
                              Pilih Semua
                            </button>
                          </div>

                          {filteredUsers.map((u) => {
                            const isSelected = selectedUsers.some((item) => item.id === u.id);
                            return (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => handleToggleUser(u)}
                                className={`flex w-full cursor-pointer items-center justify-between rounded-lg p-2 text-left transition ${
                                  isSelected
                                    ? "text-foreground border border-emerald-500/30 bg-emerald-500/10"
                                    : "hover:bg-muted/50 text-foreground-secondary"
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-2.5">
                                  <div className="bg-muted text-foreground border-border flex size-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold uppercase">
                                    {u.name ? u.name.charAt(0) : "U"}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-foreground block truncate text-xs font-bold">
                                      {u.name}
                                    </span>
                                    <span className="text-foreground-muted block truncate font-mono text-[11px]">
                                      {u.email}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-1.5">
                                  {u.role && (
                                    <span className="bg-muted text-foreground-muted border-border rounded border px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                                      {u.role}
                                    </span>
                                  )}
                                  <div
                                    className={`flex size-4 items-center justify-center rounded-md border ${
                                      isSelected
                                        ? "dark:bg-wise-green dark:border-wise-green border-emerald-600 bg-emerald-600 text-white dark:text-black"
                                        : "border-border"
                                    }`}
                                  >
                                    {isSelected && <Check className="size-3 stroke-3" />}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Users Chips */}
                {selectedUsers.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-foreground-muted flex items-center justify-between text-[11px]">
                      <span>
                        Penerima Terpilih:{" "}
                        <strong className="text-foreground">{selectedUsers.length} Pengguna</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearSelectedUsers}
                        className="cursor-pointer font-bold text-rose-500 hover:underline"
                      >
                        Hapus Semua
                      </button>
                    </div>

                    <div className="border-border bg-surface flex max-h-32 flex-wrap gap-1.5 overflow-y-auto rounded-lg border p-1.5 dark:bg-[#10110e]">
                      {selectedUsers.map((u) => (
                        <span
                          key={u.id}
                          className="dark:text-wise-green inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                        >
                          <span className="max-w-35 truncate font-bold">{u.name}</span>
                          <span className="text-foreground-muted max-w-30 truncate font-mono text-[10px]">
                            ({u.email})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(u.id)}
                            className="text-foreground-muted ml-0.5 flex size-3.5 items-center justify-center rounded-full transition hover:bg-rose-500/20 hover:text-rose-600"
                          >
                            <X className="size-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {formErrors.target && (
                  <p className="mt-1 text-xs font-semibold text-rose-500">{formErrors.target}</p>
                )}
              </div>
            ) : (
              /* Manual Mode Form */
              <div className="animate-in fade-in space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-[11px] font-bold">
                    Input Email Manual / Kustom:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsManualMode(false)}
                    className="dark:text-wise-green cursor-pointer text-[10px] font-bold text-emerald-700 hover:underline"
                  >
                    ← Kembali ke Pilih Pengguna
                  </button>
                </div>

                <div>
                  <label className="text-foreground-secondary mb-1 block text-[11px] font-bold">
                    Alamat Email: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required={isManualMode}
                    value={manualEmail}
                    onChange={(e) => {
                      setManualEmail(e.target.value);
                      if (formErrors.email)
                        setFormErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="contoh: user@tokoonline.com"
                    className={`bg-surface text-foreground dark:focus:border-wise-green h-9 w-full rounded-lg border px-3 text-xs font-semibold outline-none focus:border-emerald-600 dark:bg-[#10110e] ${
                      formErrors.email ? "border-rose-500" : "border-border"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs font-semibold text-rose-500">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-foreground-secondary mb-1 block text-[11px] font-bold">
                    Nama Penerima (Opsional):
                  </label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="contoh: Budi Santoso"
                    className="bg-surface text-foreground border-border dark:focus:border-wise-green h-9 w-full rounded-lg border px-3 text-xs font-semibold outline-none focus:border-emerald-600 dark:bg-[#10110e]"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subject */}
        <div>
          <label className="text-foreground-secondary mb-1 block text-[11px] font-bold tracking-wider uppercase">
            Subjek Email: <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (formErrors.subject) setFormErrors((prev) => ({ ...prev, subject: undefined }));
            }}
            placeholder="contoh: Pengumuman Pemeliharaan Server & Fitur Baru"
            className={`bg-surface text-foreground hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-lg border px-3.5 text-xs font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e] ${
              formErrors.subject ? "border-rose-500" : "border-border"
            }`}
          />
          {formErrors.subject && (
            <p className="mt-1 text-xs font-semibold text-rose-500">{formErrors.subject}</p>
          )}
        </div>

        {/* Message Content */}
        <div>
          <label className="text-foreground-secondary mb-1 block text-[11px] font-bold tracking-wider uppercase">
            Isi Pesan Siaran: <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            required
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (formErrors.message) setFormErrors((prev) => ({ ...prev, message: undefined }));
            }}
            placeholder="Tuliskan pesan lengkap yang akan dikirimkan ke email penerima..."
            className={`bg-surface text-foreground hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 w-full rounded-lg border p-3 text-xs font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e] ${
              formErrors.message ? "border-rose-500" : "border-border"
            }`}
          />
          {formErrors.message && (
            <p className="mt-1 text-xs font-semibold text-rose-500">{formErrors.message}</p>
          )}
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          variant="primaryPill"
          size="sm"
          disabled={isSending}
          className="h-10 w-full cursor-pointer gap-2 text-xs font-extrabold shadow-xs"
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
                  : isManualMode
                    ? "Kirim Email ke Antrean"
                    : selectedUsers.length > 1
                      ? `Kirim ke ${selectedUsers.length} Pengguna Terpilih`
                      : "Kirim Email ke Antrean"}
              </span>
            </>
          )}
        </Button>

        <div className="text-foreground-muted flex items-center justify-center gap-1.5 pt-1 text-[11px]">
          <Sparkles className="size-3 text-amber-500" />
          <span>Diproses di latar belakang via SumoPod &amp; Mailketing.</span>
        </div>
      </form>
    </div>
  );
}
