"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { userSchema } from "@/lib/validations/demo";

export default function Home() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [validationResult, setValidationResult] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleValidate = () => {
    const result = userSchema.safeParse({ username, email });
    if (result.success) {
      setIsSuccess(true);
      setValidationResult(`Validasi Zod Berhasil: ${JSON.stringify(result.data)}`);
    } else {
      setIsSuccess(false);
      const errors = result.error.issues.map((issue) => issue.message).join(", ");
      setValidationResult(`Validasi Gagal: ${errors}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="w-full max-w-xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Next.js + Turbopack + Bun Ready
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Proyek fontwahide</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Next.js versi terbaru dengan Tailwind CSS, shadcn/ui, Zod & TypeScript
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/50">
            <p className="font-semibold">Next.js</p>
            <p className="text-zinc-500 dark:text-zinc-400">v16.3.3</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/50">
            <p className="font-semibold">Engine</p>
            <p className="text-zinc-500 dark:text-zinc-400">Turbopack (Rust)</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/50">
            <p className="font-semibold">Package Mgr</p>
            <p className="text-zinc-500 dark:text-zinc-400">Bun v1.4</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/50">
            <p className="font-semibold">Styling</p>
            <p className="text-zinc-500 dark:text-zinc-400">Tailwind CSS v4</p>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
          <h2 className="text-base font-semibold">Demo Validasi Zod & shadcn/ui Button</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Username (3 - 20 karakter)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="contoh: wahide"
                className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh: user@example.com"
                className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleValidate} className="cursor-pointer">
                Uji Validasi Zod
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setUsername("");
                  setEmail("");
                  setValidationResult(null);
                  setIsSuccess(null);
                }}
                className="cursor-pointer"
              >
                Reset
              </Button>
            </div>

            {validationResult && (
              <div
                className={`mt-3 rounded-md p-3 text-xs font-medium ${
                  isSuccess
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                }`}
              >
                {validationResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
