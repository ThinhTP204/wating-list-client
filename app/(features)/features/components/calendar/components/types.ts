export type ShiftType = "event" | "trial" | "interview" | "leave" | "birthday" | "business";

export type CalendarView = "month" | "day" | "week";

export interface Shift {
  id: string;
  title: string;
  employee: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
}

export type ShiftsMap = Record<string, Shift[]>;

export const SHIFT_COLORS: Record<ShiftType, { bg: string; text: string; border: string; dot: string }> = {
  event: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800", dot: "bg-blue-500" },
  trial: { bg: "bg-green-50 dark:bg-green-950/30", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800", dot: "bg-green-500" },
  interview: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800", dot: "bg-blue-500" },
  leave: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500" },
  birthday: { bg: "bg-pink-50 dark:bg-pink-950/30", text: "text-pink-700 dark:text-pink-300", border: "border-pink-200 dark:border-pink-800", dot: "bg-pink-500" },
  business: { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-600 dark:text-neutral-300", border: "border-neutral-200 dark:border-neutral-700", dot: "bg-neutral-500" },
};

export const LABEL_META: Record<ShiftType, { name: string; color: string }> = {
  event: { name: "Sự kiện", color: "#4C88C6" },
  trial: { name: "Thử việc", color: "#22c55e" },
  interview: { name: "Phỏng vấn", color: "#3b82f6" },
  leave: { name: "Nghỉ phép", color: "#f59e0b" },
  birthday: { name: "Ngày sinh", color: "#ec4899" },
  business: { name: "Công tác/Ra ngoài", color: "#6b7280" },
};
