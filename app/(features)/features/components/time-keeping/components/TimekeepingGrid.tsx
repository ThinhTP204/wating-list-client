"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2 } from "lucide-react";
import ShiftDetailDialog from "./ShiftDetailDialog";
import { ATTENDANCE_COLORS } from "../page";
import type { AttendanceStatus, Shift, Employee, DayData } from "../page";

interface TimekeepingGridProps {
  days: DayData[];
  employees: Employee[];
  onAddShift: (employeeId: string, dayDate: number) => void;
  onAddEmployee: () => void;
  onRemoveEmployee: (employeeId: string) => void;
  onRemoveShift: (employeeId: string, dayDate: number, shiftId: string) => void;
  onUpdateShift: (employeeId: string, dayDate: number, shiftId: string, updates: Partial<Shift>) => void;
  onEmployeeClick: (employee: Employee) => void;
}

const COL_W = 56;   // px per day column — wider for readability
const NAME_W = 210; // px for employee name column

export default function TimekeepingGrid({
  days,
  employees,
  onAddShift,
  onAddEmployee,
  onRemoveEmployee,
  onRemoveShift,
  onUpdateShift,
  onEmployeeClick,
}: TimekeepingGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInfo, setSelectedInfo] = useState<{
    employeeId: string;
    dayDate: number;
    dayLabel: string;
  } | null>(null);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDominantStatus = (shifts: Shift[]): AttendanceStatus => {
    if (shifts.length === 0) return "not-yet";
    const priority: AttendanceStatus[] = [
      "no-checkin", "late-early", "on-time",
      "paid-leave", "unpaid-leave", "business-trip", "day-off", "not-yet",
    ];
    for (const p of priority) {
      if (shifts.some((s) => s.status === p)) return p;
    }
    return shifts[0].status;
  };

  const isWeekend = (d: DayData) => d.dayName === "T7" || d.dayName === "CN";

  const selectedEmployee = selectedInfo
    ? employees.find((e) => e.id === selectedInfo.employeeId)
    : null;

  const gridCols = `${NAME_W}px repeat(${days.length}, ${COL_W}px)`;
  const totalWidth = NAME_W + days.length * COL_W;

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-x-auto">
      <div style={{ minWidth: `${totalWidth}px` }}>

        {/* ── Header ── */}
        <div
          className="grid bg-gradient-to-b from-neutral-50 to-neutral-50/70 dark:from-neutral-800/80 dark:to-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800"
          style={{ gridTemplateColumns: gridCols }}
        >
          <div className="p-2.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-white dark:bg-neutral-900 focus-visible:ring-[#8f58e4]/30"
              />
            </div>
          </div>
          {days.map((day) => (
            <div
              key={day.date}
              className={`border-l border-neutral-200 dark:border-neutral-800 text-center py-2.5 ${
                day.isToday
                  ? "bg-[#8f58e4]/10 dark:bg-[#8f58e4]/20"
                  : isWeekend(day)
                  ? "bg-neutral-100/80 dark:bg-neutral-700/30"
                  : ""
              }`}
            >
              <p className={`text-[9px] font-bold uppercase leading-none tracking-wider ${
                day.isToday ? "text-[#8f58e4]" : isWeekend(day) ? "text-neutral-400" : "text-neutral-400"
              }`}>
                {day.dayName}
              </p>
              <p className={`text-sm font-bold mt-1 leading-none ${
                day.isToday
                  ? "text-[#8f58e4]"
                  : isWeekend(day)
                  ? "text-neutral-500 dark:text-neutral-400"
                  : "text-neutral-800 dark:text-neutral-200"
              }`}>
                {day.date}
              </p>
              {day.isToday && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#8f58e4] mx-auto mt-1" />
              )}
            </div>
          ))}
        </div>

        {/* ── Ca mở row ── */}
        <div
          className="grid border-b border-neutral-200 dark:border-neutral-800 bg-amber-50/30 dark:bg-amber-900/5"
          style={{ gridTemplateColumns: gridCols }}
        >
          <div className="px-3 h-11 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Ca mở</span>
          </div>
          {days.map((day) => (
            <div
              key={day.date}
              className={`border-l border-neutral-200 dark:border-neutral-800 h-11 flex items-center justify-center ${
                day.isToday ? "bg-[#8f58e4]/5" : isWeekend(day) ? "bg-neutral-100/60 dark:bg-neutral-700/20" : ""
              }`}
            >
              <button
                className="w-6 h-6 rounded-full border border-dashed border-neutral-300 dark:border-neutral-600 hover:border-[#8f58e4] hover:bg-[#8f58e4]/10 flex items-center justify-center transition-all opacity-40 hover:opacity-100"
                aria-label="Thêm ca"
              >
                <Plus className="h-3 w-3 text-neutral-500" />
              </button>
            </div>
          ))}
        </div>

        {/* ── Employee rows ── */}
        <AnimatePresence mode="popLayout">
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              className="grid border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/20 transition-colors"
              style={{ gridTemplateColumns: gridCols }}
            >
              {/* Name cell */}
              <div className="px-2.5 h-[60px] flex items-center justify-between gap-1.5">
                <button
                  className="flex items-center gap-2.5 min-w-0 hover:opacity-75 transition-opacity text-left"
                  onClick={() => onEmployeeClick(employee)}
                  title="Xem tổng hợp lương"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8f58e4] to-[#402093] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                    {employee.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate leading-snug">
                      {employee.name}
                    </p>
                    <p className="text-[10px] text-[#8f58e4] leading-snug font-medium">{employee.role}</p>
                  </div>
                </button>
                <button
                  className="p-1 text-neutral-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all shrink-0"
                  onClick={() => onRemoveEmployee(employee.id)}
                  aria-label={`Xóa ${employee.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {/* Day cells */}
              {days.map((day) => {
                const dayShifts = employee.shifts[day.date] ?? [];
                const hasShifts = dayShifts.length > 0;
                const dominant = getDominantStatus(dayShifts);
                const colors = ATTENDANCE_COLORS[dominant];

                return (
                  <div
                    key={day.date}
                    className={`border-l border-neutral-200 dark:border-neutral-800 h-[60px] flex items-center justify-center ${
                      day.isToday
                        ? "bg-[#8f58e4]/5 dark:bg-[#8f58e4]/10"
                        : isWeekend(day)
                        ? "bg-neutral-100/40 dark:bg-neutral-700/10"
                        : ""
                    }`}
                  >
                    {hasShifts ? (
                      <button
                        className={`w-[44px] h-[48px] rounded-xl flex flex-col items-center justify-center gap-1
                          ${colors.bg} hover:scale-105 hover:shadow-md transition-all duration-150 border border-black/5 dark:border-white/5`}
                        onClick={() =>
                          setSelectedInfo({
                            employeeId: employee.id,
                            dayDate: day.date,
                            dayLabel: `${day.dayName} ${day.date}/${day.month}`,
                          })
                        }
                        aria-label={`${dayShifts.length} ca ngày ${day.date}`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} shadow-sm`} />
                        {dayShifts.length > 1 ? (
                          <span className={`text-[10px] font-bold ${colors.text} leading-none`}>
                            +{dayShifts.length}
                          </span>
                        ) : (
                          <span className={`text-[9px] font-semibold ${colors.text} leading-none opacity-70`}>
                            1 ca
                          </span>
                        )}
                      </button>
                    ) : (
                      <div className="group w-full h-full flex items-center justify-center">
                        <button
                          className="w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 border border-dashed border-neutral-300 dark:border-neutral-600 hover:border-[#8f58e4] hover:bg-[#8f58e4]/10 flex items-center justify-center transition-all"
                          onClick={() => onAddShift(employee.id, day.date)}
                          aria-label="Thêm ca"
                        >
                          <Plus className="h-3 w-3 text-neutral-400" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── Add employee ── */}
        <div className="px-3 py-2.5">
          <Button
            variant="outline"
            size="sm"
            className="border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-[#8f58e4] hover:border-[#8f58e4] hover:bg-[#8f58e4]/5 text-xs h-8 gap-1.5 transition-all"
            onClick={onAddEmployee}
          >
            <Plus className="h-3 w-3" />
            Thêm nhân viên
          </Button>
        </div>
      </div>

      {/* ── Shift detail dialog ── */}
      {selectedEmployee && selectedInfo && (
        <ShiftDetailDialog
          open={!!selectedInfo}
          onOpenChange={(open) => { if (!open) setSelectedInfo(null); }}
          employeeName={selectedEmployee.name}
          dayLabel={selectedInfo.dayLabel}
          shifts={selectedEmployee.shifts[selectedInfo.dayDate] ?? []}
          onRemoveShift={(shiftId) =>
            onRemoveShift(selectedInfo.employeeId, selectedInfo.dayDate, shiftId)
          }
          onUpdateShift={(shiftId, updates) =>
            onUpdateShift(selectedInfo.employeeId, selectedInfo.dayDate, shiftId, updates)
          }
        />
      )}
    </div>
  );
}
