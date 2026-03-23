export type ShiftSwapStatus = "open" | "matched" | "expired";
export type ShiftType = "morning" | "afternoon" | "evening" | "night";

export interface ShiftSwapPost {
  id: string;
  authorName: string;
  authorPosition: string;
  authorDepartment: string;
  isOnline: boolean;
  myShift: {
    date: string;       // "2026-03-30"
    timeLabel: string;  // "08:00 – 16:00"
    type: ShiftType;
  };
  wantShift: string;
  branch: string;
  note?: string;
  status: ShiftSwapStatus;
  expiresAt: string;
  createdAt: string;
  isOwn?: boolean;
}

export interface AvailableEmployee {
  id: string;
  name: string;
  position: string;
  department: string;
  isOnline: boolean;
  availableDate: string;        // "2026-03-30"
  availableShifts: ShiftType[];
  branch: string;
  note?: string;
  createdAt: string;
  isOwn?: boolean;
}

export const STATUS_META: Record<ShiftSwapStatus, { label: string; cls: string }> = {
  open:    { label: "Đang tìm", cls: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-transparent" },
  matched: { label: "Đã khớp",  cls: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-transparent" },
  expired: { label: "Hết hạn",  cls: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border-transparent" },
};

export const SHIFT_TYPE_META: Record<ShiftType, { label: string; color: string }> = {
  morning:   { label: "Ca sáng",  color: "text-amber-600 dark:text-amber-400" },
  afternoon: { label: "Ca chiều", color: "text-blue-600 dark:text-blue-400" },
  evening:   { label: "Ca tối",   color: "text-purple-600 dark:text-purple-400" },
  night:     { label: "Ca đêm",   color: "text-indigo-600 dark:text-indigo-400" },
};

// Đổi ca: chỉ hiển thị ca cách ít nhất 3 ngày (MIN_DAYS_AHEAD)
export const MIN_DAYS_AHEAD = 3;

// Mock data — shift dates are >= today + 3 days (today = 2026-03-23)
export const MOCK_POSTS: ShiftSwapPost[] = [
  {
    id: "1",
    authorName: "Nguyễn Văn An",
    authorPosition: "Nhân viên bán hàng",
    authorDepartment: "Bán hàng",
    isOnline: true,
    myShift: { date: "2026-03-30", timeLabel: "08:00 – 16:00", type: "morning" },
    wantShift: "Ca chiều hoặc ca tối",
    branch: "Chi nhánh Quận 1",
    note: "Có việc gia đình đột xuất buổi sáng chủ nhật",
    status: "open",
    expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    authorName: "Trần Thị Bảo",
    authorPosition: "Nhân viên kho",
    authorDepartment: "Kho vận",
    isOnline: true,
    myShift: { date: "2026-04-01", timeLabel: "14:00 – 22:00", type: "afternoon" },
    wantShift: "Ca sáng bất kỳ",
    branch: "Chi nhánh Quận 3",
    status: "open",
    expiresAt: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    authorName: "Lê Minh Châu",
    authorPosition: "Nhân viên thu ngân",
    authorDepartment: "Thu ngân",
    isOnline: false,
    myShift: { date: "2026-03-28", timeLabel: "22:00 – 06:00", type: "night" },
    wantShift: "Ca sáng hoặc chiều",
    branch: "Chi nhánh Quận 1",
    note: "Cần đổi gấp, ưu tiên người cùng phòng ban",
    status: "matched",
    expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "4",
    authorName: "Phạm Quốc Dũng",
    authorPosition: "Giám sát ca",
    authorDepartment: "Vận hành",
    isOnline: true,
    myShift: { date: "2026-04-05", timeLabel: "06:00 – 14:00", type: "morning" },
    wantShift: "Ca chiều hoặc tối thứ 5",
    branch: "Chi nhánh Quận 7",
    status: "open",
    expiresAt: new Date(Date.now() + 120 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "5",
    authorName: "Hoàng Thị Lan",
    authorPosition: "Nhân viên bán hàng",
    authorDepartment: "Bán hàng",
    isOnline: false,
    myShift: { date: "2026-04-07", timeLabel: "14:00 – 22:00", type: "afternoon" },
    wantShift: "Ca sáng cuối tuần",
    branch: "Chi nhánh Quận 1",
    status: "open",
    expiresAt: new Date(Date.now() + 168 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    isOwn: true,
  },
];

export const MOCK_AVAILABLE: AvailableEmployee[] = [
  {
    id: "a1",
    name: "Nguyễn Thị Mai",
    position: "Nhân viên bán hàng",
    department: "Bán hàng",
    isOnline: true,
    availableDate: "2026-03-30",
    availableShifts: ["morning", "afternoon"],
    branch: "Chi nhánh Quận 1",
    note: "Ưu tiên ca sáng, có thể linh hoạt giờ",
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: "a2",
    name: "Đỗ Văn Khoa",
    position: "Nhân viên kho",
    department: "Kho vận",
    isOnline: true,
    availableDate: "2026-04-01",
    availableShifts: ["afternoon", "evening", "night"],
    branch: "Chi nhánh Quận 3",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "a3",
    name: "Phan Thị Hồng",
    position: "Nhân viên thu ngân",
    department: "Thu ngân",
    isOnline: false,
    availableDate: "2026-04-05",
    availableShifts: ["morning"],
    branch: "Chi nhánh Quận 1",
    note: "Chỉ nhận ca sáng, không làm ca tối",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isOwn: true,
  },
  {
    id: "a4",
    name: "Bùi Thanh Tùng",
    position: "Giám sát ca",
    department: "Vận hành",
    isOnline: true,
    availableDate: "2026-04-07",
    availableShifts: ["morning", "afternoon", "evening"],
    branch: "Chi nhánh Quận 7",
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
];
