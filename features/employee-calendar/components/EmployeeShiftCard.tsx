import { AlertCircle, Clock, FileEdit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  EMPLOYEE_SHIFT_ATTENDANCE_STATUS_META,
  type Shift,
  type ShiftConfig,
} from "@/features/shifts/types";

interface EmployeeShiftCardProps {
  shift: Shift;
  config?: ShiftConfig;
  compact?: boolean;
}

export default function EmployeeShiftCard({
  shift,
  config,
  compact = false,
}: EmployeeShiftCardProps) {
  const isDraft = shift.status === "draft";
  const isAbsent = shift.status === "absent";

  const fallbackStatusLabel = isAbsent ? "Vắng" : isDraft ? "Nháp" : "Đã chốt";
  const fallbackStatusClass = isAbsent
    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
    : isDraft
      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300";

  const attendanceMeta = shift.attendanceStatus
    ? EMPLOYEE_SHIFT_ATTENDANCE_STATUS_META[shift.attendanceStatus]
    : null;

  const statusLabel = attendanceMeta?.label ?? fallbackStatusLabel;
  const statusClass = attendanceMeta?.badgeClass ?? fallbackStatusClass;

  return (
    <div
      className={cn(
        "rounded-xl border border-l-4 transition",
        compact ? "p-2" : "p-2.5",
        isAbsent
          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/70 dark:bg-red-950/30 dark:text-red-300"
          : isDraft
            ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300"
            : "border-slate-200 bg-white text-slate-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-slate-100"
      )}
      style={{ borderLeftColor: isAbsent ? undefined : config?.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            className={cn(
              compact ? "text-xs" : "text-body",
              "font-semibold",
              isAbsent && "line-through"
            )}
          >
            {config?.name ?? "Ca"}
          </p>

          <p className={cn("mt-1 flex items-center gap-1 text-meta", compact && "text-xs")}>
            <Clock className="h-3 w-3" />
            {config ? `${config.startTime} - ${config.endTime}` : "Dang cap nhat"}
          </p>

          {shift.note ? (
            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{shift.note}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {isDraft && <FileEdit className="h-3.5 w-3.5 opacity-70" />}
          {isAbsent && <AlertCircle className="h-3.5 w-3.5" />}
          <Badge variant="outline" className={cn("border text-[10px] font-semibold", statusClass)}>
            {statusLabel}
          </Badge>
        </div>
      </div>
    </div>
  );
}
