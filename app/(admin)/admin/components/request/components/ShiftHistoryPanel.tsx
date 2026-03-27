"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  ArrowLeftRight,
  UserCheck,
  XCircle,
  Zap,
  History,
  ChevronDown,
  CalendarCheck,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

export type HistoryEventType =
  | "accepted"
  | "swapped"
  | "posted"
  | "cancelled"
  | "matched";

export interface ShiftHistoryEntry {
  id: string;
  type: HistoryEventType;
  actorName: string;
  actorInitial: string;
  description: string;
  shiftInfo?: string;
  branch?: string;
  timestamp: string; // ISO
}

// ── Meta ─────────────────────────────────────────────────────────────────────

const EVENT_META: Record<
  HistoryEventType,
  { icon: React.ElementType; color: string; bg: string; ring: string; label: string }
> = {
  accepted: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    ring: "ring-emerald-200 dark:ring-emerald-800/60",
    label: "Nhận ca",
  },
  swapped: {
    icon: ArrowLeftRight,
    color: "text-[#1D4D8F] dark:text-blue-400",
    bg: "bg-[#BCE8F5]/50 dark:bg-blue-900/30",
    ring: "ring-[#4C88C6]/30 dark:ring-blue-700/40",
    label: "Đổi ca",
  },
  posted: {
    icon: UserCheck,
    color: "text-slate-500 dark:text-neutral-400",
    bg: "bg-slate-100 dark:bg-neutral-800",
    ring: "ring-slate-200 dark:ring-neutral-700",
    label: "Đăng mới",
  },
  cancelled: {
    icon: XCircle,
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    ring: "ring-red-100 dark:ring-red-800/40",
    label: "Hủy",
  },
  matched: {
    icon: Zap,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    ring: "ring-violet-200 dark:ring-violet-800/50",
    label: "Khớp",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function timeAgo(isoDate: string): string {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 60000;
  if (diff < 2) return "Vừa xong";
  if (diff < 60) return `${Math.floor(diff)}p`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h`;
  return `${Math.floor(diff / 1440)}d`;
}

function groupKey(isoDate: string): "Hôm nay" | "Hôm qua" | "Trước đó" {
  const d = new Date(isoDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const dDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (dDay.getTime() === today.getTime()) return "Hôm nay";
  if (dDay.getTime() === yesterday.getTime()) return "Hôm qua";
  return "Trước đó";
}

const GROUP_ORDER = ["Hôm nay", "Hôm qua", "Trước đó"] as const;

// ── Mock data ─────────────────────────────────────────────────────────────────

export const MOCK_HISTORY: ShiftHistoryEntry[] = [
  {
    id: "h1",
    type: "accepted",
    actorName: "Lê Minh Châu",
    actorInitial: "C",
    description: "nhận ca đêm của Phạm Quốc Dũng",
    shiftInfo: "Ca đêm 22:00 – 06:00 · 28/03",
    branch: "Chi nhánh Quận 1",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "h2",
    type: "matched",
    actorName: "Nguyễn Văn An",
    actorInitial: "A",
    description: "khớp tự động với Nguyễn Thị Mai",
    shiftInfo: "Ca sáng 08:00 – 16:00 · 30/03",
    branch: "Chi nhánh Quận 1",
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  },
  {
    id: "h3",
    type: "swapped",
    actorName: "Trần Thị Bảo",
    actorInitial: "B",
    description: "đổi ca chiều lấy ca sáng với Bùi Thanh Tùng",
    shiftInfo: "Ca chiều ↔ Ca sáng · 01/04",
    branch: "Chi nhánh Quận 3",
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "h4",
    type: "posted",
    actorName: "Phạm Quốc Dũng",
    actorInitial: "D",
    description: "đăng yêu cầu đổi ca sáng",
    shiftInfo: "Ca sáng 06:00 – 14:00 · 05/04",
    branch: "Chi nhánh Quận 7",
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "h5",
    type: "accepted",
    actorName: "Phan Thị Hồng",
    actorInitial: "H",
    description: "nhận ca sáng của Đỗ Văn Khoa",
    shiftInfo: "Ca sáng 08:00 – 16:00 · 01/04",
    branch: "Chi nhánh Quận 1",
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "h6",
    type: "cancelled",
    actorName: "Hoàng Thị Lan",
    actorInitial: "L",
    description: "hủy yêu cầu đổi ca tối",
    shiftInfo: "Ca tối 18:00 – 22:00 · 29/03",
    branch: "Chi nhánh Quận 1",
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
  },
  {
    id: "h7",
    type: "swapped",
    actorName: "Đỗ Văn Khoa",
    actorInitial: "K",
    description: "hoàn tất đổi ca tối với Phan Thị Hồng",
    shiftInfo: "Ca tối ↔ Ca chiều · 26/03",
    branch: "Chi nhánh Quận 3",
    timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
  {
    id: "h8",
    type: "matched",
    actorName: "Bùi Thanh Tùng",
    actorInitial: "T",
    description: "khớp tự động với Trần Thị Bảo",
    shiftInfo: "Ca chiều 14:00 – 22:00 · 01/04",
    branch: "Chi nhánh Quận 7",
    timestamp: new Date(Date.now() - 30 * 3600 * 1000).toISOString(),
  },
  {
    id: "h9",
    type: "accepted",
    actorName: "Nguyễn Thị Mai",
    actorInitial: "M",
    description: "nhận ca sáng của Hoàng Thị Lan",
    shiftInfo: "Ca sáng 08:00 – 16:00 · 30/03",
    branch: "Chi nhánh Quận 1",
    timestamp: new Date(Date.now() - 34 * 3600 * 1000).toISOString(),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface ShiftHistoryPanelProps {
  entries?: ShiftHistoryEntry[];
  className?: string;
}

export default function ShiftHistoryPanel({
  entries = MOCK_HISTORY,
  className,
}: ShiftHistoryPanelProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const grouped = useMemo(() => {
    const map: Record<string, ShiftHistoryEntry[]> = {};
    for (const e of entries) {
      const g = groupKey(e.timestamp);
      if (!map[g]) map[g] = [];
      map[g].push(e);
    }
    return map;
  }, [entries]);

  const todayEntries = grouped["Hôm nay"] ?? [];
  const { todayAccepted, todaySwapped, todayMatched } = todayEntries.reduce(
    (acc, e) => {
      if (e.type === "accepted") acc.todayAccepted++;
      else if (e.type === "swapped") acc.todaySwapped++;
      else if (e.type === "matched") acc.todayMatched++;
      return acc;
    },
    { todayAccepted: 0, todaySwapped: 0, todayMatched: 0 }
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>

      {/* ── Panel header ── */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#102854] to-[#4C88C6] flex items-center justify-center shrink-0">
          <History className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-800 dark:text-white">Lịch sử hoạt động</span>
        <Badge className="bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-transparent text-xs ml-auto">
          {entries.length}
        </Badge>
      </div>

      {/* ── Today quick stats ── */}
      {todayEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2"
        >
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-xl px-2 py-2.5 text-center">
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">
              {todayAccepted}
            </p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-500 mt-1">Nhận ca</p>
          </div>
          <div className="bg-[#BCE8F5]/30 dark:bg-blue-900/20 border border-[#4C88C6]/20 dark:border-blue-800/40 rounded-xl px-2 py-2.5 text-center">
            <p className="text-lg font-black text-[#1D4D8F] dark:text-blue-400 leading-none">
              {todaySwapped}
            </p>
            <p className="text-xs text-[#1D4D8F]/70 dark:text-blue-500 mt-1">Đổi ca</p>
          </div>
          <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/40 rounded-xl px-2 py-2.5 text-center">
            <p className="text-lg font-black text-violet-600 dark:text-violet-400 leading-none">
              {todayMatched}
            </p>
            <p className="text-xs text-violet-600/70 dark:text-violet-500 mt-1">Khớp AI</p>
          </div>
        </motion.div>
      )}

      {/* ── Divider ── */}
      <div className="flex items-center gap-2">
        <CalendarCheck className="w-3.5 h-3.5 text-slate-300 dark:text-neutral-600 shrink-0" />
        <div className="flex-1 h-px bg-slate-100 dark:bg-neutral-800" />
      </div>

      {/* ── Timeline ── */}
      <div className="space-y-5">
        {GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => {
          const isCollapsed = collapsed[group] ?? false;
          const groupEntries = grouped[group];

          return (
            <div key={group}>
              {/* Group label */}
              <button
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, [group]: !isCollapsed }))
                }
                className="flex items-center gap-2 w-full mb-3"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 shrink-0">
                  {group}
                </span>
                <span className="text-xs font-semibold text-slate-300 dark:text-neutral-600 shrink-0">
                  {groupEntries.length}
                </span>
                <div className="flex-1 h-px bg-slate-100 dark:bg-neutral-800" />
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-slate-300 dark:text-neutral-600 transition-transform duration-200",
                    isCollapsed && "-rotate-90"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    key="group-content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="relative">
                      {/* Vertical connecting line */}
                      <div className="absolute left-[15px] top-4 bottom-3 w-px bg-slate-100 dark:bg-neutral-800 z-0" />

                      <div>
                        {groupEntries.map((entry, i) => {
                          const meta = EVENT_META[entry.type];
                          const Icon = meta.icon;

                          return (
                            <motion.div
                              key={entry.id}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="relative flex gap-3 pb-4 last:pb-0 z-10"
                            >
                              {/* Event icon */}
                              <div
                                className={cn(
                                  "w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0",
                                  "border-2 border-white dark:border-neutral-950 shadow-sm ring-1",
                                  meta.bg,
                                  meta.ring
                                )}
                              >
                                <Icon className={cn("w-3.5 h-3.5", meta.color)} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex items-start justify-between gap-1">
                                  <div className="flex-1 min-w-0 space-y-0.5">
                                    {/* Actor + badge */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-bold text-slate-800 dark:text-white">
                                        {entry.actorName}
                                      </span>
                                      <Badge
                                        className={cn(
                                          "border-transparent text-xs px-1.5 h-4 leading-none",
                                          meta.bg,
                                          meta.color
                                        )}
                                      >
                                        {meta.label}
                                      </Badge>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                                      {entry.description}
                                    </p>

                                    {/* Shift info */}
                                    {entry.shiftInfo && (
                                      <p className="text-xs font-medium text-slate-400 dark:text-neutral-500">
                                        {entry.shiftInfo}
                                      </p>
                                    )}

                                    {/* Branch */}
                                    {entry.branch && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-slate-300 dark:text-neutral-600 shrink-0" />
                                        <span className="text-xs text-slate-300 dark:text-neutral-600 truncate">
                                          {entry.branch}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Timestamp */}
                                  <span className="text-xs text-slate-300 dark:text-neutral-600 shrink-0 mt-0.5">
                                    {timeAgo(entry.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {entries.length === 0 && (
        <div className="flex flex-col items-center py-10 gap-2 text-slate-400 dark:text-neutral-500">
          <History className="w-8 h-8 opacity-20" />
          <p className="text-xs">Chưa có hoạt động nào</p>
        </div>
      )}
    </div>
  );
}
