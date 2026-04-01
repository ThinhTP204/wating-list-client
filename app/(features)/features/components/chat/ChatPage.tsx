"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useSelector } from "react-redux";
import { MessageSquare, RefreshCw, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { selectUser } from "@/lib/redux/slices/authSlice";
import { useChatMessages, useSendMessage } from "@/features/chat/hooks/useChat";
import type { ChatMessage } from "@/features/chat/types";
import ChatMessageBubble from "@/app/(features)/features/components/chat/components/ChatMessageBubble";
import ChatInput from "@/app/(features)/features/components/chat/components/ChatInput";

// ── Date separator helpers ────────────────────────────────────────────────

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

// ── Skeleton rows ─────────────────────────────────────────────────────────

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

// ── Main component ─────────────────────────────────────────────────────────

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector(selectUser);

  const [prefillValue, setPrefillValue] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading, isError, refetch } = useChatMessages({ enabled: true });
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  // Handle prefill param on mount
  useEffect(() => {
    setMounted(true);
    const prefill = searchParams.get("prefill");
    if (prefill) {
      setPrefillValue(decodeURIComponent(prefill));
      // Clear prefill from URL, preserving other params
      const params = new URLSearchParams(searchParams.toString());
      params.delete("prefill");
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when messages change (only if near bottom)
  const scrollToBottom = useCallback((force = false) => {
    const el = listRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (force || isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (messages) scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initial scroll to bottom on first load
  useEffect(() => {
    if (!isLoading && messages) scrollToBottom(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  function handleSend(text: string) {
    const senderName = user?.name ?? "Người dùng";
    const senderRole: "admin" | "user" =
      user?.role === "admin" ? "admin" : "user";

    sendMessage(
      { content: text, senderName, senderRole },
      {
        onSuccess: () => {
          setPrefillValue("");
          setTimeout(() => scrollToBottom(true), 50);
        },
      }
    );
  }

  // Build message list with date separators
  function renderMessages(msgs: ChatMessage[]) {
    const items: React.ReactNode[] = [];
    let lastDateKey = "";

    msgs.forEach((msg) => {
      const dateKey = getDateKey(msg.createdAt);
      if (dateKey !== lastDateKey) {
        lastDateKey = dateKey;
        items.push(
          <div key={`sep-${dateKey}`} className="flex items-center gap-3 py-2 px-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-neutral-800" />
            <span className="text-xs font-semibold text-slate-400 dark:text-neutral-500 shrink-0">
              {getDateLabel(msg.createdAt)}
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-neutral-800" />
          </div>
        );
      }
      items.push(<ChatMessageBubble key={msg.id} message={msg} />);
    });

    return items;
  }

  const messageCount = messages?.length ?? 0;

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-57px)] bg-gradient-to-br from-slate-50 via-blue-50/20 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-800 px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D4D8F] to-[#4C88C6] flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 dark:text-white leading-tight">
              Nhắn tin nhóm
            </h1>
            <p className="text-xs text-slate-400 dark:text-neutral-500">
              {isLoading ? "Đang tải..." : `${messageCount} tin nhắn`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Message list ── */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.300)_transparent] dark:[scrollbar-color:theme(colors.neutral.700)_transparent]"
      >
        {isLoading ? (
          <MessageSkeletons />
        ) : isError ? (
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
              onClick={() => refetch()}
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
              Hãy là người đầu tiên bắt đầu cuộc trò chuyện!
            </p>
          </div>
        ) : (
          mounted && (
            <div className="px-4 py-4 space-y-4">
              <AnimatePresence initial={false}>
                {renderMessages(messages)}
              </AnimatePresence>
            </div>
          )
        )}
      </div>

      {/* ── Input ── */}
      <ChatInput
        onSend={handleSend}
        initialValue={prefillValue}
        disabled={isSending}
      />
    </div>
  );
}
