"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  ZoomIn,
  ZoomOut,
  Bot,
  HelpCircle,
  Clock,
  GitBranch,
  Globe,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FlowNode,
  FlowEdge,
  FlowNodeType,
  CanvasGraph,
} from "../types/flow.types";

interface FlowCanvasProps {
  initialGraph: CanvasGraph;
  onChangeGraph?: (graph: CanvasGraph) => void;
  onSelectNode: (node: FlowNode | null) => void;
  selectedNodeId?: string;
}

export function FlowCanvas({
  initialGraph,
  onChangeGraph,
  onSelectNode,
  selectedNodeId,
}: FlowCanvasProps) {

  const [nodes, setNodes] = useState<FlowNode[]>(initialGraph.nodes || []);
  const [edges, setEdges] = useState<FlowEdge[]>(initialGraph.edges || []);
  const [zoom, setZoom] = useState(1);
  const [connectingSource, setConnectingSource] = useState<string | null>(null);

  // Sync state if initialGraph updates from parent
  React.useEffect(() => {
    if (initialGraph?.nodes) {
      setNodes(initialGraph.nodes);
    }
    if (initialGraph?.edges) {
      setEdges(initialGraph.edges);
    }
  }, [initialGraph]);

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleMouseDownNode = (e: React.MouseEvent, node: FlowNode) => {
    e.stopPropagation();
    onSelectNode(node);
    setDraggingNodeId(node.id);
    dragOffset.current = {
      x: e.clientX - node.position.x * zoom,
      y: e.clientY - node.position.y * zoom,
    };
  };

  const handleTouchStartNode = (e: React.TouchEvent, node: FlowNode) => {
    e.stopPropagation();
    onSelectNode(node);
    const touch = e.touches[0];
    if (!touch) return;
    setDraggingNodeId(node.id);
    dragOffset.current = {
      x: touch.clientX - node.position.x * zoom,
      y: touch.clientY - node.position.y * zoom,
    };
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingNodeId) return;
    const newX = Math.round((e.clientX - dragOffset.current.x) / zoom);
    const newY = Math.round((e.clientY - dragOffset.current.y) / zoom);

    setNodes((prev) =>
      prev.map((n) =>
        n.id === draggingNodeId ? { ...n, position: { x: newX, y: newY } } : n,
      ),
    );
  };

  const handleTouchMoveCanvas = (e: React.TouchEvent) => {
    if (!draggingNodeId) return;
    const touch = e.touches[0];
    if (!touch) return;
    const newX = Math.round((touch.clientX - dragOffset.current.x) / zoom);
    const newY = Math.round((touch.clientY - dragOffset.current.y) / zoom);

    setNodes((prev) =>
      prev.map((n) =>
        n.id === draggingNodeId ? { ...n, position: { x: newX, y: newY } } : n,
      ),
    );
  };

  const handleMouseUpCanvas = () => {
    if (draggingNodeId) {
      onChangeGraph?.({ nodes, edges, viewport: { x: 0, y: 0, zoom } });
    }
    setDraggingNodeId(null);
  };

  const handleTouchEndCanvas = () => {
    if (draggingNodeId) {
      onChangeGraph?.({ nodes, edges, viewport: { x: 0, y: 0, zoom } });
    }
    setDraggingNodeId(null);
  };

  const handleAddNode = (type: FlowNodeType) => {
    const id = `node_${Date.now()}`;
    const defaultLabels: Record<FlowNodeType, string> = {
      start: "Mulai (Start)",
      message: "Kirim Pesan",
      question: "Tanya Pertanyaan",
      condition: "Cek Kondisi",
      delay: "Jeda Waktu",
      api_call: "Panggil Webhook",
      end: "Selesai (End)",
    };

    const newNode: FlowNode = {
      id,
      type,
      position: {
        x: 120 + nodes.length * 40,
        y: 120 + (nodes.length % 5) * 60,
      },
      data: {
        label: defaultLabels[type] || "Node Baru",
        message: type === "message" ? "Halo, selamat datang!" : "",
        variableName: type === "question" ? "jawaban" : "",
        validationType: "any",
      },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    onChangeGraph?.({ nodes: updatedNodes, edges, viewport: { x: 0, y: 0, zoom } });
    onSelectNode(newNode);
  };

  const handleConnectHandle = (nodeId: string) => {
    if (!connectingSource) {
      setConnectingSource(nodeId);
    } else {
      if (connectingSource !== nodeId) {
        const edgeId = `e_${connectingSource}_${nodeId}`;
        const exists = edges.some(
          (e) => e.source === connectingSource && e.target === nodeId,
        );
        if (!exists) {
          const updatedEdges = [
            ...edges,
            { id: edgeId, source: connectingSource, target: nodeId },
          ];
          setEdges(updatedEdges);
          onChangeGraph?.({ nodes, edges: updatedEdges, viewport: { x: 0, y: 0, zoom } });
        }
      }
      setConnectingSource(null);
    }
  };

  const handleDeleteEdge = (edgeId: string) => {
    const updatedEdges = edges.filter((e) => e.id !== edgeId);
    setEdges(updatedEdges);
    onChangeGraph?.({ nodes, edges: updatedEdges, viewport: { x: 0, y: 0, zoom } });
  };

  // Node Type Visual Badges
  const getNodeColor = (type: FlowNodeType) => {
    switch (type) {
      case "start":
        return "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400";
      case "question":
        return "border-sky-500/40 bg-sky-500/5 text-sky-600 dark:text-sky-400";
      case "condition":
        return "border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400";
      case "delay":
        return "border-purple-500/40 bg-purple-500/5 text-purple-600 dark:text-purple-400";
      case "api_call":
        return "border-pink-500/40 bg-pink-500/5 text-pink-600 dark:text-pink-400";
      case "end":
        return "border-rose-500/40 bg-rose-500/5 text-rose-600 dark:text-rose-400";
      default:
        return "border-border bg-surface text-foreground";
    }
  };

  const getNodeIcon = (type: FlowNodeType) => {
    switch (type) {
      case "start":
        return <Play className="size-3.5 text-emerald-500" />;
      case "question":
        return <HelpCircle className="size-3.5 text-sky-500" />;
      case "condition":
        return <GitBranch className="size-3.5 text-amber-500" />;
      case "delay":
        return <Clock className="size-3.5 text-purple-500" />;
      case "api_call":
        return <Globe className="size-3.5 text-pink-500" />;
      case "end":
        return <Flag className="size-3.5 text-rose-500" />;
      default:
        return <Bot className="size-3.5 text-wise-green" />;
    }
  };

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleMouseMoveCanvas}
      onMouseUp={handleMouseUpCanvas}
      onTouchMove={handleTouchMoveCanvas}
      onTouchEnd={handleTouchEndCanvas}
      onClick={() => onSelectNode(null)}
      className="relative flex-1 h-full w-full select-none overflow-hidden bg-[#fafafa] dark:bg-[#0e0f0d] cursor-default touch-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(120, 120, 120, 0.15) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Top Floating Action Bar */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-20 flex items-center gap-2 max-w-[calc(100vw-1.5rem)] overflow-x-auto scrollbar-none py-1">
        {/* Add Nodes Toolbar */}
        <div className="border-border bg-surface/90 backdrop-blur-md flex items-center gap-1 rounded-2xl border p-1 shadow-md dark:bg-[#151714]/90 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddNode("message");
            }}
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Bot className="size-3.5 text-wise-green" />
            <span>Pesan</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddNode("question");
            }}
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <HelpCircle className="size-3.5 text-sky-500" />
            <span>Tanya</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddNode("condition");
            }}
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <GitBranch className="size-3.5 text-amber-500" />
            <span>Kondisi</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddNode("delay");
            }}
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Clock className="size-3.5 text-purple-500" />
            <span>Jeda</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddNode("api_call");
            }}
            className="text-foreground-secondary hover:text-foreground hover:bg-muted flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            <Globe className="size-3.5 text-pink-500" />
            <span>API</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="border-border bg-surface/90 backdrop-blur-md flex items-center gap-1 rounded-2xl border p-1 shadow-md dark:bg-[#151714]/90 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.min(1.8, parseFloat((z + 0.1).toFixed(2))));
            }}
            className="text-foreground-muted hover:text-foreground hover:bg-muted rounded-xl p-1.5 transition-colors cursor-pointer"
            title="Perbesar"
          >
            <ZoomIn className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(1);
            }}
            className="text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg px-1.5 py-1 text-[11px] font-mono cursor-pointer transition-colors"
            title="Reset Zoom (100%)"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoom((z) => Math.max(0.4, parseFloat((z - 0.1).toFixed(2))));
            }}
            className="text-foreground-muted hover:text-foreground hover:bg-muted rounded-xl p-1.5 transition-colors cursor-pointer"
            title="Perkecil"
          >
            <ZoomOut className="size-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas for Edges (Connections) */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
      >
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
          </marker>
        </defs>
        {edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          // Compute center coordinates for curved bezier line
          const x1 = sourceNode.position.x + 200;
          const y1 = sourceNode.position.y + 40;
          const x2 = targetNode.position.x;
          const y2 = targetNode.position.y + 40;
          const dx = Math.abs(x2 - x1) * 0.5;

          const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

          return (
            <g key={edge.id} className="pointer-events-auto group">
              <path
                d={pathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                markerEnd="url(#arrowhead)"
                className="transition-all hover:stroke-destructive hover:stroke-[3.5px] cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEdge(edge.id);
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Render Nodes */}
      <div
        className="absolute inset-0"
        style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
      >
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const isConnecting = connectingSource === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDownNode(e, node)}
              onTouchStart={(e) => handleTouchStartNode(e, node)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node);
              }}
              className={cn(
                "absolute w-52 rounded-2xl border p-3.5 shadow-md transition-shadow cursor-move select-none bg-surface/95 backdrop-blur-sm",
                getNodeColor(node.type),
                isSelected && "ring-2 ring-wise-green shadow-xl border-wise-green",
                isConnecting && "ring-2 ring-amber-500 animate-pulse",
              )}
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
              }}
            >
              {/* Node Header */}
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-border/40">
                <div className="flex items-center gap-1.5">
                  {getNodeIcon(node.type)}
                  <span className="text-foreground text-xs font-bold truncate max-w-[120px]">
                    {node.data.label || node.id}
                  </span>
                </div>
                <span className="text-foreground-muted font-mono text-[9px] uppercase">
                  {node.type}
                </span>
              </div>

              {/* Node Summary Body */}
              <div className="pt-2 text-foreground-muted text-[11px] truncate">
                {node.type === "start" && "Pemicu awal percakapan"}
                {node.type === "message" && (node.data.message || "Teks pesan kosong")}
                {node.type === "question" && `Tanya: ${node.data.message || "Pertanyaan"}`}
                {node.type === "condition" &&
                  `Jika ${node.data.conditionVariable || "var"} ${node.data.conditionOperator || "=="} ${node.data.conditionValue || "val"}`}
                {node.type === "delay" && `Tunggu ${node.data.delaySeconds || 2} detik`}
                {node.type === "api_call" && `API: ${node.data.apiUrl || "url"}`}
                {node.type === "end" && "Mengakhiri sesi"}
              </div>

              {/* Source & Target Connect Handles */}
              {/* Target Handle (Left) */}
              {node.type !== "start" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectHandle(node.id);
                  }}
                  className="absolute -left-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full border-2 border-background bg-wise-green shadow-sm hover:scale-125 transition-transform cursor-pointer"
                  title="Hubungkan ke sini"
                />
              )}

              {/* Source Handle (Right) */}
              {node.type !== "end" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnectHandle(node.id);
                  }}
                  className={cn(
                    "absolute -right-2.5 top-1/2 -translate-y-1/2 size-5 rounded-full border-2 border-background shadow-sm hover:scale-125 transition-transform cursor-pointer",
                    isConnecting ? "bg-amber-500 animate-ping" : "bg-wise-green",
                  )}
                  title="Tarik koneksi dari sini"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
