"use client";

import { motion } from "motion/react";
import { SalaryBoard, SalaryColumn, SALARY_TYPE_META, TIME_CALC_META, STATUS_META } from "./types";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const MotionRow = motion(TableRow);

interface Props {
  board: SalaryBoard;
  columns: SalaryColumn[];
}

const TYPE_BADGE: Record<SalaryColumn["type"], { label: string; cls: string }> = {
  system:  { label: "Hệ thống", cls: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  formula: { label: "Công thức", cls: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" },
  manual:  { label: "Thủ công",  cls: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
};

export default function SalaryDetailInfo({ board, columns }: Props) {
  const formatMonth = (m: string) => {
    const [y, mo] = m.split("-");
    return `Tháng ${mo}/${y}`;
  };

  const infoFields = [
    { label: "Tên bảng lương",         value: board.name },
    { label: "Từ khóa",                 value: board.keyword },
    { label: "Tháng",                   value: formatMonth(board.month) },
    { label: "Ngày tính lương",         value: "Trong tháng này" },
    { label: "Chi nhánh",               value: "Trụ sở chính" },
    { label: "Phòng ban",               value: board.departments.join(", ") },
    { label: "Ngày tạo",                value: new Date(board.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) },
    { label: "Loại bảng lương",         value: SALARY_TYPE_META[board.type].label },
    { label: "Loại thời gian tính",     value: TIME_CALC_META[board.timeCalcType].label },
    { label: "Hình thức trả lương",     value: "Chuyển khoản" },
  ];

  const status = STATUS_META[board.status];

  return (
    <div className="space-y-6">
      {/* Payroll info section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
      >
        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#402093] to-[#8f58e4]" />
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">Thông tin bảng lương</h3>
          </div>
          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", status.bg, status.text)}>
            {status.label}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0 divide-x divide-y divide-neutral-100 dark:divide-neutral-800">
          {infoFields.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="px-5 py-4"
            >
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">{f.label}</p>
              <p className="text-sm font-medium text-neutral-800 dark:text-white leading-snug">{f.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Ẩn với nhân viên */}
        {board.hiddenFromEmployee && (
          <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800 bg-amber-50 dark:bg-amber-900/10">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              Bảng lương này đang bị ẩn với nhân viên
            </p>
          </div>
        )}
      </motion.div>

      {/* Columns config section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
          <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#402093] to-[#8f58e4]" />
          <h3 className="text-sm font-semibold text-neutral-800 dark:text-white">Cấu hình cột</h3>
          <span className="ml-auto text-xs text-neutral-400">{columns.length} cột</span>
        </div>

        <Table>
          <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
            <TableRow className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-transparent">
              {["Cột", "Tên hiển thị", "Từ khóa", "Loại", "Công thức"].map((h) => (
                <TableHead
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {columns.map((col, i) => (
              <MotionRow
                key={col.key}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.04 }}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
              >
                <TableCell className="px-4 py-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#402093] to-[#8f58e4] flex items-center justify-center text-white text-xs font-bold">
                    {col.key}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-neutral-800 dark:text-white">{col.title}</TableCell>
                <TableCell className="px-4 py-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">{col.keyword}</TableCell>
                <TableCell className="px-4 py-3">
                  <span className={cn("inline-flex px-2 py-0.5 rounded-md text-xs font-medium", TYPE_BADGE[col.type].cls)}>
                    {TYPE_BADGE[col.type].label}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 font-mono text-xs text-neutral-400 dark:text-neutral-500">
                  {col.formula ?? "—"}
                </TableCell>
              </MotionRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
