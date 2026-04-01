import { cn } from "@/lib/utils";
import {
  EMPLOYEE_SHIFT_ATTENDANCE_STATUS_META,
  type Shift,
  type ShiftConfig,
} from "@/features/shifts/types";
import { DAY_NAMES, toISODate } from "@/features/employee-calendar/utils/date";

function getStatusLabel(shift: Shift): string {
  if (shift.attendanceStatus) {
    return EMPLOYEE_SHIFT_ATTENDANCE_STATUS_META[shift.attendanceStatus].label;
  }
  if (shift.status === "absent") {
    return "Vắng";
  }
  if (shift.status === "draft") {
    return "Nháp";
  }
  return "Đã chốt";
}

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
  const mobileWeeks = Array.from({ length: Math.ceil(monthCells.length / 7) }, (_, index) =>
    monthCells.slice(index * 7, index * 7 + 7)
  );

  return (
    <div className="space-y-3">
      <div className="space-y-2 sm:hidden">
        {mobileWeeks.map((weekCells, weekIndex) => {
          const daysInActiveMonth = weekCells.filter(
            (cell): cell is Date => !!cell && cell.getMonth() === activeMonth
          );

          if (daysInActiveMonth.length === 0) {
            return null;
          }

          return (
            <div
              key={`week-${weekIndex}`}
              className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Tuan {weekIndex + 1}
              </p>

              <div className="space-y-2">
                {daysInActiveMonth.map((cell) => {
                  const isoDate = toISODate(cell);
                  const dayShifts = shiftsByDate.get(isoDate) ?? [];
                  const isToday = isoDate === todayStr;
                  const dayName = DAY_NAMES[cell.getDay() === 0 ? 6 : cell.getDay() - 1];

                  return (
                    <div
                      key={`mobile-${isoDate}`}
                      className={cn(
                        "rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-neutral-700 dark:bg-neutral-800/40",
                        isToday && "ring-2 ring-brand-400/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {dayName}, {cell.getDate()}/{cell.getMonth() + 1}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {dayShifts.length} ca
                        </p>
                      </div>

                      <div className="mt-2 space-y-1.5">
                        {dayShifts.length === 0 ? (
                          <p className="rounded-lg border border-dashed border-slate-200 px-2 py-1.5 text-xs text-slate-500 dark:border-neutral-700 dark:text-slate-400">
                            Chua co ca
                          </p>
                        ) : (
                          dayShifts.slice(0, 2).map((shift) => {
                            const config = configsMap.get(shift.configId);
                            return (
                              <div
                                key={shift.id}
                                className="truncate rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold dark:border-neutral-700 dark:bg-neutral-900"
                                style={{ borderLeftWidth: 3, borderLeftColor: config?.color }}
                                title={`${config?.name ?? "Ca"} ${config?.startTime ?? ""} - ${config?.endTime ?? ""}`}
                              >
                                <span className="block truncate">{config?.name ?? "Ca"}</span>
                                <span className="block truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                                  {getStatusLabel(shift)}
                                </span>
                              </div>
                            );
                          })
                        )}

                        {dayShifts.length > 2 && (
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            +{dayShifts.length - 2} ca
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-auto sm:block">
        <div className="grid min-w-190 grid-cols-7 gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              {day}
            </div>
          ))}

          {monthCells.map((cell, index) => {
            if (!cell) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-30 rounded-xl bg-white/40 dark:bg-neutral-900/40"
                />
              );
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
                  "min-h-30 rounded-xl bg-white p-2 dark:bg-neutral-900",
                  isToday && "ring-2 ring-brand-400/40",
                  isOutsideMonth && "opacity-50"
                )}
              >
                <p
                  className={cn(
                    "text-right text-xs font-bold",
                    isToday
                      ? "text-brand-700 dark:text-brand-300"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {cell.getDate()}
                </p>

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
                        <span className="block truncate">{config?.name ?? "Ca"}</span>
                        <span className="block truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                          {getStatusLabel(shift)}
                        </span>
                      </div>
                    );
                  })}

                  {dayShifts.length > 2 && (
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      +{dayShifts.length - 2} ca
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
