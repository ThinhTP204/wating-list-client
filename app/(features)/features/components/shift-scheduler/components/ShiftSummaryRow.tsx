"use client";

import { cn } from "@/lib/utils";
import type { Shift, ShiftConfig } from "@/features/shifts/types";

interface ShiftSummaryRowProps {
  weekDayStrings: string[]; // These are actually "viewDayStrings", but we can keep the prop name for now or rename to dayStrings
  shifts: Shift[];
  configs: ShiftConfig[];
  todayStr: string;
  viewMode: "week" | "month";
}

function parseHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let startMins = sh * 60 + sm;
  let endMins = eh * 60 + em;
  if (endMins <= startMins) endMins += 24 * 60; // overnight shift
  return (endMins - startMins) / 60;
}

export default function ShiftSummaryRow({
  weekDayStrings,
  shifts,
  configs,
  todayStr,
  viewMode,
}: ShiftSummaryRowProps) {
  const totalPeriodShifts = shifts.filter((s) => weekDayStrings.includes(s.date)).length;
  const colWidth = viewMode === "month" ? "85px" : "120px";

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `240px repeat(${weekDayStrings.length}, minmax(${colWidth}, 1fr))` }}
    >
      {/* Label cell */}
      <div className="sticky left-0 z-10 bg-slate-50/95 dark:bg-neutral-800/95 backdrop-blur-md border-t border-r border-slate-200 dark:border-neutral-700 px-3 py-2 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.08)] dark:shadow-[2px_0_8px_-4px_rgba(0,0,0,0.3)]">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Tổng quát
        </p>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{totalPeriodShifts} ca</p>
      </div>

      {/* Per-day summary cells */}
      {weekDayStrings.map((dateStr) => {
        const dayShifts = shifts.filter((s) => s.date === dateStr);
        const totalHours = dayShifts.reduce((sum, shift) => {
          const config = configs.find((c) => c.id === shift.configId);
          if (!config) return sum;
          return sum + parseHours(config.startTime, config.endTime);
        }, 0);
        const isToday = dateStr === todayStr;

        return (
          <div
            key={dateStr}
            className={cn(
              "border-t border-r border-slate-200 dark:border-neutral-700 px-2 py-2 text-center",
              isToday
                ? "bg-blue-50/60 dark:bg-blue-950/20"
                : "bg-slate-50 dark:bg-neutral-800/60"
            )}
          >
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {dayShifts.length > 0 ? `${dayShifts.length} ca` : "–"}
            </p>
            {totalHours > 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {totalHours % 1 === 0 ? totalHours : totalHours.toFixed(1)}h
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
