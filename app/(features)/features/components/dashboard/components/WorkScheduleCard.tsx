"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

const SCHEDULE_DATA = [
  { day: "T2", shift: "Ca sáng", time: "07:00 - 15:00", active: true },
  { day: "T3", shift: "Ca sáng", time: "07:00 - 15:00", active: true },
  { day: "T4", shift: "Ca chiều", time: "13:00 - 21:00", active: true },
  { day: "T5", shift: "Ca chiều", time: "13:00 - 21:00", active: true },
  { day: "T6", shift: "Ca tối", time: "21:00 - 05:00", active: true },
  { day: "T7", shift: "Nghỉ", time: "—", active: false },
  { day: "CN", shift: "Nghỉ", time: "—", active: false },
];

const SHIFT_COLORS: Record<string, string> = {
  "Ca sáng": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Ca chiều": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Ca tối": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  "Nghỉ": "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500",
};

export default function WorkScheduleCard() {
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <CalendarDays className="w-4 h-4 text-[#4C88C6]" />
          Lịch làm việc tuần này
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-7 gap-1.5">
          {SCHEDULE_DATA.map((item, i) => (
            <div
              key={item.day}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                i === todayIndex
                  ? "border-[#4C88C6] bg-[#EEF6FB] dark:bg-[#0B1E3D]/40 shadow-sm"
                  : "border-transparent bg-neutral-50 dark:bg-neutral-800/50"
              }`}
            >
              <span
                className={`text-xs font-bold ${
                  i === todayIndex ? "text-[#102854] dark:text-[#6AAED9]" : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {item.day}
              </span>
              <div className={`w-full text-center px-1 py-0.5 rounded-md text-xs font-medium ${SHIFT_COLORS[item.shift]}`}>
                {item.shift}
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 text-center leading-tight">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
