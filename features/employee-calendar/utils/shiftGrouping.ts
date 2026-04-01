import type { Shift, ShiftConfig } from "@/features/shifts/types";
import type { CalendarStats } from "@/features/employee-calendar/types";

function getMinutes(config?: ShiftConfig): number {
  if (!config) {
    return 0;
  }

  const [startH, startM] = config.startTime.split(":").map(Number);
  const [endH, endM] = config.endTime.split(":").map(Number);
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;

  if (end >= start) {
    return end - start;
  }

  return 24 * 60 - start + end;
}

export function groupShiftsByDate(
  shifts: Shift[],
  configsMap: Map<string, ShiftConfig>
): Map<string, Shift[]> {
  const grouped = new Map<string, Shift[]>();

  for (const shift of shifts) {
    const current = grouped.get(shift.date) ?? [];
    current.push(shift);
    grouped.set(shift.date, current);
  }

  for (const [date, dayShifts] of grouped) {
    const sorted = [...dayShifts].sort((a, b) => {
      const minutesA = getMinutes(configsMap.get(a.configId));
      const minutesB = getMinutes(configsMap.get(b.configId));
      if (minutesA !== minutesB) {
        return minutesA - minutesB;
      }
      return a.configId.localeCompare(b.configId);
    });
    grouped.set(date, sorted);
  }

  return grouped;
}

export function deriveStats(shifts: Shift[]): CalendarStats {
  return {
    total: shifts.length,
    published: shifts.filter((shift) => shift.status === "published").length,
    draft: shifts.filter((shift) => shift.status === "draft").length,
    absent: shifts.filter((shift) => shift.status === "absent").length,
  };
}
