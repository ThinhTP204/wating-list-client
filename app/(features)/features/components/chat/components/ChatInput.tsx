"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  initialValue?: string;
  disabled?: boolean;
}

export default function ChatInput({ onSend, initialValue = "", disabled = false }: ChatInputProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      inputRef.current?.focus();
    }
  }, [initialValue]);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="sticky bottom-0 border-t border-slate-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          disabled={disabled}
          className={cn(
            "flex-1 text-sm bg-slate-50 dark:bg-neutral-800 border-slate-200 dark:border-neutral-700",
            "focus-visible:ring-[#4C88C6] focus-visible:border-[#4C88C6]",
            "placeholder:text-slate-400 dark:placeholder:text-neutral-500"
          )}
        />
        <Button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          size="sm"
          className={cn(
            "shrink-0 gap-1.5 px-4",
            "bg-gradient-to-r from-[#102854] via-[#1D4D8F] to-[#4C88C6]",
            "border-0 text-white hover:shadow-md hover:shadow-[#4C88C6]/25",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Gửi</span>
        </Button>
      </div>
    </div>
  );
}
