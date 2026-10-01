"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { inboxApi } from "../api/inbox.api";
import {
  Conversation,
  InboxMessage,
  ChannelType,
  ConversationStatus,
  WebSocketEvent,
} from "../types/inbox.types";
import { getCookie } from "@/lib/storage/cookies";
import { env } from "@/lib/config/env";
import { toast } from "sonner";

export function useInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "ALL">("ALL");
  const [channelFilter, setChannelFilter] = useState<ChannelType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeConvIdRef = useRef<string | null>(null);

  // Keep ref synchronized with state to avoid stale closures in WS callbacks
  useEffect(() => {
    activeConvIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // 1. Fetch conversations list
  const fetchConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const res = await inboxApi.listConversations({
        channel_type: channelFilter !== "ALL" ? channelFilter : undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        search: searchQuery.trim() || undefined,
        limit: 50,
      });
      setConversations(res.data);
    } catch {
      toast.error("Gagal memuat daftar percakapan live chat");
    } finally {
      setIsLoadingConversations(false);
    }
  }, [channelFilter, statusFilter, searchQuery]);

  // Initial and reactive fetch on filter change
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // 2. Fetch messages for active conversation
  const fetchMessages = useCallback(async (convId: string) => {
    setIsLoadingMessages(true);
    try {
      const res = await inboxApi.listMessages(convId, 1, 100);
      // Backend returns newest first or oldest first. Sort by timestamp ascending for chat view
      const sorted = [...res.data].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      setMessages(sorted);

      // Decrement/reset unread count locally in list
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unread_count: 0 } : c)),
      );
    } catch {
      toast.error("Gagal memuat pesan percakapan");
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const selectConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      fetchMessages(id);
    },
    [fetchMessages],
  );

  // 3. Send reply message
  const sendReply = useCallback(
    async (text: string, mediaUrl?: string) => {
      if (!activeConversationId || (!text.trim() && !mediaUrl)) return;

      setIsSending(true);
      try {
        const newMsg = await inboxApi.sendReply(activeConversationId, {
          message_text: text.trim(),
          media_url: mediaUrl,
          message_type: mediaUrl ? "IMAGE" : "TEXT",
        });

        // Optimistically append sent message
        setMessages((prev) => [...prev, newMsg]);

        // Update last message in conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  last_message_text: text.trim(),
                  last_message_at: new Date().toISOString(),
                }
              : c,
          ),
        );
      } catch {
        toast.error("Gagal mengirim pesan balasan");
      } finally {
        setIsSending(false);
      }
    },
    [activeConversationId],
  );

  // 4. Update status (e.g. resolve conversation)
  const updateConversationStatus = useCallback(
    async (id: string, status: ConversationStatus) => {
      try {
        await inboxApi.updateStatus(id, status);
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c)),
        );
        toast.success(`Status percakapan diubah menjadi ${status}`);
      } catch {
        toast.error("Gagal mengubah status percakapan");
      }
    },
    [],
  );

  // 5. Assign agent to conversation
  const assignAgent = useCallback(
    async (id: string, agentId: string | null) => {
      try {
        await inboxApi.assignConversation(id, agentId);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, assigned_agent_id: agentId } : c,
          ),
        );
        toast.success("Petugas CS berhasil diperbarui");
      } catch {
        toast.error("Gagal menugaskan percakapan");
      }
    },
    [],
  );

  // 6. Realtime WebSocket Stream Manager (Zero Leaks, Heartbeat, Auto-Reconnect)
  useEffect(() => {
    let isSubscribed = true;

    const connectWS = () => {
      if (!isSubscribed) return;

      const token =
        getCookie("hide-jwt") || getCookie("wahide_session_token");
      if (!token) return;

      // Build WS URL from HTTP Base URL
      const baseApi = env.NEXT_PUBLIC_WHATSAPP_API_URL.replace(/\/+$/, "");
      const wsProtocol = baseApi.startsWith("https") ? "wss:" : "ws:";
      const hostPath = baseApi.replace(/^https?:\/\//, "");
      const wsUrl = `${wsProtocol}//${hostPath}/inbox/ws`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          // Setup 30s heartbeat ping
          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ event: "PING" }));
            }
          }, 30000);
        };

        ws.onmessage = (event) => {
          try {
            const parsed: WebSocketEvent = JSON.parse(event.data);

            if (parsed.event === "NEW_MESSAGE") {
              const msg = parsed.data as InboxMessage;

              // If message belongs to currently open conversation, append immediately
              if (activeConvIdRef.current && msg.conversation_id === activeConvIdRef.current) {
                setMessages((prev) => {
                  if (prev.some((m) => m.id === msg.id)) return prev;
                  return [...prev, msg];
                });
              }

              // Update conversation list preview and unread count
              setConversations((prev) => {
                const found = prev.some((c) => c.id === msg.conversation_id);
                if (found) {
                  return prev.map((c) =>
                    c.id === msg.conversation_id
                      ? {
                          ...c,
                          last_message_text: msg.message_body,
                          last_message_at: msg.timestamp,
                          unread_count:
                            c.id === activeConvIdRef.current
                              ? 0
                              : c.unread_count + (msg.direction === "INBOUND" ? 1 : 0),
                        }
                      : c,
                  );
                }
                // Refresh list if new conversation thread arrives
                fetchConversations();
                return prev;
              });
            } else if (parsed.event === "CONVERSATION_UPDATED") {
              const updatedConv = parsed.data as Conversation;
              setConversations((prev) =>
                prev.map((c) => (c.id === updatedConv.id ? updatedConv : c)),
              );
            }
          } catch {
            // Ignore non-json frames or pings
          }
        };

        ws.onclose = () => {
          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
          // Auto reconnect after 5s if still active
          if (isSubscribed) {
            reconnectTimeoutRef.current = setTimeout(connectWS, 5000);
          }
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        if (isSubscribed) {
          reconnectTimeoutRef.current = setTimeout(connectWS, 5000);
        }
      }
    };

    connectWS();

    return () => {
      isSubscribed = false;
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [fetchConversations]);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  return {
    conversations,
    activeConversation,
    activeConversationId,
    messages,
    isLoadingConversations,
    isLoadingMessages,
    isSending,
    statusFilter,
    setStatusFilter,
    channelFilter,
    setChannelFilter,
    searchQuery,
    setSearchQuery,
    selectConversation,
    sendReply,
    updateConversationStatus,
    assignAgent,
    refreshConversations: fetchConversations,
  };
}
