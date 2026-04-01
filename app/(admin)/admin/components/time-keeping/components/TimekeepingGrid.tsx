"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Users } from "lucide-react";
import ShiftDetailDialog from "./ShiftDetailDialog";
import { ATTENDANCE_COLORS } from "../TimeKeepingPage";
import type { AttendanceStatus, Shift, Employee, DayData } from "../TimeKeepingPage";

interface TimekeepingGridProps {
  days: DayData[];
  employees: Employee[];
  onAddShift: (employeeId: string, dayDate: number) => void;
  onAddEmployee: () => void;
  onRemoveEmployee: (employeeId: string) => void;
  onRemoveShift: (employeeId: string, dayDate: number, shiftId: string) => void;
  onUpdateShift: (
    employeeId: string,
    dayDate: number,
    shiftId: string,
    updates: Partial<Shift>
  ) => void;
  onEmployeeClick: (employee: Employee) => void;
}

const COL_W = 56;
const NAME_W = 210;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } },
};

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
    if (shifts.length === 0) return "not-time-yet";
    const priority: AttendanceStatus[] = [
      "forgot-check-in",
      "late-or-early",
      "pending-extra-shift",
      "in-shift",
      "overtime",
      "manager-added",
      "edited",
      "auto-tracked",
      "on-time",
      "paid-leave-request",
      "leave-requested",
      "holiday",
      "not-time-yet",
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
          {/* Sticky search cell */}
          <div className="p-2.5 sticky left-0 z-10 bg-neutral-50 dark:bg-neutral-800/80 backdrop-blur-sm border-r border-neutral-200 dark:border-neutral-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-white dark:bg-neutral-900 focus-visible:ring-[#4C88C6]/30 transition-shadow duration-200"
              />
            </div>
          </div>
          {days.map((day) => (
            <div
              key={day.date}
              className={`relative border-l border-neutral-200 dark:border-neutral-800 text-center py-2.5 transition-colors ${
                day.isToday
                  ? "bg-[#4C88C6]/10 dark:bg-[#4C88C6]/20"
                  : isWeekend(day)
                    ? "bg-neutral-100/80 dark:bg-neutral-700/30"
                    : ""
              }`}
            >
              {/* Today top accent line */}
              {day.isToday && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4C88C6]/60 via-[#4C88C6] to-[#4C88C6]/60 rounded-full" />
              )}
              <p
                className={`text-xs font-bold uppercase leading-none tracking-wider ${
                  day.isToday ? "text-[#4C88C6]" : "text-neutral-400"
                }`}
              >
                {day.dayName}
              </p>
              <p
                className={`text-sm font-bold mt-1 leading-none ${
                  day.isToday
                    ? "text-[#4C88C6]"
                    : isWeekend(day)
                      ? "text-neutral-500 dark:text-neutral-400"
                      : "text-neutral-800 dark:text-neutral-200"
                }`}
              >
                {day.date}
              </p>
              {day.isToday && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#4C88C6] mx-auto mt-1 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* ── Ca mở row ── */}
        <div
          className="grid border-b border-neutral-200 dark:border-neutral-800 bg-amber-50/30 dark:bg-amber-900/5"
          style={{ gridTemplateColumns: gridCols }}
        >
          <div className="px-3 h-11 flex items-center gap-2 sticky left-0 z-10 bg-amber-50/60 dark:bg-amber-900/10 backdrop-blur-sm border-r border-neutral-200 dark:border-neutral-800">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
              Ca mở
            </span>
          </div>
          {days.map((day) => (
            <div
              key={day.date}
              className={`border-l border-neutral-200 dark:border-neutral-800 h-11 flex items-center justify-center ${
                day.isToday
                  ? "bg-[#4C88C6]/5"
                  : isWeekend(day)
                    ? "bg-neutral-100/60 dark:bg-neutral-700/20"
                    : ""
              }`}
            >
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="w-6 h-6 rounded-full border border-dashed border-neutral-300 dark:border-neutral-600 hover:border-[#4C88C6] hover:bg-[#4C88C6]/10 flex items-center justify-center transition-colors opacity-40 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C88C6]/50"
                aria-label="Thêm ca"
              >
                <Plus className="h-3 w-3 text-neutral-500" />
              </motion.button>
            </div>
          ))}
        </div>

        {/* ── Employee rows ── */}
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <AnimatePresence mode="popLayout">
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.id}
                variants={itemVariants}
                exit={itemVariants.exit}
                layout
                className="grid border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/30 transition-colors group/row"
                style={{ gridTemplateColumns: gridCols }}
              >
                {/* Name cell — sticky */}
                <div className="px-2.5 h-[60px] flex items-center justify-between gap-1.5 sticky left-0 z-10 bg-white dark:bg-neutral-900 group-hover/row:bg-neutral-50/80 dark:group-hover/row:bg-neutral-800/30 backdrop-blur-sm transition-colors border-r border-neutral-200 dark:border-neutral-800">
                  <motion.button
                    whileHover={{ x: 1 }}
                    className="flex items-center gap-2.5 min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C88C6]/50 rounded-lg p-0.5"
                    onClick={() => onEmployeeClick(employee)}
                    title="Xem tổng hợp lương"
                  >
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4C88C6] to-[#102854] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm ring-2 ring-transparent hover:ring-[#4C88C6]/30 transition-all"
                    >
                      {employee.name.charAt(0)}
                    </motion.div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate leading-snug">
                        {employee.name}
                      </p>
                      <p className="text-xs text-[#4C88C6] leading-snug font-medium">
                        {employee.role}
                      </p>
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 text-neutral-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all shrink-0 opacity-0 group-hover/row:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 focus-visible:opacity-100"
                    onClick={() => onRemoveEmployee(employee.id)}
                    aria-label={`Xóa ${employee.name}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </motion.button>
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
                          ? "bg-[#4C88C6]/5 dark:bg-[#4C88C6]/10"
                          : isWeekend(day)
                            ? "bg-neutral-100/40 dark:bg-neutral-700/10"
                            : ""
                      }`}
                    >
                      {hasShifts ? (
                        <motion.button
                          whileHover={{ scale: 1.06, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className={`w-[44px] h-[48px] rounded-xl flex flex-col items-center justify-center gap-1
                            ${colors.bg} shadow-sm hover:shadow-md transition-shadow duration-150 border border-black/5 dark:border-white/5
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C88C6]/50`}
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
                            <span className={`text-xs font-bold ${colors.text} leading-none`}>
                              +{dayShifts.length}
                            </span>
                          ) : (
                            <span
                              className={`text-xs font-semibold ${colors.text} leading-none opacity-70`}
                            >
                              1 ca
                            </span>
                          )}
                        </motion.button>
                      ) : (
                        <div className="group/cell w-full h-full flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-6 h-6 rounded-full opacity-0 group-hover/cell:opacity-100 border border-dashed border-neutral-300 dark:border-neutral-600 hover:border-[#4C88C6] hover:bg-[#4C88C6]/10 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C88C6]/50 focus-visible:opacity-100"
                            onClick={() => onAddShift(employee.id, day.date)}
                            aria-label="Thêm ca"
                          >
                            <Plus className="h-3 w-3 text-neutral-400" />
                          </motion.button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Empty state ── */}
        <AnimatePresence>
          {filteredEmployees.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-12 gap-3 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-neutral-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {searchQuery ? "Không tìm thấy nhân viên" : "Chưa có nhân viên"}
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {searchQuery
                    ? `Không có kết quả cho "${searchQuery}"`
                    : "Thêm nhân viên để bắt đầu chấm công"}
                </p>
              </div>
              {!searchQuery && (
                <Button
                  variant="brand-outline"
                  size="sm"
                  className="h-8 text-xs gap-1.5 mt-1"
                  onClick={onAddEmployee}
                >
                  <Plus className="h-3 w-3" />
                  Thêm nhân viên
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Add employee ── */}
        {filteredEmployees.length > 0 && (
          <div className="px-3 py-2.5">
            <motion.div whileHover={{ x: 1 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="sm"
                className="border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-[#4C88C6] hover:border-[#4C88C6] hover:bg-[#4C88C6]/5 text-xs h-8 gap-1.5 transition-all focus-visible:ring-[#4C88C6]/50"
                onClick={onAddEmployee}
              >
                <Plus className="h-3 w-3" />
                Thêm nhân viên
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* ── Shift detail dialog ── */}
      {selectedEmployee && selectedInfo && (
        <ShiftDetailDialog
          open={!!selectedInfo}
          onOpenChange={(open) => {
            if (!open) setSelectedInfo(null);
          }}
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
