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

// ─── Detail types ────────────────────────────────────────────────────────────

export interface EmployeeSalaryRow {
  id: string;
  order: number;
  name: string;
  department: string;
  position: string;
  basicSalary: number;
  accommodation: number;
  responsibility: number;
  totalBasic: number;
  actualSalary: number;
  status: "paid" | "pending" | "hold";
}

export interface SalaryColumn {
  key: string;       // "A", "B", ...
  title: string;
  keyword: string;
  type: "system" | "formula" | "manual";
  formula?: string;
}

export const EMPLOYEE_STATUS_META: Record<
  EmployeeSalaryRow["status"],
  { label: string; dot: string }
> = {
  paid:    { label: "Đã trả",    dot: "bg-emerald-500" },
  pending: { label: "Chờ duyệt", dot: "bg-amber-400"   },
  hold:    { label: "Tạm giữ",   dot: "bg-red-400"      },
};

export const MOCK_COLUMNS: SalaryColumn[] = [
  { key: "A", title: "Số thứ tự",      keyword: "STT",              type: "system"  },
  { key: "B", title: "Họ và tên",       keyword: "NHANVIEN_TENNV",   type: "system"  },
  { key: "C", title: "Phòng ban",       keyword: "NHANVIEN_PHONGBAN",type: "system"  },
  { key: "D", title: "Chức vụ",         keyword: "NHANVIEN_CHUCVU",  type: "system"  },
  { key: "E", title: "Lương cơ bản",    keyword: "LUONG_COBAN",      type: "manual"  },
  { key: "F", title: "Phụ cấp ở trọ",  keyword: "PHU_CAP_O_TRO",    type: "formula", formula: "E * 0.05" },
  { key: "G", title: "Phụ cấp trách nhiệm", keyword: "PHU_CAP_TN",  type: "formula", formula: "E * 0.015" },
  { key: "H", title: "Tổng lương cơ bản", keyword: "TONG_LUONG_CB", type: "formula", formula: "E + F + G" },
  { key: "I", title: "Lương thực nhận", keyword: "LUONG_THUC_NHAN", type: "formula", formula: "H - BHXH" },
];

export function getMockEmployees(boardId: string): EmployeeSalaryRow[] {
  const base: Omit<EmployeeSalaryRow, "id" | "order">[] = [
    { name: "Nguyễn Văn An",     department: "Kinh doanh", position: "Trưởng phòng",          basicSalary: 25_000_000, accommodation: 1_000_000, responsibility: 500_000, totalBasic: 26_500_000, actualSalary: 24_800_000, status: "paid"    },
    { name: "Trần Thị Bảo",      department: "Marketing",  position: "Nhân viên kinh doanh",  basicSalary: 15_000_000, accommodation:   600_000, responsibility: 200_000, totalBasic: 15_800_000, actualSalary: 14_700_000, status: "paid"    },
    { name: "Lê Minh Châu",      department: "Kỹ thuật",   position: "Lập trình viên",        basicSalary: 22_000_000, accommodation:   800_000, responsibility: 300_000, totalBasic: 23_100_000, actualSalary: 21_600_000, status: "pending" },
    { name: "Phạm Thị Dung",     department: "Nhân sự",    position: "Chuyên viên nhân sự",   basicSalary: 12_000_000, accommodation:   500_000, responsibility: 150_000, totalBasic: 12_650_000, actualSalary: 11_800_000, status: "paid"    },
    { name: "Hoàng Văn Em",      department: "Kỹ thuật",   position: "QA Engineer",           basicSalary: 18_000_000, accommodation:   700_000, responsibility: 250_000, totalBasic: 18_950_000, actualSalary: 17_700_000, status: "pending" },
    { name: "Vũ Thị Phương",     department: "Kinh doanh", position: "Nhân viên kinh doanh",  basicSalary: 13_500_000, accommodation:   550_000, responsibility: 100_000, totalBasic: 14_150_000, actualSalary: 13_200_000, status: "hold"    },
    { name: "Đặng Quốc Hùng",    department: "Marketing",  position: "Thiết kế đồ họa",       basicSalary: 14_000_000, accommodation:   500_000, responsibility: 100_000, totalBasic: 14_600_000, actualSalary: 13_600_000, status: "paid"    },
  ];
  void boardId;
  return base.map((e, i) => ({ ...e, id: `emp-${i + 1}`, order: i + 1 }));
}

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
