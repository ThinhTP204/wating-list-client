"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Clock, FileEdit, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shift, ShiftConfig } from "@/features/shifts/types";

interface ShiftChipProps {
  shift: Shift;
  config: ShiftConfig | undefined;
  onClick: (shift: Shift) => void;
  isDragOverlay?: boolean;
}

export default function ShiftChip({ shift, config, onClick, isDragOverlay = false }: ShiftChipProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: shift.id,
    data: { shift },
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;
  const chipColor = config?.color ?? "#4C88C6";

  const isDraft = shift.status === "draft";
  const isAbsent = shift.status === "absent";

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={{ ...style, borderLeftColor: chipColor }}
      {...(isDragOverlay ? {} : { ...listeners, ...attributes })}
      onClick={(e) => {
        e.stopPropagation();
        onClick(shift);
      }}
      title={`${config?.name ?? "Ca"} · ${config?.startTime}–${config?.endTime} · ${
        isDraft ? "Nháp" : isAbsent ? "Vắng" : "Đã công bố"
      }${shift.note ? ` · ${shift.note}` : ""}`}
      className={cn(
        "group flex flex-col gap-1 rounded-sm p-1.5 cursor-pointer select-none text-left w-full",
        "border-y border-r border-l-[3px] transition-all duration-200",
        isAbsent
          ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400"
          : isDraft
          ? "bg-slate-50 dark:bg-neutral-800/50 border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-slate-400"
          : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-200 shadow-sm",
        isDragging && "opacity-30",
        isDragOverlay && "shadow-2xl rotate-2 scale-105 z-50",
        "hover:border-slate-300 dark:hover:border-neutral-600 hover:shadow-md"
      )}
    >
      <div className="flex items-center justify-between w-full overflow-hidden gap-1">
        <span
          className={cn(
            "text-xs font-bold leading-none truncate flex-1",
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
}
