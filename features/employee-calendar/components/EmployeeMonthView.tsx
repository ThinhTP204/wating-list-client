import { cn } from "@/lib/utils";
import type { Shift, ShiftConfig } from "@/features/shifts/types";
import { DAY_NAMES, toISODate } from "@/features/employee-calendar/utils/date";

interface EmployeeMonthViewProps {
  monthCells: Array<Date | null>;
  shiftsByDate: Map<string, Shift[]>;
  configsMap: Map<string, ShiftConfig>;
  activeMonth: number;
}

export default function EmployeeMonthView({
  monthCells,
  shiftsByDate,
  configsMap,
  activeMonth,
}: EmployeeMonthViewProps) {
  const todayStr = toISODate(new Date());

  return (
    <div className="overflow-auto">
      <div className="grid min-w-[880px] grid-cols-7 gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1 dark:border-neutral-700 dark:bg-neutral-800">
        {DAY_NAMES.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {day}
          </div>
        ))}

        {monthCells.map((cell, index) => {
          if (!cell) {
            return <div key={`empty-${index}`} className="min-h-[120px] rounded-xl bg-white/40 dark:bg-neutral-900/40" />;
          }

          const isoDate = toISODate(cell);
          const isToday = isoDate === todayStr;
          const isOutsideMonth = cell.getMonth() !== activeMonth;
          const dayShifts = shiftsByDate.get(isoDate) ?? [];
          const previewShifts = dayShifts.slice(0, 2);

          return (
            <div
              key={isoDate}
              className={cn(
                "min-h-[120px] rounded-xl bg-white p-2 dark:bg-neutral-900",
                isToday && "ring-2 ring-brand-400/40",
                isOutsideMonth && "opacity-50"
              )}
            >
              <p className={cn("text-right text-xs font-bold", isToday ? "text-brand-700 dark:text-brand-300" : "text-slate-500 dark:text-slate-400")}>{cell.getDate()}</p>

              <div className="mt-2 space-y-1.5">
                {previewShifts.map((shift) => {
                  const config = configsMap.get(shift.configId);
                  return (
                    <div
                      key={shift.id}
                      className="truncate rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold dark:border-neutral-700"
                      style={{ borderLeftWidth: 3, borderLeftColor: config?.color }}
                      title={`${config?.name ?? "Ca"} ${config?.startTime ?? ""} - ${config?.endTime ?? ""}`}
                    >
                      {config?.name ?? "Ca"}
                    </div>
                  );
                })}

                {dayShifts.length > 2 && (
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">+{dayShifts.length - 2} ca</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
