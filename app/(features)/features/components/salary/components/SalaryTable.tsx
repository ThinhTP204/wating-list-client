"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit2, Trash2, ChevronLeft, ChevronRight, Inbox, EyeOff, Users } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { SalaryBoard, STATUS_META, SALARY_TYPE_META } from "./types";
import { cn } from "@/lib/utils";

interface SalaryTableProps {
  boards: SalaryBoard[];
  onSelect: (board: SalaryBoard) => void;
  onEdit: (board: SalaryBoard) => void;
  onDelete: (board: SalaryBoard) => void;
}

const ITEMS_PER_PAGE = 10;

const MotionRow = motion(TableRow);

export default function SalaryTable({ boards, onSelect, onEdit, onDelete }: SalaryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const totalPages = Math.ceil(boards.length / ITEMS_PER_PAGE);
  const paginated = boards.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (boards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center py-20 gap-3"
      >
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <Inbox className="w-7 h-7 text-neutral-400 dark:text-neutral-500" />
        </div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Không có dữ liệu</p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">Tạo bảng lương đầu tiên để bắt đầu</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
          <TableRow className="border-b border-neutral-200 dark:border-neutral-800 hover:bg-transparent">
            {["Tên bảng lương", "Phòng ban áp dụng", "Loại bảng lương", "Nhân viên", "Ngày tạo", "Trạng thái"].map(
              (col) => (
                <TableHead
                  key={col}
                  className="px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </TableHead>
              )
            )}
            <TableHead className="px-4 py-3 w-20" />
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
          <AnimatePresence initial={false}>
            {paginated.map((board, i) => {
              const status = STATUS_META[board.status];
              return (
                <MotionRow
                  key={board.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onHoverStart={() => setHoveredRow(board.id)}
                  onHoverEnd={() => setHoveredRow(null)}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40"
                >
                  {/* Name */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#402093] via-[#5e34b7] to-[#8f58e4] flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-bold">₫</span>
                      </div>
                      <div>
                        <button
                          onClick={() => onSelect(board)}
                          className="font-medium text-sm text-neutral-900 dark:text-white leading-tight hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-left"
                        >
                          {board.name}
                        </button>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                            {board.keyword}
                          </span>
                          {board.hiddenFromEmployee && (
                            <EyeOff className="w-3 h-3 text-neutral-400 dark:text-neutral-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Departments */}
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {board.departments.slice(0, 2).map((dept) => (
                        <span
                          key={dept}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                        >
                          {dept}
                        </span>
                      ))}
                      {board.departments.length > 2 && (
                        <span className="text-xs text-neutral-400">+{board.departments.length - 2}</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {SALARY_TYPE_META[board.type].label}
                  </TableCell>

                  {/* Employee count */}
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-300">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      {board.employeeCount} người
                    </div>
                  </TableCell>

                  {/* Created date */}
                  <TableCell className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
                    {new Date(board.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
                        status.bg,
                        status.text
                      )}
                    >
                      {status.label}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 w-20">
                    <div
                      className={cn(
                        "flex items-center justify-end gap-1 transition-opacity duration-150",
                        hoveredRow === board.id ? "opacity-100" : "opacity-0"
                      )}
                    >
                      <button
                        onClick={() => onEdit(board)}
                        className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(board)}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </MotionRow>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-200 dark:border-neutral-800">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Tổng {boards.length} kết quả
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] text-white"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              )}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
