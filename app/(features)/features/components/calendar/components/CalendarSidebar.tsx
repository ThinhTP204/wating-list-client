"use client";

import { useState } from "react";
import { LABEL_META, ShiftType } from "./types";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = (firstDay.getDay() + 6) % 7;
  const days: (number | null)[] = [];
  for (let i = 0; i < startPadding; i++) days.push(null);
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(i);
  return days;
}

interface CalendarSidebarProps {
  viewYear: number;
  viewMonth: number;
  selectedDate: number | null;
  onNavigate: (year: number, month: number) => void;
  onSelectDate: (day: number) => void;
}

export default function CalendarSidebar({ viewYear, viewMonth, selectedDate, onNavigate, onSelectDate }: CalendarSidebarProps) {
  const today = new Date();
  const [activeFilters, setActiveFilters] = useState<Set<ShiftType>>(
    new Set(["event", "trial", "interview", "leave", "birthday", "business"])
  );

  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  const days = getMonthData(viewYear, viewMonth);

  const toggleFilter = (type: ShiftType) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(type)) newFilters.delete(type);
    else newFilters.add(type);
    setActiveFilters(newFilters);
  };

  const goPrevMonth = () => {
    if (viewMonth === 0) onNavigate(viewYear - 1, 11);
    else onNavigate(viewYear, viewMonth - 1);
  };

  const goNextMonth = () => {
    if (viewMonth === 11) onNavigate(viewYear + 1, 0);
    else onNavigate(viewYear, viewMonth + 1);
  };

  const handleSelectDate = (day: number) => {
    onSelectDate(day);
    onNavigate(viewYear, viewMonth);
  };

  return (
    <aside className="w-72 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 flex flex-col gap-6">
      {/* Mini Calendar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button onClick={goPrevMonth} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-sm font-semibold">{monthNames[viewMonth]} {viewYear}</span>
          <button onClick={goNextMonth} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-[10px] font-medium text-neutral-400 py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
            const isSelected = day === selectedDate;
            return (
              <button
                key={i}
                disabled={!day}
                onClick={() => day && handleSelectDate(day)}
                className={`
                  aspect-square text-xs rounded-lg flex items-center justify-center transition-all
                  ${!day ? "invisible" : ""}
                  ${isSelected ? "bg-gradient-to-r from-[#402093] via-[#8f58e4] to-[#5e34b7] text-white font-medium" : ""}
                  ${isToday && !isSelected ? "ring-1 ring-[#8f58e4] text-[#8f58e4] font-medium" : "hover:bg-neutral-100 dark:hover:bg-neutral-800"}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Labels */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Lọc theo</h3>
        <div className="space-y-2">
          {(Object.entries(LABEL_META) as [ShiftType, { name: string; color: string }][]).map(([type, meta]) => {
            const isActive = activeFilters.has(type);
            return (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                  ${isActive ? "bg-neutral-100 dark:bg-neutral-800" : "opacity-50"}
                `}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                <span className="flex-1 text-left text-neutral-700 dark:text-neutral-300">{meta.name}</span>
                <span className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isActive ? "border-[#8f58e4] bg-[#8f58e4]" : "border-neutral-300 dark:border-neutral-600"}`}>
                  {isActive && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
