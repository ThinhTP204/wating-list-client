"use client";

import { motion } from "motion/react";
import { Clock, MapPin, MessageCircle, CheckCircle2, AlertCircle, ArrowLeftRight, Flame } from "lucide-react";
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

function timeAgo(isoDate: string): string {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 60000;
  if (diff < 60) return `${Math.floor(diff)}p trước`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h trước`;
  return `${Math.floor(diff / 1440)}d trước`;
}

export default function ShiftSwapCard({ post, onContact, onAccept, onCancel }: Props) {
  const statusMeta = STATUS_META[post.status];
  const shiftMeta  = SHIFT_TYPE_META[post.myShift.type];
  const hoursLeft  = getHoursLeft(post.expiresAt);
  const isExpiringSoon = hoursLeft > 0 && hoursLeft < 6;
  const isExpired      = post.status === "expired" || hoursLeft === 0;
  const initial        = post.authorName.split(" ").pop()?.charAt(0) ?? "?";

  // Expiry progress bar (out of 72h)
  const expiryPct      = Math.min(100, (hoursLeft / 72) * 100);
  const expiryBarColor = hoursLeft < 6 ? "bg-red-500" : hoursLeft < 24 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={post.status === "open" ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative rounded-xl border transition-all duration-200 overflow-hidden",
        post.status === "open" && "hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/10",
        post.status === "matched" && "border-blue-200 dark:border-blue-900/50",
        post.status === "expired" && "opacity-60",
        post.isOwn && "ring-2 ring-purple-500/30",
        "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800"
      )}
    >
      {post.status === "open" && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      )}

      <Card className="border-0 shadow-none bg-transparent gap-0 py-0">
        <CardContent className="px-4 pt-4 pb-3 space-y-3">

          {/* Author row */}
          <div className="flex items-start justify-between gap-3">
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
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">{post.authorName}</span>
                  {post.isOwn && (
                    <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-transparent text-[10px] px-1.5 py-0">
                      Của tôi
                    </Badge>
                  )}
                  {isExpiringSoon && !isExpired && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-500 dark:text-red-400">
                      <Flame className="w-2.5 h-2.5" /> Gấp!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                  <span>{post.authorDepartment}</span>
                  <span>·</span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>
            <Badge className={cn("shrink-0 text-xs", statusMeta.cls)}>{statusMeta.label}</Badge>
          </div>

          {/* Swap diagram */}
          <div className="grid grid-cols-[1fr_28px_1fr] items-stretch gap-1.5">
            {/* Giving */}
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-2.5 border border-purple-100/80 dark:border-purple-900/20">
              <p className="text-[9px] font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-1.5">Nhường</p>
              <p className={cn("text-xs font-bold leading-tight", shiftMeta.color)}>{shiftMeta.label}</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-mono mt-0.5">{post.myShift.timeLabel}</p>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">{formatDate(post.myShift.date)}</p>
            </div>

            {/* Exchange icon */}
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <ArrowLeftRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
              </div>
            </div>

            {/* Wanting */}
            <div className="bg-emerald-50/60 dark:bg-emerald-900/10 rounded-lg p-2.5 border border-emerald-100/80 dark:border-emerald-900/20">
              <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">Muốn</p>
              <p className="text-xs text-neutral-700 dark:text-neutral-200 line-clamp-3 leading-snug">{post.wantShift}</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[110px]">{post.branch}</span>
            </span>
            {!isExpired && (
              <span className={cn(
                "flex items-center gap-1",
                isExpiringSoon && "text-red-500 dark:text-red-400 font-medium"
              )}>
                {isExpiringSoon ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                Còn {Math.floor(hoursLeft)}h
              </span>
            )}
          </div>

          {post.note && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 italic bg-neutral-50 dark:bg-neutral-900/40 rounded-md px-2.5 py-1.5 line-clamp-2">
              &ldquo;{post.note}&rdquo;
            </p>
          )}
        </CardContent>

        {/* Expiry progress bar */}
        {post.status === "open" && !isExpired && (
          <div className="px-4 pb-2">
            <div className="h-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full", expiryBarColor)}
                initial={{ width: 0 }}
                animate={{ width: `${expiryPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {post.status === "open" && (
          <CardFooter className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800/60 gap-2">
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
                  className="flex-1 text-xs gap-1.5 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 focus-visible:ring-[#8f58e4]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Nhắn tin
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAccept(post)}
                  className="flex-1 text-xs gap-1.5 bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] border-0 text-white hover:shadow-md hover:shadow-purple-500/20 focus-visible:ring-[#8f58e4]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Nhận ca này
                </Button>
              </>
            )}
          </CardFooter>
        )}

        {post.status === "matched" && (
          <CardFooter className="px-4 py-3 border-t border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ca đã được khớp thành công
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
