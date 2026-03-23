"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Plus, Search, LayoutGrid, TrendingUp, Users } from "lucide-react";
import { SalaryScaleEntry, MOCK_SALARY_SCALE } from "./types";
import SalaryScaleTable from "./SalaryScaleTable";
import SalaryScaleDialog from "./SalaryScaleDialog";
import { cn } from "@/lib/utils";

export default function SalaryScalePage() {
  const [entries, setEntries] = useState<SalaryScaleEntry[]>(MOCK_SALARY_SCALE);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SalaryScaleEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SalaryScaleEntry | null>(null);

  const positions = useMemo(() => [...new Set(entries.map((e) => e.position))], [entries]);

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) =>
          !search ||
          e.position.toLowerCase().includes(search.toLowerCase()) ||
          e.code.toLowerCase().includes(search.toLowerCase())
      ),
    [entries, search]
  );

  const maxSalary = entries.length ? Math.max(...entries.map((e) => e.maxSalary)) : 0;
  const fmtCompact = (n: number) =>
    new Intl.NumberFormat("vi-VN", { notation: "compact", compactDisplay: "short" }).format(n);

  const stats = [
    {
      label: "Tổng chức danh",
      value: positions.length,
      icon: Users,
      cls: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      label: "Tổng mức lương",
      value: entries.length,
      icon: LayoutGrid,
      cls: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Mức cao nhất",
      value: maxSalary ? fmtCompact(maxSalary) : "—",
      icon: TrendingUp,
      cls: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    },
  ];

  const handleSave = (entry: SalaryScaleEntry) => {
    setEntries((prev) => {
      const exists = prev.find((e) => e.id === entry.id);
      return exists ? prev.map((e) => (e.id === entry.id ? entry : e)) : [...prev, entry];
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setEntries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Khung lương theo chức danh
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Cấu hình mức lương tham chiếu cho từng vị trí
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditing(null); setDialogOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#402093] via-[#5e34b7] to-[#8f58e4] rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Thêm mục
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-4"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.cls)}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-neutral-900 dark:text-white">{s.value}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo chức danh hoặc mã..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Table */}
      <SalaryScaleTable
        entries={filtered}
        onEdit={(entry) => { setEditing(entry); setDialogOpen(true); }}
        onDelete={setDeleteTarget}
      />

      {/* Dialog */}
      <SalaryScaleDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null); }}
        onSave={handleSave}
        editing={editing}
        existingPositions={positions}
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
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-white">Xác nhận xóa</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Xóa mức{" "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{deleteTarget.code}</span>{" "}
                  của{" "}
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{deleteTarget.position}</span>?
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
                Xóa
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
