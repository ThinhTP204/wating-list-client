"use client";

import type { ShiftConfig } from "@/features/shifts/types";

interface ShiftLegendProps {
  configs: ShiftConfig[];
}

export default function ShiftLegend({ configs }: ShiftLegendProps) {
  if (configs.length === 0) return null;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {configs.map((config) => (
        <div key={config.id} className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {config.name}
            <span className="ml-1 text-slate-400 dark:text-slate-500">
              {config.startTime}–{config.endTime}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
