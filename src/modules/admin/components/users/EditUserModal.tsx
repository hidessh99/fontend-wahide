"use client";

import React, { useState } from "react";
import { UserItem, UpdateUserInput } from "@/modules/admin/types/admin.types";
import { Button } from "@/components/ui/button";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { generateSecureRandomString } from "@/lib/utils";
import {
  X,
  Edit,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  Save,
  Shield,
  Phone,
  Mail,
  User,
  Lock,
} from "lucide-react";

interface EditUserModalProps {
  user: UserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string, data: UpdateUserInput) => Promise<unknown>;
}

interface EditUserModalContentProps {
  user: UserItem;
  onClose: () => void;
  onSubmit: (userId: string, data: UpdateUserInput) => Promise<unknown>;
}

function EditUserModalContent({ user, onClose, onSubmit }: EditUserModalContentProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || user.phone || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(user.status === "ACTIVE" || user.isActive === true);
  const [role, setRole] = useState(user.role || user.roleName || "SELLER");
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePassword = () => {
    const randomPass = generateSecureRandomString("Wahide@", 6);
    setPassword(randomPass);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload: UpdateUserInput = {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        isActive: isActive,
        role: role,
      };
      if (password.trim()) {
        payload.password = password.trim();
      }

      await onSubmit(user.id, payload);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-border bg-surface animate-in zoom-in-95 relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border shadow-2xl dark:bg-[#161715]">
      {/* Header */}
      <div className="border-border flex shrink-0 items-start justify-between border-b p-5 pb-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="dark:text-wise-green flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
            <Edit className="size-5" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-black tracking-tight sm:text-xl">
              Ubah Data Pengguna
            </h2>
            <p className="text-foreground-secondary text-xs font-semibold">
              Kelola profil, kontak, peran, dan reset kata sandi akun {user.name}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="text-foreground-muted hover:text-foreground hover:bg-muted flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition disabled:opacity-50"
          aria-label="Tutup"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex-1 space-y-4 p-5 text-xs sm:p-6">
          {/* Nama Lengkap */}
          <div>
            <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Masukkan nama lengkap"
                className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-4 pl-10 font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
              />
            </div>
          </div>

          {/* Email & Nomor WhatsApp Row */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@domain.com"
                  className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-4 pl-10 font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
                />
              </div>
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Nomor WhatsApp / Phone
              </label>
              <div className="relative">
                <Phone className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-4 pl-10 font-mono font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
                />
              </div>
            </div>
          </div>

          {/* Password Reset Section */}
          <div className="border-border bg-muted/20 space-y-2 rounded-lg border p-3.5">
            <div className="flex items-center justify-between">
              <label className="text-foreground flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                <Lock className="size-3.5 text-rose-500" />
                <span>Kata Sandi Baru (Opsional)</span>
              </label>

              <button
                type="button"
                onClick={handleGeneratePassword}
                className="dark:text-wise-green flex cursor-pointer items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
              >
                <Sparkles className="size-3" />
                <span>Generate Sandi Acak</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin mengubah kata sandi"
                className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-10 pl-4 font-mono text-xs font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition"
                aria-label={showPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <p className="text-foreground-muted text-[11px] leading-tight">
              ℹ️ Jika kata sandi diubah, seluruh sesi login aktif pengguna di perangkat lain akan
              dicabut secara otomatis di Redis.
            </p>
          </div>

          {/* Role & Status Row */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Role / Peran Akun
              </label>
              <div className="relative">
                <Shield className="text-foreground-muted pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green h-10 w-full cursor-pointer rounded-full border pr-4 pl-10 font-semibold transition outline-none focus:border-emerald-600 dark:bg-[#10110e]"
                >
                  <option value="SELLER">Seller (Tenant Owner)</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="AGENT">CS Agent</option>
                  <option value="USER">User Reguler</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Status Akun
              </label>
              <select
                value={isActive ? "ACTIVE" : "SUSPENDED"}
                onChange={(e) => setIsActive(e.target.value === "ACTIVE")}
                className="bg-surface text-foreground border-border hover:border-foreground-muted dark:focus:border-wise-green h-10 w-full cursor-pointer rounded-full border px-4 font-semibold transition outline-none focus:border-emerald-600 dark:bg-[#10110e]"
              >
                <option value="ACTIVE">🟢 Aktif (Active)</option>
                <option value="SUSPENDED">🔴 Ditangguhkan (Suspended)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-border bg-muted/20 flex shrink-0 items-center justify-end gap-3 border-t p-4 sm:p-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="border-border hover:bg-muted rounded-full text-xs font-bold"
          >
            Batalkan
          </Button>

          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isLoading || !name.trim() || !email.trim()}
            className="gap-1.5 rounded-full px-5 text-xs font-extrabold shadow-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function EditUserModal({ user, isOpen, onClose, onSubmit }: EditUserModalProps) {
  // Universal Escape key dismissal with zero listener churn
  useEscapeKey(isOpen, onClose);

  if (!isOpen || !user) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="animate-in fade-in fixed inset-0 z-50 flex min-h-full items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
    >
      <EditUserModalContent key={user.id} user={user} onClose={onClose} onSubmit={onSubmit} />
    </div>
  );
}
