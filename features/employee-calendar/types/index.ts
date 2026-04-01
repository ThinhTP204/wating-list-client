import type { Shift, ShiftConfig } from "@/features/shifts/types";

export type CalendarViewMode = "week" | "month";

export interface CalendarStats {
  total: number;
  published: number;
  draft: number;
  absent: number;
}

export interface EmployeeCalendarModel {
  viewMode: CalendarViewMode;
  setViewMode: (mode: CalendarViewMode) => void;
  baseDate: Date;
  weekDays: Date[];
  monthCells: Array<Date | null>;
  currentMonthLabel: string;
  currentWeekLabel: string;
  shiftsByDate: Map<string, Shift[]>;
  configsMap: Map<string, ShiftConfig>;
  stats: CalendarStats;
  isLoading: boolean;
  isError: boolean;
  goPrev: () => void;
  goNext: () => void;
  goToday: () => void;
}
