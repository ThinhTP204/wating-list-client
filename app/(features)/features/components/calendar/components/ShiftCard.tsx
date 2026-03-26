"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Shift, SHIFT_COLORS } from "./types";

interface ShiftCardProps {
  shift: Shift;
  cellId: string;
  isDragOverlay?: boolean;
}

export default function ShiftCard({ shift, cellId, isDragOverlay = false }: ShiftCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: shift.id,
    data: { shift, cellId },
  });

  const style = isDragOverlay
    ? {}
    : { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.3 : 1 };

  const c = SHIFT_COLORS[shift.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        ${c.bg} ${c.text} border ${c.border}
        rounded-md px-2 py-1.5 mb-1 cursor-grab active:cursor-grabbing select-none
        transition-all duration-150 hover:shadow-sm
        ${isDragOverlay ? "shadow-xl rotate-1 scale-105" : ""}
      `}
    >
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
        <span className="text-xs font-semibold truncate leading-tight">{shift.title}</span>
      </div>
      <div className="text-xs opacity-70 mt-0.5 pl-3">{shift.startTime} – {shift.endTime}</div>
      <div className="text-xs opacity-60 pl-3 truncate">{shift.employee}</div>
    </div>
  );
}
