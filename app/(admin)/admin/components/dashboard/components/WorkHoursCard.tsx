"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp } from "lucide-react";

type FilterType = "1" | "3" | "7" | "30";

const HOURS_DATA: Record<FilterType, { hours: number; percent: number }> = {
  "1": { hours: 8, percent: 100 },
  "3": { hours: 24, percent: 96 },
  "7": { hours: 56, percent: 93 },
  "30": { hours: 220, percent: 91 },
};

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "1", label: "1 ngày" },
  { value: "3", label: "3 ngày" },
  { value: "7", label: "7 ngày" },
  { value: "30", label: "30 ngày" },
];

export default function WorkHoursCard() {
  const [filter, setFilter] = useState<FilterType>("7");
  const data = HOURS_DATA[filter];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Clock className="w-4 h-4 text-[#4C88C6]" />
          Tổng số giờ làm việc
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {/* Filter */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                filter === f.value
                  ? "bg-white dark:bg-neutral-700 text-[#102854] shadow-sm"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center py-4">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-4xl font-bold text-neutral-900 dark:text-white">{data.hours}</span>
            <span className="text-lg text-neutral-500">giờ</span>
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">{data.percent}%</span>
            <span className="text-xs text-neutral-500">so với kế hoạch</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Tiến độ</span>
            <span>{data.percent}%</span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#102854] to-[#4C88C6] rounded-full transition-all duration-500"
              style={{ width: `${data.percent}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
