export type SalaryType = "gross_to_net" | "net_to_gross" | "fixed";
export type TimeCalcType = "calendar_day" | "working_day" | "shift";
export type SalaryStatus = "active" | "draft" | "locked";

export interface SalaryBoard {
  id: string;
  name: string;
  keyword: string;
  month: string; // "YYYY-MM"
  type: SalaryType;
  timeCalcType: TimeCalcType;
  hiddenFromEmployee: boolean;
  status: SalaryStatus;
  departments: string[];
  positions: string[];
  employeeCount: number;
  createdAt: string;
}

export const SALARY_TYPE_META: Record<SalaryType, { label: string }> = {
  gross_to_net: { label: "Gross sang Net" },
  net_to_gross: { label: "Net sang Gross" },
  fixed: { label: "Lương cố định" },
};

export const TIME_CALC_META: Record<TimeCalcType, { label: string }> = {
  calendar_day: { label: "Ngày dương lịch" },
  working_day: { label: "Ngày làm việc" },
  shift: { label: "Ca làm việc" },
};

export const STATUS_META: Record<SalaryStatus, { label: string; bg: string; text: string }> = {
  active: {
    label: "Đang hoạt động",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
  },
  draft: {
    label: "Bản nháp",
    bg: "bg-neutral-100 dark:bg-neutral-800",
    text: "text-neutral-600 dark:text-neutral-400",
  },
  locked: {
    label: "Đã khóa",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
  },
};

export const MOCK_SALARY_BOARDS: SalaryBoard[] = [
  {
    id: "1",
    name: "Bảng lương tháng 3/2026 - Kinh doanh",
    keyword: "LUONG-KD-03-2026",
    month: "2026-03",
    type: "gross_to_net",
    timeCalcType: "working_day",
    hiddenFromEmployee: false,
    status: "active",
    departments: ["Kinh doanh", "Marketing"],
    positions: ["Nhân viên kinh doanh", "Trưởng phòng"],
    employeeCount: 12,
    createdAt: "2026-03-01",
  },
  {
    id: "2",
    name: "Bảng lương tháng 3/2026 - Kỹ thuật",
    keyword: "LUONG-KT-03-2026",
    month: "2026-03",
    type: "net_to_gross",
    timeCalcType: "calendar_day",
    hiddenFromEmployee: false,
    status: "active",
    departments: ["Kỹ thuật"],
    positions: ["Lập trình viên", "QA Engineer"],
    employeeCount: 8,
    createdAt: "2026-03-01",
  },
  {
    id: "3",
    name: "Bảng lương tháng 2/2026 - Toàn công ty",
    keyword: "LUONG-ALL-02-2026",
    month: "2026-02",
    type: "gross_to_net",
    timeCalcType: "working_day",
    hiddenFromEmployee: true,
    status: "locked",
    departments: ["Tất cả"],
    positions: ["Tất cả"],
    employeeCount: 24,
    createdAt: "2026-02-01",
  },
  {
    id: "4",
    name: "Bảng lương thử việc - Q1/2026",
    keyword: "LUONG-THU-VIEC-Q1",
    month: "2026-03",
    type: "fixed",
    timeCalcType: "shift",
    hiddenFromEmployee: false,
    status: "draft",
    departments: ["Nhân sự"],
    positions: ["Thực tập sinh", "Nhân viên thử việc"],
    employeeCount: 3,
    createdAt: "2026-03-10",
  },
];
