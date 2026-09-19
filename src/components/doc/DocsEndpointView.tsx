"use client";

import React, { useState } from "react";
import { EndpointDoc } from "./types";
import { DocsBreadcrumbs } from "./DocsBreadcrumbs";
import { DocsParametersTable } from "./DocsParametersTable";
import { DocsCodeTabs } from "./DocsCodeTabs";
import { DocsResponseView } from "./DocsResponseView";
import { getApiHost } from "./data";
import {
  Lock,
  Copy,
  Check,
  Info,
  Smartphone,
  Globe,
  Send,
  MessageSquare,
  Camera,
  Zap,
} from "lucide-react";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  Smartphone,
  Globe,
  Send,
  MessageSquare,
  Instagram: InstagramIcon,
  Camera,
  Zap,
};

function getChannelIcon(name: string): React.ElementType {
  return CHANNEL_ICONS[name] || Globe;
}

interface DocsEndpointViewProps {
  doc: EndpointDoc;
}

export function DocsEndpointView({ doc }: DocsEndpointViewProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const apiHost = getApiHost();

  const [selectedChannelId, setSelectedChannelId] = useState<string>(
    doc.channelVariants?.[0]?.id || "",
  );
  const [selectedSubtypeId, setSelectedSubtypeId] = useState<string>("text");

  const activeVariant = doc.channelVariants?.find(
    (v) => v.id === selectedChannelId,
  );
  const currentSubtypes = activeVariant?.subtypes;
  const activeSubtype =
    currentSubtypes?.find((s) => s.id === selectedSubtypeId) ||
    currentSubtypes?.[0];

  const effectiveMethod =
    activeSubtype?.method || activeVariant?.method || doc.method;
  const effectivePath =
    activeSubtype?.path || activeVariant?.path || doc.path;
  const effectiveDescription =
    activeSubtype?.description || activeVariant?.description || doc.description;
  const effectiveHeaders = activeVariant?.headers || doc.headers;
  const effectiveParameters =
    activeSubtype?.parameters || activeVariant?.parameters || doc.parameters;
  const effectiveSnippets =
    activeSubtype?.snippets || activeVariant?.snippets || doc.snippets;
  const effectiveResponses =
    activeSubtype?.responses || activeVariant?.responses || doc.responses;
  const effectiveErrorMatrix = activeVariant?.errorMatrix || doc.errorMatrix;
  const effectiveBadge = activeVariant?.badge || doc.badge;

  const fullUrl = `${apiHost}${effectivePath}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(false);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500 text-white shadow-xs";
      case "POST":
        return "bg-blue-600 text-white shadow-xs";
      case "DELETE":
        return "bg-rose-600 text-white shadow-xs";
      case "PUT":
      case "PATCH":
        return "bg-amber-600 text-white shadow-xs";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Breadcrumbs */}
      <DocsBreadcrumbs
        category={doc.category}
        categorySlug={doc.categorySlug}
        title={doc.title}
      />

      {/* 2. Header Section */}
      <div className="space-y-3" id="overview">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`font-mono text-xs font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${getMethodBadge(
              effectiveMethod,
            )}`}
          >
            {effectiveMethod}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {doc.title}
          </h1>
          {effectiveBadge && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-wise-green/15 text-dark-green dark:text-wise-green border border-wise-green/30">
              {effectiveBadge}
            </span>
          )}
        </div>

        <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed max-w-3xl">
          {effectiveDescription}
        </p>
      </div>

      {/* 3. Omnichannel Channel Switcher Pills & Subtypes (WhatsApp, WABA, Telegram, Messenger, Instagram) */}
      {doc.channelVariants && doc.channelVariants.length > 0 && (
        <div className="space-y-3.5 p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Select Channel / Provider
            </span>
            {activeVariant && (
              <span className="text-xs font-mono font-medium text-muted-foreground">
                Active: <span className="font-bold text-foreground">{activeVariant.label}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {doc.channelVariants.map((variant) => {
              const isSelected = (activeVariant?.id || doc.channelVariants?.[0]?.id) === variant.id;
              const Icon = getChannelIcon(variant.icon);

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variant.disabled}
                  onClick={() => {
                    if (!variant.disabled) {
                      setSelectedChannelId(variant.id);
                      if (variant.subtypes && variant.subtypes.length > 0) {
                        if (!variant.subtypes.some((s) => s.id === selectedSubtypeId)) {
                          setSelectedSubtypeId(variant.subtypes[0].id);
                        }
                      }
                    }
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 select-none ${
                    variant.disabled
                      ? "bg-muted/30 text-muted-foreground/40 border border-border/40 cursor-not-allowed"
                      : isSelected
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/25 font-bold scale-[1.02] cursor-pointer"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border cursor-pointer"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{variant.label}</span>
                  {variant.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-secondary text-secondary-foreground border border-border"
                      }`}
                    >
                      {variant.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Subtype Selector (e.g. [ Teks ] [ Media + Caption ]) */}
          {currentSubtypes && currentSubtypes.length > 1 && (
            <div className="pt-2 border-t border-border/60 flex items-center gap-2">
              <span className="text-[11px] font-medium text-muted-foreground mr-1">
                Payload Type:
              </span>
              <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/60">
                {currentSubtypes.map((sub) => {
                  const isSubSelected =
                    (activeSubtype?.id || currentSubtypes[0].id) === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubtypeId(sub.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                        isSubSelected
                          ? "bg-sky-500 text-white shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/70"
                      }`}
                    >
                      {sub.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Information Notice */}
      {doc.bannerNotice && (
        <div className="rounded-xl border border-border bg-muted/30 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <Info className="size-4 text-emerald-800 dark:text-wise-green shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-foreground">
                {doc.bannerNotice.title}
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                {doc.bannerNotice.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Endpoint Box */}
      <div className="space-y-3" id="endpoint">
        <h2 className="text-base font-bold text-foreground">HTTP Endpoint</h2>

        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center gap-3 font-mono text-xs overflow-x-auto min-w-0">
            <span
              className={`font-bold px-2 py-0.5 rounded uppercase shrink-0 ${getMethodBadge(
                effectiveMethod,
              )}`}
            >
              {effectiveMethod}
            </span>
            <span className="text-muted-foreground shrink-0 select-none">
              {apiHost}
            </span>
            <span className="font-semibold text-foreground truncate">
              {effectivePath}
            </span>
          </div>

          <button
            onClick={handleCopyUrl}
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors shrink-0 cursor-pointer"
            title="Copy URL"
          >
            {copiedUrl ? (
              <>
                <Check className="size-3.5 text-emerald-800 dark:text-wise-green" />
                <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                  Copied!
                </span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 5. Authentication & Headers Card */}
      <div className="space-y-3" id="authentication">
        <h2 className="text-base font-bold text-foreground">Authentication</h2>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="size-3.5 text-emerald-800 dark:text-wise-green shrink-0" />
            <span>
              This endpoint requires Bearer authentication via your secret API
              Key.
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border/80 bg-muted/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase font-bold text-[10px]">
                  <th className="py-2 px-3">Header Key</th>
                  <th className="py-2 px-3">Value</th>
                  <th className="py-2 px-3">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {effectiveHeaders && effectiveHeaders.length > 0 ? (
                  effectiveHeaders.map((header) => (
                    <tr key={header.key}>
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        {header.key}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        {header.value}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          {header.required ? "Required" : "Optional"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        Authorization
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        Bearer &lt;your_api_key&gt;
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          Required
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        Content-Type
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground">
                        application/json
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          Required
                        </span>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. Parameters Table */}
      <div id="parameters">
        <DocsParametersTable parameters={effectiveParameters} />
      </div>

      {/* 7. Code Examples */}
      <div id="code-examples">
        <DocsCodeTabs snippets={effectiveSnippets} />
      </div>

      {/* 8. Responses */}
      <div id="responses">
        <DocsResponseView responses={effectiveResponses} />
      </div>

      {/* 9. Error Handling Matrix */}
      {effectiveErrorMatrix && effectiveErrorMatrix.length > 0 && (
        <div className="space-y-3" id="errors">
          <h2 className="text-base font-bold text-foreground">
            Error Codes & Troubleshooting
          </h2>

          <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 px-4 min-w-22.5">Status</th>
                  <th className="py-2.5 px-3 min-w-35">Error Code</th>
                  <th className="py-2.5 px-4 min-w-55">Description</th>
                  <th className="py-2.5 px-4 min-w-60">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {effectiveErrorMatrix.map((err) => (
                  <tr
                    key={err.error}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-rose-800 dark:text-rose-300">
                      {err.code}
                    </td>
                    <td className="py-3 px-3">
                      <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20 font-semibold">
                        {err.error}
                      </code>
                    </td>
                    <td className="py-3 px-4 text-foreground-secondary">
                      {err.description}
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {err.solution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
