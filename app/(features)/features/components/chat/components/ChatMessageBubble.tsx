"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/features/chat/types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const { isOwn, senderName, senderRole, senderInitial, content, createdAt } = message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-2.5 group", isOwn ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black text-white",
          isOwn
            ? "bg-gradient-to-br from-[#1D4D8F] to-[#4C88C6]"
            : "bg-gradient-to-br from-slate-500 to-slate-700 dark:from-neutral-600 dark:to-neutral-800"
        )}
      >
        {senderInitial.toUpperCase()}
      </div>

      {/* Bubble */}
      <div className={cn("max-w-[75%] flex flex-col gap-1", isOwn ? "items-end" : "items-start")}>
        {/* Sender info */}
        <div className={cn("flex items-center gap-1.5", isOwn ? "flex-row-reverse" : "flex-row")}>
          <span className="text-xs font-semibold text-slate-700 dark:text-neutral-200">
            {senderName}
          </span>
          <Badge
            variant={senderRole === "admin" ? "default" : "secondary"}
            className={cn(
              "text-xs px-1.5 py-0 leading-4 border",
              senderRole === "admin"
                ? "bg-[#BCE8F5]/60 dark:bg-blue-900/40 text-[#1D4D8F] dark:text-blue-300 border-[#4C88C6]/30 dark:border-blue-800/40"
                : "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-700"
            )}
          >
            {senderRole === "admin" ? "Quản lý" : "Nhân viên"}
          </Badge>
        </div>

        {/* Content */}
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
            isOwn
              ? "bg-gradient-to-br from-[#1D4D8F] to-[#4C88C6] text-white rounded-tr-sm"
              : "bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-slate-200/80 dark:border-neutral-700/80 text-slate-800 dark:text-neutral-100 rounded-tl-sm"
          )}
        >
          {content}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-slate-400 dark:text-neutral-500 px-1">
          {formatTime(createdAt)}
        </span>
      </div>
    </motion.div>
  );
}
