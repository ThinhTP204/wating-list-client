import { cn } from "@/lib/utils";
import type { Shift, ShiftConfig } from "@/features/shifts/types";
import { toISODate } from "@/features/employee-calendar/utils/date";
import EmployeeShiftCard from "@/features/employee-calendar/components/EmployeeShiftCard";

function getFullDayName(day: Date): string {
  const dayIndex = day.getDay();
  if (dayIndex === 0) {
    return "Chủ nhật";
  }
  return `Thứ ${dayIndex + 1}`;
}

interface EmployeeWeekViewProps {
  weekDays: Date[];
  shiftsByDate: Map<string, Shift[]>;
  configsMap: Map<string, ShiftConfig>;
}

export default function EmployeeWeekView({
  weekDays,
  shiftsByDate,
  configsMap,
}: EmployeeWeekViewProps) {
  const todayStr = toISODate(new Date());

  return (
    <div className="space-y-3">
      <div className="sm:hidden">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {weekDays.map((day) => {
            const isoDate = toISODate(day);
            const dayShifts = shiftsByDate.get(isoDate) ?? [];
            const isToday = isoDate === todayStr;
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={`mobile-${isoDate}`}
                className={cn(
                  "min-h-90 w-[88%] min-w-[88%] snap-center rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900",
                  isWeekend && "bg-slate-50 dark:bg-neutral-900",
                  isToday && "ring-2 ring-brand-400/50"
                )}
              >
                <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-neutral-800/70">
                  <p
                    className={cn(
                      "text-xs font-bold",
                      isWeekend ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    {getFullDayName(day)}
                  </p>
                  <p
                    className={cn(
                      "text-xl font-black",
                      isToday
                        ? "text-brand-700 dark:text-brand-300"
                        : "text-slate-800 dark:text-slate-100"
                    )}
                  >
                    {day.getDate()}/{day.getMonth() + 1}
                  </p>
                </div>

                <div className="space-y-2">
                  {dayShifts.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-3 text-center text-meta dark:border-neutral-700">
                      Chưa có ca
                    </div>
                  ) : (
                    dayShifts.map((shift) => (
                      <EmployeeShiftCard
                        key={shift.id}
                        shift={shift}
                        config={configsMap.get(shift.configId)}
                        compact
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="px-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Vuot ngang de xem lich tung ngay trong tuan.
        </p>
      </div>

      <div className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        {weekDays.map((day) => {
          const isoDate = toISODate(day);
          const dayShifts = shiftsByDate.get(isoDate) ?? [];
          const isToday = isoDate === todayStr;
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <div
              key={`desktop-${isoDate}`}
              className={cn(
                "rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-neutral-700/70 dark:bg-neutral-900",
                isWeekend && "bg-slate-50 dark:bg-neutral-900",
                isToday && "ring-2 ring-brand-400/50"
              )}
            >
              <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-neutral-800/70">
                <p
                  className={cn(
                    "text-xs font-bold",
                    isWeekend ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  {getFullDayName(day)}
                </p>
                <p
                  className={cn(
                    "text-xl font-black",
                    isToday
                      ? "text-brand-700 dark:text-brand-300"
                      : "text-slate-800 dark:text-slate-100"
                  )}
                >
                  {day.getDate()}/{day.getMonth() + 1}
                </p>
              </div>

              <div className="space-y-2">
                {dayShifts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 p-3 text-center text-meta dark:border-neutral-700">
                    Chưa có ca
                  </div>
                ) : (
                  dayShifts.map((shift) => (
                    <EmployeeShiftCard
                      key={shift.id}
                      shift={shift}
                      config={configsMap.get(shift.configId)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
