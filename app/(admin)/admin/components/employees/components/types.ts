export type EmployeeStatus = "active" | "inactive" | "probation" | "leave";
export type EmployeeRole = string;
export type EmployeeDepartment =
  | "sales"
  | "marketing"
  | "engineering"
  | "hr"
  | "finance"
  | "operations";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: EmployeeDepartment;
  status: EmployeeStatus;
  joinDate: string;
  avatar?: string;
  salary: number;
}

export const STATUS_META: Record<
  EmployeeStatus,
  { name: string; color: string; bg: string; text: string }
> = {
  active: {
    name: "Đang làm việc",
    color: "#22c55e",
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
  },
  inactive: {
    name: "Đã nghỉ việc",
    color: "#ef4444",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
  },
  probation: {
    name: "Thử việc",
    color: "#f59e0b",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
  },
  leave: {
    name: "Nghỉ phép",
    color: "#3b82f6",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
  },
};

export const ROLE_META: Record<string, { name: string }> = {
  staff: { name: "Nhân viên" },
};

export const DEPARTMENT_META: Record<EmployeeDepartment, { name: string }> = {
  sales: { name: "Kinh doanh" },
  marketing: { name: "Marketing" },
  engineering: { name: "Kỹ thuật" },
  hr: { name: "Nhân sự" },
  finance: { name: "Tài chính" },
  operations: { name: "Vận hành" },
};

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    email: "an.nguyen@company.com",
    phone: "0901234567",
    role: "staff",
    department: "sales",
    status: "active",
    joinDate: "2021-03-15",
    salary: 25000000,
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    email: "binh.tran@company.com",
    phone: "0912345678",
    role: "staff",
    department: "marketing",
    status: "active",
    joinDate: "2022-01-10",
    salary: 18000000,
  },
  {
    id: "3",
    name: "Lê Văn Cường",
    email: "cuong.le@company.com",
    phone: "0923456789",
    role: "staff",
    department: "engineering",
    status: "probation",
    joinDate: "2024-09-01",
    salary: 12000000,
  },
  {
    id: "4",
    name: "Phạm Thị Dung",
    email: "dung.pham@company.com",
    phone: "0934567890",
    role: "staff",
    department: "hr",
    status: "active",
    joinDate: "2023-05-20",
    salary: 14000000,
  },
  {
    id: "5",
    name: "Hoàng Văn Em",
    email: "em.hoang@company.com",
    phone: "0945678901",
    role: "staff",
    department: "finance",
    status: "probation",
    joinDate: "2025-01-15",
    salary: 5000000,
  },
  {
    id: "6",
    name: "Vũ Thị Phương",
    email: "phuong.vu@company.com",
    phone: "0956789012",
    role: "staff",
    department: "operations",
    status: "active",
    joinDate: "2020-08-01",
    salary: 20000000,
  },
  {
    id: "7",
    name: "Đặng Văn Giang",
    email: "giang.dang@company.com",
    phone: "0967890123",
    role: "staff",
    department: "sales",
    status: "leave",
    joinDate: "2022-11-05",
    salary: 13000000,
  },
  {
    id: "8",
    name: "Bùi Thị Hoa",
    email: "hoa.bui@company.com",
    phone: "0978901234",
    role: "staff",
    department: "engineering",
    status: "active",
    joinDate: "2019-06-12",
    salary: 30000000,
  },
  {
    id: "9",
    name: "Ngô Văn Inh",
    email: "inh.ngo@company.com",
    phone: "0989012345",
    role: "staff",
    department: "marketing",
    status: "inactive",
    joinDate: "2021-09-30",
    salary: 0,
  },
  {
    id: "10",
    name: "Đinh Thị Kim",
    email: "kim.dinh@company.com",
    phone: "0990123456",
    role: "staff",
    department: "hr",
    status: "active",
    joinDate: "2023-02-14",
    salary: 17000000,
  },
];
