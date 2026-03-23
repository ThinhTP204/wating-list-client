"use client";

import { motion } from "motion/react";
import { Clock, MapPin, MessageCircle, CheckCircle2, AlertCircle, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShiftSwapPost, STATUS_META, SHIFT_TYPE_META } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  post: ShiftSwapPost;
  onContact: (post: ShiftSwapPost) => void;
  onAccept: (post: ShiftSwapPost) => void;
  onCancel?: (post: ShiftSwapPost) => void;
}

function getHoursLeft(expiresAt: string): number {
  return Math.max(0, (new Date(expiresAt).getTime() - Date.now()) / 3600000);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
}

export default function ShiftSwapCard({ post, onContact, onAccept, onCancel }: Props) {
  const statusMeta = STATUS_META[post.status];
  const shiftMeta = SHIFT_TYPE_META[post.myShift.type];
  const hoursLeft = getHoursLeft(post.expiresAt);
  const isExpiringSoon = hoursLeft > 0 && hoursLeft < 2;
  const isExpired = post.status === "expired" || hoursLeft === 0;
  const initial = post.authorName.split(" ").pop()?.charAt(0) ?? "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={post.status === "open" ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative rounded-xl border transition-all duration-200 h-full",
        post.status === "open" && "hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/10",
        post.status === "matched" && "border-blue-200 dark:border-blue-900/50",
        post.status === "expired" && "opacity-60",
        post.isOwn && "ring-2 ring-purple-500/30",
        "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
      )}
    >
      {/* Gradient top accent */}
      {post.status === "open" && (
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}

      <Card className="border-0 shadow-none bg-transparent gap-0 py-0 h-full">
        <CardContent className="px-4 pt-4 pb-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] flex items-center justify-center text-white text-sm font-bold">
                  {initial}
                </div>
                <span className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-neutral-950",
                  post.isOnline ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-600"
                )} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
                    {post.authorName}
                  </span>
                  {post.isOwn && (
                    <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-transparent text-[10px] px-1.5 py-0">
                      Của tôi
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">{post.authorPosition}</span>
              </div>
            </div>
            <Badge className={cn("shrink-0 text-xs", statusMeta.cls)}>
              {statusMeta.label}
            </Badge>
          </div>

          {/* Shift info block */}
          <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-lg p-3 space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#402093] to-[#8f58e4] flex items-center justify-center shrink-0">
                <ArrowLeftRight className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0">Nhường:</span>
                <span className={cn("text-xs font-medium shrink-0", shiftMeta.color)}>{shiftMeta.label}</span>
                <span className="text-xs text-neutral-700 dark:text-neutral-300 font-mono shrink-0">{post.myShift.timeLabel}</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 truncate">{formatDate(post.myShift.date)}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0">Muốn:</span>
                <span className="text-xs text-neutral-700 dark:text-neutral-200 line-clamp-1">{post.wantShift}</span>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[120px]">{post.branch}</span>
            </div>
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isExpiringSoon ? "text-red-500 dark:text-red-400 font-medium" : "text-neutral-400 dark:text-neutral-500",
              isExpired && "text-neutral-300 dark:text-neutral-600"
            )}>
              {isExpiringSoon ? <AlertCircle className="w-3 h-3 shrink-0" /> : <Clock className="w-3 h-3 shrink-0" />}
              <span>
                {isExpired
                  ? "Đã hết hạn"
                  : isExpiringSoon
                  ? `Còn ${Math.floor(hoursLeft)}h ${Math.round((hoursLeft % 1) * 60)}p`
                  : `Còn ${Math.floor(hoursLeft)}h`}
              </span>
            </div>
          </div>

          {post.note && (
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 italic line-clamp-2">
              "{post.note}"
            </p>
          )}
        </CardContent>

        {/* Footer actions */}
        {post.status === "open" && (
          <CardFooter className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800/60 gap-2 mt-auto">
            {post.isOwn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel?.(post)}
                className="flex-1 text-xs border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300"
              >
                Hủy đăng
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onContact(post)}
                  className="flex-1 text-xs gap-1.5 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Nhắn tin
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAccept(post)}
                  className="flex-1 text-xs gap-1.5 bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] border-0 text-white hover:shadow-md hover:shadow-purple-500/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Nhận ca này
                </Button>
              </>
            )}
          </CardFooter>
        )}

        {post.status === "matched" && (
          <CardFooter className="px-4 py-3 border-t border-blue-100 dark:border-blue-900/30 mt-auto">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              ✓ Ca đã được khớp thành công
            </span>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
