import { useMemo, useState } from "react";
import { useShiftsByEmployee, useShiftConfigs } from "@/features/shifts/hooks/useShifts";
import type { ShiftConfig } from "@/features/shifts/types";
import type { CalendarViewMode, EmployeeCalendarModel } from "@/features/employee-calendar/types";
import {
  addDays,
  buildMonthGrid,
  formatMonthYear,
  formatWeekRangeLabel,
  getMonday,
  toISODate,
} from "@/features/employee-calendar/utils/date";
import { deriveStats, groupShiftsByDate } from "@/features/employee-calendar/utils/shiftGrouping";

const DEMO_EMPLOYEE_ID = "emp-01";

export function useEmployeeCalendarModel(): EmployeeCalendarModel {
  const [viewMode, setViewMode] = useState<CalendarViewMode>("week");
  const [baseDate, setBaseDate] = useState<Date>(() => new Date());

  const fetchRange = useMemo(() => {
    if (viewMode === "week") {
      const monday = getMonday(baseDate);
      return {
        start: toISODate(monday),
        end: toISODate(addDays(monday, 6)),
      };
    }

    const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const monthEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
    return {
      start: toISODate(addDays(monthStart, -7)),
      end: toISODate(addDays(monthEnd, 7)),
    };
  }, [baseDate, viewMode]);

  const { data: shifts = [], isLoading: shiftsLoading, isError: shiftsError } = useShiftsByEmployee(
    DEMO_EMPLOYEE_ID,
    fetchRange.start,
    fetchRange.end,
    true
  );
  const { data: configs = [], isLoading: configsLoading, isError: configsError } = useShiftConfigs();

  const configsMap = useMemo(
    () => new Map<string, ShiftConfig>(configs.map((config) => [config.id, config])),
    [configs]
  );

  const shiftsByDate = useMemo(() => groupShiftsByDate(shifts, configsMap), [shifts, configsMap]);

  const weekDays = useMemo(() => {
    const monday = getMonday(baseDate);
    return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
  }, [baseDate]);

  const monthCells = useMemo(
    () => buildMonthGrid(baseDate.getFullYear(), baseDate.getMonth()),
    [baseDate]
  );

  const activeShifts = useMemo(() => {
    if (viewMode === "week") {
      const weekIso = new Set(weekDays.map((day) => toISODate(day)));
      return shifts.filter((shift) => weekIso.has(shift.date));
    }

    const currentMonth = baseDate.getMonth();
    const currentYear = baseDate.getFullYear();
    return shifts.filter((shift) => {
      const date = new Date(shift.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  }, [baseDate, shifts, viewMode, weekDays]);

  const stats = useMemo(() => deriveStats(activeShifts), [activeShifts]);

  function goPrev() {
    if (viewMode === "week") {
      setBaseDate((prev) => addDays(prev, -7));
      return;
    }

    setBaseDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
  }

  function goNext() {
    if (viewMode === "week") {
      setBaseDate((prev) => addDays(prev, 7));
      return;
    }

    setBaseDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
  }

  function goToday() {
    setBaseDate(new Date());
  }

  return {
    viewMode,
    setViewMode,
    baseDate,
    weekDays,
    monthCells,
    currentMonthLabel: formatMonthYear(baseDate),
    currentWeekLabel: formatWeekRangeLabel(baseDate),
    shiftsByDate,
    configsMap,
    stats,
    isLoading: shiftsLoading || configsLoading,
    isError: shiftsError || configsError,
    goPrev,
    goNext,
    goToday,
  };
}
