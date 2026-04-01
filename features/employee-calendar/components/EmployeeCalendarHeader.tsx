import { ChevronLeft, ChevronRight, CalendarDays, LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarStats, CalendarViewMode } from "@/features/employee-calendar/types";

interface EmployeeCalendarHeaderProps {
  monthLabel: string;
  weekLabel: string;
  viewMode: CalendarViewMode;
  stats: CalendarStats;
  onChangeViewMode: (mode: CalendarViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function EmployeeCalendarHeader({
  monthLabel,
  weekLabel,
  viewMode,
  stats,
  onChangeViewMode,
  onPrev,
  onNext,
  onToday,
}: EmployeeCalendarHeaderProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm dark:border-neutral-700/80 dark:bg-neutral-900/80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-section-title text-slate-900 dark:text-slate-100">Lich ca cua toi</p>
          <p className="mt-1 text-meta">
            {viewMode === "week" ? `Tuan ${weekLabel}` : monthLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-neutral-700 dark:bg-neutral-800">
            <button
              onClick={() => onChangeViewMode("week")}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition",
                viewMode === "week"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-neutral-700 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Tuan
            </button>
            <button
              onClick={() => onChangeViewMode("month")}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition",
                viewMode === "month"
                  ? "bg-white text-slate-900 shadow-sm dark:bg-neutral-700 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Thang
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={onPrev} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday} className="h-8 px-3 text-xs">
            Hom nay
          </Button>
          <Button variant="outline" size="sm" onClick={onNext} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-xs">Tong {stats.total} ca</Badge>
        <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700 text-xs dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
          Da cong bo {stats.published}
        </Badge>
        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 text-xs dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          Nhap {stats.draft}
        </Badge>
        {stats.absent > 0 && (
          <Badge variant="outline" className="border-red-300 bg-red-50 text-red-700 text-xs dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            Vang {stats.absent}
          </Badge>
        )}
      </div>
    </div>
  );
}
