import { cn } from "@/lib/utils";
import type { Shift, ShiftConfig } from "@/features/shifts/types";
import { DAY_NAMES, toISODate } from "@/features/employee-calendar/utils/date";
import EmployeeShiftCard from "@/features/employee-calendar/components/EmployeeShiftCard";

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
    <div className="space-y-2">
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
                  "min-h-[360px] w-[84%] min-w-[84%] snap-center rounded-2xl border border-slate-200/70 bg-white/90 p-3 dark:border-neutral-700/70 dark:bg-neutral-900/80",
                  isWeekend && "bg-slate-50 dark:bg-neutral-900",
                  isToday && "ring-2 ring-brand-400/40"
                )}
              >
                <div className="mb-3 text-center">
                  <p
                    className={cn(
                      "text-xs font-bold uppercase tracking-wide",
                      isWeekend ? "text-slate-400" : "text-slate-500"
                    )}
                  >
                    {DAY_NAMES[day.getDay() === 0 ? 6 : day.getDay() - 1]}
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-black",
                      isToday
                        ? "text-brand-700 dark:text-brand-300"
                        : "text-slate-800 dark:text-slate-100"
                    )}
                  >
                    {day.getDate()}
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
        <p className="px-1 text-xs text-slate-500 dark:text-slate-400">
          Vuot ngang de xem cac ngay trong tuan.
        </p>
      </div>

      <div className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2 xl:grid-cols-7">
        {weekDays.map((day) => {
          const isoDate = toISODate(day);
          const dayShifts = shiftsByDate.get(isoDate) ?? [];
          const isToday = isoDate === todayStr;
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <div
              key={`desktop-${isoDate}`}
              className={cn(
                "rounded-2xl border border-slate-200/70 bg-white/90 p-3 dark:border-neutral-700/70 dark:bg-neutral-900/80",
                isWeekend && "bg-slate-50 dark:bg-neutral-900",
                isToday && "ring-2 ring-brand-400/40"
              )}
            >
              <div className="mb-3 text-center">
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-wide",
                    isWeekend ? "text-slate-400" : "text-slate-500"
                  )}
                >
                  {DAY_NAMES[day.getDay() === 0 ? 6 : day.getDay() - 1]}
                </p>
                <p
                  className={cn(
                    "text-2xl font-black",
                    isToday
                      ? "text-brand-700 dark:text-brand-300"
                      : "text-slate-800 dark:text-slate-100"
                  )}
                >
                  {day.getDate()}
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
