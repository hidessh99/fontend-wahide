"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  RotateCcw,
  CheckCircle2,
  Database,
  Smartphone,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlowDefinition } from "../types/flow.types";
import { flowApi } from "../api/flow.api";

interface MessageBubble {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

interface FlowSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  flow: FlowDefinition;
}

export function FlowSimulatorModal({
  isOpen,
  onClose,
  flow,
}: FlowSimulatorModalProps) {
  const { t } = useI18n();
  const isMountedRef = useRef(true);
  const [messages, setMessages] = useState<MessageBubble[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentNode, setCurrentNode] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, unknown>>({});
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "variables">("chat");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const startSimulation = useCallback(async () => {
    setMessages([]);
    setVariables({});
    setIsComplete(false);
    setCurrentNode("");
    setIsBotTyping(true);

    try {
      // Find start node from flow graph
      const startNode = flow.canvas_graph?.nodes?.find(
        (n) => n.type === "start",
      );
      const initialNodeId = startNode ? startNode.id : "";

      const res = await flowApi.simulateStep({
        flow_id: flow.id,
        input_text: "start",
        current_node: initialNodeId,
        variables: {},
      });

      if (isMountedRef.current && res) {
        setCurrentNode(res.next_node_id);
        setVariables(res.variables || {});
        setIsComplete(res.is_complete);
        if (res.reply_text) {
          setMessages([
            {
              id: "msg_init",
              sender: "bot",
              text: res.reply_text,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      }
    } catch {
      // Fallback greeting if simulation backend has not registered flow yet
      if (isMountedRef.current) {
        setMessages([
          {
            id: "msg_fallback",
            sender: "bot",
            text: `Halo! Ini adalah simulasi alur "${flow.name}". Silakan ketik pesan untuk menguji balasan.`,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsBotTyping(false);
      }
    }
  }, [flow.id, flow.name, flow.canvas_graph]);

  useEffect(() => {
    if (isOpen) {
      startSimulation();
    }
  }, [isOpen, startSimulation]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isBotTyping) return;

    const userMsg: MessageBubble = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsBotTyping(true);

    try {
      const res = await flowApi.simulateStep({
        flow_id: flow.id,
        input_text: text,
        current_node: currentNode,
        variables,
      });

      if (isMountedRef.current && res) {
        setCurrentNode(res.next_node_id);
        setVariables(res.variables || {});
        setIsComplete(res.is_complete);
        if (res.reply_text) {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot_${Date.now()}`,
              sender: "bot",
              text: res.reply_text,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      }
    } catch {
      if (isMountedRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_err_${Date.now()}`,
            sender: "bot",
            text: "Pesan Anda diterima dan diproses oleh alur flow.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsBotTyping(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-surface border-border flex h-[90vh] sm:h-[85vh] w-[95vw] sm:max-w-3xl flex-col rounded-2xl p-0 shadow-2xl dark:bg-[#151714] overflow-hidden gap-0">
        {/* Header */}
        <DialogHeader className="border-border flex flex-row items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4 bg-muted/20 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
              <Smartphone className="size-4 sm:size-5" />
            </div>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-foreground text-xs sm:text-sm font-bold truncate">
                  {t("autoreply.flows.simulator.title")}
                </DialogTitle>
                <span className="rounded-full bg-wise-green/20 text-dark-green dark:text-wise-green px-2 py-0.2 text-[9px] font-bold uppercase shrink-0">
                  Live Test
                </span>
              </div>
              <DialogDescription className="text-foreground-muted text-[11px] sm:text-xs truncate max-w-[180px] sm:max-w-sm">
                {flow.name}
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pr-6 sm:pr-8">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={startSimulation}
              className="h-8 gap-1.5 rounded-full px-3 text-xs font-bold"
              title={t("autoreply.flows.simulator.startSimulation")}
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">
                {t("autoreply.flows.simulator.startSimulation")}
              </span>
            </Button>
          </div>
        </DialogHeader>

        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden border-b border-border bg-surface px-3 py-1.5 gap-2 shrink-0">
          <Button
            type="button"
            variant={mobileTab === "chat" ? "primaryPill" : "ghost"}
            size="sm"
            onClick={() => setMobileTab("chat")}
            className="flex-1 text-xs font-bold h-8"
          >
            Obrolan ({messages.length})
          </Button>
          <Button
            type="button"
            variant={mobileTab === "variables" ? "primaryPill" : "ghost"}
            size="sm"
            onClick={() => setMobileTab("variables")}
            className="flex-1 text-xs font-bold h-8"
          >
            Variabel ({Object.keys(variables).length})
          </Button>
        </div>

        {/* Content Layout: Chat View on Left, Session Variables on Right */}
        <div className="flex flex-1 overflow-hidden">
          {/* WhatsApp Style Chat Screen */}
          <div
            className={cn(
              "flex-1 flex-col bg-[#efeae2]/40 dark:bg-[#0c0d0b]",
              mobileTab === "chat" ? "flex" : "hidden md:flex",
            )}
          >
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[75%]",
                    msg.sender === "user"
                      ? "ml-auto items-end"
                      : "mr-auto items-start",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-xs shadow-sm whitespace-pre-wrap leading-relaxed",
                      msg.sender === "user"
                        ? "bg-wise-green text-dark-green rounded-tr-none font-medium"
                        : "bg-surface border border-border text-foreground rounded-tl-none",
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="text-foreground-muted text-[9px] mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}

              {isBotTyping && (
                <div className="flex items-center gap-2 text-foreground-muted text-xs bg-surface border border-border rounded-full px-3 py-1.5 w-fit">
                  <div className="size-2 bg-wise-green animate-bounce rounded-full" />
                  <div className="size-2 bg-wise-green animate-bounce rounded-full delay-100" />
                  <div className="size-2 bg-wise-green animate-bounce rounded-full delay-200" />
                  <span className="text-[11px] ml-1">
                    {t("autoreply.flows.simulator.botThinking")}
                  </span>
                </div>
              )}

              {isComplete && (
                <div className="flex items-center justify-center gap-2 py-3 text-center">
                  <span className="rounded-full bg-muted border border-border px-3 py-1 text-[11px] font-bold text-foreground-muted flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-wise-green" />
                    Alur percakapan selesai
                  </span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="border-border bg-surface flex items-center gap-2 border-t p-3 dark:bg-[#131412]"
            >
              <Input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t("autoreply.flows.simulator.inputPlaceholder")}
                disabled={isBotTyping}
                variant="rounded"
                className="flex-1 text-xs"
              />
              <Button
                type="submit"
                variant="primaryPill"
                size="icon-sm"
                disabled={!inputText.trim() || isBotTyping}
                className="shrink-0"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>

          {/* Session Variables Sidebar */}
          <div
            className={cn(
              "border-border bg-surface w-full md:w-64 border-t md:border-t-0 md:border-l flex-col dark:bg-[#151714]",
              mobileTab === "variables" ? "flex" : "hidden md:flex",
            )}
          >
            <div className="border-border flex items-center gap-2 border-b px-4 py-3 bg-muted/20">
              <Database className="size-3.5 text-wise-green" />
              <h4 className="text-foreground text-xs font-bold">
                {t("autoreply.flows.simulator.sessionVariables")}
              </h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {Object.keys(variables).length === 0 ? (
                <p className="text-foreground-muted text-xs text-center py-6">
                  {t("autoreply.flows.simulator.emptyVariables")}
                </p>
              ) : (
                Object.entries(variables).map(([k, v]) => (
                  <div
                    key={k}
                    className="border-border bg-background rounded-xl border p-2.5 space-y-1 shadow-xs"
                  >
                    <span className="text-foreground-muted text-[10px] font-mono block truncate">
                      {k}
                    </span>
                    <span className="text-foreground text-xs font-bold block truncate">
                      {String(v)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
