import { AlertCircle, Clock, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shift, ShiftConfig } from "@/features/shifts/types";

interface EmployeeShiftCardProps {
  shift: Shift;
  config?: ShiftConfig;
}

export default function EmployeeShiftCard({ shift, config }: EmployeeShiftCardProps) {
  const isDraft = shift.status === "draft";
  const isAbsent = shift.status === "absent";

  return (
    <div
      className={cn(
        "rounded-xl border border-l-4 p-2.5 transition",
        isAbsent
          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300"
          : isDraft
          ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300"
          : "border-slate-200 bg-white text-slate-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-100"
      )}
      style={{ borderLeftColor: isAbsent ? undefined : config?.color }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={cn("text-body font-semibold", isAbsent && "line-through")}>{config?.name ?? "Ca"}</p>
        {isDraft && <FileEdit className="h-3.5 w-3.5 opacity-70" />}
        {isAbsent && <AlertCircle className="h-3.5 w-3.5" />}
      </div>

      <p className="mt-1 flex items-center gap-1 text-meta">
        <Clock className="h-3 w-3" />
        {config ? `${config.startTime} - ${config.endTime}` : "Dang cap nhat"}
      </p>
    </div>
  );
}
