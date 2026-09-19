"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Play,
  Tag,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { FlowCanvas } from "../components/FlowCanvas";
import { NodePropertiesPanel } from "../components/NodePropertiesPanel";
import { FlowSimulatorModal } from "../components/FlowSimulatorModal";
import {
  FlowDefinition,
  CanvasGraph,
  FlowNode,
  CreateFlowInput,
  UpdateFlowInput,
} from "../types/flow.types";
import { flowApi } from "../api/flow.api";
import { toast } from "sonner";

interface FlowBuilderViewProps {
  flowId?: string; // If undefined, mode is "new"
}

const DEFAULT_INITIAL_GRAPH: CanvasGraph = {
  nodes: [
    {
      id: "node_start",
      type: "start",
      position: { x: 80, y: 150 },
      data: { label: "Mulai (Start)" },
    },
    {
      id: "node_welcome",
      type: "message",
      position: { x: 340, y: 150 },
      data: {
        label: "Pesan Sambutan",
        message: "Halo! Terima kasih telah menghubungi kami. Ada yang bisa kami bantu?",
      },
    },
  ],
  edges: [
    {
      id: "e_start_welcome",
      source: "node_start",
      target: "node_welcome",
    },
  ],
  viewport: { x: 0, y: 0, zoom: 1 },
};

export function FlowBuilderView({ flowId }: FlowBuilderViewProps) {
  const { t } = useI18n();
  const router = useRouter();

  const [name, setName] = useState(flowId ? "" : "Alur Percakapan Baru");
  const [description, setDescription] = useState("");
  const [triggerKeywords, setTriggerKeywords] = useState<string[]>(["halo", "menu"]);
  const [keywordInput, setKeywordInput] = useState("");
  const [graph, setGraph] = useState<CanvasGraph>(DEFAULT_INITIAL_GRAPH);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);

  const [isLoading, setIsLoading] = useState(!!flowId);
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Load existing flow if editing
  useEffect(() => {
    if (!flowId) return;

    let isMounted = true;
    const loadFlow = async () => {
      setIsLoading(true);
      try {
        const data = await flowApi.getFlowById(flowId);
        if (data && isMounted) {
          setName(data.name);
          setDescription(data.description || "");
          setTriggerKeywords(data.trigger_keywords || []);
          if (data.canvas_graph && data.canvas_graph.nodes?.length > 0) {
            setGraph(data.canvas_graph);
          }
        }
      } catch {
        toast.error("Gagal memuat alur flow");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadFlow();
    return () => {
      isMounted = false;
    };
  }, [flowId]);

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim().toLowerCase();
      if (val && !triggerKeywords.includes(val)) {
        setTriggerKeywords([...triggerKeywords, val]);
        setKeywordInput("");
      }
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setTriggerKeywords(triggerKeywords.filter((k) => k !== kw));
  };

  const handleUpdateNodeData = (nodeId: string, data: Partial<FlowNode["data"]>) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    }));

    if (selectedNode?.id === nodeId) {
      setSelectedNode((prev) =>
        prev ? { ...prev, data: { ...prev.data, ...data } } : null,
      );
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((n) => n.id !== nodeId),
      edges: prev.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    }));
    setSelectedNode(null);
  };

  const handleSaveGraph = async (updatedGraph: CanvasGraph) => {
    setGraph(updatedGraph);

    if (!name.trim()) {
      toast.error("Nama flow wajib diisi");
      return;
    }

    // Validate that graph has at least 1 start node
    const hasStart = updatedGraph.nodes.some((n) => n.type === "start");
    if (!hasStart) {
      toast.error("Alur wajib memiliki minimal 1 node Mulai (Start)");
      return;
    }

    setIsSaving(true);
    try {
      if (flowId) {
        const updatePayload: UpdateFlowInput = {
          name: name.trim(),
          description: description.trim(),
          trigger_type: "KEYWORD",
          trigger_keywords: triggerKeywords,
          canvas_graph: updatedGraph,
        };
        await flowApi.updateFlow(flowId, updatePayload);
        toast.success(t("autoreply.flows.updatedSuccess"));
      } else {
        const createPayload: CreateFlowInput = {
          name: name.trim(),
          description: description.trim(),
          trigger_type: "KEYWORD",
          trigger_keywords: triggerKeywords,
          canvas_graph: updatedGraph,
          is_active: true,
        };
        const created = await flowApi.createFlow(createPayload);
        toast.success(t("autoreply.flows.createdSuccess"));
        router.push(`/autoreply/flow/${created.id}`);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : t("autoreply.flows.createFailed");
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="border-border bg-surface flex h-[80vh] items-center justify-center rounded-2xl border p-8">
        <div className="border-wise-green h-8 w-8 animate-spin rounded-full border-3 border-t-transparent" />
        <p className="text-foreground-muted ml-3 text-xs font-medium">
          {t("autoreply.flows.loadingCanvas")}
        </p>
      </div>
    );
  }

  const currentFlowMock: FlowDefinition = {
    id: flowId || "temp_flow",
    tenant_id: "",
    name,
    description,
    trigger_type: "KEYWORD",
    trigger_keywords: triggerKeywords,
    canvas_graph: graph,
    is_active: true,
    execution_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -mb-8 sm:-mb-12 overflow-hidden">
      {/* Top Header Bar */}
      <div className="border-border bg-surface flex items-center justify-between border-b px-3 sm:px-6 py-2.5 sm:py-3 shadow-sm z-30 shrink-0 dark:bg-[#131412]">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/autoreply/flow"
            className="text-foreground-secondary hover:text-foreground hover:bg-muted rounded-xl p-2 transition-colors cursor-pointer shrink-0"
            title="Kembali ke Daftar Flow"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("autoreply.flows.namePlaceholder")}
              className="bg-transparent text-foreground text-xs sm:text-sm font-bold focus:outline-none focus:border-b focus:border-wise-green w-full max-w-[150px] sm:max-w-xs truncate"
            />
            <p className="text-foreground-muted text-[10px] truncate">
              <span className="hidden sm:inline">Visual DAG Canvas • </span>
              {graph.nodes.length} Node • {graph.edges.length} Koneksi
            </p>
          </div>
        </div>

        {/* Trigger Keywords Pills & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 border border-border bg-background rounded-xl px-2.5 py-1 text-xs">
            <Tag className="size-3 text-wise-green" />
            <span className="text-foreground-muted text-[11px]">Pemicu:</span>
            {triggerKeywords.map((kw) => (
              <span
                key={kw}
                className="bg-muted text-foreground rounded px-1.5 py-0.5 text-[10px] font-medium flex items-center gap-1"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="hover:text-destructive"
                >
                  &times;
                </button>
              </span>
            ))}
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="+ kata kunci"
              className="bg-transparent text-foreground w-20 text-[11px] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsSimulatorOpen(true)}
            className="border-border bg-surface hover:bg-muted text-foreground flex items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
            title={t("autoreply.flows.testFlow")}
          >
            <Play className="size-3.5 text-wise-green" />
            <span className="hidden sm:inline">{t("autoreply.flows.testFlow")}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveGraph(graph)}
            disabled={isSaving}
            className="bg-wise-green text-dark-green hover:brightness-105 flex items-center gap-1.5 rounded-xl px-3 sm:px-4 py-1.5 text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save className="size-3.5" />
            <span>{isSaving ? "Menyimpan..." : "Simpan Flow"}</span>
          </button>
        </div>
      </div>

      {/* Canvas & Floating Sidebar */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Visual Graph Canvas */}
        <FlowCanvas
          initialGraph={graph}
          onChangeGraph={setGraph}
          onSelectNode={setSelectedNode}
          selectedNodeId={selectedNode?.id}
        />

        {/* Node Properties Panel: Bottom Sheet on Mobile (<md), Floating Panel on Desktop (md+) */}
        {selectedNode && (
          <>
            {/* Mobile backdrop */}
            <div
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden"
              onClick={() => setSelectedNode(null)}
            />
            <div
              className="fixed inset-x-0 bottom-0 z-40 max-h-[85vh] md:max-h-none md:absolute md:inset-auto md:right-4 md:top-4 md:bottom-4 md:z-20 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <NodePropertiesPanel
                selectedNode={selectedNode}
                onUpdateNodeData={handleUpdateNodeData}
                onDeleteNode={handleDeleteNode}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          </>
        )}
      </div>

      {/* Interactive Simulator Modal */}
      {isSimulatorOpen && (
        <FlowSimulatorModal
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
          flow={currentFlowMock}
        />
      )}
    </div>
  );
}
