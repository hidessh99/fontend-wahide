"use client";

import React from "react";
import { X, Trash2, Sliders } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { FlowNode } from "../types/flow.types";

interface NodePropertiesPanelProps {
  selectedNode: FlowNode | null;
  onUpdateNodeData: (nodeId: string, data: Partial<FlowNode["data"]>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

export function NodePropertiesPanel({
  selectedNode,
  onUpdateNodeData,
  onDeleteNode,
  onClose,
}: NodePropertiesPanelProps) {
  const { t } = useI18n();

  if (!selectedNode) {
    return (
      <div className="border-border bg-surface/90 backdrop-blur-md flex h-full w-80 flex-col rounded-2xl border p-5 shadow-lg dark:bg-[#151714]/90">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Sliders className="size-4 text-foreground-muted" />
          <h3 className="text-foreground text-xs font-bold">
            {t("autoreply.flows.builder.properties.title")}
          </h3>
        </div>
        <div className="flex flex-1 items-center justify-center text-center p-4">
          <p className="text-foreground-muted text-xs">
            {t("autoreply.flows.builder.properties.noSelection")}
          </p>
        </div>
      </div>
    );
  }

  const { id, type, data } = selectedNode;

  return (
    <div className="border-border bg-surface/95 backdrop-blur-md flex h-full w-80 flex-col rounded-2xl border shadow-xl dark:bg-[#151714]/95 overflow-hidden">
      {/* Panel Header */}
      <div className="border-border flex items-center justify-between border-b px-5 py-3.5 bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-wise-green/10 text-dark-green dark:text-wise-green px-2 py-0.5 text-[10px] font-bold uppercase">
            {type}
          </span>
          <span className="text-foreground text-xs font-bold truncate max-w-[120px]">
            {data.label || id}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-foreground-muted hover:text-foreground rounded-lg p-1 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Property Controls */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* Label */}
        <div className="space-y-1">
          <label className="text-foreground text-xs font-bold">
            {t("autoreply.flows.builder.properties.label")}
          </label>
          <input
            type="text"
            value={data.label || ""}
            onChange={(e) => onUpdateNodeData(id, { label: e.target.value })}
            className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3 py-2 text-xs font-medium focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Message or Question Text */}
        {(type === "message" || type === "question") && (
          <div className="space-y-1">
            <label className="text-foreground text-xs font-bold">
              {t("autoreply.flows.builder.properties.messageText")}
            </label>
            <textarea
              rows={4}
              value={data.message || ""}
              onChange={(e) => onUpdateNodeData(id, { message: e.target.value })}
              placeholder="Ketik teks pesan atau pertanyaan bot..."
              className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border p-3 text-xs font-medium focus:ring-2 focus:outline-none"
            />
          </div>
        )}

        {/* Question Variable & Validation */}
        {type === "question" && (
          <>
            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.flows.builder.properties.variableName")}
              </label>
              <input
                type="text"
                value={data.variableName || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, { variableName: e.target.value.trim() })
                }
                placeholder={t("autoreply.flows.builder.properties.variablePlaceholder")}
                className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3 py-2 text-xs font-medium font-mono focus:ring-2 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.flows.builder.properties.validationType")}
              </label>
              <select
                value={data.validationType || "any"}
                onChange={(e) =>
                  onUpdateNodeData(id, {
                    validationType: e.target.value as "any" | "email" | "number" | "phone",
                  })
                }
                className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3 py-2 text-xs font-medium focus:ring-2 focus:outline-none"
              >
                <option value="any">{t("autoreply.flows.builder.properties.valAny")}</option>
                <option value="email">{t("autoreply.flows.builder.properties.valEmail")}</option>
                <option value="number">{t("autoreply.flows.builder.properties.valNumber")}</option>
                <option value="phone">{t("autoreply.flows.builder.properties.valPhone")}</option>
              </select>
            </div>
          </>
        )}

        {/* Condition Branch */}
        {type === "condition" && (
          <>
            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.flows.builder.properties.conditionVariable")}
              </label>
              <input
                type="text"
                value={data.conditionVariable || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, { conditionVariable: e.target.value.trim() })
                }
                placeholder="nama_variabel"
                className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3 py-2 text-xs font-medium font-mono focus:ring-2 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.flows.builder.properties.conditionOperator")}
              </label>
              <select
                value={data.conditionOperator || "=="}
                onChange={(e) =>
                  onUpdateNodeData(id, {
                    conditionOperator: e.target.value as "==" | "!=" | ">" | "<" | "contains",
                  })
                }
                className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3 py-2 text-xs font-medium focus:ring-2 focus:outline-none"
              >
                <option value="==">Sama dengan (==)</option>
                <option value="!=">Tidak sama (!=)</option>
                <option value="contains">Mengandung teks</option>
                <option value=">">Lebih besar (&gt;)</option>
                <option value="<">Lebih kecil (&lt;)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.flows.builder.properties.conditionValue")}
              </label>
              <input
                type="text"
                value={data.conditionValue || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, { conditionValue: e.target.value })
                }
                placeholder="nilai pembanding"
                className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3 py-2 text-xs font-medium focus:ring-2 focus:outline-none"
              />
            </div>
          </>
        )}

        {/* Delay Interval */}
        {type === "delay" && (
          <div className="space-y-1">
            <label className="text-foreground text-xs font-bold">
              {t("autoreply.flows.builder.properties.delaySeconds")}
            </label>
            <input
              type="number"
              min="1"
              max="300"
              value={data.delaySeconds || 2}
              onChange={(e) =>
                onUpdateNodeData(id, { delaySeconds: parseInt(e.target.value, 10) || 1 })
              }
              className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3 py-2 text-xs font-medium focus:ring-2 focus:outline-none"
            />
          </div>
        )}

        {/* API Call Webhook */}
        {type === "api_call" && (
          <>
            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold">URL Webhook API</label>
              <input
                type="url"
                value={data.apiUrl || ""}
                onChange={(e) => onUpdateNodeData(id, { apiUrl: e.target.value })}
                placeholder="https://api.external.com/lead-webhook"
                className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3 py-2 text-xs font-medium focus:ring-2 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold">HTTP Method</label>
              <select
                value={data.apiMethod || "POST"}
                onChange={(e) =>
                  onUpdateNodeData(id, { apiMethod: e.target.value as "GET" | "POST" })
                }
                className="border-border bg-background text-foreground focus:ring-wise-green/30 focus:border-wise-green w-full rounded-xl border px-3 py-2 text-xs font-medium focus:ring-2 focus:outline-none"
              >
                <option value="POST">POST (JSON Body)</option>
                <option value="GET">GET</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Footer / Delete */}
      <div className="border-border border-t p-4 bg-muted/10">
        <button
          type="button"
          onClick={() => onDeleteNode(id)}
          className="border-destructive/30 text-destructive hover:bg-destructive/10 flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-xs font-bold transition-colors cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span>{t("autoreply.flows.builder.properties.deleteNode")}</span>
        </button>
      </div>
    </div>
  );
}
