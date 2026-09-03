"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { authApi } from "@/modules/iam/api/auth.api";
import { userApi } from "@/modules/iam/api/user.api";
import { generateSecureRandomString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ApiKeyConfirmModal } from "@/modules/iam/components/settings/ApiKeyConfirmModal";
import { ProfileInfoCard } from "@/modules/iam/components/settings/ProfileInfoCard";
import { ActiveSessionsCard } from "@/modules/iam/components/settings/ActiveSessionsCard";
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
  ShieldCheck,
  Loader2,
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
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(apiKey);
    toast.success(t("settings.keyCopied"), { id: "apikey-copy" });
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
        toast.success(t("settings.keyRegenerated"), { id: "apikey-action" });
      } else {
        await authApi.revokeApiKey();
        setApiKey("");
        toast.success("API Key berhasil dicabut.", { id: "apikey-action" });
      }
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses aksi API Key.";
      toast.error(msg, { id: "apikey-action" });
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    } finally {
      setIsKeyLoading(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { current?: string; new?: string; confirm?: string } = {};

    if (!currentPassword) {
      errors.current = "Kata sandi saat ini wajib diisi.";
    }
    if (newPassword.length < 8) {
      errors.new = "Kata sandi baru minimal 8 karakter.";
    }
    if (newPassword !== confirmPassword) {
      errors.confirm = "Konfirmasi kata sandi baru tidak cocok.";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setIsSavingPassword(true);
    try {
      await userApi.changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Kata sandi berhasil diperbarui.", { id: "password-save" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal mengubah kata sandi. Pastikan kata sandi saat ini sesuai.";
      toast.error(msg, { id: "password-save" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
              <Settings className="size-4 sm:size-5" />
            </div>
            <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
              Pengaturan &amp; API Key
            </h1>
          </div>
          <p className="text-foreground-secondary max-w-2xl text-xs font-semibold sm:text-sm">
            Kelola profil bisnis, kata sandi akun, dan kunci akses otentikasi API Fast-Path.
          </p>
        </div>
      </div>

      {/* API Key Fast-Path Card */}
      <div className="border-border bg-surface space-y-6 rounded-md border p-6 shadow-sm sm:p-8 dark:bg-[#161715]">
        <div className="border-border flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
              <Key className="size-5" />
            </div>
            <div>
              <h2 className="text-foreground text-xl font-black tracking-tight">
                API Key Fast-Path
              </h2>
              <p className="text-foreground-secondary text-xs font-semibold">
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
              className="border-border hover:border-foreground-muted gap-1.5 rounded-full text-xs font-bold"
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
                className="gap-1.5 rounded-full border-rose-500/20 text-xs font-bold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
              >
                <Trash2 className="size-3.5" />
                <span>Cabut</span>
              </Button>
            )}
          </div>
        </div>

        {apiKey ? (
          <div className="border-border bg-muted/30 space-y-3 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-xs font-bold">
                Token Aktif (Header:{" "}
                <code className="dark:bg-wise-green/10 dark:text-wise-green dark:border-wise-green/20 rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-xs font-bold text-emerald-700">
                  X-Wahide-API-Key
                </code>
                )
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="border-border size-7 rounded-full p-0"
                  aria-label={showKey ? "Sembunyikan Kunci" : "Tampilkan Kunci"}
                >
                  {showKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyKey}
                  className="border-border size-7 rounded-full p-0"
                  aria-label="Salin Kunci"
                >
                  <Copy className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="bg-surface border-border text-foreground rounded border p-3 font-mono text-xs font-semibold break-all dark:bg-[#10110e]">
              {showKey ? apiKey : "hide_live_••••••••••••••••••••••••••••••••"}
            </div>

            <div className="text-foreground-muted flex items-center gap-1.5 text-[11px] font-semibold">
              <ShieldCheck className="dark:text-wise-green size-3.5 shrink-0 text-emerald-600" />
              <span>
                Jangan pernah membagikan API Key Anda di repositori publik atau aplikasi
                client-side.
              </span>
            </div>
          </div>
        ) : (
          <div className="border-border bg-muted/20 space-y-2 rounded-md border border-dashed p-6 text-center">
            <p className="text-foreground-secondary text-xs font-semibold">
              Belum ada API Key aktif. Buat kunci baru untuk mulai menghubungkan aplikasi eksternal.
            </p>
            <Button
              variant="primaryPill"
              size="sm"
              onClick={handleOpenRegenerateModal}
              className="mt-2 gap-1.5 text-xs font-bold"
            >
              <Key className="size-3.5" />
              <span>Terbitkan API Key Baru</span>
            </Button>
          </div>
        )}
      </div>

      {/* Profile & Business Details */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Profile Information Form */}
        <ProfileInfoCard
          key={user?.id ? `${user.id}-${user.name}` : "profile-form-unloaded"}
          user={user}
          tenant={tenant}
          onSaveProfile={updateProfileName}
        />

        {/* Security & Password Form */}
        <div className="border-border bg-surface space-y-5 rounded-md border p-6 shadow-sm sm:p-8 dark:bg-[#161715]">
          <div className="border-border flex items-center gap-3 border-b pb-4">
            <div className="bg-muted text-foreground-secondary flex size-9 items-center justify-center rounded-full">
              <Lock className="size-4" />
            </div>
            <div>
              <h2 className="text-foreground text-lg font-black">Keamanan &amp; Kata Sandi</h2>
              <p className="text-foreground-secondary text-xs font-semibold">
                Perbarui kata sandi untuk mengamankan akses dasbor.
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-4">
            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Kata Sandi Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordErrors.current)
                      setPasswordErrors((prev) => ({ ...prev, current: undefined }));
                  }}
                  placeholder="••••••••"
                  required
                  className={`bg-surface text-foreground hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-10 pl-4 text-xs font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e] ${
                    passwordErrors.current ? "border-rose-500" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition"
                  aria-label={showCurrentPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordErrors.current && (
                <p className="mt-1.5 pl-3 text-xs font-semibold text-rose-500">
                  {passwordErrors.current}
                </p>
              )}
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (passwordErrors.new)
                      setPasswordErrors((prev) => ({ ...prev, new: undefined }));
                  }}
                  placeholder="Minimal 8 karakter"
                  required
                  className={`bg-surface text-foreground hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-10 pl-4 text-xs font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e] ${
                    passwordErrors.new ? "border-rose-500" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition"
                  aria-label={showNewPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordErrors.new && (
                <p className="mt-1.5 pl-3 text-xs font-semibold text-rose-500">
                  {passwordErrors.new}
                </p>
              )}
            </div>

            <div>
              <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordErrors.confirm)
                      setPasswordErrors((prev) => ({ ...prev, confirm: undefined }));
                  }}
                  placeholder="Ulangi kata sandi baru"
                  required
                  className={`bg-surface text-foreground hover:border-foreground-muted dark:focus:border-wise-green dark:focus:ring-wise-green/20 h-10 w-full rounded-full border pr-10 pl-4 text-xs font-semibold transition outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[#10110e] ${
                    passwordErrors.confirm ? "border-rose-500" : "border-border"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition"
                  aria-label={showConfirmPassword ? "Sembunyikan Kata Sandi" : "Lihat Kata Sandi"}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {passwordErrors.confirm && (
                <p className="mt-1.5 pl-3 text-xs font-semibold text-rose-500">
                  {passwordErrors.confirm}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primaryPill"
                size="sm"
                disabled={isSavingPassword || !newPassword}
                className="gap-1.5 px-5 text-xs font-bold shadow-sm"
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

      {/* Active Login Sessions Card (GET /api/v1/users/sessions, POST /logout-all, DELETE /sessions/:tokenId) */}
      <ActiveSessionsCard />

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
