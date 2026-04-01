"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  fetchMockEmployees,
  fetchShiftConfigs,
  fetchShifts,
} from "@/features/shifts/services/shiftApi";
import type {
  EmployeeShiftAttendanceStatus,
  MockEmployee,
  Shift as SchedulerShift,
} from "@/features/shifts/types";
import TimekeepingFilters from "./components/TimekeepingFilters";
import TimekeepingGrid from "./components/TimekeepingGrid";
import AddEmployeeDialog from "./components/AddEmployeeDialog";
import AddShiftDialog from "./components/AddShiftDialog";
import EmployeeSummaryDialog from "./components/EmployeeSummaryDialog";

// ─── Types ───────────────────────────────────────────────
export type AttendanceStatus =
  | "on-time"
  | "late-or-early"
  | "edited"
  | "forgot-check-in"
  | "not-time-yet"
  | "pending-extra-shift"
  | "in-shift"
  | "leave-requested"
  | "overtime"
  | "manager-added"
  | "paid-leave-request"
  | "auto-tracked"
  | "holiday";

export const ATTENDANCE_COLORS: Record<
  AttendanceStatus,
  { bg: string; text: string; dot: string; label: string }
> = {
  "on-time": {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Đúng giờ",
  },
  "late-or-early": {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Đến muộn hoặc về sớm",
  },
  edited: {
    bg: "bg-sky-100 dark:bg-sky-900/30",
    text: "text-sky-700 dark:text-sky-400",
    dot: "bg-sky-500",
    label: "Đã chỉnh sửa",
  },
  "forgot-check-in": {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500",
    label: "Quên chấm công",
  },
  "not-time-yet": {
    bg: "bg-neutral-50 dark:bg-neutral-900/20",
    text: "text-neutral-400 dark:text-neutral-500",
    dot: "bg-neutral-300",
    label: "Chưa đến giờ",
  },
  "pending-extra-shift": {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-400",
    dot: "bg-yellow-500",
    label: "Ca bổ sung chờ duyệt",
  },
  "in-shift": {
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    text: "text-cyan-700 dark:text-cyan-400",
    dot: "bg-cyan-500",
    label: "Đang trong ca làm việc",
  },
  "leave-requested": {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-800 dark:text-orange-400",
    dot: "bg-orange-600",
    label: "Đã xin nghỉ",
  },
  overtime: {
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    text: "text-indigo-700 dark:text-indigo-400",
    dot: "bg-indigo-500",
    label: "Tăng ca",
  },
  "manager-added": {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
    label: "Quản lý bổ sung",
  },
  "paid-leave-request": {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    text: "text-teal-700 dark:text-teal-400",
    dot: "bg-teal-500",
    label: "Xin nghỉ được tính lương",
  },
  "auto-tracked": {
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-700 dark:text-violet-400",
    dot: "bg-violet-500",
    label: "Tự động chấm công",
  },
  holiday: {
    bg: "bg-neutral-100 dark:bg-neutral-800/50",
    text: "text-neutral-500 dark:text-neutral-400",
    dot: "bg-neutral-400",
    label: "Nghỉ lễ",
  },
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
  { id: "shift-admin", name: "Ca hành chính", time: "08:00 - 17:00" },
  { id: "shift-morning", name: "Ca sáng", time: "06:00 - 14:00" },
  { id: "shift-afternoon", name: "Ca chiều", time: "14:00 - 22:00" },
  { id: "shift-evening", name: "Ca tối", time: "18:00 - 22:00" },
  { id: "shift-night", name: "Ca đêm", time: "22:00 - 06:00" },
];

const TIMEKEEPING_FALLBACK_EMPLOYEES: MockEmployee[] = [
  { id: "emp-01", name: "Nguyễn Văn Minh", role: "Trưởng ca" },
  { id: "emp-02", name: "Trần Thị Lan", role: "Thu ngân" },
  { id: "emp-03", name: "Lê Văn Hùng", role: "Nhân viên" },
  { id: "emp-04", name: "Phạm Thị Mai", role: "Trưởng ca" },
  { id: "emp-05", name: "Hoàng Văn Đức", role: "Thu ngân" },
  { id: "emp-06", name: "Võ Thị Hoa", role: "Nhân viên" },
  { id: "emp-07", name: "Đặng Văn Tuân", role: "Nhân viên" },
  { id: "emp-08", name: "Bùi Thị Ngọc", role: "Nhân viên" },
  { id: "emp-09", name: "Ngô Văn Long", role: "Nhân viên" },
  { id: "emp-10", name: "Đỗ Thị Hương", role: "Nhân viên" },
  { id: "emp-11", name: "Trương Văn Khánh", role: "Trưởng ca" },
  { id: "emp-12", name: "Lý Thị Thảo", role: "Nhân viên" },
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

function mapMockEmployeeToTimekeepingEmployee(
  mockEmployee: MockEmployee,
  index: number,
  existingShifts: Record<number, Shift[]> = {}
): Employee {
  const phone = `09${String(index + 1).padStart(8, "0")}`;
  return {
    id: mockEmployee.id,
    name: mockEmployee.name,
    role: mockEmployee.role,
    phone,
    shifts: existingShifts,
  };
}

function getBaselineTimekeepingEmployees(): Employee[] {
  return TIMEKEEPING_FALLBACK_EMPLOYEES.map((mockEmployee, index) =>
    mapMockEmployeeToTimekeepingEmployee(mockEmployee, index)
  );
}

function getMonthDateRange(monthOffset: number): { startISO: string; endISO: string } {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 0);

  const toISODate = (date: Date): string => {
    const local = new Date(date);
    local.setHours(0, 0, 0, 0);
    const tzOffset = local.getTimezoneOffset() * 60_000;
    return new Date(local.getTime() - tzOffset).toISOString().slice(0, 10);
  };

  return {
    startISO: toISODate(monthStart),
    endISO: toISODate(monthEnd),
  };
}

function mapAttendanceStatus(
  attendanceStatus?: EmployeeShiftAttendanceStatus,
  shiftStatus?: SchedulerShift["status"]
): AttendanceStatus {
  if (attendanceStatus) {
    const mapping: Record<EmployeeShiftAttendanceStatus, AttendanceStatus> = {
      on_time: "on-time",
      late_or_early: "late-or-early",
      edited: "edited",
      missing_checkin: "forgot-check-in",
      not_started: "not-time-yet",
      extra_shift_pending: "pending-extra-shift",
      in_progress: "in-shift",
      leave_requested: "leave-requested",
      overtime: "overtime",
      manager_added: "manager-added",
      paid_leave: "paid-leave-request",
      auto_checked: "auto-tracked",
      holiday: "holiday",
    };

    return mapping[attendanceStatus];
  }

  if (shiftStatus === "absent") {
    return "leave-requested";
  }
  if (shiftStatus === "draft") {
    return "not-time-yet";
  }

  return "on-time";
}

function mapSchedulerShiftsToTimekeepingShifts(
  shifts: SchedulerShift[],
  shiftNameByConfigId: Map<string, string>,
  shiftTimeByConfigId: Map<string, string>
): Record<string, Record<number, Shift[]>> {
  const mapped: Record<string, Record<number, Shift[]>> = {};

  for (const shift of shifts) {
    const [, , dayPart] = shift.date.split("-");
    const dayDate = Number(dayPart);
    const employeeDayMap = mapped[shift.employeeId] ?? {};
    const dayShifts = employeeDayMap[dayDate] ?? [];

    dayShifts.push({
      id: shift.id,
      name: shiftNameByConfigId.get(shift.configId) ?? shift.configId,
      time: shiftTimeByConfigId.get(shift.configId) ?? "--:-- - --:--",
      status: mapAttendanceStatus(shift.attendanceStatus, shift.status),
    });

    employeeDayMap[dayDate] = dayShifts;
    mapped[shift.employeeId] = employeeDayMap;
  }

  return mapped;
}

// ─── Component ───────────────────────────────────────────
export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shiftDialogOpen, setShiftDialogOpen] = useState(false);
  const [shiftDialogTarget, setShiftDialogTarget] = useState<{
    employeeId: string;
    dayDate: number;
  } | null>(null);
  const [summaryEmployee, setSummaryEmployee] = useState<Employee | null>(null);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [days, setDays] = useState<DayData[]>(getDaysOfMonth(0));
  const [viewMode, setViewMode] = useState<"employee" | "shift">("employee");

  const [employees, setEmployees] = useState<Employee[]>(() => getBaselineTimekeepingEmployees());

  useEffect(() => {
    let isActive = true;

    const syncEmployeesFromShiftModule = async () => {
      try {
        const { startISO, endISO } = getMonthDateRange(currentMonth);

        const [mockEmployees, monthShifts, shiftConfigs] = await Promise.all([
          fetchMockEmployees(),
          fetchShifts({ weekStart: startISO, weekEnd: endISO }),
          fetchShiftConfigs(),
        ]);

        if (!isActive) {
          return;
        }

        const sourceEmployees =
          mockEmployees.length > 0 ? mockEmployees : TIMEKEEPING_FALLBACK_EMPLOYEES;

        const shiftNameByConfigId = new Map(shiftConfigs.map((item) => [item.id, item.name]));
        const shiftTimeByConfigId = new Map(
          shiftConfigs.map((item) => [item.id, `${item.startTime} - ${item.endTime}`])
        );
        const shiftsByEmployee = mapSchedulerShiftsToTimekeepingShifts(
          monthShifts,
          shiftNameByConfigId,
          shiftTimeByConfigId
        );

        setEmployees((previousEmployees) => {
          const previousShiftByEmployeeId = new Map(
            previousEmployees.map((employee) => [employee.id, employee.shifts])
          );

          return sourceEmployees.map((mockEmployee, index) =>
            mapMockEmployeeToTimekeepingEmployee(
              mockEmployee,
              index,
              shiftsByEmployee[mockEmployee.id] ?? previousShiftByEmployeeId.get(mockEmployee.id)
            )
          );
        });
      } catch {
        if (!isActive) {
          return;
        }

        // Always keep a visible baseline for UI even when shift sync fails.
        setEmployees((previousEmployees) => {
          const previousShiftByEmployeeId = new Map(
            previousEmployees.map((employee) => [employee.id, employee.shifts])
          );

          return TIMEKEEPING_FALLBACK_EMPLOYEES.map((mockEmployee, index) =>
            mapMockEmployeeToTimekeepingEmployee(
              mockEmployee,
              index,
              previousShiftByEmployeeId.get(mockEmployee.id)
            )
          );
        });
      }
    };

    void syncEmployeesFromShiftModule();

    return () => {
      isActive = false;
    };
  }, [currentMonth]);

  const handleMonthChange = (offset: number) => {
    setCurrentMonth(offset);
    setDays(getDaysOfMonth(offset));
  };

  const handleAddEmployee = (employeeData: EmployeeFormData[], branchId: string) => {
    void branchId;
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
          status: "not-time-yet",
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

  const handleUpdateShift = (
    employeeId: string,
    dayDate: number,
    shiftId: string,
    updates: Partial<Shift>
  ) => {
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
            <p className="text-xs font-bold text-white/90 uppercase tracking-widest whitespace-nowrap">
              Chú thích
            </p>
          </div>
          {/* Items */}
          {(Object.keys(ATTENDANCE_COLORS) as AttendanceStatus[]).map((status) => {
            const c = ATTENDANCE_COLORS[status];
            return (
              <div
                key={status}
                className="flex items-center gap-1.5 px-3 py-2 shrink-0 group cursor-default hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full ${c.dot} shrink-0 transition-transform duration-150 group-hover:scale-125`}
                />
                <span className={`text-xs font-medium whitespace-nowrap ${c.text}`}>{c.label}</span>
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
          onOpenChange={(open) => {
            if (!open) setSummaryEmployee(null);
          }}
          employee={employees.find((e) => e.id === summaryEmployee.id) ?? summaryEmployee}
          days={days}
        />
      )}
    </div>
  );
}
