"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, RefreshCw, Download, Edit2, FileText, Lock, ChevronDown,
} from "lucide-react";
import {
  SalaryBoard,
  getMockEmployees,
  MOCK_COLUMNS,
  STATUS_META,
} from "./types";
import SalaryPayrollSheet from "./SalaryPayrollSheet";
import SalaryDetailInfo from "./SalaryDetailInfo";
import { cn } from "@/lib/utils";

interface Props {
  board: SalaryBoard;
  onBack: () => void;
  onEdit: (board: SalaryBoard) => void;
}

type Tab = "sheet" | "detail";

const TABS: { key: Tab; label: string }[] = [
  { key: "sheet",  label: "Bảng lương"  },
  { key: "detail", label: "Chi tiết"    },
];

const formatMonth = (m: string) => {
  const [y, mo] = m.split("-");
  return `Tháng ${mo}/${y}`;
};

export default function SalaryDetail({ board, onBack, onEdit }: Props) {
  const [tab, setTab] = useState<Tab>("sheet");
  const [payslipOn, setPayslipOn] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const employees = getMockEmployees(board.id);
  const status = STATUS_META[board.status];

  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: "spring", duration: 0.38, bounce: 0.1 }}
      className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="p-6 space-y-5">

        {/* ── Top bar ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Back + title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-neutral-900 dark:text-white truncate">
                  {board.name}
                </h1>
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0", status.bg, status.text)}>
                  {status.label}
                </span>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                {formatMonth(board.month)} · {board.keyword}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Tải lại
            </button>

            {/* Import/Export dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Import/Export
                <ChevronDown className={cn("w-3 h-3 transition-transform", exportOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {exportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full mt-1 z-20 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden"
                  >
                    {["Xuất Excel", "Xuất PDF", "Nhập dữ liệu"].map((item) => (
                      <button
                        key={item}
                        onClick={() => setExportOpen(false)}
                        className="w-full text-left px-4 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => onEdit(board)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Chỉnh sửa
            </button>

            {/* Payslip toggle */}
            <button
              onClick={() => setPayslipOn((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all",
                payslipOn
                  ? "bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] text-white shadow-md shadow-purple-500/20"
                  : "border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              {payslipOn ? "Phiếu lương: Bật" : "Phiếu lương"}
            </button>

            {/* Close board */}
            <button
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors",
                board.status === "locked"
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              )}
            >
              <Lock className="w-3.5 h-3.5" />
              {board.status === "locked" ? "Đã đóng" : "Đóng bảng lương"}
            </button>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────── */}
        <div className="flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.key
                  ? "text-purple-700 dark:text-purple-300"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
              )}
            >
              {t.label}
              {tab === t.key && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#402093] to-[#8f58e4] rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ──────────────────────────────── */}
        <AnimatePresence mode="wait">
          {tab === "sheet" ? (
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <SalaryPayrollSheet employees={employees} />
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <SalaryDetailInfo board={board} columns={MOCK_COLUMNS} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
