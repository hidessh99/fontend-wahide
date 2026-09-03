"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { UserItem } from "@/modules/admin/types/admin.types";
import { adminApi } from "@/modules/admin/api/admin.api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  onSendBatch?: (targets: { email: string; name?: string }[], subject: string, message: string) => Promise<unknown>;
}

export function BroadcastComposer({
  isSending,
  onSendAll,
  onSendDirect,
  onSendBatch,
}: BroadcastComposerProps) {
  const [broadcastTarget, setBroadcastTarget] = useState<"ALL" | "SPECIFIC">("ALL");

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

  // Email Content State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

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
    if (!subject.trim() || !message.trim()) {
      toast.error("Subjek dan isi pesan siaran wajib diisi.");
      return;
    }

    if (broadcastTarget === "ALL") {
      await onSendAll(subject.trim(), message.trim());
      setSubject("");
      setMessage("");
    } else {
      if (isManualMode) {
        if (!manualEmail.trim()) {
          toast.error("Alamat email penerima wajib diisi.");
          return;
        }
        await onSendDirect(manualEmail.trim(), manualName.trim(), subject.trim(), message.trim());
        setSubject("");
        setMessage("");
        setManualEmail("");
        setManualName("");
      } else {
        if (selectedUsers.length === 0) {
          toast.error("Pilih minimal 1 pengguna penerima siaran.");
          return;
        }

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
              Broadcast massal ke seluruh member atau pilih pengguna terdaftar.
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
              <span>Pilih Pengguna Tertentu</span>
            </button>
          </div>
        </div>

        {/* Specific Target Mode: Searchable Combobox & Selected Users */}
        {broadcastTarget === "SPECIFIC" && (
          <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-3 animate-in fade-in">
            {!isManualMode ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
                    <UserCheck className="size-3.5 text-emerald-600 dark:text-wise-green" />
                    <span>Cari &amp; Pilih Pengguna Terdaftar:</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsManualMode(true)}
                    className="text-[10px] font-bold text-emerald-700 dark:text-wise-green hover:underline cursor-pointer"
                  >
                    + Input Email Manual
                  </button>
                </div>

                {/* Combobox Search Input & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-foreground-muted pointer-events-none" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Ketik nama atau email pengguna untuk mencari..."
                      className="w-full h-9 pl-9 pr-8 rounded-lg bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green outline-none text-xs"
                    />
                    {userSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setUserSearchQuery("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground"
                      >
                        <X className="size-3" />
                      </button>
                    )}
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-56 overflow-y-auto rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-xl p-1.5 space-y-1 animate-in fade-in zoom-in-95">
                      {isLoadingUsers ? (
                        <div className="p-4 text-center text-foreground-muted flex items-center justify-center gap-2 text-xs">
                          <Loader2 className="size-3.5 animate-spin text-emerald-600" />
                          <span>Memuat daftar pengguna...</span>
                        </div>
                      ) : filteredUsers.length === 0 ? (
                        <div className="p-4 text-center text-foreground-muted text-xs">
                          Tidak ditemukan pengguna dengan kata kunci &quot;{userSearchQuery}&quot;
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between px-2 py-1 border-b border-border/50 text-[10px] text-foreground-muted mb-1">
                            <span>Ditemukan {filteredUsers.length} pengguna</span>
                            <button
                              type="button"
                              onClick={handleSelectAllFiltered}
                              className="text-emerald-700 dark:text-wise-green font-bold hover:underline"
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
                                className={`w-full p-2 rounded-lg flex items-center justify-between text-left transition cursor-pointer ${
                                  isSelected
                                    ? "bg-emerald-500/10 border border-emerald-500/30 text-foreground"
                                    : "hover:bg-muted/50 text-foreground-secondary"
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="size-7 rounded-full bg-muted flex items-center justify-center font-bold text-[10px] text-foreground shrink-0 uppercase border border-border">
                                    {u.name ? u.name.charAt(0) : "U"}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-xs text-foreground block truncate">
                                      {u.name}
                                    </span>
                                    <span className="text-[11px] text-foreground-muted font-mono block truncate">
                                      {u.email}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {u.role && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-muted text-foreground-muted border border-border">
                                      {u.role}
                                    </span>
                                  )}
                                  <div
                                    className={`size-4 rounded-md flex items-center justify-center border ${
                                      isSelected
                                        ? "bg-emerald-600 text-white border-emerald-600 dark:bg-wise-green dark:text-black dark:border-wise-green"
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
                    <div className="flex items-center justify-between text-[11px] text-foreground-muted">
                      <span>
                        Penerima Terpilih: <strong className="text-foreground">{selectedUsers.length} Pengguna</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearSelectedUsers}
                        className="text-rose-500 font-bold hover:underline cursor-pointer"
                      >
                        Hapus Semua
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 rounded-lg border border-border bg-surface dark:bg-[#10110e]">
                      {selectedUsers.map((u) => (
                        <span
                          key={u.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 dark:text-wise-green border border-emerald-500/30"
                        >
                          <span className="truncate max-w-35 font-bold">{u.name}</span>
                          <span className="text-[10px] text-foreground-muted font-mono truncate max-w-30">
                            ({u.email})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(u.id)}
                            className="size-3.5 rounded-full flex items-center justify-center hover:bg-rose-500/20 text-foreground-muted hover:text-rose-600 transition ml-0.5"
                          >
                            <X className="size-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Manual Mode Form */
              <div className="space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-foreground">
                    Input Email Manual / Kustom:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsManualMode(false)}
                    className="text-[10px] font-bold text-emerald-700 dark:text-wise-green hover:underline cursor-pointer"
                  >
                    ← Kembali ke Pilih Pengguna
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-foreground-secondary mb-1">
                    Alamat Email: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required={isManualMode}
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="contoh: user@tokoonline.com"
                    className="w-full h-9 px-3 rounded-lg bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border focus:border-emerald-600 dark:focus:border-wise-green outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-foreground-secondary mb-1">
                    Nama Penerima (Opsional):
                  </label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="contoh: Budi Santoso"
                    className="w-full h-9 px-3 rounded-lg bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border focus:border-emerald-600 dark:focus:border-wise-green outline-none text-xs"
                  />
                </div>
              </div>
            )}
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
                  : isManualMode
                  ? "Kirim Email ke Antrean"
                  : selectedUsers.length > 1
                  ? `Kirim ke ${selectedUsers.length} Pengguna Terpilih`
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
