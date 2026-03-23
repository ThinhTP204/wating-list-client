"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Plus, Search, DollarSign, Users, CheckCircle2, Clock } from "lucide-react";
import { SalaryBoard, MOCK_SALARY_BOARDS } from "./components/types";
import SalaryTable from "./components/SalaryTable";
import SalaryDialog from "./components/SalaryDialog";
import { cn } from "@/lib/utils";

const STATS = (boards: SalaryBoard[]) => [
  {
    label: "Tổng bảng lương",
    value: boards.length,
    icon: DollarSign,
    color: "from-[#402093] to-[#8f58e4]",
    light: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  },
  {
    label: "Đang hoạt động",
    value: boards.filter((b) => b.status === "active").length,
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-500",
    light: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
  },
  {
    label: "Tổng nhân viên",
    value: boards.reduce((s, b) => s + b.employeeCount, 0),
    icon: Users,
    color: "from-blue-500 to-indigo-500",
    light: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    label: "Bản nháp",
    value: boards.filter((b) => b.status === "draft").length,
    icon: Clock,
    color: "from-amber-400 to-orange-500",
    light: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  },
];

export default function Page() {
  const [boards, setBoards] = useState<SalaryBoard[]>(MOCK_SALARY_BOARDS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SalaryBoard | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SalaryBoard | null>(null);

  const filtered = useMemo(
    () =>
      boards.filter((b) => {
        const matchSearch =
          !search ||
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.keyword.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || b.type === typeFilter;
        return matchSearch && matchType;
      }),
    [boards, search, typeFilter]
  );

  const handleSave = (board: SalaryBoard) => {
    setBoards((prev) => {
      const exists = prev.find((b) => b.id === board.id);
      return exists ? prev.map((b) => (b.id === board.id ? board : b)) : [...prev, board];
    });
  };

  const handleEdit = (board: SalaryBoard) => {
    setEditing(board);
    setDialogOpen(true);
  };

  const handleDelete = (board: SalaryBoard) => setDeleteTarget(board);

  const confirmDelete = () => {
    if (deleteTarget) {
      setBoards((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const stats = STATS(boards);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Tiền lương</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Quản lý bảng lương và chi tiết lương nhân viên
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-shadow"
          >
            <Plus className="w-4 h-4" />
            Tạo bảng lương
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-4"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.light)}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-neutral-900 dark:text-white">{s.value}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc từ khóa..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-colors"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-colors min-w-[170px]"
          >
            <option value="all">Tất cả loại</option>
            <option value="gross_to_net">Gross sang Net</option>
            <option value="net_to_gross">Net sang Gross</option>
            <option value="fixed">Lương cố định</option>
          </select>
        </div>

        {/* Table */}
        <SalaryTable boards={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Dialog */}
      <SalaryDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        editing={editing}
      />

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 max-w-sm w-full"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Xác nhận xóa</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Bạn có chắc muốn xóa bảng lương{" "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    {deleteTarget.name}
                  </span>
                  ? Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Xóa bảng lương
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
