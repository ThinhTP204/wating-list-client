"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { EmployeeSalaryRow, EMPLOYEE_STATUS_META } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SafeImage from "@/components/ui/SafeImage";
import { BanknoteArrowUp, CircleAlert, Clock3 } from "lucide-react";

interface Props {
  employees: EmployeeSalaryRow[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { notation: "compact", compactDisplay: "short" }).format(n);

const fmtFull = (n: number) => new Intl.NumberFormat("vi-VN").format(n);

const COLS = [
  { key: "order", label: "STT", align: "center" },
  { key: "name", label: "Họ và tên", align: "left" },
  { key: "department", label: "Phòng ban", align: "left" },
  { key: "position", label: "Chức vụ", align: "left" },
  { key: "basicSalary", label: "Lương cơ bản", align: "right" },
  { key: "accommodation", label: "Phụ cấp ở trọ", align: "right" },
  { key: "responsibility", label: "Phụ cấp TN", align: "right" },
  { key: "totalBasic", label: "Tổng cơ bản", align: "right" },
  { key: "actualSalary", label: "Thực nhận", align: "right" },
] as const;

const MotionRow = motion(TableRow);

interface PayrollShiftLog {
  date: string;
  shiftLabel: string;
  workedHours: number;
  hasPenalty: boolean;
}

function getBankCodeByDepartment(department: string): string {
  if (department === "Kinh doanh") return "VCB";
  if (department === "Marketing") return "TCB";
  if (department === "Kỹ thuật") return "MB";
  return "ACB";
}

function getAccountNumber(emp: EmployeeSalaryRow): string {
  return `09${String(10000000 + emp.order * 13791).slice(0, 8)}`;
}

function getPenaltyCount(emp: EmployeeSalaryRow): number {
  return emp.status === "hold" ? 3 : emp.status === "pending" ? 1 : 0;
}

function getPenaltyAmount(emp: EmployeeSalaryRow): number {
  if (emp.status === "hold") {
    return Math.round(emp.actualSalary * 0.08);
  }
  if (emp.status === "pending") {
    return Math.round(emp.actualSalary * 0.025);
  }
  return 0;
}

function getWorkedHours(emp: EmployeeSalaryRow): number {
  return 176 + emp.order * 2;
}

function getPlannedHours(emp: EmployeeSalaryRow): number {
  return getWorkedHours(emp) + (emp.status === "hold" ? 8 : 4);
}

function getPayrollShiftLogs(emp: EmployeeSalaryRow): PayrollShiftLog[] {
  const penaltyCount = getPenaltyCount(emp);
  return Array.from({ length: 5 }, (_, idx) => {
    const day = 18 + idx;
    return {
      date: `${String(day).padStart(2, "0")}/03/2026`,
      shiftLabel: idx % 2 === 0 ? "Ca sáng 08:00 - 17:00" : "Ca chiều 14:00 - 22:00",
      workedHours: idx % 2 === 0 ? 8 : 7,
      hasPenalty: idx < penaltyCount,
    };
  });
}

function getStatusBadgeClass(status: EmployeeSalaryRow["status"]): string {
  if (status === "paid") {
    return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400";
  }
  if (status === "pending") {
    return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
  }
  return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
}

export default function SalaryPayrollSheet({ employees }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statusByEmployee, setStatusByEmployee] = useState<
    Partial<Record<string, EmployeeSalaryRow["status"]>>
  >({});
  const [activeEmployee, setActiveEmployee] = useState<EmployeeSalaryRow | null>(null);

  const getEmployeeStatus = (employee: EmployeeSalaryRow): EmployeeSalaryRow["status"] =>
    statusByEmployee[employee.id] ?? employee.status;

  const toggleAll = () =>
    setSelected(
      selected.size === employees.length ? new Set() : new Set(employees.map((e) => e.id))
    );

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const updateEmployeeStatus = (id: string, status: EmployeeSalaryRow["status"]) => {
    setStatusByEmployee((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const totals = employees.reduce(
    (acc, e) => ({
      basicSalary: acc.basicSalary + e.basicSalary,
      accommodation: acc.accommodation + e.accommodation,
      responsibility: acc.responsibility + e.responsibility,
      totalBasic: acc.totalBasic + e.totalBasic,
      actualSalary: acc.actualSalary + e.actualSalary,
    }),
    { basicSalary: 0, accommodation: 0, responsibility: 0, totalBasic: 0, actualSalary: 0 }
  );

  const activeEmployeeStatus = activeEmployee ? getEmployeeStatus(activeEmployee) : null;
  const activePenaltyAmount = activeEmployee ? getPenaltyAmount(activeEmployee) : 0;
  const activePenaltyCount = activeEmployee ? getPenaltyCount(activeEmployee) : 0;
  const activePlannedHours = activeEmployee ? getPlannedHours(activeEmployee) : 0;
  const activeWorkedHours = activeEmployee ? getWorkedHours(activeEmployee) : 0;
  const activeShiftLogs = activeEmployee ? getPayrollShiftLogs(activeEmployee) : [];

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <Table className="min-w-[900px]">
        {/* Header */}
        <TableHeader className="bg-neutral-50 dark:bg-neutral-900/60">
          <TableRow className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
            {/* Checkbox */}
            <TableHead className="w-10 px-3 py-3">
              <input
                type="checkbox"
                checked={selected.size === employees.length && employees.length > 0}
                onChange={toggleAll}
                className="rounded border-neutral-300 accent-blue-600"
              />
            </TableHead>
            {COLS.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "px-4 py-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide whitespace-pre-line leading-tight",
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                      ? "text-center"
                      : "text-left"
                )}
              >
                {col.label}
              </TableHead>
            ))}
            <TableHead className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              Trạng thái
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Summary row */}
          <TableRow className="bg-blue-50/60 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30 hover:bg-blue-50/80 dark:hover:bg-blue-900/20">
            <TableCell
              colSpan={5}
              className="px-3 py-2.5 text-xs font-semibold text-blue-700 dark:text-blue-400 pl-14"
            >
              Tổng cộng ({employees.length} nhân viên)
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-blue-900 dark:text-blue-200">
              {fmtFull(totals.basicSalary)}
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-blue-900 dark:text-blue-200">
              {fmtFull(totals.accommodation)}
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-blue-900 dark:text-blue-200">
              {fmtFull(totals.responsibility)}
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-blue-900 dark:text-blue-200">
              {fmtFull(totals.totalBasic)}
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-blue-900 dark:text-blue-200">
              {fmtFull(totals.actualSalary)}
            </TableCell>
            <TableCell />
          </TableRow>

          {/* Employee rows */}
          {employees.map((emp, i) => {
            const isSelected = selected.has(emp.id);
            const currentStatus = getEmployeeStatus(emp);
            const statusMeta = EMPLOYEE_STATUS_META[currentStatus];
            return (
              <MotionRow
                key={emp.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setActiveEmployee(emp)}
                className={cn(
                  "border-b border-neutral-100 dark:border-neutral-800/60 cursor-pointer",
                  isSelected
                    ? "bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                )}
              >
                <TableCell className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(emp.id)}
                    onClick={(event) => event.stopPropagation()}
                    className="rounded border-neutral-300 accent-blue-600"
                  />
                </TableCell>

                {/* STT */}
                <TableCell className="px-4 py-3 text-center text-neutral-500 dark:text-neutral-400 text-xs font-medium">
                  {emp.order}
                </TableCell>

                {/* Name */}
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] flex items-center justify-center text-white text-xs font-semibold">
                        {emp.name.split(" ").pop()?.charAt(0)}
                      </div>
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-neutral-950",
                          statusMeta.dot
                        )}
                      />
                    </div>
                    <span className="font-medium text-neutral-900 dark:text-white whitespace-nowrap">
                      {emp.name}
                    </span>
                  </div>
                </TableCell>

                {/* Department */}
                <TableCell className="px-4 py-3 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                  {emp.department}
                </TableCell>

                {/* Position */}
                <TableCell className="px-4 py-3 text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                  {emp.position}
                </TableCell>

                {/* Money columns */}
                {(
                  [
                    "basicSalary",
                    "accommodation",
                    "responsibility",
                    "totalBasic",
                    "actualSalary",
                  ] as const
                ).map((k) => (
                  <TableCell
                    key={k}
                    className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-200 font-mono text-xs whitespace-nowrap"
                  >
                    {fmt(emp[k])}
                  </TableCell>
                ))}

                {/* Status badge */}
                <TableCell className="px-4 py-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                      currentStatus === "paid" &&
                        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
                      currentStatus === "pending" &&
                        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
                      currentStatus === "hold" &&
                        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    )}
                  >
                    <span className={cn("w-1.5 h-1.5 rounded-full", statusMeta.dot)} />
                    {statusMeta.label}
                  </span>
                </TableCell>
              </MotionRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Bottom bar */}
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 border-t border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10"
        >
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            Đã chọn {selected.size} nhân viên
          </span>
          <button className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#102854] to-[#4C88C6] rounded-lg hover:shadow-md hover:shadow-blue-500/20 transition-shadow">
            Xuất phiếu lương
          </button>
        </motion.div>
      )}

      <Dialog open={!!activeEmployee} onOpenChange={(open) => !open && setActiveEmployee(null)}>
        <DialogContent className="max-h-[90vh] w-[96vw] max-w-6xl overflow-hidden border-slate-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-950 [&>button]:hidden">
          <DialogTitle className="sr-only">Chi tiết bảng lương nhân viên</DialogTitle>

          {activeEmployee && activeEmployeeStatus && (
            <div className="grid max-h-[90vh] grid-cols-1 overflow-auto md:grid-cols-[320px_1fr]">
              <div className="border-b border-slate-200 bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] p-5 text-white md:border-b-0 md:border-r md:border-slate-300/30">
                <p className="text-xs font-bold uppercase tracking-wider text-white/75">
                  Chuyển khoản nhanh
                </p>
                <p className="mt-1 text-lg font-black leading-tight">{activeEmployee.name}</p>
                <p className="text-xs text-white/75">
                  {activeEmployee.position} · {activeEmployee.department}
                </p>

                <div className="mt-4 rounded-2xl bg-white p-3 shadow-lg">
                  <SafeImage
                    src="/QR.png"
                    alt={`QR chuyen khoan ${activeEmployee.name}`}
                    width={280}
                    height={280}
                    className="h-auto w-full rounded-xl"
                  />
                </div>

                <div className="mt-4 space-y-2 rounded-2xl border border-white/20 bg-white/10 p-3 text-sm">
                  <p className="flex items-center justify-between gap-3">
                    <span className="text-white/75">Ngân hàng</span>
                    <span className="font-semibold">
                      {getBankCodeByDepartment(activeEmployee.department)}
                    </span>
                  </p>
                  <p className="flex items-center justify-between gap-3">
                    <span className="text-white/75">Số tài khoản</span>
                    <span className="font-semibold">{getAccountNumber(activeEmployee)}</span>
                  </p>
                  <p className="flex items-center justify-between gap-3">
                    <span className="text-white/75">Tổng chuyển</span>
                    <span className="text-base font-black">
                      {fmtFull(activeEmployee.actualSalary)}đ
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                      Thống kê công
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                      Bảng lương tháng 03/2026
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                      getStatusBadgeClass(activeEmployeeStatus)
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        EMPLOYEE_STATUS_META[activeEmployeeStatus].dot
                      )}
                    />
                    {EMPLOYEE_STATUS_META[activeEmployeeStatus].label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-neutral-700 dark:bg-neutral-900/60">
                    <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
                      Giờ dự kiến
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                      {activePlannedHours}h
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-neutral-700 dark:bg-neutral-900/60">
                    <p className="text-xs font-semibold text-slate-500 dark:text-neutral-400">
                      Giờ đã làm
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
                      {activeWorkedHours}h
                    </p>
                  </div>
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
                    <p className="text-xs font-semibold text-red-600 dark:text-red-300">
                      Lỗi bị trừ
                    </p>
                    <p className="mt-1 text-lg font-black text-red-700 dark:text-red-200">
                      {activePenaltyCount}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      Thực nhận
                    </p>
                    <p className="mt-1 text-lg font-black text-emerald-700 dark:text-emerald-200">
                      {fmtFull(activeEmployee.actualSalary)}đ
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-neutral-700">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Lịch làm gần đây
                    </p>
                    <div className="mt-3 space-y-2">
                      {activeShiftLogs.map((log) => (
                        <div
                          key={`${log.date}-${log.shiftLabel}`}
                          className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-neutral-700"
                        >
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">
                              {log.shiftLabel}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-neutral-400">
                              {log.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-neutral-400">
                              <Clock3 className="h-3 w-3" />
                              {log.workedHours}h
                            </span>
                            {log.hasPenalty && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                <CircleAlert className="h-3 w-3" />
                                Lỗi
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-neutral-700">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      Tổng hợp lương
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-neutral-400">
                          Tổng lương cơ bản
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {fmtFull(activeEmployee.totalBasic)}đ
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-neutral-400">Tổng trừ lỗi</span>
                        <span className="font-semibold text-red-600 dark:text-red-300">
                          -{fmtFull(activePenaltyAmount)}đ
                        </span>
                      </p>
                      <p className="flex items-center justify-between border-t border-slate-200 pt-2 dark:border-neutral-700">
                        <span className="text-slate-600 dark:text-neutral-300">
                          Lương chuyển khoản
                        </span>
                        <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
                          {fmtFull(activeEmployee.actualSalary)}đ
                        </span>
                      </p>
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                        Cập nhật trạng thái
                      </p>
                      <div className="grid gap-2">
                        {(["paid", "pending", "hold"] as const).map((status) => (
                          <Button
                            key={status}
                            type="button"
                            variant="outline"
                            onClick={() => updateEmployeeStatus(activeEmployee.id, status)}
                            className={cn(
                              "justify-start",
                              activeEmployeeStatus === status &&
                                "border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-950/30 dark:text-brand-300"
                            )}
                          >
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                EMPLOYEE_STATUS_META[status].dot
                              )}
                            />
                            {EMPLOYEE_STATUS_META[status].label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900/60">
                  <p className="text-sm text-slate-600 dark:text-neutral-300">
                    Quản lý có thể quét mã QR ở đây để có thể chuyển khoản nhanh cho nhân viên
                  </p>
                  <Button className="gap-2 bg-gradient-to-r from-[#102854] to-[#4C88C6] text-white">
                    <BanknoteArrowUp className="h-4 w-4" />
                    Xác nhận đã chuyển
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
