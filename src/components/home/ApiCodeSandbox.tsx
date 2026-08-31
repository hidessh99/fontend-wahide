"use client";

import React, { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";
import { env } from "@/lib/config/env";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Code2, Copy, Check, ExternalLink, Workflow } from "lucide-react";

type LangType = "curl" | "nodejs" | "go" | "php" | "python";

const POSTMAN_DOCS_URL = "https://documenter.getpostman.com/view/26294023/2sBYAuSqz3";

export function ApiCodeSandbox() {
  const { t } = useI18n();
  const [activeLang, setActiveLang] = useState<LangType>("curl");
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang].code);
    setIsCopied(true);
    toast.success(t("common.landing.apiSandbox.copied"));
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-surface dark:bg-[#161715] p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-wise-green/20 dark:bg-wise-green/15 text-dark-green dark:text-wise-green">
            <Code2 className="size-3.5" />
            <span>{t("common.landing.apiSandbox.badge")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {t("common.landing.apiSandbox.title")}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-foreground-secondary leading-relaxed">
            {t("common.landing.apiSandbox.subtitle")}
          </p>
        </div>

        <a
          href={POSTMAN_DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "rounded-full text-xs font-bold gap-1.5 border-border hover:border-foreground-muted shrink-0 min-h-9"
          )}
        >
          <span>{t("common.landing.apiSandbox.docsBtn")}</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      {/* Code Container */}
      <div className="rounded-lg bg-near-black border border-white/10 overflow-hidden shadow-xl text-xs font-mono">
        {/* Language Tabs & Copy Button */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/50 border-b border-white/10">
          <div className="flex items-center gap-1 overflow-x-auto">
            {(Object.keys(codeSnippets) as LangType[]).map((key) => {
              const isActive = activeLang === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveLang(key)}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                    isActive
                      ? "bg-wise-green text-near-black"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {codeSnippets[key].langName}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white/90 hover:text-white transition text-[11px] font-sans font-semibold shrink-0 min-h-7"
          >
            {isCopied ? (
              <>
                <Check className="size-3 text-wise-green" />
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
        <div className="p-4 sm:p-6 overflow-x-auto text-white/95 leading-relaxed font-mono text-[11px] sm:text-xs">
          <pre>
            <code>{codeSnippets[activeLang].code}</code>
          </pre>
        </div>
      </div>

      {/* Meta WhatsApp Cloud API Drop-in Compatibility Callout */}
      <div className="rounded-lg border border-wise-green/30 bg-wise-green/5 dark:bg-wise-green/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-xs">
        <div className="size-9 rounded-full bg-wise-green/20 text-dark-green dark:text-wise-green flex items-center justify-center shrink-0">
          <Workflow className="size-4.5" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-wise-green text-near-black text-[10px] font-black uppercase tracking-wider">
              {t("common.landing.apiSandbox.metaCompatBadge")}
            </span>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">
              {t("common.landing.apiSandbox.metaCompatTitle")}
            </h3>
          </div>
          <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
            {t("common.landing.apiSandbox.metaCompatDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
