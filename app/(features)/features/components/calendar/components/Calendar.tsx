"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
} from "@dnd-kit/core";
import CalendarSidebar from "./CalendarSidebar";
import ShiftCard from "./ShiftCard";
import { Shift, ShiftType,  SHIFT_COLORS, CalendarView } from "./types";
import { Button } from "@/components/ui/button";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const WEEKDAYS_FULL = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getWeekDays(date: Date): Date[] {
  const result: Date[] = [];
  const day = date.getDay() || 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - day + 1);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    result.push(d);
  }
  return result;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = (firstDay.getDay() + 6) % 7;
  const days: (number | null)[] = [];
  for (let i = 0; i < startPadding; i++) days.push(null);
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);
  const totalCells = Math.ceil(days.length / 7) * 7;
  while (days.length < totalCells) days.push(null);
  return days;
}

function formatCellId(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function generateMockShifts(year: number, month: number): Shift[] {
  const shifts: Shift[] = [];
  const types: ShiftType[] = ["event", "trial", "interview", "leave", "birthday", "business"];
  const titles = ["Ca sáng", "Ca chiều", "Ca tối", "Ca full", "Ca nửa"];
  const employees = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"];

  for (let day = 1; day <= 15; day++) {
    const numShifts = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numShifts; j++) {
      const type = types[Math.floor(Math.random() * types.length)];
      shifts.push({
        id: `${formatCellId(year, month, day)}-shift-${j}`,
        title: titles[Math.floor(Math.random() * titles.length)],
        employee: employees[Math.floor(Math.random() * employees.length)],
        startTime: `${String(6 + j * 4).padStart(2, "0")}:00`,
        endTime: `${String(10 + j * 4).padStart(2, "0")}:00`,
        type,
      });
    }
  }
  return shifts;
}

export default function Calendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [shifts, setShifts] = useState<Shift[]>(() => generateMockShifts(today.getFullYear(), today.getMonth()));
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>("month");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

  const goPrevMonth = useCallback(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }, [viewMonth, viewYear]);

  const goNextMonth = useCallback(() => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }, [viewMonth, viewYear]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const shift = shifts.find(s => s.id === active.id);
    if (shift) setActiveShift(shift);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveShift(null);

    if (!over) return;

    const shiftId = active.id as string;
    const toCellId = over.id as string;

    // Extract date from toCellId (format: YYYY-MM-DD)
    const fromCellId = shifts.find(s => s.id === shiftId)?.id.split("-shift-")[0] || "";

    if (fromCellId !== toCellId) {
      setShifts(prev => {
        const newShifts = prev.map(s => {
          if (s.id === shiftId) {
            const newId = `${toCellId}-shift-${Date.now()}`;
            return { ...s, id: newId };
          }
          return s;
        });
        return newShifts;
      });
    }
  };

  const days = getMonthDays(viewYear, viewMonth);

  const getShiftsForDate = (year: number, month: number, day: number) => {
    const cellId = formatCellId(year, month, day);
    return shifts.filter(s => s.id.startsWith(cellId));
  };

  const getShiftsForDay = (day: number) => getShiftsForDate(viewYear, viewMonth, day);

  const viewDate = new Date(viewYear, viewMonth, selectedDate || today.getDate());
  const weekDays = getWeekDays(viewDate);
  const weekNum = getWeekNumber(viewDate);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-3.5rem)]">
        <CalendarSidebar
          viewYear={viewYear}
          viewMonth={viewMonth}
          selectedDate={selectedDate}
          onNavigate={(year: number, month: number) => { setViewYear(year); setViewMonth(month); }}
          onSelectDate={(day: number) => { setSelectedDate(day); }}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <div className="flex items-center gap-4">
              {currentView === "month" ? (
                <>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{monthNames[viewMonth]} {viewYear}</h2>
                  <div className="flex items-center gap-1">
                    <button onClick={goPrevMonth} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={goNextMonth} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </>
              ) : currentView === "day" ? (
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {WEEKDAYS_FULL[(today.getDay() + 6) % 7]}, {today.getDate()} {monthNames[today.getMonth()]} {today.getFullYear()}
                </h2>
              ) : (
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Tuần {weekNum}
                </h2>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                {(["month", "day", "week"] as CalendarView[]).map((view) => (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      currentView === view
                        ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    }`}
                  >
                    {view === "month" ? "Tháng" : view === "day" ? "Ngày" : "Tuần"}
                  </button>
                ))}
              </div>
              <Button variant="brand" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                + Thêm sự kiện
              </Button>
            </div>
          </div>

          {currentView === "month" && (
            <>
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                {WEEKDAYS.map((day, i) => (
                  <div key={day} className={`px-3 py-3 text-center text-sm font-semibold ${i === 6 ? "text-red-500" : "text-neutral-600 dark:text-neutral-400"}`}>
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar Cells */}
              <div className="flex-1 min-h-0 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="grid grid-cols-7 [grid-auto-rows:minmax(180px,auto)]">
                  {days.map((day, i) => {
                    const cellId = day ? formatCellId(viewYear, viewMonth, day) : `empty-${i}`;
                    const dayShifts = day ? getShiftsForDay(day) : [];
                    const isWeekend = i % 7 === 6;
                    const isToday = !!day && viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate();
                    const isSelected = !!day && day === selectedDate;
                    return (
                      <CalendarCell key={cellId} cellId={cellId} day={day} shifts={dayShifts} isWeekend={isWeekend} isToday={isToday} isSelected={isSelected} />
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {currentView === "day" && (
            <DayView today={today} currentTime={currentTime} getShiftsForDate={getShiftsForDate} />
          )}

          {currentView === "week" && (
            <WeekView weekDays={weekDays} today={today} currentTime={currentTime} getShiftsForDate={getShiftsForDate} />
          )}
        </div>
      </div>

      <DragOverlay>
        {activeShift && <ShiftCard shift={activeShift} cellId="" isDragOverlay />}
      </DragOverlay>
    </DndContext>
  );
}

function CalendarCell({ cellId, day, shifts, isWeekend, isToday, isSelected }: { cellId: string; day: number | null; shifts: Shift[]; isWeekend: boolean; isToday: boolean; isSelected: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: cellId });

  return (
    <div
      ref={setNodeRef}
      className={`
        border-b border-r border-neutral-200 dark:border-neutral-800 p-2 transition-colors
        ${isWeekend ? "bg-neutral-50/50 dark:bg-neutral-900/30" : "bg-white dark:bg-neutral-950"}
        ${isToday ? "bg-blue-50/30 dark:bg-blue-950/10" : ""}
        ${isSelected && !isToday ? "bg-blue-50/40 dark:bg-blue-950/10 ring-1 ring-inset ring-blue-300 dark:ring-blue-700" : ""}
        ${isOver ? "bg-blue-100/50 dark:bg-blue-900/20" : ""}
      `}
    >
      {day && (
        <>
          <div className={`
            w-7 h-7 flex items-center justify-center rounded-full text-sm mb-2
            ${isToday
              ? "bg-gradient-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] text-white font-bold shadow-md"
              : isSelected
                ? "ring-2 ring-blue-400 text-blue-600 dark:text-blue-400 font-bold"
                : isWeekend
                  ? "text-red-500 font-medium"
                  : "text-neutral-700 dark:text-neutral-300 font-medium"
            }
          `}>
            {day}
          </div>
          <div className="space-y-1.5">
            {shifts.map(shift => (
              <ShiftCard key={shift.id} shift={shift} cellId={cellId} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DayView({ today, currentTime, getShiftsForDate }: { today: Date; currentTime: Date; getShiftsForDate: (year: number, month: number, day: number) => Shift[] }) {
  const hourHeight = 60;
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(0, currentHour * hourHeight - 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dayShifts = getShiftsForDate(today.getFullYear(), today.getMonth(), today.getDate());
  const getTop = (time: string) => { const [h, m] = time.split(":").map(Number); return (h + m / 60) * hourHeight; };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Day header */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="w-16 flex-shrink-0" />
        <div className="flex-1 py-3 text-center border-l border-neutral-200 dark:border-neutral-800">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{WEEKDAYS_FULL[(today.getDay() + 6) % 7]}</div>
          <div className="w-9 h-9 mx-auto mt-1 flex items-center justify-center rounded-full bg-gradient-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] text-white text-lg font-bold">
            {today.getDate()}
          </div>
        </div>
      </div>
      {/* Time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex" style={{ height: 24 * hourHeight }}>
          <div className="w-16 flex-shrink-0 relative border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            {HOURS.filter(h => h >= 1 && h <= 23).map(hour => (
              <div key={hour} className="absolute right-2 text-xs text-neutral-400 dark:text-neutral-500" style={{ top: hour * hourHeight - 8 }}>
                {hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          <div className="flex-1 relative bg-white dark:bg-neutral-950">
            {HOURS.filter(h => h >= 1 && h <= 23).map(hour => (
              <div key={hour} className="absolute left-0 right-0 border-t border-neutral-100 dark:border-neutral-800" style={{ top: hour * hourHeight }} />
            ))}
            <div className="absolute left-0 right-0 flex items-center z-10" style={{ top: currentHour * hourHeight }}>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5 flex-shrink-0" />
              <div className="flex-1 h-px bg-red-500" />
              <span className="absolute -top-3 left-0 text-[10px] font-semibold text-red-500 bg-white dark:bg-neutral-950 px-0.5 leading-none">
                {currentTime.getHours().toString().padStart(2, "0")}:{currentTime.getMinutes().toString().padStart(2, "0")}
              </span>
            </div>
            {dayShifts.map(shift => {
              const top = getTop(shift.startTime);
              const height = Math.max(getTop(shift.endTime) - top, 28);
              const c = SHIFT_COLORS[shift.type];
              return (
                <div key={shift.id} className={`absolute left-1 right-1 rounded-lg px-2 py-1 ${c.bg} ${c.text} border ${c.border} overflow-hidden`} style={{ top, height }}>
                  <div className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} /><span className="text-xs font-semibold truncate">{shift.title}</span></div>
                  <div className="text-[10px] opacity-70 pl-3">{shift.startTime} – {shift.endTime}</div>
                  <div className="text-[10px] opacity-60 pl-3 truncate">{shift.employee}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeekView({ weekDays, today, currentTime, getShiftsForDate }: { weekDays: Date[]; today: Date; currentTime: Date; getShiftsForDate: (year: number, month: number, day: number) => Shift[] }) {
  const hourHeight = 60;
  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = Math.max(0, currentHour * hourHeight - 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTodayDate = (d: Date) => d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  const getTop = (time: string) => { const [h, m] = time.split(":").map(Number); return (h + m / 60) * hourHeight; };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Week header */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="w-16 flex-shrink-0" />
        {weekDays.map((date, i) => (
          <div key={i} className={`flex-1 py-3 text-center border-l border-neutral-200 dark:border-neutral-800 ${isTodayDate(date) ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
            <div className={`text-xs font-medium ${i === 6 ? "text-red-500" : "text-neutral-500 dark:text-neutral-400"}`}>{WEEKDAYS_FULL[i]}</div>
            <div className={`text-lg font-bold mt-1 ${isTodayDate(date) ? "w-9 h-9 mx-auto flex items-center justify-center rounded-full bg-gradient-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] text-white" : "text-neutral-900 dark:text-white"}`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
      {/* Time grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex relative" style={{ height: 24 * hourHeight }}>
          <div className="w-16 flex-shrink-0 relative border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            {HOURS.filter(h => h >= 1 && h <= 23).map(hour => (
              <div key={hour} className="absolute right-2 text-xs text-neutral-400 dark:text-neutral-500" style={{ top: hour * hourHeight - 8 }}>
                {hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          {weekDays.map((date, dayIdx) => {
            const dayShifts = getShiftsForDate(date.getFullYear(), date.getMonth(), date.getDate());
            const isCurrentDay = isTodayDate(date);
            return (
              <div key={dayIdx} className={`flex-1 relative border-l border-neutral-200 dark:border-neutral-800 ${isCurrentDay ? "bg-blue-50/20 dark:bg-blue-950/10" : "bg-white dark:bg-neutral-950"}`}>
                {HOURS.filter(h => h >= 1 && h <= 23).map(hour => (
                  <div key={hour} className="absolute left-0 right-0 border-t border-neutral-100 dark:border-neutral-800" style={{ top: hour * hourHeight }} />
                ))}
                {dayShifts.map(shift => {
                  const top = getTop(shift.startTime);
                  const height = Math.max(getTop(shift.endTime) - top, 24);
                  const c = SHIFT_COLORS[shift.type];
                  return (
                    <div key={shift.id} className={`absolute left-0.5 right-0.5 rounded-md px-1.5 py-1 ${c.bg} ${c.text} border ${c.border} overflow-hidden`} style={{ top, height }}>
                      <div className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} /><span className="text-[10px] font-semibold truncate">{shift.title}</span></div>
                      <div className="text-[9px] opacity-70 pl-3">{shift.startTime}-{shift.endTime}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {/* Current time indicator spanning all columns */}
          <div className="absolute flex items-center z-10 pointer-events-none" style={{ top: currentHour * hourHeight, left: 64, right: 0 }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5 flex-shrink-0" />
            <div className="flex-1 h-px bg-red-500" />
            <span className="absolute -top-3 left-0 text-[10px] font-semibold text-red-500 bg-white dark:bg-neutral-950 px-0.5 leading-none">
              {currentTime.getHours().toString().padStart(2, "0")}:{currentTime.getMinutes().toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
