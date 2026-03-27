"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, TrendingUp, TrendingDown } from "lucide-react";

type FilterType = "1" | "3" | "7" | "30";

const COMPLETION_DATA: Record<FilterType, { completed: number; total: number; trend: number }> = {
  "1": { completed: 8, total: 10, trend: 5 },
  "3": { completed: 22, total: 28, trend: 3 },
  "7": { completed: 48, total: 60, trend: -2 },
  "30": { completed: 185, total: 240, trend: 8 },
};

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "1", label: "1 ngày" },
  { value: "3", label: "3 ngày" },
  { value: "7", label: "7 ngày" },
  { value: "30", label: "30 ngày" },
];

export default function TaskCompletionCard() {
  const [filter, setFilter] = useState<FilterType>("7");
  const data = COMPLETION_DATA[filter];
  const percent = Math.round((data.completed / data.total) * 100);
  const isPositive = data.trend >= 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <CheckSquare className="w-4 h-4 text-[#4C88C6]" />
          % Công việc hoàn thành
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
            <span className="text-4xl font-bold text-neutral-900 dark:text-white">{percent}</span>
            <span className="text-lg text-neutral-500">%</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {data.completed}/{data.total} công việc
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? "+" : ""}{data.trend}%
            </span>
            <span className="text-xs text-neutral-500">so với kỳ trước</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Hoàn thành</span>
            <span>{percent}%</span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#102854] to-[#4C88C6] rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
