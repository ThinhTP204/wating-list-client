"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit2, Trash2, ChevronDown, Inbox } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { SalaryScaleEntry } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  entries: SalaryScaleEntry[];
  onEdit: (entry: SalaryScaleEntry) => void;
  onDelete: (entry: SalaryScaleEntry) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { notation: "compact", compactDisplay: "short" }).format(n);

const MotionRow = motion(TableRow);

export default function SalaryScaleTable({ entries, onEdit, onDelete }: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const groups = entries.reduce<Map<string, SalaryScaleEntry[]>>((acc, e) => {
    if (!acc.has(e.position)) acc.set(e.position, []);
    acc.get(e.position)!.push(e);
    return acc;
  }, new Map());

  const toggle = (pos: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(pos) ? next.delete(pos) : next.add(pos);
      return next;
    });

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center py-20 gap-3"
      >
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <Inbox className="w-7 h-7 text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Chưa có khung lương
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Nhấn "+ Thêm mục" để bắt đầu
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
          <TableRow className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
            {["Mã loại", "Cấp bậc", "Ưu tiên", "Mức lương"].map((col) => (
              <TableHead
                key={col}
                className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
              >
                {col}
              </TableHead>
            ))}
            <TableHead className="px-4 py-3 w-20" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from(groups.entries()).map(([position, rows], gi) => {
            const isCollapsed = collapsed.has(position);
            return (
              <AnimatePresence key={position} initial={false}>
                {/* Group header row */}
                <TableRow className="bg-purple-50/50 dark:bg-purple-900/10 border-y border-neutral-100 dark:border-neutral-800/60 hover:bg-purple-50/70 dark:hover:bg-purple-900/20">
                  <TableCell colSpan={5} className="px-4 py-2.5">
                    <button
                      onClick={() => toggle(position)}
                      className="flex items-center gap-2 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#402093] to-[#8f58e4] flex items-center justify-center shrink-0">
                        <ChevronDown
                          className={cn(
                            "w-3 h-3 text-white transition-transform duration-200",
                            isCollapsed && "-rotate-90"
                          )}
                        />
                      </div>
                      <span className="font-semibold text-sm text-neutral-800 dark:text-white">
                        {position}
                      </span>
                      <span className="text-xs text-neutral-400 dark:text-neutral-500">
                        {rows.length} mức lương
                      </span>
                    </button>
                  </TableCell>
                </TableRow>

                {/* Entry rows */}
                {!isCollapsed &&
                  rows.map((row, ri) => (
                    <MotionRow
                      key={row.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: gi * 0.04 + ri * 0.03 }}
                      onHoverStart={() => setHoveredRow(row.id)}
                      onHoverEnd={() => setHoveredRow(null)}
                      className="border-b border-neutral-100 dark:border-neutral-800/60 hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                    >
                      {/* Code */}
                      <TableCell className="px-4 py-3 pl-12">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                          {row.code}
                        </span>
                      </TableCell>

                      {/* Rank */}
                      <TableCell className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-300">
                        {row.rank}
                      </TableCell>

                      {/* Priority */}
                      <TableCell className="px-4 py-3 text-center text-neutral-600 dark:text-neutral-300">
                        {row.priority}
                      </TableCell>

                      {/* Salary range */}
                      <TableCell className="px-4 py-3 text-center font-medium text-neutral-800 dark:text-white whitespace-nowrap">
                        {fmt(row.minSalary)}
                        <span className="text-neutral-400 dark:text-neutral-500 mx-1.5">–</span>
                        {fmt(row.maxSalary)}
                      </TableCell>

                      {/* Actions — always in DOM, opacity-controlled to prevent row height change */}
                      <TableCell className="px-4 py-3 w-20">
                        <div
                          className={cn(
                            "flex items-center justify-end gap-1 transition-opacity duration-150",
                            hoveredRow === row.id ? "opacity-100" : "opacity-0"
                          )}
                        >
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </MotionRow>
                  ))}
              </AnimatePresence>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
