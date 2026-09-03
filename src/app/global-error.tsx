"use client";

import React, { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Fatal Root Layout Crash Caught]:", error);
  }, [error]);

  return (
    <html lang="id" className="h-full">
      <body className="bg-near-black flex h-full items-center justify-center p-6 font-sans text-[#fbfcf9] antialiased">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-white/10 bg-[#161715] p-8 text-center shadow-2xl">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-500/20 text-2xl font-black text-rose-400">
            !
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black tracking-tight">
              Terjadi Hambatan Fatal pada Aplikasi
            </h1>
            <p className="text-xs leading-relaxed text-white/70">
              Root layout mengalami kendala tidak terduga. Silakan segarkan ulang aplikasi untuk
              memulihkan sesi Anda.
            </p>
          </div>

          {error?.digest && (
            <div className="rounded border border-white/10 bg-black/40 p-2.5 font-mono text-[11px] text-white/60">
              Ref ID: <span className="text-wise-green font-bold">{error.digest}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => reset()}
              className="bg-wise-green text-dark-green hover:bg-wise-green/90 h-10 w-full rounded-full px-5 text-xs font-bold transition"
            >
              Coba Pulihkan
            </button>
            <Link
              href="/"
              className="flex h-10 w-full items-center justify-center rounded-full border border-white/20 px-5 text-xs font-bold text-white transition hover:bg-white/10"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
