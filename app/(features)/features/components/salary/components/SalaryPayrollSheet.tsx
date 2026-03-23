"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { EmployeeSalaryRow, EMPLOYEE_STATUS_META } from "./types";
import { cn } from "@/lib/utils";

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

export default function SalaryPayrollSheet({ employees }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
                className="rounded border-neutral-300 accent-purple-600"
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
          <TableRow className="bg-purple-50/60 dark:bg-purple-900/10 border-b border-purple-100 dark:border-purple-900/30 hover:bg-purple-50/80 dark:hover:bg-purple-900/20">
            <TableCell
              colSpan={5}
              className="px-3 py-2.5 text-xs font-semibold text-purple-700 dark:text-purple-400 pl-14"
            >
              Tổng cộng ({employees.length} nhân viên)
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-purple-900 dark:text-purple-200">
              {fmtFull(totals.basicSalary)}
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-purple-900 dark:text-purple-200">
              {fmtFull(totals.accommodation)}
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-purple-900 dark:text-purple-200">
              {fmtFull(totals.responsibility)}
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-purple-900 dark:text-purple-200">
              {fmtFull(totals.totalBasic)}
            </TableCell>
            <TableCell className="px-4 py-2.5 text-right text-xs font-bold text-purple-900 dark:text-purple-200">
              {fmtFull(totals.actualSalary)}
            </TableCell>
            <TableCell />
          </TableRow>

          {/* Employee rows */}
          {employees.map((emp, i) => {
            const isSelected = selected.has(emp.id);
            const statusMeta = EMPLOYEE_STATUS_META[emp.status];
            return (
              <MotionRow
                key={emp.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "border-b border-neutral-100 dark:border-neutral-800/60",
                  isSelected
                    ? "bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-50 dark:hover:bg-purple-900/10"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                )}
              >
                <TableCell className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggle(emp.id)}
                    className="rounded border-neutral-300 accent-purple-600"
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
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] flex items-center justify-center text-white text-xs font-semibold">
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
                      emp.status === "paid" &&
                        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
                      emp.status === "pending" &&
                        "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
                      emp.status === "hold" &&
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
          className="flex items-center justify-between px-4 py-3 border-t border-purple-200 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-900/10"
        >
          <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
            Đã chọn {selected.size} nhân viên
          </span>
          <button className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#402093] to-[#8f58e4] rounded-lg hover:shadow-md hover:shadow-purple-500/20 transition-shadow">
            Xuất phiếu lương
          </button>
        </motion.div>
      )}
    </div>
  );
}
