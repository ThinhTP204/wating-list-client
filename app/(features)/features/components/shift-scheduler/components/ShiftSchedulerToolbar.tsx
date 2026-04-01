"use client";

import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Send,
  Settings,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ShiftConfig } from "@/features/shifts/types";
import ShiftLegend from "./ShiftLegend";

const DAY_NAMES = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function formatWeekLabel(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${fmt(monday)} – ${fmt(sunday)}/${sunday.getFullYear()}`;
}

function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

interface ShiftStats {
  total: number;
  published: number;
  draft: number;
  absent: number;
}

interface ShiftSchedulerToolbarProps {
  baseDate: Date;
  viewMode: "week" | "month";
  onViewModeChange: (m: "week" | "month") => void;
  draftCount: number;
  stats: ShiftStats;
  configs: ShiftConfig[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onPublish: () => void;
  onCopyPrevWeek: () => void;
  onGenerateAI: () => void;
  onToggleConfigPanel: () => void;
  isConfigPanelOpen: boolean;
  isPublishing?: boolean;
  isCopying?: boolean;
  isGeneratingAI?: boolean;
}

export default function ShiftSchedulerToolbar({
  baseDate,
  viewMode,
  onViewModeChange,
  draftCount,
  stats,
  configs,
  onPrev,
  onNext,
  onToday,
  onPublish,
  onCopyPrevWeek,
  onGenerateAI,
  onToggleConfigPanel,
  isConfigPanelOpen,
  isPublishing,
  isCopying,
  isGeneratingAI,
}: ShiftSchedulerToolbarProps) {
  const weekLabel = formatWeekLabel(baseDate);
  const weekNum = getWeekNumber(baseDate);

  return (
    <div className="border-b border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
      {/* Main toolbar row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap">
        {/* Left: navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrev} className="h-8 w-8 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday} className="h-8 text-xs px-3">
            <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
            Hôm nay
          </Button>
          <Button variant="outline" size="sm" onClick={onNext} className="h-8 w-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="ml-1 flex items-baseline">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {viewMode === "week" ? `Tuần ${weekNum}` : `Tháng ${baseDate.getMonth() + 1}`}
            </span>
            <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">
              {viewMode === "week" ? weekLabel : `, ${baseDate.getFullYear()}`}
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-neutral-700 overflow-hidden bg-slate-50 dark:bg-neutral-800 p-0.5">
            <button
              onClick={() => onViewModeChange("week")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                viewMode === "week"
                  ? "bg-white text-slate-800 dark:bg-neutral-700 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              Tuần
            </button>
            <button
              onClick={() => onViewModeChange("month")}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                viewMode === "month"
                  ? "bg-white text-slate-800 dark:bg-neutral-700 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              Tháng
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onCopyPrevWeek}
            disabled={isCopying || viewMode === "month"}
            title={viewMode === "month" ? "Sao chép tuần chỉ hoạt động ở chế độ xem Tuần" : ""}
            className="h-8 text-xs disabled:opacity-50"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            {isCopying ? "Đang sao chép..." : "Sao chép tuần trước"}
          </Button>

          <Button
            size="sm"
            onClick={onGenerateAI}
            disabled={isGeneratingAI}
            className="h-8 text-xs border-0 text-white bg-linear-to-r from-violet-600 to-fuchsia-600 hover:brightness-110"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {isGeneratingAI ? "AI đang xếp..." : "Sắp xếp lịch ca bằng A.I"}
          </Button>

          <Button
            size="sm"
            onClick={onPublish}
            disabled={isPublishing || draftCount === 0}
            className={cn(
              "h-8 text-xs border-0 text-white",
              draftCount > 0
                ? "bg-linear-to-r from-brand-700 to-brand-500 hover:brightness-110"
                : "bg-slate-200 dark:bg-neutral-700 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {isPublishing
              ? "Đang công bố..."
              : `Công bố${draftCount > 0 ? ` (${draftCount})` : ""}`}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleConfigPanel}
            className={cn(
              "h-8 w-8 p-0",
              isConfigPanelOpen && "bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-950"
            )}
          >
            <Settings className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Stats + Legend row */}
      <div className="flex items-center justify-between gap-4 px-4 py-2 border-t border-slate-100 dark:border-neutral-800 flex-wrap">
        {/* Stats pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className="text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            Tổng: {stats.total}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-medium border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-400 dark:bg-green-950/30"
          >
            Đã công bố: {stats.published}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-medium border-amber-200 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-950/30"
          >
            Nháp: {stats.draft}
          </Badge>
          {stats.absent > 0 && (
            <Badge
              variant="outline"
              className="text-xs font-medium border-red-200 text-red-600 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950/30"
            >
              Vắng: {stats.absent}
            </Badge>
          )}
        </div>

        {/* Shift config legend */}
        <ShiftLegend configs={configs} />
      </div>
    </div>
  );
}

export { DAY_NAMES };
