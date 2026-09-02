"use client";

import React, { useState, useEffect, useCallback } from "react";
import { userApi } from "@/modules/iam/api/user.api";
import { ActiveSession } from "@/modules/iam/types/auth.types";
import { Button } from "@/components/ui/button";
import { SessionConfirmModal } from "./SessionConfirmModal";
import { toast } from "sonner";
import {
  ShieldCheck,
  Trash2,
  RefreshCw,
  Laptop,
  Smartphone,
  Globe,
  Loader2,
} from "lucide-react";

function formatDeviceLabel(ua?: string): { name: string; isMobile: boolean } {
  if (!ua) return { name: "Web Browser (Perangkat Tidak Diketahui)", isMobile: false };
  const lower = ua.toLowerCase();

  if (lower.includes("iphone")) return { name: "Safari / iPhone (iOS)", isMobile: true };
  if (lower.includes("ipad")) return { name: "Safari / iPad (iPadOS)", isMobile: true };
  if (lower.includes("android")) return { name: "Chrome / Android Device", isMobile: true };
  if (lower.includes("windows")) return { name: "Chrome / Windows 11 PC", isMobile: false };
  if (lower.includes("macintosh") || lower.includes("mac os"))
    return { name: "Safari / macOS", isMobile: false };
  if (lower.includes("linux")) return { name: "Browser / Linux Desktop", isMobile: false };

  return { name: "Peramban Web / Desktop", isMobile: false };
}

function formatRelativeTime(dateStr?: string, isCurrent?: boolean): string {
  if (isCurrent) return "Sedang Aktif Saat Ini";
  if (!dateStr) return "Baru saja";

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Baru saja";

    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSec < 60) return "Baru saja";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit yang lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam yang lalu`;
    return `${Math.floor(diffSec / 86400)} hari yang lalu`;
  } catch {
    return "Baru saja";
  }
}

export function ActiveSessionsCard() {
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
    const { name } = formatDeviceLabel(session.user_agent);
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
        toast.success("Seluruh sesi login perangkat lain berhasil dicabut.");
      } else if (confirmModal.targetSession?.tokenId) {
        await userApi.revokeSession(confirmModal.targetSession.tokenId);
        toast.success("Sesi perangkat terpilih berhasil dicabut.");
      }
      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      await loadSessions();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses pencabutan sesi.";
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const otherSessionsCount = sessions.filter((s) => !s.is_current).length;

  return (
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

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadSessions}
            disabled={isLoading}
            className="size-8 rounded-full p-0 border-border text-foreground-muted hover:text-foreground hover:bg-muted"
            aria-label="Refresh Sesi"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          {otherSessionsCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenLogoutAllModal}
              className="rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
            >
              <Trash2 className="size-3.5 mr-1.5" />
              <span>Keluar dari Semua Perangkat</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center space-y-2 text-foreground-muted">
          <Loader2 className="size-6 animate-spin text-emerald-600 dark:text-wise-green" />
          <span className="text-xs font-semibold">Memuat sesi login aktif...</span>
        </div>
      ) : sessions.length === 0 ? (
        <div className="p-4 rounded-md border border-border bg-muted/20 flex items-center gap-3">
          <Globe className="size-4 text-foreground-muted shrink-0" />
          <div className="text-xs font-semibold text-foreground-secondary">
            Sesi saat ini aktif. Belum ada perangkat lain yang terhubung.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s, idx) => {
            const { name, isMobile } = formatDeviceLabel(s.user_agent);
            const timeLabel = formatRelativeTime(s.last_active || s.created_at, s.is_current);

            return (
              <div
                key={s.token_id || idx}
                className="p-3.5 rounded-md border border-border bg-muted/20 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center text-foreground-secondary shrink-0">
                    {isMobile ? <Smartphone className="size-4" /> : <Laptop className="size-4" />}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-foreground truncate">
                        {name} {s.is_current ? "(Perangkat Ini)" : ""}
                      </span>
                      {s.is_current && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 dark:bg-wise-green/15 text-emerald-700 dark:text-wise-green border border-emerald-500/25 dark:border-wise-green/20">
                          Sesi Saat Ini
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-foreground-muted font-mono block truncate">
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
                    className="size-7 rounded-full p-0 border-border text-foreground-muted hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/10 shrink-0"
                    aria-label="Cabut Sesi"
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
