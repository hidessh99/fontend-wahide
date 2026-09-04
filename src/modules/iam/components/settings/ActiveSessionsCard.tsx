"use client";

import React, { useState, useEffect, useCallback } from "react";
import { userApi } from "@/modules/iam/api/user.api";
import { ActiveSession } from "@/modules/iam/types/auth.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SessionConfirmModal } from "./SessionConfirmModal";
import { toast } from "sonner";
import { ShieldCheck, Trash2, RefreshCw, Laptop, Smartphone, Globe, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

function formatDeviceLabel(
  ua?: string,
  unknownLabel = "Web Browser (Unknown Device)",
  desktopLabel = "Web Browser / Desktop"
): { name: string; isMobile: boolean } {
  if (!ua) return { name: unknownLabel, isMobile: false };
  const lower = ua.toLowerCase();

  if (lower.includes("iphone")) return { name: "Safari / iPhone (iOS)", isMobile: true };
  if (lower.includes("ipad")) return { name: "Safari / iPad (iPadOS)", isMobile: true };
  if (lower.includes("android")) return { name: "Chrome / Android Device", isMobile: true };
  if (lower.includes("windows")) return { name: "Chrome / Windows 11 PC", isMobile: false };
  if (lower.includes("macintosh") || lower.includes("mac os"))
    return { name: "Safari / macOS", isMobile: false };
  if (lower.includes("linux")) return { name: "Browser / Linux Desktop", isMobile: false };

  return { name: desktopLabel, isMobile: false };
}

function formatRelativeTime(
  dateStr: string | undefined,
  isCurrent: boolean | undefined,
  t: (key: string, params?: Record<string, string | number>) => string
): string {
  if (isCurrent) return t("settings.activeNow");
  if (!dateStr) return t("settings.justNow");

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return t("settings.justNow");

    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60) return t("settings.justNow");
    if (diffSec < 3600) return t("settings.minutesAgo", { count: Math.floor(diffSec / 60) });
    if (diffSec < 86400) return t("settings.hoursAgo", { count: Math.floor(diffSec / 3600) });
    return t("settings.daysAgo", { count: Math.floor(diffSec / 86400) });
  } catch {
    return t("settings.justNow");
  }
}

export function ActiveSessionsCard() {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    mode: "LOGOUT_ALL" | "REVOKE_SINGLE";
    targetSession?: { tokenId: string; device: string; ip: string } | null;
  }>({
    isOpen: false,
    mode: "LOGOUT_ALL",
    targetSession: null,
  });

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getActiveSessions();
      setSessions(data);
    } catch {
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    userApi
      .getActiveSessions()
      .then((data) => {
        if (isMounted) {
          setSessions(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSessions([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenLogoutAllModal = () => {
    setConfirmModal({
      isOpen: true,
      mode: "LOGOUT_ALL",
      targetSession: null,
    });
  };

  const handleOpenRevokeSingleModal = (session: ActiveSession) => {
    const { name } = formatDeviceLabel(
      session.user_agent,
      t("settings.unknownDevice"),
      t("settings.desktopBrowser")
    );
    setConfirmModal({
      isOpen: true,
      mode: "REVOKE_SINGLE",
      targetSession: {
        tokenId: session.token_id,
        device: name,
        ip: session.ip_address || "127.0.0.1",
      },
    });
  };

  const handleConfirmAction = async () => {
    setIsActionLoading(true);
    try {
      if (confirmModal.mode === "LOGOUT_ALL") {
        await userApi.logoutAllSessions();
        toast.success(t("settings.allSessionsRevoked"), {
          id: "session-revoke",
        });
      } else if (confirmModal.targetSession?.tokenId) {
        await userApi.revokeSession(confirmModal.targetSession.tokenId);
        toast.success(t("settings.singleSessionRevoked"), { id: "session-revoke" });
      }
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      await loadSessions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("settings.revokeSessionFailed");
      toast.error(msg, { id: "session-revoke" });
    } finally {
      setIsActionLoading(false);
    }
  };

  const otherSessionsCount = sessions.filter((s) => !s.is_current).length;

  return (
    <div className="border-border bg-surface space-y-5 rounded-xl border p-6 shadow-sm sm:p-8">
      <div className="border-border flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="dark:bg-wise-green/15 dark:text-wise-green flex size-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-black">{t("settings.activeSessions")}</h2>
            <p className="text-foreground-secondary text-xs font-semibold">
              {t("settings.activeSessionsDesc")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadSessions}
            disabled={isLoading}
            className="border-border text-foreground-muted hover:text-foreground hover:bg-muted h-9 shrink-0 cursor-pointer gap-1.5 rounded-full px-3 text-xs font-bold transition"
            aria-label={t("settings.refreshAria")}
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{t("settings.refreshBtn")}</span>
          </Button>

          {otherSessionsCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenLogoutAllModal}
              className="rounded-full border-rose-500/20 text-xs font-bold text-rose-600 hover:bg-rose-500/10 dark:text-rose-400"
            >
              <Trash2 className="mr-1.5 size-3.5" />
              <span>{t("settings.terminateAll")}</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-foreground-muted flex flex-col items-center justify-center space-y-2 py-8">
          <Loader2 className="dark:text-wise-green size-6 animate-spin text-emerald-600" />
          <span className="text-xs font-semibold">{t("settings.loadingSessions")}</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="border-border bg-muted/20 flex items-center gap-3 rounded-md border p-4">
          <Globe className="text-foreground-muted size-4 shrink-0" />
          <div className="text-foreground-secondary text-xs font-semibold">
            {t("settings.noOtherSessions")}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s, idx) => {
            const { name, isMobile } = formatDeviceLabel(
              s.user_agent,
              t("settings.unknownDevice"),
              t("settings.desktopBrowser")
            );
            const timeLabel = formatRelativeTime(s.last_active || s.created_at, s.is_current, t);

            return (
              <div
                key={s.token_id || idx}
                className="border-border bg-muted/20 flex items-center justify-between gap-3 rounded-md border p-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="bg-muted text-foreground-secondary flex size-8 shrink-0 items-center justify-center rounded-full">
                    {isMobile ? <Smartphone className="size-4" /> : <Laptop className="size-4" />}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-foreground truncate text-xs font-bold">
                        {name} {s.is_current ? t("settings.thisDevice") : ""}
                      </span>
                      {s.is_current && <Badge variant="success">{t("settings.currentSessionBadge")}</Badge>}
                    </div>
                    <span className="text-foreground-muted block truncate font-mono text-[11px]">
                      {s.ip_address || "127.0.0.1"} • {timeLabel}
                    </span>
                  </div>
                </div>

                {!s.is_current && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenRevokeSingleModal(s)}
                    className="border-border text-foreground-muted size-7 shrink-0 rounded-full p-0 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500"
                    aria-label={t("settings.revokeSessionAria")}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Session Action Confirmation Modal */}
      <SessionConfirmModal
        isOpen={confirmModal.isOpen}
        mode={confirmModal.mode}
        targetSession={confirmModal.targetSession}
        isLoading={isActionLoading}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
