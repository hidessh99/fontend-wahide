"use client";

import React, { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { env } from "@/lib/config/env";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Code2, Copy, Check, ExternalLink, Workflow } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";

type LangType = "curl" | "nodejs" | "go" | "php" | "python";

const POSTMAN_DOCS_URL = "https://documenter.getpostman.com/view/26294023/2sBYAuSqz3";

export function ApiCodeSandbox() {
  const { t } = useI18n();
  const [activeLang, setActiveLang] = useState<LangType>("curl");
  const { isCopied, copy } = useClipboard();

  // Dynamic API endpoint from environment configuration
  const apiEndpoint = env.NEXT_PUBLIC_WHATSAPP_API_URL
    ? `${env.NEXT_PUBLIC_WHATSAPP_API_URL.replace(/\/+$/, "")}/messages/send`
    : "https://api.wahide.id/v1/messages/send";

  const codeSnippets: Record<LangType, { langName: string; code: string }> = {
    curl: {
      langName: "cURL",
      code: `curl -X POST ${apiEndpoint} \\
  -H "Authorization: Bearer hide_live_984f8812a3b04c89b27658df2026" \\
  -H "Content-Type: application/json" \\
  -d '{
    "device_id": "01J00000000000000000000001",
    "phone": "6281234567890",
    "message": "Halo Budi Santoso, pesanan #{1001|1002} sedang dikemas!",
    "spintax": true
  }'`,
    },
    nodejs: {
      langName: "Node.js (Fetch)",
      code: `const response = await fetch("${apiEndpoint}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer hide_live_984f8812a3b04c89b27658df2026",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    device_id: "01J00000000000000000000001",
    phone: "6281234567890",
    message: "Halo Budi, kode OTP login Anda adalah: 849201",
    priority: "HIGH",
  }),
});

const data = await response.json();
console.log("Message Dispatched:", data.payload.message_id);`,
    },
    go: {
      langName: "Go",
      code: `package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func main() {
    payload, _ := json.Marshal(map[string]any{
        "device_id": "01J00000000000000000000001",
        "phone":     "6281234567890",
        "message":   "Faktur #INV-9821 telah lunas.",
    })

    req, _ := http.NewRequest("POST", "${apiEndpoint}", bytes.NewBuffer(payload))
    req.Header.Set("Authorization", "Bearer hide_live_984f8812a3b04c89b27658df2026")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}`,
    },
    php: {
      langName: "PHP (Laravel)",
      code: `use Illuminate\\Support\\Facades\\Http;

$response = Http::withHeaders([
    'Authorization' => 'Bearer hide_live_984f8812a3b04c89b27658df2026',
])->post('${apiEndpoint}', [
    'device_id' => '01J00000000000000000000001',
    'phone'     => '6281234567890',
    'message'   => 'Pesanan Anda sedang dikirimkan via kurir!',
    'spintax'   => true,
]);

if ($response->successful()) {
    $messageId = $response->json('payload.message_id');
}`,
    },
    python: {
      langName: "Python",
      code: `import requests

url = "${apiEndpoint}"
headers = {
    "Authorization": "Bearer hide_live_984f8812a3b04c89b27658df2026",
    "Content-Type": "application/json"
}
payload = {
    "device_id": "01J00000000000000000000001",
    "phone": "6281234567890",
    "message": "Halo Kak, status tiket #TKT-4412 telah selesai.",
    "spintax": True
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    },
  };

  const handleCopy = async () => {
    const success = await copy(codeSnippets[activeLang].code);
    if (success) {
      toast.success(t("common.landing.apiSandbox.copied"));
    }
  };

  return (
    <div className="border-border bg-surface space-y-6 rounded-lg border p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-6 md:flex-row md:items-end">
        <div className="max-w-xl space-y-2">
          <div className="bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
            <Code2 className="size-3.5" />
            <span>{t("common.landing.apiSandbox.badge")}</span>
          </div>
          <h2 className="text-foreground text-2xl font-black tracking-tight sm:text-3xl">
            {t("common.landing.apiSandbox.title")}
          </h2>
          <p className="text-foreground-secondary text-xs leading-relaxed font-semibold sm:text-sm">
            {t("common.landing.apiSandbox.subtitle")}
          </p>
        </div>

        <a
          href={POSTMAN_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "border-border hover:border-foreground-muted min-h-9 shrink-0 gap-1.5 rounded-full text-xs font-bold"
          )}
        >
          <span>{t("common.landing.apiSandbox.docsBtn")}</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      {/* Code Container */}
      <div className="bg-near-black overflow-hidden rounded-lg border border-white/10 font-mono text-xs shadow-xl">
        {/* Language Tabs & Copy Button */}
        <div className="flex items-center justify-between border-b border-white/10 bg-black/50 px-4 py-2.5">
          <div className="flex items-center gap-1 overflow-x-auto">
            {(Object.keys(codeSnippets) as LangType[]).map((key) => {
              const isActive = activeLang === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveLang(key)}
                  className={`rounded px-3 py-1 text-xs font-bold transition ${
                    isActive
                      ? "bg-wise-green text-near-black"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {codeSnippets[key].langName}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 font-sans text-[11px] font-semibold text-white/90 transition hover:bg-white/15 hover:text-white"
          >
            {isCopied ? (
              <>
                <Check className="text-wise-green size-3" />
                <span>Disalin</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>{t("common.landing.apiSandbox.copyBtn")}</span>
              </>
            )}
          </button>
        </div>

        {/* Code Pre Block */}
        <div className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-white/95 sm:p-6 sm:text-xs">
          <pre>
            <code>{codeSnippets[activeLang].code}</code>
          </pre>
        </div>
      </div>

      {/* Meta WhatsApp Cloud API Drop-in Compatibility Callout */}
      <div className="border-wise-green/30 bg-wise-green/5 dark:bg-wise-green/10 flex flex-col items-start gap-3.5 rounded-lg border p-4 shadow-xs sm:flex-row sm:items-center sm:p-5">
        <div className="bg-wise-green/20 text-dark-green dark:text-wise-green flex size-9 shrink-0 items-center justify-center rounded-full">
          <Workflow className="size-4.5" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-wise-green text-near-black rounded-full px-2 py-0.5 text-[10px] font-black tracking-wider uppercase">
              {t("common.landing.apiSandbox.metaCompatBadge")}
            </span>
            <h3 className="text-foreground text-xs font-bold sm:text-sm">
              {t("common.landing.apiSandbox.metaCompatTitle")}
            </h3>
          </div>
          <p className="text-foreground-secondary text-xs leading-relaxed font-semibold">
            {t("common.landing.apiSandbox.metaCompatDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
