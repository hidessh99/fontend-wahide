"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { wabaApi } from "@/modules/whatsapp/api/waba.api";

function WABACallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");
    const errorDesc = searchParams.get("error_description");

    if (errorParam) {
      setStatus("error");
      setErrorMessage(errorDesc || errorParam || "Otorisasi Meta dibatalkan atau ditolak.");
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMessage("Kode otorisasi Meta tidak ditemukan.");
      return;
    }

    const redirectUri = `${window.location.origin}/waba/callback`;

    wabaApi
      .exchangeOAuthCode({ code, redirect_uri: redirectUri })
      .then(() => {
        setStatus("success");
        toast.success("Nomor WhatsApp Official berhasil terhubung via Meta!");

        // If running in popup dialog, communicate back to parent window and close popup
        if (window.opener) {
          try {
            window.opener.postMessage(
              { type: "WABA_OAUTH_SUCCESS" },
              window.location.origin,
            );
          } catch {
            // Ignore cross-window communication errors
          }
          setTimeout(() => {
            window.close();
          }, 800);
        } else {
          setTimeout(() => {
            router.replace("/waba/devices");
          }, 1500);
        }
      })
      .catch((err: unknown) => {
        setStatus("error");
        const msg =
          err instanceof Error
            ? err.message
            : "Gagal memproses otorisasi Meta WhatsApp.";
        setErrorMessage(msg);
        toast.error(msg);
      });
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-border/60 shadow-lg text-center p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">
            {status === "loading" && "Menghubungkan dengan Meta"}
            {status === "success" && "Koneksi Berhasil"}
            {status === "error" && "Koneksi Gagal"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-neutral-900 dark:text-neutral-100" />
              <p className="text-xs text-muted-foreground">
                Sedang memverifikasi nomor dan menyimpan integrasi Meta WABA...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-xs text-muted-foreground">
                Akun berhasil ditautkan! Mengalihkan kembali ke daftar device...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errorMessage}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.replace("/waba/devices")}
                className="gap-2 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali ke Device WABA</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function WABACallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-900" />
        </div>
      }
    >
      <WABACallbackContent />
    </Suspense>
  );
}
