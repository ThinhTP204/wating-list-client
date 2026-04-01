import type {
  ShiftConfig,
  Shift,
  ShiftStatus,
  EmployeeShiftAttendanceStatus,
  MockEmployee,
  Availability,
  StaffingDemand,
  AIDraftConflict,
  AIGenerateDraftResult,
} from "@/features/shifts/types";

// ── Mock delay ─────────────────────────────────────────────────────────────
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// ── Mock Employees ─────────────────────────────────────────────────────────
let mockEmployees: MockEmployee[] = [
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

// ── Mock ShiftConfigs ──────────────────────────────────────────────────────
let mockShiftConfigs: ShiftConfig[] = [
  {
    id: "cfg-morning",
    name: "Ca sáng",
    startTime: "06:00",
    endTime: "14:00",
    color: "#22c55e",
    isBreak: false,
  },
  {
    id: "cfg-afternoon",
    name: "Ca chiều",
    startTime: "14:00",
    endTime: "22:00",
    color: "#3b82f6",
    isBreak: false,
  },
  {
    id: "cfg-evening",
    name: "Ca tối",
    startTime: "16:00",
    endTime: "24:00",
    color: "#8b5cf6",
    isBreak: false,
  },
  {
    id: "cfg-fullday",
    name: "Ca toàn thời gian",
    startTime: "08:00",
    endTime: "17:00",
    color: "#f59e0b",
    isBreak: true,
  },
];

// ── Generate initial mock shifts ───────────────────────────────────────────
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const EMPLOYEE_ATTENDANCE_STATUSES: EmployeeShiftAttendanceStatus[] = [
  "on_time",
  "late_or_early",
  "edited",
  "missing_checkin",
  "not_started",
  "extra_shift_pending",
  "in_progress",
  "leave_requested",
  "overtime",
  "manager_added",
  "paid_leave",
  "auto_checked",
  "holiday",
];

function getDefaultAttendanceStatus(status: ShiftStatus): EmployeeShiftAttendanceStatus {
  if (status === "absent") {
    return "leave_requested";
  }
  if (status === "draft") {
    return "not_started";
  }
  return "on_time";
}

function generateInitialShifts(): Shift[] {
  const today = new Date();
  const thisMonday = getMonday(today);
  const shifts: Shift[] = [];
  const configs = ["cfg-morning", "cfg-afternoon", "cfg-evening", "cfg-fullday"];
  const statuses: ShiftStatus[] = ["published", "published", "draft", "absent"];

  // Generate mock shifts from 4 weeks prior to 4 weeks ahead
  for (let weekOffset = -4; weekOffset <= 4; weekOffset++) {
    const currentWeekMonday = addDays(thisMonday, weekOffset * 7);

    for (let empIdx = 0; empIdx < mockEmployees.length; empIdx++) {
      const emp = mockEmployees[empIdx];
      // Generate a deterministically random set of working days for each week
      const seed = empIdx * 7 + weekOffset * 13;
      // Increase volume: work 5 to 6 days a week
      const numWorkDays = seed % 2 === 0 ? 6 : 5;
      const daysWorked = [0, 1, 2, 3, 4, 5, 6]
        .filter((_, i) => (seed + i) % 7 !== 0)
        .slice(0, numWorkDays);

      for (const dayOffset of daysWorked) {
        const date = toISODate(addDays(currentWeekMonday, dayOffset));

        // Sometimes employees have 2 shifts in a day (e.g. morning + evening) to test dense layouts
        const numShifts = (seed + dayOffset * 5) % 3 === 0 ? 2 : 1;

        for (let shiftIdx = 0; shiftIdx < numShifts; shiftIdx++) {
          const configId = configs[Math.abs(seed + dayOffset * 3 + shiftIdx * 2) % configs.length];

          let status: ShiftStatus;
          if (weekOffset < 0) {
            status = (seed + dayOffset + shiftIdx) % 15 === 0 ? "absent" : "published";
          } else if (weekOffset === 0) {
            status = statuses[Math.abs(seed + dayOffset + shiftIdx) % statuses.length];
          } else {
            status = "draft";
          }

          shifts.push({
            id: `shift-w${weekOffset}-${emp.id}-${dayOffset}-${shiftIdx}`,
            employeeId: emp.id,
            employeeName: emp.name,
            employeeRole: emp.role,
            configId,
            date,
            status,
            attendanceStatus:
              EMPLOYEE_ATTENDANCE_STATUSES[
                Math.abs(seed + dayOffset * 11 + shiftIdx * 7) % EMPLOYEE_ATTENDANCE_STATUSES.length
              ],
          });
        }
      }
    }
  }

  return shifts;
}

let mockShifts: Shift[] = generateInitialShifts();
let mockAvailability: Availability[] = [];
let mockStaffingDemand: StaffingDemand[] = [];

function getDateRange(startISO: string, endISO: string): string[] {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const dates: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(toISODate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function getOrCreateAvailability(weekStart: string, weekEnd: string): Availability[] {
  const dates = getDateRange(weekStart, weekEnd);
  const defaults: Availability[] = [];

  for (const emp of mockEmployees) {
    for (const date of dates) {
      const existing = mockAvailability.find(
        (item) => item.employeeId === emp.id && item.date === date
      );
      if (existing) {
        defaults.push(existing);
        continue;
      }

      const day = new Date(date).getDay();
      const seed = emp.id.charCodeAt(emp.id.length - 1) + day;
      const status =
        day === 0
          ? seed % 3 === 0
            ? "available"
            : "busy"
          : seed % 4 === 0
            ? "preferred"
            : "available";
      const item: Availability = { employeeId: emp.id, date, status };
      mockAvailability.push(item);
      defaults.push(item);
    }
  }

  return defaults;
}

function getOrCreateStaffingDemand(): StaffingDemand[] {
  if (mockStaffingDemand.length > 0) {
    return [...mockStaffingDemand];
  }

  const demands: StaffingDemand[] = [];
  for (let dayOfWeek = 0; dayOfWeek <= 6; dayOfWeek++) {
    for (const cfg of mockShiftConfigs) {
      const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0;
      const baseMin = cfg.id === "cfg-evening" ? 3 : 2;
      demands.push({
        dayOfWeek,
        shiftConfigId: cfg.id,
        minStaff: baseMin + weekendBoost,
        requiredRole: "Trưởng ca",
      });
    }
  }

  mockStaffingDemand = demands;
  return [...mockStaffingDemand];
}

// ── Employee functions ─────────────────────────────────────────────────────
export async function fetchMockEmployees(): Promise<MockEmployee[]> {
  await delay();
  return [...mockEmployees];
}

export async function fetchAvailability(
  weekStart: string,
  weekEnd: string
): Promise<Availability[]> {
  await delay();
  return getOrCreateAvailability(weekStart, weekEnd).map((item) => ({ ...item }));
}

export async function upsertAvailability(items: Availability[]): Promise<Availability[]> {
  await delay();
  for (const item of items) {
    const idx = mockAvailability.findIndex(
      (current) => current.employeeId === item.employeeId && current.date === item.date
    );
    if (idx >= 0) {
      mockAvailability[idx] = { ...item };
    } else {
      mockAvailability.push({ ...item });
    }
  }
  return items.map((item) => ({ ...item }));
}

export async function fetchStaffingDemand(): Promise<StaffingDemand[]> {
  await delay();
  return getOrCreateStaffingDemand().map((item) => ({ ...item }));
}

export async function upsertStaffingDemand(items: StaffingDemand[]): Promise<StaffingDemand[]> {
  await delay();
  for (const item of items) {
    const idx = mockStaffingDemand.findIndex(
      (current) =>
        current.dayOfWeek === item.dayOfWeek && current.shiftConfigId === item.shiftConfigId
    );
    if (idx >= 0) {
      mockStaffingDemand[idx] = { ...item };
    } else {
      mockStaffingDemand.push({ ...item });
    }
  }
  return items.map((item) => ({ ...item }));
}

// ── ShiftConfig functions ──────────────────────────────────────────────────
export async function fetchShiftConfigs(): Promise<ShiftConfig[]> {
  await delay();
  return [...mockShiftConfigs];
}

export async function createShiftConfig(data: Omit<ShiftConfig, "id">): Promise<ShiftConfig> {
  await delay();
  const newConfig: ShiftConfig = { ...data, id: `cfg-${crypto.randomUUID()}` };
  mockShiftConfigs = [...mockShiftConfigs, newConfig];
  return newConfig;
}

export async function updateShiftConfig(
  id: string,
  data: Partial<Omit<ShiftConfig, "id">>
): Promise<ShiftConfig> {
  await delay();
  mockShiftConfigs = mockShiftConfigs.map((c) => (c.id === id ? { ...c, ...data } : c));
  const updated = mockShiftConfigs.find((c) => c.id === id);
  if (!updated) throw new Error("Không tìm thấy cấu hình ca");
  return { ...updated };
}

export async function deleteShiftConfig(id: string): Promise<void> {
  await delay();
  mockShiftConfigs = mockShiftConfigs.filter((c) => c.id !== id);
}

// ── Shift functions ────────────────────────────────────────────────────────
export interface FetchShiftsParams {
  weekStart: string; // "YYYY-MM-DD" (Monday)
  weekEnd: string; // "YYYY-MM-DD" (Sunday)
}

export async function fetchShifts({ weekStart, weekEnd }: FetchShiftsParams): Promise<Shift[]> {
  await delay();
  return mockShifts.filter((s) => s.date >= weekStart && s.date <= weekEnd).map((s) => ({ ...s }));
}

export async function fetchShiftsByEmployee(
  employeeId: string,
  monthStart: string,
  monthEnd: string
): Promise<Shift[]> {
  await delay();
  return mockShifts
    .filter((s) => s.employeeId === employeeId && s.date >= monthStart && s.date <= monthEnd)
    .map((s) => ({ ...s }));
}

export interface CreateShiftPayload {
  employeeId: string;
  configId: string;
  date: string;
  status: ShiftStatus;
  attendanceStatus?: EmployeeShiftAttendanceStatus;
  note?: string;
}

export async function createShift(payload: CreateShiftPayload): Promise<Shift> {
  await delay();
  const emp = mockEmployees.find((e) => e.id === payload.employeeId);
  if (!emp) throw new Error("Không tìm thấy nhân viên");
  const newShift: Shift = {
    id: `shift-${crypto.randomUUID()}`,
    employeeId: emp.id,
    employeeName: emp.name,
    employeeRole: emp.role,
    configId: payload.configId,
    date: payload.date,
    status: payload.status,
    attendanceStatus: payload.attendanceStatus ?? getDefaultAttendanceStatus(payload.status),
    note: payload.note,
  };
  mockShifts = [...mockShifts, newShift];
  return { ...newShift };
}

export interface UpdateShiftPayload {
  id: string;
  employeeId?: string;
  configId?: string;
  date?: string;
  status?: ShiftStatus;
  attendanceStatus?: EmployeeShiftAttendanceStatus;
  note?: string;
}

export async function updateShift(payload: UpdateShiftPayload): Promise<Shift> {
  await delay();
  const { id, employeeId, ...rest } = payload;
  let empFields: Partial<Pick<Shift, "employeeId" | "employeeName" | "employeeRole">> = {};
  if (employeeId) {
    const emp = mockEmployees.find((e) => e.id === employeeId);
    if (!emp) throw new Error("Không tìm thấy nhân viên");
    empFields = { employeeId: emp.id, employeeName: emp.name, employeeRole: emp.role };
  }
  mockShifts = mockShifts.map((s) => (s.id === id ? { ...s, ...rest, ...empFields } : s));
  const updated = mockShifts.find((s) => s.id === id);
  if (!updated) throw new Error("Không tìm thấy ca làm việc");
  return { ...updated };
}

export async function deleteShift(id: string): Promise<void> {
  await delay();
  mockShifts = mockShifts.filter((s) => s.id !== id);
}

export async function publishShifts(weekStart: string, weekEnd: string): Promise<void> {
  await delay();
  mockShifts = mockShifts.map((s) =>
    s.date >= weekStart && s.date <= weekEnd && s.status === "draft"
      ? { ...s, status: "published" as ShiftStatus }
      : s
  );
}

export async function copyWeekShifts(
  sourceWeekStart: string,
  targetWeekStart: string
): Promise<Shift[]> {
  await delay();
  const sourceEnd = toISODate(addDays(new Date(sourceWeekStart), 6));
  const sourceDayOffset = (d: string) =>
    Math.round((new Date(d).getTime() - new Date(sourceWeekStart).getTime()) / 86400000);

  const sourceShifts = mockShifts.filter(
    (s) => s.date >= sourceWeekStart && s.date <= sourceEnd && s.status !== "absent"
  );

  const copied: Shift[] = sourceShifts.map((s) => {
    const offset = sourceDayOffset(s.date);
    const newDate = toISODate(addDays(new Date(targetWeekStart), offset));
    return {
      ...s,
      id: `shift-${crypto.randomUUID()}`,
      date: newDate,
      status: "draft" as ShiftStatus,
    };
  });

  mockShifts = [...mockShifts, ...copied];
  return copied.map((s) => ({ ...s }));
}

export interface GenerateAIDraftPayload {
  weekStart: string;
  weekEnd: string;
}

export interface ApplyAIDraftPayload {
  weekStart: string;
  weekEnd: string;
  shifts: Shift[];
}

export async function applyAIDraftSchedule({
  weekStart,
  weekEnd,
  shifts,
}: ApplyAIDraftPayload): Promise<Shift[]> {
  await delay(250);

  const existingAiDraftIds = new Set(
    mockShifts
      .filter(
        (shift) =>
          shift.date >= weekStart &&
          shift.date <= weekEnd &&
          shift.status === "draft" &&
          shift.aiMeta?.generated
      )
      .map((shift) => shift.id)
  );

  mockShifts = mockShifts.filter((shift) => !existingAiDraftIds.has(shift.id));

  const normalized = shifts.map((shift) => {
    const employee = mockEmployees.find((item) => item.id === shift.employeeId);
    if (!employee) {
      throw new Error("Khong tim thay nhan vien de luu lich AI");
    }

    const id = shift.id || `shift-ai-${crypto.randomUUID()}`;

    return {
      ...shift,
      id,
      employeeId: employee.id,
      employeeName: employee.name,
      employeeRole: employee.role,
      status: "draft" as ShiftStatus,
      aiMeta: {
        generated: true,
        confidenceScore: shift.aiMeta?.confidenceScore,
        reason: shift.aiMeta?.reason,
      },
    };
  });

  mockShifts = [...mockShifts, ...normalized];
  return normalized.map((shift) => ({ ...shift }));
}

export async function generateAIDraftSchedule({
  weekStart,
  weekEnd,
}: GenerateAIDraftPayload): Promise<AIGenerateDraftResult> {
  await delay(300);

  const availability = getOrCreateAvailability(weekStart, weekEnd);
  const demands = getOrCreateStaffingDemand();
  const dateRange = getDateRange(weekStart, weekEnd);

  const assignedHours = new Map<string, number>();
  const existingShifts = mockShifts.filter(
    (shift) => shift.date >= weekStart && shift.date <= weekEnd && shift.status !== "absent"
  );
  for (const shift of existingShifts) {
    const cfg = mockShiftConfigs.find((item) => item.id === shift.configId);
    if (!cfg) continue;
    const [sh, sm] = cfg.startTime.split(":").map(Number);
    const [eh, em] = cfg.endTime.split(":").map(Number);
    let mins = eh * 60 + em - (sh * 60 + sm);
    if (mins <= 0) mins += 24 * 60;
    assignedHours.set(shift.employeeId, (assignedHours.get(shift.employeeId) ?? 0) + mins / 60);
  }

  const createdShifts: Shift[] = [];
  const conflicts: AIDraftConflict[] = [];

  for (const date of dateRange) {
    const dayOfWeek = new Date(date).getDay();
    const dayDemands = demands.filter((item) => item.dayOfWeek === dayOfWeek);

    for (const demand of dayDemands) {
      const cfg = mockShiftConfigs.find((item) => item.id === demand.shiftConfigId);
      if (!cfg) continue;

      const alreadyAssignedIds = new Set(
        mockShifts
          .filter(
            (shift) =>
              shift.date === date &&
              shift.configId === demand.shiftConfigId &&
              shift.status !== "absent"
          )
          .map((shift) => shift.employeeId)
      );

      const needed = Math.max(0, demand.minStaff - alreadyAssignedIds.size);
      if (needed === 0) continue;

      const candidates = mockEmployees
        .filter((emp) => !alreadyAssignedIds.has(emp.id))
        .map((emp) => {
          const av = availability.find((item) => item.employeeId === emp.id && item.date === date);
          const isAvailable = av?.status === "available" || av?.status === "preferred";
          const isPreferred = av?.status === "preferred";
          const roleMatched = demand.requiredRole ? emp.role === demand.requiredRole : true;
          const hours = assignedHours.get(emp.id) ?? 0;
          return { emp, isAvailable, isPreferred, roleMatched, hours };
        })
        .filter((item) => item.isAvailable)
        .sort((a, b) => {
          if (a.roleMatched !== b.roleMatched) return a.roleMatched ? -1 : 1;
          if (a.isPreferred !== b.isPreferred) return a.isPreferred ? -1 : 1;
          return a.hours - b.hours;
        });

      const picked = candidates.slice(0, needed);

      for (const item of picked) {
        const newShift: Shift = {
          id: `shift-ai-${crypto.randomUUID()}`,
          employeeId: item.emp.id,
          employeeName: item.emp.name,
          employeeRole: item.emp.role,
          configId: demand.shiftConfigId,
          date,
          status: "draft",
          note: `AI: ${item.isPreferred ? "Ưu tiên theo đăng ký" : "Phù hợp lịch rảnh"} và cân bằng giờ tuần`,
          aiMeta: {
            generated: true,
            confidenceScore: item.roleMatched ? 90 : 72,
            reason: `Chọn ${item.emp.name} vì ${item.isPreferred ? "đăng ký ưu tiên" : "đăng ký rảnh"} và hiện có ${(assignedHours.get(item.emp.id) ?? 0).toFixed(1)} giờ trong tuần.`,
          },
        };
        createdShifts.push(newShift);

        const [sh, sm] = cfg.startTime.split(":").map(Number);
        const [eh, em] = cfg.endTime.split(":").map(Number);
        let mins = eh * 60 + em - (sh * 60 + sm);
        if (mins <= 0) mins += 24 * 60;
        assignedHours.set(item.emp.id, (assignedHours.get(item.emp.id) ?? 0) + mins / 60);
      }

      if (picked.length < needed) {
        conflicts.push({
          date,
          shiftConfigId: demand.shiftConfigId,
          required: demand.minStaff,
          assigned: demand.minStaff - needed + picked.length,
          reason: `Khong du nhan vien ranh${demand.requiredRole ? ` co vai tro ${demand.requiredRole}` : ""}.`,
          suggestion:
            "Goi y: dieu phoi nhan su chi nhanh khac, tao thuong OT, hoac cho phep quan ly gan thu cong.",
        });
      }
    }
  }

  return {
    createdShifts: createdShifts.map((item) => ({ ...item })),
    conflicts,
  };
}
