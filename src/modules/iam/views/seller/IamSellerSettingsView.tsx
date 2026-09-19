"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/modules/iam/hooks/useAuth";
import { authApi } from "@/modules/iam/api/auth.api";
import { userApi } from "@/modules/iam/api/user.api";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const ApiKeyConfirmModal = dynamic(
  () =>
    import("@/modules/iam/components/seller/ApiKeyConfirmModal").then(
      (m) => m.ApiKeyConfirmModal,
    ),
  { ssr: false },
);
import { ProfileInfoCard } from "@/modules/iam/components/seller/ProfileInfoCard";
import { ActiveSessionsCard } from "@/modules/iam/components/seller/ActiveSessionsCard";
import { WebhookConfigCard } from "@/modules/subscription/components/seller/WebhookConfigCard";
import { WebhookLogsTable } from "@/modules/subscription/components/seller/WebhookLogsTable";
import { useSubscription } from "@/modules/subscription/hooks/useSubscription";
import { useI18n } from "@/lib/i18n/context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
  User as UserIcon,
  Globe,
} from "lucide-react";

type SettingsTab = "profile" | "security" | "api-keys" | "webhooks";
const VALID_TABS: SettingsTab[] = [
  "profile",
  "security",
  "api-keys",
  "webhooks",
];

export function IamSellerSettingsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();

  const tabParam = searchParams.get("tab") as SettingsTab | null;
  const initialTab: SettingsTab =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "profile";

  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);

  // Sync tab state when URL search params change
  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const { user, tenant, updateProfileName, fetchProfile } = useAuth();
  const { webhookConfig, saveWebhook, regenerateSecret, copySecret } =
    useSubscription();
  const [apiKey, setApiKey] = useState<string>(user?.token || "");
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

  // Keep apiKey in sync with user profile whenever user data updates
  useEffect(() => {
    if (user?.token) {
      setApiKey(user.token);
    }
  }, [user?.token]);

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
    if (!apiKey) return;
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
        if (res?.token) {
          setApiKey(res.token);
          toast.success(t("settings.keyRegenerated"), { id: "apikey-action" });
          await fetchProfile().catch(() => null);
        } else {
          toast.error(t("settings.keyFetchError"), {
            id: "apikey-action",
          });
        }
      } else {
        await authApi.revokeApiKey();
        setApiKey("");
        toast.success(t("settings.keyRevoked"), { id: "apikey-action" });
        await fetchProfile().catch(() => null);
      }
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("settings.keyActionError");
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
      errors.current = t("settings.currentPasswordRequired");
    }
    if (newPassword.length < 8) {
      errors.new = t("settings.newPasswordMinLength");
    }
    if (newPassword !== confirmPassword) {
      errors.confirm = t("settings.confirmPasswordMismatch");
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
      toast.success(t("settings.passwordChangedSuccess"), {
        id: "password-save",
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("settings.passwordChangeError");
      toast.error(msg, { id: "password-save" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const navTabs: {
    id: SettingsTab;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "profile",
      label: t("settings.tabProfile") || "Profil Akun",
      shortLabel: t("settings.tabProfileShort") || "Profil",
      icon: UserIcon,
    },
    {
      id: "security",
      label: t("settings.tabSecurity") || "Keamanan & Sesi",
      shortLabel: t("settings.tabSecurityShort") || "Keamanan",
      icon: ShieldCheck,
    },
    {
      id: "api-keys",
      label: t("settings.tabApiKey") || "API Key Fast-Path",
      shortLabel: t("settings.tabApiKeyShort") || "API Key",
      icon: Key,
    },
    {
      id: "webhooks",
      label: t("settings.tabWebhooks") || "Integrasi Webhook",
      shortLabel: t("settings.tabWebhooksShort") || "Webhook",
      icon: Globe,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-3 sm:space-y-8 sm:p-6 lg:p-8">
      {/* Top Header Section */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 sm:size-9">
            <Settings className="size-4 sm:size-5" />
          </div>
          <h1 className="text-foreground text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
            {t("settings.title") || "Pengaturan & Integrasi"}
          </h1>
        </div>
        <p className="text-foreground-secondary text-xs font-semibold sm:text-sm">
          {t("settings.subtitle") ||
            "Kelola profil bisnis, kata sandi keamanan, kredensial API Key, dan integrasi webhook."}
        </p>
      </div>

      <Separator className="my-6" />

      {/* Classic shadcn/ui Settings Layout: 2-column on desktop, responsive 4-column segmented control on mobile */}
      <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-12 lg:space-y-0">
        {/* Navigation (Segmented pill bar on mobile, vertical sidebar on desktop) */}
        <aside className="w-full lg:w-1/5 shrink-0">
          <nav
            className="grid grid-cols-4 gap-1 p-1 bg-muted/60 dark:bg-muted/40 rounded-xl border border-border/50 lg:flex lg:flex-col lg:gap-0 lg:space-y-1 lg:p-0 lg:bg-transparent lg:border-0 lg:rounded-none"
            aria-label="Pengaturan Navigasi"
            role="tablist"
          >
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1 sm:gap-2 rounded-lg py-2 px-1 sm:px-3 lg:px-3.5 lg:py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer",
                    isActive
                      ? "bg-surface text-foreground shadow-xs font-black dark:bg-muted/90 lg:bg-muted"
                      : "text-foreground-secondary hover:bg-surface/50 dark:hover:bg-muted/50 hover:text-foreground font-semibold",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-colors",
                      isActive
                        ? "text-emerald-600 dark:text-wise-green"
                        : "text-foreground-muted",
                    )}
                  />
                  <span className="text-[11px] sm:text-xs lg:text-sm font-bold tracking-tight truncate">
                    <span className="inline sm:hidden">{tab.shortLabel}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Panel */}
        <div className="flex-1 min-w-0 lg:max-w-4xl space-y-6">
          {/* TAB 1: Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-lg font-black tracking-tight">
                  {t("settings.tabProfile") || "Profil Akun"}
                </h2>
                <p className="text-foreground-secondary text-xs font-semibold">
                  {t("settings.profileTabDesc") ||
                    "Kelola profil pribadi Anda dan identitas workspace tenant bisnis."}
                </p>
              </div>
              <Separator />
              <ProfileInfoCard
                key={
                  user?.id ? `${user.id}-${user.name}` : "profile-form-unloaded"
                }
                user={user}
                tenant={tenant}
                onSaveProfile={updateProfileName}
              />
            </div>
          )}

          {/* TAB 2: Security & Active Sessions */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-lg font-black tracking-tight">
                  {t("settings.tabSecurity") || "Keamanan & Sesi"}
                </h2>
                <p className="text-foreground-secondary text-xs font-semibold">
                  {t("settings.securityTabDesc") ||
                    "Perbarui kata sandi akun dan pantau sesi login aktif dari berbagai perangkat."}
                </p>
              </div>
              <Separator />

              {/* Password Change Form Card */}
              <div className="border-border bg-surface space-y-5 rounded-xl border p-6 shadow-sm sm:p-8">
                <div className="border-border flex items-center gap-3 border-b pb-4">
                  <div className="bg-muted text-foreground-secondary flex size-9 items-center justify-center rounded-full">
                    <Lock className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-base font-black sm:text-lg">
                      {t("settings.securityTab") || "Keamanan & Kata Sandi"}
                    </h3>
                    <p className="text-foreground-secondary text-xs font-semibold">
                      {t("iam.settings.updatePasswordDesc")}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <label className="text-foreground-secondary mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                      {t("iam.settings.currentPassword")}
                    </label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          if (passwordErrors.current)
                            setPasswordErrors((prev) => ({
                              ...prev,
                              current: undefined,
                            }));
                        }}
                        placeholder="••••••••"
                        required
                        variant="pill"
                        isError={!!passwordErrors.current}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition"
                        aria-label={
                          showCurrentPassword
                            ? "Sembunyikan Kata Sandi"
                            : "Lihat Kata Sandi"
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
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
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (passwordErrors.new)
                            setPasswordErrors((prev) => ({
                              ...prev,
                              new: undefined,
                            }));
                        }}
                        placeholder="Minimal 8 karakter"
                        required
                        variant="pill"
                        isError={!!passwordErrors.new}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition"
                        aria-label={
                          showNewPassword
                            ? "Sembunyikan Kata Sandi"
                            : "Lihat Kata Sandi"
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
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
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (passwordErrors.confirm)
                            setPasswordErrors((prev) => ({
                              ...prev,
                              confirm: undefined,
                            }));
                        }}
                        placeholder="Ulangi kata sandi baru"
                        required
                        variant="pill"
                        isError={!!passwordErrors.confirm}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-foreground-muted hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer transition"
                        aria-label={
                          showConfirmPassword
                            ? "Sembunyikan Kata Sandi"
                            : "Lihat Kata Sandi"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
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
                          <span>
                            {t("common.settings.changingPasswordBtn")}
                          </span>
                        </>
                      ) : (
                        <>
                          <Lock className="size-3.5" />
                          <span>{t("common.settings.changePasswordBtn")}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Active Login Sessions Card */}
              <ActiveSessionsCard />
            </div>
          )}

          {/* TAB 3: API Keys */}
          {activeTab === "api-keys" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-lg font-black tracking-tight">
                  {t("settings.tabApiKey") || "API Key Fast-Path"}
                </h2>
                <p className="text-foreground-secondary text-xs font-semibold">
                  {t("settings.apiKeyTabDesc") ||
                    "Kelola kredensial token API Fast-Path untuk integrasi backend eksternal dan bot."}
                </p>
              </div>
              <Separator />

              {/* API Key Fast-Path Card */}
              <div className="border-border bg-surface space-y-6 rounded-xl border p-6 shadow-sm sm:p-8">
                <div className="border-border flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
                      <Key className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-foreground text-lg font-black tracking-tight">
                        API Key Fast-Path
                      </h3>
                      <p className="text-foreground-secondary text-xs font-semibold">
                        Gunakan token ini untuk otentikasi REST API dan bot
                        otomasi eksternal.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isKeyLoading}
                      onClick={handleOpenRegenerateModal}
                      className="border-border hover:border-foreground-muted gap-1.5 rounded-full text-xs font-bold"
                    >
                      <RefreshCw
                        className={`size-3.5 ${isKeyLoading ? "animate-spin" : ""}`}
                      />
                      <span>{apiKey ? "Buat Ulang Kunci" : "Buat Kunci"}</span>
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
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-foreground text-xs font-bold">
                          Token Aktif (Header:
                        </span>
                        <code className="dark:bg-wise-green/10 dark:text-wise-green dark:border-wise-green/20 rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-xs font-bold text-emerald-700">
                          Authorization: Bearer &lt;token&gt;
                        </code>
                        <span className="text-foreground-secondary text-xs">
                          {t("common.or")}
                        </span>
                        <code className="dark:bg-wise-green/10 dark:text-wise-green dark:border-wise-green/20 rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-xs font-bold text-emerald-700">
                          X-API-Key
                        </code>
                        <span className="text-foreground text-xs font-bold">
                          )
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowKey(!showKey)}
                          className="border-border size-7 rounded-full p-0"
                          aria-label={
                            showKey ? "Sembunyikan Kunci" : "Tampilkan Kunci"
                          }
                        >
                          {showKey ? (
                            <EyeOff className="size-3.5" />
                          ) : (
                            <Eye className="size-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyKey}
                          className="border-border size-7 rounded-full p-0"
                          aria-label={t("common.settings.copyKeyAria")}
                        >
                          <Copy className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-surface border-border text-foreground rounded border p-3 font-mono text-xs font-semibold break-all select-all dark:bg-[#10110e]">
                      {showKey
                        ? apiKey
                        : `${apiKey.slice(0, 5)}••••••••••••••••••••••••••••••••`}
                    </div>

                    <div className="text-foreground-muted flex items-center gap-1.5 text-[11px] font-semibold">
                      <ShieldCheck className="dark:text-wise-green size-3.5 shrink-0 text-emerald-600" />
                      <span>
                        Jangan pernah membagikan API Key Anda di repositori
                        publik atau aplikasi client-side.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="border-border bg-muted/20 space-y-2 rounded-md border border-dashed p-6 text-center">
                    <p className="text-foreground-secondary text-xs font-semibold">
                      Belum ada API Key aktif. Buat kunci baru untuk mulai
                      menghubungkan aplikasi eksternal.
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
            </div>
          )}

          {/* TAB 4: Webhooks */}
          {activeTab === "webhooks" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground text-lg font-black tracking-tight">
                  {t("settings.tabWebhooks") || "Integrasi Webhook"}
                </h2>
                <p className="text-foreground-secondary text-xs font-semibold">
                  {t("settings.webhooksTabDesc") ||
                    "Konfigurasikan endpoint callback HTTP untuk menerima event WhatsApp secara real-time."}
                </p>
              </div>
              <Separator />

              {/* Webhook Configuration Card */}
              <WebhookConfigCard
                config={webhookConfig}
                onSave={saveWebhook}
                onRegenerateSecret={regenerateSecret}
                onCopySecret={copySecret}
              />

              {/* Webhook Delivery Logs History */}
              <WebhookLogsTable />
            </div>
          )}
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
