import type { ShiftConfig, Shift, ShiftStatus, MockEmployee } from "@/features/shifts/types";

// ── Mock delay ─────────────────────────────────────────────────────────────
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// ── Mock Employees ─────────────────────────────────────────────────────────
let mockEmployees: MockEmployee[] = [
  { id: "emp-01", name: "Nguyễn Văn Minh", role: "Nhân viên" },
  { id: "emp-02", name: "Trần Thị Lan", role: "Nhân viên" },
  { id: "emp-03", name: "Lê Văn Hùng", role: "Nhân viên" },
  { id: "emp-04", name: "Phạm Thị Mai", role: "Nhân viên" },
  { id: "emp-05", name: "Hoàng Văn Đức", role: "Nhân viên" },
  { id: "emp-06", name: "Võ Thị Hoa", role: "Nhân viên" },
  { id: "emp-07", name: "Đặng Văn Tuân", role: "Nhân viên" },
  { id: "emp-08", name: "Bùi Thị Ngọc", role: "Nhân viên" },
  { id: "emp-09", name: "Ngô Văn Long", role: "Nhân viên" },
  { id: "emp-10", name: "Đỗ Thị Hương", role: "Nhân viên" },
  { id: "emp-11", name: "Trương Văn Khánh", role: "Nhân viên" },
  { id: "emp-12", name: "Lý Thị Thảo", role: "Nhân viên" },
];

// ── Mock ShiftConfigs ──────────────────────────────────────────────────────
let mockShiftConfigs: ShiftConfig[] = [
  { id: "cfg-morning", name: "Ca sáng", startTime: "06:00", endTime: "14:00", color: "#22c55e", isBreak: false },
  { id: "cfg-afternoon", name: "Ca chiều", startTime: "14:00", endTime: "22:00", color: "#3b82f6", isBreak: false },
  { id: "cfg-evening", name: "Ca tối", startTime: "16:00", endTime: "24:00", color: "#8b5cf6", isBreak: false },
  { id: "cfg-fullday", name: "Ca toàn thời gian", startTime: "08:00", endTime: "17:00", color: "#f59e0b", isBreak: true },
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
      const daysWorked = [0, 1, 2, 3, 4, 5, 6].filter((_, i) => (seed + i) % 7 !== 0).slice(0, numWorkDays);

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
            });
        }
      }
    }
  }

  return shifts;
}

let mockShifts: Shift[] = generateInitialShifts();

// ── Employee functions ─────────────────────────────────────────────────────
export async function fetchMockEmployees(): Promise<MockEmployee[]> {
  await delay();
  return [...mockEmployees];
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

export async function updateShiftConfig(id: string, data: Partial<Omit<ShiftConfig, "id">>): Promise<ShiftConfig> {
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
  weekEnd: string;   // "YYYY-MM-DD" (Sunday)
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

export async function copyWeekShifts(sourceWeekStart: string, targetWeekStart: string): Promise<Shift[]> {
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
    return { ...s, id: `shift-${crypto.randomUUID()}`, date: newDate, status: "draft" as ShiftStatus };
  });

  mockShifts = [...mockShifts, ...copied];
  return copied.map((s) => ({ ...s }));
}
