"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmployeeCalendarHeader from "@/features/employee-calendar/components/EmployeeCalendarHeader";
import EmployeeMonthView from "@/features/employee-calendar/components/EmployeeMonthView";
import EmployeeWeekView from "@/features/employee-calendar/components/EmployeeWeekView";
import { useEmployeeCalendarModel } from "@/features/employee-calendar/hooks/useEmployeeCalendarModel";

function EmployeeCalendarSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-28 rounded-2xl" />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-52 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default function EmployeeCalendarPage() {
  const model = useEmployeeCalendarModel();

  if (model.isLoading) {
    return (
      <div className="h-full bg-brand-tint p-4 sm:p-6">
        <EmployeeCalendarSkeleton />
      </div>
    );
  }

  if (model.isError) {
    return (
      <div className="h-full bg-brand-tint p-4 sm:p-6">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-red-300 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/20">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <p className="mt-3 text-card-title text-red-700 dark:text-red-300">
            Khong tai duoc lich ca
          </p>
          <p className="mt-1 text-body text-red-600 dark:text-red-400">
            Vui long thu lai sau it phut.
          </p>
          <Button onClick={model.goToday} className="mt-4">
            Ve hom nay
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-brand-tint p-4 sm:p-6">
      <div className="space-y-4">
        <EmployeeCalendarHeader
          monthLabel={model.currentMonthLabel}
          weekLabel={model.currentWeekLabel}
          viewMode={model.viewMode}
          stats={model.stats}
          onChangeViewMode={model.setViewMode}
          onPrev={model.goPrev}
          onNext={model.goNext}
          onToday={model.goToday}
        />

        {model.viewMode === "week" ? (
          <EmployeeWeekView
            weekDays={model.weekDays}
            shiftsByDate={model.shiftsByDate}
            configsMap={model.configsMap}
          />
        ) : (
          <EmployeeMonthView
            monthCells={model.monthCells}
            shiftsByDate={model.shiftsByDate}
            configsMap={model.configsMap}
            activeMonth={model.baseDate.getMonth()}
          />
        )}
      </div>
    </div>
  );
}
