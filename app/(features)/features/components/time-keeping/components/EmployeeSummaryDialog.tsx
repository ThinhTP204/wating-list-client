"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ATTENDANCE_COLORS } from "../page";
import type { Employee, AttendanceStatus, Shift, DayData } from "../page";
import { Clock, DollarSign, Download, MoreVertical, TrendingUp } from "lucide-react";

const HOURLY_RATE = 25_000;
const WORKED_STATUSES: AttendanceStatus[] = ["on-time", "late-early", "business-trip"];

const STATUS_ORDER: AttendanceStatus[] = [
  "on-time", "late-early", "business-trip",
  "paid-leave", "unpaid-leave", "no-checkin", "day-off",
];

function parseMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getWorkedHours(shift: Shift): number {
  if (!WORKED_STATUSES.includes(shift.status)) return 0;
  if (shift.checkIn && shift.checkOut) {
    let mins = parseMinutes(shift.checkOut) - parseMinutes(shift.checkIn);
    if (mins < 0) mins += 1440;
    return mins / 60;
  }
  const [start, end] = shift.time.split(" - ");
  let mins = parseMinutes(end) - parseMinutes(start);
  if (mins < 0) mins += 1440;
  return mins / 60;
}

function formatHM(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  days: DayData[];
}

export default function EmployeeSummaryDialog({ open, onOpenChange, employee, days }: Props) {
  // Aggregate all shifts for the month
  let totalHours = 0;
  let totalShifts = 0;
  const statusMap = new Map<AttendanceStatus, { count: number; hours: number }>();

  Object.values(employee.shifts)
    .flat()
    .forEach((shift) => {
      const h = getWorkedHours(shift);
      totalHours += h;
      totalShifts++;
      const prev = statusMap.get(shift.status) ?? { count: 0, hours: 0 };
      statusMap.set(shift.status, { count: prev.count + 1, hours: prev.hours + h });
    });

  const totalSalary = Math.round(totalHours * HOURLY_RATE);
  const month = days[0]?.month ?? new Date().getMonth() + 1;
  const year  = days[0]?.year  ?? new Date().getFullYear();
  const maxCount = Math.max(...[...statusMap.values()].map((d) => d.count), 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] w-full p-0 overflow-hidden gap-0 max-h-[92vh] flex flex-col">
        <DialogTitle className="sr-only">Thống kê nhân viên</DialogTitle>

        {/* ── Gradient header ── */}
        <div className="bg-gradient-to-br from-[#102854] via-[#1D4D8F] to-[#4C88C6] px-6 pt-6 pb-6 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-inner">
                {employee.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">
                  {employee.name}
                </h2>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="bg-white/20 text-white/90 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                    {employee.role}
                  </span>
                  {employee.phone && (
                    <span className="text-white/60 text-xs">{employee.phone}</span>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-2">
                  25.000đ / giờ · Tháng {month}/{year}
                </p>
              </div>
            </div>
            <button
              className="text-white/40 hover:text-white/80 p-1.5 transition-colors rounded-lg hover:bg-white/10"
              aria-label="Thêm tùy chọn"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Quick stats inline in header */}
          <div className="flex items-center gap-3 mt-5">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2 flex-1">
              <Clock className="w-4 h-4 text-white/70 shrink-0" />
              <div>
                <p className="text-[10px] text-white/50 leading-none">Tổng giờ</p>
                <p className="text-base font-bold text-white leading-tight mt-0.5">{formatHM(totalHours)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2 flex-1">
              <DollarSign className="w-4 h-4 text-white/70 shrink-0" />
              <div>
                <p className="text-[10px] text-white/50 leading-none">Thu nhập</p>
                <p className="text-base font-bold text-white leading-tight mt-0.5">
                  {(totalSalary / 1000).toFixed(0)}k đ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2 flex-1">
              <TrendingUp className="w-4 h-4 text-white/70 shrink-0" />
              <div>
                <p className="text-[10px] text-white/50 leading-none">Số ca</p>
                <p className="text-base font-bold text-white leading-tight mt-0.5">{totalShifts} ca</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-3 gap-3 px-6 py-5 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-800/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-800/40 flex items-center justify-center">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-500 uppercase tracking-wide">
                Giờ làm
              </span>
            </div>
            <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 leading-none">
              {totalHours.toFixed(1)}
            </p>
            <p className="text-xs text-emerald-600/60 mt-1">{formatHM(totalHours)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[#4C88C6]/8 dark:bg-[#4C88C6]/15 rounded-2xl p-4 border border-[#4C88C6]/10 dark:border-[#4C88C6]/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#4C88C6]/10 dark:bg-[#4C88C6]/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-[#4C88C6]" />
              </div>
              <span className="text-[10px] font-bold text-[#4C88C6]/80 uppercase tracking-wide">
                Thu nhập
              </span>
            </div>
            <p className="text-3xl font-bold text-[#4C88C6] leading-none">
              {(totalSalary / 1000).toFixed(0)}
            </p>
            <p className="text-xs text-[#4C88C6]/50 mt-1">nghìn VND</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-800/40 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-500 uppercase tracking-wide">
                Số ca
              </span>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 leading-none">
              {totalShifts}
            </p>
            <p className="text-xs text-blue-600/60 mt-1">ca làm việc</p>
          </motion.div>
        </div>

        {/* ── Status breakdown ── */}
        <div className="px-6 pb-4 flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 bg-gradient-to-b from-[#102854] to-[#4C88C6] rounded-full" />
            <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
              Phân tích chấm công
            </h3>
          </div>

          <div className="rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800/50">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Trạng thái</span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide text-center w-8">Ca</span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide text-center w-14">Giờ</span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide text-right w-16">Lương</span>
            </div>

            {STATUS_ORDER.filter((s) => statusMap.has(s)).map((status, i) => {
              const data = statusMap.get(status)!;
              const c = ATTENDANCE_COLORS[status];
              const pct = Math.round((data.count / maxCount) * 100);
              return (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 + i * 0.05 }}
                  className="border-t border-neutral-100 dark:border-neutral-800"
                >
                  <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-4 pt-3 pb-2 items-center">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0`} />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{c.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white text-center w-8">
                      {data.count}
                    </span>
                    <span className="text-sm text-neutral-500 text-center w-14">
                      {data.hours > 0 ? `${data.hours.toFixed(1)}h` : "—"}
                    </span>
                    <span className="text-sm font-medium text-neutral-900 dark:text-white text-right w-16">
                      {data.hours > 0
                        ? `${((data.hours * HOURLY_RATE) / 1000).toFixed(0)}k`
                        : "—"}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mx-4 mb-2.5 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${c.dot} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.05, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              );
            })}

            {statusMap.size === 0 && (
              <p className="px-4 py-6 text-sm text-neutral-400 text-center">
                Chưa có dữ liệu tháng này
              </p>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-5 border-t border-neutral-100 dark:border-neutral-800 shrink-0 bg-neutral-50/50 dark:bg-neutral-900/30">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">
                Tổng lương Tháng {month}/{year}
              </p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#102854] to-[#4C88C6] bg-clip-text text-transparent leading-none">
                {totalSalary.toLocaleString("vi-VN")}
                <span className="text-base font-normal text-neutral-400 ml-1">đ</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1">
                Tổng thời gian
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {formatHM(totalHours)}
              </p>
            </div>
          </div>

          <div className="flex gap-2.5">
            <Button variant="outline" className="flex-1 h-10 text-sm hover:shadow-sm transition-shadow gap-1.5">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              className="flex-1 h-10 bg-[#4C88C6] hover:bg-[#7a47cc] hover:shadow-md text-white text-sm transition-all"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
