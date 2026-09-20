"use client";

import React from "react";
import { X, Trash2, Sliders } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { FlowNode } from "../types/flow.types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";

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
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="border-border bg-surface/98 backdrop-blur-md flex h-full max-h-[80vh] md:max-h-none w-full md:w-80 flex-col rounded-t-3xl md:rounded-2xl border-t md:border shadow-2xl dark:bg-[#151714]/98 overflow-hidden"
    >
      {/* Mobile Drawer Pull Indicator */}
      <div className="pt-2.5 pb-1 flex justify-center md:hidden">
        <div className="w-10 h-1 rounded-full bg-foreground-muted/30" />
      </div>

      {/* Panel Header */}
      <div className="border-border flex items-center justify-between border-b px-5 py-3.5 bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-wise-green/10 text-dark-green dark:text-wise-green px-2 py-0.5 text-[10px] font-bold uppercase">
            {type}
          </span>
          <span className="text-foreground text-xs font-bold truncate max-w-[160px] sm:max-w-[120px]">
            {data.label || id}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          className="text-foreground-muted hover:text-foreground rounded-lg"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Property Controls */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* Label */}
        <div className="space-y-1">
          <label className="text-foreground text-xs font-bold">
            {t("autoreply.flows.builder.properties.label")}
          </label>
          <Input
            type="text"
            value={data.label || ""}
            onChange={(e) => onUpdateNodeData(id, { label: e.target.value })}
            variant="rounded"
          />
        </div>

        {/* Message or Question Text */}
        {(type === "message" || type === "question") && (
          <div className="space-y-1">
            <label className="text-foreground text-xs font-bold">
              {t("autoreply.flows.builder.properties.messageText")}
            </label>
            <Textarea
              rows={4}
              value={data.message || ""}
              onChange={(e) =>
                onUpdateNodeData(id, { message: e.target.value })
              }
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
              <Input
                type="text"
                value={data.variableName || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, {
                    variableName: e.target.value.trim(),
                  })
                }
                placeholder={t(
                  "autoreply.flows.builder.properties.variablePlaceholder",
                )}
                className="font-mono"
                variant="rounded"
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold block">
                {t("autoreply.flows.builder.properties.validationType")}
              </label>
              <NativeSelect
                value={data.validationType || "any"}
                onChange={(e) =>
                  onUpdateNodeData(id, {
                    validationType: e.target.value as
                      | "any"
                      | "email"
                      | "number"
                      | "phone",
                  })
                }
                variant="rounded"
                className="w-full"
              >
                <NativeSelectOption value="any">
                  {t("autoreply.flows.builder.properties.valAny")}
                </NativeSelectOption>
                <NativeSelectOption value="email">
                  {t("autoreply.flows.builder.properties.valEmail")}
                </NativeSelectOption>
                <NativeSelectOption value="number">
                  {t("autoreply.flows.builder.properties.valNumber")}
                </NativeSelectOption>
                <NativeSelectOption value="phone">
                  {t("autoreply.flows.builder.properties.valPhone")}
                </NativeSelectOption>
              </NativeSelect>
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
              <Input
                type="text"
                value={data.conditionVariable || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, {
                    conditionVariable: e.target.value.trim(),
                  })
                }
                placeholder="nama_variabel"
                className="font-mono"
                variant="rounded"
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold block">
                {t("autoreply.flows.builder.properties.conditionOperator")}
              </label>
              <NativeSelect
                value={data.conditionOperator || "=="}
                onChange={(e) =>
                  onUpdateNodeData(id, {
                    conditionOperator: e.target.value as
                      | "=="
                      | "!="
                      | ">"
                      | "<"
                      | "contains",
                  })
                }
                variant="rounded"
                className="w-full"
              >
                <NativeSelectOption value="==">
                  Sama dengan (==)
                </NativeSelectOption>
                <NativeSelectOption value="!=">
                  Tidak sama (!=)
                </NativeSelectOption>
                <NativeSelectOption value="contains">
                  Mengandung teks
                </NativeSelectOption>
                <NativeSelectOption value=">">
                  Lebih besar (&gt;)
                </NativeSelectOption>
                <NativeSelectOption value="<">
                  Lebih kecil (&lt;)
                </NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold">
                {t("autoreply.flows.builder.properties.conditionValue")}
              </label>
              <Input
                type="text"
                value={data.conditionValue || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, { conditionValue: e.target.value })
                }
                placeholder="nilai pembanding"
                variant="rounded"
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
            <Input
              type="number"
              min="1"
              max="300"
              value={data.delaySeconds || 2}
              onChange={(e) =>
                onUpdateNodeData(id, {
                  delaySeconds: parseInt(e.target.value, 10) || 1,
                })
              }
              variant="rounded"
            />
          </div>
        )}

        {/* API Call Webhook */}
        {type === "api_call" && (
          <>
            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold">
                URL Webhook API
              </label>
              <Input
                type="url"
                value={data.apiUrl || ""}
                onChange={(e) =>
                  onUpdateNodeData(id, { apiUrl: e.target.value })
                }
                placeholder="https://api.external.com/lead-webhook"
                variant="rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="text-foreground text-xs font-bold block">
                HTTP Method
              </label>
              <NativeSelect
                value={data.apiMethod || "POST"}
                onChange={(e) =>
                  onUpdateNodeData(id, {
                    apiMethod: e.target.value as "GET" | "POST",
                  })
                }
                variant="rounded"
                className="w-full"
              >
                <NativeSelectOption value="POST">
                  POST (JSON Body)
                </NativeSelectOption>
                <NativeSelectOption value="GET">GET</NativeSelectOption>
              </NativeSelect>
            </div>
          </>
        )}
      </div>

      {/* Footer / Delete */}
      <div className="border-border border-t p-4 bg-muted/10">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDeleteNode(id)}
          className="w-full gap-2 rounded-xl text-xs font-bold"
        >
          <Trash2 className="size-3.5" />
          <span>{t("autoreply.flows.builder.properties.deleteNode")}</span>
        </Button>
      </div>
    </div>
  );
}
