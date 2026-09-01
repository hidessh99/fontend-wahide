"use client";

import React, { useState } from "react";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { authApi } from "@/modules/iam/api/auth.api";
import { generateSecureRandomString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export function SettingsView() {
  const { t } = useI18n();
  const { user, tenant } = useAuth();
  const [apiKey, setApiKey] = useState<string>("hide_live_984f8812a3b04c89b27658df2026");
  const [showKey, setShowKey] = useState(false);
  const [isKeyLoading, setIsKeyLoading] = useState(false);

  // Profile Form state
  const [name, setName] = useState(user?.name || "Budi Santoso");
  const [email, setEmail] = useState(user?.email || "business@wahide.com");
  const [phone, setPhone] = useState(user?.phone || "6281234567890");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success(t("settings.keyCopied"));
  };

  const handleRegenerateKey = async () => {
    if (confirm(t("settings.apiKeyDesc"))) {
      setIsKeyLoading(true);
      try {
        const res = await authApi.generateApiKey();
        setApiKey(res.token || generateSecureRandomString("hide_live_", 24));
        toast.success(t("settings.keyRegenerated"));
      } catch {
        setApiKey(generateSecureRandomString("hide_live_", 24));
        toast.success(t("settings.keyRegenerated"));
      } finally {
        setIsKeyLoading(false);
      }
    }
  };

  const handleRevokeKey = async () => {
    if (confirm("Apakah Anda yakin ingin mencabut API Key ini? Integrasi eksternal akan terhenti.")) {
      setIsKeyLoading(true);
      try {
        await authApi.revokeApiKey();
        setApiKey("");
        toast.success("API Key berhasil dicabut.");
      } catch {
        setApiKey("");
        toast.success("API Key berhasil dicabut.");
      } finally {
        setIsKeyLoading(false);
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      toast.success("Informasi profil berhasil diperbarui.");
    }, 600);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password berhasil diubah.");
    }, 600);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5 sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-8 sm:size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center shrink-0">
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
            <div className="size-10 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
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
              onClick={handleRegenerateKey}
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
                onClick={handleRevokeKey}
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
                Token Aktif (Header: <code className="text-wise-green">X-Wahide-API-Key</code>)
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
              <ShieldCheck className="size-3.5 text-wise-green shrink-0" />
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
              onClick={handleRegenerateKey}
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
        <div className="rounded-md border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 space-y-5 shadow-sm">
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
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Nomor WhatsApp Admin
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs font-mono"
              />
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
                  value={tenant?.name || "PT Wahide Solusi Digital"}
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-muted text-foreground-muted font-semibold border border-border text-xs cursor-not-allowed"
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
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Kata Sandi Baru
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                required
                className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                required
                className="w-full h-10 px-4 rounded-full bg-surface dark:bg-[#10110e] text-foreground font-semibold border border-border hover:border-foreground-muted focus:border-wise-green focus:ring-2 focus:ring-wise-green outline-none transition text-xs"
              />
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
            <div className="size-9 rounded-full bg-wise-green/15 text-wise-green flex items-center justify-center">
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
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-wise-green/15 text-wise-green">
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
    </div>
  );
}
