"use client";

import { motion } from "motion/react";
import {
  Clock,
  MapPin,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeftRight,
  Zap,
  Flame,
} from "lucide-react";
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
  return new Date(date).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function timeAgo(isoDate: string): string {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 60000;
  if (diff < 60) return `${Math.floor(diff)}p trước`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h trước`;
  return `${Math.floor(diff / 1440)}d trước`;
}

function KarmaChip({ score }: { score: number }) {
  const color =
    score >= 85
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800"
      : score >= 65
      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
      : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800";

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border", color)}>
      <Zap className="w-3 h-3" />
      {score}
    </span>
  );
}

function MatchBadge({ score }: { score: number }) {
  const isHigh = score >= 80;
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg border",
        isHigh
          ? "bg-[#102854]/8 dark:bg-blue-900/30 text-[#1D4D8F] dark:text-blue-300 border-[#4C88C6]/30 dark:border-blue-700"
          : "bg-slate-50 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-700"
      )}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          isHigh ? "bg-[#4C88C6]" : "bg-slate-300 dark:bg-neutral-500"
        )}
      />
      {score}% phù hợp
    </div>
  );
}

export default function ShiftSwapCard({ post, onContact, onAccept, onCancel }: Props) {
  const statusMeta     = STATUS_META[post.status];
  const shiftMeta      = SHIFT_TYPE_META[post.myShift.type];
  const hoursLeft      = getHoursLeft(post.expiresAt);
  const isExpiringSoon = hoursLeft > 0 && hoursLeft < 6;
  const isExpired      = post.status === "expired" || hoursLeft === 0;
  const initial        = post.authorName.split(" ").pop()?.charAt(0) ?? "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={post.status === "open" ? { y: -2, scale: 1.005 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative rounded-2xl border transition-all duration-200 overflow-hidden",
        "bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm",
        post.status === "open"
          ? "border-slate-200/80 dark:border-neutral-700/80 hover:border-[#4C88C6]/50 hover:shadow-lg hover:shadow-[#4C88C6]/10"
          : "border-slate-200/60 dark:border-neutral-700/60",
        post.status === "matched" && "border-emerald-200 dark:border-emerald-800/50",
        post.status === "expired" && "opacity-55",
        post.isOwn && "ring-2 ring-[#4C88C6]/25 dark:ring-blue-500/20"
      )}
    >
      {/* Left accent bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-opacity duration-200",
          post.status === "open" && "bg-gradient-to-b from-[#102854] via-[#1D4D8F] to-[#4C88C6] opacity-0 group-hover:opacity-100",
          post.status === "matched" && "bg-gradient-to-b from-emerald-400 to-teal-500 opacity-100"
        )}
      />

      <Card className="border-0 shadow-none bg-transparent gap-0 py-0">
        <CardContent className="px-4 pt-4 pb-3 space-y-3">

          {/* Author row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] flex items-center justify-center text-white text-base font-bold shadow-sm shadow-blue-900/20">
                  {initial}
                </div>
                <span className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900",
                  post.isOnline ? "bg-emerald-400" : "bg-slate-300 dark:bg-neutral-600"
                )} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-base font-semibold text-slate-800 dark:text-white">{post.authorName}</span>
                  <KarmaChip score={post.karma} />
                  {post.isOwn && (
                    <Badge className="bg-[#BCE8F5]/60 dark:bg-blue-900/30 text-[#1D4D8F] dark:text-blue-300 border-transparent text-xs px-1.5 py-0">
                      Của tôi
                    </Badge>
                  )}
                  {isExpiringSoon && !isExpired && (
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-red-500">
                      <Flame className="w-3 h-3" /> Gấp!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-neutral-500 mt-0.5">
                  <span>{post.authorDepartment}</span>
                  <span>·</span>
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge className={cn("text-xs border", statusMeta.cls)}>{statusMeta.label}</Badge>
              {post.matchScore !== undefined && post.status === "open" && (
                <MatchBadge score={post.matchScore} />
              )}
            </div>
          </div>

          {/* Swap diagram */}
          <div className="grid grid-cols-[1fr_32px_1fr] items-stretch gap-2">
            <div className={cn("rounded-xl p-3 border", shiftMeta.bg)}>
              <p className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Nhường</p>
              <p className={cn("text-sm font-bold leading-tight", shiftMeta.color)}>{shiftMeta.label}</p>
              <p className="text-sm text-slate-600 dark:text-neutral-300 font-mono mt-0.5">{post.myShift.timeLabel}</p>
              <p className="text-xs text-slate-400 dark:text-neutral-500 mt-0.5">{formatDate(post.myShift.date)}</p>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
              </div>
            </div>

            <div className="rounded-xl p-3 border bg-slate-50 dark:bg-neutral-800/60 border-slate-200/80 dark:border-neutral-700">
              <p className="text-xs font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest mb-1.5">Muốn</p>
              <p className="text-sm text-slate-700 dark:text-neutral-200 line-clamp-3 leading-snug">{post.wantShift}</p>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-neutral-500 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[140px]">{post.branch}</span>
            </span>
            {!isExpired && (
              <span className={cn(
                "flex items-center gap-1",
                isExpiringSoon && "text-red-500 font-medium"
              )}>
                {isExpiringSoon ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                Còn {Math.floor(hoursLeft)}h
              </span>
            )}
          </div>

          {post.note && (
            <p className="text-sm text-slate-500 dark:text-neutral-400 italic bg-slate-50 dark:bg-neutral-800/60 rounded-lg px-3 py-2 line-clamp-2 border border-slate-100 dark:border-neutral-700">
              &ldquo;{post.note}&rdquo;
            </p>
          )}
        </CardContent>

        {post.status === "open" && (
          <CardFooter className="px-4 py-3 border-t border-slate-100 dark:border-neutral-800/60 gap-2">
            {post.isOwn ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel?.(post)}
                className="flex-1 text-sm border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300"
              >
                Hủy đăng
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onContact(post)}
                  className="flex-1 text-sm gap-1.5 text-slate-600 dark:text-neutral-300 hover:border-[#4C88C6] hover:text-[#1D4D8F] dark:hover:text-blue-400"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhắn tin
                </Button>
                <Button
                  size="sm"
                  onClick={() => onAccept(post)}
                  className="flex-1 text-sm gap-1.5 bg-gradient-to-r from-[#102854] via-[#1D4D8F] to-[#4C88C6] border-0 text-white hover:shadow-md hover:shadow-[#4C88C6]/25"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Nhận ca này
                </Button>
              </>
            )}
          </CardFooter>
        )}

        {post.status === "matched" && (
          <CardFooter className="px-4 py-3 border-t border-emerald-100 dark:border-emerald-900/30">
            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              Ca đã được khớp thành công
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}
