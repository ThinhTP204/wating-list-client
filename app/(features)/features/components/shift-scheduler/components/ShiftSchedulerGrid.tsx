"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { Shift, ShiftConfig, MockEmployee } from "@/features/shifts/types";
import ShiftCell from "./ShiftCell";
import ShiftChip from "./ShiftChip";
import ShiftSummaryRow from "./ShiftSummaryRow";
import { DAY_NAMES } from "./ShiftSchedulerToolbar";

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDayHeader(d: Date): { dayName: string; dayNum: number; isToday: boolean } {
  const today = new Date();
  return {
    dayName: DAY_NAMES[d.getDay() === 0 ? 6 : d.getDay() - 1],
    dayNum: d.getDate(),
    isToday: toISODate(d) === toISODate(today),
  };
}

interface ShiftSchedulerGridProps {
  viewDays: Date[];
  viewMode: "week" | "month";
  shifts: Shift[];
  configs: ShiftConfig[];
  employees: MockEmployee[];
  disableAddShift?: boolean;
  onAddShift: (employeeId: string, date: string) => void;
  onEditShift: (shift: Shift) => void;
  onMoveShift: (shiftId: string, newEmployeeId: string, newDate: string) => void;
}

export default function ShiftSchedulerGrid({
  viewDays,
  viewMode,
  shifts,
  configs,
  employees,
  disableAddShift,
  onAddShift,
  onEditShift,
  onMoveShift,
}: ShiftSchedulerGridProps) {
  const [activeShift, setActiveShift] = useState<Shift | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const dayStrings = viewDays.map(toISODate);
  const todayStr = toISODate(new Date());

  // Flat sorted employee list (no role grouping)
  const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name, "vi"));

  function getShiftsFor(employeeId: string, date: string) {
    return shifts.filter((s) => s.employeeId === employeeId && s.date === date);
  }

  function handleDragStart(event: DragStartEvent) {
    const shift = shifts.find((s) => s.id === event.active.id);
    setActiveShift(shift ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveShift(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const [newEmployeeId, newDate] = String(over.id).split("::");
    if (!newEmployeeId || !newDate) return;
    onMoveShift(String(active.id), newEmployeeId, newDate);
  }

  const colWidth = viewMode === "month" ? "85px" : "120px";

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="overflow-x-auto">
        <div
          className={cn(viewMode === "month" ? "min-w-[1200px]" : "min-w-[900px]")}
          style={{
            display: "grid",
            gridTemplateColumns: `240px repeat(${viewDays.length}, minmax(${colWidth}, 1fr))`,
          }}
        >
          {/* ── Header row ── */}
          <div className="sticky top-0 left-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-r border-slate-200 dark:border-neutral-700 px-3 py-2 flex items-end shadow-[2px_0_8px_-4px_rgba(0,0,0,0.06)] dark:shadow-[2px_0_8px_-4px_rgba(0,0,0,0.25)]">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Nhân viên
            </span>
          </div>

          {viewDays.map((day) => {
            const { dayName, dayNum, isToday } = formatDayHeader(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            return (
              <div
                key={toISODate(day)}
                className={cn(
                  "sticky top-0 z-20 text-center py-2.5 border-b border-r border-slate-200 dark:border-neutral-700",
                  isToday
                    ? "bg-blue-50/80 dark:bg-blue-900/20"
                    : isWeekend
                      ? "bg-slate-50/80 dark:bg-neutral-800/50"
                      : "bg-white dark:bg-neutral-900/80 backdrop-blur-md"
                )}
              >
                <p
                  className={cn(
                    "text-xs font-semibold",
                    isWeekend ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  {dayName}
                </p>
                {isToday ? (
                  <div className="flex items-center justify-center mt-0.5">
                    <span
                      className={cn(
                        "rounded-full bg-[#1D4D8F] text-white font-bold flex items-center justify-center leading-none",
                        viewMode === "month" ? "w-6 h-6 text-sm" : "w-8 h-8 text-base"
                      )}
                    >
                      {dayNum}
                    </span>
                  </div>
                ) : (
                  <p
                    className={cn(
                      "font-bold leading-tight text-slate-700 dark:text-slate-200",
                      viewMode === "month" ? "text-base" : "text-lg"
                    )}
                  >
                    {dayNum}
                  </p>
                )}
              </div>
            );
          })}

          {/* ── Employee rows (flat sorted list) ── */}
          {sortedEmployees.map((emp) => {
            const periodShiftCount = shifts.filter((s) => s.employeeId === emp.id).length;

            return (
              <div key={emp.id} className="contents group">
                {/* Employee name cell */}
                <div className="sticky left-0 z-10 border-b border-r border-slate-200 dark:border-neutral-700 px-2.5 py-2 flex items-center gap-2.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-[2px_0_8px_-4px_rgba(0,0,0,0.06)] dark:shadow-[2px_0_8px_-4px_rgba(0,0,0,0.25)]">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-[#1D4D8F] to-[#4C88C6]">
                    {emp.name.split(" ").pop()?.charAt(0) ?? emp.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate leading-tight">
                      {emp.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs text-slate-400 truncate leading-tight">{emp.role}</p>
                      {periodShiftCount > 0 && (
                        <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-neutral-600 px-1.5 py-0 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-neutral-800 flex-shrink-0">
                          {periodShiftCount} ca
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Day cells */}
                {dayStrings.map((dateStr, dayIdx) => {
                  const day = viewDays[dayIdx];
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const isToday = todayStr === dateStr;
                  return (
                    <ShiftCell
                      key={`${emp.id}-${dateStr}`}
                      employeeId={emp.id}
                      date={dateStr}
                      shifts={getShiftsFor(emp.id, dateStr)}
                      configs={configs}
                      isWeekend={isWeekend}
                      isToday={isToday}
                      disableAddShift={disableAddShift}
                      onAddShift={onAddShift}
                      onEditShift={onEditShift}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ── Summary footer row ── */}
        <ShiftSummaryRow
          weekDayStrings={dayStrings}
          shifts={shifts}
          configs={configs}
          todayStr={todayStr}
          viewMode={viewMode}
        />
      </div>

      <DragOverlay>
        {activeShift && (
          <ShiftChip
            shift={activeShift}
            config={configs.find((c) => c.id === activeShift.configId)}
            onClick={() => {}}
            isDragOverlay
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
