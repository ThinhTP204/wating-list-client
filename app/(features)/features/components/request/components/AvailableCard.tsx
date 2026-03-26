"use client";

import { motion } from "motion/react";
import { MapPin, MessageCircle, UserCheck, Sunrise, Sun, Sunset, Moon, Zap } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvailableEmployee, ShiftType, SHIFT_TYPE_META } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  employee: AvailableEmployee;
  onContact: (emp: AvailableEmployee) => void;
  onInvite: (emp: AvailableEmployee) => void;
  onCancel?: (emp: AvailableEmployee) => void;
}

const SHIFT_ICONS: Record<ShiftType, React.ElementType> = {
  morning:   Sunrise,
  afternoon: Sun,
  evening:   Sunset,
  night:     Moon,
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}

function KarmaRing({ score }: { score: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  const ringColor =
    score >= 85
      ? "#10b981"
      : score >= 65
      ? "#4C88C6"
      : "#f59e0b";

  return (
    <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3"
          className="text-slate-100 dark:text-neutral-800" />
        <circle
          cx="22" cy="22" r={radius} fill="none"
          stroke={ringColor} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="text-[10px] font-black text-slate-700 dark:text-white relative z-10">{score}</span>
    </div>
  );
}

function MatchBadge({ score }: { score: number }) {
  const isHigh = score >= 80;
  return (
    <div className={cn(
      "flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border",
      isHigh
        ? "bg-[#102854]/8 dark:bg-blue-900/30 text-[#1D4D8F] dark:text-blue-300 border-[#4C88C6]/30 dark:border-blue-700"
        : "bg-slate-50 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-700"
    )}>
      <Zap className="w-3 h-3" />
      {score}%
    </div>
  );
}

export default function AvailableCard({ employee, onContact, onInvite, onCancel }: Props) {
  const initial = employee.name.split(" ").pop()?.charAt(0) ?? "?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.005 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative rounded-2xl border transition-all duration-200 overflow-hidden",
        "bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm",
        "border-slate-200/80 dark:border-neutral-700/80",
        "hover:border-emerald-300/60 hover:shadow-lg hover:shadow-emerald-500/10",
        employee.isOwn && "ring-2 ring-emerald-400/25 dark:ring-emerald-500/20"
      )}
    >
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <Card className="border-0 shadow-none bg-transparent gap-0 py-0">
        <CardContent className="px-4 pt-4 pb-3 space-y-3">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Karma ring wrapping avatar */}
              <div className="relative shrink-0">
                <KarmaRing score={employee.karma} />
                <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {initial}
                </div>
                <span className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900",
                  employee.isOnline ? "bg-emerald-400" : "bg-slate-300 dark:bg-neutral-600"
                )} />
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-base font-semibold text-slate-800 dark:text-white leading-tight">
                    {employee.name}
                  </span>
                  {employee.isOwn && (
                    <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-transparent text-xs px-1.5 py-0">
                      Của tôi
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-neutral-500 mt-0.5">
                  <span>{employee.position}</span>
                  <span>·</span>
                  <span>{employee.department}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs">
                Sẵn sàng
              </Badge>
              {employee.matchScore !== undefined && (
                <MatchBadge score={employee.matchScore} />
              )}
            </div>
          </div>

          {/* Available info */}
          <div className="bg-emerald-50/60 dark:bg-emerald-900/10 rounded-xl p-3 space-y-2.5 border border-emerald-100 dark:border-emerald-900/30">
            <div className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-emerald-200 dark:border-emerald-800/50 rounded-lg px-2.5 py-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-sm font-semibold text-slate-700 dark:text-neutral-300">
                {formatDate(employee.availableDate)}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {employee.availableShifts.map((type) => {
                const meta = SHIFT_TYPE_META[type];
                const Icon = SHIFT_ICONS[type];
                return (
                  <span
                    key={type}
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border",
                      "bg-white dark:bg-neutral-900",
                      meta.color,
                      "border-slate-200 dark:border-neutral-700"
                    )}
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    {meta.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-1 text-sm text-slate-400 dark:text-neutral-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{employee.branch}</span>
          </div>

          {employee.note && (
            <p className="text-sm text-slate-500 dark:text-neutral-400 italic bg-slate-50 dark:bg-neutral-800/60 rounded-lg px-3 py-2 line-clamp-2 border border-slate-100 dark:border-neutral-700">
              &ldquo;{employee.note}&rdquo;
            </p>
          )}
        </CardContent>

        <CardFooter className="px-4 py-3 border-t border-slate-100 dark:border-neutral-800/60 gap-2">
          {employee.isOwn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel?.(employee)}
              className="flex-1 text-sm border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Hủy đăng
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onContact(employee)}
                className="flex-1 text-sm gap-1.5 text-slate-600 dark:text-neutral-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <MessageCircle className="w-4 h-4" />
                Nhắn tin
              </Button>
              <Button
                size="sm"
                onClick={() => onInvite(employee)}
                className="flex-1 text-sm gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 border-0 text-white hover:shadow-md hover:shadow-emerald-500/20"
              >
                <UserCheck className="w-4 h-4" />
                Mời nhận ca
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
