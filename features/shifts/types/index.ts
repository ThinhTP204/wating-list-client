export type ShiftStatus = "draft" | "published" | "absent";

export type EmployeeShiftAttendanceStatus =
  | "on_time"
  | "late_or_early"
  | "edited"
  | "missing_checkin"
  | "not_started"
  | "extra_shift_pending"
  | "in_progress"
  | "leave_requested"
  | "overtime"
  | "manager_added"
  | "paid_leave"
  | "auto_checked"
  | "holiday";

export interface ShiftConfig {
  id: string;
  name: string;
  startTime: string; // "08:30"
  endTime: string; // "17:30"
  color: string; // hex
  isBreak: boolean;
}

export interface MockEmployee {
  id: string;
  name: string;
  role: string; // e.g. "Nhân viên", "Trưởng ca", "Thu ngân"
}

export type AvailabilityStatus = "available" | "busy" | "preferred";

export interface Availability {
  employeeId: string;
  date: string;
  status: AvailabilityStatus;
}

export interface StaffingDemand {
  dayOfWeek: number; // 0-6
  shiftConfigId: string;
  minStaff: number;
  requiredRole?: string;
}

export interface AIDraftConflict {
  date: string;
  shiftConfigId: string;
  required: number;
  assigned: number;
  reason: string;
  suggestion: string;
}

export interface AIGenerationMeta {
  generated: boolean;
  reason?: string;
  confidenceScore?: number;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  configId: string;
  date: string; // "YYYY-MM-DD"
  status: ShiftStatus;
  attendanceStatus?: EmployeeShiftAttendanceStatus;
  note?: string;
  aiMeta?: AIGenerationMeta;
}

export const EMPLOYEE_SHIFT_ATTENDANCE_STATUS_META: Record<
  EmployeeShiftAttendanceStatus,
  { label: string; badgeClass: string }
> = {
  on_time: {
    label: "Đúng giờ",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  late_or_early: {
    label: "Đến muộn hoặc về sớm",
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300",
  },
  edited: {
    label: "Đã chỉnh sửa",
    badgeClass:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300",
  },
  missing_checkin: {
    label: "Quên chấm công",
    badgeClass:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-300",
  },
  not_started: {
    label: "Chưa đến giờ",
    badgeClass:
      "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
  },
  extra_shift_pending: {
    label: "Ca bổ sung chờ duyệt",
    badgeClass:
      "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300",
  },
  in_progress: {
    label: "Đang trong ca làm việc",
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300",
  },
  leave_requested: {
    label: "Đã xin nghỉ",
    badgeClass:
      "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-800 dark:bg-fuchsia-950/30 dark:text-fuchsia-300",
  },
  overtime: {
    label: "Tăng ca",
    badgeClass:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-300",
  },
  manager_added: {
    label: "Quản lý bổ sung",
    badgeClass:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300",
  },
  paid_leave: {
    label: "Xin nghỉ được tính lương",
    badgeClass:
      "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-300",
  },
  auto_checked: {
    label: "Tự động chấm công",
    badgeClass:
      "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-800 dark:bg-lime-950/30 dark:text-lime-300",
  },
  holiday: {
    label: "Nghỉ lễ",
    badgeClass:
      "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950/30 dark:text-pink-300",
  },
};

export interface AIGenerateDraftResult {
  createdShifts: Shift[];
  conflicts: AIDraftConflict[];
}

export const SHIFT_STATUS_META: Record<
  ShiftStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  draft: {
    label: "Nháp",
    color: "text-slate-500",
    bg: "bg-slate-100 dark:bg-slate-800",
    border: "border-dashed border-slate-300 dark:border-slate-600",
  },
  published: {
    label: "Đã công bố",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
    border: "border-blue-200 dark:border-blue-800",
  },
  absent: {
    label: "Vắng",
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950",
    border: "border-red-200 dark:border-red-800",
  },
};
