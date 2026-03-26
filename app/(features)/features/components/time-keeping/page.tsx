"use client";

import { useState } from "react";
import { motion } from "motion/react";
import TimekeepingFilters from "./components/TimekeepingFilters";
import TimekeepingGrid from "./components/TimekeepingGrid";
import AddEmployeeDialog from "./components/AddEmployeeDialog";
import AddShiftDialog from "./components/AddShiftDialog";
import EmployeeSummaryDialog from "./components/EmployeeSummaryDialog";

// ─── Types ───────────────────────────────────────────────
export type AttendanceStatus =
  | "on-time"
  | "late-early"
  | "no-checkin"
  | "paid-leave"
  | "unpaid-leave"
  | "business-trip"
  | "day-off"
  | "not-yet";

export const ATTENDANCE_COLORS: Record<AttendanceStatus, { bg: string; text: string; dot: string; label: string }> = {
  "on-time":       { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", label: "Chấm công đúng giờ" },
  "late-early":    { bg: "bg-amber-100 dark:bg-amber-900/30",     text: "text-amber-700 dark:text-amber-400",     dot: "bg-amber-500",   label: "Vào trễ, ra sớm" },
  "no-checkin":    { bg: "bg-red-100 dark:bg-red-900/30",         text: "text-red-700 dark:text-red-400",         dot: "bg-red-500",     label: "Chưa vào/ra ca" },
  "paid-leave":    { bg: "bg-blue-100 dark:bg-blue-900/30",   text: "text-blue-700 dark:text-blue-400",   dot: "bg-blue-500",  label: "Nghỉ phép có lương" },
  "unpaid-leave":  { bg: "bg-orange-100 dark:bg-orange-900/30",   text: "text-orange-800 dark:text-orange-400",   dot: "bg-orange-800",  label: "Nghỉ phép không lương" },
  "business-trip": { bg: "bg-blue-100 dark:bg-blue-900/30",       text: "text-blue-700 dark:text-blue-400",       dot: "bg-blue-500",    label: "Công tác ra ngoài" },
  "day-off":       { bg: "bg-neutral-100 dark:bg-neutral-800/50", text: "text-neutral-500 dark:text-neutral-400", dot: "bg-neutral-400", label: "Ngày nghỉ" },
  "not-yet":       { bg: "bg-neutral-50 dark:bg-neutral-900/20",  text: "text-neutral-400 dark:text-neutral-500", dot: "bg-neutral-300", label: "Chưa tới" },
};

export interface Shift {
  id: string;
  name: string;
  time: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  role: string;
  avatar?: string;
  shifts: Record<number, Shift[]>; // dayOfMonth (1-31) → shifts
}

interface EmployeeFormData {
  name: string;
  phone: string;
  role: string;
}

export interface DayData {
  date: number;
  month: number;
  year: number;
  dayName: string;
  isToday: boolean;
  fullDate: Date;
}

export const AVAILABLE_SHIFTS = [
  { id: "shift-admin",     name: "Ca hành chính", time: "08:00 - 17:00" },
  { id: "shift-morning",   name: "Ca sáng",       time: "06:00 - 14:00" },
  { id: "shift-afternoon", name: "Ca chiều",      time: "14:00 - 22:00" },
  { id: "shift-evening",   name: "Ca tối",        time: "18:00 - 22:00" },
  { id: "shift-night",     name: "Ca đêm",        time: "22:00 - 06:00" },
];

// ─── Helper ───────────────────────────────────────────────
function getDaysOfMonth(monthOffset: number = 0): DayData[] {
  const today = new Date();
  const target = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = target.getFullYear();
  const month = target.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const days: DayData[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({
      date: d,
      month: month + 1,
      year,
      dayName: dayNames[date.getDay()],
      isToday: date.toDateString() === today.toDateString(),
      fullDate: date,
    });
  }
  return days;
}

// ─── Component ───────────────────────────────────────────
export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [shiftDialogTarget, setShiftDialogTarget] = useState<{ employeeId: string; dayDate: number } | null>(null);
  const [summaryEmployee, setSummaryEmployee] = useState<Employee | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [days, setDays] = useState<DayData[]>(getDaysOfMonth(0));
  const [viewMode, setViewMode] = useState<"employee" | "shift">("employee");

  // Mock data — shifts keyed by day-of-month (1-31), March 2026
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1", name: "Nguyễn Văn A", phone: "0123456789", role: "Nhân viên",
      shifts: {
        3:  [{ id: "s1",  name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:55", checkOut: "17:02" }],
        4:  [{ id: "s2",  name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:58", checkOut: "17:05" }],
        5:  [{ id: "s3",  name: "Ca sáng",       time: "06:00 - 14:00", status: "no-checkin" }],
        6:  [{ id: "s4",  name: "Ca hành chính", time: "08:00 - 17:00", status: "day-off" }],
        10: [{ id: "s5",  name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:50", checkOut: "17:00" }],
        11: [{ id: "s6",  name: "Ca hành chính", time: "08:00 - 17:00", status: "late-early", checkIn: "08:15", checkOut: "16:55" }],
        12: [{ id: "s7",  name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:52", checkOut: "17:08" }],
        17: [{ id: "s8",  name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:55", checkOut: "17:00" }],
        18: [{ id: "s9",  name: "Ca tối",        time: "18:00 - 22:00", status: "late-early", checkIn: "18:15", checkOut: "21:50" }],
        19: [{ id: "s10", name: "Ca hành chính", time: "08:00 - 17:00", status: "paid-leave" }],
        23: [{ id: "s11", name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:55", checkOut: "17:02" },
             { id: "s12", name: "Ca tối",        time: "18:00 - 22:00", status: "late-early", checkIn: "18:15", checkOut: "21:50" }],
        24: [{ id: "s13", name: "Ca hành chính", time: "08:00 - 17:00", status: "not-yet" }],
      },
    },
    {
      id: "2", name: "Trần Thị B", phone: "0987654321", role: "Quản lý",
      shifts: {
        3:  [{ id: "s20", name: "Ca sáng",       time: "06:00 - 14:00", status: "on-time",     checkIn: "05:55", checkOut: "14:01" }],
        4:  [{ id: "s21", name: "Ca hành chính", time: "08:00 - 17:00", status: "paid-leave" }],
        5:  [{ id: "s22", name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",     checkIn: "07:50", checkOut: "17:10" }],
        10: [{ id: "s23", name: "Ca chiều",      time: "14:00 - 22:00", status: "business-trip" }],
        11: [{ id: "s24", name: "Ca hành chính", time: "08:00 - 17:00", status: "unpaid-leave" }],
        17: [{ id: "s25", name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",     checkIn: "07:48", checkOut: "17:05" }],
        18: [{ id: "s26", name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",     checkIn: "07:55", checkOut: "17:00" }],
        23: [{ id: "s27", name: "Ca sáng",       time: "06:00 - 14:00", status: "on-time",     checkIn: "05:55", checkOut: "14:01" }],
        24: [{ id: "s28", name: "Ca hành chính", time: "08:00 - 17:00", status: "not-yet" }],
      },
    },
    {
      id: "3", name: "Lê Văn C", phone: "0909123456", role: "Nhân viên",
      shifts: {
        3:  [{ id: "s30", name: "Ca hành chính", time: "08:00 - 17:00", status: "late-early", checkIn: "08:20", checkOut: "17:00" }],
        4:  [{ id: "s31", name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:50", checkOut: "17:05" }],
        5:  [{ id: "s32", name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:55", checkOut: "17:02" }],
        11: [{ id: "s33", name: "Ca tối",        time: "18:00 - 22:00", status: "not-yet" }],
        17: [{ id: "s34", name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:52", checkOut: "17:08" }],
        23: [{ id: "s35", name: "Ca hành chính", time: "08:00 - 17:00", status: "on-time",    checkIn: "07:55", checkOut: "17:00" }],
        24: [{ id: "s36", name: "Ca tối",        time: "18:00 - 22:00", status: "not-yet" }],
      },
    },
  ]);

  const handleMonthChange = (offset: number) => {
    setCurrentMonth(offset);
    setDays(getDaysOfMonth(offset));
  };

  const handleAddEmployee = (employeeData: EmployeeFormData[], _branchId: string) => {
    const newEmployees = employeeData.map((data, index) => ({
      id: `emp-${Date.now()}-${index}`,
      name: data.name,
      phone: data.phone,
      role: data.role,
      shifts: {} as Record<number, Shift[]>,
    }));
    setEmployees([...employees, ...newEmployees]);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
  };

  const handleAddShift = (employeeId: string, dayDate: number) => {
    setShiftDialogTarget({ employeeId, dayDate });
    setShiftDialogOpen(true);
  };

  const handleShiftSelected = (shiftTemplate: { name: string; time: string }) => {
    if (!shiftDialogTarget) return;
    const { employeeId, dayDate } = shiftDialogTarget;
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        const existing = emp.shifts[dayDate] ?? [];
        const newShift: Shift = {
          id: `shift-${Date.now()}`,
          name: shiftTemplate.name,
          time: shiftTemplate.time,
          status: "not-yet",
        };
        return { ...emp, shifts: { ...emp.shifts, [dayDate]: [...existing, newShift] } };
      })
    );
    setShiftDialogOpen(false);
    setShiftDialogTarget(null);
  };

  const handleRemoveShift = (employeeId: string, dayDate: number, shiftId: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        const updated = (emp.shifts[dayDate] ?? []).filter((s) => s.id !== shiftId);
        const newShifts = { ...emp.shifts };
        if (updated.length === 0) delete newShifts[dayDate];
        else newShifts[dayDate] = updated;
        return { ...emp, shifts: newShifts };
      })
    );
  };

  const handleUpdateShift = (employeeId: string, dayDate: number, shiftId: string, updates: Partial<Shift>) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        return {
          ...emp,
          shifts: {
            ...emp.shifts,
            [dayDate]: (emp.shifts[dayDate] ?? []).map((s) =>
              s.id === shiftId ? { ...s, ...updates } : s
            ),
          },
        };
      })
    );
  };

  return (
    <div className="p-6">
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#102854] via-[#4C88C6] to-[#1D4D8F] bg-clip-text text-transparent">
          Xếp ca &amp; Chấm công
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Quản lý lịch làm việc và chấm công nhân viên
        </p>
      </motion.div>

      <TimekeepingFilters
        month={days[0]?.month ?? new Date().getMonth() + 1}
        year={days[0]?.year ?? new Date().getFullYear()}
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
        onStatusChange={(status) => console.log("Status:", status)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={() => alert("Chức năng xuất file sẽ được tích hợp với API backend.")}
        onImport={() => alert("Chức năng nhập dữ liệu sẽ được tích hợp với API backend.")}
      />

      {/* ── Legend ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12 }}
        className="mb-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 shadow-sm overflow-hidden"
      >
        <div className="flex items-center gap-0 divide-x divide-neutral-100 dark:divide-neutral-800 overflow-x-auto">
          {/* Label */}
          <div className="px-3 py-2 shrink-0 bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6]">
            <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest whitespace-nowrap">Chú thích</p>
          </div>
          {/* Items */}
          {(Object.keys(ATTENDANCE_COLORS) as AttendanceStatus[]).map((status) => {
            const c = ATTENDANCE_COLORS[status];
            return (
              <div
                key={status}
                className="flex items-center gap-1.5 px-3 py-2 shrink-0 group cursor-default hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${c.dot} shrink-0 transition-transform duration-150 group-hover:scale-125`} />
                <span className={`text-[11px] font-medium whitespace-nowrap ${c.text}`}>{c.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Grid ── */}
      <TimekeepingGrid
        days={days}
        employees={employees}
        onAddShift={handleAddShift}
        onAddEmployee={() => setIsDialogOpen(true)}
        onRemoveEmployee={handleRemoveEmployee}
        onRemoveShift={handleRemoveShift}
        onUpdateShift={handleUpdateShift}
        onEmployeeClick={(emp) => setSummaryEmployee(emp)}
      />

      <AddEmployeeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddEmployee}
      />

      <AddShiftDialog
        open={shiftDialogOpen}
        onOpenChange={setShiftDialogOpen}
        onSelect={handleShiftSelected}
      />

      {summaryEmployee && (
        <EmployeeSummaryDialog
          open={!!summaryEmployee}
          onOpenChange={(open) => { if (!open) setSummaryEmployee(null); }}
          employee={employees.find((e) => e.id === summaryEmployee.id) ?? summaryEmployee}
          days={days}
        />
      )}
    </div>
  );
}
