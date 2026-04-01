"use client";

import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shift, ShiftConfig } from "@/features/shifts/types";
import ShiftChip from "./ShiftChip";

interface ShiftCellProps {
  employeeId: string;
  date: string; // "YYYY-MM-DD"
  shifts: Shift[];
  configs: ShiftConfig[];
  isWeekend: boolean;
  isToday: boolean;
  disableAddShift?: boolean;
  onAddShift: (employeeId: string, date: string) => void;
  onEditShift: (shift: Shift) => void;
}

export default function ShiftCell({
  employeeId,
  date,
  shifts,
  configs,
  isWeekend,
  isToday,
  disableAddShift,
  onAddShift,
  onEditShift,
}: ShiftCellProps) {
  const droppableId = `${employeeId}::${date}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId, data: { employeeId, date } });

  return (
    <div
      ref={setNodeRef}
      onClick={() => {
        if (!disableAddShift) {
          onAddShift(employeeId, date);
        }
      }}
      className={cn(
        "group relative min-h-[68px] p-1.5 border-b border-r border-slate-100 dark:border-neutral-800",
        "transition-all duration-150 cursor-pointer flex flex-col gap-1.5",
        isWeekend && "bg-slate-50/50 dark:bg-neutral-900/50",
        isToday && "bg-blue-50/30 dark:bg-blue-950/10",
        isOver && "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-inset ring-blue-400",
        "hover:bg-slate-50 dark:hover:bg-neutral-800/40",
        disableAddShift && "cursor-default"
      )}
    >
      {/* Dashed Hover Overlay */}
      <div className="absolute inset-1 pointer-events-none rounded border-2 border-dashed border-transparent transition-colors duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-700/60 z-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
        {!disableAddShift && shifts.length === 0 && (
          <Plus className="w-5 h-5 text-blue-400 scale-90 group-hover:scale-110 transition-transform duration-200" />
        )}
      </div>

      <div className="flex flex-col gap-1 z-10 w-full relative">
        {[...shifts]
          .sort((a, b) => {
            const timeA = configs.find((c) => c.id === a.configId)?.startTime ?? "00:00";
            const timeB = configs.find((c) => c.id === b.configId)?.startTime ?? "00:00";
            return timeA.localeCompare(timeB);
          })
          .map((shift) => (
            <ShiftChip
              key={shift.id}
              shift={shift}
              config={configs.find((c) => c.id === shift.configId)}
              onClick={onEditShift}
            />
          ))}
      </div>
    </div>
  );
}
