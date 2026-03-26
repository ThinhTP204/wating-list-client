export type ShiftSwapStatus = "open" | "matched" | "expired";
export type ShiftType = "morning" | "afternoon" | "evening" | "night";
export type NotificationType = "match_found" | "shift_accepted" | "shift_expired" | "new_post";

export interface ShiftSwapPost {
  id: string;
  authorName: string;
  authorPosition: string;
  authorDepartment: string;
  isOnline: boolean;
  karma: number;            // 0–100 reliability score
  myShift: {
    date: string;           // "2026-03-30"
    timeLabel: string;      // "08:00 – 16:00"
    type: ShiftType;
  };
  wantShift: string;
  branch: string;
  note?: string;
  status: ShiftSwapStatus;
  expiresAt: string;
  createdAt: string;
  matchScore?: number;      // 0–100 smart-match compatibility %
  isOwn?: boolean;
}

export interface AvailableEmployee {
  id: string;
  name: string;
  position: string;
  department: string;
  isOnline: boolean;
  karma: number;            // 0–100 reliability score
  availableDate: string;    // "2026-03-30"
  availableShifts: ShiftType[];
  branch: string;
  note?: string;
  createdAt: string;
  matchScore?: number;      // 0–100 smart-match compatibility %
  isOwn?: boolean;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Meta maps
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_META: Record<ShiftSwapStatus, { label: string; cls: string }> = {
  open:    { label: "Đang tìm", cls: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  matched: { label: "Đã khớp",  cls: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  expired: { label: "Hết hạn",  cls: "bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-neutral-700" },
};

export const SHIFT_TYPE_META: Record<ShiftType, { label: string; color: string; bg: string }> = {
  morning:   { label: "Ca sáng",  color: "text-amber-700 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
  afternoon: { label: "Ca chiều", color: "text-sky-700 dark:text-sky-400",      bg: "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800" },
  evening:   { label: "Ca tối",   color: "text-violet-700 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800" },
  night:     { label: "Ca đêm",   color: "text-indigo-700 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const MIN_DAYS_AHEAD = 3;

// ─────────────────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_POSTS: ShiftSwapPost[] = [
  {
    id: "1",
    authorName: "Nguyễn Văn An",
    authorPosition: "Nhân viên bán hàng",
    authorDepartment: "Bán hàng",
    isOnline: true,
    karma: 92,
    myShift: { date: "2026-03-30", timeLabel: "08:00 – 16:00", type: "morning" },
    wantShift: "Ca chiều hoặc ca tối",
    branch: "Chi nhánh Quận 1",
    note: "Có việc gia đình đột xuất buổi sáng chủ nhật",
    status: "open",
    matchScore: 88,
    expiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    authorName: "Trần Thị Bảo",
    authorPosition: "Nhân viên kho",
    authorDepartment: "Kho vận",
    isOnline: true,
    karma: 78,
    myShift: { date: "2026-04-01", timeLabel: "14:00 – 22:00", type: "afternoon" },
    wantShift: "Ca sáng bất kỳ",
    branch: "Chi nhánh Quận 3",
    status: "open",
    matchScore: 74,
    expiresAt: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    authorName: "Lê Minh Châu",
    authorPosition: "Nhân viên thu ngân",
    authorDepartment: "Thu ngân",
    isOnline: false,
    karma: 85,
    myShift: { date: "2026-03-28", timeLabel: "22:00 – 06:00", type: "night" },
    wantShift: "Ca sáng hoặc chiều",
    branch: "Chi nhánh Quận 1",
    note: "Cần đổi gấp, ưu tiên người cùng phòng ban",
    status: "matched",
    matchScore: 96,
    expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: "4",
    authorName: "Phạm Quốc Dũng",
    authorPosition: "Giám sát ca",
    authorDepartment: "Vận hành",
    isOnline: true,
    karma: 67,
    myShift: { date: "2026-04-05", timeLabel: "06:00 – 14:00", type: "morning" },
    wantShift: "Ca chiều hoặc tối thứ 5",
    branch: "Chi nhánh Quận 7",
    status: "open",
    matchScore: 61,
    expiresAt: new Date(Date.now() + 120 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "5",
    authorName: "Hoàng Thị Lan",
    authorPosition: "Nhân viên bán hàng",
    authorDepartment: "Bán hàng",
    isOnline: false,
    karma: 90,
    myShift: { date: "2026-04-07", timeLabel: "14:00 – 22:00", type: "afternoon" },
    wantShift: "Ca sáng cuối tuần",
    branch: "Chi nhánh Quận 1",
    status: "open",
    matchScore: 83,
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
    karma: 95,
    availableDate: "2026-03-30",
    availableShifts: ["morning", "afternoon"],
    branch: "Chi nhánh Quận 1",
    note: "Ưu tiên ca sáng, có thể linh hoạt giờ",
    matchScore: 91,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: "a2",
    name: "Đỗ Văn Khoa",
    position: "Nhân viên kho",
    department: "Kho vận",
    isOnline: true,
    karma: 72,
    availableDate: "2026-04-01",
    availableShifts: ["afternoon", "evening", "night"],
    branch: "Chi nhánh Quận 3",
    matchScore: 68,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "a3",
    name: "Phan Thị Hồng",
    position: "Nhân viên thu ngân",
    department: "Thu ngân",
    isOnline: false,
    karma: 88,
    availableDate: "2026-04-05",
    availableShifts: ["morning"],
    branch: "Chi nhánh Quận 1",
    note: "Chỉ nhận ca sáng, không làm ca tối",
    matchScore: 79,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isOwn: true,
  },
  {
    id: "a4",
    name: "Bùi Thanh Tùng",
    position: "Giám sát ca",
    department: "Vận hành",
    isOnline: true,
    karma: 81,
    availableDate: "2026-04-07",
    availableShifts: ["morning", "afternoon", "evening"],
    branch: "Chi nhánh Quận 7",
    matchScore: 77,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "match_found",
    title: "Tìm thấy ứng viên phù hợp!",
    message: "Nguyễn Thị Mai (Karma 95) phù hợp 91% với yêu cầu đổi ca của bạn.",
    read: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "n2",
    type: "new_post",
    title: "Bài đăng mới trên Sàn",
    message: "Trần Thị Bảo vừa đăng yêu cầu đổi ca chiều ngày 01/04.",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "n3",
    type: "shift_accepted",
    title: "Ca đã được chấp nhận",
    message: "Lê Minh Châu đã nhận ca sáng ngày 28/03 của bạn. Hãy xác nhận!",
    read: true,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "n4",
    type: "shift_expired",
    title: "Sắp hết hạn",
    message: "Yêu cầu đổi ca chiều ngày 07/04 của bạn còn 24 giờ trước khi hết hạn.",
    read: true,
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
];
