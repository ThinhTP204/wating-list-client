export type ShiftStatus = "draft" | "published" | "absent";

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
  note?: string;
  aiMeta?: AIGenerationMeta;
}

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
