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

function EditUserModalContent({
  user,
  onClose,
  onSubmit,
}: EditUserModalContentProps) {
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
    <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-xl border border-border bg-surface dark:bg-[#161715] shadow-2xl overflow-hidden animate-in zoom-in-95">
      {/* Header */}
      <div className="p-5 sm:p-6 pb-4 border-b border-border flex items-start justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-wise-green flex items-center justify-center shrink-0">
            <Edit className="size-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
              Ubah Data Pengguna
            </h2>
            <p className="text-xs font-semibold text-foreground-secondary">
              Kelola profil, kontak, peran, dan reset kata sandi akun {user.name}.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="size-8 rounded-full flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-muted transition cursor-pointer shrink-0 disabled:opacity-50"
          aria-label="Tutup"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col min-h-0">
        <div className="p-5 sm:p-6 space-y-4 flex-1 text-xs">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Masukkan nama lengkap"
                className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition"
              />
            </div>
          </div>

          {/* Email & Nomor WhatsApp Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@domain.com"
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Nomor WhatsApp / Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition font-mono"
                />
              </div>
            </div>
          </div>

          {/* Password Reset Section */}
          <div className="p-3.5 rounded-lg border border-border bg-muted/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Lock className="size-3.5 text-rose-500" />
                <span>Kata Sandi Baru (Opsional)</span>
              </label>

              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-[11px] font-bold text-emerald-600 dark:text-wise-green hover:underline flex items-center gap-1 cursor-pointer"
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
                className="w-full h-10 pl-4 pr-10 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition cursor-pointer"
                aria-label={showPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <p className="text-[11px] text-foreground-muted leading-tight">
              ℹ️ Jika kata sandi diubah, seluruh sesi login aktif pengguna di perangkat lain akan dicabut secara otomatis di Redis.
            </p>
          </div>

          {/* Role & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Role / Peran Akun
              </label>
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted pointer-events-none" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green outline-none transition cursor-pointer"
                >
                  <option value="SELLER">Seller (Tenant Owner)</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="AGENT">CS Agent</option>
                  <option value="USER">User Reguler</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Status Akun
              </label>
              <select
                value={isActive ? "ACTIVE" : "SUSPENDED"}
                onChange={(e) => setIsActive(e.target.value === "ACTIVE")}
                className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green outline-none transition cursor-pointer"
              >
                <option value="ACTIVE">🟢 Aktif (Active)</option>
                <option value="SUSPENDED">🔴 Ditangguhkan (Suspended)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-muted/20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full text-xs font-bold border-border hover:bg-muted"
          >
            Batalkan
          </Button>

          <Button
            type="submit"
            variant="primaryPill"
            size="sm"
            disabled={isLoading || !name.trim() || !email.trim()}
            className="rounded-full text-xs font-extrabold gap-1.5 px-5 shadow-sm"
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

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onSubmit,
}: EditUserModalProps) {
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in"
    >
      <EditUserModalContent
        key={user.id}
        user={user}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
}
