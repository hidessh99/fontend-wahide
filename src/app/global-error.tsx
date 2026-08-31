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
      <body className="h-full flex items-center justify-center p-6 bg-[#0e0f0c] text-[#fbfcf9] font-sans antialiased">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-lg border border-white/10 bg-[#161715] shadow-2xl">
          <div className="size-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-2xl font-black">
            !
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black tracking-tight">
              Terjadi Hambatan Fatal pada Aplikasi
            </h1>
            <p className="text-xs text-white/70 leading-relaxed">
              Root layout mengalami kendala tidak terduga. Silakan segarkan ulang aplikasi untuk memulihkan sesi Anda.
            </p>
          </div>

          {error?.digest && (
            <div className="p-2.5 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-white/60">
              Ref ID: <span className="text-[#9fe870] font-bold">{error.digest}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => reset()}
              className="w-full h-10 px-5 rounded-full bg-[#9fe870] text-[#163300] font-bold text-xs hover:bg-[#8edb5f] transition"
            >
              Coba Pulihkan
            </button>
            <Link
              href="/"
              className="w-full h-10 px-5 rounded-full border border-white/20 text-white font-bold text-xs hover:bg-white/10 transition flex items-center justify-center"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
