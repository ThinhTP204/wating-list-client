"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useSelector } from "react-redux";
import { AlertCircle, MessageSquare, RefreshCw, Search, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { selectUser } from "@/lib/redux/slices/authSlice";
import {
  useChatConversations,
  useChatMessages,
  useChatUsers,
  useOpenDirectConversation,
  useSendMessage,
} from "@/features/chat/hooks/useChat";
import { DEFAULT_GROUP_ID } from "@/features/chat/services/chatApi";
import type { ChatConversation, ChatMessage, ChatParticipant } from "@/features/chat/types";
import ChatMessageBubble from "@/app/(features)/features/components/chat/components/ChatMessageBubble";
import ChatInput from "@/app/(features)/features/components/chat/components/ChatInput";

function getDateLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Hôm nay";
  if (isSameDay(date, yesterday)) return "Hôm qua";
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getDateKey(iso: string): string {
  return new Date(iso).toDateString();
}

function MessageSkeletons() {
  return (
    <div className="space-y-5 px-4 pt-4">
      {[false, true, false, true, false].map((isOwn, i) => (
        <div key={i} className={cn("flex gap-2.5", isOwn ? "flex-row-reverse" : "flex-row")}>
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className={cn("flex flex-col gap-1.5", isOwn ? "items-end" : "items-start")}>
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className={cn("h-10 rounded-2xl", isOwn ? "w-48" : "w-64")} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ConversationItem({
  conversation,
  active,
  onClick,
  currentUserId,
}: {
  conversation: ChatConversation;
  active: boolean;
  onClick: () => void;
  currentUserId: string;
}) {
  const directPartner =
    conversation.type === "direct"
      ? conversation.participants.find((participant) => participant.id !== currentUserId)
      : null;

  const title = directPartner?.name ?? conversation.title;
  const initial = directPartner?.initial ?? "N";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-colors",
        active
          ? "bg-brand-500/10 border-brand-500/40 dark:bg-brand-500/20"
          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0",
          conversation.type === "group"
            ? "bg-linear-to-br from-brand-700 to-brand-500"
            : "bg-linear-to-br from-slate-500 to-slate-700"
        )}
      >
        {conversation.type === "group" ? <Users className="w-4 h-4" /> : initial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{title}</p>
        <p className="text-xs text-slate-400 dark:text-neutral-500 truncate">
          {conversation.type === "group" ? "Nhóm chung toàn hệ thống" : "Cuộc trò chuyện riêng"}
        </p>
      </div>
    </button>
  );
}

function UserConversationItem({
  user,
  active,
  onClick,
}: {
  user: ChatParticipant;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-colors",
        active
          ? "bg-brand-500/10 border-brand-500/40 dark:bg-brand-500/20"
          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800"
      )}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 bg-linear-to-br from-slate-500 to-slate-700">
        {user.initial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.name}</p>
        <p className="text-xs text-slate-400 dark:text-neutral-500 truncate">Cuộc trò chuyện riêng</p>
      </div>
    </button>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector(selectUser);

  const currentUserId = user?.id ?? "user-01";
  const currentUserName = user?.name ?? "Người dùng";
  const currentUserRole = user?.role === "admin" ? "admin" : "user";

  const [prefillValue, setPrefillValue] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedConversationId, setSelectedConversationId] = useState<string>(DEFAULT_GROUP_ID);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    data: conversations,
    isLoading: conversationsLoading,
    isError: conversationsError,
    refetch: refetchConversations,
  } = useChatConversations({ currentUserId, enabled: true });

  const {
    data: directoryUsers,
    isLoading: directoryLoading,
  } = useChatUsers({ currentUserId, enabled: true });

  const resolvedConversationId = useMemo(() => {
    if (!conversations || conversations.length === 0) {
      return selectedConversationId;
    }

    return conversations.some((item) => item.id === selectedConversationId)
      ? selectedConversationId
      : conversations[0].id;
  }, [conversations, selectedConversationId]);

  const {
    data: messages,
    isLoading: messagesLoading,
    isError: messagesError,
    refetch: refetchMessages,
  } = useChatMessages({
    conversationId: resolvedConversationId,
    currentUserId,
    enabled: !!resolvedConversationId,
  });

  const { mutate: sendMessage, isPending: isSending } = useSendMessage(currentUserId);
  const { mutateAsync: openDirect } = useOpenDirectConversation();

  const selectedConversation = useMemo(
    () => conversations?.find((item) => item.id === resolvedConversationId) ?? null,
    [conversations, resolvedConversationId]
  );

  const directConversationByUserId = useMemo(() => {
    const mapping = new Map<string, ChatConversation>();

    (conversations ?? [])
      .filter((item) => item.type === "direct")
      .forEach((conversation) => {
        const partner = conversation.participants.find((participant) => participant.id !== currentUserId);
        if (partner) {
          mapping.set(partner.id, conversation);
        }
      });

    return mapping;
  }, [conversations, currentUserId]);

  const groupConversation = useMemo(() => {
    return (
      (conversations ?? []).find((conversation) => conversation.id === DEFAULT_GROUP_ID) ??
      (conversations ?? []).find((conversation) => conversation.type === "group") ??
      null
    );
  }, [conversations]);

  const filteredDirectoryUsers = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    if (!normalized) {
      return directoryUsers ?? [];
    }

    return (directoryUsers ?? []).filter((participant) =>
      participant.name.toLowerCase().includes(normalized)
    );
  }, [directoryUsers, searchValue]);

  const scrollToBottom = useCallback((force = false) => {
    const el = listRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (force || isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!messagesLoading && messages) {
      scrollToBottom(true);
    }
  }, [messagesLoading, messages, scrollToBottom]);

  useEffect(() => {
    const handlePrefillAndTarget = async () => {
      const prefill = searchParams.get("prefill");
      const targetUserId = searchParams.get("targetUserId");

      if (prefill) {
        setPrefillValue(decodeURIComponent(prefill));
      }

      if (targetUserId) {
        try {
          const directConversation = await openDirect({
            currentUserId,
            currentUserName,
            currentUserRole,
            targetUserId,
          });
          setSelectedConversationId(directConversation.id);
        } catch {
          setSelectedConversationId(DEFAULT_GROUP_ID);
        }
      }

      if (prefill || targetUserId) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("prefill");
        params.delete("targetUserId");
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.replace(newUrl);
      }
    };

    void handlePrefillAndTarget();
  }, [currentUserId, currentUserName, currentUserRole, openDirect, router, searchParams]);

  function renderMessages(items: ChatMessage[]) {
    const nodes: React.ReactNode[] = [];
    let lastDateKey = "";

    items.forEach((message) => {
      const dateKey = getDateKey(message.createdAt);
      if (dateKey !== lastDateKey) {
        lastDateKey = dateKey;
        nodes.push(
          <div key={`sep-${dateKey}`} className="flex items-center gap-3 py-2 px-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-neutral-800" />
            <span className="text-xs font-semibold text-slate-400 dark:text-neutral-500 shrink-0">
              {getDateLabel(message.createdAt)}
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-neutral-800" />
          </div>
        );
      }
      nodes.push(<ChatMessageBubble key={message.id} message={message} />);
    });

    return nodes;
  }

  function handleSend(text: string) {
    if (!selectedConversationId) {
      return;
    }

    sendMessage(
      {
        conversationId: resolvedConversationId,
        senderId: currentUserId,
        senderName: currentUserName,
        senderRole: currentUserRole,
        content: text,
      },
      {
        onSuccess: () => {
          setPrefillValue("");
          setTimeout(() => scrollToBottom(true), 50);
        },
      }
    );
  }

  async function handleOpenDirectConversation(target: ChatParticipant) {
    const existingConversation = directConversationByUserId.get(target.id);
    if (existingConversation) {
      setSelectedConversationId(existingConversation.id);
      return;
    }

    const conversation = await openDirect({
      currentUserId,
      currentUserName,
      currentUserRole,
      targetUserId: target.id,
    });

    setSelectedConversationId(conversation.id);
  }

  const messageCount = messages?.length ?? 0;
  const headerTitle = selectedConversation?.title ?? "Nhắn tin";

  return (
    <div className="flex-1 h-[calc(100dvh-57px)] bg-linear-to-br from-slate-50 via-blue-50/20 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-3">
      <div className="h-full grid grid-cols-1 md:grid-cols-[280px_1fr] gap-3">
        <div className="bg-white/90 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 rounded-2xl p-3 flex flex-col overflow-hidden">
          <div className="mb-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Cuộc trò chuyện</h2>
            <p className="text-xs text-slate-400 dark:text-neutral-500">Nhóm chung và toàn bộ nhân viên</p>
          </div>

          <div className="mb-3 relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Tìm nhân viên cần nhắn..."
              className="h-8 pl-8 text-xs"
            />
          </div>

          <div className="space-y-2 overflow-y-auto [scrollbar-width:thin]">
            {conversationsLoading ? (
              <>
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </>
            ) : conversationsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50/70 dark:bg-red-900/10 p-3">
                <p className="text-xs text-red-500 mb-2">Không tải được danh sách hội thoại.</p>
                <Button size="sm" variant="outline" onClick={() => refetchConversations()}>
                  Tải lại
                </Button>
              </div>
            ) : (
              <>
                {groupConversation && (
                  <ConversationItem
                    conversation={groupConversation}
                    active={groupConversation.id === resolvedConversationId}
                    onClick={() => setSelectedConversationId(groupConversation.id)}
                    currentUserId={currentUserId}
                  />
                )}

                {directoryLoading ? (
                  <Skeleton className="h-14 w-full rounded-xl" />
                ) : filteredDirectoryUsers.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-neutral-500 px-1 py-2">
                    Không tìm thấy nhân viên phù hợp.
                  </p>
                ) : (
                  filteredDirectoryUsers.map((target) => {
                    const directConversation = directConversationByUserId.get(target.id);
                    return (
                      <UserConversationItem
                        key={target.id}
                        user={target}
                        active={directConversation?.id === resolvedConversationId}
                        onClick={() => void handleOpenDirectConversation(target)}
                      />
                    );
                  })
                )}
              </>
            )}
          </div>
        </div>

        <div className="bg-white/90 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 z-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-800 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-brand-700 to-brand-500 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-800 dark:text-white leading-tight">
                  {headerTitle}
                </h1>
                <p className="text-xs text-slate-400 dark:text-neutral-500">
                  {messagesLoading ? "Đang tải..." : `${messageCount} tin nhắn`}
                </p>
              </div>
            </div>
          </motion.div>

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-slate-300)_transparent] dark:[scrollbar-color:var(--color-neutral-700)_transparent]"
          >
            {messagesLoading ? (
              <MessageSkeletons />
            ) : messagesError ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-sm text-slate-500 dark:text-neutral-400 text-center">
                  Không thể tải tin nhắn. Vui lòng thử lại.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchMessages()}
                  className="gap-1.5 text-sm border-slate-200 dark:border-neutral-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Thử lại
                </Button>
              </div>
            ) : !messages || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-slate-300 dark:text-neutral-600" />
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-neutral-400">
                  Chưa có tin nhắn nào
                </p>
                <p className="text-xs text-slate-400 dark:text-neutral-500 text-center">
                  Hãy bắt đầu cuộc trò chuyện trong nhóm hoặc nhắn riêng.
                </p>
              </div>
            ) : (
              <div className="px-4 py-4 space-y-4">
                <AnimatePresence initial={false}>{renderMessages(messages)}</AnimatePresence>
              </div>
            )}
          </div>

          <ChatInput onSend={handleSend} initialValue={prefillValue} disabled={isSending} />
        </div>
      </div>
    </div>
  );
}
