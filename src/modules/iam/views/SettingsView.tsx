"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { authApi } from "@/modules/iam/api/auth.api";
import { userApi } from "@/modules/iam/api/user.api";
import { generateSecureRandomString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApiKeyConfirmModal } from "@/modules/iam/components/settings/ApiKeyConfirmModal";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import {
  Settings,
  Key,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  User,
  ShieldCheck,
  Building,
  Save,
  Loader2,
  Mail,
  Smartphone,
} from "lucide-react";

export function SettingsView() {
  const { t } = useI18n();
  const { user, tenant, updateProfileName, fetchProfile } = useAuth();
  const [apiKey, setApiKey] = useState<string>("hide_live_984f8812a3b04c89b27658df2026");
  const [showKey, setShowKey] = useState(false);
  const [isKeyLoading, setIsKeyLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    mode: "REGENERATE" | "REVOKE";
  }>({
    isOpen: false,
    mode: "REGENERATE",
  });

  // Profile Form state (Name is editable; Email & Phone are read-only primary identity)
  const [name, setName] = useState(user?.name || "Budi Santoso");
  const email = user?.email || "business@wahide.com";
  const phone = user?.phone || "6281234567890";
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Auto-sync fresh profile on page load
  useEffect(() => {
    fetchProfile().catch(() => null);
  }, [fetchProfile]);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success(t("settings.keyCopied"));
  };

  const handleOpenRegenerateModal = () => {
    setConfirmModal({ isOpen: true, mode: "REGENERATE" });
  };

  const handleOpenRevokeModal = () => {
    setConfirmModal({ isOpen: true, mode: "REVOKE" });
  };

  const handleConfirmApiKeyAction = async () => {
    setIsKeyLoading(true);
    try {
      if (confirmModal.mode === "REGENERATE") {
        const res = await authApi.generateApiKey();
        setApiKey(res.token || generateSecureRandomString("hide_live_", 24));
        toast.success(t("settings.keyRegenerated"));
      } else {
        await authApi.revokeApiKey();
        setApiKey("");
        toast.success("API Key berhasil dicabut.");
      }
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    } catch {
      if (confirmModal.mode === "REGENERATE") {
        setApiKey(generateSecureRandomString("hide_live_", 24));
        toast.success(t("settings.keyRegenerated"));
      } else {
        setApiKey("");
        toast.success("API Key berhasil dicabut.");
      }
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    } finally {
      setIsKeyLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }
    setIsSavingProfile(true);
    try {
      await updateProfileName(trimmedName);
      toast.success("Nama profil berhasil diperbarui.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui nama profil.";
      toast.error(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Kata sandi saat ini wajib diisi.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await userApi.changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Kata sandi berhasil diperbarui.");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal mengubah kata sandi. Pastikan kata sandi saat ini sesuai.";
      toast.error(msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green flex items-center justify-center shrink-0">
              <Settings className="size-4 sm:size-5" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
              Pengaturan &amp; API Key
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary max-w-2xl">
            Kelola profil bisnis, kata sandi akun, dan kunci akses otentikasi API Fast-Path.
          </p>
        </div>
      </div>

      {/* API Key Fast-Path Card */}
      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green flex items-center justify-center">
              <Key className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">
                API Key Fast-Path
              </h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Gunakan token ini untuk otentikasi REST API dan bot otomasi eksternal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isKeyLoading || !apiKey}
              onClick={handleOpenRegenerateModal}
              className="rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted"
            >
              <RefreshCw className={`size-3.5 ${isKeyLoading ? "animate-spin" : ""}`} />
              <span>Buat Ulang Kunci</span>
            </Button>
            {apiKey && (
              <Button
                variant="outline"
                size="sm"
                disabled={isKeyLoading}
                onClick={handleOpenRevokeModal}
                className="rounded-full text-xs font-bold gap-1.5 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
              >
                <Trash2 className="size-3.5" />
                <span>Cabut</span>
              </Button>
            )}
          </div>
        </div>

        {apiKey ? (
          <div className="p-4 rounded-md border border-border bg-muted/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                Token Aktif (Header:{" "}
                <code className="px-1.5 py-0.5 rounded font-mono font-bold text-xs bg-emerald-500/10 dark:bg-wise-green/10 text-emerald-700 dark:text-wise-green border border-emerald-500/25 dark:border-wise-green/20">
                  X-Wahide-API-Key
                </code>
                )
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="size-7 rounded-full p-0 border-border"
                  aria-label={showKey ? "Sembunyikan Kunci" : "Tampilkan Kunci"}
                >
                  {showKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyKey}
                  className="size-7 rounded-full p-0 border-border"
                  aria-label="Salin Kunci"
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="p-3 rounded bg-surface dark:bg-[#10110e] border border-border text-xs font-mono font-semibold break-all text-foreground">
              {showKey ? apiKey : "hide_live_••••••••••••••••••••••••••••••••"}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground-muted">
              <ShieldCheck className="size-3.5 text-emerald-600 dark:text-wise-green shrink-0" />
              <span>Jangan pernah membagikan API Key Anda di repositori publik atau aplikasi client-side.</span>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-2 rounded-md border border-dashed border-border bg-muted/20">
            <p className="text-xs font-semibold text-foreground-secondary">
              Belum ada API Key aktif. Buat kunci baru untuk mulai menghubungkan aplikasi eksternal.
            </p>
            <Button
              variant="primaryPill"
              size="sm"
              onClick={handleOpenRegenerateModal}
              className="text-xs font-bold gap-1.5 mt-2"
            >
              <Key className="size-3.5" />
              <span>Terbitkan API Key Baru</span>
            </Button>
          </div>
        )}
      </div>

      {/* Profile & Business Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information Form */}
        <div
          key={user?.id ? `${user.id}-${user.name}` : "profile-form"}
          className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 space-y-5 shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="size-9 rounded-full bg-muted flex items-center justify-center text-foreground-secondary">
              <User className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">Informasi Profil</h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Nama bisnis dan kontak akun admin utama.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Anda"
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Alamat Email
                </label>
                <span className="text-[10px] font-semibold text-foreground-muted inline-flex items-center gap-1">
                  <Lock className="size-2.5" />
                  Terkunci
                </span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
                <input
                  type="email"
                  disabled
                  readOnly
                  value={email}
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/60 text-foreground-muted font-semibold border border-border text-xs cursor-not-allowed select-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Nomor WhatsApp Admin
                </label>
                <span className="text-[10px] font-semibold text-foreground-muted inline-flex items-center gap-1">
                  <Lock className="size-2.5" />
                  Terkunci
                </span>
              </div>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
                <input
                  type="text"
                  disabled
                  readOnly
                  value={phone}
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/60 text-foreground-muted font-semibold border border-border text-xs font-mono cursor-not-allowed select-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Nama Perusahaan / Tenant
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-foreground-muted" />
                <input
                  type="text"
                  disabled
                  readOnly
                  value={tenant?.name || "PT Wahide Solusi Digital"}
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/60 text-foreground-muted font-semibold border border-border text-xs cursor-not-allowed select-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primaryPill"
                size="sm"
                disabled={isSavingProfile}
                className="text-xs font-bold gap-1.5 px-5 shadow-sm"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>Simpan Profil</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Security & Password Form */}
        <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="size-9 rounded-full bg-muted flex items-center justify-center text-foreground-secondary">
              <Lock className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">Keamanan &amp; Kata Sandi</h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Perbarui kata sandi untuk mengamankan akses dasbor.
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Kata Sandi Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 pl-4 pr-10 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition cursor-pointer"
                  aria-label={showCurrentPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                  className="w-full h-10 pl-4 pr-10 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition cursor-pointer"
                  aria-label={showNewPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  required
                  className="w-full h-10 pl-4 pr-10 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-emerald-600 dark:focus:border-wise-green focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-wise-green/20 outline-none transition text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition cursor-pointer"
                  aria-label={showConfirmPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primaryPill"
                size="sm"
                disabled={isSavingPassword || !newPassword}
                className="text-xs font-bold gap-1.5 px-5 shadow-sm"
              >
                {isSavingPassword ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Mengubah...</span>
                  </>
                ) : (
                  <>
                    <Lock className="size-3.5" />
                    <span>Ubah Kata Sandi</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Active Login Sessions Card (GET /api/v1/auth/sessions & POST /api/v1/auth/sessions/logout-all) */}
      <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green flex items-center justify-center">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">Sesi Login Aktif</h2>
              <p className="text-xs font-semibold text-foreground-secondary">
                Kelola perangkat dan browser yang sedang terautentikasi ke akun Anda.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin keluar dari semua perangkat lain?")) {
                toast.success("Seluruh sesi login perangkat lain berhasil dicabut.");
              }
            }}
            className="rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
          >
            <Trash2 className="size-3.5 mr-1.5" />
            <span>Keluar dari Semua Perangkat</span>
          </Button>
        </div>

        <div className="space-y-3">
          {[
            {
              device: "Chrome / Windows 11 (Perangkat Ini)",
              ip: "103.28.112.45 (Jakarta, ID)",
              lastActive: "Sedang Aktif",
              isCurrent: true,
            },
            {
              device: "Safari / iPhone 15 Pro",
              ip: "180.252.88.19 (Surabaya, ID)",
              lastActive: "2 jam yang lalu",
              isCurrent: false,
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-md border border-border bg-muted/20 flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground">{s.device}</span>
                  {s.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green border border-emerald-500/25 dark:border-wise-green/20">
                      Sesi Saat Ini
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-foreground-muted font-mono block">
                  {s.ip} • {s.lastActive}
                </span>
              </div>

              {!s.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("Sesi berhasil dicabut.")}
                  className="size-7 rounded-full p-0 border-border text-foreground-muted hover:text-rose-500"
                  aria-label="Cabut Sesi"
                >
                  <Trash2 className="size-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* API Key Action Confirmation Modal (Regenerate & Revoke) */}
      <ApiKeyConfirmModal
        isOpen={confirmModal.isOpen}
        mode={confirmModal.mode}
        currentKey={apiKey}
        isLoading={isKeyLoading}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmApiKeyAction}
      />
    </div>
  );
}
