"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileEdit, AlertCircle, Clock, CalendarDays, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SHIFT_STATUS_META } from "@/features/shifts/types";
import { useShiftsByEmployee, useShiftConfigs } from "@/features/shifts/hooks/useShifts";

// Mock: hardcoded employee ID for demo
const MY_EMPLOYEE_ID = "emp-01";

const DAY_NAMES = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const totalCells = Math.ceil((startIndex + lastDay.getDate()) / 7) * 7;
  return Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startIndex + 1;
    if (dayNum < 1 || dayNum > lastDay.getDate()) return null;
    return new Date(year, month, dayNum);
  });
}

const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

export default function MyCalendar() {
  const today = new Date();
  
  const [viewMode, setViewMode] = useState<"month" | "week">("week");
  const [baseDate, setBaseDate] = useState<Date>(today);

  // Pad the month tightly so overlapping weeks load perfectly.
  const { start: startFetch, end: endFetch } = useMemo(() => {
    const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
    return { 
      start: toISODate(addDays(start, -7)), 
      end: toISODate(addDays(end, 7)) 
    };
  }, [baseDate.getFullYear(), baseDate.getMonth()]);

  const { data: shifts = [], isLoading: shiftsLoading } = useShiftsByEmployee(
    MY_EMPLOYEE_ID,
    startFetch,
    endFetch
  );
  
  const { data: configs = [], isLoading: configsLoading } = useShiftConfigs();
  const isLoading = shiftsLoading || configsLoading;

  const monthGrid = useMemo(() => buildMonthGrid(baseDate.getFullYear(), baseDate.getMonth()), [baseDate]);
  
  const weekDays = useMemo(() => {
    const monday = getMonday(baseDate);
    return Array.from({length: 7}, (_, i) => addDays(monday, i));
  }, [baseDate]);

  function getShiftsForDate(date: Date) {
    return shifts.filter((s) => s.date === toISODate(date));
  }

  function handlePrev() {
    if (viewMode === "month") {
      setBaseDate(d => {
        const nd = new Date(d);
        nd.setMonth(nd.getMonth() - 1);
        return nd;
      });
    } else {
      setBaseDate(d => addDays(d, -7));
    }
  }

  function handleNext() {
    if (viewMode === "month") {
      setBaseDate(d => {
        const nd = new Date(d);
        nd.setMonth(nd.getMonth() + 1);
        return nd;
      });
    } else {
      setBaseDate(d => addDays(d, 7));
    }
  }

  const currentMonthShifts = shifts.filter(s => {
      const shiftDate = new Date(s.date);
      return shiftDate.getMonth() === baseDate.getMonth() && shiftDate.getFullYear() === baseDate.getFullYear();
  });
  
  const currentWeekShifts = shifts.filter(s => {
      return weekDays.some(d => toISODate(d) === s.date);
  });

  const activeShiftsStats = viewMode === "month" ? currentMonthShifts : currentWeekShifts;
  const totalShifts = activeShiftsStats.length;
  const publishedShifts = activeShiftsStats.filter((s) => s.status === "published").length;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 h-full bg-slate-50/50 dark:bg-black/20">
        <div className="flex flex-col h-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white dark:border-neutral-800 p-6 space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full bg-slate-50/50 dark:bg-black/20 overflow-auto">
      <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white dark:border-neutral-800 p-5 gap-4">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {viewMode === "month" ? (
                <>{MONTH_NAMES[baseDate.getMonth()]} {baseDate.getFullYear()}</>
              ) : (
                <>
                  <span className="text-slate-500 font-semibold">{MONTH_NAMES[baseDate.getMonth()]}</span> 
                  Tuần từ {weekDays[0].getDate()} – {weekDays[6].getDate()}
                </>
              )}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {totalShifts} ca · {publishedShifts} đã công bố {viewMode === "week" ? "trong tuần" : "trong tháng"}
            </p>
          </div>

          <div className="flex items-center gap-3 border border-slate-200 dark:border-neutral-800 rounded-lg p-1 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-[2px]">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-neutral-800 rounded-md p-0.5">
              <button
                onClick={() => setViewMode("week")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-sm transition-all",
                  viewMode === "week"
                    ? "bg-white dark:bg-neutral-700 text-slate-800 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                )}
              >
                <CalendarDays className="w-3.5 h-3.5" /> Tuần
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-sm transition-all",
                  viewMode === "month"
                    ? "bg-white dark:bg-neutral-700 text-slate-800 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Tháng
              </button>
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-neutral-700" />

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 pr-1">
              <Button variant="ghost" size="sm" onClick={handlePrev} className="h-8 w-8 p-0 hover:bg-slate-200/50 dark:hover:bg-neutral-800">
                <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBaseDate(today)}
                className="h-8 text-xs px-3 font-semibold hover:bg-slate-200/50 dark:hover:bg-neutral-800"
              >
                Hôm nay
              </Button>
              <Button variant="ghost" size="sm" onClick={handleNext} className="h-8 w-8 p-0 hover:bg-slate-200/50 dark:hover:bg-neutral-800">
                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>
          </div>
        </div>

        {/* --- WEEK VIEW --- */}
        {viewMode === "week" && (
          <div className="grid grid-cols-7 gap-3 flex-1 overflow-x-auto min-w-[700px] pb-2">
            {weekDays.map((day) => {
              const dateStr = toISODate(day);
              const isToday = dateStr === toISODate(today);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              const dayShifts = getShiftsForDate(day);

              return (
                <div key={dateStr} className="flex flex-col gap-2 relative">
                  {/* Day Header Column */}
                  <div className={cn(
                     "text-center py-2.5 rounded-xl border transition-colors relative overflow-hidden",
                     isToday ? "bg-blue-50/80 dark:bg-blue-900/40 border-blue-200/80 dark:border-blue-700/50" 
                             : isWeekend ? "bg-slate-50/70 dark:bg-neutral-800/40 border-slate-100 dark:border-neutral-800/80"
                             : "bg-white dark:bg-neutral-900 border-slate-100 dark:border-neutral-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
                  )}>
                    {isToday && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />}
                    <p className={cn(
                        "text-xs font-bold uppercase tracking-wider mb-0.5",
                        isToday ? "text-blue-600 dark:text-blue-400" : isWeekend ? "text-slate-400" : "text-slate-500"
                    )}>
                      {DAY_NAMES[day.getDay() === 0 ? 6 : day.getDay() - 1]}
                    </p>
                    <p className={cn(
                      "text-[22px] font-extrabold mx-auto flex items-center justify-center leading-none",
                      isToday ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-slate-100"
                    )}>
                      {day.getDate()}
                    </p>
                  </div>

                  {/* Wide Shifts List */}
                  <div className="flex-1 flex flex-col gap-2.5 min-h-[300px] p-2 bg-slate-50/50 dark:bg-neutral-900/20 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800/60 overflow-y-auto">
                    {dayShifts.map((shift) => {
                      const config = configs.find((c) => c.id === shift.configId);
                      const isDraft = shift.status === "draft";
                      const isAbsent = shift.status === "absent";
                      const chipColor = config?.color ?? "#4C88C6";

                      return (
                        <div
                          key={shift.id}
                          className={cn(
                            "group flex flex-col gap-1.5 rounded-md p-2.5 select-none text-left w-full",
                            "border border-l-[4px] transition-all duration-200",
                            isAbsent
                              ? "bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400"
                              : isDraft
                              ? "bg-slate-100/80 dark:bg-neutral-800/80 border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400"
                              : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-200 shadow-sm",
                            "hover:border-slate-300 dark:hover:border-neutral-600 hover:shadow-md cursor-pointer hover:-translate-y-0.5"
                          )}
                          style={{ borderLeftColor: isAbsent ? undefined : chipColor }}
                          title={`${config?.name ?? "Ca"} · ${config?.startTime}–${config?.endTime} · ${isDraft ? "Nháp" : isAbsent ? "Vắng" : "Đã công bố"}${shift.note ? ` · ${shift.note}` : ""}`}
                        >
                          <div className="flex items-center justify-between w-full overflow-hidden gap-2">
                            <span className={cn(
                              "text-sm font-bold leading-tight truncate flex-1",
                              isAbsent && "line-through opacity-80"
                            )}>
                              {config?.name ?? "Ca"}
                            </span>
                            {isDraft && <FileEdit className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />}
                            {isAbsent && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />}
                          </div>

                          {config && (
                            <span className="text-xs flex items-center gap-1.5 opacity-70 leading-none mt-1">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="font-semibold tabular-nums">{config.startTime} – {config.endTime}</span>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- MONTH VIEW --- */}
        {viewMode === "month" && (
          <>
            <div className="grid grid-cols-7 gap-1 border-b border-slate-200 dark:border-neutral-800 pb-2 flex-shrink-0">
              {DAY_NAMES.map((d) => (
                <div key={d} className="text-center text-xs font-bold uppercase text-slate-400 dark:text-slate-500 py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-[1px] flex-1 bg-slate-100 dark:bg-neutral-800 border border-slate-100 dark:border-neutral-800 rounded-lg overflow-hidden">
              {monthGrid.map((day, idx) => {
                if (!day) {
                  return <div key={`empty-${idx}`} className="bg-white/50 dark:bg-neutral-900/50 min-h-[80px]" />;
                }
                const dateStr = toISODate(day);
                const isToday = dateStr === toISODate(today);
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                const dayShifts = getShiftsForDate(day);

                return (
                  <div
                    key={dateStr}
                    className={cn(
                      "min-h-[90px] p-2 flex flex-col gap-1.5",
                      "transition-colors duration-150 relative",
                      isToday
                        ? "bg-blue-50/40 dark:bg-blue-950/20"
                        : isWeekend
                        ? "bg-slate-50/70 dark:bg-neutral-900/40"
                        : "bg-white dark:bg-neutral-900/80"
                    )}
                  >
                    <span
                      className={cn(
                        "self-end text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full z-10",
                        isToday
                          ? "bg-blue-600 dark:bg-blue-500 text-white shadow-sm"
                          : isWeekend
                          ? "text-slate-400"
                          : "text-slate-600 dark:text-slate-300"
                      )}
                    >
                      {day.getDate()}
                    </span>

                    <div className="flex flex-col gap-1.5 z-10 w-full relative">
                      {dayShifts.map((shift) => {
                        const config = configs.find((c) => c.id === shift.configId);
                        const isDraft = shift.status === "draft";
                        const isAbsent = shift.status === "absent";
                        const chipColor = config?.color ?? "#4C88C6";

                        return (
                          <div
                            key={shift.id}
                            className={cn(
                              "group flex flex-col gap-1 rounded-sm p-1.5 select-none text-left w-full",
                              "border-y border-r border-l-[3px] transition-all duration-200",
                              isAbsent
                                ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400"
                                : isDraft
                                ? "bg-slate-50 dark:bg-neutral-800/50 border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400"
                                : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-200 shadow-sm",
                              "hover:border-slate-300 dark:hover:border-neutral-600 hover:shadow-md cursor-pointer"
                            )}
                            style={{ borderLeftColor: isAbsent ? undefined : chipColor }}
                            title={`${config?.name ?? "Ca"} · ${config?.startTime}–${config?.endTime} · ${isDraft ? "Nháp" : isAbsent ? "Vắng" : "Đã công bố"}${shift.note ? ` · ${shift.note}` : ""}`}
                          >
                            <div className="flex items-center justify-between w-full overflow-hidden gap-1">
                              <span
                                className={cn(
                                  "text-[11px] font-bold leading-none truncate flex-1",
                                  isAbsent && "line-through opacity-80"
                                )}
                              >
                                {config?.name ?? "Ca?"}
                              </span>
                              {isDraft && <FileEdit className="w-3 h-3 flex-shrink-0 opacity-70" />}
                              {isAbsent && <AlertCircle className="w-3 h-3 flex-shrink-0 text-red-500" />}
                            </div>

                            {config && (
                              <span className="text-[10px] flex items-center gap-1 opacity-70 leading-none">
                                <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                                <span className="truncate">{config.startTime} – {config.endTime}</span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 pt-1 opacity-80 text-[11px] font-medium text-slate-500 dark:text-slate-400 pb-1 w-full justify-between flex-shrink-0">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-white dark:bg-neutral-900 border border-slate-300 dark:border-neutral-600 rounded-full" /> Đã công bố</span>
              <span className="flex items-center gap-1.5"><FileEdit className="w-3 h-3 opacity-70" /> Bản nháp</span>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-red-500/80"><AlertCircle className="w-3 h-3" /> Vắng mặt</span>
            </div>
        </div>
      </div>
    </div>
  );
}
