"use client";

import React from "react";
import { useInbox } from "../hooks/useInbox";
import { ConversationList } from "../components/ConversationList";
import { ChatWindow } from "../components/ChatWindow";

export function InboxView() {
  const {
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
  } = useInbox();

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      {/* Sidebar List (w-80 or w-96) */}
      <div className="w-80 sm:w-96 shrink-0 h-full">
        <ConversationList
          conversations={conversations}
          activeId={activeConversationId}
          onSelect={selectConversation}
          isLoading={isLoadingConversations}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 h-full min-w-0">
        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          isSending={isSending}
          onSendReply={sendReply}
          onUpdateStatus={updateConversationStatus}
        />
      </div>
    </div>
  );
}
